import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "Please provide a website URL." },
        { status: 400 }
      );
    }

    let targetUrl;

    try {
      targetUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Please enter a valid website URL." },
        { status: 400 }
      );
    }

    if (!["http:", "https:"].includes(targetUrl.protocol)) {
      return NextResponse.json(
        { error: "Only HTTP and HTTPS URLs are supported." },
        { status: 400 }
      );
    }

    const response = await fetch(targetUrl.toString(), {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent": "CyberGuard-Security-Scanner/1.0",
      },
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