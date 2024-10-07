document.addEventListener('DOMContentLoaded', () => {
  const changeFontButton = document.getElementById('changeFontButton');
  let isArial = false; // Variable to keep track of font toggle

  changeFontButton.addEventListener('click', () => { // when button is pressed
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => { // checking for tabs so it can only affect the chosen tab (idk, it affects all tabs anyway)
      const currentTab = tabs[0];
      const url = currentTab.url;

      // Check if the URL is a valid web page and not a restricted page (e.g., chrome:// or about://) can't do it on those for some reason
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
            function: changeFontToArial // Pass the function name, do NOT call it lol
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

    // applying walkDOM to apply the bold algorithm
    walkDOM(document.body);
  }

  function resetToDefaultFont() {
    document.querySelectorAll('*').forEach((element) => {
      element.style.fontFamily = ''; // Resets to default font family and weight
      element.style.fontWeight = '';
    });
  }

  function bold(text) {
    const words = text.split(" ");
    let result = ""; // Initialize an empty result string

    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      let length = word.length; // Get the length of the word
      let bold_length;

      // Determine the bold length based on the length of the word
      if (length >= 9) {
        bold_length = Math.floor(length / 3); // One-third of the length
      } else if (length > 5 && length < 9) {
        bold_length = 3; // First three letters bold
      } else if (length > 3 && length < 6) {
        bold_length = 2; // First two letters bold
      } else {
        bold_length = 1; // First letter bold for words with 3 or fewer letters
      }

      // creating formatted version (It just makes everything bold wtf)
      let formatted_word = "<b>" + word.substring(0, bold_length) + "</b>" + word.substring(bold_length);
      result += formatted_word + " "; // Append the formatted word to the result string
    }

    return result.trim(); // Return the formatted result
  }

  function walkDOM(node) {
    if (node.nodeType === 3) { // If it's a text node
      let originalText = node.nodeValue.trim();

      if (originalText.length > 0) {
        let parent = node.parentNode;
        parent.innerHTML = parent.innerHTML.replace(originalText, bold(originalText));
      }
    }

    // Recursively walk through the DOM
    node = node.firstChild;
    while (node) {
      walkDOM(node);
      node = node.nextSibling;
    }
  }
});
