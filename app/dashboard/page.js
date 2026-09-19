"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.displayName || "");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-cyan-400">
          Loading your dashboard...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl mb-5">🔒</div>

          <h1 className="text-3xl font-bold mb-4">
            Access Denied
          </h1>

          <p className="text-slate-400 mb-6">
            Please log in to access your dashboard.
          </p>

          <a
            href="/login"
            className="inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-lg"
          >
            Go to Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-cyan-400 text-sm font-semibold mb-2">
            CYBERGUARD DASHBOARD
          </p>

          <h1 className="text-4xl font-bold">
            Welcome, {user.displayName || "User"} 👋
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your CyberGuard account and security.
          </p>
        </div>

        {/* Profile */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Your Profile
          </h2>

          <form onSubmit={handleUpdateName} className="space-y-5">

            <div>
              <label className="block text-sm mb-2">
                Display Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full max-w-xl px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                Email
              </label>

              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full max-w-xl px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-400"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">
                {error}
              </p>
            )}

            {message && (
              <p className="text-green-400 text-sm">
                {message}
              </p>
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

        {/* Account Cards */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">👤</div>

            <h3 className="text-lg font-semibold mb-2">
              Account
            </h3>

            <p className="text-green-400">
              Active
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">🔐</div>

            <h3 className="text-lg font-semibold mb-2">
              Authentication
            </h3>

            <p className="text-green-400">
              Verified
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">🛡️</div>

            <h3 className="text-lg font-semibold mb-2">
              Security
            </h3>

            <p className="text-green-400">
              Protected
            </p>
          </div>

        </div>

        {/* Account ID */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-3">
            Account ID
          </h2>

          <p className="text-slate-400 text-sm break-all">
            {user.uid}
          </p>
        </div>

      </div>
    </main>
  );
}