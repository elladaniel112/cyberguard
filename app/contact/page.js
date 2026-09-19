"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "messages"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: serverTimestamp(),
      });

      setSuccess("Your message has been sent successfully! 🎉");

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Unable to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <p className="text-cyan-400 font-semibold mb-2">
            CONTACT CYBERGUARD
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Let's Talk Security
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto">
            Have a question or need cybersecurity assistance?
            Send us a message and our team will get back to you.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block mb-2 text-sm">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                Message
              </label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help?"
                rows="6"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500 resize-none"
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
              {loading ? "Sending..." : "Send Message"}
            </button>

          </form>

        </div>
      </div>
    </main>
  );
}