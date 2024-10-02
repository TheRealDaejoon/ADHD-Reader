document.addEventListener('DOMContentLoaded', () => {
  const changeFontButton = document.getElementById('changeFontButton');

  changeFontButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: changeFontToArial
      });
    });
  });

  function changeFontToArial() {
    // Change font for the whole document
    document.querySelectorAll('*').forEach((element) => {
      element.style.fontFamily = 'Arial';
    });
  }
});
