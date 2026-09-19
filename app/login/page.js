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

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      console.log(
        "Logged in user:",
        userCredential.user
      );

      setSuccess("Login successful! 🎉");

      // Give Firebase time to update the authentication state
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 800);

    } catch (error) {
      console.error("Login error:", error);

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError(
            "Incorrect email or password. Please check your details and try again."
          );
          break;

        case "auth/invalid-email":
          setError(
            "Please enter a valid email address."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Too many failed login attempts. Please wait a while and try again."
          );
          break;

        case "auth/user-disabled":
          setError(
            "This account has been disabled."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection."
          );
          break;

        default:
          setError(
            "Unable to log in. Please try again."
          );
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError(
        "Enter your email address first."
      );
      return;
    }

    try {
      setResetting(true);

      await sendPasswordResetEmail(
        auth,
        cleanEmail
      );

      setSuccess(
        "Password reset email sent! Check your inbox. 📧"
      );

    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      switch (error.code) {
        case "auth/user-not-found":
          setError(
            "No account was found with this email."
          );
          break;

        case "auth/invalid-email":
          setError(
            "Please enter a valid email address."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection."
          );
          break;

        default:
          setError(
            "Unable to send password reset email."
          );
          break;
      }

    } finally {
      setResetting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

          {/* TITLE */}

          <h1 className="text-3xl font-bold text-center mb-2">
            Welcome Back
          </h1>

          <p className="text-slate-400 text-center mb-8">
            Login to your CyberGuard account
          </p>

          {/* LOGIN FORM */}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label className="block mb-2 text-sm">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500 transition"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <div className="flex items-center justify-between mb-2">

                <label className="text-sm">
                  Password
                </label>

                <button
                  type="button"
                  onClick={
                    handleForgotPassword
                  }
                  disabled={resetting}
                  className="text-cyan-400 hover:text-cyan-300 text-sm disabled:opacity-50"
                >
                  {resetting
                    ? "Sending..."
                    : "Forgot Password?"}
                </button>

              </div>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500 transition"
              />

            </div>

            {/* ERROR */}

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                <p className="text-red-400 text-sm">
                  {error}
                </p>
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                <p className="text-green-400 text-sm">
                  {success}
                </p>
              </div>
            )}

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          {/* SIGNUP */}

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