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
  updateDoc,
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
  const [updatingId, setUpdatingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
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
      }
    );

    return () => unsubscribe();
  }, []);

  const updateMessage = async (
    messageId,
    updates
  ) => {
    try {
      setUpdatingId(messageId);

      await updateDoc(
        doc(db, "messages", messageId),
        updates
      );

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                ...updates,
              }
            : message
        )
      );
    } catch (error) {
      console.error(
        "Error updating message:",
        error
      );

      alert(
        "Unable to update this message."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (
    messageId,
    status
  ) => {
    await updateMessage(messageId, {
      status,
    });
  };

  const handleImportant = async (
    message
  ) => {
    await updateMessage(message.id, {
      important: !message.important,
    });
  };

  const handleDelete = async (
    messageId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this message?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(messageId);

      await deleteDoc(
        doc(db, "messages", messageId)
      );

      setMessages((currentMessages) =>
        currentMessages.filter(
          (message) =>
            message.id !== messageId
        )
      );
    } catch (error) {
      console.error(
        "Error deleting message:",
        error
      );

      alert(
        "Unable to delete this message."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const normalizedSearch =
    search.trim().toLowerCase();

  const filteredMessages =
    messages.filter((message) => {
      const messageStatus =
        message.status || "new";

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "important"
          ? message.important === true
          : messageStatus === filter;

      const searchableText = `
        ${message.name || ""}
        ${message.email || ""}
        ${message.message || ""}
      `.toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(
          normalizedSearch
        );

      return (
        matchesFilter &&
        matchesSearch
      );
    });

  const newCount = messages.filter(
    (message) =>
      (message.status || "new") === "new"
  ).length;

  const readCount = messages.filter(
    (message) =>
      message.status === "read"
  ).length;

  const resolvedCount = messages.filter(
    (message) =>
      message.status === "resolved"
  ).length;

  const importantCount =
    messages.filter(
      (message) =>
        message.important === true
    ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">

          <div className="text-5xl mb-5">
            🛡️
          </div>

          <p className="text-cyan-400 font-semibold">
            Loading CyberGuard Admin...
          </p>

        </div>
      </main>
    );
  }

  if (accessDenied) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

        <div className="text-center max-w-md">

          <div className="text-6xl mb-6">
            🔒
          </div>

          <h1 className="text-3xl font-bold mb-3">
            Access Denied
          </h1>

          <p className="text-slate-400 mb-7">
            You don't have permission to
            access the CyberGuard admin
            dashboard.
          </p>

          <a
            href="/dashboard"
            className="inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition"
          >
            Back to Dashboard
          </a>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-5 py-12">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

          <div>

            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-2">
              CyberGuard Admin
            </p>

            <h1 className="text-4xl md:text-5xl font-bold">
              Control Center 👑
            </h1>

            <p className="text-slate-400 mt-3">
              Welcome back,{" "}
              {user?.displayName ||
                "Administrator"}.
            </p>

            <p className="text-slate-500 text-sm mt-1">
              {user?.email}
            </p>

          </div>

          <button
            onClick={loadMessages}
            disabled={refreshing}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
          >
            {refreshing
              ? "Refreshing..."
              : "🔄 Refresh Data"}
          </button>

        </div>

        {/* STATISTICS */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">

          <StatCard
            icon="📩"
            label="Total Messages"
            value={messages.length}
            color="cyan"
          />

          <StatCard
            icon="🟢"
            label="New"
            value={newCount}
            color="green"
          />

          <StatCard
            icon="👀"
            label="Read"
            value={readCount}
            color="blue"
          />

          <StatCard
            icon="✅"
            label="Resolved"
            value={resolvedCount}
            color="purple"
          />

          <StatCard
            icon="⭐"
            label="Important"
            value={importantCount}
            color="yellow"
          />

        </div>

        {/* QUICK ACCESS */}

        <div className="grid md:grid-cols-3 gap-5 mb-10">

          <a
            href="/tools"
            className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-400 transition"
          >

            <div className="text-3xl mb-4">
              🛡️
            </div>

            <h2 className="text-xl font-bold">
              Security Tools
            </h2>

            <p className="text-slate-400 mt-2">
              Open the CyberGuard security
              tools.
            </p>

            <span className="inline-block mt-5 text-cyan-400 font-semibold group-hover:text-cyan-300">
              Open Tools →
            </span>

          </a>

          <a
            href="/blog"
            className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-400 transition"
          >

            <div className="text-3xl mb-4">
              📝
            </div>

            <h2 className="text-xl font-bold">
              CyberGuard Blog
            </h2>

            <p className="text-slate-400 mt-2">
              View cybersecurity articles
              and resources.
            </p>

            <span className="inline-block mt-5 text-cyan-400 font-semibold group-hover:text-cyan-300">
              Open Blog →
            </span>

          </a>

          <a
            href="/"
            className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-400 transition"
          >

            <div className="text-3xl mb-4">
              🏠
            </div>

            <h2 className="text-xl font-bold">
              View Website
            </h2>

            <p className="text-slate-400 mt-2">
              Return to the CyberGuard
              homepage.
            </p>

            <span className="inline-block mt-5 text-cyan-400 font-semibold group-hover:text-cyan-300">
              Visit Homepage →
            </span>

          </a>

        </div>

        {/* INBOX */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          <div className="p-6 border-b border-slate-800">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div>

                <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">
                  Inbox
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  Contact Messages
                </h2>

              </div>

              <span className="rounded-full bg-cyan-400/10 text-cyan-400 px-4 py-2 text-sm font-semibold">
                {filteredMessages.length} shown
              </span>

            </div>

            {/* SEARCH */}

            <div className="mt-6">

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="🔎 Search by name, email, or message..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400 transition"
              />

            </div>

            {/* FILTERS */}

            <div className="flex flex-wrap gap-3 mt-5">

              <FilterButton
                active={filter === "all"}
                onClick={() =>
                  setFilter("all")
                }
              >
                All ({messages.length})
              </FilterButton>

              <FilterButton
                active={filter === "new"}
                onClick={() =>
                  setFilter("new")
                }
              >
                🟢 New ({newCount})
              </FilterButton>

              <FilterButton
                active={filter === "read"}
                onClick={() =>
                  setFilter("read")
                }
              >
                👀 Read ({readCount})
              </FilterButton>

              <FilterButton
                active={
                  filter === "resolved"
                }
                onClick={() =>
                  setFilter("resolved")
                }
              >
                ✅ Resolved ({resolvedCount})
              </FilterButton>

              <FilterButton
                active={
                  filter === "important"
                }
                onClick={() =>
                  setFilter("important")
                }
              >
                ⭐ Important ({importantCount})
              </FilterButton>

            </div>

          </div>

          {/* EMPTY */}

          {filteredMessages.length === 0 ? (

            <div className="p-12 text-center">

              <div className="text-5xl mb-5">
                📭
              </div>

              <h3 className="text-xl font-semibold">
                No messages found
              </h3>

              <p className="text-slate-400 mt-2">
                Try another search or filter.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-800">

              {filteredMessages.map(
                (message) => {

                  const status =
                    message.status ||
                    "new";

                  return (
                    <div
                      key={message.id}
                      className="p-6 hover:bg-slate-800/40 transition"
                    >

                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                        <div className="flex-1">

                          {/* MESSAGE HEADER */}

                          <div className="flex flex-wrap items-center gap-3 mb-4">

                            <h3 className="font-semibold text-lg">
                              {message.name}
                            </h3>

                            <span className="text-cyan-400 text-sm break-all">
                              {message.email}
                            </span>

                            <StatusBadge
                              status={status}
                            />

                            {message.important && (
                              <span className="rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 px-3 py-1 text-xs font-semibold">
                                ⭐ Important
                              </span>
                            )}

                          </div>

                          {/* MESSAGE */}

                          <div className="rounded-xl bg-slate-950 border border-slate-800 p-5">

                            <p className="text-slate-300 leading-7 whitespace-pre-wrap">
                              {message.message}
                            </p>

                          </div>

                          {/* DATE */}

                          {message.createdAt && (
                            <p className="text-slate-500 text-xs mt-4">
                              Received:{" "}
                              {message.createdAt
                                .toDate()
                                .toLocaleString()}
                            </p>
                          )}

                          {/* ACTIONS */}

                          <div className="flex flex-wrap items-center gap-3 mt-5">

                            <select
                              value={status}
                              disabled={
                                updatingId ===
                                message.id
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  message.id,
                                  e.target.value
                                )
                              }
                              className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-cyan-400"
                            >

                              <option value="new">
                                🟢 New
                              </option>

                              <option value="read">
                                👀 Read
                              </option>

                              <option value="resolved">
                                ✅ Resolved
                              </option>

                            </select>

                            <button
                              onClick={() =>
                                handleImportant(
                                  message
                                )
                              }
                              disabled={
                                updatingId ===
                                message.id
                              }
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                message.important
                                  ? "bg-yellow-400 text-slate-950"
                                  : "border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:text-slate-950"
                              }`}
                            >
                              {message.important
                                ? "⭐ Important"
                                : "☆ Mark Important"}
                            </button>

                          </div>

                        </div>

                        {/* DELETE */}

                        <button
                          onClick={() =>
                            handleDelete(
                              message.id
                            )
                          }
                          disabled={
                            deletingId ===
                            message.id
                          }
                          className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-5 py-3 rounded-lg transition disabled:opacity-50"
                        >
                          {deletingId ===
                          message.id
                            ? "Deleting..."
                            : "🗑️ Delete"}
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

        <div className="mt-8 text-center text-sm text-slate-600">
          CyberGuard Admin Control Center • Protected Area
        </div>

      </div>

    </main>
  );
}

/* STAT CARD */

function StatCard({
  icon,
  label,
  value,
  color,
}) {
  const colorClasses = {
    cyan: "text-cyan-400",
    green: "text-green-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
    yellow: "text-yellow-400",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="text-3xl mb-4">
        {icon}
      </div>

      <p className="text-slate-400 text-sm">
        {label}
      </p>

      <p
        className={`text-4xl font-bold mt-2 ${
          colorClasses[color]
        }`}
      >
        {value}
      </p>

    </div>
  );
}

/* FILTER BUTTON */

function FilterButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
        active
          ? "bg-cyan-400 text-slate-950"
          : "bg-slate-950 border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-400"
      }`}
    >
      {children}
    </button>
  );
}

/* STATUS BADGE */

function StatusBadge({ status }) {
  const styles = {
    new:
      "bg-green-400/10 text-green-400 border-green-400/20",
    read:
      "bg-blue-400/10 text-blue-400 border-blue-400/20",
    resolved:
      "bg-purple-400/10 text-purple-400 border-purple-400/20",
  };

  const labels = {
    new: "🟢 New",
    read: "👀 Read",
    resolved: "✅ Resolved",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[status] ||
        styles.new
      }`}
    >
      {labels[status] ||
        labels.new}
    </span>
  );
}