## License

The Astudio WYSIWYG Rich HTML Editor base version is free to use forever.
Updates, upgrades, premium modules, support, integration, and customization
may be offered separately as paid products or services.

See [LICENSE.md](LICENSE.md) for the complete terms

## Install

### Plain HTML

Copy `src/custom-editor.js` and `src/custom-editor.css` into your project and
include them:

```html
<link rel="stylesheet" href="/vendor/custom-editor/custom-editor.css">

<div id="editor">
  <p>Hello from FreeEditor!</p>
</div>

<script src="/vendor/custom-editor/custom-editor.js"></script>
<script>
  ClassicEditor
    .create({
      attachTo: document.querySelector('#editor'),
      root: {
        placeholder: 'Type here...'
      },
      // Production upload (cookie session):
      // uploadUrl: '/admin/upload-image',
      // uploadUrlPrefix: 'https://cdn.example.com/uploads/',
      // csrf: window.csrfToken,
    })
    .then(function (editor) {
      // editor.getData()      → sanitized HTML string
      // editor.setData(html)  → HTML is sanitized on input
    })
    .catch(console.error);
</script>
```

The script defines the globals `ClassicEditor` and `FreeEditor`.

### npm / Vite / Webpack

```bash
npm install ./path/to/custom-editor
```

```js
import { ClassicEditor } from 'custom-editor';
import 'custom-editor/custom-editor.css';

ClassicEditor
  .create({
    attachTo: document.querySelector('#editor'),
    root: { placeholder: 'Type here...' },
    uploadUrl: '/admin/upload-image',
    uploadUrlPrefix: 'https://cdn.example.com/uploads/',
    csrf: window.csrfToken,
  })
  .then((editor) => {
    console.log(editor.getData());
  })
  .catch(console.error);
```

## API

### `ClassicEditor.create(config)` → `Promise<editor>`

| Option | Default | Description |
|--------|---------|-------------|
| `attachTo` | | Element or CSS selector (`'#editor'`) |
| `root.placeholder` | | Placeholder text |
| `uploadUrl` | `null` | Image upload endpoint returning `{ url }`. **Required for uploads** — no endpoint is guessed. Must be an absolute `http(s)` URL or a root-relative path (`/admin/upload-image`) |
| `uploadUrlPrefix` | | Reject upload responses outside this prefix. Matched on a `/`, `?` or `#` boundary, so `https://cdn.example.com` does not also accept `https://cdn.example.com.evil.tld` |
| `uploadImage` | | Custom `function(file) → url \| Promise<url>` (overrides `uploadUrl`) |
| `csrf` | | CSRF token (required when `requireCsrf` is true) |
| `requireCsrf` | `true` | Require CSRF for `uploadUrl` posts |
| `allowLocalImageFallback` | `false` | Dev-only blob URL fallback on network failure. Never masks a server rejection |
| `allowSvg` | `false` | Allow SVG uploads/URLs (not recommended) |
| `allowDataUrls` | `false` | Allow `data:` image URLs |
| `allowHtmlIframe` | `false` | Allow iframes from non-allowlisted HTTPS origins. Still sandboxed **without** `allow-same-origin`. Same-origin `src` is rejected. |
| `mediaHosts` | YouTube/Vimeo/Instagram/TikTok | Allowed iframe hosts. **Exact match**; use `'*.example.com'` for subdomains. Replacing this list disables the defaults unless you include them |
| `enabledVideoProviders` | all four | Named providers the media dialog recognises: `youtube`, `vimeo`, `instagram`, `tiktok`. Array (`['youtube','vimeo']`) or object (`{ tiktok: false }`). This is **not** a generic domain allowlist |
| `resolveTikTokShortUrl` | | Optional `function(shortUrl) → watchUrl \| Promise<watchUrl>` for `vt.tiktok.com` / `vm.tiktok.com` when oEmbed is unavailable. Return value must pass TikTok video-id validation |
| `allowedClasses` | | Extra class names content may keep (array or RegExp) |
| `maxImageBytes` | 5MB | Client-side size hint |
| `maxImagePixels` | 50MP | Client-side decoded-size hint |
| `name` | `content` | Hidden input name |
| `value` / `initialData` | | Override initial HTML (sanitized) |
| `footerHtml` | | Markup for the editor footer strip |
| `onChange` | | `function(html)` called on every edit |

Also works like older CKEditor: `ClassicEditor.create(element, config)`.

### Editor instance

| Method | Alias | Description |
|--------|-------|-------------|
| `getData()` | `getHTML()` | Get **sanitized** HTML |
| `setData(html)` | `setHTML(html)` | Set HTML (**sanitized** on input) |
| `focus()` | | Focus editor |
| `destroy()` | | Remove editor |

### Form / textarea

```js
FreeEditor.replace('#content', { placeholder: 'Write…' });
```

Textareas carrying `data-free-editor` are upgraded automatically on
`DOMContentLoaded`; call `FreeEditor.autoInit()` after injecting markup later.

### Security helpers

