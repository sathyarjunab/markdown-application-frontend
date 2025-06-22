# 📝 Markdown Previewer - Next.js

A full-featured **Markdown Previewer** built with **Next.js**, designed to convert markdown text into styled HTML in real time. This project includes custom markdown extensions like emoji support, checkboxes, superscripts, subscripts, warnings, and more — with clean, modular parsing logic.

---

## 🚀 Features

### ✅ Implemented

- ### Headings (`### Heading`)
- ✅ Task Checkboxes (`- [ ]`, `- [x]`)
- 🔘 Bulleted & Numbered Lists (`- item`, `1. item`)
- 🧹 Automatic `<br>` tag handling for multiple newlines
- 💻 Modular converter functions (`h3Convertor`, `checkboxConvertor`, etc.)
- 🛠️ Horizontal line or empty tag parsing

### ✨ Optional (Planned / Commented in Code)

- **Bold + Italic:** `***text***` → `<strong><em>text</em></strong>`
- **Bold:** `**text**` → `<strong>text</strong>`
- **Italic:** `_text_` → `<em>text</em>`
- **Strikethrough:** `~~text~~` → `<del>text</del>`
- **Inline Code:** `` `code` `` → `<code>code</code>`
- **Highlight:** `==text==` → `<mark>text</mark>`
- **Superscript:** `^(text)^` → `<sup>text</sup>`
- **Subscript:** `~(text)~` → `<sub>text</sub>`
- **Warning Text:** `!(text)!` → `<span class='warning'>text</span>`
- **Emoji Parsing:** `:smile:` → 😄 using `emojiMap`

---

## 🧠 Custom Syntax Examples

| Markdown | Rendered HTML |
|----------|----------------|
| `### Hello` | `<h3>Hello</h3>` |
| `- [x] Done` | ✅ Done |
| `^(2)^` | <sup>2</sup> |
| `~(index)~` | <sub>index</sub> |
| `:fire:` | 🔥 (from emojiMap) |
| `!(Be careful)!` | `<span class='warning'>Be careful</span>` |

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/markdown-previewer.git
cd markdown-previewer
