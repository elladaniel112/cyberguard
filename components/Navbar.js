"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const ADMIN_UID = "4p7XTqdcQqbr7otfruFMnemLDK43";

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
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-slate-950 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">

        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="text-2xl font-bold text-cyan-400"
          >
            CyberGuard
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">

            <Link
              href="/"
              className="hover:text-cyan-400 transition"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="hover:text-cyan-400 transition"
            >
              About
            </Link>

            <Link
              href="/services"
              className="hover:text-cyan-400 transition"
            >
              Services
            </Link>

            <Link
              href="/blog"
              className="hover:text-cyan-400 transition"
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className="hover:text-cyan-400 transition"
            >
              Contact
            </Link>

            {!user ? (
              <>
                <Link
                  href="/login"
                  className="hover:text-cyan-400 transition"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-4 py-2 rounded-lg transition"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="hover:text-cyan-400 transition"
                >
                  Dashboard
                </Link>

                {user.uid === ADMIN_UID && (
                  <Link
                    href="/admin"
                    className="text-yellow-400 hover:text-yellow-300 transition"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white text-3xl"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-800 pt-4">

            <div className="flex flex-col gap-4">

              <Link
                href="/"
                onClick={closeMenu}
                className="hover:text-cyan-400 transition"
              >
                Home
              </Link>

              <Link
                href="/about"
                onClick={closeMenu}
                className="hover:text-cyan-400 transition"
              >
                About
              </Link>

              <Link
                href="/services"
                onClick={closeMenu}
                className="hover:text-cyan-400 transition"
              >
                Services
              </Link>

              <Link
                href="/blog"
                onClick={closeMenu}
                className="hover:text-cyan-400 transition"
              >
                Blog
              </Link>

              <Link
                href="/contact"
                onClick={closeMenu}
                className="hover:text-cyan-400 transition"
              >
                Contact
              </Link>

              {!user ? (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="hover:text-cyan-400 transition"
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="bg-cyan-500 text-slate-950 font-semibold px-4 py-2 rounded-lg text-center"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="hover:text-cyan-400 transition"
                  >
                    Dashboard
                  </Link>

                  {user.uid === ADMIN_UID && (
                    <Link
                      href="/admin"
                      onClick={closeMenu}
                      className="text-yellow-400 hover:text-yellow-300 transition"
                    >
                      Admin
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-2 rounded-lg transition"
                  >
                    Logout
                  </button>
                </>
              )}

            </div>
          </div>
        )}

      </div>
    </nav>
  );
}