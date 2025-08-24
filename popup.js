document.addEventListener('DOMContentLoaded', () => {
  const changeFontButton = document.getElementById('changeFontButton');
  const addTaskButton = document.getElementById('addTaskButton');
  const startTimerButton = document.getElementById("startTimerButton")
  const resetTimerButton = document.getElementById("resetTimerButton")
  
  
  startTimerButton.addEventListener("click", () => {
    chrome.storage.local.get(["isRunning"], (res) => {
      chrome.storage.local.set({
        isRunning: !res.isRunning,
      }, () => {
        startTimerButton.textContent = !res.isRunning ? "Pause Timer" : "Start Timer"
      })
    })
  })

  resetTimerButton.addEventListener("click", () => {
    chrome.storage.local.set({
      timer: 0,
      isRunning: false,
    }, () => {
      startTimerButton.textContent = "Start Timer"
    })
  })

  function updateTime() {
    chrome.storage.local.get(["timer", "timeOption"], (res) => {
      const time = document.getElementById("time")
      const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0") // Fixing bug where 01:00 was displayed as 1:00
      let seconds = "00"  // Fixing bug where 25:00 was displayed as 25:60
      if (res.timer % 60 != 0) {
        seconds = `${60 - res.timer % 60}`.padStart(2, "0")
      }
      time.textContent = `${minutes}:${seconds}`
    })
  }

  updateTime()
  setInterval(updateTime, 1000)

  let tasks = []
  let isArial = false; // Toggle state for the font

  addTaskButton.addEventListener("click", () => addTask())

  chrome.storage.sync.get(["tasks"], (res) => {
    tasks = res.tasks ? res.tasks : []
    renderTasks()
  })

  function saveTasks () {
    chrome.storage.sync.set({
      tasks,
    })
  }

  function renderTask(taskNum) {
    const taskRow = document.createElement("div")

    const text = document.createElement("input")
    text.type = "text"
    text.placeholder = "Enter a task..."
    text.value = tasks[taskNum]
    text.addEventListener("change", () => {
      tasks[taskNum] = text.value
      saveTasks()
    })

    const deleteButton = document.createElement("input")
    deleteButton.type = "button"
    deleteButton.value = "X"
    deleteButton.addEventListener("click", () => {
      deleteTask(taskNum)
    })

    taskRow.appendChild(text)
    taskRow.appendChild(deleteButton)

    const taskContainer = document.getElementById("taskContainer")
    taskContainer.appendChild(taskRow)
  }

  function addTask() {
    const taskNum = tasks.length
    tasks.push("")
    renderTask(taskNum)
    saveTasks()
  }

  function deleteTask(taskNum) {
    tasks.splice(taskNum, 1)
    renderTasks()
    saveTasks()
  }

  function renderTasks() {
    const taskContainer = document.getElementById("taskContainer")
    taskContainer.textContent = ""
    tasks.forEach((taskText, taskNum) => {
      renderTask(taskNum)
    })
  }

  changeFontButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const url = currentTab.url;

      if (url.startsWith('http://') || url.startsWith('https://')) {
        chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          func: isArial ? resetToDefaultFont : changeFontToArial,
        });
        isArial = !isArial;
      } else {
        alert("This extension cannot modify this page.");
      }
    });
  });

  function changeFontToArial() {
    const walkDOM = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const originalText = node.nodeValue.trim();
        if (originalText.length > 0) {
          // Store original text in a custom attribute for later use
          const parent = node.parentNode;
          if (!parent.dataset.originalText) {
            parent.dataset.originalText = originalText;
          }

          // Apply bold formatting
          const words = originalText.split(" ");
          const formatted = words
            .map((word) => {
              const length = word.length;
              const boldLength =
                length >= 9
                  ? Math.floor(length / 3)
                  : length > 5
                  ? 3
                  : length > 3
                  ? 2
                  : 1;

              return `<b>${word.substring(0, boldLength)}</b>${word.substring(boldLength)}`;
            })
            .join(" ");

          parent.innerHTML = formatted;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walkDOM);
      }
    };

    document.body.style.fontFamily = "Arial, sans-serif";
    walkDOM(document.body);
  }

  function resetToDefaultFont() {
    const walkDOM = (node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.dataset.originalText) {
          // Restore the original text from the stored attribute
          node.innerHTML = node.dataset.originalText;
          delete node.dataset.originalText;
        } else {
          Array.from(node.childNodes).forEach(walkDOM);
        }
      }
    };

    document.body.style.fontFamily = "";
    walkDOM(document.body);
  }
});

