"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function ToolsPage() {
  const [user, setUser] = useState(null);

  const [password, setPassword] = useState("");

  const [ip, setIp] = useState("");
  const [ipInfo, setIpInfo] = useState(null);
  const [ipLoading, setIpLoading] = useState(false);
  const [ipError, setIpError] = useState("");

  const [website, setWebsite] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scanSaved, setScanSaved] = useState("");

  const [securityChecks, setSecurityChecks] = useState([
    {
      id: 1,
      text: "I use strong, unique passwords",
      checked: false,
    },
    {
      id: 2,
      text: "I have enabled two-factor authentication",
      checked: false,
    },
    {
      id: 3,
      text: "My software and apps are regularly updated",
      checked: false,
    },
    {
      id: 4,
      text: "I have security protection on my device",
      checked: false,
    },
    {
      id: 5,
      text: "My important files are backed up",
      checked: false,
    },
    {
      id: 6,
      text: "I know how to identify phishing messages",
      checked: false,
    },
  ]);

  /* AUTHENTICATION */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsubscribe();
  }, []);

  /* PASSWORD CHECKER */

  const getStrength = () => {
    if (!password) {
      return {
        label: "Enter a password",
        score: 0,
        message:
          "Type a password to check its strength.",
      };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        label: "Weak",
        score,
        message:
          "Try using a longer password with numbers and symbols.",
      };
    }

    if (score <= 4) {
      return {
        label: "Medium",
        score,
        message:
          "Your password is okay, but it could be stronger.",
      };
    }

    return {
      label: "Strong",
      score,
      message:
        "Good! This password has several strong characteristics.",
    };
  };

  const strength = getStrength();

  /* IP CHECKER */

  const checkIP = async () => {
    if (!ip.trim()) {
      setIpError("Please enter an IP address.");
      return;
    }

    setIpLoading(true);
    setIpError("");
    setIpInfo(null);

    try {
      const response = await axios.get(
        `https://ipwho.is/${encodeURIComponent(
          ip.trim()
        )}`
      );

      if (!response.data.success) {
        setIpError(
          response.data.message ||
            "Unable to find information."
        );
        return;
      }

      setIpInfo(response.data);
    } catch (error) {
      console.error("IP checker error:", error);

      setIpError(
        "Unable to check this IP address. Please try again."
      );
    } finally {
      setIpLoading(false);
    }
  };

  /* WEBSITE SECURITY SCANNER */

  const scanWebsite = async () => {
    if (!website.trim()) {
      setScanError(
        "Please enter a website URL."
      );
      return;
    }

    setScanLoading(true);
    setScanError("");
    setScanSaved("");
    setScanResult(null);

    try {
      const response = await axios.post(
        "/api/scanner",
        {
          url: website.trim(),
        }
      );

      const result = response.data;

      setScanResult(result);

      /*
       * Save scan history only when
       * the user is logged in.
       */

      if (user && result.success) {
        try {
          await addDoc(
            collection(db, "scanHistory"),
            {
              userId: user.uid,
              userEmail: user.email || "",
              website: result.target?.hostname || "",
              url: result.target?.url || website.trim(),
              score: result.score || 0,
              status: "completed",
              createdAt: serverTimestamp(),
            }
          );

          setScanSaved(
            "Scan saved to your account history. ✅"
          );
        } catch (saveError) {
          console.error(
            "Error saving scan history:",
            saveError
          );

          setScanSaved(
            "Scan completed, but the history could not be saved."
          );
        }
      }
    } catch (error) {
      console.error(
        "Website scanner error:",
        error
      );

      const message =
        error.response?.data?.error ||
        "Unable to scan this website. Please try again.";

      setScanError(message);
    } finally {
      setScanLoading(false);
    }
  };

  /* SECURITY CHECKLIST */

  const toggleSecurityCheck = (id) => {
    setSecurityChecks((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              checked: !item.checked,
            }
          : item
      )
    );
  };

  const securityScore = Math.round(
    (securityChecks.filter(
      (item) => item.checked
    ).length /
      securityChecks.length) *
      100
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-20">

      <div className="max-w-5xl mx-auto">

        {/* PAGE HEADER */}

        <div className="text-center mb-12">

          <p className="text-cyan-400 font-semibold mb-3">
            CYBERGUARD TOOLS
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mb-5">
            Security Tools
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto">
            Simple cybersecurity tools to help you
            understand and improve your digital security.
          </p>

          {!user && (
            <p className="text-slate-500 text-sm mt-4">
              Log in to save your website scan history.
            </p>
          )}

          {user && (
            <p className="text-green-400 text-sm mt-4">
              🔐 Logged in as {user.email}
            </p>
          )}

        </div>

        {/* WEBSITE SECURITY SCANNER */}

        <section className="bg-slate-900 border border-cyan-400/30 rounded-2xl p-8 mb-10 shadow-xl">

          <div className="flex items-center gap-4 mb-3">

            <div className="text-4xl">
              🌐
            </div>

            <div>

              <h2 className="text-2xl font-bold">
                Website Security Scanner
              </h2>

              <p className="text-slate-400">
                Check basic security protections on a website.
              </p>

            </div>

          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">

            <input
              type="text"
              value={website}
              onChange={(e) =>
                setWebsite(e.target.value)
              }
              placeholder="https://example.com"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-4 outline-none focus:border-cyan-400 transition"
            />

            <button
              onClick={scanWebsite}
              disabled={scanLoading}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-7 py-4 rounded-lg transition disabled:opacity-50"
            >
              {scanLoading
                ? "Scanning..."
                : "Scan Website"}
            </button>

          </div>

          <p className="text-slate-500 text-xs mt-4">
            Only scan websites you own or have permission
            to assess.
          </p>

          {scanError && (
            <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-400">
                {scanError}
              </p>
            </div>
          )}

          {scanSaved && (
            <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <p className="text-green-400">
                {scanSaved}
              </p>
            </div>
          )}

          {scanResult && (
            <div className="mt-8">

              {/* SCORE */}

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                  <div>

                    <p className="text-slate-500 text-sm">
                      Security Score
                    </p>

                    <p className="text-5xl font-bold text-cyan-400 mt-2">
                      {scanResult.score}%
                    </p>

                    <p className="text-slate-400 mt-2 break-all">
                      {scanResult.target?.hostname}
                    </p>

                  </div>

                  <div className="w-32 h-32 rounded-full border-8 border-cyan-400/20 flex items-center justify-center">

                    <span className="text-2xl font-bold">
                      {scanResult.score}%
                    </span>

                  </div>

                </div>

              </div>

              {/* BASIC INFORMATION */}

              <div className="grid sm:grid-cols-3 gap-4 mb-6">

                <InfoCard
                  title="Protocol"
                  value={
                    scanResult.target?.protocol
                  }
                />

                <InfoCard
                  title="HTTP Status"
                  value={`${scanResult.response?.status} ${
                    scanResult.response?.statusText ||
                    ""
                  }`}
                />

                <InfoCard
                  title="Host"
                  value={
                    scanResult.target?.hostname
                  }
                />

              </div>

              {/* SECURITY CHECKS */}

              <div>

                <h3 className="text-xl font-bold mb-4">
                  Security Checks
                </h3>

                <div className="space-y-3">

                  {scanResult.checks?.map(
                    (check) => (
                      <div
                        key={check.name}
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

                          <div>

                            <h4 className="font-semibold">
                              {check.name}
                            </h4>

                            <p className="text-slate-400 text-sm mt-1">
                              {check.description}
                            </p>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>
          )}

        </section>

        {/* PASSWORD STRENGTH */}

        <section className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-10">

          <h2 className="text-2xl font-bold mb-2">
            🔐 Password Strength Checker
          </h2>

          <p className="text-slate-400 mb-6">
            Check basic password strength characteristics.
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter a test password..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-4 outline-none focus:border-cyan-400 transition"
          />

          <div className="mt-6">

            <div className="flex justify-between mb-3">

              <span className="text-slate-400">
                Strength
              </span>

              <span className="font-bold">
                {strength.label}
              </span>

            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{
                  width: `${
                    (strength.score / 6) *
                    100
                  }%`,
                }}
              />

            </div>

            <p className="text-slate-400 mt-5">
              {strength.message}
            </p>

          </div>

          <div className="mt-6 bg-slate-950 border border-slate-800 rounded-xl p-5">

            <h3 className="font-semibold mb-4">
              Password checklist
            </h3>

            <ul className="space-y-3 text-slate-400">

              <li>
                {password.length >= 8
                  ? "✅"
                  : "❌"}{" "}
                At least 8 characters
              </li>

              <li>
                {/[A-Z]/.test(password)
                  ? "✅"
                  : "❌"}{" "}
                Uppercase letter
              </li>

              <li>
                {/[a-z]/.test(password)
                  ? "✅"
                  : "❌"}{" "}
                Lowercase letter
              </li>

              <li>
                {/[0-9]/.test(password)
                  ? "✅"
                  : "❌"}{" "}
                Number
              </li>

              <li>
                {/[^A-Za-z0-9]/.test(
                  password
                )
                  ? "✅"
                  : "❌"}{" "}
                Special character
              </li>

            </ul>

          </div>

        </section>

        {/* IP CHECKER */}

        <section className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-10">

          <h2 className="text-2xl font-bold mb-2">
            🌐 IP Address Checker
          </h2>

          <p className="text-slate-400 mb-6">
            Enter a public IP address to view basic
            information about it.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">

            <input
              type="text"
              value={ip}
              onChange={(e) =>
                setIp(e.target.value)
              }
              placeholder="Example: 8.8.8.8"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-4 outline-none focus:border-cyan-400 transition"
            />

            <button
              onClick={checkIP}
              disabled={ipLoading}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-4 rounded-lg transition disabled:opacity-50"
            >
              {ipLoading
                ? "Checking..."
                : "Check IP"}
            </button>

          </div>

          {ipError && (
            <p className="text-red-400 mt-5">
              {ipError}
            </p>
          )}

          {ipInfo && (
            <div className="mt-8 grid sm:grid-cols-2 gap-4">

              <InfoCard
                title="IP Address"
                value={ipInfo.ip}
              />

              <InfoCard
                title="Country"
                value={ipInfo.country}
              />

              <InfoCard
                title="Region"
                value={ipInfo.region}
              />

              <InfoCard
                title="City"
                value={ipInfo.city}
              />

              <InfoCard
                title="ISP"
                value={ipInfo.connection?.isp}
              />

              <InfoCard
                title="Organization"
                value={ipInfo.connection?.org}
              />

              <InfoCard
                title="Timezone"
                value={ipInfo.timezone?.id}
              />

              <InfoCard
                title="Coordinates"
                value={`${ipInfo.latitude}, ${ipInfo.longitude}`}
              />

            </div>
          )}

        </section>

        {/* SECURITY CHECKLIST */}

        <section className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-bold mb-2">
            🛡️ Security Checklist
          </h2>

          <p className="text-slate-400 mb-8">
            Check the security practices you currently
            follow.
          </p>

          <div className="mb-8">

            <div className="flex justify-between mb-3">

              <span className="text-slate-400">
                Security Score
              </span>

              <span className="font-bold text-cyan-400">
                {securityScore}%
              </span>

            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{
                  width: `${securityScore}%`,
                }}
              />

            </div>

          </div>

          <div className="space-y-4">

            {securityChecks.map(
              (item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-xl p-4 cursor-pointer hover:border-cyan-400 transition"
                >

                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() =>
                      toggleSecurityCheck(
                        item.id
                      )
                    }
                    className="w-5 h-5 accent-cyan-400"
                  />

                  <span
                    className={
                      item.checked
                        ? "text-white"
                        : "text-slate-400"
                    }
                  >
                    {item.text}
                  </span>

                </label>
              )
            )}

          </div>

          {securityScore === 100 && (
            <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-green-400">
              🎉 Excellent! You completed the
              entire security checklist.
            </div>
          )}

        </section>

      </div>

    </main>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

      <p className="text-sm text-slate-500 mb-2">
        {title}
      </p>

      <p className="font-semibold break-words">
        {value || "Not available"}
      </p>

    </div>
  );
}