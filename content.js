function addDownloadButton(audioElement) {
  const src = audioElement.getAttribute('src');
  if (src && src.startsWith('/play?')) {
    const downloadUrl = `https://www.soundsnap.com${src}`;
    
    let iconSrc;
    try {
      // Check if chrome.runtime and getURL are available before calling
      if (!(chrome && chrome.runtime && chrome.runtime.getURL)) {
        console.warn('Download Assistant: chrome.runtime.getURL is not available. Cannot create download button. This might happen if the extension was reloaded or updated.');
        return; // Stop if runtime is not available
      }
      iconSrc = chrome.runtime.getURL('images/icon48.png');
    } catch (e) {
      if (e.message.toLowerCase().includes("extension context invalidated")) {
        console.warn('Download Assistant: Extension context invalidated. Cannot create download button. Please refresh the page if issues persist.');
        // Optionally, disconnect the observer if the context is gone for good
        // if (observer) observer.disconnect(); 
        return; // Stop if context is invalidated
      } else {
        console.error('Download Assistant: Error getting icon URL:', e);
        return; // Stop on other errors getting the icon
      }
    }

    const iconButton = document.createElement('img');
    iconButton.src = iconSrc;
    iconButton.alt = 'Download sound';
    iconButton.style.width = '24px'; 
    iconButton.style.height = '24px'; 
    iconButton.style.verticalAlign = 'middle';
    iconButton.style.marginRight = '5px'; // Space between icon and text

    const textLabel = document.createElement('span');
    textLabel.textContent = 'Download';
    textLabel.style.verticalAlign = 'middle';
    textLabel.style.fontSize = '12px'; // Optional: adjust font size

    const buttonContainer = document.createElement('span'); // Using span, styled as inline-block
    buttonContainer.style.display = 'inline-flex'; // Align items inline
    buttonContainer.style.alignItems = 'center'; // Vertically align icon and text
    buttonContainer.style.marginLeft = '10px';
    buttonContainer.style.cursor = 'pointer';
    buttonContainer.title = 'Download'; // Tooltip on the whole container

    buttonContainer.appendChild(iconButton);
    buttonContainer.appendChild(textLabel);

    buttonContainer.classList.add('soundsnap-download-button');

    buttonContainer.onclick = (event) => {
      event.stopPropagation(); 
      event.preventDefault(); 

      // Suggest a filename based on the URL
      const pathParts = downloadUrl.split('/');
      const suggestedFilename = pathParts[pathParts.length - 1].split('?')[0] || "sound.mp3";
      
      let userFilename = window.prompt("Enter filename (e.g., sound.mp3):", suggestedFilename);
      
      // If the user clicks "Cancel" or enters an empty name, don't proceed
      if (userFilename === null || userFilename.trim() === "") {
        console.log("Download cancelled by user or empty filename.");
        return;
      }

      // Basic sanitation: remove characters that are problematic in filenames
      // This is a simple example; more robust sanitation might be needed.
      userFilename = userFilename.replace(/[<>:"/\\|?*]+/g, '_');

      // Ensure it ends with .mp3 if it doesn't have an extension or has a different one
      if (!userFilename.toLowerCase().endsWith('.mp3')) {
        if (userFilename.includes('.')) { // has some extension
            userFilename = userFilename.substring(0, userFilename.lastIndexOf('.')) + '.mp3';
        } else { // no extension
            userFilename = userFilename + '.mp3';
        }
      }
      
      chrome.runtime.sendMessage({ action: 'download', url: downloadUrl, filename: userFilename });
    };
    
    // Try to insert the button next to the audio player controls
    // This might need adjustment based on the actual page structure
    if (audioElement.parentElement) {
      audioElement.parentElement.style.display = 'flex'; 
      audioElement.parentElement.style.alignItems = 'center';
      audioElement.insertAdjacentElement('afterend', buttonContainer);
    } else {
      // Fallback if parentElement is not found (less likely for audio tags)
      document.body.appendChild(buttonContainer); 
    }
  }
}

function findAudioElements() {
  const audioElements = document.querySelectorAll('audio');
  audioElements.forEach(audio => {
    // Check if a button container hasn't been added already by checking for a sibling with our class
    const existingButtonContainer = audio.parentElement ? audio.parentElement.querySelector('.soundsnap-download-button') : null;
    if (!audio.dataset.downloadButtonAdded && !existingButtonContainer) {
      addDownloadButton(audio);
      audio.dataset.downloadButtonAdded = 'true';
    }
  });
}

// Initial run
findAudioElements();

// Soundsnap might load content dynamically, so we use a MutationObserver
// to detect when new audio elements are added to the page.
const observer = new MutationObserver((mutationsList, observer) => {
  for(const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      // Check if new nodes include audio elements or elements that might contain them
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'AUDIO') {
            const existingButtonContainer = node.parentElement ? node.parentElement.querySelector('.soundsnap-download-button') : null;
            if (!node.dataset.downloadButtonAdded && !existingButtonContainer) {
              addDownloadButton(node);
              node.dataset.downloadButtonAdded = 'true';
            }
          } else {
            const nestedAudioElements = node.querySelectorAll('audio');
            nestedAudioElements.forEach(audio => {
               const existingButtonContainer = audio.parentElement ? audio.parentElement.querySelector('.soundsnap-download-button') : null;
               if (!audio.dataset.downloadButtonAdded && !existingButtonContainer) {
                addDownloadButton(audio);
                audio.dataset.downloadButtonAdded = 'true';
              }
            });
          }
        }
      });
    }
  }
});

// Start observing the document body for added nodes
console.log('Download Assistant content script loaded.');
// Check if observer is defined before trying to observe, in case of early context invalidation
if (typeof observer !== 'undefined' && observer) {
  observer.observe(document.body, { childList: true, subtree: true });
} else {
  console.warn("Download Assistant: MutationObserver not initialized, possibly due to early context invalidation.");
} 