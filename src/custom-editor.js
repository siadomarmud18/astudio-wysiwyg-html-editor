(function (global, factory) {
  "use strict";
  const api = factory();
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = api;
    module.exports.FreeEditor = api.FreeEditor;
    module.exports.ClassicEditor = api.ClassicEditor;
    module.exports.default = api.ClassicEditor;
  }
  global.FreeEditor = api.FreeEditor;
  global.ClassicEditor = api.ClassicEditor;
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";

  const VERSION = "1.3.1";
  const DEFAULT_FONT_SIZE = "16";
  const FONT_SIZES = ["12", "14", "16", "18", "20", "24", "28", "32", "36"];
  const DEFAULT_TEXT_COLOR = "#000000";
  const TEXT_COLORS = [
    "#BFEDD2",
    "#FBEEB8",
    "#F8CAC6",
    "#ECCAFA",
    "#C2E0F4",
    "#2DC26B",
    "#F1C40F",
    "#E03E2D",
    "#B96AD9",
    "#3598DB",
    "#169179",
    "#E67E23",
    "#BA372A",
    "#843FA1",
    "#236FA1",
    "#FFFFFF",
    "#CED4D9",
    "#95A5A6",
    "#7E8C8D",
    "#34495E",
  ];

  const ICONS = {
    fullscreen: '<svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.3906 25.3899L37.5856 37.5849" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M25.3906 13.195L37.5856 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M37.5839 27.4221V37.5841H27.4219" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M37.5839 11.162V1H27.4219" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 27.4221V37.5841H11.162" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 37.5849L13.195 25.3899" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 11.162V1H11.162" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.195 13.195L1 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    undo: '<svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.062 19.125L1 10.062L10.062 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 10.063H20.031C22.6749 10.063 25.2106 11.1133 27.0801 12.9828C28.9497 14.8524 30 17.388 30 20.032C30 22.6759 28.9497 25.2116 27.0801 27.0811C25.2106 28.9507 22.6749 30.001 20.031 30.001H13.687" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    redo: '<svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.9375 19.125L29.9995 10.063L20.9375 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 10.063H10.969C8.32506 10.063 5.7894 11.1133 3.91985 12.9828C2.0503 14.8524 1 17.388 1 20.032C1 22.6759 2.0503 25.2116 3.91985 27.0811C5.7894 28.9507 8.32506 30.001 10.969 30.001H17.313" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bold: '<svg width="29" height="35" viewBox="0 0 29 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 17.376H19.424C21.5956 17.376 23.6782 18.2387 25.2138 19.7742C26.7493 21.3098 27.612 23.3924 27.612 25.564C27.612 27.7356 26.7493 29.8182 25.2138 31.3538C23.6782 32.8893 21.5956 33.752 19.424 33.752H3.047C2.50427 33.752 1.98376 33.5365 1.59991 33.1528C1.21605 32.7691 1.00027 32.2487 1 31.706V3.047C1 2.5041 1.21567 1.98344 1.59955 1.59955C1.98344 1.21567 2.5041 1 3.047 1H17.376C19.5476 1 21.6302 1.86266 23.1658 3.39821C24.7013 4.93376 25.564 7.01641 25.564 9.188C25.564 11.3596 24.7013 13.4422 23.1658 14.9778C21.6302 16.5133 19.5476 17.376 17.376 17.376" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    italic: '<svg width="29" height="33" viewBox="0 0 29 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28 1.00024H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 32.0002H1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 1.00024L8 32.0002" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    textColor:
      '<svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="fe-text-color-bar" d="M1 35.5859H35.586" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.32227 26.939L18.2923 1L31.2623 26.939" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.64648 18.293H26.9395" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    clearFormatting:
      '<svg width="31" height="33" viewBox="0 0 31 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28 1.00024H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 32.0002H1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 1.00024L8 32.0002" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 24.0002L30 32.0002" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 24.0002L22 32.0002" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    palette:
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path fill-rule="nonzero" d="M12 3a9 9 0 000 18 1.5 1.5 0 001.1-2.5c-.2-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H16a5 5 0 005-5c0-4.4-4-8-9-8zm-5.5 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3-4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/></svg>',
    link: '<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.0488 18.9673C14.7489 19.9031 15.6421 20.6774 16.6678 21.2377C17.6934 21.798 18.8276 22.1312 19.9933 22.2146C21.1591 22.2981 22.3291 22.1299 23.4241 21.7214C24.5192 21.313 25.5135 20.6738 26.3398 19.8473L31.2298 14.9573C31.9962 14.2027 32.6056 13.3038 33.023 12.3126C33.4404 11.3213 33.6574 10.2572 33.6616 9.18168C33.6657 8.10614 33.457 7.04041 33.0474 6.04593C32.6377 5.05145 32.0353 4.14789 31.2748 3.38733C30.5143 2.62677 29.6108 2.02426 28.6164 1.61454C27.6219 1.20481 26.5562 0.995972 25.4807 1.00006C24.4051 1.00415 23.341 1.22108 22.3497 1.63835C21.3584 2.05562 20.4595 2.66498 19.7048 3.4313L16.9048 6.2193" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.5685 15.7064C19.8683 14.7706 18.9752 13.9963 17.9495 13.436C16.9239 12.8757 15.7897 12.5425 14.624 12.459C13.4582 12.3756 12.2882 12.5438 11.1932 12.9522C10.0981 13.3607 9.10376 13.9999 8.27747 14.8264L3.38747 19.7164C2.63059 20.4732 2.03019 21.3717 1.62055 22.3605C1.21091 23.3493 1.00005 24.4092 1 25.4795C0.999954 26.5499 1.21073 27.6097 1.62028 28.5986C2.02984 29.5875 2.63016 30.486 3.38697 31.2429C4.14377 31.9998 5.04225 32.6002 6.03109 33.0098C7.01993 33.4194 8.07978 33.6303 9.15011 33.6303C10.2204 33.6304 11.2803 33.4196 12.2692 33.0101C13.2581 32.6005 14.1566 32.0002 14.9135 31.2434L17.7045 28.4544" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    anchor:
      '<svg width="29" height="37" viewBox="0 0 29 37" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.084 0.75C25.1154 0.75 26.1046 1.15973 26.8339 1.88906C27.5633 2.61839 27.973 3.60757 27.973 4.639V33.806C27.9731 34.1466 27.8837 34.4812 27.7137 34.7764C27.5438 35.0716 27.2993 35.3169 27.0047 35.4879C26.7101 35.6588 26.3758 35.7493 26.0352 35.7504C25.6946 35.7515 25.3597 35.6631 25.064 35.494L16.29 30.481C15.7025 30.1454 15.0376 29.9689 14.361 29.9689C13.6844 29.9689 13.0195 30.1454 12.432 30.481L3.659 35.494C3.36333 35.6631 3.02843 35.7515 2.68784 35.7504C2.34725 35.7493 2.01291 35.6588 1.71832 35.4879C1.42373 35.3169 1.17922 35.0716 1.00928 34.7764C0.839337 34.4812 0.749926 34.1466 0.75 33.806V4.639C0.75 3.60757 1.15973 2.61839 1.88906 1.88906C2.61839 1.15973 3.60757 0.75 4.639 0.75H24.084Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    upload:
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M11 16V7.85l-2.6 2.6L7 9l5-5 5 5-1.4 1.45-2.6-2.6V16h-2Zm-5 4q-.825 0-1.412-.587Q4 18.825 4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413Q18.825 20 18 20H6Z"/></svg>',
    lock:
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M6 22q-.825 0-1.412-.587Q4 20.825 4 20V10q0-.825.588-1.413Q5.175 8 6 8h1V6q0-2.075 1.463-3.538Q9.925 1 12 1t3.538 1.462Q17 3.925 17 6v2h1q.825 0 1.413.587Q20 9.175 20 10v10q0 .825-.587 1.413Q18.825 22 18 22H6Zm0-2h12V10H6v10Zm6-3q.825 0 1.413-.587Q14 15.825 14 15q0-.825-.587-1.413Q12.825 13 12 13q-.825 0-1.412.587Q10 14.175 10 15q0 .825.588 1.413Q11.175 17 12 17ZM9 8h6V6q0-1.25-.875-2.125T12 3q-1.25 0-2.125.875T9 6v2Z"/></svg>',
    unlock:
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M6 22q-.825 0-1.412-.587Q4 20.825 4 20V10q0-.825.588-1.413Q5.175 8 6 8h7V6q0-2.075 1.463-3.538Q15.925 1 18 1t3.537 1.462Q23 3.925 23 6h-2q0-1.25-.875-2.125T18 3q-1.25 0-2.125.875T15 6v2h3q.825 0 1.413.587Q20 9.175 20 10v10q0 .825-.587 1.413Q18.825 22 18 22H6Zm0-2h12V10H6v10Zm6-3q.825 0 1.413-.587Q14 15.825 14 15q0-.825-.587-1.413Q12.825 13 12 13q-.825 0-1.412.587Q10 14.175 10 15q0 .825.588 1.413Q11.175 17 12 17Z"/></svg>',
    image: '<svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M33.6504 0.649902H2.65039C1.54582 0.649902 0.650391 1.54533 0.650391 2.6499V33.6499C0.650391 34.7545 1.54582 35.6499 2.65039 35.6499H33.6504C34.755 35.6499 35.6504 34.7545 35.6504 33.6499V2.6499C35.6504 1.54533 34.755 0.649902 33.6504 0.649902Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.6504 16.6499C14.8595 16.6499 16.6504 14.859 16.6504 12.6499C16.6504 10.4408 14.8595 8.6499 12.6504 8.6499C10.4413 8.6499 8.65039 10.4408 8.65039 12.6499C8.65039 14.859 10.4413 16.6499 12.6504 16.6499Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M35.6504 23.9839L29.6504 17.9839C29.2893 17.6227 28.8605 17.3362 28.3887 17.1408C27.9168 16.9453 27.4111 16.8447 26.9004 16.8447C26.3897 16.8447 25.8839 16.9453 25.4121 17.1408C24.9403 17.3362 24.5115 17.6227 24.1504 17.9839L6.4834 35.6499" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    table: '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32.625 0.625H2.625C1.52043 0.625 0.625 1.52043 0.625 2.625V32.625C0.625 33.7296 1.52043 34.625 2.625 34.625H32.625C33.7296 34.625 34.625 33.7296 34.625 32.625V2.625C34.625 1.52043 33.7296 0.625 32.625 0.625Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M0.625 11.958H34.625" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M0.625 23.292H34.625" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.958 0.625V34.625" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M23.292 0.625V34.625" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    quote: '<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.8617 0.75C22.9186 0.75 22.0141 1.12465 21.3472 1.79153C20.6803 2.45841 20.3057 3.36289 20.3057 4.306V14.972C20.3057 15.9151 20.6803 16.8196 21.3472 17.4865C22.0141 18.1534 22.9186 18.528 23.8617 18.528C24.3332 18.528 24.7855 18.7153 25.1189 19.0488C25.4523 19.3822 25.6397 19.8344 25.6397 20.306V22.084C25.6397 23.0271 25.265 23.9316 24.5981 24.5985C23.9313 25.2654 23.0268 25.64 22.0837 25.64C21.6123 25.64 21.1602 25.8272 20.8268 26.1604C20.4934 26.4936 20.3059 26.9456 20.3057 27.417V30.973C20.3059 31.4444 20.4934 31.8964 20.8268 32.2296C21.1602 32.5628 21.6123 32.75 22.0837 32.75C24.9126 32.7497 27.6255 31.6258 29.6257 29.6254C31.626 27.6249 32.7497 24.9119 32.7497 22.083V4.306C32.7497 3.36306 32.3752 2.45873 31.7085 1.79188C31.0418 1.12503 30.1376 0.750265 29.1947 0.75H23.8617Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.306 0.75C3.36289 0.75 2.45841 1.12465 1.79153 1.79153C1.12465 2.45841 0.75 3.36289 0.75 4.306V14.972C0.75 15.9151 1.12465 16.8196 1.79153 17.4865C2.45841 18.1534 3.36289 18.528 4.306 18.528C4.77756 18.528 5.2298 18.7153 5.56324 19.0488C5.89668 19.3822 6.084 19.8344 6.084 20.306V22.084C6.084 23.0271 5.70935 23.9316 5.04247 24.5985C4.37559 25.2654 3.47111 25.64 2.528 25.64C2.05662 25.64 1.60453 25.8272 1.27112 26.1604C0.937707 26.4936 0.750265 26.9456 0.75 27.417V30.973C0.750265 31.4444 0.937707 31.8964 1.27112 32.2296C1.60453 32.5628 2.05662 32.75 2.528 32.75C5.35689 32.7497 8.06983 31.6258 10.0701 29.6254C12.0703 27.6249 13.194 24.9119 13.194 22.083V4.306C13.194 3.36306 12.8195 2.45873 12.1528 1.79188C11.4862 1.12503 10.5819 0.750265 9.639 0.75H4.306Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    media: '<svg width="41" height="37" viewBox="0 0 41 37" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26.3427 13.5229C26.5337 13.6334 26.6923 13.7922 26.8026 13.9833C26.9128 14.1745 26.9709 14.3913 26.9709 14.6119C26.9709 14.8326 26.9128 15.0494 26.8026 15.2405C26.6923 15.4317 26.5337 15.5904 26.3427 15.7009L18.4427 20.2739C18.2513 20.3856 18.0338 20.4446 17.8123 20.4449C17.5907 20.4451 17.3731 20.3867 17.1814 20.2756C16.9898 20.1644 16.831 20.0045 16.7213 19.812C16.6116 19.6196 16.5548 19.4015 16.5567 19.1799V10.0379C16.5563 9.81769 16.6138 9.60123 16.7236 9.41032C16.8334 9.21941 16.9916 9.06078 17.1821 8.95039C17.3727 8.84001 17.589 8.78175 17.8092 8.7815C18.0294 8.78124 18.2459 8.83898 18.4367 8.94892L26.3427 13.5229Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.7227 36H30.1667" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 1H3C1.89543 1 1 1.89543 1 3V26C1 27.1046 1.89543 28 3 28H38C39.1046 28 40 27.1046 40 26V3C40 1.89543 39.1046 1 38 1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ul: '<svg width="37" height="30" viewBox="0 0 37 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1H1.019" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 14.6111H1.019" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 28.2219H1.019" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.7227 1H36.0007" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.7227 14.6111H36.0007" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.7227 28.2219H36.0007" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ol: '<svg width="37" height="33" viewBox="0 0 37 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7246 2.93799H35.0996" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.7246 16.5H35.0996" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.7246 30.063H35.0996" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.16211 1H4.10011V10.688" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.16211 10.688H6.03711" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.006 32H1C1 30.063 6.037 28.27 6.037 25.219C6.03725 24.6348 5.8614 24.0641 5.53241 23.5813C5.20342 23.0985 4.73656 22.7261 4.19274 22.5127C3.64892 22.2992 3.05339 22.2546 2.48385 22.3847C1.91431 22.5148 1.3972 22.8136 1 23.242" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    alignLeft: '<svg width="31" height="25" viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M29.8982 1H1" stroke="#4A5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.2655 12.238H1" stroke="#4A5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M23.4764 23.4763H1" stroke="#4A5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    alignCenter: '<svg width="27" height="22" viewBox="0 0 27 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.6485 1H1" stroke="#4A5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.1721 10.5854H6.47852" stroke="#4A5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22.9093 20.1709H3.73828" stroke="#4A5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    alignRight: '<svg width="31" height="25" viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.00025 1H29.8984" stroke="#4A5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.633 12.2383H29.8984" stroke="#4A5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.42207 23.4766H29.8984" stroke="#4A5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    alignJustify: '<svg width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1H23.0986" stroke="#4A5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 9.59375H23.0986" stroke="#4A5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 18.1875H23.0986" stroke="#4A5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  const ALIGN_OPTIONS = [
    { id: "left", cmd: "justifyLeft", label: "Align left", icon: "alignLeft" },
    { id: "center", cmd: "justifyCenter", label: "Align center", icon: "alignCenter" },
    { id: "right", cmd: "justifyRight", label: "Align right", icon: "alignRight" },
    { id: "justify", cmd: "justifyFull", label: "Justify", icon: "alignJustify" },
  ];
  const DEFAULT_ALIGN = "justify";

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) {
      const val = attrs[key];
      if (val == null || val === false) return;
      if (key === "className") node.className = val;
      else if (key === "text") node.textContent = val;
      // `html` is for the library's own chrome (icon markup) only. It performs
      // no sanitization: never reach it with content, use `text` for that.
      else if (key === "html") node.innerHTML = val;
      else if (key === "title") node.title = val;
      else if (key.indexOf("on") === 0 && typeof val === "function") {
        node.addEventListener(key.slice(2).toLowerCase(), val);
      } else {
        node.setAttribute(key, val === true ? "" : String(val));
      }
    });
    (children || []).forEach(function (child) {
      if (child == null || child === false) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  function qs(sel, root) {
    if (typeof sel !== "string") return sel;
    return (root || document).querySelector(sel);
  }

  function saveSelection(editor) {
    let sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    let range = sel.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return null;
    return range.cloneRange();
  }

  function restoreSelection(range) {
    if (!range) return;
    try {
      let sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) {
    }
  }

  function focusEditor(editor, range) {
    editor.focus();
    if (range) restoreSelection(range);
  }

  function exec(cmd, value) {
    try {
      document.execCommand(cmd, false, value);
    } catch (e) {
    }
  }

  /**
   * Build a prototype-less lookup table (FE-025).
   *
   * A plain object literal inherits from Object.prototype, so every allowlist
   * check below silently answers "yes" for `constructor`, `toString`,
   * `valueOf` and friends. `style="constructor: …"`, `rel="constructor"` and
   * `allow="constructor"` all survived the filters because of that.
   */
  function nullMap(source) {
    const out = Object.create(null);
    Object.keys(source).forEach(function (key) {
      out[key] = source[key];
    });
    return out;
  }

  /** No implicit endpoint: uploads must be configured explicitly (FE-017). */
  const DEFAULT_UPLOAD_URL = null;
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
  const ALLOWED_IMAGE_MIME = nullMap({
    "image/jpeg": true,
    "image/jpg": true,
    "image/png": true,
    "image/webp": true,
    "image/gif": true,
  });
  const ALLOWED_IMAGE_EXT = nullMap({
    jpg: true,
    jpeg: true,
    png: true,
    webp: true,
    gif: true,
  });
  /**
   * Executable / server-interpreted extensions (FE-003). Matched against EVERY
   * dot-separated segment, so "shell.php.jpg" and "shell.jpg.php" both fail.
   */
  const DANGEROUS_UPLOAD_EXT = Object.create(null);
  ("php php3 php4 php5 php6 php7 php8 phps pht phtm phtml phar pgif " +
    "asp aspx asa asax ascx ashx asmx axd cer cshtml vbhtml config " +
    "jsp jspx jspf jsw jsv jhtml do action " +
    "cgi pl pm py rb sh bash zsh ksh csh " +
    "htaccess htpasswd ini inc " +
    "html htm shtml shtm xhtml xml xsl xslt svg svgz " +
    "js mjs cjs jse vbs vbe wsf wsh hta " +
    "exe dll com bat cmd scr msi msp cpl jar war ear class swf " +
    "cfm cfml cfc erb ejs twig tpl phtml7")
    .split(/\s+/)
    .forEach(function (ext) {
      if (ext) DANGEROUS_UPLOAD_EXT[ext] = true;
    });

  /** Magic-byte signatures for the accepted raster formats (FE-003, client-side hint). */
  const IMAGE_MAGIC = [
    { type: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
    { type: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
    { type: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61] },
    { type: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] },
    { type: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46], webp: true },
  ];

  /** Upper bound on decoded pixels, to blunt decompression bombs (FE-011). */
  const MAX_IMAGE_PIXELS = 50 * 1000 * 1000;
  const MAX_IMAGE_DIMENSION = 12000;

  const DEFAULT_MEDIA_HOSTS = [
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "youtu.be",
    "youtube-nocookie.com",
    "www.youtube-nocookie.com",
    "vimeo.com",
    "www.vimeo.com",
    "player.vimeo.com",
    "instagram.com",
    "www.instagram.com",
    "tiktok.com",
    "www.tiktok.com",
    "m.tiktok.com",
  ];

  /** Hostnames accepted for Instagram URL parsing (exact match). */
  const INSTAGRAM_HOSTS = nullMap({
    "instagram.com": true,
    "www.instagram.com": true,
  });

  /** Hostnames accepted for TikTok URL parsing (exact match). */
  const TIKTOK_HOSTS = nullMap({
    "tiktok.com": true,
    "www.tiktok.com": true,
    "m.tiktok.com": true,
  });

  /** Official TikTok short-link hosts (exact match). Never used as iframe src. */
  const TIKTOK_SHORT_HOSTS = nullMap({
    "vt.tiktok.com": true,
    "vm.tiktok.com": true,
  });

  const INSTAGRAM_ID_RE = /^[A-Za-z0-9_-]{5,32}$/;
  const TIKTOK_ID_RE = /^\d{5,20}$/;
  const TIKTOK_SHORT_CODE_RE = /^[A-Za-z0-9]{5,24}$/;

  /** Allowed tags → allowed attributes (plus global safe attrs applied separately). */
  const HTML_ALLOWED_TAGS = nullMap({
    p: true,
    div: true,
    span: true,
    br: true,
    strong: true,
    b: true,
    em: true,
    i: true,
    u: true,
    s: true,
    strike: true,
    sub: true,
    sup: true,
    h1: true,
    h2: true,
    h3: true,
    h4: true,
    h5: true,
    h6: true,
    blockquote: true,
    ul: true,
    ol: true,
    li: true,
    a: true,
    img: true,
    table: true,
    thead: true,
    tbody: true,
    tfoot: true,
    tr: true,
    th: true,
    td: true,
    figure: true,
    video: true,
    hr: true,
    pre: true,
    code: true,
    iframe: true,
  });
  const HTML_FORBIDDEN_TAGS = nullMap({
    script: true,
    style: true,
    object: true,
    embed: true,
    form: true,
    base: true,
    link: true,
    meta: true,
    input: true,
    button: true,
    textarea: true,
    select: true,
    option: true,
    svg: true,
    math: true,
    applet: true,
    frame: true,
    frameset: true,
    template: true,
    noscript: true,
    xmp: true,
    noembed: true,
    plaintext: true,
  });
  /**
   * Styles allowed on ordinary content. `position`/`top`/`left`/`right`/
   * `bottom`/`overflow` are absent on purpose: they let stored content lift
   * itself out of the content box and overlay the host UI (FE-007). They are
   * allowed only inside the editor's own media widget, via LAYOUT_STYLE_PROPS.
   */
  const SAFE_STYLE_PROPS = nullMap({
    color: true,
    "background-color": true,
    "font-size": true,
    "font-weight": true,
    "font-style": true,
    "text-align": true,
    "text-decoration": true,
    width: true,
    height: true,
    "max-width": true,
    "min-width": true,
    "max-height": true,
    margin: true,
    "margin-left": true,
    "margin-right": true,
    "margin-top": true,
    "margin-bottom": true,
    padding: true,
    "padding-left": true,
    "padding-right": true,
    "padding-top": true,
    "padding-bottom": true,
    display: true,
    "vertical-align": true,
    border: true,
    "border-collapse": true,
    "border-spacing": true,
    "table-layout": true,
    "line-height": true,
    "white-space": true,
  });

  /** Extra styles allowed only inside figure.fe-media (responsive embed shim). */
  const LAYOUT_STYLE_PROPS = nullMap({
    position: true,
    top: true,
    left: true,
    right: true,
    bottom: true,
    overflow: true,
    "aspect-ratio": true,
  });

  /** Provider frame proportions. Keys are named specs, not iframe presence. */
  const MEDIA_FRAME_SPECS = nullMap({
    youtube: { fit: "forced", w: 16, h: 9, paddingBottom: "56.25%" },
    vimeo: { fit: "forced", w: 16, h: 9, paddingBottom: "56.25%" },
    "instagram-post": { fit: "embed", provider: "instagram", maxWidthPx: 540 },
    "instagram-reel": { fit: "embed", provider: "instagram", maxWidthPx: 540 },
    "instagram-video": { fit: "embed", provider: "instagram", maxWidthPx: 540 },
    tiktok: { fit: "embed", provider: "tiktok", w: 9, h: 16 },
  });

  /** aspect-ratio values the shim may emit or keep (FE-007). */
  const SAFE_ASPECT_RATIO_RE = /^(16\s*\/\s*9|9\s*\/\s*16|1\s*\/\s*1)$/;

  /**
   * Elements the responsive-embed shim actually positions (FE-026).
   *
   * `position: absolute` inside figure.fe-media used to be granted to any
   * descendant, so stored content could ship
   * `<figure class="fe-media"><div style="position:absolute;…">` and paint a
   * full-page box over the host UI — the exact takeover FE-007 blocks
   * everywhere else. Only the player elements need it.
   */
  const ABSOLUTE_POSITION_TAGS = nullMap({ iframe: true, video: true, img: true });

  /** Offsets the shim uses. Anything else is an overlay attempt (FE-026). */
  const SAFE_OFFSET_VALUE_RE = /^(0|0px|0%|auto|inherit|initial|unset)$/i;

  /** Largest length any single dimension-ish declaration may carry (FE-007). */
  const MAX_STYLE_LENGTH_PX = 4000;

  /**
   * Classes stored content may keep (FE-006). A character filter is not
   * enough: this library's own stylesheet gives `.fe-modal`, `.fe-cpick` and
   * `.is-fullscreen` a fixed, full-viewport, high z-index box, so content that
   * can name them overlays the host UI without any style attribute.
   * Integrators extend this via the `allowedClasses` option.
   */
  const CONTENT_CLASS_RE =
    /^(fe-img|fe-img--selected|fe-table|fe-align-wrap|fe-align-wrap--left|fe-align-wrap--center|fe-align-wrap--right|fe-media|fe-media--preview|fe-media--instagram|fe-media--tiktok|fe-media--ratio-16x9|fe-media--ratio-9x16|fe-media--ratio-1x1|fe-media__wrapper|fe-media__preview|fe-media__preview--vimeo|fe-media__preview--instagram|fe-media__preview--tiktok|fe-media__play|fe-media__label|fe-anchor|editor-body|editor-footer|editor-footer-link|fe-wordcount)$/;

  /**
   * In-page bookmark ids (FE-024). Stored as `anc-` + user name so they cannot
   * collide with editor chrome (`fe-*`) or clobber `window`/`document`
   * properties — a hyphenated id is not a JS identifier.
   *
   * User-facing names: lowercase letters, digits, hyphens; must start with a
   * letter; max 48 chars. The sanitizer is the only path that may write `id`.
   */
  const ANCHOR_PREFIX = "anc-";
  /** User-facing bookmark names (editor chrome ids). Fragments use a wider grammar. */
  const ANCHOR_NAME_RE = /^[a-z][a-z0-9-]{0,47}$/;
  const FRAGMENT_HREF_MAX = 256;
  const ANCHOR_RESERVED_NAMES = nullMap({
    constructor: true,
    prototype: true,
    tostring: true,
    valueof: true,
    hasownproperty: true,
    document: true,
    window: true,
    location: true,
    cookie: true,
    body: true,
    head: true,
    forms: true,
    images: true,
    links: true,
    scripts: true,
    length: true,
    item: true,
    nameditem: true,
    attributes: true,
    children: true,
    parentnode: true,
    innerhtml: true,
    outerhtml: true,
    submit: true,
    reset: true,
    defaultview: true,
    activeelement: true,
    createelement: true,
    getelementbyid: true,
    queryselector: true,
  });
  // Not expressible in the literal above: `__proto__:` sets a prototype
  // instead of defining a key. ANCHOR_NAME_RE already rejects it; keep the
  // entry so the reserved list stays true on its own terms.
  ANCHOR_RESERVED_NAMES.__proto__ = true;

  function hasFeAnchorClass(el) {
    return !!(el && /(^|\s)fe-anchor(\s|$)/.test(el.getAttribute("class") || ""));
  }

  function displayAnchorName(id) {
    let value = String(id == null ? "" : id);
    if (value.indexOf(ANCHOR_PREFIX) === 0) return value.slice(ANCHOR_PREFIX.length);
    return value;
  }

  /**
   * Returns a stored bookmark id (`anc-…`) or "". Never pass the raw field
   * value to setAttribute/innerHTML.
   */
  function sanitizeAnchorId(raw) {
    let name = String(raw == null ? "" : raw).trim().toLowerCase();
    if (!name) return "";
    if (name.indexOf(ANCHOR_PREFIX) === 0) name = name.slice(ANCHOR_PREFIX.length);
    if (!ANCHOR_NAME_RE.test(name)) return "";
    if (ANCHOR_RESERVED_NAMES[name]) return "";
    if (name.indexOf("fe-") === 0) return "";
    return ANCHOR_PREFIX + name;
  }

  /**
   * In-page fragment hrefs (`#top`, `#a_b`, `#пример`). Distinct from
   * bookmark ids: do not rewrite, prefix, or lowercase valid fragments.
   */
  function sanitizeFragmentHref(raw) {
    let url = String(raw == null ? "" : raw).trim();
    if (!url || url.charAt(0) !== "#") return "";
    if (url.indexOf("://") !== -1) return "";
    if (URL_FORBIDDEN_CHARS_RE.test(url)) return "";
    let id = url.slice(1);
    if (!id) return "#";
    if (id.length > FRAGMENT_HREF_MAX) return "";
    if (id.indexOf("#") !== -1) return "";
    if (/[\u0000-\u001F\u007F\s]/.test(id)) return "";
    let decoded = decodeUrlLoosely(id);
    if (/[\u0000-\u001F\u007F\s]/.test(decoded)) return "";
    let probe = stripSchemeNoise(decoded);
    if (/^(javascript|vbscript|data|blob|file):/.test(probe)) return "";
    return "#" + id;
  }

  /** Link relationship tokens content may keep (FE-016). */
  const SAFE_REL_TOKENS = nullMap({
    nofollow: true,
    noopener: true,
    noreferrer: true,
    ugc: true,
    sponsored: true,
    external: true,
  });

  function normalizeEnabledVideoProviders(raw) {
    let out = nullMap({
      youtube: true,
      vimeo: true,
      instagram: true,
      tiktok: true,
    });
    if (raw == null) return out;
    if (Array.isArray(raw)) {
      out.youtube = false;
      out.vimeo = false;
      out.instagram = false;
      out.tiktok = false;
      raw.forEach(function (item) {
        let name = String(item || "").toLowerCase();
        if (
          name === "youtube" ||
          name === "vimeo" ||
          name === "instagram" ||
          name === "tiktok"
        ) {
          out[name] = true;
        }
      });
      return out;
    }
    if (typeof raw === "object") {
      if (raw.youtube != null) out.youtube = !!raw.youtube;
      if (raw.vimeo != null) out.vimeo = !!raw.vimeo;
      if (raw.instagram != null) out.instagram = !!raw.instagram;
      if (raw.tiktok != null) out.tiktok = !!raw.tiktok;
    }
    return out;
  }

  function isProviderEnabled(securityOptions, name) {
    let map =
      (securityOptions && securityOptions.enabledVideoProviders) ||
      normalizeEnabledVideoProviders(null);
    return name === "youtube" || name === "vimeo" || name === "instagram" || name === "tiktok"
      ? !!map[name]
      : false;
  }

  /**
   * Default iframe sandbox (FE-008 / FE-018 / ISSUE-1).
   *
   * `allow-same-origin` + `allow-scripts` is a sandbox escape when the frame
   * document is same-origin with the host: the frame can read
   * `parent.document.cookie`, drop `sandbox`, and mutate the parent DOM.
   * Never put `allow-same-origin` on the default list. Trusted, parsed,
   * cross-origin provider hosts may opt in via iframeSandboxForSrc().
   */
  const IFRAME_SANDBOX_BASE =
    "allow-scripts allow-presentation allow-popups allow-popups-to-escape-sandbox";
  const IFRAME_SANDBOX_TRUSTED = IFRAME_SANDBOX_BASE + " allow-same-origin";
  /** @deprecated use iframeSandboxForSrc(); kept as the safe default. */
  const IFRAME_SANDBOX = IFRAME_SANDBOX_BASE;

  /**
   * Permissions a media embed may legitimately request. Anything else in an
   * `allow` attribute is dropped rather than translated (FE-008).
   */
  const IFRAME_ALLOW_FEATURES = nullMap({
    accelerometer: true,
    autoplay: true,
    "encrypted-media": true,
    fullscreen: true,
    gyroscope: true,
    "picture-in-picture": true,
    "web-share": true,
  });

  function mergeSecurityOptions(options) {
    options = options || {};
    let hosts = options.mediaHosts;
    if (!hosts || !hosts.length) hosts = DEFAULT_MEDIA_HOSTS.slice();

    let extraClasses = options.allowedClasses;
    let classRe = null;
    if (extraClasses instanceof RegExp) {
      classRe = extraClasses;
    } else if (extraClasses && extraClasses.length) {
      classRe = new RegExp(
        "^(" +
          Array.prototype.map
            .call(extraClasses, function (c) {
              return String(c).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            })
            .join("|") +
          ")$"
      );
    }

    return {
      allowSvg: !!options.allowSvg,
      allowDataUrls: !!options.allowDataUrls,
      allowHtmlIframe: !!options.allowHtmlIframe,
      allowLocalImageFallback: !!options.allowLocalImageFallback,
      requireCsrf:
        options.requireCsrf == null ? true : !!options.requireCsrf,
      maxImageBytes:
        options.maxImageBytes > 0 ? options.maxImageBytes : MAX_IMAGE_BYTES,
      maxImagePixels:
        options.maxImagePixels > 0 ? options.maxImagePixels : MAX_IMAGE_PIXELS,
      /** Matched EXACTLY unless written as "*.example.com" (FE-014). */
      mediaHosts: hosts.map(function (h) {
        return String(h).toLowerCase().replace(/\.$/, "");
      }),
      /**
       * Named providers the media dialog / serializer will recognise.
       * This is not a generic domain list — unknown names are ignored.
       */
      enabledVideoProviders: normalizeEnabledVideoProviders(
        options.enabledVideoProviders
      ),
      /**
       * Optional host hook: short TikTok URL → canonical watch URL.
       * Must return a string (or Promise) that tiktokVideoId() accepts.
       */
      resolveTikTokShortUrl:
        typeof options.resolveTikTokShortUrl === "function"
          ? options.resolveTikTokShortUrl
          : null,
      allowedClasses: classRe,
      /** Returned upload URLs must start with this, when set (FE-012). */
      uploadUrlPrefix: options.uploadUrlPrefix || null,
      uploadUrl: options.uploadUrl,
      csrf: options.csrf,
      uploadImage: options.uploadImage,
    };
  }

  function decodeUrlLoosely(value) {
    let cur = String(value || "");
    for (let i = 0; i < 3; i++) {
      try {
        let next = decodeURIComponent(cur.replace(/\+/g, " "));
        if (next === cur) break;
        cur = next;
      } catch (e) {
        break;
      }
    }
    return cur;
  }

  function stripSchemeNoise(value) {
    return String(value || "")
      .replace(/[\u0000-\u001F\u007F\s]+/g, "")
      .toLowerCase();
  }

  /**
   * Exact hostname match, with opt-in wildcards (FE-014). A suffix match would
   * mean one custom host with registrable subdomains widens the whole list.
   *
   *   "example.com"    → only example.com
   *   "*.example.com"  → example.com and any subdomain
   */
  function isAllowedMediaHost(hostname, hosts) {
    hostname = String(hostname || "").toLowerCase().replace(/\.$/, "");
    if (!hostname) return false;
    for (let i = 0; i < hosts.length; i++) {
      let allowed = String(hosts[i] || "").toLowerCase().replace(/\.$/, "");
      if (!allowed) continue;
      if (allowed.indexOf("*.") === 0) {
        let base = allowed.slice(2);
        if (!base) continue;
        if (hostname === base) return true;
        if (hostname.slice(-(base.length + 1)) === "." + base) return true;
        continue;
      }
      if (hostname === allowed) return true;
    }
    return false;
  }

  function parseHttpsIframeUrl(raw) {
    let str = String(raw == null ? "" : raw).trim();
    if (!str) return null;
    let parsed;
    try {
      parsed = new URL(str);
    } catch (e) {
      return null;
    }
    if (parsed.protocol !== "https:") return null;
    if (parsed.username || parsed.password) return null;
    let host = parsed.hostname.toLowerCase().replace(/\.$/, "");
    if (!host) return null;
    return parsed;
  }

  function pageLocation() {
    try {
      if (typeof window !== "undefined" && window.location) return window.location;
    } catch (e) {}
    try {
      if (typeof location !== "undefined") return location;
    } catch (e2) {}
    return null;
  }

  function isSameOriginAsPage(parsed) {
    if (!parsed) return false;
    let loc = pageLocation();
    if (!loc) return false;
    try {
      if (!loc.origin || loc.origin === "null") {
        return loc.protocol === "file:" && parsed.protocol === "file:";
      }
      return parsed.origin === loc.origin;
    } catch (e) {
      return false;
    }
  }

  /**
   * sandbox value for an iframe src that has already been accepted.
   * `allow-same-origin` only when the host is an allowlisted provider AND the
   * frame is not same-origin with the host page (ISSUE-1).
   */
  function iframeSandboxForSrc(src, securityOptions) {
    let parsed = parseHttpsIframeUrl(src);
    if (!parsed || !pageLocation() || isSameOriginAsPage(parsed)) {
      return IFRAME_SANDBOX_BASE;
    }
    let hosts =
      (securityOptions && securityOptions.mediaHosts) || DEFAULT_MEDIA_HOSTS;
    if (!isAllowedMediaHost(parsed.hostname, hosts)) return IFRAME_SANDBOX_BASE;
    return IFRAME_SANDBOX_TRUSTED;
  }

  /**
   * Characters that must be percent-encoded in a real URL (FE-009). Letting
   * quotes or angle brackets through leaves every string-concatenated HTML
   * builder in this file one edit away from attribute injection.
   */
  const URL_FORBIDDEN_CHARS_RE = /["'<>`\\{}|^]/;

  /**
   * Central URL validator/sanitizer. Returns a safe URL string or "".
   * purpose: "href" | "image" | "media" | "iframe"
   *
   * Decisions are made on a PARSED URL, never on raw-string prefixes. The
   * WHATWG parser treats "\" as "/" for special schemes, so "/\evil.com" is a
   * scheme-relative URL that a /^\/\// guard never sees (FE-005).
   *
   * Client-side only — backends must still validate independently.
   */
  function sanitizeUrl(raw, opts) {
    opts = opts || {};
    let purpose = opts.purpose || "href";
    let url = String(raw == null ? "" : raw).trim();
    if (!url) return "";
    if (/[\u0000-\u001F\u007F]/.test(url)) return "";

    let decoded = decodeUrlLoosely(url);
    let schemeProbe = stripSchemeNoise(decoded);

    if (/^(javascript|vbscript|file):/.test(schemeProbe)) return "";

    if (/^data:/.test(schemeProbe)) {
      if (
        opts.allowDataUrls &&
        purpose === "image" &&
        /^data:image\/(png|jpe?g|gif|webp);base64,[a-z0-9+/=]+$/i.test(schemeProbe)
      ) {
        return url;
      }
      return "";
    }

    if (/^blob:/.test(schemeProbe)) {
      // Previously returned the raw string unchecked, so `blob:javascript:…`
      // and quote-bearing values survived a validator whose whole job is to
      // guarantee neither can (FE-027). URL.createObjectURL() always produces
      // `blob:<origin>/<uuid>`, so holding it to that costs nothing.
      if (!opts.allowBlobUrls || purpose !== "image") return "";
      if (URL_FORBIDDEN_CHARS_RE.test(url)) return "";
      if (!/^blob:https?:\/\/[^\s]+$/i.test(url)) return "";
      return url;
    }

    // Checked after the data:/blob: branches, which have their own stricter
    // grammar above (FE-009).
    if (URL_FORBIDDEN_CHARS_RE.test(url)) return "";

    // Fragment-only links never leave the page. Preserve valid HTML fragments
    // (`#top`, `#1`, Unicode). Bookmark ids (`anc-…`) still go through
    // sanitizeAnchorId when written onto span.fe-anchor.
    if (url.charAt(0) === "#") {
      if (purpose !== "href") return "";
      return sanitizeFragmentHref(url);
    }

    // A bare hostname typed into the link dialog gets an https scheme.
    if (!/^[a-z][a-z0-9+.-]*:/i.test(url) && url.charAt(0) !== "/") {
      if (purpose === "href") url = "https://" + url;
      else return "";
    }

    // mailto:/tel: have no host component — parse but do not host-check.
    if (/^(mailto|tel):/i.test(url)) {
      return purpose === "href" ? url : "";
    }

    // Everything else goes through the real URL parser. Root-relative input is
    // resolved against a synthetic base so it can be validated the same way.
    const RELATIVE_BASE = "https://fe-relative.invalid/";
    let wasRelative = url.charAt(0) === "/";
    let parsed;
    try {
      parsed = new URL(url, RELATIVE_BASE);
    } catch (e) {
      return "";
    }

    if (wasRelative) {
      // "//host" and "/\host" both parse as scheme-relative: the parser
      // resolved them to a different origin than the synthetic base.
      if (parsed.origin !== RELATIVE_BASE.slice(0, -1)) return "";
      if (purpose === "iframe") return "";
      return parsed.pathname + parsed.search + parsed.hash;
    }

    if (purpose === "href" || purpose === "image" || purpose === "media") {
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "";
      return parsed.href;
    }

    if (purpose === "iframe" || purpose === "iframe-open") {
      if (parsed.protocol !== "https:") return "";
      // Reject embedded credentials outright instead of trusting host parsing.
      if (parsed.username || parsed.password) return "";
      let host = parsed.hostname.toLowerCase().replace(/\.$/, "");
      if (!host) return "";
      if (isSameOriginAsPage(parsed)) return "";
      if (purpose === "iframe") {
        if (!isAllowedMediaHost(parsed.hostname, opts.mediaHosts || DEFAULT_MEDIA_HOSTS)) {
          return "";
        }
      }
      return parsed.href;
    }

    return "";
  }

  function normalizeHref(url, securityOptions) {
    return sanitizeUrl(url, {
      purpose: "href",
      allowDataUrls: !!(securityOptions && securityOptions.allowDataUrls),
    });
  }

  /**
   * @param {string} styleText raw style attribute
   * @param {boolean} [allowLayout] true only inside figure.fe-media, where the
   *   editor's own responsive-embed shim needs position/top/left/overflow.
   * @param {string} [tag] lowercased tag name, used to keep `position:
   *   absolute` on the elements the shim actually positions (FE-026).
   */
  function compactCssVal(val) {
    return String(val || "")
      .replace(/\s*!important\s*/gi, "")
      .replace(/\s+/g, "")
      .toLowerCase();
  }

  /**
   * Word / Google Docs paste copies computed styles onto every span.
   * White backgrounds, `display: inline !important`, and other defaults then
   * paint over the host page. Drop those; keep real author intent.
   */
  function isPasteNoiseStyle(prop, val, tag) {
    let v = compactCssVal(val);
    if (!v) return true;
    if (prop === "background-color") {
      return (
        v === "transparent" ||
        v === "inherit" ||
        v === "initial" ||
        v === "unset" ||
        v === "none" ||
        v === "white" ||
        v === "#fff" ||
        v === "#ffffff" ||
        v === "rgb(255,255,255)" ||
        /^rgba\(255,255,255,(0|0*\.?0*|1|1\.0*)\)$/.test(v)
      );
    }
    if (prop === "display" && v === "inline") return true;
    if (prop === "white-space" && v === "normal") return true;
    if (prop === "font-style" && v === "normal") return true;
    if (prop === "font-weight" && (v === "400" || v === "normal")) return true;
    if (prop === "text-align" && tag === "span") return true;
    return false;
  }

  function sanitizeStyleValue(styleText, allowLayout, tag) {
    if (!styleText) return "";
    let parts = String(styleText).split(";");
    let out = [];
    for (let i = 0; i < parts.length; i++) {
      let chunk = parts[i];
      if (!chunk || chunk.indexOf(":") === -1) continue;
      let idx = chunk.indexOf(":");
      let prop = chunk.slice(0, idx).trim().toLowerCase();
      let val = chunk.slice(idx + 1).trim().replace(/\s*!important\s*/gi, "").trim();
      let isLayoutProp = !SAFE_STYLE_PROPS[prop] && !!LAYOUT_STYLE_PROPS[prop];
      let allowed = SAFE_STYLE_PROPS[prop] || (allowLayout && isLayoutProp);
      if (!allowed) continue;
      if (isPasteNoiseStyle(prop, val, tag)) continue;
      if (/expression\s*\(|url\s*\(|-moz-binding|behavior|javascript:|vbscript:|data:/i.test(val)) {
        continue;
      }
      // CSS escapes and comments can reconstruct blocked tokens (\75 rl(...)).
      if (/\\|\/\*/.test(val)) continue;
      if (prop === "position") {
        if (!/^(relative|static|absolute)$/i.test(val)) continue;
        // Taking an arbitrary descendant out of flow is how stored content
        // paints over the host page (FE-026). The shim only ever needs it on
        // the player itself.
        if (/^absolute$/i.test(val) && !ABSOLUTE_POSITION_TAGS[tag]) continue;
      }
      // Offsets exist for the shim's `top: 0; left: 0`, not for dragging a
      // box somewhere else on the page (FE-026).
      if (prop === "aspect-ratio") {
        if (!SAFE_ASPECT_RATIO_RE.test(val)) continue;
      }
      if (
        isLayoutProp &&
        prop !== "position" &&
        prop !== "overflow" &&
        prop !== "aspect-ratio"
      ) {
        if (!SAFE_OFFSET_VALUE_RE.test(val)) continue;
      }
      // Cap lengths so content cannot blow out the host layout (FE-007).
      if (!isReasonableLength(val)) continue;
      out.push(prop + ": " + val);
    }
    return out.join("; ");
  }

  /** Absolute units, expressed in px per unit. */
  const ABSOLUTE_UNIT_PX = nullMap({
    px: 1,
    pt: 96 / 72,
    pc: 16,
    in: 96,
    cm: 96 / 2.54,
    mm: 96 / 25.4,
    q: 96 / 101.6,
  });

  /**
   * Font- and viewport-relative units. Capping these matters as much as px:
   * `width: 99999em` resolves to well over a million pixels, so leaving them
   * unbounded made the FE-007 ceiling trivially avoidable. The limits are far
   * above any real typographic value.
   */
  const RELATIVE_UNIT_MAX = nullMap({
    em: 300,
    rem: 300,
    ch: 500,
    ex: 500,
    vw: 300,
    vh: 300,
    vmin: 300,
    vmax: 300,
  });

  /**
   * Reject declarations carrying an absurd length. Percentages and `auto` are
   * left alone: `width: 100%` and `padding-bottom: 56.25%` are load-bearing
   * for the 16:9 responsive-embed shim, and a percentage is bounded by whatever
   * container the host page provides. Instagram/TikTok frames use `aspect-ratio`
   * instead, restricted to 16/9, 9/16, and 1/1.
   */
  function isReasonableLength(val) {
    // Exponent notation is valid CSS — `width: 1e9px` computes to 1000000000px —
    // so the number pattern must cover it, not just plain decimals.
    let m = String(val).match(
      /(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)\s*(px|pt|pc|in|cm|mm|q|rem|em|ch|ex|vmin|vmax|vw|vh)\b/gi
    );
    if (!m) return true;
    for (let i = 0; i < m.length; i++) {
      let n = parseFloat(m[i]);
      let unit = String(m[i]).replace(/[-\d.\s]/g, "").toLowerCase();
      // "1e9px" loses its exponent to the strip above; re-read it off the number.
      if (unit.indexOf("e") === 0 && unit !== "em" && unit !== "ex") {
        unit = unit.replace(/^e[+-]?/, "");
      }
      let scale = ABSOLUTE_UNIT_PX[unit];
      if (scale != null) {
        if (Math.abs(n * scale) > MAX_STYLE_LENGTH_PX) return false;
        continue;
      }
      let max = RELATIVE_UNIT_MAX[unit];
      if (max != null && Math.abs(n) > max) return false;
    }
    return true;
  }

  /** Keep only allowlisted class tokens (FE-006). */
  function sanitizeClassList(value, securityOptions) {
    let tokens = String(value || "").split(/\s+/);
    let kept = [];
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i].replace(/[^\w\-]/g, "");
      if (!token) continue;
      if (CONTENT_CLASS_RE.test(token)) {
        kept.push(token);
        continue;
      }
      if (
        securityOptions &&
        securityOptions.allowedClasses &&
        securityOptions.allowedClasses.test(token)
      ) {
        kept.push(token);
      }
    }
    return kept.join(" ");
  }

  /** Keep only meaningful, safe rel tokens (FE-016). */
  function sanitizeRel(value) {
    let tokens = String(value || "").toLowerCase().split(/\s+/);
    let kept = [];
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i].replace(/[^a-z-]/g, "");
      if (token && SAFE_REL_TOKENS[token] && kept.indexOf(token) === -1) {
        kept.push(token);
      }
    }
    return kept.join(" ");
  }

  /**
   * Normalize a filename the way a permissive server might, so the checks
   * below see what would actually land on disk (FE-003): directory components,
   * percent-encoding, NUL and control chars, bidi overrides, and — critically —
   * trailing spaces and dots, which Windows and IIS strip, turning
   * "shell.php " back into "shell.php".
   */
  function normalizeUploadName(name) {
    let value = String(name == null ? "" : name);
    for (let i = 0; i < 3; i++) {
      try {
        let next = decodeURIComponent(value);
        if (next === value) break;
        value = next;
      } catch (e) {
        break;
      }
    }
    value = value
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "")
      .split(/[\\/]/)
      .pop();
    // Repeatedly strip trailing whitespace/dots, matching Win32 path semantics.
    let previous = null;
    while (previous !== value) {
      previous = value;
      value = value.replace(/[\s.]+$/, "");
    }
    return value.toLowerCase();
  }

  /**
   * Every candidate extension: all dot-separated segments after the first.
   * Internal whitespace is removed first, so "shell.php .jpg" reads as a php
   * segment — a server that trims or splits on whitespace sees exactly that.
   */
  function fileExtensionSegments(name) {
    let normalized = normalizeUploadName(name);
    // ":" and ";" are separators too — "shell.jpg:x.php" is an NTFS alternate
    // data stream, "shell.php;.jpg" is semicolon truncation on misconfigured
    // Nginx/IIS. Truncating at either would hide the attack, not catch it.
    return normalized
      .split(/[.:;]/)
      .slice(1)
      .map(function (segment) {
        return segment.replace(/\s+/g, "");
      })
      .filter(Boolean);
  }

  /**
   * Client-side image file gate. NOT A SECURITY BOUNDARY: filename and MIME
   * are attacker-controlled strings, and an attacker can POST to the endpoint
   * without loading this code. The backend must independently verify magic
   * bytes, re-encode, rename, and store outside any executable path.
   */
  function validateImageFile(file, securityOptions) {
    securityOptions = mergeSecurityOptions(securityOptions || {});
    if (!file) return { ok: false, error: "Please choose an image file" };
    let max = securityOptions.maxImageBytes;
    if (file.size > max) {
      return {
        ok: false,
        error: "Image too large (max " + Math.round(max / (1024 * 1024)) + " MB)",
      };
    }
    if (file.size === 0) {
      return { ok: false, error: "That file is empty" };
    }

    let mime = String(file.type || "").trim().toLowerCase();
    let segments = fileExtensionSegments(file.name);
    let ext = segments.length ? segments[segments.length - 1] : "";

    // Every segment is checked, so "image.php.jpg" and "image.jpg.php" both fail.
    for (let i = 0; i < segments.length; i++) {
      if (DANGEROUS_UPLOAD_EXT[segments[i]]) {
        if (!(securityOptions.allowSvg && segments[i] === "svg" && i === segments.length - 1)) {
          return { ok: false, error: "This file type is not allowed" };
        }
      }
    }

    if (mime === "image/svg+xml" || ext === "svg") {
      if (!securityOptions.allowSvg) {
        return { ok: false, error: "SVG images are not allowed" };
      }
    }

    // A usable extension is required: without one the decision would fall back
    // to MIME, which is just another string in the request (FE-003).
    if (!ext) {
      return { ok: false, error: "The file needs a .jpg, .png, .webp or .gif extension" };
    }
    if (!ALLOWED_IMAGE_EXT[ext] && !(securityOptions.allowSvg && ext === "svg")) {
      return { ok: false, error: "Only .jpg, .jpeg, .png, .webp, and .gif files are allowed" };
    }
    if (mime && !ALLOWED_IMAGE_MIME[mime] && !(securityOptions.allowSvg && mime === "image/svg+xml")) {
      return { ok: false, error: "Only JPEG, PNG, WebP, and GIF images are allowed" };
    }
    return { ok: true };
  }

  /** Read the first bytes of a Blob, via arrayBuffer() or FileReader. */
  function readHeadBytes(file) {
    let blob;
    try {
      blob = file.slice(0, 16);
    } catch (e) {
      return Promise.resolve(null);
    }
    if (blob && typeof blob.arrayBuffer === "function") {
      return blob.arrayBuffer().then(
        function (buf) {
          return new Uint8Array(buf);
        },
        function () {
          return null;
        }
      );
    }
    if (typeof FileReader === "undefined") return Promise.resolve(null);
    return new Promise(function (resolve) {
      let reader = new FileReader();
      reader.onload = function () {
        try {
          resolve(new Uint8Array(reader.result));
        } catch (e) {
          resolve(null);
        }
      };
      reader.onerror = function () {
        resolve(null);
      };
      try {
        reader.readAsArrayBuffer(blob);
      } catch (e) {
        resolve(null);
      }
    });
  }

  /**
   * Confirm the leading bytes are a real raster header (FE-003), then check
   * decoded dimensions against a ceiling (FE-011). Still only a UX filter: a
   * polyglot passes this exactly as it passes `getimagesize()` on the server.
   */
  function inspectImageContent(file, securityOptions) {
    securityOptions = mergeSecurityOptions(securityOptions || {});
    if (!file || !file.slice) {
      return Promise.resolve({ ok: true, skipped: true });
    }

    return readHeadBytes(file)
      .then(function (head) {
        // No readable bytes → cannot judge. Never block on that: the server is
        // the authority, this is only a fast local hint.
        if (!head || !head.length) return { ok: true, skipped: true };
        let matched = null;
        for (let i = 0; i < IMAGE_MAGIC.length; i++) {
          let sig = IMAGE_MAGIC[i];
          let hit = true;
          for (let b = 0; b < sig.bytes.length; b++) {
            if (head[b] !== sig.bytes[b]) {
              hit = false;
              break;
            }
          }
          if (!hit) continue;
          if (sig.webp) {
            // "RIFF" then 4 length bytes then "WEBP"
            if (head[8] !== 0x57 || head[9] !== 0x45 || head[10] !== 0x42 || head[11] !== 0x50) {
              continue;
            }
          }
          matched = sig.type;
          break;
        }
        if (!matched && !(securityOptions.allowSvg && /svg/i.test(file.type || ""))) {
          return { ok: false, error: "That file is not a valid JPEG, PNG, WebP or GIF" };
        }
        return measureImage(file, securityOptions);
      })
      .catch(function () {
        return { ok: true, skipped: true };
      });
  }

  function measureImage(file, securityOptions) {
    if (typeof createImageBitmap !== "function") {
      return Promise.resolve({ ok: true, skipped: true });
    }
    return createImageBitmap(file).then(
      function (bitmap) {
        let w = bitmap.width;
        let h = bitmap.height;
        if (bitmap.close) bitmap.close();
        if (
          w > MAX_IMAGE_DIMENSION ||
          h > MAX_IMAGE_DIMENSION ||
          w * h > securityOptions.maxImagePixels
        ) {
          return {
            ok: false,
            error: "Image dimensions are too large (" + w + "×" + h + ")",
          };
        }
        return { ok: true };
      },
      function () {
        return { ok: false, error: "That image could not be decoded" };
      }
    );
  }

  function isSafeIframeSrc(src, securityOptions) {
    securityOptions = mergeSecurityOptions(securityOptions || {});
    if (securityOptions.allowHtmlIframe) {
      // Escape hatch: HTTPS, parsed origin, never same-origin (ISSUE-1).
      // Sandbox for these frames never includes allow-same-origin.
      let open = sanitizeUrl(src, {
        purpose: "iframe-open",
        mediaHosts: securityOptions.mediaHosts,
      });
      if (!open || !/^https:\/\//i.test(open)) return false;
      let parsed = parseHttpsIframeUrl(open);
      return !!(parsed && !isSameOriginAsPage(parsed));
    }
    let clean = sanitizeUrl(src, {
      purpose: "iframe",
      mediaHosts: securityOptions.mediaHosts,
    });
    if (!clean || !/^https:\/\//i.test(clean)) return false;
    let parsed = parseHttpsIframeUrl(clean);
    if (!parsed || isSameOriginAsPage(parsed)) return false;
    // Instagram/TikTok hosts are on the iframe allowlist so constructed
    // embeds survive sanitization. Do not treat every path on those hosts as
    // an embed — only URLs that parse as provider media.
    try {
      let host = parsed.hostname.toLowerCase().replace(/\.$/, "");
      if (INSTAGRAM_HOSTS[host]) return !!instagramMediaFromUrl(clean);
      if (TIKTOK_HOSTS[host]) return !!tiktokVideoId(clean);
    } catch (e) {
      return false;
    }
    return true;
  }

  function copySafeAttributes(fromEl, toEl, tag, securityOptions, inMedia) {
    securityOptions = mergeSecurityOptions(securityOptions || {});
    let attrs = fromEl.attributes;
    if (!attrs) return;
    for (let i = 0; i < attrs.length; i++) {
      let attr = attrs[i];
      let name = attr.name.toLowerCase();
      let value = attr.value;
      if (name.indexOf("on") === 0) continue;
      if (name === "style") {
        let safeStyle = sanitizeStyleValue(value, !!inMedia, tag);
        if (safeStyle) toEl.setAttribute("style", safeStyle);
        continue;
      }
      if (name === "class") {
        let safeClass = sanitizeClassList(value, securityOptions);
        if (safeClass) toEl.setAttribute("class", safeClass);
        continue;
      }
      if (name === "contenteditable" && tag === "figure") {
        toEl.setAttribute("contenteditable", "false");
        continue;
      }
      if (name.indexOf("data-") === 0 && (tag === "figure" || tag === "div" || tag === "span")) {
        if (/^data-(oembed-url|video-id|provider|watch-url|media-kind)$/i.test(name)) {
          if (name === "data-oembed-url" || name === "data-watch-url") {
            let safe = sanitizeUrl(value, { purpose: "href" });
            if (safe) toEl.setAttribute(name, safe);
          } else if (name === "data-media-kind") {
            if (/^(p|reel|tv)$/i.test(value)) {
              toEl.setAttribute(name, String(value).toLowerCase());
            }
          } else {
            toEl.setAttribute(name, String(value).replace(/[^\w\-.:]/g, "").slice(0, 64));
          }
        }
        continue;
      }
      if (tag === "a" && (name === "href" || name === "title" || name === "target" || name === "rel")) {
        if (name === "href") {
          let href = sanitizeUrl(value, {
            purpose: "href",
            allowDataUrls: securityOptions.allowDataUrls,
          });
          if (href) toEl.setAttribute("href", href);
        } else if (name === "target") {
          if (value === "_blank") {
            toEl.setAttribute("target", "_blank");
            toEl.setAttribute("rel", "noopener noreferrer");
          }
        } else if (name === "rel") {
          if (!toEl.getAttribute("rel")) {
            let safeRel = sanitizeRel(value);
            if (safeRel) toEl.setAttribute("rel", safeRel);
          }
        } else if (name === "title") {
          toEl.setAttribute("title", value.slice(0, 200));
        }
        continue;
      }
      if (tag === "img" && (name === "src" || name === "alt" || name === "width" || name === "height")) {
        if (name === "src") {
          let src = sanitizeUrl(value, {
            purpose: "image",
            allowDataUrls: securityOptions.allowDataUrls,
            allowBlobUrls: securityOptions.allowLocalImageFallback,
          });
          if (src) toEl.setAttribute("src", src);
        } else if (name === "alt") {
          toEl.setAttribute("alt", value.slice(0, 500));
        } else if (name === "width" || name === "height") {
          if (/^\d{1,5}$/.test(String(value))) toEl.setAttribute(name, value);
        }
        continue;
      }
      if (
        tag === "video" &&
        (name === "src" ||
          name === "controls" ||
          name === "playsinline" ||
          name === "preload" ||
          name === "width" ||
          name === "height")
      ) {
        if (name === "src") {
          let vsrc = sanitizeUrl(value, { purpose: "media" });
          if (vsrc) toEl.setAttribute("src", vsrc);
        } else if (name === "controls" || name === "playsinline") {
          toEl.setAttribute(name, "");
        } else if (name === "preload") {
          if (/^(metadata|none|auto)$/i.test(value)) toEl.setAttribute("preload", value.toLowerCase());
        } else if (/^\d{1,5}$/.test(String(value))) {
          toEl.setAttribute(name, value);
        }
        continue;
      }
      if (tag === "iframe") {
        if (name === "src") {
          if (isSafeIframeSrc(value, securityOptions)) {
            let clean = sanitizeUrl(value, {
              purpose: securityOptions.allowHtmlIframe ? "iframe-open" : "iframe",
              mediaHosts: securityOptions.mediaHosts,
            });
            if (clean && /^https:\/\//i.test(clean)) toEl.setAttribute("src", clean);
          }
        } else if (name === "title") {
          toEl.setAttribute("title", value.slice(0, 200));
        } else if (name === "allow") {
          // Copy only the intersection with what a media embed legitimately
          // needs. Never widen: substituting a standard list would grant the
          // frame capabilities it never asked for (FE-008).
          let requested = String(value).toLowerCase().split(";");
          let granted = [];
          requested.forEach(function (token) {
            let feature = token.trim().split(/\s+/)[0];
            if (feature && IFRAME_ALLOW_FEATURES[feature] && granted.indexOf(feature) === -1) {
              granted.push(feature);
            }
          });
          if (granted.length) toEl.setAttribute("allow", granted.join("; "));
        } else if (name === "allowfullscreen" || name === "frameborder") {
          toEl.setAttribute(name, name === "frameborder" ? "0" : "");
        } else if (name === "scrolling") {
          if (/^no$/i.test(value)) toEl.setAttribute("scrolling", "no");
        }
        // `sandbox`, `referrerpolicy` and `loading` are force-set after this
        // loop instead of copied, so attribute order does not depend on the
        // input — otherwise sanitizeHtml() stops being idempotent.
        continue;
      }
      if ((tag === "td" || tag === "th") && (name === "colspan" || name === "rowspan")) {
        if (/^\d{1,2}$/.test(String(value))) toEl.setAttribute(name, value);
        continue;
      }
      if (
        name === "align" &&
        /^(p|div|h1|h2|h3|h4|h5|h6|li|blockquote|td|th|pre)$/.test(tag)
      ) {
        let align = String(value || "").toLowerCase();
        if (
          align === "left" ||
          align === "right" ||
          align === "center" ||
          align === "justify"
        ) {
          let style = toEl.getAttribute("style") || "";
          if (!/(?:^|;)\s*text-align\s*:/i.test(style)) {
            toEl.setAttribute(
              "style",
              style ? style.replace(/;?\s*$/, "; ") + "text-align: " + align : "text-align: " + align
            );
          }
        }
      }
    }
    // `id` is copied only onto bookmark spans, after class has been filtered,
    // so attribute order on the input cannot skip the fe-anchor gate (FE-024).
    if (tag === "span" && hasFeAnchorClass(toEl)) {
      let id = sanitizeAnchorId(fromEl.getAttribute("id"));
      if (id) toEl.setAttribute("id", id);
    }
    if (tag === "a" && toEl.getAttribute("target") === "_blank") {
      toEl.setAttribute("rel", "noopener noreferrer");
    }
    if (tag === "img" && !toEl.getAttribute("src")) {
      return false;
    }
    if (tag === "iframe") {
      if (!toEl.getAttribute("src")) return false;
      // Always sandboxed. allow-same-origin only for parsed, allowlisted,
      // cross-origin provider hosts — never for allowHtmlIframe (ISSUE-1).
      toEl.setAttribute(
        "sandbox",
        iframeSandboxForSrc(toEl.getAttribute("src"), securityOptions)
      );
      toEl.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      toEl.setAttribute("loading", "lazy");
      let iframeSrc = toEl.getAttribute("src") || "";
      if (instagramMediaFromUrl(iframeSrc) || tiktokVideoId(iframeSrc)) {
        toEl.setAttribute("scrolling", "no");
      }
    }
    if (tag === "video" && !toEl.getAttribute("src") && !fromEl.querySelector("source")) {
      return false;
    }
    return true;
  }

  /**
   * @param {boolean} [inMedia] true once we are inside a figure.fe-media
   *   subtree, which is the only place layout styles are permitted (FE-007).
   */
  function sanitizeNode(node, securityOptions, outParent, inMedia) {
    if (!node) return;
    if (node.nodeType === 3) {
      outParent.appendChild(document.createTextNode(node.nodeValue || ""));
      return;
    }
    if (node.nodeType !== 1) return;

    let tag = node.tagName.toLowerCase();
    if (HTML_FORBIDDEN_TAGS[tag]) {
      if (
        tag === "script" ||
        tag === "style" ||
        tag === "base" ||
        tag === "link" ||
        tag === "meta" ||
        tag === "noscript" ||
        tag === "xmp" ||
        tag === "noembed" ||
        tag === "plaintext" ||
        tag === "template"
      ) {
        return;
      }
      Array.prototype.forEach.call(node.childNodes, function (child) {
        sanitizeNode(child, securityOptions, outParent, inMedia);
      });
      return;
    }

    if (tag === "iframe" && !isSafeIframeSrc(node.getAttribute("src") || "", securityOptions)) {
      return;
    }

    if (!HTML_ALLOWED_TAGS[tag]) {
      Array.prototype.forEach.call(node.childNodes, function (child) {
        sanitizeNode(child, securityOptions, outParent, inMedia);
      });
      return;
    }

    let childInMedia =
      inMedia ||
      (tag === "figure" && /(^|\s)fe-media(\s|$)/.test(node.getAttribute("class") || ""));

    let elOut = document.createElement(tag);
    let keep = copySafeAttributes(node, elOut, tag, securityOptions, childInMedia);
    if (keep === false) return;

    /**
     * Drop iframe children entirely (FE-004). They are fallback text, and the
     * serializer emits a raw-text element's children UNESCAPED: the output
     * would be inert to an HTML parser but live the moment a downstream
     * consumer strips the iframe tags, which servers commonly do.
     */
    if (tag === "iframe") {
      outParent.appendChild(elOut);
      return;
    }

    Array.prototype.forEach.call(node.childNodes, function (child) {
      sanitizeNode(child, securityOptions, elOut, childInMedia);
    });

    // Bookmark spans without a valid id are not bookmarks — unwrap.
    if (tag === "span" && hasFeAnchorClass(elOut) && !elOut.getAttribute("id")) {
      while (elOut.firstChild) outParent.appendChild(elOut.firstChild);
      return;
    }

    // Drop anchors that lost their href rather than leaving inert <a> shells.
    if (tag === "a" && !elOut.getAttribute("href")) {
      while (elOut.firstChild) outParent.appendChild(elOut.firstChild);
      return;
    }

    // Unwrap empty paste wrappers: <span style="…defaults…">text</span>.
    if (
      tag === "span" &&
      !hasFeAnchorClass(elOut) &&
      !elOut.className &&
      !elOut.getAttribute("id") &&
      !(elOut.getAttribute("style") || "").trim()
    ) {
      while (elOut.firstChild) outParent.appendChild(elOut.firstChild);
      return;
    }

    outParent.appendChild(elOut);
  }

  const ALIGN_BLOCK_TAGS = nullMap({
    p: true,
    div: true,
    h1: true,
    h2: true,
    h3: true,
    h4: true,
    h5: true,
    h6: true,
    li: true,
    blockquote: true,
  });

  function readExplicitTextAlign(el) {
    if (!el || !el.getAttribute) return "";
    let style = el.getAttribute("style") || "";
    let m = String(style).match(/(?:^|;)\s*text-align:\s*(left|right|center|justify)\b/i);
    if (m) return m[1].toLowerCase();
    return "";
  }

  function skipDefaultAlign(el) {
    if (!el || !el.getAttribute) return true;
    let cls = el.getAttribute("class") || "";
    if (/(^|\s)(fe-media|fe-align-wrap|fe-media__wrapper|editor-footer|editor-body)(\s|$)/.test(cls)) {
      return true;
    }
    let tag = el.tagName && el.tagName.toLowerCase();
    return tag === "figure" || tag === "table" || tag === "ul" || tag === "ol";
  }

  function appendTextAlign(el, align) {
    if (!el || readExplicitTextAlign(el)) return;
    let style = el.getAttribute("style") || "";
    el.setAttribute(
      "style",
      style ? style.replace(/;?\s*$/, "; ") + "text-align: " + align : "text-align: " + align
    );
  }

  /**
   * Editor chrome defaults to `text-align: justify`. Persist that on blocks
   * that have no explicit alignment so published HTML matches the preview
   * without a global embed rule (ISSUE-3).
   */
  function persistDefaultAlignment(root) {
    function walk(node, inherited) {
      if (!node || node.nodeType !== 1) return;
      let tag = node.tagName.toLowerCase();
      let explicit = readExplicitTextAlign(node);
      let current = explicit || inherited;
      if (ALIGN_BLOCK_TAGS[tag] && !explicit && !inherited && !skipDefaultAlign(node)) {
        appendTextAlign(node, "justify");
        current = "justify";
      }
      let kids = node.children;
      for (let i = 0; i < kids.length; i++) {
        walk(kids[i], current);
      }
    }
    let kids = root.children;
    for (let i = 0; i < kids.length; i++) {
      walk(kids[i], "");
    }
  }

  function isSkippableEmptyBlock(el) {
    if (!el || el.nodeType !== 1) return false;
    let tag = el.tagName.toLowerCase();
    if (tag !== "p" && tag !== "div") return false;
    if (el.getAttribute("class")) return false;
    if (el.getAttribute("id")) return false;
    if (el.querySelector("img,iframe,video,table,figure,br,ul,ol,li,a,span[id]")) {
      return false;
    }
    if ((el.getAttribute("style") || "").trim()) {
      // Keep styled empty blocks only if they still have a <br> placeholder.
      return false;
    }
    return !(el.textContent || "").replace(/\u00a0/g, " ").trim();
  }

  function pruneEmptyParagraphs(root, keepEl) {
    if (!root || !root.querySelectorAll) return;
    let nodes = root.querySelectorAll("p,div");
    for (let i = nodes.length - 1; i >= 0; i--) {
      let el = nodes[i];
      if (keepEl && (el === keepEl || (keepEl.contains && el.contains(keepEl)))) continue;
      if (!isSkippableEmptyBlock(el) || !el.parentNode) continue;
      if (root.children.length === 1 && root.firstElementChild === el) {
        if (!el.firstChild) el.appendChild(document.createElement("br"));
        continue;
      }
      el.parentNode.removeChild(el);
    }
  }

  function normalizeListNesting(root) {
    if (!root || !root.querySelectorAll) return;
    let guard = 0;
    while (guard++ < 32) {
      let orphans = root.querySelectorAll("ul > ul, ul > ol, ol > ul, ol > ol");
      if (!orphans.length) break;
      Array.prototype.forEach.call(orphans, function (list) {
        let parent = list.parentNode;
        if (!parent) return;
        let prev = list.previousElementSibling;
        if (prev && prev.tagName === "LI") {
          prev.appendChild(list);
          return;
        }
        let li = document.createElement("li");
        parent.insertBefore(li, list);
        li.appendChild(list);
      });
    }
  }

  function indentListItem(li) {
    if (!li || li.tagName !== "LI") return false;
    let prev = li.previousElementSibling;
    if (!prev || prev.tagName !== "LI") return false;
    let parentList = li.parentNode;
    if (!parentList) return false;
    let tag = parentList.tagName === "OL" ? "ol" : "ul";
    let nested = prev.lastElementChild;
    if (!nested || (nested.tagName !== "UL" && nested.tagName !== "OL")) {
      nested = document.createElement(tag);
      prev.appendChild(nested);
    }
    nested.appendChild(li);
    return true;
  }

  function outdentListItem(li) {
    if (!li || li.tagName !== "LI") return false;
    let list = li.parentNode;
    if (!list || (list.tagName !== "UL" && list.tagName !== "OL")) return false;
    let parentLi = list.parentNode;
    if (!parentLi || parentLi.tagName !== "LI") return false;
    let parentList = parentLi.parentNode;
    if (!parentList) return false;
    if (li.nextSibling) {
      let rest = document.createElement(list.tagName.toLowerCase());
      while (li.nextSibling) rest.appendChild(li.nextSibling);
      li.appendChild(rest);
    }
    if (parentLi.nextSibling) {
      parentList.insertBefore(li, parentLi.nextSibling);
    } else {
      parentList.appendChild(li);
    }
    if (!list.childNodes.length && list.parentNode) {
      list.parentNode.removeChild(list);
    }
    return true;
  }

  /**
   * Parse untrusted HTML **inertly**. The ONLY sanctioned way to hand
   * attacker-controlled markup to an HTML parser.
   *
   * A <template>'s contents live in a document with no browsing context, so
   * nothing parsed becomes active: no subresource fetch, no error handlers, no
   * custom-element upgrade, no script. A detached `createElement("div")` does
   * NOT have this property — it still belongs to the live document, where
   * `<img src=x onerror=…>` fires immediately (FE-001).
   *
   * Rules for callers:
   *   1. Read structure from `tpl.content`; serialize with `tpl.innerHTML`.
   *   2. NEVER move a node out of `tpl.content` into the live document.
   *      Adoption re-activates it (an <img> queues its load). Sanitize to a
   *      string first, then insert that string.
   */
  function inertTemplate(html) {
    let tpl = document.createElement("template");
    tpl.innerHTML = String(html == null ? "" : html);
    return tpl;
  }

  /**
   * Allowlist HTML sanitizer for editor content.
   * Defense-in-depth only — also sanitize on the server before store/render.
   */
  function sanitizeHtml(html, securityOptions) {
    securityOptions = mergeSecurityOptions(securityOptions || {});
    if (html == null) return "";
    let input = String(html);
    if (!input) return "";
    if (typeof document === "undefined") return "";

    let template = inertTemplate(input);
    let out = document.createElement("div");
    Array.prototype.forEach.call(template.content.childNodes, function (child) {
      sanitizeNode(child, securityOptions, out);
    });
    normalizeListNesting(out);
    pruneEmptyParagraphs(out);
    persistDefaultAlignment(out);
    return out.innerHTML;
  }

  /**
   * Confine a URL to a configured prefix, on a name boundary (FE-020).
   *
   * A bare `indexOf(prefix) === 0` matches across the end of a host or path
   * segment: `https://cdn.example.com` would also accept
   * `https://cdn.example.com.evil.tld/x.png`.
   */
  function isWithinUploadPrefix(url, prefix) {
    if (!prefix) return true;
    let value = String(url);
    let bound = String(prefix);
    if (value.indexOf(bound) !== 0) return false;
    if (bound.charAt(bound.length - 1) === "/") return true;
    let next = value.charAt(bound.length);
    return next === "" || next === "/" || next === "?" || next === "#";
  }

  /**
   * Built-in image uploader used by the toolbar.
   * 1) Custom options.uploadImage(file) if provided
   * 2) POST to an EXPLICITLY configured options.uploadUrl → { url }
   * 3) Local blob fallback ONLY when allowLocalImageFallback === true
   *
   * With neither uploadUrl nor uploadImage this rejects rather than guessing a
   * path (FE-017). Client checks are NOT a security boundary: the server must
   * re-validate every upload independently.
   */
  function uploadImageFile(file, options) {
    options = options || {};
    let security = mergeSecurityOptions(options);

    let check = validateImageFile(file, security);
    if (!check.ok) {
      return Promise.reject(new Error(check.error));
    }

    function acceptReturnedUrl(src) {
      if (!src) throw new Error("Upload returned no URL");
      let safe = sanitizeUrl(String(src), {
        purpose: "image",
        allowDataUrls: security.allowDataUrls,
        allowBlobUrls: security.allowLocalImageFallback,
      });
      if (!safe) throw new Error("Upload returned an unsafe URL");
      // FE-012: a compromised or SSRF-able endpoint could point stored content
      // at any host. Where the integrator declared one, hold it to that.
      if (!isWithinUploadPrefix(safe, security.uploadUrlPrefix)) {
        throw new Error("Upload returned a URL outside the configured prefix");
      }
      return safe;
    }

    // Magic bytes + decoded dimensions (FE-003 / FE-011). Best-effort: passes
    // where the APIs are unavailable, so it cannot block an older browser.
    function gate() {
      return inspectImageContent(file, security).then(function (result) {
        if (result && result.ok === false) throw new Error(result.error);
      });
    }

    if (typeof options.uploadImage === "function") {
      return gate()
        .then(function () {
          return options.uploadImage(file);
        })
        .then(acceptReturnedUrl);
    }

    let uploadUrl =
      options.uploadUrl === undefined ? DEFAULT_UPLOAD_URL : options.uploadUrl;
    let allowLocal = security.allowLocalImageFallback;

    function localPreview() {
      return URL.createObjectURL(file);
    }

    if (!uploadUrl) {
      if (allowLocal) return Promise.resolve(localPreview());
      return Promise.reject(
        new Error("Image upload is not configured (missing uploadUrl).")
      );
    }

    /**
     * The endpoint must be http(s) or root-relative (FE-022). A path-relative
     * value is the FE-017 footgun: "admin/upload" resolves against whatever
     * page the editor sits on. Fail closed rather than posting the file and
     * the CSRF token somewhere unintended.
     */
    let endpoint = sanitizeUrl(uploadUrl, { purpose: "media" });
    if (!endpoint) {
      return Promise.reject(
        new Error(
          "uploadUrl is not a usable upload endpoint: it must be an absolute http(s) URL or a root-relative path such as /admin/upload-image."
        )
      );
    }

    if (security.requireCsrf && !options.csrf) {
      return Promise.reject(
        new Error(
          "CSRF token required for upload. Pass options.csrf, or set requireCsrf: false only for non-cookie APIs."
        )
      );
    }

    let fd = new FormData();
    fd.append("image", file);
    if (options.csrf) {
      fd.append("_token", options.csrf);
    }

    let headers = {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    };
    if (options.csrf) {
      headers["X-CSRF-TOKEN"] = options.csrf;
    }

    return gate()
      .then(function () {
        return fetch(endpoint, {
          method: "POST",
          body: fd,
          credentials: "same-origin",
          headers: headers,
        });
      })
      .then(function (res) {
        return res.text().then(function (text) {
          let data = null;
          try {
            data = text ? JSON.parse(text) : null;
          } catch (e) {
            data = null;
          }
          if (!res.ok) {
            let msg =
              (data &&
                (data.message ||
                  (data.errors && data.errors.image && data.errors.image[0]))) ||
              (res.status === 419
                ? "Session expired — refresh the page and try again."
                : "Upload failed (HTTP " + res.status + ")");
            let rejection = new Error(msg);
            // Marked so the fallback below cannot paper over a server verdict
            // with a local preview (FE-013).
            rejection.serverRejected = true;
            throw rejection;
          }
          return acceptReturnedUrl(data && data.url);
        });
      })
      .catch(function (err) {
        /**
         * FE-013: the blob fallback is for offline/dev work, not for hiding a
         * verdict. If the server answered, the author must see the real error
         * — otherwise a rejected file renders locally and is saved as a dead
         * blob: URL nobody else can load.
         */
        let msg = (err && err.message) || "";
        if (
          allowLocal &&
          !(err && err.serverRejected) &&
          !/CSRF token required/i.test(msg) &&
          !/not configured/i.test(msg) &&
          !/unsafe URL|outside the configured prefix|no URL/i.test(msg) &&
          !/not a valid|dimensions are too large|could not be decoded|not allowed|too large|empty|extension/i.test(msg)
        ) {
          return localPreview();
        }
        throw err;
      });
  }


  function unwrapNode(el) {
    let parent = el.parentNode;
    if (!parent) return;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
  }

  function stripDescendantFontSize(root) {
    if (!root || !root.querySelectorAll) return;
    let nodes = Array.prototype.slice.call(root.querySelectorAll("[style]"));
    nodes.sort(function (a, b) {
      if (a === b) return 0;
      if (a.contains(b)) return 1;
      if (b.contains(a)) return -1;
      return 0;
    });
    nodes.forEach(function (el) {
      if (el === root) return;
      if (el.style && el.style.fontSize) el.style.removeProperty("font-size");
      if (el.hasAttribute("style") && !(el.getAttribute("style") || "").trim()) {
        el.removeAttribute("style");
      }
      if (
        el.tagName === "SPAN" &&
        !el.className &&
        !el.id &&
        !el.hasAttribute("style")
      ) {
        unwrapNode(el);
      }
    });
  }

  function wrapRangeWithFontSize(range, sizePx) {
    if (!range || range.collapsed) return null;
    let span = document.createElement("span");
    span.style.fontSize = sizePx + "px";
    try {
      range.surroundContents(span);
    } catch (e) {
      let fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }
    stripDescendantFontSize(span);
    return span;
  }

  function leafBlocksInRange(range, root) {
    let tags = "p,div,h1,h2,h3,h4,h5,h6,blockquote,li,pre,th,td,section,article";
    let all = [];
    Array.prototype.forEach.call(root.querySelectorAll(tags), function (el) {
      if (el.closest && el.closest(".editor-footer")) return;
      try {
        if (range.intersectsNode(el)) all.push(el);
      } catch (e) {}
    });
    return all.filter(function (el) {
      return !all.some(function (other) {
        return other !== el && el.contains(other);
      });
    });
  }

  function clipRangeToNode(range, node) {
    let clipped = document.createRange();
    clipped.selectNodeContents(node);
    try {
      if (range.compareBoundaryPoints(Range.START_TO_START, clipped) > 0) {
        clipped.setStart(range.startContainer, range.startOffset);
      }
      if (range.compareBoundaryPoints(Range.END_TO_END, clipped) < 0) {
        clipped.setEnd(range.endContainer, range.endOffset);
      }
    } catch (e) {
      return null;
    }
    if (clipped.collapsed) return null;
    return clipped;
  }

  function wrapRangeWithAnchor(range, id) {
    if (!range) return null;
    let span = document.createElement("span");
    span.className = "fe-anchor";
    span.setAttribute("id", id);
    if (range.collapsed) {
      range.insertNode(span);
      return span;
    }
    try {
      range.surroundContents(span);
    } catch (e) {
      let contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);
    }
    if (span.parentNode && span.parentNode.normalize) span.parentNode.normalize();
    return span;
  }

  function wrapRangeWithLink(range, url, openInNew) {
    if (!range || range.collapsed) return null;
    let a = document.createElement("a");
    a.setAttribute("href", url);
    if (openInNew) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    } else {
      a.removeAttribute("target");
      a.removeAttribute("rel");
    }
    try {
      range.surroundContents(a);
    } catch (e) {
      let contents = range.extractContents();
      a.appendChild(contents);
      range.insertNode(a);
    }
    if (a.parentNode) a.parentNode.normalize();
    return a;
  }

  /**
   * Extract a YouTube video id, host-checked first (FE-015 / FE-029).
   *
   * The id patterns must never be matched against the whole URL: they are
   * unanchored, so `https://evil.example/youtube.com/watch?v=AAAAAAAAAAA`,
   * `https://evil.example/#youtube.com/embed/AAAAAAAAAAA` and
   * `https://evil.example/?x=youtu.be/AAAAAAAAAAA` all "looked like" YouTube.
   * That rendered a YouTube thumbnail over a third-party URL and carried that
   * URL into `data-oembed-url`, which downstream renderers treat as the embed
   * source. Decide on the parsed hostname, then read the id off the path.
   */
  function ytVideoId(url) {
    let str = String(url == null ? "" : url).trim();
    if (!str) return null;
    // A bare "youtube.com/watch?v=…" from the media dialog is normalized the
    // same way sanitizeUrl() normalizes it, so the dialog keeps working.
    let probe =
      /^[a-z][a-z0-9+.-]*:/i.test(str) || str.charAt(0) === "/" ? str : "https://" + str;
    let parsed;
    try {
      parsed = new URL(probe, "https://fe-relative.invalid/");
    } catch (e) {
      return null;
    }
    let host = parsed.hostname.toLowerCase().replace(/\.$/, "");
    let path = parsed.pathname;

    if (/^(www\.|m\.)?youtu\.be$/.test(host)) {
      let short = path.match(/^\/([A-Za-z0-9_-]{11})(?:[/?#]|$)/);
      return short ? short[1] : null;
    }
    if (!/^((www|m|music)\.)?(youtube\.com|youtube-nocookie\.com)$/.test(host)) {
      return null;
    }
    let byPath = path.match(/^\/(?:embed|shorts|live|v)\/([A-Za-z0-9_-]{11})(?:[/?#]|$)/);
    if (byPath) return byPath[1];
    let byQuery = parsed.search.match(/[?&]v=([A-Za-z0-9_-]{11})(?:&|$)/i);
    return byQuery ? byQuery[1] : null;
  }

  /**
   * Extract a Vimeo video id, host-checked (FE-021). Same problem FE-015 fixed
   * for YouTube: an unanchored match also accepts
   * https://evil.example/vimeo.com/12345, which then renders as a "Vimeo"
   * widget carrying an attacker URL in data-oembed-url.
   */
  function vimeoVideoId(url) {
    let str = String(url == null ? "" : url).trim();
    if (!str) return null;
    // A bare "vimeo.com/123" from the media dialog is normalized the same way
    // sanitizeUrl() normalizes it, so the dialog keeps working.
    let probe =
      /^[a-z][a-z0-9+.-]*:/i.test(str) || str.charAt(0) === "/" ? str : "https://" + str;
    let host = "";
    try {
      host = new URL(probe, "https://fe-relative.invalid/").hostname.toLowerCase();
    } catch (e) {
      return null;
    }
    if (!/(^|\.)vimeo\.com$/.test(host)) return null;
    let m = probe.match(/\/(?:video\/)?(\d+)(?:[/?#]|$)/);
    return m ? m[1] : null;
  }

  /**
   * Shared HTTP(S) URL parse for new providers. Hostname is taken from the
   * WHATWG parser, never from a substring. Relative URLs resolve against a
   * synthetic origin and are then rejected (FE-015).
   */
  function parseAbsoluteHttpUrl(url) {
    let str = String(url == null ? "" : url).trim();
    if (!str) return null;
    if (/[\u0000-\u001F\u007F]/.test(str)) return null;
    let probe =
      /^[a-z][a-z0-9+.-]*:/i.test(str) || str.charAt(0) === "/" ? str : "https://" + str;
    let parsed;
    try {
      parsed = new URL(probe, "https://fe-relative.invalid/");
    } catch (e) {
      return null;
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    if (parsed.username || parsed.password) return null;
    let host = parsed.hostname.toLowerCase().replace(/\.$/, "");
    if (!host || host === "fe-relative.invalid") return null;
    return { parsed: parsed, host: host, path: parsed.pathname };
  }

  /**
   * Instagram post / reel / IGTV id, host-checked. Path must be one of
   * /p/, /reel/, /reels/, /tv/ plus an optional /embed[/captioned] suffix.
   */
  function instagramMediaFromUrl(url) {
    let parsed = parseAbsoluteHttpUrl(url);
    if (!parsed || !INSTAGRAM_HOSTS[parsed.host]) return null;
    let parts = parsed.path.split("/").filter(Boolean);
    if (parts.length < 2 || parts.length > 5) return null;
    let idx = 0;
    let kindRaw = String(parts[0] || "").toLowerCase();
    if (kindRaw !== "p" && kindRaw !== "reel" && kindRaw !== "reels" && kindRaw !== "tv") {
      if (!/^[A-Za-z0-9._]{1,30}$/.test(parts[0])) return null;
      idx = 1;
      kindRaw = String(parts[1] || "").toLowerCase();
    }
    let kind = kindRaw === "reels" ? "reel" : kindRaw;
    if (kind !== "p" && kind !== "reel" && kind !== "tv") return null;
    let id = parts[idx + 1];
    if (!INSTAGRAM_ID_RE.test(id)) return null;
    let extra = parts.slice(idx + 2);
    if (extra.length === 0) return { id: id, kind: kind };
    if (String(extra[0]).toLowerCase() !== "embed") return null;
    if (extra.length === 1) return { id: id, kind: kind };
    if (extra.length === 2 && String(extra[1]).toLowerCase() === "captioned") {
      return { id: id, kind: kind };
    }
    return null;
  }

  function instagramMediaId(url) {
    let media = instagramMediaFromUrl(url);
    return media ? media.id : null;
  }

  /**
   * TikTok video id, host-checked. Accepts the public watch path, the
   * official embed/player paths, and mobile /v/{id} URLs. Short-link hosts
   * (vm.tiktok.com, /t/…) are rejected: resolving them needs a network fetch.
   */
  function tiktokVideoId(url) {
    let parsed = parseAbsoluteHttpUrl(url);
    if (!parsed || !TIKTOK_HOSTS[parsed.host]) return null;
    let path = parsed.path;
    let watch = path.match(/^\/@([A-Za-z0-9._]{1,24})\/video\/(\d{5,20})\/?$/);
    if (watch) return watch[2];
    let embed = path.match(/^\/(?:embed(?:\/v2)?|player\/v1|video)\/(\d{5,20})\/?$/);
    if (embed) return embed[1];
    let mobile = path.match(/^\/v\/(\d{5,20})(?:\.html)?\/?$/);
    return mobile ? mobile[1] : null;
  }

  /**
   * Official TikTok short/share links (vt.tiktok.com / vm.tiktok.com / /t/).
   * Returns { host, code } or null. Never treat the short URL as an iframe src.
   */
  function tiktokShortCode(url) {
    let parsed = parseAbsoluteHttpUrl(url);
    if (!parsed) return null;
    let parts = parsed.path.split("/").filter(Boolean);
    if (TIKTOK_SHORT_HOSTS[parsed.host]) {
      if (parts.length !== 1) return null;
      if (!TIKTOK_SHORT_CODE_RE.test(parts[0])) return null;
      return { host: parsed.host, code: parts[0] };
    }
    if (TIKTOK_HOSTS[parsed.host] && parts.length === 2 && parts[0].toLowerCase() === "t") {
      if (!TIKTOK_SHORT_CODE_RE.test(parts[1])) return null;
      return { host: parsed.host, code: parts[1] };
    }
    return null;
  }

  function canonicalTiktokShortUrl(info) {
    if (!info || !info.code) return "";
    if (info.host === "vt.tiktok.com" || info.host === "vm.tiktok.com") {
      return "https://" + info.host + "/" + info.code + "/";
    }
    return "https://www.tiktok.com/t/" + info.code + "/";
  }

  function extractTikTokIdFromOembedJson(json) {
    if (!json || typeof json !== "object") return null;
    let direct = json.embed_product_id || json.embed_productId;
    if (direct && TIKTOK_ID_RE.test(String(direct))) return String(direct);
    let html = String(json.html || json.cite || "");
    let found = html.match(/https:\/\/(?:www\.|m\.)?tiktok\.com\/[^"'\\\s<>]+/g) || [];
    for (let i = 0; i < found.length; i++) {
      let id = tiktokVideoId(found[i].replace(/[.,;]+$/, ""));
      if (id) return id;
    }
    let loose = html.match(/\/video\/(\d{5,20})/);
    if (loose && TIKTOK_ID_RE.test(loose[1])) return loose[1];
    return null;
  }

  /**
   * Resolve a TikTok watch id. Short links are never fetched directly (no
   * following attacker redirects). Optional host hook, else TikTok's oEmbed
   * endpoint with a URL we constructed from a validated short code.
   */
  function resolveTikTokVideoId(url, securityOptions) {
    securityOptions = mergeSecurityOptions(securityOptions || {});
    let direct = tiktokVideoId(url);
    if (direct) return Promise.resolve(direct);
    let short = tiktokShortCode(url);
    if (!short) return Promise.resolve(null);
    let canonical = canonicalTiktokShortUrl(short);
    let hook = securityOptions.resolveTikTokShortUrl;
    if (hook) {
      return Promise.resolve(hook(canonical)).then(function (resolved) {
        return tiktokVideoId(String(resolved || "")) || null;
      }).catch(function () {
        return null;
      });
    }
    let oembed =
      "https://www.tiktok.com/oembed?url=" + encodeURIComponent(canonical);
    return fetch(oembed, {
      method: "GET",
      credentials: "omit",
      mode: "cors",
      redirect: "follow",
    })
      .then(function (res) {
        if (!res.ok) return null;
        try {
          let finalHost = new URL(res.url).hostname.toLowerCase().replace(/\.$/, "");
          if (finalHost !== "www.tiktok.com" && finalHost !== "tiktok.com") return null;
          let path = new URL(res.url).pathname;
          if (path !== "/oembed") return null;
        } catch (e) {
          return null;
        }
        return res.json();
      })
      .then(extractTikTokIdFromOembedJson)
      .catch(function () {
        return null;
      });
  }

  /**
   * Named frame spec for a provider (+ Instagram kind). Used by both the
   * editing preview and the published iframe shim so proportions match.
   */
  function mediaFrameKey(provider, mediaKind) {
    if (provider === "vimeo") return "vimeo";
    if (provider === "tiktok") return "tiktok";
    if (provider === "instagram") {
      if (mediaKind === "reel") return "instagram-reel";
      if (mediaKind === "tv") return "instagram-video";
      return "instagram-post";
    }
    return "youtube";
  }

  function mediaFrameSpec(provider, mediaKind) {
    let key = mediaFrameKey(provider, mediaKind);
    return MEDIA_FRAME_SPECS[key] || MEDIA_FRAME_SPECS.youtube;
  }

  function mediaFrameIsEmbedFit(spec) {
    return !!(spec && spec.fit === "embed");
  }

  function mediaFrameRatioClass(spec) {
    // YouTube/Vimeo use the padding-bottom shim, not a generic ratio class.
    // Instagram must never inherit 9:16. TikTok sizing is on .fe-media--tiktok
    // (and published inline styles), not .fe-media--ratio-9x16.
    spec = spec || MEDIA_FRAME_SPECS.youtube;
    return "";
  }

  function mediaFrameProviderClass(provider) {
    if (provider === "instagram") return "fe-media--instagram";
    if (provider === "tiktok") return "fe-media--tiktok";
    return "";
  }

  function mediaProviderOf(fig) {
    if (!fig || !fig.getAttribute) return "";
    let p = fig.getAttribute("data-provider") || "";
    if (p) return p;
    if (fig.classList) {
      if (fig.classList.contains("fe-media--instagram")) return "instagram";
      if (fig.classList.contains("fe-media--tiktok")) return "tiktok";
    }
    let preview = fig.querySelector ? fig.querySelector(".fe-media__preview") : null;
    if (preview) return preview.getAttribute("data-provider") || "";
    return "";
  }

  function mediaFrameClasses(provider, spec, extraClass) {
    return joinMediaClasses(
      extraClass,
      mediaFrameProviderClass(provider),
      mediaFrameRatioClass(spec)
    );
  }

  function mediaFrameWrapperStyle(spec) {
    spec = spec || MEDIA_FRAME_SPECS.youtube;
    if (mediaFrameIsEmbedFit(spec) && spec.provider === "tiktok") {
      // Published pages often omit editor CSS. Without an intrinsic ratio the
      // absolutely positioned player collapses to 0 height.
      return "position: relative; width: 100%; max-width: 100%; height: auto; aspect-ratio: 9 / 16; overflow: hidden;";
    }
    if (mediaFrameIsEmbedFit(spec)) {
      return "position: relative; width: 100%; max-width: 100%; height: auto; overflow: hidden;";
    }
    return (
      "position: relative; height: 0; max-width: 100%; padding-bottom: " +
      (spec.paddingBottom || "56.25%") +
      ";"
    );
  }

  function mediaFrameIframeStyle(spec, heightPx) {
    if (mediaFrameIsEmbedFit(spec) && spec.provider === "instagram") {
      let h = parseInt(heightPx, 10);
      let heightDecl =
        h >= 50 && h <= MAX_STYLE_LENGTH_PX ? " height: " + h + "px;" : "";
      return "display: block; width: 100%; max-width: 100%; border: 0; overflow: hidden;" + heightDecl;
    }
    if (mediaFrameIsEmbedFit(spec) && spec.provider === "tiktok") {
      return "position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: 0; overflow: hidden;";
    }
    return "position: absolute; width: 100%; height: 100%; top: 0; left: 0;";
  }

  function isAlignWrap(node) {
    return !!(
      node &&
      node.nodeType === 1 &&
      node.classList &&
      node.classList.contains("fe-align-wrap")
    );
  }

  function readPxWidth(el) {
    if (!el) return 0;
    let inline = "";
    try {
      inline = (el.style && el.style.width) || "";
    } catch (e) {
      inline = "";
    }
    if (/px/i.test(inline)) {
      let n = parseInt(inline, 10);
      if (n >= 40 && n <= MAX_STYLE_LENGTH_PX) return n;
    }
    let style = el.getAttribute ? el.getAttribute("style") || "" : "";
    let m = String(style).match(/(?:^|;)\s*width:\s*(\d+)px\b/i);
    if (!m) return 0;
    let w = parseInt(m[1], 10);
    if (w >= 40 && w <= MAX_STYLE_LENGTH_PX) return w;
    return 0;
  }

  function readMediaLayout(fig) {
    if (!fig) return { width: 0, height: 0 };
    let iframe = fig.querySelector ? fig.querySelector("iframe") : null;
    return {
      width: readPxWidth(fig),
      height: readStylePxHeight(iframe) || readStylePxHeight(fig),
    };
  }

  function applyMediaLayout(fig, layout) {
    if (!fig || !layout || !layout.width) return;
    if (fig.style) {
      fig.style.width = layout.width + "px";
      fig.style.maxWidth = "100%";
    } else if (fig.setAttribute) {
      let prev = fig.getAttribute("style") || "";
      fig.setAttribute(
        "style",
        (prev ? prev.replace(/\s*$/, "; ") : "") +
          "width: " +
          layout.width +
          "px; max-width: 100%;"
      );
    }
    let provider = mediaProviderOf(fig);
    if (layout.height && provider === "instagram") {
      let iframe = fig.querySelector ? fig.querySelector("iframe") : null;
      if (iframe && iframe.style) {
        iframe.style.minHeight = "0";
        iframe.style.height = layout.height + "px";
      }
    }
  }

  function clearAlignFightingMargins(fig) {
    if (!fig || !fig.style) return;
    if (!isAlignWrap(fig.parentNode)) return;
    fig.style.marginLeft = "0";
    fig.style.marginRight = "0";
    fig.style.display = "inline-block";
    fig.style.maxWidth = "100%";
    fig.style.verticalAlign = "top";
  }

  function replaceMediaFigure(oldFig, html, securityOptions, layout) {
    if (!oldFig || !oldFig.parentNode || !html) return;
    let wrap = inertTemplate(sanitizeHtml(html, securityOptions)).content;
    let next = wrap.firstChild;
    if (!next) return;
    applyMediaLayout(next, layout || readMediaLayout(oldFig));
    oldFig.parentNode.replaceChild(next, oldFig);
    clearAlignFightingMargins(next);
  }

  /** Self-contained figure layout so published HTML does not need editor CSS. */
  function mediaFramePublishedFigureStyle(provider, inAlignWrap) {
    if (provider === "instagram") {
      let s = "width: 100%; max-width: 540px; overflow: hidden;";
      if (!inAlignWrap) s += " margin-left: auto; margin-right: auto;";
      return s;
    }
    if (provider === "tiktok") {
      // Default cap only. User-resized px width is applied afterwards and
      // must not compete with a stylesheet `width: min(...)` (YouTube model).
      let s =
        "width: 100%; max-width: min(100%, calc(100vh * 9 / 16)); overflow: hidden;";
      if (!inAlignWrap) s += " margin-left: auto; margin-right: auto;";
      return s;
    }
    return "";
  }

  function readStylePxHeight(el) {
    if (!el) return 0;
    let inline = "";
    try {
      inline = (el.style && el.style.height) || "";
    } catch (e) {
      inline = "";
    }
    let n = parseInt(inline, 10);
    if (n >= 50 && n <= MAX_STYLE_LENGTH_PX) return n;
    let style = el.getAttribute ? el.getAttribute("style") || "" : "";
    let m = String(style).match(/(?:^|;)\s*height:\s*(\d+)px\b/i);
    if (!m) return 0;
    n = parseInt(m[1], 10);
    if (n >= 50 && n <= MAX_STYLE_LENGTH_PX) return n;
    return 0;
  }

  function stampProviderFigure(fig, provider, videoId, mediaKind) {
    if (!fig || !fig.setAttribute) return;
    if (
      provider === "youtube" ||
      provider === "vimeo" ||
      provider === "instagram" ||
      provider === "tiktok"
    ) {
      fig.setAttribute("data-provider", provider);
    }
    if (isProviderVideoId(provider, videoId)) {
      fig.setAttribute("data-video-id", String(videoId));
    }
    if (provider === "instagram" && (mediaKind === "p" || mediaKind === "reel" || mediaKind === "tv")) {
      fig.setAttribute("data-media-kind", mediaKind);
    }
    let layout = readMediaLayout(fig);
    let figStyle = mediaFramePublishedFigureStyle(
      provider,
      isAlignWrap(fig.parentNode)
    );
    if (figStyle) fig.setAttribute("style", figStyle);
    applyMediaLayout(fig, layout);
    clearAlignFightingMargins(fig);
  }

  function joinMediaClasses() {
    let kept = [];
    for (let i = 0; i < arguments.length; i++) {
      let token = String(arguments[i] || "").trim();
      if (token && kept.indexOf(token) === -1) kept.push(token);
    }
    return kept.join(" ");
  }

  function mediaWidget(inner, sourceUrl, extraClass, meta) {
    let safeSource = sanitizeUrl(sourceUrl, { purpose: "href" }) || "";
    let attr = safeSource
      ? ' data-oembed-url="' + String(safeSource).replace(/"/g, "&quot;") + '"'
      : "";
    meta = meta || {};
    if (meta.provider === "youtube" || meta.provider === "vimeo" || meta.provider === "instagram" || meta.provider === "tiktok") {
      attr += ' data-provider="' + meta.provider + '"';
    }
    if (meta.videoId) {
      let vid = String(meta.videoId).replace(/[^\w\-]/g, "").slice(0, 64);
      if (vid) attr += ' data-video-id="' + vid + '"';
    }
    if (meta.mediaKind === "p" || meta.mediaKind === "reel" || meta.mediaKind === "tv") {
      attr += ' data-media-kind="' + meta.mediaKind + '"';
    }
    let cls = "fe-media" + (extraClass ? " " + extraClass : "");
    return (
      '<figure class="' +
      cls +
      '" contenteditable="false"' +
      attr +
      ">" +
      '<div class="fe-media__wrapper">' +
      inner +
      "</div></figure>"
    );
  }

  function ytEmbedSrc(id) {
    return "https://www.youtube-nocookie.com/embed/" + id + "?rel=0";
  }

  /**
   * Build the responsive embed shim via the DOM, not string concatenation, so
   * `src` and `title` cannot break out of their attributes (FE-009).
   *
   * YouTube/Vimeo keep the padding-bottom 16:9 inner wrap.
   * Instagram/TikTok: iframe is a direct child of .fe-media__wrapper so the
   * wrapper can hug the real player instead of a second forced-ratio box.
   */
  function mediaIframe(src, title, spec) {
    spec = spec || MEDIA_FRAME_SPECS.youtube;
    let frame = document.createElement("iframe");
    frame.setAttribute("src", src);
    frame.setAttribute("style", mediaFrameIframeStyle(spec));
    frame.setAttribute("title", title);
    frame.setAttribute("frameborder", "0");
    frame.setAttribute(
      "allow",
      "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
    );
    frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    frame.setAttribute("loading", "lazy");
    frame.setAttribute("sandbox", iframeSandboxForSrc(src));
    frame.setAttribute("allowfullscreen", "");
    if (mediaFrameIsEmbedFit(spec)) frame.setAttribute("scrolling", "no");
    if (mediaFrameIsEmbedFit(spec)) return frame.outerHTML;
    let wrap = document.createElement("div");
    wrap.setAttribute("style", mediaFrameWrapperStyle(spec));
    wrap.appendChild(frame);
    return wrap.outerHTML;
  }

  function responsiveIframe(src, title, spec) {
    return mediaIframe(src, title, spec);
  }

  function ytPreview(url, id) {
    let watch = "https://www.youtube.com/watch?v=" + id;
    let thumb = "https://img.youtube.com/vi/" + id + "/hqdefault.jpg";
    let source = (url || watch).replace(/"/g, "&quot;");
    let inner =
      '<div class="fe-media__preview" data-video-id="' +
      id +
      '" data-provider="youtube" data-watch-url="' +
      watch +
      '">' +
      '<img src="' +
      thumb +
      '" alt="YouTube video" draggable="false" />' +
      '<span class="fe-media__play" aria-hidden="true"></span>' +
      '<span class="fe-media__label">YouTube</span>' +
      "</div>";
    return mediaWidget(inner, source, joinMediaClasses("fe-media--preview"));
  }

  function vimeoPreview(url, id) {
    let watch = "https://vimeo.com/" + id;
    let source = (url || watch).replace(/"/g, "&quot;");
    let inner =
      '<div class="fe-media__preview fe-media__preview--vimeo" data-video-id="' +
      id +
      '" data-provider="vimeo" data-watch-url="' +
      watch +
      '">' +
      '<span class="fe-media__play" aria-hidden="true"></span>' +
      '<span class="fe-media__label">Vimeo</span>' +
      "</div>";
    return mediaWidget(inner, source, joinMediaClasses("fe-media--preview"));
  }

  function liveProviderHtml(provider, id, kind, sourceUrl) {
    let spec = mediaFrameSpec(provider, kind);
    let src;
    let title;
    if (provider === "instagram") {
      src = instagramEmbedSrc(id, kind);
      title = "Instagram";
    } else if (provider === "tiktok") {
      src = tiktokEmbedSrc(id);
      title = "TikTok video";
    } else {
      return null;
    }
    return mediaWidget(
      mediaIframe(src, title, spec),
      providerSourceUrl(sourceUrl, provider, id, kind),
      mediaFrameClasses(provider, spec),
      { provider: provider, videoId: id, mediaKind: kind }
    );
  }

  function ytEmbed(url) {
    let id = ytVideoId(url);
    if (!id) return null;
    return ytPreview(url, id);
  }

  function vimeoEmbed(url) {
    let id = vimeoVideoId(url);
    if (!id) return null;
    return vimeoPreview(url, id);
  }

  function instagramEmbed(url) {
    let media = instagramMediaFromUrl(url);
    if (!media) return null;
    return liveProviderHtml("instagram", media.id, media.kind, url);
  }

  function tiktokEmbed(url) {
    let id = tiktokVideoId(url);
    if (!id) return null;
    return liveProviderHtml("tiktok", id, "", url);
  }

  function instagramEmbedSrc(id, kind) {
    kind = kind === "reel" || kind === "tv" ? kind : "p";
    return "https://www.instagram.com/" + kind + "/" + id + "/embed/";
  }

  function tiktokEmbedSrc(id) {
    return "https://www.tiktok.com/player/v1/" + id;
  }

  function recognizedProviderUrl(url) {
    return !!(
      ytVideoId(url) ||
      vimeoVideoId(url) ||
      instagramMediaId(url) ||
      tiktokVideoId(url)
    );
  }

  function previewFromSource(sourceUrl, securityOptions) {
    if (isProviderEnabled(securityOptions, "youtube")) {
      let ytId = ytVideoId(sourceUrl);
      if (ytId) return ytPreview(sourceUrl, ytId);
    }
    if (isProviderEnabled(securityOptions, "vimeo")) {
      let vimeoId = vimeoVideoId(sourceUrl);
      if (vimeoId) return vimeoPreview(sourceUrl, vimeoId);
    }
    if (isProviderEnabled(securityOptions, "instagram")) {
      let ig = instagramMediaFromUrl(sourceUrl);
      if (ig) return liveProviderHtml("instagram", ig.id, ig.kind, sourceUrl);
    }
    if (isProviderEnabled(securityOptions, "tiktok")) {
      let tk = tiktokVideoId(sourceUrl);
      if (tk) return liveProviderHtml("tiktok", tk, "", sourceUrl);
    }
    return null;
  }

  function mediaEmbed(url, securityOptions) {
    securityOptions = mergeSecurityOptions(securityOptions || {});
    url = String(url || "").trim();
    if (!url) return null;
    let embed = null;
    if (isProviderEnabled(securityOptions, "youtube")) embed = ytEmbed(url);
    if (!embed && isProviderEnabled(securityOptions, "vimeo")) embed = vimeoEmbed(url);
    if (!embed && isProviderEnabled(securityOptions, "instagram")) embed = instagramEmbed(url);
    if (!embed && isProviderEnabled(securityOptions, "tiktok")) embed = tiktokEmbed(url);
    if (embed) {
      // Ensure the oembed URL cannot carry javascript: etc.
      if (!sanitizeUrl(url, { purpose: "href" }) && !recognizedProviderUrl(url)) {
        return null;
      }
      return embed;
    }
    let mediaUrl = sanitizeUrl(url, { purpose: "media" });
    if (mediaUrl && /\.(mp4|webm|ogg)(\?|#|$)/i.test(mediaUrl)) {
      return mediaWidget(
        '<video controls playsinline preload="metadata" src="' +
        mediaUrl.replace(/"/g, "&quot;") +
        '" style="display:block;width:100%;height:auto;"></video>',
        mediaUrl
      );
    }
    return null;
  }

  function mediaEmbedAsync(url, securityOptions) {
    securityOptions = mergeSecurityOptions(securityOptions || {});
    url = String(url || "").trim();
    let short = tiktokShortCode(url);
    if (short && isProviderEnabled(securityOptions, "tiktok")) {
      return resolveTikTokVideoId(url, securityOptions).then(function (id) {
        if (!id) return null;
        return liveProviderHtml("tiktok", id, "", "https://www.tiktok.com/video/" + id);
      });
    }
    return Promise.resolve(mediaEmbed(url, securityOptions));
  }

  /**
   * A widget's data-oembed-url must belong to the provider it claims (FE-021).
   * Stored markup can say provider="vimeo" while pointing that attribute at
   * any host, and downstream renderers treat it as the embed source.
   */
  function providerSourceUrl(sourceUrl, provider, videoId, mediaKind) {
    if (provider === "youtube") {
      return ytVideoId(sourceUrl)
        ? sourceUrl
        : "https://www.youtube.com/watch?v=" + videoId;
    }
    if (provider === "vimeo") {
      return vimeoVideoId(sourceUrl) ? sourceUrl : "https://vimeo.com/" + videoId;
    }
    if (provider === "instagram") {
      if (instagramMediaFromUrl(sourceUrl)) return sourceUrl;
      let kind = mediaKind === "reel" || mediaKind === "tv" ? mediaKind : "p";
      return "https://www.instagram.com/" + kind + "/" + videoId + "/";
    }
    if (provider === "tiktok") {
      return tiktokVideoId(sourceUrl)
        ? sourceUrl
        : "https://www.tiktok.com/video/" + videoId;
    }
    return sourceUrl;
  }

  /** Provider ids come from stored attributes; hold them to the real formats. */
  function isProviderVideoId(provider, videoId) {
    if (provider === "youtube") return /^[A-Za-z0-9_-]{11}$/.test(String(videoId || ""));
    if (provider === "vimeo") return /^\d{1,15}$/.test(String(videoId || ""));
    if (provider === "instagram") return INSTAGRAM_ID_RE.test(String(videoId || ""));
    if (provider === "tiktok") return TIKTOK_ID_RE.test(String(videoId || ""));
    return false;
  }

  function publishedMediaWidget(src, title, sourceUrl, spec, provider, videoId, mediaKind) {
    spec = spec || MEDIA_FRAME_SPECS.youtube;
    let html = mediaWidget(
      mediaIframe(src, title, spec),
      sourceUrl,
      mediaFrameClasses(provider, spec),
      { provider: provider, videoId: videoId, mediaKind: mediaKind }
    );
    if (provider !== "instagram" && provider !== "tiktok") return html;
    let tpl = inertTemplate(html);
    let fig = tpl.content.querySelector("figure.fe-media");
    if (!fig) return html;
    stampProviderFigure(fig, provider, videoId, mediaKind);
    let wrap = fig.querySelector(".fe-media__wrapper");
    if (wrap) wrap.setAttribute("style", mediaFrameWrapperStyle(spec));
    return tpl.innerHTML;
  }

  function publishedMediaHtml(sourceUrl, provider, videoId, mediaKind, securityOptions) {
    if (
      provider === "youtube" &&
      isProviderEnabled(securityOptions, "youtube") &&
      isProviderVideoId("youtube", videoId)
    ) {
      return publishedMediaWidget(
        ytEmbedSrc(videoId),
        "YouTube video",
        providerSourceUrl(sourceUrl, "youtube", videoId),
        mediaFrameSpec("youtube"),
        "youtube",
        videoId
      );
    }
    if (
      provider === "vimeo" &&
      isProviderEnabled(securityOptions, "vimeo") &&
      isProviderVideoId("vimeo", videoId)
    ) {
      return publishedMediaWidget(
        "https://player.vimeo.com/video/" + videoId,
        "Vimeo video",
        providerSourceUrl(sourceUrl, "vimeo", videoId),
        mediaFrameSpec("vimeo"),
        "vimeo",
        videoId
      );
    }
    if (
      provider === "instagram" &&
      isProviderEnabled(securityOptions, "instagram") &&
      isProviderVideoId("instagram", videoId)
    ) {
      let parsed = instagramMediaFromUrl(sourceUrl);
      let kind = parsed
        ? parsed.kind
        : mediaKind === "reel" || mediaKind === "tv"
          ? mediaKind
          : "p";
      return publishedMediaWidget(
        instagramEmbedSrc(videoId, kind),
        "Instagram",
        providerSourceUrl(sourceUrl, "instagram", videoId, kind),
        mediaFrameSpec("instagram", kind),
        "instagram",
        videoId,
        kind
      );
    }
    if (
      provider === "tiktok" &&
      isProviderEnabled(securityOptions, "tiktok") &&
      isProviderVideoId("tiktok", videoId)
    ) {
      return publishedMediaWidget(
        tiktokEmbedSrc(videoId),
        "TikTok video",
        providerSourceUrl(sourceUrl, "tiktok", videoId),
        mediaFrameSpec("tiktok"),
        "tiktok",
        videoId
      );
    }
    return publishedFromRecognizedUrl(sourceUrl, securityOptions);
  }

  function publishedFromRecognizedUrl(sourceUrl, securityOptions) {
    if (isProviderEnabled(securityOptions, "youtube")) {
      let ytId = ytVideoId(sourceUrl);
      if (ytId) {
        return publishedMediaWidget(
          ytEmbedSrc(ytId),
          "YouTube video",
          sourceUrl,
          mediaFrameSpec("youtube"),
          "youtube",
          ytId
        );
      }
    }
    if (isProviderEnabled(securityOptions, "vimeo")) {
      let vimeoId = vimeoVideoId(sourceUrl);
      if (vimeoId) {
        return publishedMediaWidget(
          "https://player.vimeo.com/video/" + vimeoId,
          "Vimeo video",
          sourceUrl,
          mediaFrameSpec("vimeo"),
          "vimeo",
          vimeoId
        );
      }
    }
    if (isProviderEnabled(securityOptions, "instagram")) {
      let ig = instagramMediaFromUrl(sourceUrl);
      if (ig) {
        return publishedMediaWidget(
          instagramEmbedSrc(ig.id, ig.kind),
          "Instagram",
          sourceUrl,
          mediaFrameSpec("instagram", ig.kind),
          "instagram",
          ig.id,
          ig.kind
        );
      }
    }
    if (isProviderEnabled(securityOptions, "tiktok")) {
      let tk = tiktokVideoId(sourceUrl);
      if (tk) {
        return publishedMediaWidget(
          tiktokEmbedSrc(tk),
          "TikTok video",
          sourceUrl,
          mediaFrameSpec("tiktok"),
          "tiktok",
          tk
        );
      }
    }
    return null;
  }

  function applyConstructedIframeSrc(iframe, src, spec, provider) {
    let keepHeight = provider === "instagram" ? readStylePxHeight(iframe) : 0;
    iframe.setAttribute("src", src);
    iframe.setAttribute("sandbox", iframeSandboxForSrc(src));
    iframe.removeAttribute("loading");
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    if (!spec) return;
    iframe.setAttribute("style", mediaFrameIframeStyle(spec, keepHeight));
    if (mediaFrameIsEmbedFit(spec)) iframe.setAttribute("scrolling", "no");
    let wrap = iframe.parentNode;
    if (wrap && wrap.setAttribute && wrap.classList && wrap.classList.contains("fe-media__wrapper")) {
      wrap.setAttribute("style", mediaFrameWrapperStyle(spec));
    } else if (wrap && wrap.setAttribute && !mediaFrameIsEmbedFit(spec)) {
      wrap.setAttribute("style", mediaFrameWrapperStyle(spec));
    }
    let fig = iframe.closest ? iframe.closest("figure.fe-media") : null;
    if (fig && fig.classList) {
      fig.classList.remove(
        "fe-media--ratio-1x1",
        "fe-media--ratio-9x16",
        "fe-media--ratio-16x9",
        "fe-media--instagram",
        "fe-media--tiktok",
        "fe-media--preview"
      );
      let extra = mediaFrameClasses(provider, spec);
      if (extra) {
        extra.split(/\s+/).forEach(function (token) {
          if (token) fig.classList.add(token);
        });
      }
      let videoId = "";
      let mediaKind = "";
      if (provider === "instagram") {
        let ig = instagramMediaFromUrl(src);
        if (ig) {
          videoId = ig.id;
          mediaKind = ig.kind;
        }
      } else if (provider === "tiktok") {
        videoId = tiktokVideoId(src) || "";
      } else if (provider === "youtube") {
        videoId = ytVideoId(src) || "";
      } else if (provider === "vimeo") {
        videoId = vimeoVideoId(src) || "";
      }
      stampProviderFigure(fig, provider, videoId, mediaKind);
    }
  }

  function rewriteProviderIframe(iframe, sourceUrl, securityOptions) {
    let iframeSrc = iframe.getAttribute("src") || "";
    if (isProviderEnabled(securityOptions, "youtube")) {
      let id = ytVideoId(iframeSrc) || ytVideoId(sourceUrl);
      if (id) {
        applyConstructedIframeSrc(iframe, ytEmbedSrc(id), mediaFrameSpec("youtube"), "youtube");
        return true;
      }
    }
    if (isProviderEnabled(securityOptions, "vimeo")) {
      let vimeoId = vimeoVideoId(iframeSrc) || vimeoVideoId(sourceUrl);
      if (vimeoId) {
        applyConstructedIframeSrc(
          iframe,
          "https://player.vimeo.com/video/" + vimeoId,
          mediaFrameSpec("vimeo"),
          "vimeo"
        );
        return true;
      }
    }
    if (isProviderEnabled(securityOptions, "instagram")) {
      let ig = instagramMediaFromUrl(iframeSrc) || instagramMediaFromUrl(sourceUrl);
      if (ig) {
        applyConstructedIframeSrc(
          iframe,
          instagramEmbedSrc(ig.id, ig.kind),
          mediaFrameSpec("instagram", ig.kind),
          "instagram"
        );
        return true;
      }
    }
    if (isProviderEnabled(securityOptions, "tiktok")) {
      let tk = tiktokVideoId(iframeSrc) || tiktokVideoId(sourceUrl);
      if (tk) {
        applyConstructedIframeSrc(iframe, tiktokEmbedSrc(tk), mediaFrameSpec("tiktok"), "tiktok");
        return true;
      }
    }
    if (!isSafeIframeSrc(iframeSrc, securityOptions)) {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }
    return false;
  }

  const PROVIDER_EMBED_RESIZE_ORIGINS = nullMap({
    "https://www.instagram.com": true,
    "https://instagram.com": true,
    "https://www.tiktok.com": true,
    "https://tiktok.com": true,
  });

  function providerEmbedReportedHeight(data) {
    if (data == null) return 0;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        return 0;
      }
    }
    if (typeof data !== "object") return 0;
    let raw = data.height;
    if (raw == null && data.details && typeof data.details === "object") {
      raw = data.details.height;
    }
    if (raw == null && data.payload && typeof data.payload === "object") {
      raw = data.payload.height;
    }
    let n = parseInt(raw, 10);
    if (!n || n < 50 || n > MAX_STYLE_LENGTH_PX) return 0;
    return n;
  }

  function onProviderEmbedResize(event) {
    if (!event || !PROVIDER_EMBED_RESIZE_ORIGINS[event.origin]) return;
    let height = providerEmbedReportedHeight(event.data);
    if (!height || !event.source) return;
    let frames = document.querySelectorAll("figure.fe-media--instagram iframe");
    for (let i = 0; i < frames.length; i++) {
      let iframe = frames[i];
      try {
        if (iframe.contentWindow !== event.source) continue;
      } catch (e) {
        continue;
      }
      let fig = iframe.closest ? iframe.closest("figure.fe-media") : null;
      // Width in px means the author resized this card; keep the drag-scaled
      // height instead of letting the embed's postMessage overwrite it.
      if (fig && readPxWidth(fig)) return;
      providerEmbedResizeSilent = true;
      try {
        iframe.style.minHeight = "0";
        iframe.style.height = height + "px";
        iframe.style.overflow = "hidden";
        iframe.setAttribute("scrolling", "no");
      } finally {
        providerEmbedResizeSilent = false;
      }
      return;
    }
  }

  let providerEmbedResizeBound = false;
  let providerEmbedResizeSilent = false;
  function bindProviderEmbedResize() {
    if (providerEmbedResizeBound || typeof window === "undefined") return;
    providerEmbedResizeBound = true;
    window.addEventListener("message", onProviderEmbedResize, false);
  }

  /**
   * Rewrite editing-time media widgets into their published form, through
   * inertTemplate() (FE-023). getHTML() runs this on every input event, and a
   * live parse would re-create the thumbnail <img> and player <iframe> in the
   * main document each time, firing a fetch per keystroke.
   */
  function serializeMediaForOutput(html, securityOptions) {
    if (!html || html.indexOf("fe-media") === -1) return html;
    let tpl = inertTemplate(sanitizeHtml(html, securityOptions));
    let box = tpl.content;
    Array.prototype.forEach.call(
      box.querySelectorAll("figure.fe-media"),
      function (fig) {
        let preview = fig.querySelector(".fe-media__preview");
        let iframe = fig.querySelector("iframe");
        let sourceUrl = fig.getAttribute("data-oembed-url") || "";
        if (preview) {
          let provider = preview.getAttribute("data-provider") || "";
          let videoId = preview.getAttribute("data-video-id") || "";
          if (!sourceUrl) {
            sourceUrl =
              preview.getAttribute("data-watch-url") ||
              preview.getAttribute("href") ||
              "";
          }
          let mediaKind = preview.getAttribute("data-media-kind") || "";
          let layout = readMediaLayout(fig);
          let out = publishedMediaHtml(
            sourceUrl,
            provider,
            videoId,
            mediaKind,
            securityOptions
          );
          if (out) replaceMediaFigure(fig, out, securityOptions, layout);
          return;
        }
        if (iframe && (iframe.getAttribute("src") || "")) {
          rewriteProviderIframe(iframe, sourceUrl, securityOptions);
        }
      }
    );
    return tpl.innerHTML;
  }

  /** Inverse of serializeMediaForOutput(). Inert for the same reason (FE-023). */
  function prepareMediaForEditing(html, securityOptions) {
    if (!html) return html;
    let tpl = inertTemplate(sanitizeHtml(html, securityOptions));
    let box = tpl.content;
    Array.prototype.forEach.call(
      box.querySelectorAll("figure.fe-media, iframe"),
      function (node) {
        if (node.matches && node.matches("figure.fe-media")) {
          let preview = node.querySelector(".fe-media__preview");
          let iframe = node.querySelector("iframe");
          let sourceUrl =
            node.getAttribute("data-oembed-url") ||
            (preview && (preview.getAttribute("data-watch-url") || preview.getAttribute("href"))) ||
            (iframe && iframe.getAttribute("src")) ||
            "";
          let providerHint = preview ? preview.getAttribute("data-provider") || "" : "";
          let isIgTt =
            providerHint === "instagram" ||
            providerHint === "tiktok" ||
            !!instagramMediaFromUrl(sourceUrl) ||
            !!tiktokVideoId(sourceUrl);
          if (isIgTt) {
            let liveHtml = previewFromSource(sourceUrl, securityOptions);
            if (liveHtml) {
              replaceMediaFigure(node, liveHtml, securityOptions, readMediaLayout(node));
            }
            return;
          }
          if (preview) return;
          if (!iframe) return;
          let previewHtml = previewFromSource(sourceUrl, securityOptions);
          if (!previewHtml) return;
          replaceMediaFigure(node, previewHtml, securityOptions, readMediaLayout(node));
          return;
        }
        // Bare iframe (not wrapped yet)
        if (node.tagName === "IFRAME") {
          if (node.closest && node.closest("figure.fe-media")) return;
          let src = node.getAttribute("src") || "";
          let bareHtml = previewFromSource(src, securityOptions);
          if (!bareHtml) {
            if (!isSafeIframeSrc(src, securityOptions) && node.parentNode) {
              node.parentNode.removeChild(node);
            }
            return;
          }
          let bareWrap = inertTemplate(sanitizeHtml(bareHtml, securityOptions)).content;
          if (bareWrap.firstChild) {
            node.parentNode.replaceChild(bareWrap.firstChild, node);
          }
        }
      }
    );
    return tpl.innerHTML;
  }

  function buildTable(rows, cols) {
    let html = '<table class="fe-table"><tbody>';
    for (let r = 0; r < rows; r++) {
      html += "<tr>";
      for (let c = 0; c < cols; c++) {
        html += r === 0 ? "<th><br></th>" : "<td><br></td>";
      }
      html += "</tr>";
    }
    html += "</tbody></table><p style=\"font-size:" + DEFAULT_FONT_SIZE + "px\"><br></p>";
    return html;
  }

  function placeCaretIn(node) {
    if (!node) return;
    let sel = window.getSelection();
    if (!sel) return;
    let range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function placeCaretAfter(node) {
    if (!node) return;
    let sel = window.getSelection();
    if (!sel) return;
    let range = document.createRange();
    range.setStartAfter(node);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Insert HTML at the caret. Sanitizes first, then uses execCommand so the
   * caret/selection stay coherent. Undo/redo is owned by the editor history
   * stack (native undo is intercepted and ignored).
   */
  function insertHtmlAtCaret(editor, html, securityOptions) {
    html = sanitizeHtml(html, securityOptions);
    if (!html) return;
    editor.focus();
    let sel = window.getSelection();
    if (!(sel && sel.rangeCount && editor.contains(sel.anchorNode))) {
      exec("insertHTML", html);
      return;
    }

    let tableCount = editor.querySelectorAll("table").length;
    let inserted = false;
    try {
      inserted = document.execCommand("insertHTML", false, html);
    } catch (e) {
      inserted = false;
    }
    if (!inserted) {
      let range = sel.getRangeAt(0);
      range.deleteContents();
      let wrap = document.createElement("div");
      wrap.innerHTML = html;
      let frag = document.createDocumentFragment();
      let first = null;
      let last = null;
      while (wrap.firstChild) {
        last = wrap.firstChild;
        if (!first) first = last;
        frag.appendChild(last);
      }
      range.insertNode(frag);
      let firstCell = first && first.querySelector ? first.querySelector("th,td") : null;
      if (firstCell) {
        placeCaretIn(firstCell);
        return;
      }
      if (last) {
        range = document.createRange();
        range.setStartAfter(last);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      return;
    }

    if (html.toLowerCase().indexOf("<table") !== -1) {
      let tables = editor.querySelectorAll("table");
      if (tables.length > tableCount) {
        let cell = tables[tables.length - 1].querySelector("th,td");
        if (cell) placeCaretIn(cell);
      }
    }
  }

  function positionFloatingPanel(panel, anchor) {
    if (!panel || !anchor) return;
    panel.style.position = "fixed";
    panel.style.right = "auto";
    panel.style.bottom = "auto";
    panel.style.maxHeight = "";
    panel.style.overflow = "";

    let pad = 8;
    let rect = anchor.getBoundingClientRect();
    let vw = document.documentElement.clientWidth;
    let vh = document.documentElement.clientHeight;

    let pw = panel.offsetWidth || 184;
    let ph = panel.offsetHeight || 220;

    let left = rect.left;
    if (left + pw > vw - pad) left = rect.right - pw;
    if (left < pad) left = pad;
    if (left + pw > vw - pad) left = Math.max(pad, vw - pw - pad);

    let top = rect.bottom + 6;
    let spaceBelow = vh - rect.bottom - pad;
    let spaceAbove = rect.top - pad;
    if (ph > spaceBelow && spaceAbove > spaceBelow) {
      top = rect.top - ph - 6;
    }
    if (top < pad) top = pad;

    let maxH = Math.max(120, vh - top - pad);
    if (ph > maxH) {
      panel.style.maxHeight = maxH + "px";
      panel.style.overflow = "auto";
    }

    let maxW = Math.max(140, vw - left - pad);
    panel.style.maxWidth = Math.min(pw + 40, maxW) + "px";

    panel.style.left = Math.round(left) + "px";
    panel.style.top = Math.round(top) + "px";
  }

  function createTablePicker(onPick) {
    let MAX = 10;
    let cells = [];
    let label = el("div", { className: "fe-table-label", text: "1 × 1" });
    let grid = el("div", {
      className: "fe-table-grid",
      role: "grid",
      "aria-label": "Choose table size",
    });
    let anchorEl = null;
    let onReposition = null;

    function highlight(rows, cols) {
      cells.forEach(function (cell) {
        let r = parseInt(cell.getAttribute("data-row"), 10);
        let c = parseInt(cell.getAttribute("data-col"), 10);
        if (r <= rows && c <= cols) cell.classList.add("is-hover");
        else cell.classList.remove("is-hover");
      });
      label.textContent = rows + " × " + cols;
    }

    for (let r = 1; r <= MAX; r++) {
      for (let c = 1; c <= MAX; c++) {
        (function (row, col) {
          let cell = el("button", {
            type: "button",
            className: "fe-table-cell",
            "data-row": String(row),
            "data-col": String(col),
            "aria-label": row + " by " + col,
            title: row + " × " + col,
            onMouseenter: function () {
              highlight(row, col);
            },
            onClick: function (e) {
              e.preventDefault();
              e.stopPropagation();
              onPick(row, col);
            },
          });
          cells.push(cell);
          grid.appendChild(cell);
        })(r, c);
      }
    }

    highlight(1, 1);

    let panel = el("div", { className: "fe-table-picker", hidden: true }, [
      grid,
      label,
    ]);

    function reposition() {
      if (panel.hidden || !anchorEl) return;
      positionFloatingPanel(panel, anchorEl);
    }

    return {
      panel: panel,
      setAnchor: function (el) {
        anchorEl = el;
      },
      open: function () {
        highlight(1, 1);
        if (panel.parentNode !== document.body) {
          document.body.appendChild(panel);
        }
        panel.hidden = false;
        reposition();
        requestAnimationFrame(reposition);
        if (!onReposition) {
          onReposition = reposition;
          window.addEventListener("resize", onReposition);
          window.addEventListener("scroll", onReposition, true);
        }
      },
      close: function () {
        panel.hidden = true;
        panel.style.maxHeight = "";
        panel.style.overflow = "";
        if (onReposition) {
          window.removeEventListener("resize", onReposition);
          window.removeEventListener("scroll", onReposition, true);
          onReposition = null;
        }
      },
      isOpen: function () {
        return !panel.hidden;
      },
      contains: function (node) {
        return panel.contains(node);
      },
    };
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function hexToRgb(hex) {
    let h = String(hex || "").replace("#", "");
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    if (h.length !== 6) return null;
    let r = parseInt(h.slice(0, 2), 16);
    let g = parseInt(h.slice(2, 4), 16);
    let b = parseInt(h.slice(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r: r, g: g, b: b };
  }

  function rgbToHex(r, g, b) {
    function toHex(n) {
      let s = clamp(Math.round(n), 0, 255).toString(16);
      return s.length === 1 ? "0" + s : s;
    }
    return ("#" + toHex(r) + toHex(g) + toHex(b)).toUpperCase();
  }

  function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let d = max - min;
    let h = 0;
    let s = max === 0 ? 0 : d / max;
    let v = max;
    if (d !== 0) {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        default:
          h = (r - g) / d + 4;
      }
      h /= 6;
    }
    return { h: h * 360, s: s, v: v };
  }

  function hsvToRgb(h, s, v) {
    h = ((h % 360) + 360) % 360;
    let c = v * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = v - c;
    let r = 0;
    let g = 0;
    let b = 0;
    if (h < 60) {
      r = c;
      g = x;
    } else if (h < 120) {
      r = x;
      g = c;
    } else if (h < 180) {
      g = c;
      b = x;
    } else if (h < 240) {
      g = x;
      b = c;
    } else if (h < 300) {
      r = x;
      b = c;
    } else {
      r = c;
      b = x;
    }
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  function createColorDialog(onSave) {
    let state = { h: 210, s: 0.2, v: 0.96 };
    let dragging = null;

    let title = el("div", { className: "fe-cpick__title", text: "Color Picker" });
    let closeX = el("button", {
      type: "button",
      className: "fe-cpick__x",
      "aria-label": "Close",
      html: "&times;",
    });

    let sv = el("div", {
      className: "fe-cpick__sv",
      role: "slider",
      "aria-label": "Saturation and brightness",
    });
    let svCursor = el("div", { className: "fe-cpick__sv-cursor" });
    sv.appendChild(svCursor);

    let hue = el("div", {
      className: "fe-cpick__hue",
      role: "slider",
      "aria-label": "Hue",
    });
    let hueCursor = el("div", { className: "fe-cpick__hue-cursor" });
    hue.appendChild(hueCursor);

    function field(labelText, key) {
      let input = el("input", {
        type: "text",
        className: "fe-cpick__input",
        "data-key": key,
        spellcheck: "false",
        autocomplete: "off",
      });
      let row = el("label", { className: "fe-cpick__field" }, [
        el("span", { className: "fe-cpick__label", text: labelText }),
        input,
      ]);
      return { row: row, input: input };
    }

    let rField = field("R", "r");
    let gField = field("G", "g");
    let bField = field("B", "b");
    let hexField = field("#", "hex");
    let preview = el("div", { className: "fe-cpick__preview" });

    let cancelBtn = el("button", {
      type: "button",
      className: "fe-cpick__btn fe-cpick__btn--cancel",
      text: "Cancel",
    });
    let saveBtn = el("button", {
      type: "button",
      className: "fe-cpick__btn fe-cpick__btn--save",
      text: "Save",
    });

    let dialog = el("div", {
      className: "fe-cpick__dialog",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Color Picker",
    }, [
      el("div", { className: "fe-cpick__head" }, [title, closeX]),
      el("div", { className: "fe-cpick__body" }, [
        sv,
        hue,
        el("div", { className: "fe-cpick__aside" }, [
          rField.row,
          gField.row,
          bField.row,
          hexField.row,
          preview,
        ]),
      ]),
      el("div", { className: "fe-cpick__foot" }, [cancelBtn, saveBtn]),
    ]);

    let overlay = el("div", { className: "fe-cpick", hidden: true }, [dialog]);

    function currentHex() {
      let rgb = hsvToRgb(state.h, state.s, state.v);
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    function render(skipInputs) {
      let rgb = hsvToRgb(state.h, state.s, state.v);
      let hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      let pure = hsvToRgb(state.h, 1, 1);
      sv.style.background =
        "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, rgb(" +
        pure.r +
        "," +
        pure.g +
        "," +
        pure.b +
        "))";
      svCursor.style.left = state.s * 100 + "%";
      svCursor.style.top = (1 - state.v) * 100 + "%";
      hueCursor.style.top = (state.h / 360) * 100 + "%";
      preview.style.backgroundColor = hex;
      if (!skipInputs) {
        rField.input.value = String(rgb.r);
        gField.input.value = String(rgb.g);
        bField.input.value = String(rgb.b);
        hexField.input.value = hex.replace("#", "");
      }
    }

    function setFromRgb(r, g, b, skipInputs) {
      r = clamp(r, 0, 255);
      g = clamp(g, 0, 255);
      b = clamp(b, 0, 255);
      let hsv = rgbToHsv(r, g, b);
      state.h = hsv.h;
      state.s = hsv.s;
      state.v = hsv.v;
      render(skipInputs);
    }

    function setFromHex(hex, skipInputs) {
      let rgb = hexToRgb(hex);
      if (!rgb) return false;
      setFromRgb(rgb.r, rgb.g, rgb.b, skipInputs);
      return true;
    }

    function pickSv(clientX, clientY) {
      let rect = sv.getBoundingClientRect();
      state.s = clamp((clientX - rect.left) / rect.width, 0, 1);
      state.v = 1 - clamp((clientY - rect.top) / rect.height, 0, 1);
      render();
    }

    function pickHue(clientY) {
      let rect = hue.getBoundingClientRect();
      state.h = clamp(((clientY - rect.top) / rect.height) * 360, 0, 360);
      render();
    }

    function onMove(e) {
      if (!dragging) return;
      e.preventDefault();
      let point = e.touches ? e.touches[0] : e;
      if (dragging === "sv") pickSv(point.clientX, point.clientY);
      else if (dragging === "hue") pickHue(point.clientY);
    }

    function onUp() {
      dragging = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    }

    function startDrag(kind, e) {
      e.preventDefault();
      e.stopPropagation();
      dragging = kind;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onUp);
      let point = e.touches ? e.touches[0] : e;
      if (kind === "sv") pickSv(point.clientX, point.clientY);
      else pickHue(point.clientY);
    }

    sv.addEventListener("mousedown", function (e) {
      startDrag("sv", e);
    });
    sv.addEventListener("touchstart", function (e) {
      startDrag("sv", e);
    }, { passive: false });
    hue.addEventListener("mousedown", function (e) {
      startDrag("hue", e);
    });
    hue.addEventListener("touchstart", function (e) {
      startDrag("hue", e);
    }, { passive: false });

    function onRgbInput() {
      let r = parseInt(rField.input.value, 10);
      let g = parseInt(gField.input.value, 10);
      let b = parseInt(bField.input.value, 10);
      if (isNaN(r) || isNaN(g) || isNaN(b)) return;
      setFromRgb(r, g, b, true);
      let rgb = hsvToRgb(state.h, state.s, state.v);
      hexField.input.value = rgbToHex(rgb.r, rgb.g, rgb.b).replace("#", "");
      preview.style.backgroundColor = rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    rField.input.addEventListener("input", onRgbInput);
    gField.input.addEventListener("input", onRgbInput);
    bField.input.addEventListener("input", onRgbInput);
    hexField.input.addEventListener("input", function () {
      let raw = hexField.input.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
      hexField.input.value = raw;
      if (raw.length === 6) setFromHex("#" + raw);
    });

    function close() {
      overlay.hidden = true;
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.removeEventListener("keydown", onKey, true);
      onUp();
    }

    function onKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    }

    function open(initialHex) {
      setFromHex(initialHex || DEFAULT_TEXT_COLOR);
      if (overlay.parentNode !== document.body) {
        document.body.appendChild(overlay);
      }
      overlay.hidden = false;
      document.addEventListener("keydown", onKey, true);
      hexField.input.focus();
      hexField.input.select();
    }

    closeX.addEventListener("click", function (e) {
      e.preventDefault();
      close();
    });
    cancelBtn.addEventListener("click", function (e) {
      e.preventDefault();
      close();
    });
    saveBtn.addEventListener("click", function (e) {
      e.preventDefault();
      let hex = currentHex();
      close();
      if (typeof onSave === "function") onSave(hex);
    });
    overlay.addEventListener("mousedown", function (e) {
      if (e.target === overlay) close();
    });
    dialog.addEventListener("mousedown", function (e) {
      e.stopPropagation();
    });

    return {
      open: open,
      close: close,
      isOpen: function () {
        return !overlay.hidden && !!overlay.parentNode;
      },
      contains: function (node) {
        return overlay.contains(node);
      },
    };
  }

  function createColorPicker(onPick) {
    let anchorEl = null;
    let onReposition = null;
    let swatches = [];
    let selectedHex = "";

    function normalizeHex(hex) {
      if (!hex) return "";
      let h = String(hex).toLowerCase();
      if (h.charAt(0) !== "#") h = "#" + h;
      if (h.length === 4) {
        return "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
      }
      return h.length === 7 ? h : "";
    }

    function syncApplyBtn() {
      applyBtn.style.backgroundColor = "#000000";
      applyBtn.classList.toggle("is-selected", selectedHex === "#000000");
      applyBtn.setAttribute("aria-pressed", selectedHex === "#000000" ? "true" : "false");
    }

    function markSelected(hex) {
      selectedHex = normalizeHex(hex);
      swatches.forEach(function (btn) {
        let match = normalizeHex(btn.getAttribute("data-color")) === selectedHex;
        btn.classList.toggle("is-selected", match);
        btn.setAttribute("aria-pressed", match ? "true" : "false");
      });
      syncApplyBtn();
    }

    TEXT_COLORS.forEach(function (hex) {
      swatches.push(
        el("button", {
          type: "button",
          className: "fe-color-swatch",
          title: hex,
          "aria-label": "Color " + hex,
          "aria-pressed": "false",
          "data-color": hex,
          style: "background-color:" + hex,
          onMousedown: function (e) {
            e.preventDefault();
          },
          onClick: function (e) {
            e.preventDefault();
            e.stopPropagation();
            markSelected(hex);
            onPick(hex);
          },
        })
      );
    });

    let colorDialog = createColorDialog(function (hex) {
      markSelected(hex);
      onPick(hex);
    });

    let applyBtn = el("button", {
      type: "button",
      className: "fe-color-apply",
      title: "#000000",
      "aria-label": "Color #000000",
      "aria-pressed": "false",
      "data-color": "#000000",
      onMousedown: function (e) {
        e.preventDefault();
      },
      onClick: function (e) {
        e.preventDefault();
        e.stopPropagation();
        markSelected("#000000");
        onPick("#000000");
      },
    });

    let paletteBtn = el("button", {
      type: "button",
      className: "fe-btn fe-color-palette",
      title: "More colors",
      "aria-label": "More colors",
      onMousedown: function (e) {
        e.preventDefault();
        e.stopPropagation();
      },
      onClick: function (e) {
        e.preventDefault();
        e.stopPropagation();
        colorDialog.open(selectedHex || DEFAULT_TEXT_COLOR);
      },
    });
    paletteBtn.innerHTML = ICONS.palette;

    let panel = el("div", { className: "fe-color-picker", hidden: true }, [
      el("div", { className: "fe-color-grid", role: "group", "aria-label": "Text colors" }, swatches),
      el("div", { className: "fe-color-more" }, [applyBtn, paletteBtn]),
    ]);

    syncApplyBtn();

    function reposition() {
      if (panel.hidden || !anchorEl) return;
      positionFloatingPanel(panel, anchorEl);
    }

    return {
      panel: panel,
      setAnchor: function (node) {
        anchorEl = node;
      },
      setValue: function (hex) {
        markSelected(hex || DEFAULT_TEXT_COLOR);
      },
      isNativeOpen: function () {
        return colorDialog.isOpen();
      },
      open: function () {
        if (panel.parentNode !== document.body) {
          document.body.appendChild(panel);
        }
        panel.hidden = false;
        markSelected(selectedHex || DEFAULT_TEXT_COLOR);
        reposition();
        requestAnimationFrame(reposition);
        if (!onReposition) {
          onReposition = reposition;
          window.addEventListener("resize", onReposition);
          window.addEventListener("scroll", onReposition, true);
        }
      },
      close: function () {
        if (colorDialog.isOpen()) return;
        panel.hidden = true;
        panel.style.maxHeight = "";
        panel.style.overflow = "";
        if (onReposition) {
          window.removeEventListener("resize", onReposition);
          window.removeEventListener("scroll", onReposition, true);
          onReposition = null;
        }
      },
      isOpen: function () {
        return !panel.hidden;
      },
      contains: function (node) {
        return panel.contains(node) || colorDialog.contains(node);
      },
    };
  }

  function normalizeHtml(html) {
    if (!html || html === "<br>" || html === "<div><br></div>") {
      return "";
    }
    return html;
  }

  /**
   * Split page-authored editor chrome (.editor-body / .editor-footer) away
   * from the content.
   *
   * Runs BEFORE the sanitizer on input that is attacker-controlled via
   * create({initialData|value}), so extraction must be inert (FE-001/FE-002).
   * The caller sanitizes both halves afterwards.
   */
  function extractEditorChrome(html) {
    // `tpl.content` is the inert tree to read; `tpl.innerHTML` serializes that
    // same tree back out (a DocumentFragment has no innerHTML of its own).
    let tpl = inertTemplate(html);
    let box = tpl.content;
    let footer = box.querySelector(".editor-footer");
    let footerHtml = null;
    if (footer) {
      footerHtml = footer.outerHTML;
      if (footer.parentNode) footer.parentNode.removeChild(footer);
    }
    let body = box.querySelector(".editor-body");
    let contentHtml;
    if (body) {
      contentHtml = body.innerHTML;
    } else {
      contentHtml = tpl.innerHTML;
    }
    return { contentHtml: contentHtml, footerHtml: footerHtml };
  }

  /**
   * Remove editor chrome, keeping only the content. Same inert-parsing
   * contract as extractEditorChrome(): reached from setData() with
   * attacker-controlled HTML before sanitization (FE-001).
   */
  function stripEditorChrome(html) {
    let tpl = inertTemplate(html);
    let box = tpl.content;
    Array.prototype.forEach.call(box.querySelectorAll(".editor-footer"), function (node) {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
    let body = box.querySelector(".editor-body");
    if (body && box.children.length === 1 && box.firstElementChild === body) {
      return body.innerHTML;
    }
    Array.prototype.forEach.call(box.querySelectorAll(".editor-body"), function (node) {
      while (node.firstChild) node.parentNode.insertBefore(node.firstChild, node);
      if (node.parentNode) node.parentNode.removeChild(node);
    });
    return tpl.innerHTML;
  }

  function closestBlock(node, root) {
    while (node && node !== root) {
      if (node.nodeType === 1) {
        let tag = node.tagName;
        if (/^(P|DIV|H[1-6]|BLOCKQUOTE|LI|PRE|SECTION|ARTICLE|MAIN|TH|TD)$/i.test(tag)) {
          return node;
        }
      }
      node = node.parentNode;
    }
    return null;
  }

  function breakOutOfHeading(editor) {
    let sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    let block = closestBlock(sel.anchorNode, editor);
    if (!block || !/^H[1-6]$/i.test(block.tagName)) return false;

    let range = sel.getRangeAt(0);
    if (!range.collapsed) {
      range.deleteContents();
    }

    let after = range.cloneRange();
    after.selectNodeContents(block);
    after.setStart(range.endContainer, range.endOffset);
    let remnant = after.extractContents();

    let p = document.createElement("p");
    if (remnant && remnant.childNodes && remnant.childNodes.length) {
      p.appendChild(remnant);
    }
    if (!p.textContent && !p.querySelector("img,br,iframe,video")) {
      p.appendChild(document.createElement("br"));
    }

    if (block.parentNode) {
      if (block.nextSibling) {
        block.parentNode.insertBefore(p, block.nextSibling);
      } else {
        block.parentNode.appendChild(p);
      }
    }

    let next = document.createRange();
    next.setStart(p, 0);
    next.collapse(true);
    sel.removeAllRanges();
    sel.addRange(next);
    return true;
  }

  function toolBtn(icon, title, onClick) {
    let btn = el("button", {
      type: "button",
      className: "fe-btn",
      title: title,
      "aria-label": title,
      onMousedown: function (e) {
        e.preventDefault();
      },
      onClick: function (e) {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      },
    });
    btn.innerHTML = icon;
    return btn;
  }

  function sep() {
    return el("span", { className: "fe-sep", "aria-hidden": "true" });
  }

  /**
   * Create a FreeEditor instance.
   *
   * @param {Element|string} mountEl  Element or selector to render into
   * @param {object} [options]
   * @param {string} [options.name]  Hidden input name (for forms)
   * @param {string} [options.value] Initial HTML
   * @param {string} [options.placeholder]
   * @param {boolean} [options.required]
   * @param {string} [options.id]
   * @param {HTMLTextAreaElement|HTMLInputElement|string} [options.textarea] Sync with existing field
   * @param {string} [options.uploadUrl]  Absolute https URL or root-relative path that accepts the POST and returns { url }. No default: uploads stay disabled until this (or uploadImage) is set.
   * @param {string} [options.csrf]  CSRF token for uploadUrl (required by default)
   * @param {boolean} [options.requireCsrf=true] Require CSRF for cookie-authenticated uploads
   * @param {function(File): (string|Promise<string>)} [options.uploadImage] Custom uploader (overrides uploadUrl)
   * @param {boolean} [options.allowLocalImageFallback=false] Use blob URL when server upload fails (dev only)
   * @param {boolean} [options.allowSvg=false] Allow SVG images (not recommended)
   * @param {boolean} [options.allowDataUrls=false] Allow data: image URLs
   * @param {boolean} [options.allowHtmlIframe=false] Allow non-allowlisted iframes (dangerous)
   * @param {string[]} [options.mediaHosts] Extra/override hosts for media iframes
   * @param {string[]|object} [options.enabledVideoProviders] Named providers (youtube, vimeo, instagram, tiktok). All enabled by default. Not a generic domain list.
   * @param {function(string): (string|Promise<string>)} [options.resolveTikTokShortUrl] Resolve vt.tiktok.com short links to a watch URL that passes TikTok id validation
   * @param {number} [options.maxImageBytes] Max upload size (default 5MB)
   * @param {function(string):void} [options.onChange]
   * @returns {{ root: Element, getHTML: function():string, setHTML: function(string):void, destroy: function():void }}
   */
  function create(mountEl, options) {
    options = options || {};
    const mount = qs(mountEl);
    if (!mount) {
      throw new Error("FreeEditor.create: mount element not found");
    }

    const securityOptions = mergeSecurityOptions(options);
    bindProviderEmbedResize();
    // Keep options object in sync so uploadImageFile sees secure defaults.
    options.allowLocalImageFallback = securityOptions.allowLocalImageFallback;
    options.requireCsrf = securityOptions.requireCsrf;
    options.allowSvg = securityOptions.allowSvg;
    options.allowDataUrls = securityOptions.allowDataUrls;
    options.allowHtmlIframe = securityOptions.allowHtmlIframe;
    options.maxImageBytes = securityOptions.maxImageBytes;
    options.mediaHosts = securityOptions.mediaHosts;
    options.enabledVideoProviders = securityOptions.enabledVideoProviders;
    options.resolveTikTokShortUrl = securityOptions.resolveTikTokShortUrl;

    const textarea = options.textarea ? qs(options.textarea) : null;
    const name = options.name || (textarea && textarea.name) || "content";
    const id = options.id || (textarea && textarea.id) || name;
    const value =
      options.value != null
        ? options.value
        : textarea
          ? textarea.value
          : "";
    const placeholder = options.placeholder || "Content";
    const required = options.required != null ? !!options.required : !!(textarea && textarea.required);
    const onChange = typeof options.onChange === "function" ? options.onChange : null;

    let hidden = null;
    if (textarea) {
      textarea.style.display = "none";
      textarea.setAttribute("aria-hidden", "true");
    } else {
      hidden = el("input", { type: "hidden", name: name, id: id });
      hidden.value = value;
    }

    const editor = el("div", {
      className: "fe-editor",
      contenteditable: "true",
      role: "textbox",
      "aria-multiline": "true",
      "aria-label": placeholder,
      "data-placeholder": placeholder,
    });
    let initialHtml = stripEditorChrome(value || "");
    if (
      !initialHtml.trim() ||
      initialHtml === "<br>" ||
      initialHtml === "<div><br></div>" ||
      initialHtml === "<p><br></p>"
    ) {
      editor.innerHTML =
        '<div style="font-size:' + DEFAULT_FONT_SIZE + 'px"><br></div>';
    } else {
      editor.innerHTML = prepareMediaForEditing(initialHtml, securityOptions);
    }

    /** Reset the size dropdown when the caret lands in a plain block. */
    function applyParagraphDefaultSize() {
      let sel = window.getSelection();
      if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) return;
      let block = closestBlock(sel.anchorNode, editor);
      if (!block) return;
      let tag = block.tagName.toLowerCase();
      if (tag !== "p" && tag !== "div") return;
      sizeSelect.value = DEFAULT_FONT_SIZE;
    }

    let savedRange = null;
    let destroyed = false;
    let root;
    let isFullscreen = false;

    const HISTORY_LIMIT = 100;
    const HISTORY_TYPE_MS = 350;
    let historyStack = [];
    let historyIndex = -1;
    let historyLocked = false;
    let historyTyping = false;
    let historyTypeTimer = null;
    let historyComposing = false;

    function getHTML() {
      return normalizeHtml(
        sanitizeHtml(
          serializeMediaForOutput(stripEditorChrome(editor.innerHTML), securityOptions),
          securityOptions
        )
      );
    }

    function countWords() {
      let text = (editor.innerText || editor.textContent || "")
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (!text) return 0;
      return text.split(" ").length;
    }

    let wordCountEl = null;

    function updateWordCount() {
      if (!wordCountEl) return;
      let n = countWords();
      wordCountEl.textContent = n === 1 ? "1 word" : n + " words";
    }

    function sync() {
      let html = getHTML();
      if (textarea) textarea.value = html;
      if (hidden) hidden.value = html;
      if (onChange) onChange(html);
      updateWordCount();
    }

    function setHTML(html) {
      historyLocked = true;
      editor.innerHTML = prepareMediaForEditing(
        stripEditorChrome(html || ""),
        securityOptions
      );
      historyLocked = false;
      sync();
      resetHistory();
    }

    function remember() {
      savedRange = saveSelection(editor);
    }

    function stripHistoryChrome(html) {
      return String(html || "")
        .replace(/\s*fe-img--selected\b/g, "")
        .replace(/\s*fe-media--selected\b/g, "");
    }

    function historyHtml() {
      return stripHistoryChrome(editor.innerHTML);
    }

    function nodeChildIndex(node) {
      if (!node || !node.parentNode) return 0;
      let i = 0;
      let sib = node.parentNode.firstChild;
      while (sib && sib !== node) {
        i++;
        sib = sib.nextSibling;
      }
      return i;
    }

    function pathFromEditor(node) {
      let path = [];
      while (node && node !== editor) {
        path.push(nodeChildIndex(node));
        node = node.parentNode;
      }
      if (node !== editor) return null;
      path.reverse();
      return path;
    }

    function nodeFromPath(path) {
      let node = editor;
      if (!path) return null;
      for (let i = 0; i < path.length; i++) {
        if (!node || !node.childNodes || path[i] >= node.childNodes.length) return null;
        node = node.childNodes[path[i]];
      }
      return node;
    }

    function captureHistorySel() {
      let sel = window.getSelection();
      if (!sel || !sel.rangeCount) return null;
      let range = sel.getRangeAt(0);
      if (!editor.contains(range.commonAncestorContainer)) return null;
      return {
        startPath: pathFromEditor(range.startContainer),
        startOffset: range.startOffset,
        endPath: pathFromEditor(range.endContainer),
        endOffset: range.endOffset,
      };
    }

    function restoreHistorySel(bookmark) {
      if (!bookmark || !bookmark.startPath || !bookmark.endPath) return;
      let startNode = nodeFromPath(bookmark.startPath);
      let endNode = nodeFromPath(bookmark.endPath);
      if (!startNode || !endNode) return;
      try {
        let range = document.createRange();
        let startOff = Math.min(
          bookmark.startOffset,
          startNode.nodeType === 3
            ? (startNode.nodeValue || "").length
            : startNode.childNodes.length
        );
        let endOff = Math.min(
          bookmark.endOffset,
          endNode.nodeType === 3
            ? (endNode.nodeValue || "").length
            : endNode.childNodes.length
        );
        range.setStart(startNode, startOff);
        range.setEnd(endNode, endOff);
        restoreSelection(range);
        savedRange = range.cloneRange();
      } catch (e) {
        /* ignore */
      }
    }

    function closeTypingHistory() {
      if (historyTypeTimer) {
        clearTimeout(historyTypeTimer);
        historyTypeTimer = null;
      }
      historyTyping = false;
    }

    function resetHistory() {
      closeTypingHistory();
      historyStack = [{ html: historyHtml(), sel: captureHistorySel() }];
      historyIndex = 0;
      syncHistoryButtons();
    }

    function commitHistory() {
      if (historyLocked || destroyed) return;
      closeTypingHistory();
      let html = historyHtml();
      if (historyIndex >= 0 && historyStack[historyIndex] && historyStack[historyIndex].html === html) {
        syncHistoryButtons();
        return;
      }
      historyStack = historyStack.slice(0, historyIndex + 1);
      historyStack.push({ html: html, sel: captureHistorySel() });
      if (historyStack.length > HISTORY_LIMIT) historyStack.shift();
      historyIndex = historyStack.length - 1;
      syncHistoryButtons();
    }

    function recordTypingHistory() {
      if (historyLocked || destroyed || historyComposing) return;
      if (providerEmbedResizeSilent) return;
      let html = historyHtml();
      let sel = captureHistorySel();
      if (!historyTyping) {
        if (historyIndex >= 0 && historyStack[historyIndex] && historyStack[historyIndex].html === html) {
          return;
        }
        historyStack = historyStack.slice(0, historyIndex + 1);
        historyStack.push({ html: html, sel: sel });
        if (historyStack.length > HISTORY_LIMIT) historyStack.shift();
        historyIndex = historyStack.length - 1;
        historyTyping = true;
      } else if (historyStack[historyIndex]) {
        historyStack[historyIndex] = { html: html, sel: sel };
      }
      if (historyTypeTimer) clearTimeout(historyTypeTimer);
      historyTypeTimer = setTimeout(function () {
        historyTypeTimer = null;
        historyTyping = false;
        syncHistoryButtons();
      }, HISTORY_TYPE_MS);
      syncHistoryButtons();
    }

    function restoreHistory(entry) {
      if (!entry) return;
      historyLocked = true;
      try {
        deselectImage();
        deselectMedia();
        editor.innerHTML = entry.html;
        restoreHistorySel(entry.sel);
        sync();
      } finally {
        historyLocked = false;
      }
      syncFormatSelect();
      syncSizeSelect();
      syncToolbarState();
    }

    function undoHistory() {
      if (destroyed) return;
      closeTypingHistory();
      if (historyIndex <= 0) {
        syncHistoryButtons();
        return;
      }
      historyIndex -= 1;
      restoreHistory(historyStack[historyIndex]);
    }

    function redoHistory() {
      if (destroyed) return;
      closeTypingHistory();
      if (historyIndex >= historyStack.length - 1) {
        syncHistoryButtons();
        return;
      }
      historyIndex += 1;
      restoreHistory(historyStack[historyIndex]);
    }

    function isHistoryUndoKey(e) {
      if (!e || !(e.ctrlKey || e.metaKey) || e.altKey) return false;
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/i.test(e.target.tagName)) return false;
      let key = e.key || "";
      return key === "z" || key === "Z" ? !e.shiftKey : false;
    }

    function isHistoryRedoKey(e) {
      if (!e || !(e.ctrlKey || e.metaKey) || e.altKey) return false;
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/i.test(e.target.tagName)) return false;
      let key = e.key || "";
      if (key === "y" || key === "Y") return true;
      return (key === "z" || key === "Z") && e.shiftKey;
    }

    function onHistoryKeydown(e) {
      if (destroyed) return;
      if (!root || (!root.contains(e.target) && document.activeElement !== editor)) return;
      if (isHistoryUndoKey(e)) {
        e.preventDefault();
        e.stopPropagation();
        undoHistory();
        return;
      }
      if (isHistoryRedoKey(e)) {
        e.preventDefault();
        e.stopPropagation();
        redoHistory();
      }
    }

    function expandCollapsedToWord() {
      let sel = window.getSelection();
      if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) return false;
      if (!sel.isCollapsed) return true;

      let node = sel.anchorNode;
      let offset = sel.anchorOffset;

      if (node.nodeType === 1) {
        let child = node.childNodes[offset] || node.childNodes[offset - 1] || null;
        if (child && child.nodeType === 3) {
          let atStart = child === node.childNodes[offset];
          offset = atStart ? 0 : (child.textContent || "").length;
          node = child;
        } else if (child && child.nodeType === 1) {
          let text = child;
          while (text && text.nodeType === 1 && text.firstChild) text = text.firstChild;
          if (text && text.nodeType === 3) {
            node = text;
            offset = 0;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }

      if (node.nodeType !== 3) return false;
      let text = node.textContent || "";
      if (!text) return false;

      function isWordChar(ch) {
        return !!ch && /[A-Za-z0-9\u00C0-\u024F\u0400-\u04FF_'’-]/.test(ch);
      }

      let pos = offset;
      if (pos > 0 && !isWordChar(text.charAt(pos)) && isWordChar(text.charAt(pos - 1))) {
        pos = pos - 1;
      }
      if (!isWordChar(text.charAt(pos)) && pos > 0 && isWordChar(text.charAt(pos - 1))) {
        pos = pos - 1;
      }
      if (!isWordChar(text.charAt(pos))) return false;

      let start = pos;
      let end = pos + 1;
      while (start > 0 && isWordChar(text.charAt(start - 1))) start--;
      while (end < text.length && isWordChar(text.charAt(end))) end++;
      if (start >= end) return false;

      let range = document.createRange();
      range.setStart(node, start);
      range.setEnd(node, end);
      sel.removeAllRanges();
      sel.addRange(range);
      savedRange = range.cloneRange();
      return true;
    }

    function run(fn) {
      closeTypingHistory();
      historyLocked = true;
      try {
        focusEditor(editor, savedRange);
        fn();
      } finally {
        historyLocked = false;
      }
      sync();
      remember();
      commitHistory();
      syncFormatSelect();
      syncSizeSelect();
      syncToolbarState();
    }

    editor.addEventListener("keyup", function () {
      remember();
      sync();
      syncFormatSelect();
      syncSizeSelect();
      syncToolbarState();
    });
    editor.addEventListener("mouseup", function () {
      remember();
      syncFormatSelect();
      syncSizeSelect();
      syncToolbarState();
    });
    editor.addEventListener("click", function (e) {
      let bookmark =
        e.target && e.target.closest ? e.target.closest("span.fe-anchor") : null;
      if (bookmark && editor.contains(bookmark)) {
        e.preventDefault();
        let sel = window.getSelection();
        if (sel) {
          let markerRange = document.createRange();
          markerRange.selectNode(bookmark);
          sel.removeAllRanges();
          sel.addRange(markerRange);
        }
      }
      let a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (a && editor.contains(a) && !(bookmark && bookmark.contains(a))) {
        e.preventDefault();
        if (!a.contains(window.getSelection() && window.getSelection().anchorNode)) {
          placeCaretIn(a);
        }
      }
      remember();
      syncFormatSelect();
      syncSizeSelect();
      syncToolbarState();
    });
    function onSelectionChange() {
      if (destroyed) return;
      let sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      if (editor.contains(sel.anchorNode) || document.activeElement === editor) {
        syncToolbarState();
      }
    }
    document.addEventListener("selectionchange", onSelectionChange);
    editor.addEventListener("focus", function () {
      if (
        !editor.textContent.trim() &&
        !editor.querySelector("img,table,iframe,video,.fe-media")
      ) {
        historyLocked = true;
        editor.innerHTML =
          '<div style="font-size:' + DEFAULT_FONT_SIZE + 'px"><br></div>';
        historyLocked = false;
        let firstDiv = editor.querySelector("div");
        if (firstDiv) placeCaretIn(firstDiv);
      }
      syncToolbarState();
    });
    editor.addEventListener("compositionstart", function () {
      historyComposing = true;
    });
    editor.addEventListener("compositionend", function () {
      historyComposing = false;
      recordTypingHistory();
    });
    editor.addEventListener("beforeinput", function (e) {
      if (!e || !e.inputType) return;
      if (e.inputType === "historyUndo") {
        e.preventDefault();
        undoHistory();
        return;
      }
      if (e.inputType === "historyRedo") {
        e.preventDefault();
        redoHistory();
      }
    });
    editor.addEventListener("input", function () {
      if (selectedImg && !editor.contains(selectedImg)) deselectImage();
      if (selectedMedia && !editor.contains(selectedMedia)) deselectMedia();
      let sel = window.getSelection();
      let keep =
        sel && sel.rangeCount && editor.contains(sel.anchorNode)
          ? closestBlock(sel.anchorNode, editor)
          : null;
      if (editor.querySelector("p:empty,div:empty")) {
        pruneEmptyParagraphs(editor, keep);
      }
      if (editor.querySelector("ul > ul, ul > ol, ol > ul, ol > ol")) {
        normalizeListNesting(editor);
      }
      sync();
      recordTypingHistory();
    });
    editor.addEventListener("blur", sync);
    /** Shared by paste and drop: upload a file, then insert the returned URL. */
    function insertUploadedFile(file) {
      uploadImageFile(file, options)
        .then(function (src) {
          insertHtmlAtCaret(
            editor,
            '<img src="' +
              escapeAttr(src) +
              '" alt="" class="fe-img" width="1080" height="1080" style="width:1080px;height:auto;max-width:100%;">',
            securityOptions
          );
          sync();
          remember();
          commitHistory();
        })
        .catch(function (err) {
          window.alert((err && err.message) || "Image upload failed");
        });
    }

    /** First image file in a clipboard/drag payload, if any. */
    function firstImageFile(source) {
      if (!source) return null;
      let files = source.files;
      if (files && files.length) {
        for (let i = 0; i < files.length; i++) {
          if (files[i] && /^image\//i.test(files[i].type || "")) return files[i];
        }
      }
      let items = source.items;
      if (items && items.length) {
        for (let i = 0; i < items.length; i++) {
          if (items[i] && items[i].kind === "file") {
            let f = items[i].getAsFile();
            if (f) return f;
          }
        }
      }
      return files && files.length ? files[0] : null;
    }

    editor.addEventListener("paste", function (e) {
      if (destroyed) return;
      let clip = e.clipboardData || window.clipboardData;
      if (!clip) return;
      let html = clip.getData("text/html");
      let text = clip.getData("text/plain");
      e.preventDefault();
      remember();
      historyLocked = true;
      // Route pasted screenshots through the same validated upload path as
      // drag-and-drop, so they cannot become an unchecked side door (FE-019).
      let pastedFile = !html || !html.trim() ? firstImageFile(clip) : null;
      if (pastedFile) {
        historyLocked = false;
        insertUploadedFile(pastedFile);
        return;
      }
      if (html && html.trim()) {
        insertHtmlAtCaret(editor, html, securityOptions);
      } else if (text) {
        exec("insertText", text);
      }
      historyLocked = false;
      sync();
      remember();
      commitHistory();
      syncToolbarState();
    });
    editor.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    editor.addEventListener("drop", function (e) {
      if (destroyed) return;
      e.preventDefault();
      let dt = e.dataTransfer;
      if (!dt) return;
      remember();
      historyLocked = true;
      let files = dt.files;
      if (files && files.length) {
        historyLocked = false;
        insertUploadedFile(firstImageFile(dt) || files[0]);
        return;
      }
      let html = dt.getData("text/html");
      let text = dt.getData("text/plain");
      if (html && html.trim()) {
        insertHtmlAtCaret(editor, html, securityOptions);
      } else if (text) {
        exec("insertText", text);
      }
      historyLocked = false;
      sync();
      remember();
      commitHistory();
    });
    editor.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        let sel = window.getSelection();
        if (sel && sel.rangeCount && editor.contains(sel.anchorNode)) {
          let li = sel.anchorNode;
          while (li && li !== editor) {
            if (li.nodeType === 1 && li.tagName === "LI") break;
            li = li.parentNode;
          }
          if (li && li.tagName === "LI") {
            e.preventDefault();
            if (e.shiftKey) outdentListItem(li);
            else indentListItem(li);
            normalizeListNesting(editor);
            pruneEmptyParagraphs(editor, li);
            sync();
            remember();
            commitHistory();
            syncToolbarState();
            return;
          }
        }
      }
      if (e.key === "Backspace" || e.key === "Delete") {
        if (selectedMedia && editor.contains(selectedMedia)) {
          e.preventDefault();
          removeMediaWidget(selectedMedia);
          return;
        }
        if (selectedImg && editor.contains(selectedImg)) {
          e.preventDefault();
          let img = selectedImg;
          deselectImage();
          if (img.parentNode) img.parentNode.removeChild(img);
          sync();
          remember();
          commitHistory();
          return;
        }
        let sel = window.getSelection();
        if (sel && sel.rangeCount && editor.contains(sel.anchorNode)) {
          let range = sel.getRangeAt(0);
          if (!range.collapsed) {
            let hit = mediaWidgetsInRange(range);
            if (hit.length) {
              e.preventDefault();
              hit.forEach(function (fig) {
                removeMediaWidget(fig);
              });
              return;
            }
          } else {
            let adj = adjacentMediaFromCaret(sel, e.key === "Backspace");
            if (adj) {
              e.preventDefault();
              removeMediaWidget(adj);
              return;
            }
          }
        }
      }
      if (e.key !== "Enter" || e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }
      let block = closestBlock(
        window.getSelection() && window.getSelection().anchorNode,
        editor
      );
      if (block && /^(TH|TD)$/i.test(block.tagName)) {
        return;
      }
      if (breakOutOfHeading(editor)) {
        e.preventDefault();
        sync();
        remember();
        commitHistory();
        syncFormatSelect();
        syncSizeSelect();
        syncToolbarState();
        return;
      }
      if (block && block.tagName === "P") {
        setTimeout(function () {
          applyParagraphDefaultSize();
          sync();
        }, 0);
      }
    });

    editor.addEventListener("mousedown", function (e) {
      let media = e.target && e.target.closest ? e.target.closest(".fe-media") : null;
      if (media && editor.contains(media)) {
        e.preventDefault();
        editor.focus();
        selectMedia(media);
        remember();
        return;
      }
      deselectMedia();

      let img = e.target && e.target.closest ? e.target.closest("img") : null;
      if (isEditorImage(img)) {
        e.preventDefault();
        selectImage(img);
        return;
      }
      deselectImage();

      let cell = e.target && e.target.closest ? e.target.closest("th,td") : null;
      if (!cell || !editor.contains(cell)) return;
      setTimeout(function () {
        if (!editor.contains(cell)) return;
        let sel = window.getSelection();
        if (sel && sel.rangeCount && cell.contains(sel.anchorNode)) return;
        placeCaretIn(cell);
        remember();
      }, 0);
    });

    editor.addEventListener("dblclick", function (e) {
      let img = e.target && e.target.closest ? e.target.closest("img") : null;
      if (!isEditorImage(img)) return;
      e.preventDefault();
      deselectImage();
      remember();
      showImageDialog(img);
    });

    document.addEventListener("mousedown", onDocImageDeselect);

    let formatSelect = el("select", {
      className: "fe-select",
      title: "Paragraph format",
      "aria-label": "Paragraph format",
      onChange: function () {
        let tag = formatSelect.value || "p";
        run(function () {
          exec("formatBlock", tag);
          if (tag === "p") {
            applyParagraphDefaultSize();
          } else {
            let sel = window.getSelection();
            let block =
              sel && sel.rangeCount
                ? closestBlock(sel.anchorNode, editor)
                : null;
            if (block) block.style.fontSize = "";
          }
        });
      },
      onMousedown: function () {
        remember();
      },
    });
    [
      ["p", "Paragraph"],
      ["h1", "Heading 1"],
      ["h2", "Heading 2"],
      ["h3", "Heading 3"],
    ].forEach(function (pair) {
      formatSelect.appendChild(el("option", { value: pair[0], text: pair[1] }));
    });
    formatSelect.value = "p";

    let sizeSelect = el("select", {
      className: "fe-select",
      title: "Font size",
      "aria-label": "Font size",
      onChange: function () {
        let px = sizeSelect.value || DEFAULT_FONT_SIZE;
        run(function () {
          applyFontSize(px);
        });
      },
      onPointerdown: function () {
        remember();
      },
      onMousedown: function () {
        remember();
      },
    });
    FONT_SIZES.forEach(function (size) {
      sizeSelect.appendChild(
        el("option", { value: size, text: size + "px" })
      );
    });
    sizeSelect.value = DEFAULT_FONT_SIZE;

    function applyFontSize(px) {
      let size = String(px).replace(/[^0-9]/g, "");
      if (!size) return;
      let sel = window.getSelection();
      if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) {
        if (savedRange) {
          restoreSelection(savedRange);
          sel = window.getSelection();
        }
      }
      if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) return;

      if (sel.isCollapsed) {
        expandCollapsedToWord();
        sel = window.getSelection();
        if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) return;
        if (sel.isCollapsed) {
          let block = closestBlock(sel.anchorNode, editor);
          if (!block) return;
          let blockRange = document.createRange();
          blockRange.selectNodeContents(block);
          sel.removeAllRanges();
          sel.addRange(blockRange);
        }
      }

      let range = sel.getRangeAt(0);
      if (range.collapsed) return;
      let holder = document.createElement("div");
      holder.appendChild(range.cloneContents());
      let inner = sanitizeHtml(holder.innerHTML, securityOptions);
      try {
        document.execCommand("insertHTML", false,
          '<span style="font-size:' + size + 'px">' + inner + "</span>"
        );
      } catch (e) {
        wrapRangeWithFontSize(range, size);
      }
    }

    function applyTextColor(color) {
      if (color == null) {
        removeTextColor();
        return;
      }
      if (!color) return;
      if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(color).trim())) return;
      let sel = window.getSelection();
      if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) return;

      expandCollapsedToWord();
      sel = window.getSelection();
      if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) return;

      try {
        document.execCommand("styleWithCSS", false, true);
      } catch (e) {
        /* ignore */
      }
      exec("foreColor", String(color).trim());
    }

    function removeTextColor() {
      let sel = window.getSelection();
      if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) return;

      function stripColorFromNode(node) {
        if (!node || node.nodeType !== 1) return;
        if (node.style && node.style.color) {
          node.style.removeProperty("color");
        }
        if (node.tagName === "FONT") node.removeAttribute("color");
        if (node.hasAttribute("style") && !(node.getAttribute("style") || "").trim()) {
          node.removeAttribute("style");
        }
        if (
          /^(SPAN|FONT)$/i.test(node.tagName) &&
          !node.className &&
          !node.id &&
          !node.hasAttribute("style") &&
          !node.getAttribute("color") &&
          !node.getAttribute("face") &&
          !node.getAttribute("size")
        ) {
          unwrapElement(node);
        }
      }

      expandCollapsedToWord();
      sel = window.getSelection();
      if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) return;

      if (!sel.isCollapsed) {
        let range = sel.getRangeAt(0);
        let nodes = Array.prototype.slice.call(
          editor.querySelectorAll("[style],font[color],span,font")
        );
        nodes.sort(function (a, b) {
          if (a === b) return 0;
          if (a.contains(b)) return 1;
          if (b.contains(a)) return -1;
          return 0;
        });
        nodes.forEach(function (node) {
          if (!editor.contains(node)) return;
          try {
            if (!range.intersectsNode(node)) return;
          } catch (e) {
            return;
          }
          stripColorFromNode(node);
        });
        return;
      }

      let node = sel.anchorNode;
      if (node && node.nodeType === 3) node = node.parentNode;
      while (node && node !== editor) {
        if (node.nodeType === 1) {
          let hadColor =
            (node.style && node.style.color) ||
            (node.tagName === "FONT" && node.getAttribute("color"));
          if (hadColor) {
            stripColorFromNode(node);
            break;
          }
        }
        node = node.parentNode;
      }
    }

    function isProtectedFormatNode(node) {
      if (!node || node.nodeType !== 1) return true;
      let tag = node.tagName;
      if (
        /^(IMG|TABLE|THEAD|TBODY|TFOOT|TR|TD|TH|COL|COLGROUP|IFRAME|VIDEO|FIGURE|BR|HR)$/i.test(
          tag
        )
      ) {
        return true;
      }
      if (node.classList && node.classList.contains("fe-media")) return true;
      if (node.closest && node.closest("figure.fe-media")) return true;
      return false;
    }

    function unwrapElement(el) {
      let parent = el.parentNode;
      if (!parent) return;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
    }

    function clearFormatting() {
      let sel = window.getSelection();
      if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) return;

      if (sel.isCollapsed) {
        if (!expandCollapsedToWord()) {
          let block = closestBlock(sel.anchorNode, editor);
          if (!block) return;
          let blockRange = document.createRange();
          blockRange.selectNodeContents(block);
          sel.removeAllRanges();
          sel.addRange(blockRange);
        }
      }

      exec("removeFormat");
      exec("unlink");

      sel = window.getSelection();
      if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) return;
      let range = sel.getRangeAt(0);

      function rangeTouches(node) {
        try {
          return range.intersectsNode(node);
        } catch (e) {
          return false;
        }
      }

      Array.prototype.slice
        .call(editor.querySelectorAll("span.fe-anchor"))
        .forEach(function (span) {
          if (!editor.contains(span)) return;
          if (!rangeTouches(span)) return;
          unwrapElement(span);
        });

      let candidates = Array.prototype.slice.call(
        editor.querySelectorAll(
          "b,strong,i,em,u,s,strike,del,sub,sup,font,span,[style]"
        )
      );
      
      candidates.sort(function (a, b) {
        if (a === b) return 0;
        if (a.contains(b)) return 1;
        if (b.contains(a)) return -1;
        return 0;
      });

      candidates.forEach(function (node) {
        if (!editor.contains(node)) return;
        if (isProtectedFormatNode(node)) return;
        if (!rangeTouches(node)) return;

        if (node.hasAttribute("style")) node.removeAttribute("style");
        if (node.tagName === "FONT") {
          node.removeAttribute("color");
          node.removeAttribute("face");
          node.removeAttribute("size");
        }

        if (
          /^(B|STRONG|I|EM|U|S|STRIKE|DEL|SUB|SUP|FONT|SPAN)$/i.test(node.tagName) &&
          !node.className &&
          !node.id
        ) {
          unwrapElement(node);
        }
      });

      let blocks = Array.prototype.slice.call(
        editor.querySelectorAll("h1,h2,h3,h4,h5,h6,blockquote")
      );
      blocks.forEach(function (block) {
        if (!editor.contains(block)) return;
        if (!rangeTouches(block)) return;
        let p = document.createElement("p");
        while (block.firstChild) p.appendChild(block.firstChild);
        if (block.parentNode) block.parentNode.replaceChild(p, block);
      });

      sizeSelect.value = DEFAULT_FONT_SIZE;
      formatSelect.value = "p";

      sel = window.getSelection();
      if (sel && sel.rangeCount && editor.contains(sel.anchorNode)) {
        let end = sel.getRangeAt(0).cloneRange();
        end.collapse(false);
        sel.removeAllRanges();
        sel.addRange(end);
      }
    }

    /**
     * Parse a computed CSS color ("#abc", "#aabbcc", "rgb(1, 2, 3)") into a
     * 6-digit hex string. Distinct from the module-level rgbToHex(r, g, b),
     * which builds one from numeric channels.
     */
    function cssColorToHex(rgb) {
      if (!rgb) return null;
      if (rgb.charAt(0) === "#") {
        let h = rgb.toLowerCase();
        if (h.length === 4) {
          return "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
        }
        return h.length === 7 ? h : null;
      }
      let m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (!m) return null;
      function toHex(n) {
        let s = Number(n).toString(16);
        return s.length === 1 ? "0" + s : s;
      }
      return "#" + toHex(m[1]) + toHex(m[2]) + toHex(m[3]);
    }

    function getSelectionTextColor() {
      let sel = window.getSelection();
      if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) {
        return null;
      }
      let node = sel.anchorNode;
      if (node && node.nodeType === 3) node = node.parentNode;
      let walk = node;
      while (walk && walk !== editor) {
        if (walk.nodeType === 1) {
          if (walk.style && walk.style.color) {
            let hex = cssColorToHex(walk.style.color);
            if (hex) return hex;
          }
          if (walk.tagName === "FONT" && walk.getAttribute("color")) {
            let hex = cssColorToHex(walk.getAttribute("color"));
            if (hex) return hex;
          }
        }
        walk = walk.parentNode;
      }
      return null;
    }

    function syncSizeSelect() {
      let sel = window.getSelection();
      if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) {
        sizeSelect.value = DEFAULT_FONT_SIZE;
        return;
      }
      let node = sel.anchorNode;
      if (node && node.nodeType === 3) node = node.parentNode;
      let px = null;
      while (node && node !== editor) {
        if (node.nodeType === 1 && node.style && node.style.fontSize) {
          px = Math.round(parseFloat(node.style.fontSize));
          if (!isNaN(px)) break;
          px = null;
        }
        node = node.parentNode;
      }
      if (px == null) {
        let block = closestBlock(sel.anchorNode, editor);
        if (block && block.style && block.style.fontSize) {
          px = Math.round(parseFloat(block.style.fontSize));
          if (isNaN(px)) px = null;
        }
      }
      let val = px != null ? String(px) : DEFAULT_FONT_SIZE;
      sizeSelect.value = FONT_SIZES.indexOf(val) !== -1 ? val : DEFAULT_FONT_SIZE;
    }

    function syncFormatSelect() {
      let sel = window.getSelection();
      if (!sel || !sel.rangeCount) {
        formatSelect.value = "p";
        return;
      }
      let block = closestBlock(sel.anchorNode, editor);
      if (!block) {
        formatSelect.value = "p";
        return;
      }
      let tag = block.tagName.toLowerCase();
      if (tag === "h1" || tag === "h2" || tag === "h3") {
        formatSelect.value = tag;
      } else {
        formatSelect.value = "p";
      }
    }

    let activeImageDialog = null;
    let fileInput = el("input", {
      type: "file",
      accept: "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif",
      className: "fe-file",
      onChange: function () {
        let file = fileInput.files && fileInput.files[0];
        fileInput.value = "";
        if (!file) return;
        if (activeImageDialog && typeof activeImageDialog.onFile === "function") {
          activeImageDialog.onFile(file);
        }
      },
    });

    function escapeAttr(value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function parseDim(value) {
      let n = parseInt(String(value || "").replace(/[^0-9]/g, ""), 10);
      return isNaN(n) || n <= 0 ? null : n;
    }

    function selectedImage() {
      let sel = window.getSelection();
      if (!sel || !sel.rangeCount) return null;
      let node = sel.anchorNode;
      if (node && node.nodeType === 3) node = node.parentNode;
      while (node && node !== editor) {
        if (node.nodeType === 1 && node.tagName === "IMG") return node;
        node = node.parentNode;
      }
      try {
        let range = sel.getRangeAt(0);
        let container = range.commonAncestorContainer;
        if (container.nodeType === 1) {
          let imgs = container.querySelectorAll
            ? container.querySelectorAll("img")
            : [];
          if (imgs.length === 1 && range.intersectsNode(imgs[0])) return imgs[0];
        }
      } catch (e) {
        /* ignore */
      }
      return null;
    }

    function applyImageAttrs(img, src, alt, width, height) {
      let safeSrc = sanitizeUrl(src, {
        purpose: "image",
        allowDataUrls: securityOptions.allowDataUrls,
        allowBlobUrls: securityOptions.allowLocalImageFallback,
      });
      if (!safeSrc) return false;
      img.setAttribute("src", safeSrc);
      img.setAttribute("alt", alt || "");
      img.classList.add("fe-img");
      if (width) {
        img.setAttribute("width", String(width));
        img.style.width = width + "px";
      } else {
        img.removeAttribute("width");
        img.style.removeProperty("width");
      }
      if (height) {
        img.setAttribute("height", String(height));
        img.style.height = "auto";
      } else {
        img.removeAttribute("height");
        img.style.removeProperty("height");
      }
      img.style.maxWidth = "100%";
      if (!img.getAttribute("style")) img.removeAttribute("style");
      return true;
    }

    let selectedImg = null;
    let selectedMedia = null;
    let resizeUI = null;
    let resizeScrollParents = [];

    function isMediaFigure(node) {
      return !!(
        node &&
        node.nodeType === 1 &&
        node.classList &&
        node.classList.contains("fe-media") &&
        editor.contains(node)
      );
    }

    function skipIgnorableSibling(node, dir) {
      while (node) {
        if (node.nodeType === 3 && !String(node.textContent || "").replace(/\u00a0/g, " ").trim()) {
          node = dir < 0 ? node.previousSibling : node.nextSibling;
          continue;
        }
        if (node.nodeType === 1 && /^(BR)$/i.test(node.tagName)) {
          node = dir < 0 ? node.previousSibling : node.nextSibling;
          continue;
        }
        break;
      }
      return node;
    }

    function mediaWidgetsInRange(range) {
      return Array.prototype.filter.call(editor.querySelectorAll("figure.fe-media"), function (fig) {
        try {
          return range.intersectsNode(fig);
        } catch (e) {
          return false;
        }
      });
    }

    function rangeIsEmpty(range) {
      return !String(range.toString() || "").replace(/\u00a0/g, " ").trim();
    }

    function adjacentMediaFromCaret(sel, goingBack) {
      if (!sel || !sel.rangeCount || !sel.isCollapsed) return null;
      let node = sel.anchorNode;
      let offset = sel.anchorOffset;
      if (!node || !editor.contains(node)) return null;

      if (node.nodeType === 1) {
        let child = goingBack ? node.childNodes[offset - 1] : node.childNodes[offset];
        child = skipIgnorableSibling(child, goingBack ? -1 : 1);
        if (isMediaFigure(child)) return child;
      }

      if (node.nodeType === 3) {
        if (goingBack && offset > 0) return null;
        if (!goingBack && offset < String(node.textContent || "").length) return null;
      }

      let block = closestBlock(node, editor);
      if (!block) return null;
      let caret = sel.getRangeAt(0);
      try {
        let edge = document.createRange();
        if (goingBack) {
          edge.setStart(block, 0);
          edge.setEnd(caret.startContainer, caret.startOffset);
          if (!rangeIsEmpty(edge)) return null;
          return isMediaFigure(skipIgnorableSibling(block.previousSibling, -1))
            ? skipIgnorableSibling(block.previousSibling, -1)
            : null;
        }
        edge.setStart(caret.endContainer, caret.endOffset);
        edge.selectNodeContents(block);
        edge.setStart(caret.endContainer, caret.endOffset);
        if (!rangeIsEmpty(edge)) return null;
        return isMediaFigure(skipIgnorableSibling(block.nextSibling, 1))
          ? skipIgnorableSibling(block.nextSibling, 1)
          : null;
      } catch (e) {
        return null;
      }
    }

    function selectMedia(fig) {
      if (!isMediaFigure(fig)) return;
      if (selectedMedia === fig && resizeUI) {
        positionResizeUI();
        return;
      }
      deselectImage();
      if (selectedMedia && selectedMedia !== fig) {
        selectedMedia.classList.remove("fe-media--selected");
      }
      selectedMedia = fig;
      fig.classList.add("fe-media--selected");
      mountResizeUI(fig);
      syncAlignButton();
    }

    function deselectMedia() {
      if (selectedMedia) selectedMedia.classList.remove("fe-media--selected");
      selectedMedia = null;
      if (!selectedImg) clearResizeUI();
    }

    function removeMediaWidget(fig) {
      if (!isMediaFigure(fig)) return;
      if (selectedMedia === fig) deselectMedia();
      let parent = fig.parentNode;
      if (parent) parent.removeChild(fig);
      if (
        !editor.textContent.trim() &&
        !editor.querySelector("img,table,iframe,video,.fe-media")
      ) {
        editor.innerHTML =
          '<div style="font-size:' + DEFAULT_FONT_SIZE + 'px"><br></div>';
        let firstDiv = editor.querySelector("div");
        if (firstDiv) placeCaretIn(firstDiv);
      }
      sync();
      remember();
      commitHistory();
    }

    function isEditorImage(node) {
      if (!node || node.nodeType !== 1 || node.tagName !== "IMG") return false;
      if (!editor.contains(node)) return false;
      if (node.closest && node.closest("figure.fe-media")) return false;
      return true;
    }

    function clearResizeListeners() {
      window.removeEventListener("scroll", positionResizeUI, true);
      window.removeEventListener("resize", positionResizeUI);
      resizeScrollParents.forEach(function (node) {
        node.removeEventListener("scroll", positionResizeUI);
      });
      resizeScrollParents = [];
    }

    function clearResizeUI() {
      clearResizeListeners();
      if (resizeUI && resizeUI.parentNode) resizeUI.parentNode.removeChild(resizeUI);
      resizeUI = null;
    }

    function resizeTarget() {
      if (selectedImg && editor.contains(selectedImg)) return selectedImg;
      if (selectedMedia && editor.contains(selectedMedia)) return selectedMedia;
      return null;
    }

    function selectedAlignTarget() {
      return resizeTarget();
    }

    function deselectImage() {
      if (selectedImg) selectedImg.classList.remove("fe-img--selected");
      selectedImg = null;
      if (!selectedMedia) clearResizeUI();
    }

    let selectedImgObserver = null;
    if (typeof MutationObserver === "function") {
      selectedImgObserver = new MutationObserver(function () {
        if (selectedImg && !editor.contains(selectedImg)) deselectImage();
        if (selectedMedia && !editor.contains(selectedMedia)) deselectMedia();
      });
      selectedImgObserver.observe(editor, { childList: true, subtree: true });
    }

    function onDocImageDeselect(e) {
      if (resizeUI && resizeUI.contains(e.target)) return;
      if (
        e.target &&
        e.target.closest &&
        e.target.closest(".fe-toolbar, .fe-align-menu, .fe-color-picker, .fe-modal")
      ) {
        return;
      }
      if (root && root.contains(e.target) && editor.contains(e.target)) return;
      if (selectedImg && e.target !== selectedImg) deselectImage();
      if (selectedMedia && !selectedMedia.contains(e.target)) deselectMedia();
    }

    function eventPoint(ev) {
      if (ev.touches && ev.touches[0]) {
        return { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
      }
      if (ev.changedTouches && ev.changedTouches[0]) {
        return { x: ev.changedTouches[0].clientX, y: ev.changedTouches[0].clientY };
      }
      return { x: ev.clientX, y: ev.clientY };
    }

    function positionResizeUI() {
      let target = resizeTarget();
      if (!resizeUI || !target) {
        if (selectedImg) deselectImage();
        if (selectedMedia) deselectMedia();
        return;
      }
      let imgR = target.getBoundingClientRect();
      let edR = editor.getBoundingClientRect();

      if (
        imgR.right <= edR.left ||
        imgR.left >= edR.right ||
        imgR.bottom <= edR.top ||
        imgR.top >= edR.bottom ||
        imgR.width <= 0 ||
        imgR.height <= 0
      ) {
        resizeUI.style.visibility = "hidden";
        return;
      }

      resizeUI.style.visibility = "visible";
      resizeUI.style.top = imgR.top + window.pageYOffset + "px";
      resizeUI.style.left = imgR.left + window.pageXOffset + "px";
      resizeUI.style.width = imgR.width + "px";
      resizeUI.style.height = imgR.height + "px";

      let topClip = Math.max(0, edR.top - imgR.top);
      let leftClip = Math.max(0, edR.left - imgR.left);
      let bottomClip = Math.max(0, imgR.bottom - edR.bottom);
      let rightClip = Math.max(0, imgR.right - edR.right);
      resizeUI.style.clipPath =
        "inset(" +
        topClip +
        "px " +
        rightClip +
        "px " +
        bottomClip +
        "px " +
        leftClip +
        "px)";

      let handles = resizeUI.querySelectorAll(".fe-img-resize__handle");
      Array.prototype.forEach.call(handles, function (handle) {
        let corner = handle.getAttribute("data-corner");
        let x = corner === "ne" || corner === "se" ? imgR.right : imgR.left;
        let y = corner === "sw" || corner === "se" ? imgR.bottom : imgR.top;
        let inside =
          x >= edR.left - 1 &&
          x <= edR.right + 1 &&
          y >= edR.top - 1 &&
          y <= edR.bottom + 1;
        handle.style.display = inside ? "" : "none";
      });
    }

    function maxResizeWidth() {
      let pad = 0;
      try {
        let cs = window.getComputedStyle(editor);
        pad = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
      } catch (e) {
        pad = 0;
      }
      return Math.max(40, editor.clientWidth - pad);
    }

    function applyResizableSize(target, newW, ratio) {
      let cap = maxResizeWidth();
      newW = Math.max(40, Math.min(Math.round(newW), cap));
      let newH = Math.max(40, Math.round(newW / (ratio || 1)));
      if (isEditorImage(target)) {
        target.style.width = newW + "px";
        target.style.maxWidth = "100%";
        target.style.height = "auto";
        target.setAttribute("width", String(newW));
        target.setAttribute("height", String(newH));
        target.classList.add("fe-img");
        return;
      }
      if (!isMediaFigure(target)) return;
      target.style.width = newW + "px";
      target.style.maxWidth = "100%";
      target.style.height = "";
      let provider = mediaProviderOf(target);
      // YouTube/Vimeo/TikTok height follows the wrapper ratio. Instagram has
      // no forced ratio, so scale the live iframe height with width.
      if (provider === "instagram") {
        let iframe = target.querySelector("iframe");
        if (iframe) {
          iframe.style.width = "100%";
          iframe.style.maxWidth = "100%";
          iframe.style.minHeight = "0";
          iframe.style.height = newH + "px";
        }
      }
    }

    function startMediaResize(e, target, corner) {
      e.preventDefault();
      e.stopPropagation();
      let pt = eventPoint(e);
      let startX = pt.x;
      let startY = pt.y;
      let startRect = target.getBoundingClientRect();
      let startW = startRect.width;
      let startH = startRect.height;
      let ratio = startW > 0 && startH > 0 ? startW / startH : 1;
      document.body.classList.add("fe-img-resizing");
      document.body.classList.add("fe-media-resizing");
      let usingPointer = typeof e.pointerId === "number";
      historyLocked = true;

      function onMove(ev) {
        ev.preventDefault();
        let p = eventPoint(ev);
        let dx = p.x - startX;
        let dy = p.y - startY;
        let newW = startW;
        if (corner === "se" || corner === "ne") newW = startW + dx;
        else newW = startW - dx;
        if (Math.abs(dy) > Math.abs(dx) * 1.2) {
          let newH = corner === "se" || corner === "sw" ? startH + dy : startH - dy;
          newW = newH * ratio;
        }
        applyResizableSize(target, newW, ratio);
        ensureResizeCornerVisible(target, corner);
        positionResizeUI();
      }

      function onUp() {
        if (usingPointer) {
          document.removeEventListener("pointermove", onMove, true);
          document.removeEventListener("pointerup", onUp, true);
          document.removeEventListener("pointercancel", onUp, true);
        } else {
          document.removeEventListener("mousemove", onMove, true);
          document.removeEventListener("mouseup", onUp, true);
          document.removeEventListener("touchmove", onMove, true);
          document.removeEventListener("touchend", onUp, true);
          document.removeEventListener("touchcancel", onUp, true);
        }
        document.body.classList.remove("fe-img-resizing");
        document.body.classList.remove("fe-media-resizing");
        try {
          historyLocked = false;
          sync();
          remember();
          commitHistory();
          positionResizeUI();
        } finally {
          historyLocked = false;
        }
      }

      if (usingPointer) {
        document.addEventListener("pointermove", onMove, true);
        document.addEventListener("pointerup", onUp, true);
        document.addEventListener("pointercancel", onUp, true);
      } else {
        document.addEventListener("mousemove", onMove, true);
        document.addEventListener("mouseup", onUp, true);
          document.addEventListener("touchmove", onMove, { capture: true, passive: false });
          document.addEventListener("touchend", onUp, true);
          document.addEventListener("touchcancel", onUp, true);
      }
    }

    function ensureResizeCornerVisible(node, corner) {
      if (!node || !editor.contains(node)) return;
      let imgRect = node.getBoundingClientRect();
      let edRect = editor.getBoundingClientRect();
      let pad = 12;
      let deltaX = 0;
      let deltaY = 0;

      let edgeX =
        corner === "se" || corner === "ne" ? imgRect.right : imgRect.left;
      let edgeY =
        corner === "se" || corner === "sw" ? imgRect.bottom : imgRect.top;

      if (edgeX > edRect.right - pad) deltaX = edgeX - (edRect.right - pad);
      if (edgeX < edRect.left + pad) deltaX = edgeX - (edRect.left + pad);
      if (edgeY > edRect.bottom - pad) deltaY = edgeY - (edRect.bottom - pad);
      if (edgeY < edRect.top + pad) deltaY = edgeY - (edRect.top + pad);

      if (deltaX || deltaY) {
        editor.scrollLeft += deltaX;
        editor.scrollTop += deltaY;
      }
    }

    function bindResizeScrollParents(target) {
      let parent = target.parentNode;
      while (parent && parent !== document.body) {
        if (parent.nodeType === 1) {
          let style = window.getComputedStyle(parent);
          let overflow = style.overflow + style.overflowY + style.overflowX;
          if (/(auto|scroll|overlay)/.test(overflow)) {
            parent.addEventListener("scroll", positionResizeUI);
            resizeScrollParents.push(parent);
          }
        }
        parent = parent.parentNode;
      }
    }

    function mountResizeUI(target) {
      clearResizeUI();
      if (!target || !editor.contains(target)) return;
      let box = el("div", {
        className: "fe-img-resize fe-media-resize",
        "aria-hidden": "true",
      });
      ["nw", "ne", "sw", "se"].forEach(function (pos) {
        let handle = el("div", {
          className:
            "fe-img-resize__handle fe-img-resize__handle--" +
            pos +
            " fe-media-resize__handle fe-media-resize__handle--" +
            pos,
          "data-corner": pos,
        });
        function onDown(ev) {
          startMediaResize(ev, target, pos);
        }
        if (window.PointerEvent) {
          handle.addEventListener("pointerdown", onDown);
        } else {
          handle.addEventListener("mousedown", onDown);
          handle.addEventListener("touchstart", onDown, { passive: false });
        }
        box.appendChild(handle);
      });
      document.body.appendChild(box);
      resizeUI = box;
      positionResizeUI();
      window.addEventListener("scroll", positionResizeUI, true);
      window.addEventListener("resize", positionResizeUI);
      bindResizeScrollParents(target);
    }

    function isReusableAlignBlock(parent, el) {
      if (!parent || parent === editor || parent.nodeType !== 1) return false;
      if (!/^(P|DIV)$/i.test(parent.tagName)) return false;
      let kids = parent.childNodes;
      for (let i = 0; i < kids.length; i++) {
        let n = kids[i];
        if (n === el) continue;
        if (n.nodeType === 3 && !String(n.textContent || "").replace(/\u00a0/g, " ").trim()) {
          continue;
        }
        if (n.nodeType === 1 && n.tagName === "BR") continue;
        return false;
      }
      return true;
    }

    function ensureAlignWrap(el) {
      if (!el || !el.parentNode) return null;
      if (isAlignWrap(el.parentNode)) return el.parentNode;
      if (isAlignWrap(el)) return el;
      let parent = el.parentNode;
      if (isReusableAlignBlock(parent, el)) {
        parent.classList.add("fe-align-wrap");
        return parent;
      }
      let wrap = document.createElement("div");
      wrap.className = "fe-align-wrap";
      parent.insertBefore(wrap, el);
      wrap.appendChild(el);
      return wrap;
    }

    function setAlignWrapState(wrap, align) {
      if (!wrap || !wrap.classList) return;
      wrap.classList.remove(
        "fe-align-wrap--left",
        "fe-align-wrap--center",
        "fe-align-wrap--right"
      );
      if (align === "center" || align === "right" || align === "left") {
        wrap.classList.add("fe-align-wrap--" + align);
        wrap.style.textAlign = align;
      }
    }

    function applySelectionAlign(id, cmd) {
      let target = selectedAlignTarget();
      if (!target) {
        exec(cmd);
        return;
      }
      let wrap = ensureAlignWrap(target);
      if (!wrap) return;
      let align = id === "justify" ? "center" : id;
      if (id === "justify") {
        wrap.classList.remove(
          "fe-align-wrap--left",
          "fe-align-wrap--center",
          "fe-align-wrap--right"
        );
        wrap.style.textAlign = "center";
        wrap.classList.add("fe-align-wrap--center");
      } else {
        setAlignWrapState(wrap, align);
      }
      if (target.style) {
        target.style.marginLeft = "0";
        target.style.marginRight = "0";
        target.style.display = "inline-block";
        target.style.verticalAlign = "top";
      }
      positionResizeUI();
    }

    function readNodeAlign(node) {
      if (!node) return "";
      if (node.classList) {
        if (node.classList.contains("fe-align-wrap--center")) return "center";
        if (node.classList.contains("fe-align-wrap--right")) return "right";
        if (node.classList.contains("fe-align-wrap--left")) return "left";
      }
      if (!node.style) return "";
      let inline = String(node.style.textAlign || "").toLowerCase();
      if (inline === "center" || inline === "right" || inline === "justify" || inline === "left") {
        return inline;
      }
      return "";
    }

    function selectImage(img) {
      if (!isEditorImage(img)) return;
      if (selectedImg === img && resizeUI) {
        positionResizeUI();
        return;
      }
      deselectMedia();
      if (selectedImg && selectedImg !== img) {
        selectedImg.classList.remove("fe-img--selected");
      }
      selectedImg = img;
      img.classList.add("fe-img--selected");
      mountResizeUI(img);
      syncAlignButton();
    }

    function showImageDialog(existingImg) {
      if (activeImageDialog) activeImageDialog.close();
      closeLinkForm();
      remember();

      const DEFAULT_IMG_SIZE = 1080;
      let existing =
        existingImg && editor.contains(existingImg) ? existingImg : selectedImage();
      let locked = true;

      let sourceInput = el("input", {
        type: "text",
        className: "fe-img-dialog__input",
        placeholder: "",
        value: existing ? existing.getAttribute("src") || "" : "",
        "aria-label": "Source",
      });
      let altInput = el("input", {
        type: "text",
        className: "fe-img-dialog__input",
        placeholder: "",
        value: existing ? existing.getAttribute("alt") || "" : "",
        "aria-label": "Alternative description",
      });

      let initialW = existing
        ? parseDim(existing.getAttribute("width") || existing.width) || DEFAULT_IMG_SIZE
        : DEFAULT_IMG_SIZE;
      let initialH = existing
        ? parseDim(existing.getAttribute("height") || existing.height) || DEFAULT_IMG_SIZE
        : DEFAULT_IMG_SIZE;

      let widthInput = el("input", {
        type: "text",
        className: "fe-img-dialog__input fe-img-dialog__input--dim",
        inputmode: "numeric",
        value: String(initialW),
        "aria-label": "Width",
        readonly: "readonly",
      });
      let heightInput = el("input", {
        type: "text",
        className: "fe-img-dialog__input fe-img-dialog__input--dim",
        inputmode: "numeric",
        value: String(initialH),
        "aria-label": "Height",
        readonly: "readonly",
      });
      widthInput.readOnly = true;
      heightInput.readOnly = true;
      widthInput.classList.add("is-locked");
      heightInput.classList.add("is-locked");

      let browseBtn = el("button", {
        type: "button",
        className: "fe-img-dialog__icon-btn",
        title: "Upload image",
        "aria-label": "Upload image",
        html: ICONS.upload,
      });
      let lockBtn = el("button", {
        type: "button",
        className: "fe-img-dialog__icon-btn is-active",
        title: "Unlock to change size",
        "aria-label": "Unlock to change size",
        "aria-pressed": "true",
        html: ICONS.lock,
      });

      function setLock(on) {
        locked = !!on;
        lockBtn.classList.toggle("is-active", locked);
        lockBtn.setAttribute("aria-pressed", locked ? "true" : "false");
        lockBtn.title = locked ? "Unlock to change size" : "Lock size";
        lockBtn.setAttribute("aria-label", lockBtn.title);
        lockBtn.innerHTML = locked ? ICONS.lock : ICONS.unlock;
        widthInput.readOnly = locked;
        heightInput.readOnly = locked;
        widthInput.classList.toggle("is-locked", locked);
        heightInput.classList.toggle("is-locked", locked);
        if (locked) {
          if (!parseDim(widthInput.value)) widthInput.value = String(DEFAULT_IMG_SIZE);
          if (!parseDim(heightInput.value)) heightInput.value = String(DEFAULT_IMG_SIZE);
        }
      }

      browseBtn.addEventListener("click", function (e) {
        e.preventDefault();
        fileInput.click();
      });
      lockBtn.addEventListener("click", function (e) {
        e.preventDefault();
        setLock(!locked);
        if (!locked) {
          widthInput.focus();
          widthInput.select();
        }
      });

      sourceInput.addEventListener("input", function () {
        sourceInput.classList.remove("is-invalid");
      });

      let closeX = el("button", {
        type: "button",
        className: "fe-modal__x",
        "aria-label": "Close",
        html: "&times;",
      });
      let cancelBtn = el("button", {
        type: "button",
        className: "fe-modal__btn fe-modal__btn--close",
        text: "Cancel",
      });
      let saveBtn = el("button", {
        type: "button",
        className: "fe-modal__btn fe-modal__btn--save",
        text: "Save",
      });

      let dialog = el(
        "div",
        {
          className: "fe-modal__dialog fe-img-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": "Insert/Edit Image",
        },
        [
          closeX,
          el("h3", { className: "fe-modal__title", text: "Insert/Edit Image" }),
          el("div", { className: "fe-img-dialog__body" }, [
            el("label", { className: "fe-img-dialog__field" }, [
              el("span", { className: "fe-img-dialog__label", text: "Source" }),
              el("div", { className: "fe-img-dialog__source-row" }, [
                sourceInput,
                browseBtn,
              ]),
            ]),
            el("label", { className: "fe-img-dialog__field" }, [
              el("span", {
                className: "fe-img-dialog__label",
                text: "Alternative description",
              }),
              altInput,
            ]),
            el("div", { className: "fe-img-dialog__dims" }, [
              el("label", { className: "fe-img-dialog__field" }, [
                el("span", { className: "fe-img-dialog__label", text: "Width" }),
                widthInput,
              ]),
              el("label", { className: "fe-img-dialog__field" }, [
                el("span", { className: "fe-img-dialog__label", text: "Height" }),
                heightInput,
              ]),
              el("div", { className: "fe-img-dialog__lock-wrap" }, [lockBtn]),
            ]),
          ]),
          el("div", { className: "fe-img-dialog__footer" }, [
            el("div", { className: "fe-modal__actions" }, [cancelBtn, saveBtn]),
          ]),
        ]
      );
      let overlay = el("div", { className: "fe-modal fe-modal--image" }, [dialog]);

      function close() {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.removeEventListener("keydown", onKey, true);
        activeImageDialog = null;
      }

      function onKey(e) {
        if (e.key === "Escape") {
          e.preventDefault();
          close();
          focusEditor(editor, savedRange);
        }
      }

      function onFile(file) {
        browseBtn.disabled = true;
        uploadImageFile(file, options)
          .then(function (src) {
            sourceInput.value = src;
            sourceInput.classList.remove("is-invalid");
            if (locked) {
              widthInput.value = String(DEFAULT_IMG_SIZE);
              heightInput.value = String(DEFAULT_IMG_SIZE);
            }
          })
          .catch(function (err) {
            window.alert((err && err.message) || "Image upload failed");
          })
          .then(function () {
            browseBtn.disabled = false;
          });
      }

      function submit() {
        let src = sourceInput.value.trim();
        let safeSrc = sanitizeUrl(src, {
          purpose: "image",
          allowDataUrls: securityOptions.allowDataUrls,
          allowBlobUrls: securityOptions.allowLocalImageFallback,
        });
        if (!safeSrc) {
          sourceInput.classList.add("is-invalid");
          sourceInput.focus();
          return;
        }
        let alt = altInput.value;
        let width = parseDim(widthInput.value) || DEFAULT_IMG_SIZE;
        let height = parseDim(heightInput.value) || DEFAULT_IMG_SIZE;
        close();

        if (existing && editor.contains(existing)) {
          focusEditor(editor, savedRange);
          if (!applyImageAttrs(existing, safeSrc, alt, width, height)) {
            window.alert("That image URL is not allowed");
            return;
          }
          sync();
          remember();
          commitHistory();
          selectImage(existing);
          return;
        }

        let html =
          '<img src="' +
          escapeAttr(safeSrc) +
          '" alt="' +
          escapeAttr(alt) +
          '" class="fe-img"' +
          ' width="' +
          width +
          '" height="' +
          height +
          '" style="width:' +
          width +
          "px;height:auto;max-width:100%;\">";

        run(function () {
          insertHtmlAtCaret(editor, html, securityOptions);
        });
      }

      closeX.addEventListener("click", function (e) {
        e.preventDefault();
        close();
        focusEditor(editor, savedRange);
      });
      cancelBtn.addEventListener("click", function (e) {
        e.preventDefault();
        close();
        focusEditor(editor, savedRange);
      });
      saveBtn.addEventListener("click", function (e) {
        e.preventDefault();
        submit();
      });
      overlay.addEventListener("mousedown", function (e) {
        if (e.target === overlay) {
          close();
          focusEditor(editor, savedRange);
        }
      });
      dialog.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && e.target && e.target.tagName === "INPUT") {
          e.preventDefault();
          submit();
        }
      });

      document.addEventListener("keydown", onKey, true);
      document.body.appendChild(overlay);
      activeImageDialog = { close: close, onFile: onFile };
      sourceInput.focus();
      sourceInput.select();
    }

    const LINK_CHECK_SVG =
      '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m4 10 4 4 8-9"/></svg>';
    const LINK_CLOSE_SVG =
      '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15"/></svg>';

    let activeLinkForm = null;

    function anchorFromRange(range) {
      if (!range) return null;
      let nodes = [range.commonAncestorContainer, range.startContainer, range.endContainer];
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        while (node && node !== editor) {
          if (node.nodeType === 1 && node.tagName === "A") return node;
          node = node.parentNode;
        }
      }
      return null;
    }

    function closestAnchor(node) {
      while (node && node !== editor) {
        if (node.nodeType === 1 && node.tagName === "A") return node;
        node = node.parentNode;
      }
      return null;
    }

    function selectionInLink() {
      let sel = window.getSelection();
      if (sel && sel.rangeCount && editor.contains(sel.anchorNode)) {
        return (
          closestAnchor(sel.anchorNode) ||
          closestAnchor(sel.focusNode) ||
          anchorFromRange(sel.getRangeAt(0))
        );
      }
      if (savedRange) {
        return (
          closestAnchor(savedRange.startContainer) ||
          closestAnchor(savedRange.endContainer) ||
          anchorFromRange(savedRange)
        );
      }
      return null;
    }

    function closestBookmark(node) {
      while (node && node !== editor) {
        if (node.nodeType === 1 && node.tagName === "SPAN" && hasFeAnchorClass(node)) {
          return node;
        }
        node = node.parentNode;
      }
      return null;
    }

    function bookmarkFromRange(range) {
      if (!range) return null;
      let nodes = [range.commonAncestorContainer, range.startContainer, range.endContainer];
      for (let i = 0; i < nodes.length; i++) {
        let found = closestBookmark(nodes[i]);
        if (found) return found;
      }
      let ancestor = range.commonAncestorContainer;
      if (ancestor && ancestor.nodeType === 1 && ancestor.querySelector) {
        let nested = ancestor.querySelector("span.fe-anchor");
        if (nested) {
          try {
            if (range.intersectsNode(nested)) return nested;
          } catch (e) {}
        }
      }
      return null;
    }

    function selectionInBookmark() {
      let sel = window.getSelection();
      if (sel && sel.rangeCount && editor.contains(sel.anchorNode)) {
        return (
          closestBookmark(sel.anchorNode) ||
          closestBookmark(sel.focusNode) ||
          bookmarkFromRange(sel.getRangeAt(0))
        );
      }
      if (savedRange) {
        return (
          closestBookmark(savedRange.startContainer) ||
          closestBookmark(savedRange.endContainer) ||
          bookmarkFromRange(savedRange)
        );
      }
      return null;
    }

    function listEditorAnchors() {
      let out = [];
      let seen = {};
      Array.prototype.forEach.call(
        editor.querySelectorAll("span.fe-anchor[id]"),
        function (node) {
          let id = sanitizeAnchorId(node.getAttribute("id"));
          if (!id || seen[id]) return;
          seen[id] = true;
          out.push({ id: id, label: displayAnchorName(id), el: node });
        }
      );
      return out;
    }

    function editorHasId(id, exceptEl) {
      if (!id) return false;
      let live = null;
      try {
        live = editor.querySelector("#" + id);
      } catch (e) {
        live = null;
      }
      if (live && live !== exceptEl) return true;
      let docEl = document.getElementById(id);
      return !!(docEl && docEl !== exceptEl && !editor.contains(docEl));
    }

    function retargetBookmarkLinks(oldId, newId) {
      if (!oldId || !newId || oldId === newId) return;
      let from = "#" + oldId;
      let to = "#" + newId;
      Array.prototype.forEach.call(editor.querySelectorAll("a[href]"), function (a) {
        if (a.getAttribute("href") === from) a.setAttribute("href", to);
      });
    }

    function applyAnchor(rawName, existing) {
      let id = sanitizeAnchorId(rawName);
      if (!id) return false;
      let range =
        savedRange && savedRange.cloneRange
          ? savedRange.cloneRange()
          : savedRange;
      focusEditor(editor, range);
      if (existing && editor.contains(existing)) {
        if (editorHasId(id, existing)) return false;
        let oldId = existing.getAttribute("id") || "";
        existing.classList.add("fe-anchor");
        existing.setAttribute("id", id);
        if (oldId && oldId !== id) retargetBookmarkLinks(oldId, id);
      } else {
        if (editorHasId(id, null)) return false;
        if (range) restoreSelection(range);
        let liveRange =
          window.getSelection() && window.getSelection().rangeCount
            ? window.getSelection().getRangeAt(0)
            : range;
        let collapsed = !liveRange || liveRange.collapsed;
        let span = wrapRangeWithAnchor(liveRange, id);
        if (span && collapsed) placeCaretAfter(span);
      }
      sync();
      remember();
      commitHistory();
      syncToolbarState();
      return true;
    }

    function removeAnchor(span) {
      if (!span || !editor.contains(span)) return;
      let range =
        savedRange && savedRange.cloneRange
          ? savedRange.cloneRange()
          : savedRange;
      focusEditor(editor, range);
      unwrapElement(span);
      sync();
      remember();
      commitHistory();
      syncToolbarState();
    }

    function closeLinkForm() {
      if (!activeLinkForm) return;
      document.removeEventListener("mousedown", activeLinkForm.onDocDown, true);
      if (activeLinkForm.el.parentNode) {
        activeLinkForm.el.parentNode.removeChild(activeLinkForm.el);
      }
      activeLinkForm = null;
    }

    function applyLink(url, existing, openInNew) {
      url = normalizeHref(url, securityOptions);
      openInNew = !!openInNew;
      if (url && url.charAt(0) === "#") openInNew = false;
      let range =
        savedRange && savedRange.cloneRange
          ? savedRange.cloneRange()
          : savedRange;
      focusEditor(editor, range);
      if (!url) return;

      function setTargetAttrs(anchor) {
        if (!anchor) return;
        anchor.setAttribute("href", url);
        if (openInNew) {
          anchor.setAttribute("target", "_blank");
          anchor.setAttribute("rel", "noopener noreferrer");
        } else {
          anchor.removeAttribute("target");
          anchor.removeAttribute("rel");
        }
      }

      function applyAttrsToHrefMatches() {
        Array.prototype.forEach.call(
          editor.querySelectorAll("a[href]"),
          function (a) {
            if (a.getAttribute("href") === url) setTargetAttrs(a);
          }
        );
      }

      // execCommand keeps the caret in place; the editor history stack records
      // the result as one step (native undo is intercepted).
      if (existing && editor.contains(existing)) {
        let editRange = document.createRange();
        editRange.selectNodeContents(existing);
        restoreSelection(editRange);
        exec("createLink", url);
        setTargetAttrs(selectionInLink() || existing);
      } else if (range && !range.collapsed) {
        restoreSelection(range);
        exec("createLink", url);
        let linked = selectionInLink();
        if (linked) {
          setTargetAttrs(linked);
        } else {
          let wrapped = wrapRangeWithLink(range, url, openInNew);
          if (!wrapped) applyAttrsToHrefMatches();
        }
      } else {
        let safeHref = url.replace(/"/g, "&quot;");
        let safeText = url
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        let targetAttrs = openInNew
          ? ' target="_blank" rel="noopener noreferrer"'
          : "";
        if (range) restoreSelection(range);
        exec(
          "insertHTML",
          '<a href="' + safeHref + '"' + targetAttrs + ">" + safeText + "</a>"
        );
        applyAttrsToHrefMatches();
      }
      sync();
      remember();
      commitHistory();
      syncToolbarState();
    }

    function removeLink(anchor) {
      if (!anchor || !editor.contains(anchor)) return;
      let range =
        savedRange && savedRange.cloneRange
          ? savedRange.cloneRange()
          : savedRange;
      focusEditor(editor, range);
      let unlinkRange = document.createRange();
      unlinkRange.selectNodeContents(anchor);
      restoreSelection(unlinkRange);
      exec("unlink");
      if (editor.contains(anchor)) {
        let parent = anchor.parentNode;
        if (!parent) return;
        while (anchor.firstChild) parent.insertBefore(anchor.firstChild, anchor);
        parent.removeChild(anchor);
        if (parent.normalize) parent.normalize();
      }
      sync();
      remember();
      commitHistory();
      syncToolbarState();
    }

    let activeLinkDialog = null;
    let activeAnchorDialog = null;

    function showLinkDialog() {
      if (activeLinkDialog) activeLinkDialog.close();
      if (activeAnchorDialog) activeAnchorDialog.close();
      closeLinkForm();
      remember();
      focusEditor(editor, savedRange);
      expandCollapsedToWord();
      remember();
      let linkRange =
        savedRange && savedRange.cloneRange
          ? savedRange.cloneRange()
          : savedRange;
      let existing = anchorFromRange(linkRange) || selectionInLink();
      let existingTarget = existing ? existing.getAttribute("target") : null;
      let openInNew = !existing || existingTarget === "_blank";

      let urlInput = el("input", {
        type: "text",
        className: "fe-img-dialog__input",
        placeholder: "https://example.com",
        value: existing ? existing.getAttribute("href") || "" : "",
        "aria-label": "URL",
      });
      let urlError = el("div", {
        className: "fe-field-error",
        hidden: "hidden",
        text: "",
      });

      let currentHref = urlInput.value.trim();
      let currentFrag = currentHref.charAt(0) === "#" ? currentHref : "";
      if (currentFrag) {
        openInNew = false;
      }

      let anchorSelect = el("select", {
        className: "fe-img-dialog__input",
        "aria-label": "Anchors",
      });
      anchorSelect.appendChild(
        el("option", { value: "", text: "— Select an anchor —" })
      );
      listEditorAnchors().forEach(function (item) {
        let opt = el("option", { value: item.id, text: item.label });
        if (
          currentFrag &&
          (item.id === currentFrag.slice(1) || "#" + item.id === currentFrag)
        ) {
          opt.selected = true;
        }
        anchorSelect.appendChild(opt);
      });

      let targetNew = el("input", {
        type: "radio",
        name: "fe-link-target",
        value: "_blank",
        id: "fe-link-target-new",
      });
      let targetCurrent = el("input", {
        type: "radio",
        name: "fe-link-target",
        value: "_self",
        id: "fe-link-target-current",
      });
      if (openInNew) targetNew.checked = true;
      else targetCurrent.checked = true;

      let closeX = el("button", {
        type: "button",
        className: "fe-modal__x",
        "aria-label": "Close",
        html: "&times;",
      });
      let cancelBtn = el("button", {
        type: "button",
        className: "fe-modal__btn fe-modal__btn--close",
        text: "Cancel",
      });
      let saveBtn = el("button", {
        type: "button",
        className: "fe-modal__btn fe-modal__btn--save",
        text: "Save",
      });
      let removeBtn = existing
        ? el("button", {
            type: "button",
            className: "fe-modal__btn fe-modal__btn--remove",
            text: "Remove link",
          })
        : null;

      let footerActions = el("div", { className: "fe-link-dialog__footer-row" }, [
        removeBtn
          ? el("div", { className: "fe-link-dialog__footer-start" }, [removeBtn])
          : el("div", { className: "fe-link-dialog__footer-start" }),
        el("div", { className: "fe-modal__actions" }, [cancelBtn, saveBtn]),
      ]);

      let dialog = el(
        "div",
        {
          className: "fe-modal__dialog fe-img-dialog fe-link-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": "Insert/Edit Link",
        },
        [
          closeX,
          el("h3", { className: "fe-modal__title", text: "Insert/Edit Link" }),
          el("div", { className: "fe-img-dialog__body" }, [
            el("label", { className: "fe-img-dialog__field" }, [
              el("span", { className: "fe-img-dialog__label", text: "URL" }),
              urlInput,
              urlError,
            ]),
            el("label", { className: "fe-img-dialog__field" }, [
              el("span", { className: "fe-img-dialog__label", text: "Anchors" }),
              anchorSelect,
            ]),
            el("div", { className: "fe-img-dialog__field" }, [
              el("span", {
                className: "fe-img-dialog__label",
                text: "Open link in…",
              }),
              el("div", { className: "fe-link-dialog__targets" }, [
                el("label", { className: "fe-link-dialog__option" }, [
                  targetNew,
                  el("span", { text: "New window" }),
                ]),
                el("label", { className: "fe-link-dialog__option" }, [
                  targetCurrent,
                  el("span", { text: "Current window" }),
                ]),
              ]),
            ]),
          ]),
          el("div", { className: "fe-img-dialog__footer" }, [footerActions]),
        ]
      );
      let overlay = el("div", { className: "fe-modal fe-modal--image" }, [dialog]);

      function close() {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.removeEventListener("keydown", onKey, true);
        activeLinkDialog = null;
      }

      function onKey(e) {
        if (e.key === "Escape") {
          e.preventDefault();
          close();
          focusEditor(editor, linkRange);
        }
      }

      function showUrlError(message) {
        urlInput.classList.add("is-invalid");
        urlError.textContent = message;
        urlError.removeAttribute("hidden");
        urlError.setAttribute("role", "alert");
        urlInput.setAttribute("aria-invalid", "true");
        urlInput.focus();
      }

      function clearUrlError() {
        urlInput.classList.remove("is-invalid");
        urlError.textContent = "";
        urlError.setAttribute("hidden", "hidden");
        urlInput.removeAttribute("aria-invalid");
      }

      function submit() {
        let val = urlInput.value.trim();
        if (!val) {
          showUrlError("Enter a URL.");
          return;
        }
        let clean = normalizeHref(val, securityOptions);
        if (!clean) {
          showUrlError(
            "That URL is not allowed. Use https://, a relative path, or an in-page #anchor."
          );
          return;
        }
        urlInput.value = clean;
        let newWindow = !!targetNew.checked;
        close();
        savedRange = linkRange;
        applyLink(clean, existing, newWindow);
      }

      closeX.addEventListener("click", function (e) {
        e.preventDefault();
        close();
        focusEditor(editor, linkRange);
      });
      cancelBtn.addEventListener("click", function (e) {
        e.preventDefault();
        close();
        focusEditor(editor, linkRange);
      });
      saveBtn.addEventListener("click", function (e) {
        e.preventDefault();
        submit();
      });
      if (removeBtn) {
        removeBtn.addEventListener("click", function (e) {
          e.preventDefault();
          close();
          savedRange = linkRange;
          removeLink(existing);
        });
      }
      overlay.addEventListener("mousedown", function (e) {
        if (e.target === overlay) {
          close();
          focusEditor(editor, linkRange);
        }
      });
      urlInput.addEventListener("input", function () {
        clearUrlError();
      });
      urlInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          submit();
        }
      });
      anchorSelect.addEventListener("change", function () {
        let id = sanitizeAnchorId(anchorSelect.value);
        if (!id) return;
        urlInput.value = "#" + id;
        clearUrlError();
        targetCurrent.checked = true;
        targetNew.checked = false;
      });

      document.addEventListener("keydown", onKey, true);
      document.body.appendChild(overlay);
      activeLinkDialog = { close: close };
      urlInput.focus();
      urlInput.select();
    }

    function showAnchorDialog() {
      if (activeAnchorDialog) activeAnchorDialog.close();
      if (activeLinkDialog) activeLinkDialog.close();
      closeLinkForm();
      remember();
      focusEditor(editor, savedRange);
      remember();
      let bookmarkRange =
        savedRange && savedRange.cloneRange
          ? savedRange.cloneRange()
          : savedRange;
      let existing = bookmarkFromRange(bookmarkRange) || selectionInBookmark();
      let isEdit = !!(existing && editor.contains(existing));

      let nameInput = el("input", {
        type: "text",
        className: "fe-img-dialog__input",
        placeholder: "section-name",
        value: isEdit ? displayAnchorName(existing.getAttribute("id")) : "",
        "aria-label": "Anchor Name",
        autocomplete: "off",
        spellcheck: "false",
      });

      let closeX = el("button", {
        type: "button",
        className: "fe-modal__x",
        "aria-label": "Close",
        html: "&times;",
      });
      let cancelBtn = el("button", {
        type: "button",
        className: "fe-modal__btn fe-modal__btn--close",
        text: "Cancel",
      });
      let saveBtn = el("button", {
        type: "button",
        className: "fe-modal__btn fe-modal__btn--save",
        text: isEdit ? "Update" : "Insert",
      });
      let removeBtn = isEdit
        ? el("button", {
            type: "button",
            className: "fe-modal__btn fe-modal__btn--remove",
            text: "Remove anchor",
          })
        : null;

      let footerActions = el("div", { className: "fe-link-dialog__footer-row" }, [
        removeBtn
          ? el("div", { className: "fe-link-dialog__footer-start" }, [removeBtn])
          : el("div", { className: "fe-link-dialog__footer-start" }),
        el("div", { className: "fe-modal__actions" }, [cancelBtn, saveBtn]),
      ]);

      let dialog = el(
        "div",
        {
          className: "fe-modal__dialog fe-img-dialog fe-link-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": isEdit ? "Edit Anchor" : "Insert Anchor",
        },
        [
          closeX,
          el("h3", {
            className: "fe-modal__title",
            text: isEdit ? "Edit Anchor" : "Insert Anchor",
          }),
          el("div", { className: "fe-img-dialog__body" }, [
            el("label", { className: "fe-img-dialog__field" }, [
              el("span", { className: "fe-img-dialog__label", text: "Anchor Name" }),
              nameInput,
              el("span", {
                className: "fe-img-dialog__hint",
                text: "Lowercase letters, numbers, and hyphens. Must start with a letter.",
              }),
            ]),
          ]),
          el("div", { className: "fe-img-dialog__footer" }, [footerActions]),
        ]
      );
      let overlay = el("div", { className: "fe-modal fe-modal--image" }, [dialog]);

      function close() {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.removeEventListener("keydown", onKey, true);
        activeAnchorDialog = null;
      }

      function onKey(e) {
        if (e.key === "Escape") {
          e.preventDefault();
          close();
          focusEditor(editor, bookmarkRange);
        }
      }

      function submit() {
        let raw = nameInput.value.trim();
        let id = sanitizeAnchorId(raw);
        if (!id || editorHasId(id, isEdit ? existing : null)) {
          nameInput.classList.add("is-invalid");
          nameInput.focus();
          return;
        }
        close();
        savedRange = bookmarkRange;
        applyAnchor(raw, isEdit ? existing : null);
      }

      closeX.addEventListener("click", function (e) {
        e.preventDefault();
        close();
        focusEditor(editor, bookmarkRange);
      });
      cancelBtn.addEventListener("click", function (e) {
        e.preventDefault();
        close();
        focusEditor(editor, bookmarkRange);
      });
      saveBtn.addEventListener("click", function (e) {
        e.preventDefault();
        submit();
      });
      if (removeBtn) {
        removeBtn.addEventListener("click", function (e) {
          e.preventDefault();
          close();
          savedRange = bookmarkRange;
          removeAnchor(existing);
        });
      }
      overlay.addEventListener("mousedown", function (e) {
        if (e.target === overlay) {
          close();
          focusEditor(editor, bookmarkRange);
        }
      });
      nameInput.addEventListener("input", function () {
        nameInput.classList.remove("is-invalid");
      });
      nameInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          submit();
        }
      });

      document.addEventListener("keydown", onKey, true);
      document.body.appendChild(overlay);
      activeAnchorDialog = { close: close };
      nameInput.focus();
      nameInput.select();
    }

    function showMediaBalloon(anchor) {
      closeLinkForm();

      let input = el("input", {
        type: "text",
        className: "fe-link-input",
        placeholder: "YouTube / Vimeo / Instagram / TikTok / .mp4 URL",
        value: "",
      });
      let saveBtn = el("button", {
        type: "button",
        className: "fe-link-btn fe-link-save",
        title: "Insert",
        "aria-label": "Insert",
        html: LINK_CHECK_SVG,
      });
      let cancelBtn = el("button", {
        type: "button",
        className: "fe-link-btn fe-link-cancel",
        title: "Cancel",
        "aria-label": "Cancel",
        html: LINK_CLOSE_SVG,
      });
      let form = el("div", { className: "fe-link-form", role: "dialog" }, [
        input,
        saveBtn,
        cancelBtn,
      ]);

      function submit() {
        let url = input.value;
        function insert(embed) {
          if (!embed) {
            input.classList.remove("is-busy");
            input.classList.add("is-invalid");
            input.focus();
            input.select();
            return;
          }
          closeLinkForm();
          focusEditor(editor, savedRange);
          insertHtmlAtCaret(editor, embed + "<p><br></p>", securityOptions);
          sync();
          remember();
          commitHistory();
        }
        let short = tiktokShortCode(url);
        if (short && isProviderEnabled(securityOptions, "tiktok")) {
          input.classList.remove("is-invalid");
          input.classList.add("is-busy");
          resolveTikTokVideoId(url, securityOptions).then(function (id) {
            if (!id) {
              insert(null);
              return;
            }
            insert(liveProviderHtml("tiktok", id, "", "https://www.tiktok.com/video/" + id));
          });
          return;
        }
        insert(mediaEmbed(url, securityOptions));
      }
      function cancel() {
        closeLinkForm();
        focusEditor(editor, savedRange);
      }
      saveBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        submit();
      });
      cancelBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
      });
      form.addEventListener("mousedown", function (e) {
        e.stopPropagation();
      });
      form.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      input.addEventListener("input", function () {
        input.classList.remove("is-invalid");
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          submit();
        } else if (e.key === "Escape") {
          e.preventDefault();
          cancel();
        }
      });

      document.body.appendChild(form);

      let rect = null;
      if (anchor && anchor.getBoundingClientRect) {
        rect = anchor.getBoundingClientRect();
      }
      if (
        (!rect || (!rect.width && !rect.height)) &&
        savedRange &&
        savedRange.getBoundingClientRect
      ) {
        rect = savedRange.getBoundingClientRect();
      }
      if (!rect || (!rect.width && !rect.height)) {
        rect = editor.getBoundingClientRect();
      }
      let top = window.pageYOffset + rect.bottom + 6;
      let left = window.pageXOffset + rect.left;
      let maxLeft =
        window.pageXOffset + document.documentElement.clientWidth - form.offsetWidth - 8;
      if (left > maxLeft) left = maxLeft;
      if (left < window.pageXOffset + 8) left = window.pageXOffset + 8;
      form.style.top = top + "px";
      form.style.left = left + "px";

      function onDocDown(e) {
        if (form.contains(e.target)) return;
        closeLinkForm();
      }
      activeLinkForm = { el: form, onDocDown: onDocDown };
      setTimeout(function () {
        document.addEventListener("mousedown", onDocDown, true);
      }, 0);

      input.focus();
    }

    function cmdState(cmd) {
      try {
        return document.queryCommandState(cmd);
      } catch (e) {
        return false;
      }
    }

    function cmdEnabled(cmd) {
      try {
        return document.queryCommandEnabled(cmd);
      } catch (e) {
        return false;
      }
    }

    function setActive(btn, on) {
      if (btn) btn.classList.toggle("is-active", !!on);
    }

    function setHistoryBtn(btn, enabled, activeTitle, emptyTitle) {
      if (!btn) return;
      btn.disabled = !enabled;
      btn.classList.toggle("is-disabled", !enabled);
      btn.setAttribute("aria-disabled", enabled ? "false" : "true");
      btn.title = enabled ? activeTitle : emptyTitle;
      btn.setAttribute("aria-label", enabled ? activeTitle : emptyTitle);
    }

    function setFullscreen(on) {
      if (!root || destroyed) return;
      isFullscreen = !!on;
      root.classList.toggle("is-fullscreen", isFullscreen);
      document.body.classList.toggle("fe-fullscreen-lock", isFullscreen);
      if (fullscreenBtn) {
        setActive(fullscreenBtn, isFullscreen);
        let label = isFullscreen ? "Exit fullscreen" : "Fullscreen";
        fullscreenBtn.title = label;
        fullscreenBtn.setAttribute("aria-label", label);
        fullscreenBtn.setAttribute("aria-pressed", isFullscreen ? "true" : "false");
      }
      if (isFullscreen) {
        editor.focus();
      }
    }

    function toggleFullscreen() {
      setFullscreen(!isFullscreen);
    }

    function onFullscreenKeydown(e) {
      if (!isFullscreen || destroyed) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setFullscreen(false);
      }
    }
    document.addEventListener("keydown", onFullscreenKeydown, true);

    let fullscreenBtn = toolBtn(ICONS.fullscreen, "Fullscreen", function () {
      toggleFullscreen();
    });
    fullscreenBtn.setAttribute("aria-pressed", "false");

    let undoBtn = toolBtn(ICONS.undo, "Undo", function () {
      if (undoBtn.disabled) return;
      undoHistory();
    });
    let redoBtn = toolBtn(ICONS.redo, "Redo", function () {
      if (redoBtn.disabled) return;
      redoHistory();
    });

    let boldBtn = toolBtn(ICONS.bold, "Bold", function () {
      run(function () {
        expandCollapsedToWord();
        exec("bold");
      });
    });
    let italicBtn = toolBtn(ICONS.italic, "Italic", function () {
      run(function () {
        expandCollapsedToWord();
        exec("italic");
      });
    });
    let clearFormatBtn = toolBtn(ICONS.clearFormatting, "Clear formatting", function () {
      run(function () {
        clearFormatting();
      });
    });

    let currentTextColor = DEFAULT_TEXT_COLOR;
    let colorBtn;
    let colorPicker;
    let colorWrap = (function () {
      colorBtn = toolBtn(ICONS.textColor, "Text color", function () {
        remember();
        if (colorPicker.isOpen()) {
          colorPicker.close();
          colorBtn.classList.remove("is-active");
        } else {
          colorPicker.setValue(currentTextColor);
          colorPicker.setAnchor(colorBtn);
          colorPicker.open();
          colorBtn.classList.add("is-active");
        }
      });

      function setBarColor(hex) {
        if (hex == null) {
          currentTextColor = DEFAULT_TEXT_COLOR;
        } else {
          currentTextColor = hex || DEFAULT_TEXT_COLOR;
        }
        let bar = colorBtn.querySelector(".fe-text-color-bar");
        if (bar) {
          bar.setAttribute("fill", currentTextColor);
          bar.setAttribute("stroke", currentTextColor);
        }
        if (colorPicker && hex != null) colorPicker.setValue(currentTextColor);
      }

      colorPicker = createColorPicker(function (hex) {
        setBarColor(hex);
        run(function () {
          applyTextColor(hex);
        });
        if (hex != null) colorPicker.setValue(hex);
        colorBtn.classList.remove("is-active");
        colorPicker.close();
      });
      colorPicker.setAnchor(colorBtn);
      setBarColor(currentTextColor);

      let wrap = el("div", { className: "fe-color-wrap" }, [colorBtn]);

      document.addEventListener("mousedown", function (e) {
        if (!colorPicker.isOpen()) return;
        if (colorPicker.isNativeOpen && colorPicker.isNativeOpen()) return;
        if (wrap.contains(e.target) || colorPicker.contains(e.target)) {
          return;
        }
        colorPicker.close();
        colorBtn.classList.remove("is-active");
      });

      return wrap;
    })();

    function syncTextColorBar() {
      if (!colorBtn) return;
      let hex = getSelectionTextColor();
      if (hex) {
        currentTextColor = hex;
        let bar = colorBtn.querySelector(".fe-text-color-bar");
        if (bar) {
          bar.setAttribute("fill", hex);
          bar.setAttribute("stroke", hex);
        }
      }
      if (colorPicker) colorPicker.setValue(currentTextColor);
    }

    let ulBtn = toolBtn(ICONS.ul, "Bulleted list", function () {
      run(function () {
        exec("insertUnorderedList");
        normalizeListNesting(editor);
        pruneEmptyParagraphs(editor);
      });
    });
    let olBtn = toolBtn(ICONS.ol, "Numbered list", function () {
      run(function () {
        exec("insertOrderedList");
        normalizeListNesting(editor);
        pruneEmptyParagraphs(editor);
      });
    });
    let quoteBtn = toolBtn(ICONS.quote, "Block quote", function () {
      run(function () {
        exec("formatBlock", "blockquote");
      });
    });

    function syncHistoryButtons() {
      let canUndo = historyIndex > 0;
      let canRedo = historyIndex >= 0 && historyIndex < historyStack.length - 1;
      setHistoryBtn(undoBtn, canUndo, "Undo", "Nothing to undo");
      setHistoryBtn(redoBtn, canRedo, "Redo", "Nothing to redo");
    }

    let linkBtn = toolBtn(ICONS.link, "Insert/Edit link", function () {
      showLinkDialog();
    });
    let anchorBtn = toolBtn(ICONS.anchor, "Insert/Edit anchor", function () {
      showAnchorDialog();
    });

    let currentAlign = DEFAULT_ALIGN;
    let alignBtn;
    let alignMenu;
    let alignOptionBtns = {};
    let alignWrap = (function () {
      function optionById(id) {
        for (let i = 0; i < ALIGN_OPTIONS.length; i++) {
          if (ALIGN_OPTIONS[i].id === id) return ALIGN_OPTIONS[i];
        }
        return ALIGN_OPTIONS[ALIGN_OPTIONS.length - 1];
      }

      function setAlignUi(id) {
        let opt = optionById(id || DEFAULT_ALIGN);
        currentAlign = opt.id;
        alignBtn.innerHTML = ICONS[opt.icon];
        alignBtn.title = opt.label;
        alignBtn.setAttribute("aria-label", opt.label);
        Object.keys(alignOptionBtns).forEach(function (key) {
          setActive(alignOptionBtns[key], key === currentAlign);
        });
      }

      function closeMenu() {
        if (!alignMenu) return;
        alignMenu.hidden = true;
        alignBtn.classList.remove("is-active");
        alignBtn.setAttribute("aria-expanded", "false");
      }

      function openMenu() {
        if (alignMenu.parentNode !== document.body) {
          document.body.appendChild(alignMenu);
        }
        alignMenu.hidden = false;
        alignBtn.classList.add("is-active");
        alignBtn.setAttribute("aria-expanded", "true");
        positionFloatingPanel(alignMenu, alignBtn);
        requestAnimationFrame(function () {
          positionFloatingPanel(alignMenu, alignBtn);
        });
      }

      alignBtn = toolBtn(ICONS.alignJustify, "Justify", function () {
        remember();
        if (!alignMenu.hidden) closeMenu();
        else openMenu();
      });
      alignBtn.setAttribute("aria-haspopup", "true");
      alignBtn.setAttribute("aria-expanded", "false");

      let menuBtns = ALIGN_OPTIONS.map(function (opt) {
        let btn = toolBtn(ICONS[opt.icon], opt.label, function () {
          setAlignUi(opt.id);
          closeMenu();
          run(function () {
            applySelectionAlign(opt.id, opt.cmd);
          });
        });
        alignOptionBtns[opt.id] = btn;
        return btn;
      });

      alignMenu = el(
        "div",
        {
          className: "fe-align-menu",
          role: "menu",
          "aria-label": "Text alignment",
          hidden: true,
        },
        menuBtns
      );

      setAlignUi(DEFAULT_ALIGN);

      document.addEventListener("mousedown", function (e) {
        if (alignMenu.hidden) return;
        if (alignBtn.contains(e.target) || alignMenu.contains(e.target)) return;
        closeMenu();
      });

      alignBtn._setAlignUi = setAlignUi;
      alignBtn._closeMenu = closeMenu;
      return alignBtn;
    })();

    function getSelectionAlign() {
      let target = selectedAlignTarget();
      if (target) {
        let wrap = isAlignWrap(target.parentNode)
          ? target.parentNode
          : isAlignWrap(target)
            ? target
            : null;
        let fromWrap = readNodeAlign(wrap);
        if (fromWrap) return fromWrap;
      }
      let sel = window.getSelection();
      if (sel && sel.rangeCount && editor.contains(sel.anchorNode)) {
        let block = closestBlock(sel.anchorNode, editor) || editor;
        let inline = block.style && block.style.textAlign
          ? String(block.style.textAlign).toLowerCase()
          : "";
        if (inline === "center" || inline === "right" || inline === "justify" || inline === "left") {
          return inline;
        }
        let computed = "";
        try {
          computed = String(
            window.getComputedStyle(block).textAlign || ""
          ).toLowerCase();
        } catch (e) {
          computed = "";
        }
        if (computed === "center" || computed === "right" || computed === "justify") {
          return computed;
        }
        if (computed === "left" || computed === "start") {
          if (cmdState("justifyLeft") && !cmdState("justifyFull")) return "left";
        }
      }
      if (cmdState("justifyCenter")) return "center";
      if (cmdState("justifyRight")) return "right";
      if (cmdState("justifyFull")) return "justify";
      if (cmdState("justifyLeft")) return "left";
      return DEFAULT_ALIGN;
    }

    function syncAlignButton() {
      if (!alignWrap || !alignWrap._setAlignUi) return;
      alignWrap._setAlignUi(getSelectionAlign());
    }

    function syncToolbarState() {
      let sel = window.getSelection();
      let inEditor = sel && sel.rangeCount && editor.contains(sel.anchorNode);
      if (inEditor || document.activeElement === editor) {
        syncHistoryButtons();
      }
      let inLink = !!selectionInLink();
      let inBookmark = !!selectionInBookmark();
      if (!inEditor) {
        setActive(boldBtn, false);
        setActive(italicBtn, false);
        setActive(linkBtn, inLink);
        setActive(anchorBtn, inBookmark);
        setActive(ulBtn, false);
        setActive(olBtn, false);
        setActive(quoteBtn, false);
        if (selectedAlignTarget()) syncAlignButton();
        return;
      }
      setActive(boldBtn, cmdState("bold"));
      setActive(italicBtn, cmdState("italic"));
      setActive(linkBtn, inLink);
      setActive(anchorBtn, inBookmark);
      setActive(ulBtn, cmdState("insertUnorderedList"));
      setActive(olBtn, cmdState("insertOrderedList"));
      syncTextColorBar();
      syncAlignButton();
      let inQuote = false;
      let node = sel.anchorNode;
      while (node && node !== editor) {
        if (node.nodeType === 1 && node.tagName === "BLOCKQUOTE") {
          inQuote = true;
          break;
        }
        node = node.parentNode;
      }
      setActive(quoteBtn, inQuote);
    }

    let toolbar = el("div", { className: "fe-toolbar", role: "toolbar" }, [
      fullscreenBtn,
      sep(),
      undoBtn,
      redoBtn,
      sep(),
      formatSelect,
      sizeSelect,
      sep(),
      boldBtn,
      italicBtn,
      colorWrap,
      clearFormatBtn,
      sep(),
      linkBtn,
      anchorBtn,
      toolBtn(ICONS.image, "Insert/Edit image", function () {
        remember();
        showImageDialog();
      }),
      (function () {
        let tableWrap;
        let tableBtn = toolBtn(ICONS.table, "Insert table", function () {
          remember();
          if (tablePicker.isOpen()) {
            tablePicker.close();
            tableBtn.classList.remove("is-active");
          } else {
            tablePicker.setAnchor(tableBtn);
            tablePicker.open();
            tableBtn.classList.add("is-active");
          }
        });

        let tablePicker = createTablePicker(function (rows, cols) {
          tablePicker.close();
          tableBtn.classList.remove("is-active");
          run(function () {
            insertHtmlAtCaret(editor, buildTable(rows, cols), securityOptions);
          });
        });
        tablePicker.setAnchor(tableBtn);

        tableWrap = el("div", { className: "fe-table-wrap" }, [tableBtn]);

        document.addEventListener("mousedown", function (e) {
          if (!tablePicker.isOpen()) return;
          if (tableWrap.contains(e.target) || tablePicker.contains(e.target)) {
            return;
          }
          tablePicker.close();
          tableBtn.classList.remove("is-active");
        });

        return tableWrap;
      })(),
      quoteBtn,
      (function () {
        let mediaBtn = toolBtn(ICONS.media, "Insert media", function () {
          remember();
          showMediaBalloon(mediaBtn);
        });
        return mediaBtn;
      })(),
      sep(),
      ulBtn,
      olBtn,
      sep(),
      alignWrap,
    ]);

    let surface = el("div", { className: "fe-surface" }, [editor]);

    let footerEl = null;
    if (options.footerHtml) {
      let footerWrap = document.createElement("div");
      footerWrap.innerHTML = sanitizeHtml(options.footerHtml, securityOptions);
      footerEl = footerWrap.querySelector(".editor-footer") || footerWrap.firstElementChild;
      if (footerEl) {
        footerEl.setAttribute("contenteditable", "false");
        footerEl.setAttribute("data-fe-chrome", "footer");
        wordCountEl = footerEl.querySelector(".fe-wordcount");
        if (wordCountEl) wordCountEl.setAttribute("aria-live", "polite");
      }
    }

    root = el("div", { className: "fe", "data-custom-editor": "true" }, [
      toolbar,
      surface,
      footerEl,
      fileInput,
    ]);
    if (hidden) root.appendChild(hidden);

    if (textarea && mount.contains(textarea)) {
      Array.prototype.slice.call(mount.childNodes).forEach(function (child) {
        if (child !== textarea) mount.removeChild(child);
      });
      mount.insertBefore(root, textarea);
    } else {
      mount.innerHTML = "";
      mount.appendChild(root);
    }
    sync();
    resetHistory();
    document.addEventListener("keydown", onHistoryKeydown, true);

    function onSubmit(e) {
      if (destroyed) return;
      sync();
      if (!required) return;
      let text = (editor.textContent || "").replace(/\s+/g, "");
      let hasMedia = !!editor.querySelector("img,iframe,video,table");
      if (!text && !hasMedia) {
        e.preventDefault();
        editor.focus();
        root.classList.add("is-invalid");
      } else {
        root.classList.remove("is-invalid");
      }
    }

    let form = (textarea && textarea.form) || root.closest("form");
    if (form) form.addEventListener("submit", onSubmit);

    return {
      root: root,
      version: VERSION,
      getHTML: getHTML,
      setHTML: setHTML,
      focus: function () {
        editor.focus();
      },
      isFullscreen: function () {
        return isFullscreen;
      },
      setFullscreen: setFullscreen,
      toggleFullscreen: toggleFullscreen,
      destroy: function () {
        destroyed = true;
        closeTypingHistory();
        setFullscreen(false);
        deselectImage();
        deselectMedia();
        if (selectedImgObserver) selectedImgObserver.disconnect();
        document.removeEventListener("mousedown", onDocImageDeselect);
        document.removeEventListener("selectionchange", onSelectionChange);
        document.removeEventListener("keydown", onHistoryKeydown, true);
        if (activeImageDialog) activeImageDialog.close();
        if (activeLinkDialog) activeLinkDialog.close();
        document.removeEventListener("keydown", onFullscreenKeydown, true);
        if (form) form.removeEventListener("submit", onSubmit);
        if (textarea) {
          textarea.style.display = "";
          textarea.removeAttribute("aria-hidden");
          textarea.value = getHTML();
        }
        mount.innerHTML = "";
      },
    };
  }

  function replace(textarea, options) {
    options = options || {};
    let field = qs(textarea);
    if (!field) {
      throw new Error("FreeEditor.replace: textarea not found");
    }
    let wrap = el("div", { className: "fe-wrap" });
    field.parentNode.insertBefore(wrap, field);
    wrap.appendChild(field);
    options.textarea = field;
    return create(wrap, options);
  }


  function autoInit() {
    let nodes = document.querySelectorAll("textarea[data-custom-editor]");
    let instances = [];
    Array.prototype.forEach.call(nodes, function (node) {
      if (node.getAttribute("data-fe-ready")) return;
      node.setAttribute("data-fe-ready", "1");
      instances.push(
        replace(node, {
          placeholder: node.getAttribute("placeholder") || "Content",
        })
      );
    });
    return instances;
  }

  /**
   * CKEditor-style create.
   *
   * ClassicEditor.create({
   *   attachTo: document.querySelector('#editor'),
   *   root: { placeholder: 'Type here...' },
   *   uploadUrl: '/upload',
   *   csrf: '...'
   * })
   *
   * Also supports: ClassicEditor.create(element, config)
   *
   * @returns {Promise<object>} editor with getData/setData (and getHTML/setHTML)
   */
  function classicCreate(attachToOrConfig, maybeConfig) {
    return Promise.resolve().then(function () {
      let config;
      let attachTo;

      if (
        attachToOrConfig &&
        (attachToOrConfig.nodeType === 1 || typeof attachToOrConfig === "string")
      ) {
        attachTo = attachToOrConfig;
        config = maybeConfig || {};
      } else {
        config = attachToOrConfig || {};
        attachTo = config.attachTo;
      }

      if (typeof attachTo === "string") {
        attachTo = document.querySelector(attachTo);
      }
      if (!attachTo) {
        throw new Error("ClassicEditor.create: attachTo element not found");
      }

      const rawInitial =
        config.value != null
          ? config.value
          : config.initialData != null
            ? config.initialData
            : attachTo.innerHTML;
      const chrome = extractEditorChrome(rawInitial);
      const initial = chrome.contentHtml;
      const footerHtml =
        config.footerHtml != null ? config.footerHtml : chrome.footerHtml;
      const placeholder =
        (config.root && config.root.placeholder) ||
        config.placeholder ||
        "Type here...";

      attachTo.innerHTML = "";

      const instance = create(attachTo, {
        name: config.name || "content",
        id: config.id,
        value: initial,
        footerHtml: footerHtml,
        placeholder: placeholder,
        required: config.required,
        uploadUrl: config.uploadUrl,
        csrf: config.csrf,
        uploadImage: config.uploadImage,
        allowLocalImageFallback: config.allowLocalImageFallback,
        requireCsrf: config.requireCsrf,
        allowSvg: config.allowSvg,
        allowDataUrls: config.allowDataUrls,
        allowHtmlIframe: config.allowHtmlIframe,
        mediaHosts: config.mediaHosts,
        enabledVideoProviders: config.enabledVideoProviders,
        resolveTikTokShortUrl: config.resolveTikTokShortUrl,
        maxImageBytes: config.maxImageBytes,
        // Forwarded explicitly (FE-028). Dropping uploadUrlPrefix silently
        // disabled the FE-012 check for every integrator following the
        // documented production baseline, which uses this entry point.
        uploadUrlPrefix: config.uploadUrlPrefix,
        maxImagePixels: config.maxImagePixels,
        allowedClasses: config.allowedClasses,
        onChange: config.onChange,
      });

      instance.getData = function () {
        return instance.getHTML();
      };
      instance.setData = function (html) {
        instance.setHTML(html);
      };

      return instance;
    });
  }

  const FreeEditor = {
    version: VERSION,
    create: create,
    replace: replace,
    autoInit: autoInit,
    sanitizeHtml: sanitizeHtml,
    sanitizeUrl: sanitizeUrl,
    validateImageFile: validateImageFile,
    inspectImageContent: inspectImageContent,
    uploadImageFile: uploadImageFile,
    mergeSecurityOptions: mergeSecurityOptions,
    iframeSandboxForSrc: iframeSandboxForSrc,
    /** Build a sanitized provider embed from a URL, honouring the host allowlist. */
    mediaEmbed: mediaEmbed,
    mediaEmbedAsync: mediaEmbedAsync,
  };

  const ClassicEditor = {
    version: VERSION,
    create: classicCreate,
    sanitizeHtml: sanitizeHtml,
    sanitizeUrl: sanitizeUrl,
    validateImageFile: validateImageFile,
    iframeSandboxForSrc: iframeSandboxForSrc,
  };

  FreeEditor.ClassicEditor = ClassicEditor;

  if (typeof document !== "undefined") {
    bindProviderEmbedResize();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        autoInit();
      });
    } else {
      autoInit();
    }
  }

  return {
    FreeEditor: FreeEditor,
    ClassicEditor: ClassicEditor,
  };
});
