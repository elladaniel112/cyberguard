"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const ADMIN_UID = "4p7XTqdcQqbr7otfruFMnemLDK43";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadMessages = async () => {
    try {
      setRefreshing(true);

      const messagesQuery = query(
        collection(db, "messages"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(messagesQuery);

      const messageList = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      setMessages(messageList);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      if (currentUser.uid !== ADMIN_UID) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      setUser(currentUser);
      await loadMessages();
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (messageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(messageId);

      await deleteDoc(doc(db, "messages", messageId));

      setMessages((currentMessages) =>
        currentMessages.filter(
          (message) => message.id !== messageId
        )
      );
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Unable to delete this message.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-cyan-400">
          Loading admin dashboard...
        </p>
      </main>
    );
  }

  if (accessDenied) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl mb-5">🔒</div>

          <h1 className="text-3xl font-bold mb-3">
            Access Denied
          </h1>

          <p className="text-slate-400 mb-6">
            You don't have permission to access the admin dashboard.
          </p>

          <a
            href="/dashboard"
            className="inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-lg"
          >
            Back to Dashboard
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

          <div>
            <p className="text-cyan-400 text-sm font-semibold mb-2">
              CYBERGUARD ADMIN
            </p>

            <h1 className="text-4xl font-bold">
              Admin Dashboard 👑
            </h1>

            <p className="text-slate-400 mt-2">
              Logged in as {user?.email}
            </p>
          </div>

          <button
            onClick={loadMessages}
            disabled={refreshing}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-5 py-3 rounded-lg disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Refresh Messages"}
          </button>

        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-3xl mb-3">📩</div>

            <p className="text-slate-400 text-sm">
              Total Messages
            </p>

            <p className="text-4xl font-bold text-cyan-400 mt-2">
              {messages.length}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-3xl mb-3">👑</div>

            <p className="text-slate-400 text-sm">
              Admin Status
            </p>

            <p className="text-green-400 text-xl font-semibold mt-2">
              Active
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-3xl mb-3">🛡️</div>

            <p className="text-slate-400 text-sm">
              Database
            </p>

            <p className="text-green-400 text-xl font-semibold mt-2">
              Protected
            </p>
          </div>

        </div>

        {/* Messages */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          <div className="p-6 border-b border-slate-800">
            <h2 className="text-2xl font-bold">
              Contact Messages
            </h2>
          </div>

          {messages.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-4xl mb-4">📭</div>

              <p className="text-slate-400">
                No messages yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">

              {messages.map((message) => (

                <div
                  key={message.id}
                  className="p-6 hover:bg-slate-800/40 transition"
                >

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                    <div className="flex-1">

                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">

                        <h3 className="font-semibold text-lg">
                          {message.name}
                        </h3>

                        <span className="text-cyan-400 text-sm">
                          {message.email}
                        </span>

                      </div>

                      <p className="text-slate-300 leading-relaxed">
                        {message.message}
                      </p>

                      {message.createdAt && (
                        <p className="text-slate-500 text-xs mt-4">
                          {message.createdAt.toDate().toLocaleString()}
                        </p>
                      )}

                    </div>

                    <button
                      onClick={() => handleDelete(message.id)}
                      disabled={deletingId === message.id}
                      className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                    >
                      {deletingId === message.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>
    </main>
  );
}