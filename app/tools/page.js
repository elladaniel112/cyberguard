"use client";

import { useState } from "react";
import axios from "axios";

export default function ToolsPage() {
  // Password Checker
  const [password, setPassword] = useState("");

  // IP Checker
  const [ip, setIp] = useState("");
  const [ipInfo, setIpInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Security Checklist
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

  // Password Strength
  const getStrength = () => {
    if (!password) {
      return {
        label: "Enter a password",
        score: 0,
        message: "Type a password to check its strength.",
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

  // IP Checker
  const checkIP = async () => {
    if (!ip.trim()) {
      setError("Please enter an IP address.");
      return;
    }

    setLoading(true);
    setError("");
    setIpInfo(null);

    try {
      const response = await axios.get(
        `https://ipwho.is/${encodeURIComponent(ip.trim())}`
      );

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Unable to find information."
        );
        return;
      }

      setIpInfo(response.data);
    } catch (err) {
      setError(
        "Unable to check this IP address. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Security Checklist
  const toggleSecurityCheck = (id) => {
    setSecurityChecks((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  };

  const securityScore = Math.round(
    (securityChecks.filter((item) => item.checked).length /
      securityChecks.length) *
      100
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-20">
      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="text-center mb-12">

          <p className="text-cyan-400 font-semibold mb-3">
            CYBERGUARD TOOLS
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mb-5">
            Security Tools
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto">
            Simple cybersecurity tools to help you understand
            and improve your digital security.
          </p>

        </div>

        {/* Password Strength Checker */}

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
                  width: `${(strength.score / 6) * 100}%`,
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
                {/[^A-Za-z0-9]/.test(password)
                  ? "✅"
                  : "❌"}{" "}
                Special character
              </li>

            </ul>

          </div>

        </section>

        {/* IP Address Checker */}

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
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-4 rounded-lg transition disabled:opacity-50"
            >
              {loading
                ? "Checking..."
                : "Check IP"}
            </button>

          </div>

          {error && (
            <p className="text-red-400 mt-5">
              {error}
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

        {/* Security Checklist */}

        <section className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-bold mb-2">
            🛡️ Security Checklist
          </h2>

          <p className="text-slate-400 mb-8">
            Check the security practices you currently
            follow.
          </p>

          {/* Security Score */}

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

          {/* Checklist Items */}

          <div className="space-y-4">

            {securityChecks.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-xl p-4 cursor-pointer hover:border-cyan-400 transition"
              >

                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() =>
                    toggleSecurityCheck(item.id)
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
            ))}

          </div>

          {/* Completed Message */}

          {securityScore === 100 && (
            <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-green-400">
              🎉 Excellent! You completed the entire
              security checklist.
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