import Link from "next/link";

const services = [
  {
    icon: "🔍",
    title: "Vulnerability Assessment",
    description:
      "Identify weaknesses in your systems, websites and applications before attackers can exploit them.",
  },
  {
    icon: "🛡️",
    title: "Web Security",
    description:
      "Assess websites and web applications for common security vulnerabilities and configuration problems.",
  },
  {
    icon: "🔐",
    title: "Penetration Testing",
    description:
      "Perform authorized security testing to discover weaknesses and understand how they could be exploited.",
  },
  {
    icon: "📋",
    title: "Security Audit",
    description:
      "Review security configurations, processes and controls to identify areas that need improvement.",
  },
  {
    icon: "🌐",
    title: "Network Security",
    description:
      "Review network configurations and security controls to help protect systems and connected devices.",
  },
  {
    icon: "🚨",
    title: "Incident Response",
    description:
      "Help organizations understand and respond to cybersecurity incidents and suspicious activity.",
  },
];

export default function Services() {
  return (
    <main className="min-h-screen bg-[#07111c] text-white">
      {/* HEADER */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-5 py-24 text-center">
          <p className="font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Our Services
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            Security solutions for the digital world.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            From vulnerability assessments to security audits, CyberGuard
            provides practical cybersecurity services designed to help
            organizations reduce digital risk.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-8 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50"
            >
              <div className="text-4xl">{service.icon}</div>

              <h2 className="mt-6 text-xl font-bold">
                {service.title}
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                {service.description}
              </p>

              <Link
                href="/contact"
                className="mt-6 inline-block font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Request Service →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800 bg-[#091522]">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Need help securing your project?
          </h2>

          <p className="mt-4 text-slate-400">
            Tell us what you're building and we'll help you identify the
            security areas that need attention.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-block rounded-lg bg-cyan-400 px-7 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Contact CyberGuard
          </Link>
        </div>
      </section>
    </main>
  );
}