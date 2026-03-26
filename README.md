# TerminalX CSS

A minimal, classless CSS library for terminal-style UIs.

- **Geist + Geist Mono** fonts (sans for headings, mono for body)
- **Dark theme** inspired by Factory.ai's color scheme
- **Classless** — semantic HTML elements styled by default
- **Soft details** — rounded corners, subtle borders, smooth transitions
- **CSS variables** — fully customizable

## Usage

```html
<link rel="stylesheet" href="terminalx.css">
```

Write semantic HTML. No classes needed for base elements.

## Customization

Override CSS variables on `:root`:

```css
:root {
  --accent: #8b5cf6;    /* swap orange for purple */
  --bg: #111111;        /* slightly lighter background */
  --radius: 8px;        /* rounder corners */
}
```

## What's styled

All standard HTML elements: headings, paragraphs, links, lists, tables, forms, buttons, code blocks, blockquotes, details/summary, progress bars, figures, navigation, and `hr`.

Optional utility classes: `.btn-primary`, `.btn-ghost`, `.btn-error`, `.btn-block`, `.alert`, `.card`, `.text-sans`, `.text-mono`.
