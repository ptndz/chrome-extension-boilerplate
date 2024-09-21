chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  let [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (request.action === 'action') {
    console.log(request.data);

    return true;
  }
});
