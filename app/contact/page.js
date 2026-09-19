"use client";

import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "messages"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        status: "new",
        important: false,
        createdAt: serverTimestamp(),
      });

      setSuccess(
        "Your message has been sent successfully! 🎉"
      );

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error(
        "Error sending message:",
        error
      );

      setError(
        "Unable to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-5 py-16">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-14">

          <p className="text-cyan-400 font-semibold uppercase tracking-widest mb-3">
            Contact CyberGuard
          </p>

          <h1 className="text-4xl md:text-6xl font-bold">
            Let's Talk Security
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto mt-6 text-lg leading-8">
            Have a question or need cybersecurity assistance?
            Send us a message and we'll get back to you.
          </p>

        </div>

        {/* CONTACT INFORMATION */}

        <div className="grid md:grid-cols-3 gap-5 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">

            <div className="text-3xl mb-3">
              🛡️
            </div>

            <h2 className="font-bold text-lg">
              Cybersecurity
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Questions about protecting your digital systems.
            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">

            <div className="text-3xl mb-3">
              💻
            </div>

            <h2 className="font-bold text-lg">
              Web Security
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Need help securing a website or web application?
            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">

            <div className="text-3xl mb-3">
              📩
            </div>

            <h2 className="font-bold text-lg">
              Get in Touch
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Send us a message using the form below.
            </p>

          </div>

        </div>

        {/* CONTACT FORM */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 md:p-10 shadow-xl">

          <div className="mb-8">

            <h2 className="text-2xl md:text-3xl font-bold">
              Send Us a Message
            </h2>

            <p className="text-slate-400 mt-2">
              Fill out the form and your message will be securely
              delivered to the CyberGuard admin dashboard.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* NAME */}

            <div>

              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
              />

            </div>

            {/* EMAIL */}

            <div>

              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
              />

            </div>

            {/* MESSAGE */}

            <div>

              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help..."
                rows="7"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition resize-none"
              />

            </div>

            {/* ERROR */}

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">

                <p className="text-red-400 text-sm">
                  {error}
                </p>

              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">

                <p className="text-green-400 text-sm">
                  {success}
                </p>

              </div>
            )}

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Sending Message..."
                : "Send Secure Message →"}
            </button>

          </form>

        </div>

        {/* SECURITY NOTE */}

        <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 text-center">

          <div className="text-2xl mb-2">
            🔒
          </div>

          <h3 className="font-semibold">
            Your message is securely submitted
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            Messages are stored in CyberGuard's protected
            Firestore database and are accessible only to
            authorized administrators.
          </p>

        </div>

      </div>

    </main>
  );
}