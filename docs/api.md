# API

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
