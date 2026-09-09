# Integration

## Vendor copy (Astudio.am and similar hosts)

Copy the four files from `dist/` into the host, for example:

```
public/vendor/astudio-editor/
  custom-editor.js
  custom-editor.esm.js
  custom-editor.css
  custom-editor-embed.css
```

Edit `src/` first, then copy those four files into `dist/` so they stay the same.

## Plain HTML

```html
<link rel="stylesheet" href="/vendor/astudio-editor/custom-editor.css">

<div id="editor">
  <p>Hello from the Astudio editor.</p>
</div>

<script src="/vendor/astudio-editor/custom-editor.js"></script>
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

## npm / Vite / Webpack

```bash
npm install ./path/to/astudio-wysiwyg-html-editor
```

```js
import { ClassicEditor } from 'astudio-wysiwyg-editor';
import 'astudio-wysiwyg-editor/custom-editor.css';

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

## Demo

Open `examples/basic/demo.html` in a browser (double-click or serve the repo as static files). Add `?dev=1` to the URL for local image fallback and to skip CSRF (demo only).
