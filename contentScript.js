const NumberOfGIFs = 10;

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) return resolve(document.querySelector(selector));
        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });
        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, { childList: true, subtree: true });
    });
}

waitForElm('[data-testid=control-button-playpause]').then(async(playPauseBtn) => {
    if (playPauseBtn == null) alert("Euphotify may not work in this session :(\nIt's recommended to refresh the page");
    else {
        let gifSelector = (await chrome.storage.sync.get(['currGif']))['currGif'] || 'gif1';
        const gifURI = {};
        const pausedImg = chrome.runtime.getURL(`assets/paused.jpg`);
        for (let i = 1; i <= NumberOfGIFs; i++) gifURI[`gif${i}`] = chrome.runtime.getURL(`assets/gifs/${i}.gif`);

        function handlegifs(){
            if (playPauseBtn.ariaLabel == "Pause") playGif(true, gifURI[gifSelector], pausedImg);
            else playGif(false, gifURI[gifSelector], pausedImg);
        }

        chrome.storage.onChanged.addListener(async() =>{
            gifSelector = (await chrome.storage.sync.get(['currGif']))['currGif'];
            handlegifs();
        });

        const nowPlayingObserver = new MutationObserver(handlegifs);
        nowPlayingObserver.observe(playPauseBtn, { attributeFilter: ["aria-label"] });

        const coverArtImage0 = await waitForElm("[data-testid=cover-art-image]");
        new MutationObserver(() => {
            if (!coverArtImage0.src.includes('chrome-extension://')) handlegifs();
        }).observe(coverArtImage0, { attributeFilter: ["src"] });
    }
});

function playGif(play=false, gifURI, pausedImg){
    const albumArts = document.querySelectorAll("[data-testid=cover-art-image]");
    if (play && gifURI){
        for (const albumArt of albumArts) {
            albumArt.style.objectFit = 'contain';
            albumArt.src = gifURI;
            if (albumArt.style.background != `url('${chrome.runtime.getURL('assets/bg.gif')}')`) albumArt.style.background = `url('${chrome.runtime.getURL('assets/bg.gif')}')`
        }
    } else if (play == false && pausedImg) {
        for (const albumArt of albumArts){
            albumArt.style.objectFit = 'contain';
            albumArt.src = pausedImg;
            if (albumArt.style.background != `url('${chrome.runtime.getURL('assets/bg.gif')}')`) albumArt.style.background = `url('${chrome.runtime.getURL('assets/bg.gif')}')`
        }
    } else {
        for (const albumArt of albumArts){
            if (albumArt.src.includes('chrome-extension://')) albumArt.src = chrome.runtime.getURL('assets/albumArt.png')
        }
    }
}