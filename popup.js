document.addEventListener('DOMContentLoaded', () => {
  const changeFontButton = document.getElementById('changeFontButton');
  let isArial = false; // Variable to keep track of font toggle

  changeFontButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const url = currentTab.url;

      // Check if the URL is a valid web page and not a restricted page (e.g., chrome:// or about://)
      if (url.startsWith('http://') || url.startsWith('https://')) {
        // Toggle between Arial and default
        if (isArial) {
          chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            function: resetToDefaultFont
          });
        } else {
          chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            function: changeFontToArial
          });
        }
        isArial = !isArial; // Flip the state
      } else {
        alert("This extension cannot modify this page.");
      }
    });
  });
  
  function changeFontToArial() {
    document.querySelectorAll('*').forEach((element) => {
      element.style.fontFamily = 'Arial';
      element.style.fontWeight = 'bold';
    });
  }

  function resetToDefaultFont() {
    document.querySelectorAll('*').forEach((element) => {
      element.style.fontFamily = ''; // Resets to default font
      element.style.fontWeight = '';
    });
  }
});