```js
FreeEditor.sanitizeHtml(html, options)
FreeEditor.sanitizeUrl(url, { purpose: 'href' | 'image' | 'media' | 'iframe' })
FreeEditor.validateImageFile(file, options)    // name/MIME gate
FreeEditor.inspectImageContent(file, options)  // magic bytes + dimensions
FreeEditor.uploadImageFile(file, options)      // full validated upload
FreeEditor.mediaEmbed(url, options)            // sanitized provider embed
```

## Video embeds

The editor recognises **named providers only**. User URLs are parsed with the
`URL` API; the hostname is matched exactly; only the media id is kept. Published
HTML uses an iframe `src` the editor constructs, never an unvalidated paste.

| Provider | Accepted URLs | Published iframe `src` |
|----------|---------------|------------------------|
| YouTube | `youtube.com/watch`, `/embed`, `/shorts`, `/live`, `/v`, `youtu.be`, `m.youtube.com`, `youtube-nocookie.com` | `https://www.youtube-nocookie.com/embed/{id}` |
| Vimeo | `vimeo.com/{id}`, `player.vimeo.com/video/{id}` | `https://player.vimeo.com/video/{id}` |
| Instagram | `instagram.com` / `www.instagram.com` + `/p/`, `/reel/`, `/reels/`, `/tv/` | `https://www.instagram.com/{p\|reel\|tv}/{id}/embed/` |
| TikTok | `tiktok.com` / `www.tiktok.com` / `m.tiktok.com` watch and player URLs; short links `vt.tiktok.com/{code}`, `vm.tiktok.com/{code}`, `tiktok.com/t/{code}` | `https://www.tiktok.com/player/v1/{id}` |

Sizing (editor preview uses `custom-editor.css`; `getData()` inlines the same layout so published pages work without the editor stylesheet):

- **YouTube / Vimeo:** unchanged 16:9 padding-bottom shim. Do not apply this to Instagram.
- **Instagram:** not 16:9 or 9:16. Published `<figure>` has `max-width: 540px` (official embed max). Height is the embed’s own pixel height (copied from the editor after Instagram `postMessage`). `scrolling="no"`, `overflow: hidden`.
- **TikTok:** published wrapper has inline `aspect-ratio: 9 / 16` (the player iframe is `position: absolute`). Figure width is `min(100%, calc(100vh * 9 / 16))` so the full video fits the viewport without a collapsed (0-height) box.

Published markup also carries `data-provider`, `data-video-id`, and Instagram `data-media-kind` on the `<figure>` so a host renderer does not have to re-parse HTML.

On public pages you may include only `custom-editor-embed.css` (Instagram/TikTok rules). Do **not** copy the full editor stylesheet. TikTok uses the official `player/v1/{id}` iframe; **do not** load `embed.js` or keep `blockquote` markup.

If the published page sets a Content-Security-Policy, allow `frame-src` for `https://www.instagram.com` and `https://www.tiktok.com` (YouTube/Vimeo hosts unchanged).

TikTok short URLs are **not** used as iframe `src`. The editor validates the short-link host and code, then resolves a video id via TikTok oEmbed (`https://www.tiktok.com/oembed?url=…` with the canonical short URL we built) or via `resolveTikTokShortUrl`. The final iframe is always `player/v1/{id}`. If oEmbed is CORS-blocked, provide:

```js
ClassicEditor.create({
  attachTo: document.querySelector('#editor'),
  resolveTikTokShortUrl: function (shortUrl) {
    return fetch('/resolve-tiktok?url=' + encodeURIComponent(shortUrl))
      .then(function (r) { return r.json(); })
      .then(function (data) { return data.url; }); // must be a www.tiktok.com/@user/video/{id} URL
  },
});
```

The host resolver must return a URL that passes `tiktokVideoId()` — arbitrary redirects are discarded.

Not accepted: lookalike hosts, path-spoofed URLs (`https://evil.example/instagram.com/…`),
`javascript:` / `data:` / credentialed URLs, or arbitrary iframe origins.

`allowHtmlIframe` stays **off**. Instagram and TikTok are implemented as
sandboxed provider iframes, not via `embed.js` / `blockquote` markup (that would
require allowing third-party scripts in content).

Disable a provider without opening arbitrary hosts:

```js
ClassicEditor.create({
  attachTo: document.querySelector('#editor'),
  enabledVideoProviders: { instagram: false, tiktok: false },
});
```

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

Everything FreeEditor does runs in the browser, and an attacker posts straight
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

## Upgrading

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

## Files

| File | Purpose |
|------|---------|
| `src/custom-editor.js` | Browser + CommonJS build (`ClassicEditor`, `FreeEditor`) |
| `src/custom-editor.esm.js` | ESM re-export for bundlers |
| `src/custom-editor.css` | Editor UI + embed preview styles |
| `src/custom-editor-embed.css` | Optional published-page Instagram/TikTok styles (not the editor UI) |
| `demo.html` | Open in a browser to try the editor |
| `package.json` | npm package metadata |

## License

MIT
