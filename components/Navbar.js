"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const ADMIN_UID = "4p7XTqdcQqbr7otfruFMnemLDK43";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md text-white">

      <div className="max-w-7xl mx-auto px-5 md:px-6">

        <div className="flex items-center justify-between h-18">

          {/* LOGO */}

          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-xl group-hover:bg-cyan-400/20 transition">
              🛡️
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight">
                Cyber<span className="text-cyan-400">Guard</span>
              </div>

              <div className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Security Platform
              </div>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <div className="hidden lg:flex items-center gap-1">

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-cyan-400/5 transition"
              >
                {link.label}
              </Link>
            ))}

          </div>

          {/* DESKTOP ACCOUNT */}

          <div className="hidden lg:flex items-center gap-3">

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-cyan-400/5 transition"
                >
                  📊 Dashboard
                </Link>

                {user.uid === ADMIN_UID && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-purple-300 hover:text-purple-200 hover:bg-purple-400/10 transition"
                  >
                    ⚙️ Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-sm font-semibold transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-cyan-400 transition"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold transition shadow-lg shadow-cyan-500/10"
                >
                  Get Started →
                </Link>
              </>
            )}

          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-10 h-10 rounded-lg border border-slate-800 bg-slate-900 hover:border-cyan-400/40 flex items-center justify-center text-xl transition"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* MOBILE NAVIGATION */}

        {menuOpen && (
          <div className="lg:hidden border-t border-slate-800 py-5">

            <div className="flex flex-col gap-2">

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="px-4 py-3 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-cyan-400/5 transition font-medium"
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-slate-800 my-3" />

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="px-4 py-3 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-cyan-400/5 transition font-medium"
                  >
                    📊 Dashboard
                  </Link>

                  {user.uid === ADMIN_UID && (
                    <Link
                      href="/admin"
                      onClick={closeMenu}
                      className="px-4 py-3 rounded-lg text-purple-300 hover:bg-purple-400/10 transition font-medium"
                    >
                      ⚙️ Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="mt-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition font-semibold text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="px-4 py-3 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-cyan-400/5 transition font-medium"
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="mt-2 px-4 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-center font-bold transition"
                  >
                    Get Started →
                  </Link>
                </>
              )}

            </div>

          </div>
        )}

      </div>

    </nav>
  );
}