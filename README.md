# 🛡️ CyberGuard

CyberGuard is a web-based cybersecurity platform designed to make basic website security assessment easier and more understandable.

Users can create an account, scan websites for selected security configurations, view security scores and detailed reports, review previous scans, and monitor selected security activities from their dashboard.

## 🌐 Live Website

https://cyberguard-gules.vercel.app/

## 🎯 What CyberGuard Was Created For

Website security can be difficult to understand, especially for beginners.

CyberGuard provides a simple interface for performing basic website security configuration checks without requiring users to manually inspect HTTP security headers.

The platform is designed as both a practical cybersecurity project and an educational tool for people learning about web security.

## 👥 Who Can Use CyberGuard?

CyberGuard can be useful for:

- 👨‍💻 Web developers
- 🛡️ Cybersecurity students
- 🌐 Website owners
- 🏢 Small businesses
- 👨‍💼 IT professionals
- 🎓 Cybersecurity beginners

## 🔎 Website Security Scanner

The main feature of CyberGuard is its Website Security Scanner.

A user enters a website URL and CyberGuard performs a basic security configuration check.

The scanner checks:

- HTTPS
- HTTP Strict Transport Security (HSTS)
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

The scanner then produces a basic security score and displays the individual checks that passed or failed.

## 📊 Security Reports

Each scan can provide information such as:

- Website URL
- Hostname
- Protocol
- HTTP response status
- Security score
- Passed security checks
- Failed security checks
- Detected security headers

This makes the results easier to understand than simply displaying a score.

## 📚 Scan History

Authenticated users can view their previous scans from their dashboard.

Users can:

- Review previous scans
- Open detailed reports
- View previous security checks
- Review detected security headers

## 👤 User Accounts

CyberGuard uses Firebase Authentication for user accounts.

Users can:

- Create an account
- Log in
- Update their profile name
- Request a password reset
- Sign out

## 📝 Security Activity

CyberGuard includes a Security Activity section that records selected account actions.

Examples include:

- Dashboard access
- Profile updates
- Password-reset requests
- VPN interface activity
- Sign-out activity

## 👨‍💻 Admin Dashboard

CyberGuard includes an administrator area for authorized administrative tasks.

The admin dashboard can be used to manage messages submitted through the website's contact form.

## 📩 Contact / Let's Talk Security

Visitors can use the contact form to send security-related questions or messages.

Submitted messages can be reviewed by the authorized administrator through the admin dashboard.

## 🌐 VPN Interface

CyberGuard includes a VPN-style interface in the user dashboard.

Users can select a server and connect or disconnect from the interface.

### Important

The current VPN feature is a dashboard/interface simulation. It does not route the user's internet traffic through a VPN server or change the user's public IP address.

## 🔐 Security Features

CyberGuard includes several security-focused protections, including:

- Firebase Authentication
- Firestore security rules
- User-specific scan-history access
- User-specific activity-log access
- Protected administrative data
- HTTP security response headers
- Server-side URL validation
- Protection against requests to local/private network addresses
- HTTP/HTTPS protocol restrictions
- Standard port restrictions
- Request timeout protection
- Controlled redirect handling

## 🔌 Scanner API

The website scanner uses a server-side API route to process scan requests.

The API:

1. Receives the submitted website URL.
2. Validates the URL.
3. Checks the protocol.
4. Rejects unsupported ports.
5. Blocks local and private network targets.
6. Resolves the hostname before making the request.
7. Requests the target website.
8. Examines the HTTP response.
9. Checks the selected security headers.
10. Calculates the security score.
11. Returns the scan results to the application.

This design helps prevent the scanner from being used to make unrestricted requests to private or local network resources.

## 🛠️ Technologies Used

### Frontend

- Next.js
- React
- JavaScript
- Tailwind CSS

### Backend / Database

- Next.js API Routes
- Firebase Authentication
- Cloud Firestore

### Development Tools

- VS Code
- Git
- GitHub

### Deployment

- Vercel

## 🚀 Run CyberGuard Locally

### Requirements

- Node.js
- npm
- VS Code
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/elladaniel112/cyberguard.git
