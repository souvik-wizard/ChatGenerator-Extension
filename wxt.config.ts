import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    "manifest_version": 3,
    "name": "Chat Generator",
    "version": "1.0.0",
    "description": "Auto generate chat messages based on the user's input",
    "permissions": ["tabs", "storage", "activeTab", "scripting"],
    "web_accessible_resources": [
      {
        "matches": ["*://*.linkedin.com/*"],
        "resources": ["icon/*.png"]
      }
    ]
  }
});
