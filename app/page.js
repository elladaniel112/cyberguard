"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HERO */}

      <section className="relative overflow-hidden px-6 py-24 md:py-32">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.08),transparent_35%)]" />

        <div className="relative max-w-6xl mx-auto">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-400 mb-7">
              <span>🛡️</span>
              Cybersecurity for the modern web
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Protect Your{" "}
              <span className="text-cyan-400">
                Digital World
              </span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl leading-8 mt-7 max-w-2xl">
              CyberGuard provides practical cybersecurity tools
              and resources to help you understand, monitor,
              and improve your digital security.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-9">

              <Link
                href="/tools"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-7 py-4 rounded-xl transition text-center"
              >
                Start Security Scan →
              </Link>

              <Link
                href="/services"
                className="border border-slate-700 hover:border-cyan-400 hover:text-cyan-400 font-semibold px-7 py-4 rounded-xl transition text-center"
              >
                Explore Services
              </Link>

            </div>

          </div>

          {/* SECURITY CARD */}

          <div className="mt-16 grid md:grid-cols-3 gap-5">

            <SecurityCard
              icon="🌐"
              title="Website Scanner"
              description="Check basic security protections and headers."
            />

            <SecurityCard
              icon="🔐"
              title="Password Security"
              description="Understand basic password strength characteristics."
            />

            <SecurityCard
              icon="📊"
              title="Security Reports"
              description="Keep track of your website security scans."
            />

          </div>

        </div>
      </section>

      {/* STATS */}

      <section className="border-y border-slate-800 bg-slate-900/50 px-6 py-14">

        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">

          <Stat
            number="24/7"
            label="Security Awareness"
          />

          <Stat
            number="100%"
            label="Web Based"
          />

          <Stat
            number="6+"
            label="Security Checks"
          />

          <Stat
            number="1"
            label="CyberGuard Platform"
          />

        </div>

      </section>

      {/* FEATURED TOOLS */}

      <section className="px-6 py-24">

        <div className="max-w-6xl mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-14">

            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">
              Security Toolkit
            </p>

            <h2 className="text-3xl md:text-5xl font-bold mt-3">
              Tools Built for Digital Safety
            </h2>

            <p className="text-slate-400 mt-5 leading-7">
              Explore simple tools designed to help you
              understand important areas of cybersecurity.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <ToolCard
              icon="🌐"
              title="Website Security Scanner"
              description="Check HTTPS and common security headers on a website."
              href="/tools"
            />

            <ToolCard
              icon="🔑"
              title="Password Checker"
              description="Check basic characteristics that contribute to password strength."
              href="/tools"
            />

            <ToolCard
              icon="📍"
              title="IP Address Checker"
              description="View basic information associated with a public IP address."
              href="/tools"
            />

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}

      <section className="px-6 py-24 bg-slate-900/40">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">

            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">
              Simple Process
            </p>

            <h2 className="text-3xl md:text-5xl font-bold mt-3">
              Security Made Simple
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <ProcessStep
              number="01"
              icon="🔍"
              title="Choose a Tool"
              description="Select a security tool that matches what you want to check."
            />

            <ProcessStep
              number="02"
              icon="🛡️"
              title="Run Your Check"
              description="Enter the required information and let CyberGuard perform the check."
            />

            <ProcessStep
              number="03"
              icon="📋"
              title="Review Results"
              description="Understand the results and use them to improve your digital security."
            />

          </div>

        </div>

      </section>

      {/* WHY CYBERGUARD */}

      <section className="px-6 py-24">

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

          <div>

            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">
              Why CyberGuard
            </p>

            <h2 className="text-3xl md:text-5xl font-bold mt-3 leading-tight">
              Understand Your Security.
              <br />
              Improve Your Protection.
            </h2>

            <p className="text-slate-400 leading-8 mt-6">
              Cybersecurity can feel complicated. CyberGuard
              focuses on presenting useful security information
              in a simple and understandable way.
            </p>

            <div className="space-y-5 mt-8">

              <Benefit
                icon="✓"
                title="Easy to Understand"
                description="Security information is presented clearly."
              />

              <Benefit
                icon="✓"
                title="Practical Tools"
                description="Use tools that help you explore common security areas."
              />

              <Benefit
                icon="✓"
                title="Scan History"
                description="Logged-in users can keep track of their website scans."
              />

              <Benefit
                icon="✓"
                title="Security Resources"
                description="Learn more through CyberGuard's cybersecurity articles."
              />

            </div>

          </div>

          {/* SECURITY VISUAL */}

          <div className="relative">

            <div className="absolute -inset-4 bg-cyan-400/10 blur-3xl rounded-full" />

            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8">

              <div className="flex items-center justify-between mb-8">

                <div>
                  <p className="text-slate-500 text-sm">
                    Security Center
                  </p>

                  <h3 className="text-2xl font-bold mt-1">
                    CyberGuard
                  </h3>
                </div>

                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-2xl">
                  🛡️
                </div>

              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-slate-500 text-sm">
                      Security Status
                    </p>

                    <p className="text-green-400 text-2xl font-bold mt-2">
                      Protected
                    </p>
                  </div>

                  <div className="w-16 h-16 rounded-full border-4 border-green-400/30 flex items-center justify-center">
                    <span className="text-green-400 text-xl">
                      ✓
                    </span>
                  </div>

                </div>

                <div className="mt-7 space-y-3">

                  <SecurityStatus
                    label="HTTPS"
                    status="Enabled"
                  />

                  <SecurityStatus
                    label="Security Headers"
                    status="Checked"
                  />

                  <SecurityStatus
                    label="Security Tools"
                    status="Available"
                  />

                  <SecurityStatus
                    label="Scan Reports"
                    status="Saved"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* SERVICES */}

      <section className="px-6 py-24 bg-slate-900/40">

        <div className="max-w-6xl mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-14">

            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">
              Cybersecurity Services
            </p>

            <h2 className="text-3xl md:text-5xl font-bold mt-3">
              Security Solutions
            </h2>

            <p className="text-slate-400 mt-5">
              Explore CyberGuard's cybersecurity-focused services.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <ServiceCard
              icon="🔎"
              title="Security Assessment"
              description="Identify basic security considerations and areas that may need attention."
            />

            <ServiceCard
              icon="🌐"
              title="Web Security"
              description="Review common website security protections and configurations."
            />

            <ServiceCard
              icon="🎓"
              title="Security Awareness"
              description="Learn practical cybersecurity concepts and safer digital habits."
            />

          </div>

          <div className="text-center mt-10">

            <Link
              href="/services"
              className="inline-block border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 font-semibold px-6 py-3 rounded-lg transition"
            >
              View All Services →
            </Link>

          </div>

        </div>

      </section>

      {/* BLOG CTA */}

      <section className="px-6 py-24">

        <div className="max-w-5xl mx-auto bg-gradient-to-r from-cyan-400/10 to-blue-500/10 border border-cyan-400/20 rounded-3xl p-8 md:p-14 text-center">

          <div className="text-5xl mb-6">
            📝
          </div>

          <h2 className="text-3xl md:text-5xl font-bold">
            Learn More About Cybersecurity
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto mt-5 leading-7">
            Read CyberGuard articles covering cybersecurity,
            online safety, passwords, phishing, and other
            digital security topics.
          </p>

          <Link
            href="/blog"
            className="inline-block mt-8 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-7 py-4 rounded-xl transition"
          >
            Read the Blog →
          </Link>

        </div>

      </section>

      {/* FINAL CTA */}

      <section className="px-6 py-24 bg-slate-900">

        <div className="max-w-4xl mx-auto text-center">

          <div className="text-5xl mb-6">
            🛡️
          </div>

          <h2 className="text-4xl md:text-6xl font-bold">
            Ready to Check Your Security?
          </h2>

          <p className="text-slate-400 text-lg mt-6 max-w-2xl mx-auto">
            Start with CyberGuard's security tools and
            take a closer look at your digital protection.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-9">

            <Link
              href="/tools"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-xl transition"
            >
              Start a Security Scan
            </Link>

            <Link
              href="/contact"
              className="border border-slate-700 hover:border-cyan-400 hover:text-cyan-400 font-semibold px-8 py-4 rounded-xl transition"
            >
              Contact CyberGuard
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

