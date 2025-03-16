# Moxfield OBS Chrome Extension

A Chrome extension that allows you to display the Moxfield battlefield in a separate window with a custom resolution for OBS or other streaming tools.

## Features
- Opens the Moxfield battlefield in a separate window
- Customize the window resolution to fit your streaming setup
- Real-time updates as the battlefield changes

## Development

### Prerequisites
- Node.js and npm

### Setup
1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```

### Build
Build the project with webpack:
```
npm run build
```

For development with sourcemaps:
```
npm run dev
```

For development with live recompilation:
```
npm run watch
```

### Loading the extension
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top-right corner
3. Click "Load unpacked" and select this directory
4. The extension icon will be visible in the toolbar when viewing a Moxfield goldfish page

## Usage
1. Navigate to a Moxfield deck page and click on the Goldfish tab
2. Click the extension icon in the Chrome toolbar
3. Set your desired window resolution and click "Launch"
4. The battlefield will open in a separate window that you can capture in OBS