const btnGen = document.getElementById('btn-generate');
const uiInput = document.getElementById('ui-input');
const uiResult = document.getElementById('ui-result');
const videoPlayer = document.getElementById('final-video');
const loader = document.querySelector('.loader');

btnGen.addEventListener('click', async () => {
    const prompt = document.getElementById('ai-prompt').value;
    if (!prompt) return alert("Please enter a prompt!");

    // UI change
    uiInput.style.display = 'none';
    uiResult.style.display = 'block';
    videoPlayer.style.display = 'none';
    loader.style.display = 'block';

    // Simulate API Delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Show Video
    loader.style.display = 'none';
    videoPlayer.src = "https://www.w3schools.com/html/mov_bbb.mp4"; 
    videoPlayer.style.display = 'block';
    videoPlayer.play();
});

document.getElementById('btn-download').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = videoPlayer.src;
    a.download = "generated_video.mp4";
    a.click();
});

document.getElementById('btn-back').addEventListener('click', () => {
    uiInput.style.display = 'block';
    uiResult.style.display = 'none';
});
