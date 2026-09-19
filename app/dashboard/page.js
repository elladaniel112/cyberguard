"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  collection,
  getDocs,
  orderBy,
  query,
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

  const [scanHistory, setScanHistory] = useState([]);
  const [scanLoading, setScanLoading] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setName(currentUser.displayName || "");

          await loadScanHistory(currentUser.uid);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* LOAD SCAN HISTORY */

  const loadScanHistory = async (userId) => {
    try {
      setScanLoading(true);

      const scansQuery = query(
        collection(db, "scanHistory"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(scansQuery);

      const scans = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      setScanHistory(scans);
    } catch (error) {
      console.error("Error loading scan history:", error);
    } finally {
      setScanLoading(false);
    }
  };

  /* UPDATE PROFILE */

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

      await updateProfile(user, {
        displayName: name.trim(),
      });

      setUser({
        ...user,
        displayName: name.trim(),
      });

      setMessage("Profile updated successfully! 🎉");
    } catch (error) {
      console.error(error);
      setError("Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  /* PASSWORD RESET */

  const handlePasswordReset = async () => {
    setMessage("");
    setError("");

    if (!user?.email) {
      setError("No email address is available for this account.");
      return;
    }

    try {
      setResetting(true);

      await sendPasswordResetEmail(auth, user.email);

      setMessage(
        `Password reset email sent to ${user.email}.`
      );
    } catch (error) {
      console.error(error);
      setError("Unable to send the password reset email.");
    } finally {
      setResetting(false);
    }
  };

  /* LOGOUT */

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /* DATE */

  const getScanDate = (scan) => {
    if (!scan?.createdAt) {
      return "Date unavailable";
    }

    try {
      return scan.createdAt.toDate().toLocaleString();
    } catch {
      return "Date unavailable";
    }
  };

  /* SCORE COLOR */

  const getScoreColor = (score) => {
    if (score >= 80) {
      return "text-green-400";
    }

    if (score >= 50) {
      return "text-yellow-400";
    }

    return "text-red-400";
  };

  /* SCORE MESSAGE */

  const getScoreMessage = (score) => {
    if (score >= 80) {
      return "Good security configuration";
    }

    if (score >= 50) {
      return "Some security improvements are recommended";
    }

    return "Several security improvements are recommended";
  };

  /* LOADING */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-5">
            🛡️
          </div>

          <p className="text-cyan-400">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  /* NOT LOGGED IN */

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-5">
            🔒
          </div>

          <h1 className="text-3xl font-bold mb-4">
            Access Denied
          </h1>

          <p className="text-slate-400 mb-6">
            Please log in to access your dashboard.
          </p>

          <a
            href="/login"
            className="inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition"
          >
            Go to Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-5 py-12">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-2">
              CyberGuard Dashboard
            </p>

            <h1 className="text-4xl md:text-5xl font-bold">
              Welcome,{" "}
              {user.displayName || "User"} 👋
            </h1>

            <p className="text-slate-400 mt-3">
              Manage your account and improve your digital security.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white px-5 py-3 rounded-lg transition"
          >
            Log Out
          </button>
        </div>

        {/* PROFILE */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-7">
            <div className="w-14 h-14 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-2xl">
              👤
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Your Profile
              </h2>

              <p className="text-slate-400 text-sm">
                Update your account information.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleUpdateName}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm mb-2">
                Display Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full max-w-xl px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full max-w-xl px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-400"
              />
            </div>

            {error && (
              <div className="max-w-xl rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="max-w-xl rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-400 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* ACCOUNT STATUS */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatusCard
            icon="👤"
            title="Account"
            value="Active"
          />

          <StatusCard
            icon="🔐"
            title="Authentication"
            value="Email Account"
          />

          <StatusCard
            icon="🛡️"
            title="Security"
            value="Protected"
          />
        </div>

        {/* SCAN STATISTICS */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">
              🌐
            </div>

            <p className="text-slate-400 text-sm">
              Total Scans
            </p>

            <p className="text-4xl font-bold text-cyan-400 mt-2">
              {scanHistory.length}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">
              🛡️
            </div>

            <p className="text-slate-400 text-sm">
              Average Score
            </p>

            <p className="text-4xl font-bold text-green-400 mt-2">
              {scanHistory.length
                ? Math.round(
                    scanHistory.reduce(
                      (total, scan) =>
                        total + (scan.score || 0),
                      0
                    ) / scanHistory.length
                  )
                : 0}
              %
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">
              🔍
            </div>

            <p className="text-slate-400 text-sm">
              Latest Scan
            </p>

            <p className="text-lg font-bold text-cyan-400 mt-2 break-all">
              {scanHistory[0]?.website ||
                "No scans yet"}
            </p>
          </div>

        </div>

        {/* SCAN HISTORY */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-slate-800">

            <div>
              <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">
                Security Activity
              </p>

              <h2 className="text-2xl font-bold mt-1">
                Scan History
              </h2>
            </div>

            <a
              href="/tools"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-5 py-3 rounded-lg transition text-center"
            >
              New Scan →
            </a>

          </div>

          {scanLoading ? (

            <div className="p-10 text-center">
              <div className="text-4xl mb-4">
                🔄
              </div>

              <p className="text-slate-400">
                Loading scan history...
              </p>
            </div>

          ) : scanHistory.length === 0 ? (

            <div className="p-10 text-center">
              <div className="text-5xl mb-5">
                🔍
              </div>

              <h3 className="text-xl font-semibold">
                No scans yet
              </h3>

              <p className="text-slate-400 mt-2 mb-6">
                Run your first website security
                scan to see it here.
              </p>

              <a
                href="/tools"
                className="inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition"
              >
                Start a Security Scan
              </a>
            </div>

          ) : (

            <div className="divide-y divide-slate-800">

              {scanHistory.map((scan) => (

                <button
                  key={scan.id}
                  type="button"
                  onClick={() =>
                    setSelectedScan(scan)
                  }
                  className="w-full text-left p-6 hover:bg-slate-800/60 transition"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div className="flex items-start gap-4">

                      <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-xl shrink-0">
                        🌐
                      </div>

                      <div>

                        <h3 className="font-bold text-lg break-all">
                          {scan.website ||
                            "Unknown website"}
                        </h3>

                        <p className="text-slate-500 text-sm mt-1 break-all">
                          {scan.url}
                        </p>

                        <p className="text-cyan-400 text-xs mt-2">
                          Click to view full report →
                        </p>

                        <p className="text-slate-500 text-xs mt-1">
                          {getScanDate(scan)}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-4">

                      <div className="text-right">

                        <p className="text-slate-500 text-xs uppercase tracking-wider">
                          Security Score
                        </p>

                        <p
                          className={`text-3xl font-bold ${getScoreColor(
                            scan.score || 0
                          )}`}
                        >
                          {scan.score || 0}%
                        </p>

                      </div>

                      <span className="rounded-full bg-green-400/10 border border-green-400/20 text-green-400 px-3 py-1 text-xs font-semibold">
                        Completed
                      </span>

                    </div>

                  </div>

                </button>

              ))}

            </div>

          )}

        </div>

        {/* FULL SCAN REPORT */}

        {selectedScan && (

          <div className="bg-slate-900 border border-cyan-400/20 rounded-2xl p-8 mb-8">

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-8">

              <div>

                <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">
                  Full Security Report
                </p>

                <h2 className="text-3xl font-bold mt-2 break-all">
                  {selectedScan.website ||
                    "Website Scan"}
                </h2>

                <p className="text-slate-500 mt-2 break-all">
                  {selectedScan.url}
                </p>

                <p className="text-slate-500 text-sm mt-2">
                  Scanned:{" "}
                  {getScanDate(selectedScan)}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedScan(null)
                }
                className="border border-slate-700 hover:border-red-400 hover:text-red-400 px-4 py-2 rounded-lg transition"
              >
                Close
              </button>

            </div>

            {/* SCORE CARDS */}

            <div className="grid md:grid-cols-4 gap-4 mb-8">

              <div className="bg-slate-800/60 rounded-xl p-5">
                <p className="text-slate-400 text-sm">
                  Security Score
                </p>

                <p
                  className={`text-4xl font-bold mt-2 ${getScoreColor(
                    selectedScan.score || 0
                  )}`}
                >
                  {selectedScan.score || 0}%
                </p>
              </div>

              <div className="bg-slate-800/60 rounded-xl p-5">
                <p className="text-slate-400 text-sm">
                  Passed Checks
                </p>

                <p className="text-4xl font-bold text-green-400 mt-2">
                  {selectedScan.checks?.filter(
                    (check) => check.passed
                  ).length || 0}
                </p>
              </div>

              <div className="bg-slate-800/60 rounded-xl p-5">
                <p className="text-slate-400 text-sm">
                  Failed Checks
                </p>

                <p className="text-4xl font-bold text-red-400 mt-2">
                  {selectedScan.checks?.filter(
                    (check) => !check.passed
                  ).length || 0}
                </p>
              </div>

              <div className="bg-slate-800/60 rounded-xl p-5">
                <p className="text-slate-400 text-sm">
                  HTTP Status
                </p>

                <p className="text-2xl font-bold text-cyan-400 mt-2">
                  {selectedScan.httpStatus ||
                    "N/A"}
                </p>
              </div>

            </div>

            {/* ASSESSMENT */}

            <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 mb-8">

              <p className="text-slate-500 text-sm">
                Assessment
              </p>

              <p className="text-white font-semibold text-lg mt-2">
                {getScoreMessage(
                  selectedScan.score || 0
                )}
              </p>

              <p className="text-slate-400 text-sm mt-2">
                Protocol:{" "}
                {selectedScan.protocol ||
                  "Not available"}
              </p>

            </div>

            {/* SECURITY CHECKS */}

            <div className="mb-8">

              <h3 className="text-2xl font-bold mb-5">
                🛡️ Security Checks
              </h3>

              {selectedScan.checks?.length ? (

                <div className="space-y-3">

                  {selectedScan.checks.map(
                    (check, index) => (

                      <div
                        key={`${check.name}-${index}`}
                        className={`rounded-xl border p-5 ${
                          check.passed
                            ? "border-green-500/20 bg-green-500/5"
                            : "border-red-500/20 bg-red-500/5"
                        }`}
                      >

                        <div className="flex items-start gap-4">

                          <div className="text-2xl">
                            {check.passed
                              ? "✅"
                              : "⚠️"}
                          </div>

                          <div className="flex-1">

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                              <h4 className="font-semibold">
                                {check.name}
                              </h4>

                              <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                  check.passed
                                    ? "bg-green-400/10 text-green-400"
                                    : "bg-red-400/10 text-red-400"
                                }`}
                              >
                                {check.passed
                                  ? "PASSED"
                                  : "NEEDS ATTENTION"}
                              </span>

                            </div>

                            <p className="text-slate-400 text-sm mt-2">
                              {check.description}
                            </p>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-5">
                  <p className="text-yellow-400 font-semibold">
                    Detailed checks are not available for this older scan.
                  </p>

                  <p className="text-slate-400 text-sm mt-2">
                    Run a new scan to save the detailed security checks.
                  </p>
                </div>

              )}

            </div>

            {/* SECURITY HEADERS */}

            <div className="mb-8">

              <h3 className="text-2xl font-bold mb-5">
                🔐 Security Headers
              </h3>

              {selectedScan.securityHeaders ? (

                <div className="grid md:grid-cols-2 gap-4">

                  <HeaderCard
                    name="Strict-Transport-Security"
                    value={
                      selectedScan
                        .securityHeaders
                        ?.strictTransportSecurity
                    }
                  />

                  <HeaderCard
                    name="Content-Security-Policy"
                    value={
                      selectedScan
                        .securityHeaders
                        ?.contentSecurityPolicy
                    }
                  />

                  <HeaderCard
                    name="X-Frame-Options"
                    value={
                      selectedScan
                        .securityHeaders
                        ?.xFrameOptions
                    }
                  />

                  <HeaderCard
                    name="X-Content-Type-Options"
                    value={
                      selectedScan
                        .securityHeaders
                        ?.xContentTypeOptions
                    }
                  />

                  <HeaderCard
                    name="Referrer-Policy"
                    value={
                      selectedScan
                        .securityHeaders
                        ?.referrerPolicy
                    }
                  />

                  <HeaderCard
                    name="Permissions-Policy"
                    value={
                      selectedScan
                        .securityHeaders
                        ?.permissionsPolicy
                    }
                  />

                </div>

              ) : (

                <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-5">
                  <p className="text-yellow-400 font-semibold">
                    Security header information is not available for this older scan.
                  </p>

                  <p className="text-slate-400 text-sm mt-2">
                    Run a new scan to save the latest header information.
                  </p>
                </div>

              )}

            </div>

            {/* WEBSITE INFORMATION */}

            <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">

              <h3 className="text-xl font-bold mb-5">
                Website Information
              </h3>

              <div className="grid md:grid-cols-2 gap-5">

                <InfoItem
                  label="Website"
                  value={
                    selectedScan.website
                  }
                />

                <InfoItem
                  label="URL"
                  value={
                    selectedScan.url
                  }
                />

                <InfoItem
                  label="Protocol"
                  value={
                    selectedScan.protocol
                  }
                />

                <InfoItem
                  label="HTTP Status"
                  value={
                    selectedScan.httpStatus
                      ? `${selectedScan.httpStatus} ${
                          selectedScan.httpStatusText ||
                          ""
                        }`
                      : "Not available"
                  }
                />

                <InfoItem
                  label="Scan Status"
                  value={
                    selectedScan.status ||
                    "completed"
                  }
                />

                <InfoItem
                  label="Scan ID"
                  value={
                    selectedScan.id
                  }
                />

              </div>

            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">

              <a
                href="/tools"
                className="inline-block text-center bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition"
              >
                Run New Scan →
              </a>

              <button
                type="button"
                onClick={() =>
                  setSelectedScan(null)
                }
                className="border border-slate-700 hover:border-cyan-400 hover:text-cyan-400 font-semibold px-6 py-3 rounded-lg transition"
              >
                Back to Scan History
              </button>

            </div>

          </div>

        )}

        {/* QUICK ACTIONS */}

        <div className="mb-8">

          <h2 className="text-2xl font-bold mb-5">
            Quick Access
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <QuickCard
              href="/tools"
              icon="🛡️"
              title="Security Tools"
              description="Check passwords, IP addresses, and websites."
              linkText="Open Tools →"
            />

            <QuickCard
              href="/blog"
              icon="📝"
              title="Cybersecurity Blog"
              description="Learn about cybersecurity and digital safety."
              linkText="Read Articles →"
            />

            <QuickCard
              href="/contact"
              icon="📩"
              title="Contact CyberGuard"
              description="Send us a message or ask about our services."
              linkText="Contact Us →"
            />

          </div>

        </div>

        {/* PASSWORD SECURITY */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

          <div className="flex items-center gap-4 mb-4">

            <div className="text-3xl">
              🔑
            </div>

            <div>

              <h2 className="text-2xl font-bold">
                Password Security
              </h2>

              <p className="text-slate-400 text-sm">
                Manage your account password.
              </p>

            </div>

          </div>

          <p className="text-slate-400 leading-7 max-w-2xl">
            If you want to change your password,
            CyberGuard can send a secure password
            reset link to your email address.
          </p>

          <button
            onClick={handlePasswordReset}
            disabled={resetting}
            className="mt-6 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
          >
            {resetting
              ? "Sending..."
              : "Send Password Reset Email"}
          </button>

        </div>

        {/* ADMIN ACCESS */}

        {user.uid === ADMIN_UID && (

          <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-2xl p-8 mb-8">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>

                <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">
                  Administrator
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  Admin Control Center
                </h2>

                <p className="text-slate-400 mt-2">
                  You have administrator access to CyberGuard.
                </p>

              </div>

              <a
                href="/admin"
                className="inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition"
              >
                Open Admin →
              </a>

            </div>

          </div>

        )}

        {/* ACCOUNT ID */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-xl font-bold mb-3">
            Account Information
          </h2>

          <p className="text-slate-400 text-sm mb-2">
            Account ID
          </p>

          <p className="text-slate-500 text-sm break-all">
            {user.uid}
          </p>

        </div>

        {/* FOOTER */}

        <div className="mt-10 text-center text-sm text-slate-600">
          CyberGuard • Account Dashboard
        </div>

      </div>
    </main>
  );
}

/* STATUS CARD */

function StatusCard({ icon, title, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="text-3xl mb-4">
        {icon}
      </div>

      <h3 className="text-lg font-semibold mb-2">
        {title}
      </h3>

      <p className="text-green-400">
        {value}
      </p>

    </div>
  );
}

/* QUICK CARD */

function QuickCard({
  href,
  icon,
  title,
  description,
  linkText,
}) {
  return (
    <a
      href={href}
      className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-400 transition"
    >
      <div className="text-3xl mb-4">
        {icon}
      </div>

      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <p className="text-slate-400 mt-2">
        {description}
      </p>

      <span className="inline-block mt-5 text-cyan-400 font-semibold group-hover:text-cyan-300">
        {linkText}
      </span>
    </a>
  );
}

/* INFO ITEM */

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-slate-500 text-sm">
        {label}
      </p>

      <p className="text-white mt-1 break-all">
        {value || "Not available"}
      </p>
    </div>
  );
}

/* HEADER CARD */

function HeaderCard({ name, value }) {
  const exists = Boolean(value);

  return (
    <div
      className={`rounded-xl border p-5 ${
        exists
          ? "border-green-500/20 bg-green-500/5"
          : "border-red-500/20 bg-red-500/5"
      }`}
    >
      <div className="flex items-start gap-3">

        <span className="text-xl">
          {exists ? "✅" : "⚠️"}
        </span>

        <div className="min-w-0">

          <p className="font-semibold break-words">
            {name}
          </p>

          <p
            className={`text-sm mt-2 break-words ${
              exists
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {exists
              ? value
              : "Header not detected"}
          </p>

        </div>

      </div>
    </div>
  );
}