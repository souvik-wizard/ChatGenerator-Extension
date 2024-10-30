# Installation

NODE VERSION SHOULD BE >= 18
<br>
- Clone the repository:

```bash
git clone https://github.com/souvik-wizard/LinkedEase.git
```
then do 

```bash
npm i
```

# Add your API key (Gemini API by Google)

```bash
/entrypoints/content.ts

const apiKey = "ENTER YOUR API KEY HERE";
```

# Start the server

```bash
npm run dev
```
# Build command to generate the file for Chrome

-Open another terminal

```bash
npm run build
```
- A build file will be generated with the same name
  
- Navigate to the Extensions page in Chrome by typing chrome://extensions in the address bar.

- Enable Developer Mode by toggling the switch in the upper right corner.

- Click on 'Load unpacked' and select the build generated folder.

- The extension should now appear in your list of extensions.

- Click on it and pin it for easy access. (Optional)
  
# Demo

https://github.com/user-attachments/assets/b9cb9aa1-423a-4a41-952b-452cfb32ed34
