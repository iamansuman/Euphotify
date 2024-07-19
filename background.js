chrome.runtime.onInstalled.addListener((details) => {
    if(details.reason == "install"){
        chrome.storage.sync.set({ 'gif1': true });
        chrome.storage.sync.set({ 'totalGIFs': 7 });
    }
});