/* SECURITY CARD */

function SecurityCard({ icon, title, description }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-cyan-400/40 transition">
      <div className="text-3xl mb-4">
        {icon}
      </div>

      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <p className="text-slate-400 mt-2 leading-6">
        {description}
      </p>
    </div>
  );
}

/* STAT */

function Stat({ number, label }) {
  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-bold text-cyan-400">
        {number}
      </p>

      <p className="text-slate-500 text-sm mt-2">
        {label}
      </p>
    </div>
  );
}

/* TOOL CARD */

function ToolCard({
  icon,
  title,
  description,
  href,
}) {
  return (
    <Link
      href={href}
      className="group bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-cyan-400 transition"
    >
      <div className="text-4xl mb-5">
        {icon}
      </div>

      <h3 className="text-xl font-bold group-hover:text-cyan-400 transition">
        {title}
      </h3>

      <p className="text-slate-400 mt-3 leading-7">
        {description}
      </p>

      <span className="inline-block mt-6 text-cyan-400 font-semibold">
        Open Tool →
      </span>
    </Link>
  );
}

/* PROCESS */

function ProcessStep({
  number,
  icon,
  title,
  description,
}) {
  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-7">

      <div className="flex items-center justify-between mb-6">

        <div className="text-4xl">
          {icon}
        </div>

        <span className="text-slate-700 text-4xl font-bold">
          {number}
        </span>

      </div>

      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <p className="text-slate-400 mt-3 leading-7">
        {description}
      </p>

    </div>
  );
}

/* BENEFIT */

function Benefit({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-4">

      <div className="w-8 h-8 rounded-full bg-green-400/10 border border-green-400/20 text-green-400 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div>

        <h3 className="font-bold">
          {title}
        </h3>

        <p className="text-slate-400 text-sm mt-1">
          {description}
        </p>

      </div>

    </div>
  );
}

/* SECURITY STATUS */

function SecurityStatus({
  label,
  status,
}) {
  return (
    <div className="flex items-center justify-between bg-slate-900 rounded-lg p-3">

      <span className="text-slate-400 text-sm">
        {label}
      </span>

      <span className="text-green-400 text-sm font-semibold">
        ✓ {status}
      </span>

    </div>
  );
}

/* SERVICE CARD */

function ServiceCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-cyan-400/40 transition">

      <div className="text-4xl mb-5">
        {icon}
      </div>

      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <p className="text-slate-400 mt-3 leading-7">
        {description}
      </p>

    </div>
  );
}