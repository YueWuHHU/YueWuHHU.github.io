# YueWuHHU.github.io — Encrypted Private Homepage

This version stores the resume/homepage body as AES-256-GCM encrypted payloads.

Security design:
- The plaintext password is NOT stored in JavaScript, HTML, README, or JSON files.
- A key is derived in the browser with PBKDF2-SHA256 (300,000 iterations).
- Page contents are decrypted with AES-256-GCM only after the correct password is entered.
- The derived key is kept only in sessionStorage for the current browser tab session.
- robots.txt and noindex metadata request that search engines do not index the site.

Important limitation:
This is still a static GitHub Pages site. An attacker can download the encrypted payloads and
attempt offline password guessing. Use a long, random password. Public portfolio files hosted
in a separate public repository remain public even if links to them are hidden behind this page.
