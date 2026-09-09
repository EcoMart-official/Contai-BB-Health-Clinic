# Permanent Project Instructions & Constraints

## 1. Strictly English-Only Content Across Entire Website
- **NO foreign or regional language text**: Under no circumstances should Bengali, Hindi, or any language other than English be added or rendered on the website.
- **English Only**: All UI text, form labels, buttons, navigation links, error messages, placeholders, badges, modals, and notifications must be in clear, professional English.
- **No Bilingual Labels**: Avoid mixing English with other languages (e.g., do NOT write "Full Name (আপনার নাম)", use strictly "Full Name").

## 2. Prohibition of Browser Default alert() and confirm()
- **Never use `window.alert()`, `alert()`, `window.confirm()`, `confirm()`, or `prompt()`**:
  - Browser default alerts are blocked or broken in iframe environments and provide an unsightly user experience.
- **Always use the Custom In-App Alert and Dialog System**:
  - Use `useCustomAlert()` from `@/lib/alert-context` (or in-app custom modal components) for all user notifications, warnings, errors, and confirmation dialogs.
  - All alerts and confirms must feature the custom, high-contrast, accessible modal dialog with appropriate severity styling (info, success, warning, error).
