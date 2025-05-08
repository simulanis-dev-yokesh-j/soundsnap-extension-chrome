# Download Assistant - Soundsnap Chrome Extension

A simple Chrome extension to help download sound effects from [Soundsnap](https://www.soundsnap.com/).

## Features

*   Adds a "Download" button (icon + text) next to audio players on Soundsnap.
*   Prompts the user to choose a filename before downloading.
*   Ensures the downloaded file has an `.mp3` extension.
*   Uses dynamic content detection to add buttons to sounds loaded after initial page load.

## Installation

There are two ways to install the Download Assistant:

### Option 1: From a Release (Recommended for most users)

1.  Go to the [Releases page](https://github.com/simulanis-dev-yokesh-j/soundsnap-extension-chrome/releases) of this repository.
2.  Download the latest `Download-Assistant-Soundsnap-vX.X.X.zip` file (where X.X.X is the version number).
3.  Unzip the downloaded file to a permanent location on your computer (e.g., a folder named "DownloadAssistantExtension").
4.  Open Google Chrome and navigate to `chrome://extensions`.
5.  Enable "Developer mode" using the toggle switch in the top-right corner.
6.  Click the "Load unpacked" button that appears.
7.  Select the folder where you unzipped the extension files (e.g., "DownloadAssistantExtension").
8.  The "Download Assistant" extension should now be installed and active!

### Option 2: From Source (For developers or if you want the latest code)

1.  Clone this repository or download the source code as a ZIP file and unzip it.
    ```bash
    git clone https://github.com/simulanis-dev-yokesh-j/soundsnap-extension-chrome.git
    ```
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable "Developer mode" using the toggle switch in the top-right corner.
4.  Click the "Load unpacked" button.
5.  Select the directory where you cloned or unzipped the source code (the root folder containing `manifest.json`).
6.  The extension will be installed.

## How to Use

1.  Navigate to any page on [www.soundsnap.com](https://www.soundsnap.com/) that contains audio players.
2.  You will see a "Download" icon and text appear next to each audio player.
3.  Click the "Download" button/icon.
4.  A prompt will appear asking you to confirm or change the filename. The suggested filename is taken from the original audio URL.
5.  Enter your desired filename (ensure it ends with `.mp3` or the extension will attempt to add it) and click "OK".
6.  The sound file will be downloaded to your browser's default downloads location.

## Development

To make changes to the extension:

1.  Follow the "From Source" installation steps above.
2.  Modify the code (`content.js`, `background.js`, `manifest.json`, etc.).
3.  After saving your changes, go back to `chrome://extensions` and click the reload icon (a circular arrow) for the "Download Assistant" extension.
4.  Refresh the Soundsnap page to see your changes take effect.

## License

Please consider adding a license file to this repository (e.g., MIT, Apache 2.0). This tells others how they are permitted to use your code. You can create a `LICENSE` file in the root of your repository.

---

*This extension is not affiliated with Soundsnap.* 