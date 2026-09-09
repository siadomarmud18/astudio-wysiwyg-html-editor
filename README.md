# Astudio WYSIWYG Rich HTML Editor

Standalone **source-available** rich HTML editor from **Astudio LLC**, Yerevan, Republic of Armenia.

Official website: [https://astudio.am/en](https://astudio.am/en)  
Public repository: [https://github.com/AstudioLLC/astudio-wysiwyg-html-editor](https://github.com/AstudioLLC/astudio-wysiwyg-html-editor)

The editor UI is **English only**. It is a zero-dependency browser editor with a CKEditor-style `ClassicEditor` / `FreeEditor` API, sanitization, image upload hooks, tables, links, anchors, and YouTube / Vimeo / Instagram / TikTok embeds.

This repository is independent of the Astudio.am Laravel application. Copy files from **`dist/`** into `public/vendor/astudio-editor/`. Edit the editor in **`src/`**, then copy the same files to `dist/` (they must stay identical).

## Requirements

A modern evergreen browser (current Chrome, Edge, Firefox, or Safari) with `contenteditable`, `fetch`, and `URL`. No Node.js runtime is required to use the editor. There is no compile/minify step.

## Install and demo

Copy `dist/custom-editor.js` and `dist/custom-editor.css` into your project (see [docs/integration.md](docs/integration.md)).

To try it locally, open **[examples/basic/demo.html](examples/basic/demo.html)** in a browser.

## Free forever (base version)

The **base version is free to use forever** in personal and commercial projects. No subscription or recurring fee is required to keep using a lawfully obtained base version.

**Optional paid items** (not required for the base version): future versions, updates, premium modules, support, integration, and customization.

This is **not** OSI-approved open source. See [docs/license-overview.md](docs/license-overview.md) and [LICENSE.md](LICENSE.md).

## License limitations

You may download, clone, fork on GitHub, modify for permitted use, and send pull requests to Astudio. You may **not** sell, rebrand, or redistribute this editor as a standalone competing product. Astudio LLC retains copyright and official distribution rights.

## Documentation

| Document | Contents |
|----------|----------|
| [docs/integration.md](docs/integration.md) | Vendor path, HTML/npm install, demo |
| [docs/api.md](docs/api.md) | Config, instance methods, media embeds |
| [docs/upload-and-security.md](docs/upload-and-security.md) | Upload contract, CSP, host duties |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Pull requests and issue reports |
| [SECURITY.md](SECURITY.md) | Vulnerability reporting |
| [CHANGELOG.md](CHANGELOG.md) | Version history |

## Repository layout

```
astudio-wysiwyg-html-editor/
├── .github/
├── docs/
├── examples/basic/
├── src/
├── dist/
├── tests/
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE.md
├── README.md
├── SECURITY.md
├── VERSION
└── package.json
```

| Path | Purpose |
|------|---------|
| `src/` | Files you edit |
| `dist/` | Same files, for websites and npm (`package.json` points here) |
| `examples/basic/demo.html` | Browser demo |
| `docs/` | Integration and API notes |
| `tests/` | No automated browser suite yet; `npm test` only checks JS syntax |
| `.github/` | Issue templates and CI |

## Copyright

Copyright (c) 2026 Astudio LLC. All rights reserved. Governing law: Republic of Armenia.
