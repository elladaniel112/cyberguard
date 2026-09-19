"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (
      !cleanName ||
      !cleanEmail ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      await updateProfile(userCredential.user, {
        displayName: cleanName,
      });

      setSuccess(
        "Account created successfully! 🎉"
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Send the new user to the dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);

    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      switch (error.code) {
        case "auth/email-already-in-use":
          setError(
            "This email is already registered. Please log in instead."
          );
          break;

        case "auth/invalid-email":
          setError(
            "Please enter a valid email address."
          );
          break;

        case "auth/weak-password":
          setError(
            "Password is too weak. Use at least 6 characters."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection."
          );
          break;

        case "auth/operation-not-allowed":
          setError(
            "Email/password authentication is not enabled in Firebase."
          );
          break;

        default:
          setError(
            "Something went wrong. Please try again."
          );
          break;
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

          {/* TITLE */}

          <h1 className="text-3xl font-bold text-center mb-2">
            Create Account
          </h1>

          <p className="text-slate-400 text-center mb-8">
            Join CyberGuard today
          </p>

          {/* SIGNUP FORM */}

          <form
            onSubmit={handleSignup}
            className="space-y-5"
          >

            {/* NAME */}

            <div>

              <label className="block mb-2 text-sm">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your name"
                autoComplete="name"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500 transition"
              />

            </div>

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

              <label className="block mb-2 text-sm">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Create a password"
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500 transition"
              />

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label className="block mb-2 text-sm">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm your password"
                autoComplete="new-password"
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

            {/* CREATE ACCOUNT BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* LOGIN LINK */}

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{" "}

            <a
              href="/login"
              className="text-cyan-400 hover:text-cyan-300"
            >
              Login
            </a>
          </p>

        </div>

      </div>

    </main>
  );
}