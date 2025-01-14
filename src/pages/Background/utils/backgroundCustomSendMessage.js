export async function sendMessageToCurrentTab(data) {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  chrome.tabs.sendMessage(tab.id, data);
}

export async function sendMessageToTab(tabId, data, callback) {
  chrome.tabs.sendMessage(tabId, data, callback);
}

// if sendCurrent true, this function will broadcast to add tab, false won't broadcast to current tab
export async function broadCastMessage(data, sendCurrent) {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  chrome.tabs.query({}, function (tabs) {
    for (let tabItem of tabs) {
      if (sendCurrent) {
        chrome.tabs.sendMessage(tabItem.id, data);
      } else {
        if (tab.id !== tabItem.id) {
          chrome.tabs.sendMessage(tabItem.id, data);
        }
      }
    }
  });
}
export const querySendMessage = (msg, callback) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, msg, function (response) {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
      }
      callback(response);
    });
  });
};
