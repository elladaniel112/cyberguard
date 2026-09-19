export default function About() {
  return (
    <main className="min-h-screen bg-[#07111c] text-white">
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="max-w-3xl">
          <p className="font-semibold uppercase tracking-[0.2em] text-cyan-400">
            About CyberGuard
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            Security for a safer digital world.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            CyberGuard is a cybersecurity platform focused on helping
            businesses and individuals understand and improve their digital
            security.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <div className="text-4xl">🎯</div>

            <h2 className="mt-5 text-xl font-bold">
              Our Mission
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              To make cybersecurity easier to understand and accessible to
              organizations of different sizes.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <div className="text-4xl">🔐</div>

            <h2 className="mt-5 text-xl font-bold">
              Our Approach
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              We focus on identifying security weaknesses and helping users
              understand practical ways to reduce risk.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <div className="text-4xl">🚀</div>

            <h2 className="mt-5 text-xl font-bold">
              Our Vision
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              A digital environment where businesses can confidently build,
              launch and grow their online services.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}