import { NextResponse } from "next/server";
import dns from "node:dns/promises";
import net from "node:net";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

function isPrivateIPv4(ip) {
  const parts = ip.split(".").map(Number);

  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    return false;
  }

  const [a, b] = parts;

  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

function isPrivateIPv6(ip) {
  const normalized = ip.toLowerCase();

  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:")
  );
}

function isPrivateAddress(ip) {
  if (net.isIPv4(ip)) {
    return isPrivateIPv4(ip);
  }

  if (net.isIPv6(ip)) {
    return isPrivateIPv6(ip);
  }

  return false;
}

async function hostnameResolvesToPrivateAddress(hostname) {
  try {
    const addresses = await dns.lookup(hostname, {
      all: true,
      verbatim: true,
    });

    return addresses.some(({ address }) =>
      isPrivateAddress(address)
    );
  } catch {
    return true;
  }
}

async function validateTarget(url) {
  let targetUrl;

  try {
    targetUrl = new URL(url);
  } catch {
    return {
      valid: false,
      error: "Please enter a valid website URL.",
    };
  }

  if (!ALLOWED_PROTOCOLS.has(targetUrl.protocol)) {
    return {
      valid: false,
      error: "Only HTTP and HTTPS URLs are supported.",
    };
  }

  if (targetUrl.username || targetUrl.password) {
    return {
      valid: false,
      error: "URLs containing usernames or passwords are not allowed.",
    };
  }

  if (targetUrl.port) {
    const allowedPorts = new Set(["80", "443"]);

    if (!allowedPorts.has(targetUrl.port)) {
      return {
        valid: false,
        error: "Only standard HTTP and HTTPS ports are allowed.",
      };
    }
  }

  const hostname = targetUrl.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    return {
      valid: false,
      error: "Local network addresses cannot be scanned.",
    };
  }

  if (net.isIP(hostname) && isPrivateAddress(hostname)) {
    return {
      valid: false,
      error: "Private or local IP addresses cannot be scanned.",
    };
  }

  if (await hostnameResolvesToPrivateAddress(hostname)) {
    return {
      valid: false,
      error: "The requested host resolves to a private or local address.",
    };
  }

  return {
    valid: true,
    url: targetUrl,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        {
          error: "Please provide a website URL.",
        },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();

    if (trimmedUrl.length > 2048) {
      return NextResponse.json(
        {
          error: "The URL is too long.",
        },
        { status: 400 }
      );
    }

    const validation = await validateTarget(trimmedUrl);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.error,
        },
        { status: 400 }
      );
    }

    const targetUrl = validation.url;

    const response = await fetch(targetUrl.toString(), {
      method: "GET",

      // Important security measure:
      // do not automatically follow redirects.
      redirect: "manual",

      signal: AbortSignal.timeout(10000),

      headers: {
        "User-Agent": "CyberGuard-Security-Scanner/1.0",
      },

      cache: "no-store",
    });

    const headers = response.headers;

    const securityHeaders = {
      strictTransportSecurity:
        headers.get("strict-transport-security"),

      contentSecurityPolicy:
        headers.get("content-security-policy"),

      xFrameOptions:
        headers.get("x-frame-options"),

      xContentTypeOptions:
        headers.get("x-content-type-options"),

      referrerPolicy:
        headers.get("referrer-policy"),

      permissionsPolicy:
        headers.get("permissions-policy"),
    };

    const checks = [
      {
        name: "HTTPS",
        passed: targetUrl.protocol === "https:",
        description:
          "The website uses an encrypted HTTPS connection.",
      },

      {
        name: "HSTS",
        passed: Boolean(
          securityHeaders.strictTransportSecurity
        ),
        description:
          "Strict-Transport-Security helps enforce HTTPS connections.",
      },

      {
        name: "Content Security Policy",
        passed: Boolean(
          securityHeaders.contentSecurityPolicy
        ),
        description:
          "CSP helps reduce certain browser-based attacks such as XSS.",
      },

      {
        name: "X-Frame-Options",
        passed: Boolean(
          securityHeaders.xFrameOptions
        ),
        description:
          "Helps control whether the website can be embedded in frames.",
      },

      {
        name: "X-Content-Type-Options",
        passed: Boolean(
          securityHeaders.xContentTypeOptions
        ),
        description:
          "Helps prevent MIME-type sniffing.",
      },

      {
        name: "Referrer-Policy",
        passed: Boolean(
          securityHeaders.referrerPolicy
        ),
        description:
          "Controls how much referrer information browsers send.",
      },

      {
        name: "Permissions-Policy",
        passed: Boolean(
          securityHeaders.permissionsPolicy
        ),
        description:
          "Controls access to certain browser features.",
      },
    ];

    const passedChecks = checks.filter(
      (check) => check.passed
    ).length;

    const score = Math.round(
      (passedChecks / checks.length) * 100
    );

    return NextResponse.json({
      success: true,

      target: {
        url: targetUrl.toString(),
        hostname: targetUrl.hostname,
        protocol: targetUrl.protocol,
      },

      response: {
        status: response.status,
        statusText: response.statusText,
      },

      score,

      checks,

      securityHeaders,
    });
  } catch (error) {
    console.error(
      "CyberGuard scanner error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to scan this website. Make sure the URL is reachable and try again.",
      },
      { status: 500 }
    );
  }
}