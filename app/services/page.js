import Link from "next/link";

const services = [
  {
    icon: "🔍",
    title: "Vulnerability Assessment",
    description:
      "Identify potential weaknesses in systems, websites, and applications so security issues can be understood and addressed.",
  },
  {
    icon: "🛡️",
    title: "Web Security",
    description:
      "Review websites and web applications for common security protections, configuration issues, and areas that may require attention.",
  },
  {
    icon: "🔐",
    title: "Penetration Testing",
    description:
      "Perform authorized security testing to identify weaknesses and understand how they could potentially be exploited.",
  },
  {
    icon: "📋",
    title: "Security Audit",
    description:
      "Review security configurations, processes, and controls to identify areas where security practices can be improved.",
  },
  {
    icon: "🌐",
    title: "Network Security",
    description:
      "Review network configurations and security controls to help organizations better protect connected systems and devices.",
  },
  {
    icon: "🚨",
    title: "Incident Response",
    description:
      "Help organizations understand suspicious activity and develop practical approaches for responding to cybersecurity incidents.",
  },
];

export default function Services() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-slate-800 px-6 py-24 md:py-32">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.08),transparent_35%)]" />

        <div className="relative mx-auto max-w-6xl text-center">

          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-400">
            🛡️ CyberGuard Services
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            Security Solutions for a
            <span className="text-cyan-400"> Digital World.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400 md:text-xl">
            Explore cybersecurity services designed to help organizations
            understand security risks, identify areas for improvement,
            and strengthen their digital environments.
          </p>

        </div>

      </section>

      {/* SERVICES */}

      <section className="px-6 py-24">

        <div className="mx-auto max-w-6xl">

          <div className="mb-14 max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              What We Offer
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-5xl">
              Practical Cybersecurity Services
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              CyberGuard focuses on practical security areas that can help
              organizations better understand and manage their digital risk.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                service={service}
                number={String(index + 1).padStart(2, "0")}
              />
            ))}

          </div>

        </div>

      </section>

      {/* HOW WE HELP */}

      <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-24">

        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Our Approach
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-5xl">
              Security starts with knowing what to look for.
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              Effective cybersecurity involves understanding the systems
              you use, identifying potential weaknesses, and applying
              appropriate protections.
            </p>

            <div className="mt-8 space-y-5">

              <ApproachStep
                number="01"
                title="Understand"
                description="Learn about the systems, applications, and security areas that matter to your environment."
              />

              <ApproachStep
                number="02"
                title="Assess"
                description="Review security configurations and identify potential areas of concern."
              />

              <ApproachStep
                number="03"
                title="Improve"
                description="Use the findings to prioritize security improvements and strengthen protection."
              />

            </div>

          </div>

          {/* SECURITY PANEL */}

          <div className="relative">

            <div className="absolute -inset-5 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative rounded-3xl border border-slate-800 bg-slate-950 p-8">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    CyberGuard
                  </p>

                  <h3 className="mt-1 text-2xl font-bold">
                    Security Framework
                  </h3>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl">
                  🛡️
                </div>

              </div>

              <div className="mt-8 space-y-4">

                <SecurityArea
                  icon="🔎"
                  title="Identify"
                  description="Find areas that may need attention."
                />

                <SecurityArea
                  icon="📊"
                  title="Assess"
                  description="Understand the security implications."
                />

                <SecurityArea
                  icon="🔐"
                  title="Protect"
                  description="Apply appropriate security controls."
                />

                <SecurityArea
                  icon="📈"
                  title="Improve"
                  description="Continue strengthening your security posture."
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* WHY CYBERGUARD */}

      <section className="px-6 py-24">

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Why CyberGuard
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-5xl">
              A Practical Approach to Cybersecurity
            </h2>

          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <Benefit
              icon="🎯"
              title="Focused"
              description="Focus on relevant security areas instead of overwhelming users with unnecessary complexity."
            />

            <Benefit
              icon="🧠"
              title="Understandable"
              description="Present security concepts and findings in a way that is easier to understand."
            />

            <Benefit
              icon="🚀"
              title="Actionable"
              description="Turn security observations into practical areas for improvement."
            />

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="px-6 pb-24">

        <div className="mx-auto max-w-5xl rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-10 text-center md:p-16">

          <div className="text-5xl">
            🛡️
          </div>

          <h2 className="mt-6 text-3xl font-bold md:text-5xl">
            Need Help With Your Security?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
            Tell us about your project or security needs and explore
            the next steps with CyberGuard.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              href="/contact"
              className="rounded-xl bg-cyan-500 px-7 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              Contact CyberGuard →
            </Link>

            <Link
              href="/tools"
              className="rounded-xl border border-slate-700 px-7 py-4 font-semibold transition hover:border-cyan-400 hover:text-cyan-400"
            >
              Explore Security Tools
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}


/* SERVICE CARD */

function ServiceCard({ service, number }) {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40">

      <div className="flex items-start justify-between">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-3xl">
          {service.icon}
        </div>

        <span className="text-4xl font-bold text-slate-800">
          {number}
        </span>

      </div>

      <h3 className="mt-7 text-xl font-bold transition group-hover:text-cyan-400">
        {service.title}
      </h3>

      <p className="mt-4 leading-7 text-slate-400">
        {service.description}
      </p>

      <Link
        href="/contact"
        className="mt-6 inline-flex items-center font-semibold text-cyan-400 transition hover:text-cyan-300"
      >
        Request Service
        <span className="ml-2 transition group-hover:translate-x-1">
          →
        </span>
      </Link>

    </div>
  );
}


/* APPROACH STEP */

function ApproachStep({
  number,
  title,
  description,
}) {
  return (
    <div className="flex gap-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-sm font-bold text-cyan-400">
        {number}
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


/* SECURITY AREA */

function SecurityArea({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

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
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 text-center transition hover:border-cyan-400/40">

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
