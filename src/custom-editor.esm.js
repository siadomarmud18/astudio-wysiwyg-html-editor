/**
 * Astudio WYSIWYG Rich HTML Editor
 * Copyright (c) 2026 Astudio
 * Licensed under the terms in LICENSE.md
 */

/**
 * ESM entry for bundlers (Vite, Webpack, etc.):
 *
 *   import { ClassicEditor } from 'custom-editor';
 *   import 'custom-editor/custom-editor.css';
 *
 *   ClassicEditor.create({
 *     attachTo: document.querySelector('#editor'),
 *     root: { placeholder: 'Type here...' }
 *   });
 *
 * Loads the UMD build once, then re-exports ClassicEditor / FreeEditor.
 */

import "./custom-editor.js";

var FreeEditor = globalThis.FreeEditor;
var ClassicEditor = globalThis.ClassicEditor;

export { FreeEditor, ClassicEditor };
export default ClassicEditor;
