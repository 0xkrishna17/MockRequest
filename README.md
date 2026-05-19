# ProxyMocker ⚡️

**ProxyMocker** is a developer tool designed to provide a single source of truth for API data during frontend development. It intercepts network calls and serves mock data directly from your browser's `localStorage`, allowing you to build and test features without a live backend.

## 🚀 Key Features

- **Project Groups**: Organize your mocks by grouping them under "Projects." Each project can be mapped to multiple base URLs (e.g., `https://api.dev.com` and `http://localhost:4000`).
- **Granular Mocks**: Define specific overrides for individual endpoints with custom status codes, methods (GET, POST, etc.), and response bodies.
- **Global JSON Store (Database)**: Instead of mocking every endpoint, create a large JSON object. ProxyMocker automatically maps URL paths to keys in this object (e.g., `/users/profiles` maps to `db.users.profiles`).
- **Flexible Editor**: Supports standard JSON and lenient JavaScript-style object literals (unquoted keys, single quotes) for quick pasting.
- **Live Playground**: Test your interception logic directly within the app before applying it to your main project.
- **Automatic Interception**: Simply copy the generated script into your app's entry point to start mocking instantly.

## 🛠 How to Use

1. **Create a Group**: Add a new project and define your API's **Base URLs**.
2. **Setup Data**:
   - Use the **Mocks** tab for specific endpoint overrides (takes precedence).
   - Use the **Database** tab to provide a large JSON blob that covers multiple resource paths automatically.
3. **Get the Script**: Go to the **Config** tab and copy the "Interception Script."
4. **Integrate**: Paste the script at the very top of your application's entry point (e.g., `main.ts` or `index.js`).
5. **Develop**: Refresh your app. All matching network requests will now be served from ProxyMocker.

## 👨‍💻 Integration Example

Paste this into your app's entry point:

```javascript
// At the top of your index.js / main.ts
const ORIGINAL_FETCH = window.fetch;
window.fetch = async (url, options = {}) => {
  // ProxyMocker logic here...
  // (Copy the full script from the ProxyMocker Config tab)
};
```

## 🏗 Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Motion
- **Icons**: Lucide React
- **Storage**: Browser localStorage (Persistence across sessions)

---
Built with Google AI Studio 🛡️
