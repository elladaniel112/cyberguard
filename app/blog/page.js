const posts = [
  {
    category: "Web Security",
    title: "5 Ways to Make Your Website More Secure",
    description:
      "Learn practical steps developers can take to improve the security of modern websites and web applications.",
    date: "September 15, 2026",
    readTime: "5 min read",
  },
  {
    category: "Cybersecurity",
    title: "Understanding Common Cybersecurity Threats",
    description:
      "A beginner-friendly guide to some of the most common threats that individuals and businesses face online.",
    date: "September 10, 2026",
    readTime: "7 min read",
  },
  {
    category: "Network Security",
    title: "Why Network Security Matters",
    description:
      "Discover why protecting networks is an important part of keeping digital systems safe.",
    date: "September 5, 2026",
    readTime: "6 min read",
  },
];

export default function Blog() {
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
            Learn about cybersecurity, web security, privacy and practical
            ways to protect your digital world.
          </p>
        </div>
      </section>

      {/* BLOG POSTS */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50"
            >
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-900/30">
                <span className="text-6xl">🔐</span>
              </div>

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
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>

                <button className="mt-6 font-semibold text-cyan-400 transition hover:text-cyan-300">
                  Read Article →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="border-t border-slate-800 bg-[#091522]">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <h2 className="text-3xl font-bold">
            Stay security-aware.
          </h2>

          <p className="mt-4 text-slate-400">
            Follow CyberGuard for cybersecurity tips and educational
            content.
          </p>
        </div>
      </section>
    </main>
  );
}