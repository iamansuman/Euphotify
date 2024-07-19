const NumberOfGIFs = 10;

/*
<div class="switch-container">
    <img src="../assets/gifs/1.gif" />
    <div class="spacer"></div>
    <label class="switch">
        <input type="radio" name="gif" class="gifSwitch" id="gif1">
        <span class="slider"></span>
    </label>
</div>
*/
console.log(Number(chrome.runtime.getURL('totalGIFs')));
for (let i = 1; i <= NumberOfGIFs; i++) {
    const div = document.createElement('div');
    div.classList.add('switch-container');
        const img = document.createElement('img');
        img.src = `../assets/gifs/${i}.gif`;
    div.appendChild(img);
        const spacer = document.createElement('div');
        spacer.classList.add('spacer');
    div.appendChild(spacer);
        const label = document.createElement('label');
        label.classList.add('switch');
            const gifSwitch = document.createElement('input');
            gifSwitch.type = 'radio';
            gifSwitch.name = 'gif';
            gifSwitch.classList.add('gifSwitch');
            gifSwitch.id = `gif${i}`;
            label.appendChild(gifSwitch);
            const slider = document.createElement('span');
            slider.classList.add('slider');
            label.appendChild(slider);
    div.appendChild(label);
    document.body.appendChild(div);
}

const gifSwitches = document.querySelectorAll('.gifSwitch');

window.addEventListener('DOMContentLoaded', async () => {
    for (let i=1; i<=gifSwitches.length; i++){
        // gifSwitches[i-1].checked = (await chrome.storage.sync.get([`gif${i}`]))[`gif${i}`]   //Uncomment this in 1.1.0
        gifSwitches[i-1].checked = (await chrome.storage.sync.get(['currGif']))['currGif'] == gifSwitches[i-1].id;
    }
});

for (const gifSwitch of gifSwitches){
    gifSwitch.addEventListener('change', () => {
        // chrome.storage.sync.set({ [gifSwitch.id]: gifSwitch.checked });  //Uncomment this in 1.1.0
        if (gifSwitch.checked){
            chrome.storage.sync.set({ 'currGif': gifSwitch.id });
            window.close();
        };
    });
}