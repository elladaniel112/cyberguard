import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="grid-bg relative overflow-hidden">
        <div className="mx-auto grid min-h-[80vh] max-w-7xl items-center px-5 py-20 md:grid-cols-2 md:gap-12">
          
          <div>
            <p className="mb-4 font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Cybersecurity Solutions
            </p>

            <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
              Protecting your
              <span className="text-cyan-400"> digital world.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              CyberGuard helps businesses and individuals identify
              vulnerabilities, secure their websites, and protect their
              digital assets from cyber threats.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Explore Services
              </Link>

              <Link
                href="/contact"
                className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-white transition hover:border-cyan-400"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="mt-14 flex justify-center md:mt-0">
            <div className="rounded-3xl border border-cyan-400/30 bg-slate-900/70 p-10 shadow-2xl">
              <div className="text-center">
                <div className="text-7xl">🛡️</div>

                <h2 className="mt-5 text-2xl font-bold text-white">
                  CyberGuard
                </h2>

                <p className="mt-2 text-slate-400">
                  Security starts before the attack.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="max-w-2xl">
          <p className="font-semibold uppercase tracking-widest text-cyan-400">
            Why CyberGuard?
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Security built for the modern web.
          </h2>

          <p className="mt-5 leading-7 text-slate-400">
            We help organizations discover weaknesses before attackers do.
            From web security assessments to vulnerability testing,
            CyberGuard provides practical cybersecurity solutions.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-7">
            <div className="text-3xl">🔍</div>

            <h3 className="mt-4 text-xl font-semibold text-white">
              Vulnerability Assessment
            </h3>

            <p className="mt-3 text-slate-400">
              Identify security weaknesses before they become serious
              problems.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-7">
            <div className="text-3xl">🌐</div>

            <h3 className="mt-4 text-xl font-semibold text-white">
              Web Security
            </h3>

            <p className="mt-3 text-slate-400">
              Improve the security of websites and web applications.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-7">
            <div className="text-3xl">🛡️</div>

            <h3 className="mt-4 text-xl font-semibold text-white">
              Security Audits
            </h3>

            <p className="mt-3 text-slate-400">
              Review systems and security practices to uncover potential
              risks.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="border-y border-slate-800 bg-[#091522]">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ready to secure your digital world?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Explore our cybersecurity services and learn how CyberGuard can
            help protect your systems.
          </p>

          <Link
            href="/services"
            className="mt-8 inline-block rounded-lg bg-cyan-400 px-7 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            View Our Services
          </Link>
        </div>
      </section>
    </main>
  );
}