"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setSuccess("Login successful! 🎉");
    } catch (error) {
      console.error(error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Incorrect email or password.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Enter your email address first.");
      return;
    }

    try {
      setResetting(true);

      await sendPasswordResetEmail(auth, email);

      setSuccess(
        "Password reset email sent! Check your inbox. 📧"
      );
    } catch (error) {
      console.error(error);

      if (error.code === "auth/user-not-found") {
        setError("No account was found with this email.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Unable to send password reset email.");
      }
    } finally {
      setResetting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

          <h1 className="text-3xl font-bold text-center mb-2">
            Welcome Back
          </h1>

          <p className="text-slate-400 text-center mb-8">
            Login to your CyberGuard account
          </p>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="block mb-2 text-sm">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm">
                  Password
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetting}
                  className="text-cyan-400 hover:text-cyan-300 text-sm"
                >
                  {resetting
                    ? "Sending..."
                    : "Forgot Password?"}
                </button>
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">
                {error}
              </p>
            )}

            {success && (
              <p className="text-green-400 text-sm">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-cyan-400 hover:text-cyan-300"
            >
              Create one
            </a>
          </p>

        </div>
      </div>
    </main>
  );
}