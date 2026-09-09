# Security

The Astudio WYSIWYG Rich HTML Editor runs in the browser. Its sanitizer improves HTML for honest authors. It is **not** a security boundary.

## Host application requirements

1. Sanitize HTML on the server before storing and again before rendering.
2. Protect the image upload endpoint: authenticated session, upload permission, CSRF verification, and rate limits.
3. Validate uploads by file content (magic bytes), re-encode images, and generate stored filenames on the server.
4. Serve uploads from a path that cannot execute code (`X-Content-Type-Options: nosniff`).
5. Ship a Content-Security-Policy on pages that render editor content.

Full upload and CSP details: [docs/upload-and-security.md](docs/upload-and-security.md).

## Reporting a vulnerability

Contact Astudio LLC through the official website: https://astudio.am/en

Do not file public GitHub issues for undisclosed security problems.

Copyright (c) 2026 Astudio LLC, Yerevan, Republic of Armenia.
