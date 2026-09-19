"use client";

import { useState } from "react";

const posts = [
  {
    id: 1,
    category: "Web Security",
    icon: "🌐",
    title: "5 Ways to Make Your Website More Secure",
    description:
      "Learn practical steps developers can take to improve the security of modern websites and web applications.",
    date: "September 15, 2026",
    readTime: "5 min read",
    content: [
      "Website security is important for protecting users, data, and business operations.",
      "Keep your website and dependencies updated. Outdated software can contain vulnerabilities that attackers may exploit.",
      "Use HTTPS to protect information exchanged between users and your website.",
      "Use strong authentication and avoid storing sensitive information unnecessarily.",
      "Regularly test your website for security weaknesses and monitor it for unusual activity.",
    ],
  },
  {
    id: 2,
    category: "Cybersecurity",
    icon: "🛡️",
    title: "Understanding Common Cybersecurity Threats",
    description:
      "A beginner-friendly guide to some of the most common threats that individuals and businesses face online.",
    date: "September 10, 2026",
    readTime: "7 min read",
    content: [
      "Cybersecurity threats can affect individuals, businesses, and organizations of every size.",
      "Phishing attacks attempt to trick people into revealing information or clicking malicious links.",
      "Malware is malicious software designed to damage systems, steal information, or gain unauthorized access.",
      "Weak or reused passwords can make accounts easier to compromise.",
      "Learning basic security practices can significantly reduce everyday cybersecurity risks.",
    ],
  },
  {
    id: 3,
    category: "Network Security",
    icon: "🔒",
    title: "Why Network Security Matters",
    description:
      "Discover why protecting networks is an important part of keeping digital systems safe.",
    date: "September 5, 2026",
    readTime: "6 min read",
    content: [
      "Network security involves protecting systems, devices, and information moving across a network.",
      "Firewalls can help control unwanted network traffic.",
      "Strong Wi-Fi passwords and modern encryption help protect wireless networks.",
      "Organizations should monitor networks for suspicious activity.",
      "Regular security updates and access controls are important parts of maintaining a secure network.",
    ],
  },
  {
    id: 4,
    category: "Account Security",
    icon: "🔐",
    title: "How to Protect Your Online Accounts",
    description:
      "Simple steps you can take to make your email, social media, banking, and other online accounts safer.",
    date: "August 30, 2026",
    readTime: "5 min read",
    content: [
      "Use a different strong password for every important account.",
      "Enable two-factor authentication whenever it is available.",
      "Be careful when clicking links in unexpected emails and messages.",
      "Review account login activity and security notifications regularly.",
      "Keep recovery information up to date so you can regain access if necessary.",
    ],
  },
  {
    id: 5,
    category: "Phishing",
    icon: "🎣",
    title: "How to Identify a Phishing Message",
    description:
      "Learn how to recognize suspicious emails, messages, and websites before interacting with them.",
    date: "August 25, 2026",
    readTime: "6 min read",
    content: [
      "Phishing messages often try to create urgency or pressure you into acting quickly.",
      "Check the sender's address carefully before responding.",
      "Avoid clicking unexpected links, especially when a message asks for sensitive information.",
      "If a message claims to come from a company, visit the company's official website directly rather than using the message link.",
      "When in doubt, verify the request through another trusted communication channel.",
    ],
  },
  {
    id: 6,
    category: "Privacy",
    icon: "👁️",
    title: "Protecting Your Digital Privacy",
    description:
      "Understand some practical ways to reduce unnecessary exposure of your personal information online.",
    date: "August 20, 2026",
    readTime: "6 min read",
    content: [
      "Review the privacy settings of your social media and online accounts.",
      "Only provide personal information when it is genuinely necessary.",
      "Be careful about sharing sensitive information publicly.",
      "Use secure connections when accessing important services.",
      "Regularly review the apps and services that have access to your accounts.",
    ],
  },
];

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <main className="min-h-screen bg-[#07111c] text-white">

      {/* HEADER */}

      <section className="border-b border-slate-800">

        <div className="mx-auto max-w-7xl px-5 py-24">

          <p className="font-semibold uppercase tracking-[0.2em] text-cyan-400">
            CyberGuard Blog
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-bold md:text-6xl">
            Cybersecurity knowledge for everyone.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Learn about cybersecurity, web security, privacy, and practical
            ways to protect your digital world.
          </p>

        </div>

      </section>

      {/* BLOG POSTS */}

      <section className="mx-auto max-w-7xl px-5 py-20">

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {posts.map((post) => (

            <article
              key={post.id}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50"
            >

              {/* CARD IMAGE */}

              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-900/30">

                <span className="text-6xl">
                  {post.icon}
                </span>

              </div>

              {/* CARD CONTENT */}

              <div className="p-7">

                <p className="text-sm font-semibold text-cyan-400">
                  {post.category}
                </p>

                <h2 className="mt-3 text-xl font-bold">
                  {post.title}
                </h2>

                <p className="mt-4 leading-7 text-slate-400">
                  {post.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5 text-sm text-slate-500">

                  <span>
                    {post.date}
                  </span>

                  <span>
                    {post.readTime}
                  </span>

                </div>

                <button
                  onClick={() => setSelectedPost(post)}
                  className="mt-6 font-semibold text-cyan-400 transition hover:text-cyan-300"
                >
                  Read Article →
                </button>

              </div>

            </article>

          ))}

        </div>

      </section>

      {/* ARTICLE MODAL */}

      {selectedPost && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-5 py-10">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">

            <div className="flex items-start justify-between gap-6">

              <div>

                <p className="text-sm font-semibold text-cyan-400">
                  {selectedPost.category}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {selectedPost.title}
                </h2>

                <p className="mt-3 text-sm text-slate-500">
                  {selectedPost.date} • {selectedPost.readTime}
                </p>

              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:border-cyan-400 hover:text-cyan-400"
              >
                ✕
              </button>

            </div>

            <div className="mt-8 space-y-6">

              {selectedPost.content.map((paragraph, index) => (

                <p
                  key={index}
                  className="leading-8 text-slate-300"
                >
                  {paragraph}
                </p>

              ))}

            </div>

            <button
              onClick={() => setSelectedPost(null)}
              className="mt-8 rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
            >
              Close Article
            </button>

          </div>

        </div>

      )}

      {/* NEWSLETTER */}

      <section className="border-t border-slate-800 bg-[#091522]">

        <div className="mx-auto max-w-3xl px-5 py-20 text-center">

          <div className="text-4xl">
            🛡️
          </div>

          <h2 className="mt-4 text-3xl font-bold">
            Stay security-aware.
          </h2>

          <p className="mt-4 text-slate-400">
            Follow CyberGuard for cybersecurity tips and educational
            content.
          </p>

          <div className="mt-8">

            <a
              href="/contact"
              className="inline-block rounded-lg bg-cyan-400 px-7 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Contact CyberGuard
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}