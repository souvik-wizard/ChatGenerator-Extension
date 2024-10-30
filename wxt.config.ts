import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    "manifest_version": 3,
    "name": "LinkedEase",
    "version": "1.0",
    "description": "This Chrome extension auto-generates chats for your LinkedIn messages based on user input.",
    "permissions": ["tabs", "storage", "activeTab", "scripting"],
    "web_accessible_resources": [
      {
        "matches": ["*://*.linkedin.com/*"],
        "resources": ["icon/*.png"]
      }
    ]
  }
});
