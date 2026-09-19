import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HERO */}

      <section className="relative overflow-hidden px-6 py-24 md:py-32">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.08),transparent_35%)]" />

        <div className="relative max-w-6xl mx-auto">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-400">
              🛡️ About CyberGuard
            </div>

            <h1 className="mt-7 text-5xl font-bold leading-tight md:text-7xl">
              Building a Safer
              <span className="text-cyan-400"> Digital World.</span>
            </h1>

            <p className="mt-7 text-lg leading-8 text-slate-400 md:text-xl">
              CyberGuard is a cybersecurity platform focused on helping
              individuals and businesses understand, assess, and improve
              their digital security.
            </p>

          </div>

        </div>
      </section>

      {/* MISSION / APPROACH / VISION */}

      <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-20">

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">

          <InfoCard
            icon="🎯"
            title="Our Mission"
            description="To make cybersecurity easier to understand and accessible to organizations and individuals of different sizes."
          />

          <InfoCard
            icon="🔐"
            title="Our Approach"
            description="We focus on practical security checks, useful information, and helping users understand ways to reduce digital risk."
          />

          <InfoCard
            icon="🚀"
            title="Our Vision"
            description="A digital environment where people and businesses can confidently build, launch, and grow their online services."
          />

        </div>

      </section>

      {/* WHAT WE DO */}

      <section className="px-6 py-24">

        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              What We Do
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-5xl">
              Practical cybersecurity tools and resources.
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              CyberGuard brings useful cybersecurity features together
              in one platform. The goal is to make security information
              easier to understand and give users practical ways to
              examine important areas of their digital environment.
            </p>

            <div className="mt-8 space-y-5">

              <Feature
                icon="🌐"
                title="Website Security"
                description="Check common website security protections and headers."
              />

              <Feature
                icon="🔑"
                title="Password Awareness"
                description="Learn about characteristics that contribute to stronger passwords."
              />

              <Feature
                icon="📊"
                title="Security Reports"
                description="Logged-in users can review their previous website security scans."
              />

              <Feature
                icon="📚"
                title="Security Education"
                description="Explore cybersecurity articles and practical digital safety information."
              />

            </div>

          </div>

          {/* SECURITY PANEL */}

          <div className="relative">

            <div className="absolute -inset-5 rounded-3xl bg-cyan-400/10 blur-3xl" />

            <div className="relative rounded-3xl border border-slate-800 bg-slate-900 p-8">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    CyberGuard
                  </p>

                  <h3 className="mt-1 text-2xl font-bold">
                    Security Center
                  </h3>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl">
                  🛡️
                </div>

              </div>

              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-slate-500">
                      Platform Status
                    </p>

                    <p className="mt-2 text-2xl font-bold text-cyan-400">
                      Security Ready
                    </p>
                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-cyan-400/20">
                    <span className="text-2xl">
                      ✓
                    </span>
                  </div>

                </div>

                <div className="mt-7 space-y-3">

                  <StatusRow
                    label="Website Scanner"
                    status="Available"
                  />

                  <StatusRow
                    label="Password Checker"
                    status="Available"
                  />

                  <StatusRow
                    label="IP Checker"
                    status="Available"
                  />

                  <StatusRow
                    label="Security Reports"
                    status="Available"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* SECURITY PRINCIPLES */}

      <section className="bg-slate-900/40 px-6 py-24">

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Our Principles
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-5xl">
              Security Starts With Understanding
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              CyberGuard is built around simple principles that help
              users approach cybersecurity more confidently.
            </p>

          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <Principle
              icon="🧠"
              title="Awareness"
              description="Understanding common security risks is an important part of protecting digital information."
            />

            <Principle
              icon="🔎"
              title="Visibility"
              description="Security checks can help users identify areas that deserve further attention."
            />

            <Principle
              icon="🛡️"
              title="Protection"
              description="Better security practices can help reduce unnecessary digital exposure and risk."
            />

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="px-6 py-24">

        <div className="mx-auto max-w-5xl rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-10 text-center md:p-16">

          <div className="text-5xl">
            🛡️
          </div>

          <h2 className="mt-6 text-3xl font-bold md:text-5xl">
            Start Exploring CyberGuard
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
            Explore our security tools, learn more about cybersecurity,
            or get in touch with the CyberGuard team.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              href="/tools"
              className="rounded-xl bg-cyan-500 px-7 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              Explore Security Tools →
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-slate-700 px-7 py-4 font-semibold transition hover:border-cyan-400 hover:text-cyan-400"
            >
              Contact Us
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}


/* INFO CARD */

function InfoCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:border-cyan-400/40">

      <div className="text-4xl">
        {icon}
      </div>

      <h2 className="mt-5 text-xl font-bold">
        {title}
      </h2>

      <p className="mt-3 leading-7 text-slate-400">
        {description}
      </p>

    </div>
  );
}


/* FEATURE */

function Feature({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-lg">
        {icon}
      </div>

      <div>
        <h3 className="font-bold">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>

    </div>
  );
}


/* STATUS ROW */

function StatusRow({ label, status }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-900 p-3">

      <span className="text-sm text-slate-400">
        {label}
      </span>

      <span className="text-sm font-semibold text-green-400">
        ✓ {status}
      </span>

    </div>
  );
}


/* PRINCIPLE */

function Principle({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:border-cyan-400/40">

      <div className="text-4xl">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-400">
        {description}
      </p>

    </div>
  );
}