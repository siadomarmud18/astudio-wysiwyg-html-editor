# Upload contract and host security

## Upload contract

Set `uploadUrl` and the editor `POST`s `multipart/form-data` to it:

| Part | Value |
|------|-------|
| `image` | the selected file |
| `_token` | the `csrf` value, when provided |

Request headers: `Accept: application/json`, `X-Requested-With: XMLHttpRequest`,
and `X-CSRF-TOKEN` when `csrf` is set. Sent with
`credentials: 'same-origin'`, so a cookie session is included.

Respond `2xx` with JSON containing a `url`:

```json
{ "url": "https://cdn.example.com/uploads/2026/03/photo.jpg" }
```

The returned URL is sanitized before insertion, and is discarded if it falls
outside `uploadUrlPrefix`.

On failure return a non-2xx status. A `message` field (or Laravel-style
`errors.image[0]`) is shown to the author; HTTP 419 is reported as an expired
session. A server rejection is never replaced by a local preview, even when
`allowLocalImageFallback` is on.

**Your endpoint must re-validate everything.** The client-side file checks are a
usability filter: an attacker can POST to the endpoint directly. The server owns
authentication, size limits, content-type verification, re-encoding, the stored
filename, and the extension it serves.

## Security requirements for the host application

Everything the editor does runs in the browser, and an attacker posts straight
to your API without ever loading this JavaScript. These are non-negotiable for a
production deployment:

1. **Sanitize on the server** before storing and again before rendering. The
   editor's sanitizer improves what honest users get; it is not a boundary.
2. **Protect the upload endpoint.** Require an authenticated session plus a
   per-user upload permission, verify the CSRF token before reading the request
   body, and rate-limit per user and per IP.
3. **Validate uploaded files by content, not by name.** Check magic bytes,
   re-encode the image, and generate your own stored filename — never reuse the
   client's.
4. **Serve uploads from a path that cannot execute code**, with
   `X-Content-Type-Options: nosniff` and a `Content-Disposition` that does not
   invite inline rendering of unexpected types.
5. **Ship a Content-Security-Policy** on every page that renders editor content.

Minimum policy:

```
Content-Security-Policy:
  default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none';
  frame-src https://www.youtube-nocookie.com https://player.vimeo.com https://www.instagram.com https://www.tiktok.com;
  img-src 'self' https://cdn.example.com https://img.youtube.com;
  style-src 'self' 'unsafe-inline'; frame-ancestors 'self'
```

`script-src` without `'unsafe-inline'` neutralizes inline event handlers, which
is how nearly every stored-XSS payload is shaped. `style-src 'unsafe-inline'` is
required because the editor emits inline styles; drop it only if you strip
`style` attributes server-side.

Instagram and TikTok do **not** need extra `script-src` or `connect-src` on the
host page: the editor does not load `embed.js`. Only add the `frame-src` hosts
above on pages that publish those embeds. Do not set `frame-src *`.

## Upgrading notes

These behaviours changed for security. All are deliberate:

- **`uploadUrl` no longer defaults to a PHP endpoint.** The old value was
  path-relative, so on `/admin/posts/12/edit` it POSTed to
  `/admin/posts/12/api/…` rather than the app root. Set `uploadUrl` explicitly.
- **`uploadUrl` must be absolute `http(s)` or root-relative.** A path-relative
  value is rejected at upload time for the same reason, with an explicit error
  instead of a misdirected POST. Change `'admin/upload'` to `'/admin/upload'`.
- **`mediaHosts` entries are matched exactly.** Previously every entry acted as a
  wildcard suffix. Write `'*.example.com'` if you want subdomains.
- **`class` attributes in content are filtered against an allowlist.** Content
  could otherwise adopt the editor's own `.fe-modal` / `.fe-cpick` classes and
  become a full-viewport overlay. Use `allowedClasses` for your own classes.
- **Iframe `sandbox` no longer includes `allow-same-origin` by default.** That
  token is added only for parsed, allowlisted, cross-origin provider URLs.
  `allowHtmlIframe` still never grants it, and same-origin iframe `src` is
  rejected.
- **In-page `#fragment` links are no longer rewritten to bookmark ids.** Valid
  fragments such as `#top`, `#a_b`, `#1` and Unicode ids are preserved. Editor
  bookmarks still use the `anc-` prefix.
