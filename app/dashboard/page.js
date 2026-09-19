"use client";

import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

const ADMIN_UID = "4p7XTqdcQqbr7otfruFMnemLDK43";

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // SCAN HISTORY
  const [scanHistory, setScanHistory] = useState([]);
  const [scanLoading, setScanLoading] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);

  // VPN
  const [vpnConnected, setVpnConnected] = useState(false);
  const [vpnServer, setVpnServer] = useState("Nigeria");
  const [vpnLoading, setVpnLoading] = useState(false);

  // ACTIVITY LOG
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  // ==========================================
  // ACTIVITY LOGGER
  // ==========================================

  const logActivity = async (
    userId,
    action,
    details = ""
  ) => {
    if (!userId) {
      return;
    }

    try {
      await addDoc(collection(db, "activityLogs"), {
        userId,
        action,
        details,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Activity log error:", error);
    }
  };

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setName(currentUser.displayName || "");

          await loadScanHistory(currentUser.uid);
          await loadActivityLogs(currentUser.uid);

          await logActivity(
            currentUser.uid,
            "Dashboard Access",
            "User opened the CyberGuard dashboard."
          );
        } else {
          setUser(null);
          window.location.href = "/login";
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================
  // LOAD SCAN HISTORY
  // ==========================================

  const loadScanHistory = async (userId) => {
    try {
      setScanLoading(true);

      const scansQuery = query(
        collection(db, "scanHistory"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(scansQuery);

      const scans = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setScanHistory(scans);
    } catch (error) {
      console.error(
        "Scan history error:",
        error
      );
    } finally {
      setScanLoading(false);
    }
  };

  // ==========================================
  // LOAD ACTIVITY LOGS
  // ==========================================

  const loadActivityLogs = async (userId) => {
    try {
      setActivityLoading(true);

      const activityQuery = query(
        collection(db, "activityLogs"),
        where("userId", "==", userId)
      );

      const snapshot = await getDocs(activityQuery);

      const logs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      logs.sort((a, b) => {
        const getTime = (item) => {
          if (!item.createdAt) {
            return 0;
          }

          if (item.createdAt.toDate) {
            return item.createdAt.toDate().getTime();
          }

          if (item.createdAt.seconds) {
            return item.createdAt.seconds * 1000;
          }

          return 0;
        };

        return getTime(b) - getTime(a);
      });

      setActivityLogs(logs);
    } catch (error) {
      console.error(
        "Activity history error:",
        error
      );
    } finally {
      setActivityLoading(false);
    }
  };

  // ==========================================
  // UPDATE PROFILE NAME
  // ==========================================

  const handleUpdateName = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError(
          "Your session has expired. Please log in again."
        );
        return;
      }

      const newName = name.trim();

      await updateProfile(currentUser, {
        displayName: newName,
      });

      await currentUser.reload();

      setUser(auth.currentUser);

      await logActivity(
        currentUser.uid,
        "Profile Updated",
        `Display name changed to ${newName}.`
      );

      await loadActivityLogs(currentUser.uid);

      setMessage(
        "Profile updated successfully! 🎉"
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setError(
        error?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // PASSWORD RESET
  // ==========================================

  const handlePasswordReset = async () => {
    setMessage("");
    setError("");

    if (!user?.email) {
      setError(
        "No email address is associated with this account."
      );
      return;
    }

    try {
      setResetting(true);

      await sendPasswordResetEmail(
        auth,
        user.email
      );

      await logActivity(
        user.uid,
        "Password Reset Requested",
        "A password reset email was requested."
      );

      await loadActivityLogs(user.uid);

      setMessage(
        "Password reset email sent! Check your inbox. 📧"
      );
    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      setError(
        "Unable to send password reset email."
      );
    } finally {
      setResetting(false);
    }
  };

  // ==========================================
  // SIGN OUT
  // ==========================================

  const handleLogout = async () => {
    try {
      setError("");
      setMessage("");

      const currentUser = auth.currentUser;

      if (currentUser) {
        await logActivity(
          currentUser.uid,
          "Signed Out",
          "User signed out of CyberGuard."
        );
      }

      await signOut(auth);

      window.location.href = "/login";
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      setError(
        "Unable to sign out. Please try again."
      );
    }
  };

  // ==========================================
  // VPN CONNECT / DISCONNECT
  // ==========================================

  const handleVpnToggle = async () => {
    try {
      setVpnLoading(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      const newConnectionState =
        !vpnConnected;

      setVpnConnected(newConnectionState);

      if (user) {
        await logActivity(
          user.uid,
          newConnectionState
            ? "VPN Connected"
            : "VPN Disconnected",
          newConnectionState
            ? `VPN connection selected: ${vpnServer}.`
            : `VPN connection to ${vpnServer} was disconnected.`
        );

        await loadActivityLogs(user.uid);
      }
    } catch (error) {
      console.error(
        "VPN error:",
        error
      );
    } finally {
      setVpnLoading(false);
    }
  };

  // ==========================================
  // SCAN DATE
  // ==========================================

  const getScanDate = (scan) => {
    if (!scan?.createdAt) {
      return "Unknown date";
    }

    try {
      if (scan.createdAt.toDate) {
        return scan.createdAt
          .toDate()
          .toLocaleString();
      }

      if (scan.createdAt.seconds) {
        return new Date(
          scan.createdAt.seconds * 1000
        ).toLocaleString();
      }

      return new Date(
        scan.createdAt
      ).toLocaleString();
    } catch {
      return "Unknown date";
    }
  };

  // ==========================================
  // ACTIVITY DATE
  // ==========================================

  const getActivityDate = (activity) => {
    if (!activity?.createdAt) {
      return "Just now";
    }

    try {
      if (activity.createdAt.toDate) {
        return activity.createdAt
          .toDate()
          .toLocaleString();
      }

      if (activity.createdAt.seconds) {
        return new Date(
          activity.createdAt.seconds * 1000
        ).toLocaleString();
      }

      return new Date(
        activity.createdAt
      ).toLocaleString();
    } catch {
      return "Unknown date";
    }
  };

  // ==========================================
  // ACTIVITY ICON
  // ==========================================

  const getActivityIcon = (action) => {
    if (!action) {
      return "🛡️";
    }

    if (
      action.includes("Dashboard")
    ) {
      return "📊";
    }

    if (
      action.includes("Profile")
    ) {
      return "👤";
    }

    if (
      action.includes("Password")
    ) {
      return "🔑";
    }

    if (
      action.includes("VPN")
    ) {
      return "🔐";
    }

    if (
      action.includes("Scan")
    ) {
      return "🔎";
    }

    if (
      action.includes("Signed")
    ) {
      return "🚪";
    }

    if (
      action.includes("Login")
    ) {
      return "🔐";
    }

    return "🛡️";
  };

  // ==========================================
  // SCORE COLOR
  // ==========================================

  const getScoreColor = (score) => {
    if (score >= 80) {
      return "text-green-400";
    }

    if (score >= 50) {
      return "text-yellow-400";
    }

    return "text-red-400";
  };

  // ==========================================
  // SCORE MESSAGE
  // ==========================================

  const getScoreMessage = (score) => {
    if (score >= 80) {
      return "Good security configuration";
    }

    if (score >= 50) {
      return "Some security improvements are recommended";
    }

    return "Several security improvements are recommended";
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        <div className="text-center">

          <div className="text-5xl mb-4 animate-pulse">
            🛡️
          </div>

          <p className="text-slate-400">
            Loading your dashboard...
          </p>

        </div>

      </main>
    );
  }

  if (!user) {
    return null;
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-950/95">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <span className="text-3xl">
                🛡️
              </span>

              <div>

                <h1 className="text-2xl font-bold">
                  CyberGuard
                </h1>

                <p className="text-xs text-slate-500">
                  Security Dashboard
                </p>

              </div>

            </div>

          </div>

          <div className="flex flex-wrap items-center gap-3">

            <a
              href="/"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400"
            >
              Home
            </a>

            <a
              href="/tools"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400"
            >
              Security Tools
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
            >
              🚪 Sign Out
            </button>

          </div>

        </div>

      </header>

      {/* MAIN */}
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* WELCOME */}
        <section className="mb-8">

          <p className="text-sm text-cyan-400">
            Welcome back
          </p>

          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            {user.displayName ||
              "CyberGuard User"}{" "}
            👋
          </h2>

          <p className="mt-3 text-slate-400">
            Manage your account, monitor security
            scans, and protect your digital
            environment.
          </p>

        </section>

        {/* MESSAGES */}
        {message && (
          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* ACCOUNT OVERVIEW */}
        <section className="grid gap-5 md:grid-cols-3">

          <StatusCard
            icon="👤"
            title="Account"
            value="Active"
            description="Your account is active"
          />

          <StatusCard
            icon="🔐"
            title="Authentication"
            value="Protected"
            description="Firebase Authentication"
          />

          <StatusCard
            icon="🛡️"
            title="Security Scans"
            value={scanHistory.length}
            description="Saved website scans"
          />

        </section>

        {/* PROFILE */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

          <HeaderCard
            icon="👤"
            title="Profile"
            description="Update the name displayed on your CyberGuard account."
          />

          <form
            onSubmit={handleUpdateName}
            className="mt-6"
          >

            <div className="grid gap-4 md:grid-cols-[1fr_auto]">

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Your full name"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
              />

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Update Name"}
              </button>

            </div>

          </form>

        </section>

        {/* VPN */}
        <section className="mt-8">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div>

                <div className="mb-2 flex items-center gap-3">

                  <span className="text-3xl">
                    🔐
                  </span>

                  <h2 className="text-2xl font-bold">
                    Secure VPN
                  </h2>

                </div>

                <p className="max-w-xl text-sm text-slate-400">
                  Manage your CyberGuard VPN
                  connection, select a server
                  location, and view your
                  connection status.
                </p>

              </div>

              <div
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  vpnConnected
                    ? "bg-green-500/10 text-green-400"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {vpnConnected
                  ? "● VPN Connected"
                  : "● VPN Disconnected"}
              </div>

            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              {/* SERVER */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  VPN Server
                </label>

                <select
                  value={vpnServer}
                  onChange={(e) =>
                    setVpnServer(
                      e.target.value
                    )
                  }
                  disabled={vpnConnected}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500 disabled:opacity-50"
                >

                  <option value="Nigeria">
                    🇳🇬 Nigeria
                  </option>

                  <option value="United Kingdom">
                    🇬🇧 United Kingdom
                  </option>

                  <option value="United States">
                    🇺🇸 United States
                  </option>

                  <option value="Germany">
                    🇩🇪 Germany
                  </option>

                  <option value="Canada">
                    🇨🇦 Canada
                  </option>

                </select>

              </div>

              {/* CONNECTION */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Connection
                </label>

                <div className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-300">
                  {vpnConnected
                    ? `Connected to ${vpnServer}`
                    : "No active VPN connection"}
                </div>

              </div>

            </div>

            {/* VPN BUTTON */}
            <div className="mt-6">

              <button
                onClick={handleVpnToggle}
                disabled={vpnLoading}
                className={`w-full rounded-lg px-6 py-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  vpnConnected
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                }`}
              >
                {vpnLoading
                  ? "Connecting..."
                  : vpnConnected
                  ? "Disconnect VPN"
                  : "Connect VPN"}
              </button>

            </div>

            {/* VPN DETAILS */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                <p className="text-xs text-slate-500">
                  Server
                </p>

                <p className="mt-1 font-semibold text-white">
                  {vpnServer}
                </p>

              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                <p className="text-xs text-slate-500">
                  Encryption
                </p>

                <p className="mt-1 font-semibold text-cyan-400">
                  Protected
                </p>

              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                <p className="text-xs text-slate-500">
                  Connection
                </p>

                <p
                  className={`mt-1 font-semibold ${
                    vpnConnected
                      ? "text-green-400"
                      : "text-slate-400"
                  }`}
                >
                  {vpnConnected
                    ? "Secure"
                    : "Not connected"}
                </p>

              </div>

            </div>

            <p className="mt-5 text-xs text-slate-500">
              Dashboard VPN interface. An actual
              VPN tunnel requires a configured VPN
              server and client.
            </p>

          </div>

        </section>

        {/* SCAN HISTORY */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

          <HeaderCard
            icon="🔎"
            title="Website Scan History"
            description="Your previous CyberGuard security scans."
          />

          {scanLoading ? (

            <div className="mt-8 text-center text-slate-400">
              Loading scan history...
            </div>

          ) : scanHistory.length === 0 ? (

            <div className="mt-8 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">

              <div className="text-4xl">
                🔍
              </div>

              <h3 className="mt-3 font-semibold">
                No scans yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Run your first website security
                scan to see it here.
              </p>

              <a
                href="/tools"
                className="mt-5 inline-block rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Open Security Scanner
              </a>

            </div>

          ) : (

            <div className="mt-6 space-y-4">

              {scanHistory.map((scan) => (

                <button
                  key={scan.id}
                  onClick={() =>
                    setSelectedScan(scan)
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-5 text-left transition hover:border-cyan-500/50"
                >

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="min-w-0">

                      <p className="truncate font-semibold text-white">
                        {scan.target?.hostname ||
                          scan.hostname ||
                          "Unknown website"}
                      </p>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {scan.target?.url ||
                          scan.url ||
                          "No URL available"}
                      </p>

                      <p className="mt-2 text-xs text-slate-600">
                        {getScanDate(scan)}
                      </p>

                    </div>

                    <div className="flex items-center gap-4">

                      <div className="text-right">

                        <p
                          className={`text-2xl font-bold ${getScoreColor(
                            scan.score || 0
                          )}`}
                        >
                          {scan.score || 0}%
                        </p>

                        <p className="text-xs text-slate-500">
                          Security Score
                        </p>

                      </div>

                      <span className="text-slate-500">
                        →
                      </span>

                    </div>

                  </div>

                </button>

              ))}

            </div>

          )}

        </section>

        {/* SELECTED SCAN REPORT */}
        {selectedScan && (

          <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 shadow-xl">

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

              <div>

                <p className="text-sm text-cyan-400">
                  Security Report
                </p>

                <h2 className="mt-1 break-all text-2xl font-bold">
                  {selectedScan.target?.hostname ||
                    selectedScan.hostname ||
                    "Website Scan"}
                </h2>

                <p className="mt-2 break-all text-sm text-slate-500">
                  {selectedScan.target?.url ||
                    selectedScan.url ||
                    "No URL available"}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedScan(null)
                }
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-red-500 hover:text-red-400"
              >
                Close Report
              </button>

            </div>

            {/* SCORE */}
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-6">

              <div className="flex flex-col items-center justify-center text-center">

                <p className="text-sm text-slate-500">
                  Security Score
                </p>

                <p
                  className={`mt-2 text-6xl font-bold ${getScoreColor(
                    selectedScan.score || 0
                  )}`}
                >
                  {selectedScan.score || 0}%
                </p>

                <p className="mt-2 text-slate-400">
                  {getScoreMessage(
                    selectedScan.score || 0
                  )}
                </p>

              </div>

            </div>

            {/* SECURITY CHECKS */}
            <div className="mt-6">

              <h3 className="text-xl font-bold">
                Security Checks
              </h3>

              {selectedScan.checks &&
              selectedScan.checks.length > 0 ? (

                <div className="mt-4 grid gap-4 md:grid-cols-2">

                  {selectedScan.checks.map(
                    (check, index) => (

                      <div
                        key={index}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                      >

                        <div className="flex items-start gap-3">

                          <span className="text-xl">
                            {check.passed
                              ? "✅"
                              : "❌"}
                          </span>

                          <div>

                            <h4 className="font-semibold">
                              {check.name}
                            </h4>

                            <p className="mt-1 text-sm text-slate-500">
                              {check.description}
                            </p>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="mt-4 rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">
                  Detailed security checks were
                  not saved for this scan.
                </div>

              )}

            </div>

            {/* SECURITY HEADERS */}
            <div className="mt-8">

              <h3 className="text-xl font-bold">
                Security Headers
              </h3>

              {selectedScan.securityHeaders ? (

                <div className="mt-4 space-y-3">

                  {Object.entries(
                    selectedScan.securityHeaders
                  ).map(([key, value]) => (

                    <div
                      key={key}
                      className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950 p-4 md:flex-row md:items-center md:justify-between"
                    >

                      <span className="font-medium text-slate-300">

                        {key
                          .replace(
                            /([A-Z])/g,
                            " $1"
                          )
                          .replace(
                            /^./,
                            (letter) =>
                              letter.toUpperCase()
                          )}

                      </span>

                      <span
                        className={`break-all text-sm ${
                          value
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {value ||
                          "Not detected"}
                      </span>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="mt-4 rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">
                  Security header information
                  was not saved for this scan.
                </div>

              )}

            </div>

            {/* WEBSITE INFORMATION */}
            <div className="mt-8">

              <h3 className="text-xl font-bold">
                Website Information
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-3">

                <InfoItem
                  title="Protocol"
                  value={
                    selectedScan.protocol ||
                    selectedScan.target?.protocol ||
                    "Unknown"
                  }
                />

                <InfoItem
                  title="HTTP Status"
                  value={
                    selectedScan.httpStatus
                      ? `${selectedScan.httpStatus} ${
                          selectedScan.httpStatusText ||
                          ""
                        }`
                      : selectedScan.response?.status
                      ? `${selectedScan.response.status} ${
                          selectedScan.response.statusText ||
                          ""
                        }`
                      : "Unknown"
                  }
                />

                <InfoItem
                  title="Scanned"
                  value={getScanDate(
                    selectedScan
                  )}
                />

              </div>

            </div>

          </section>

        )}

        {/* ACTIVITY LOG */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

          <HeaderCard
            icon="📋"
            title="Security Activity"
            description="Recent security activity on your CyberGuard account."
          />

          {activityLoading ? (

            <div className="mt-8 text-center text-slate-400">
              Loading activity...
            </div>

          ) : activityLogs.length === 0 ? (

            <div className="mt-8 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">

              <div className="text-4xl">
                🛡️
              </div>

              <h3 className="mt-3 font-semibold">
                No activity yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Your CyberGuard security activity
                will appear here.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-3">

              {activityLogs
                .slice(0, 10)
                .map((activity) => (

                  <div
                    key={activity.id}
                    className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-xl">
                      {getActivityIcon(
                        activity.action
                      )}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">

                        <p className="font-semibold text-slate-200">
                          {activity.action}
                        </p>

                        <p className="text-xs text-slate-600">
                          {getActivityDate(
                            activity
                          )}
                        </p>

                      </div>

                      {activity.details && (
                        <p className="mt-1 text-sm text-slate-500">
                          {activity.details}
                        </p>
                      )}

                    </div>

                  </div>

                ))}

            </div>

          )}

        </section>

        {/* QUICK ACCESS */}
        <section className="mt-8">

          <h2 className="text-2xl font-bold">
            Quick Access
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">

            <QuickCard
              icon="🔍"
              title="Security Scanner"
              description="Scan websites for important security headers."
              href="/tools"
            />

            <QuickCard
              icon="📝"
              title="CyberGuard Blog"
              description="Learn about cybersecurity and online safety."
              href="/blog"
            />

            <QuickCard
              icon="💬"
              title="Contact Support"
              description="Send a message to the CyberGuard team."
              href="/contact"
            />

          </div>

        </section>

        {/* PASSWORD SECURITY */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

          <HeaderCard
            icon="🔑"
            title="Password Security"
            description="Keep your CyberGuard account protected."
          />

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="font-semibold">
                Reset your password
              </p>

              <p className="mt-1 text-sm text-slate-500">
                We'll send a secure password
                reset link to your email address.
              </p>

            </div>

            <button
              onClick={handlePasswordReset}
              disabled={resetting}
              className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 font-semibold text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50"
            >
              {resetting
                ? "Sending..."
                : "Reset Password"}
            </button>

          </div>

        </section>

        {/* ADMIN */}
        {user.uid === ADMIN_UID && (

          <section className="mt-8 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="text-sm text-purple-400">
                  Administrator
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Admin Dashboard
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  You have administrator access
                  to CyberGuard.
                </p>

              </div>

              <a
                href="/admin"
                className="rounded-lg bg-purple-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-purple-400"
              >
                Open Admin Panel
              </a>

            </div>

          </section>

        )}

        {/* ACCOUNT INFORMATION */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

          <HeaderCard
            icon="ℹ️"
            title="Account Information"
            description="Your CyberGuard account details."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <InfoItem
              title="Name"
              value={
                user.displayName ||
                "Not set"
              }
            />

            <InfoItem
              title="Email"
              value={
                user.email ||
                "Not available"
              }
            />

            <InfoItem
              title="Account ID"
              value={user.uid}
            />

            <InfoItem
              title="Authentication"
              value="Firebase Authentication"
            />

          </div>

        </section>

        {/* FOOTER */}
        <footer className="mt-12 border-t border-slate-800 py-8 text-center">

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} CyberGuard.
            All rights reserved.
          </p>

          <p className="mt-2 text-xs text-slate-600">
            Stay secure. Stay protected. 🛡️
          </p>

        </footer>

      </div>

    </main>
  );
}


/* ==========================================
   STATUS CARD
========================================== */

function StatusCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>

        </div>

        <span className="text-3xl">
          {icon}
        </span>

      </div>

    </div>
  );
}


/* ==========================================
   QUICK CARD
========================================== */

function QuickCard({
  icon,
  title,
  description,
  href,
}) {
  return (
    <a
      href={href}
      className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl transition hover:-translate-y-1 hover:border-cyan-500/50"
    >

      <div className="text-3xl">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-bold group-hover:text-cyan-400">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-5 text-sm font-semibold text-cyan-400">
        Open →
      </div>

    </a>
  );
}


/* ==========================================
   INFO ITEM
========================================== */

function InfoItem({
  title,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

      <p className="text-xs text-slate-500">
        {title}
      </p>

      <p className="mt-2 break-all font-medium text-slate-200">
        {value}
      </p>

    </div>
  );
}


/* ==========================================
   HEADER CARD
========================================== */

function HeaderCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-4">

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl">
        {icon}
      </div>

      <div>

        <h2 className="text-xl font-bold">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}