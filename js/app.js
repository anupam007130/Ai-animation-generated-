class App {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('btn-generate').onclick = () => this.startGeneration();
        document.getElementById('btn-download').onclick = () => this.download();
    }

    async startGeneration() {
        this.navigate('loading');
        const bar = document.getElementById('main-progress-bar');
        const text = document.getElementById('progress-text');
        
        // Simulating AI Pipeline
        for(let i=0; i<=100; i+=20) {
            bar.style.width = i + '%';
            text.innerText = "Processing: " + i + "%";
            await new Promise(r => setTimeout(r, 800));
        }

        // Show Video
        const player = document.getElementById('final-video-player');
        player.src = "https://www.w3schools.com/html/mov_bbb.mp4"; // Yahan apka generated video URL aayega
        this.navigate('studio');
        
        // Mobile Safe Play
        try {
            await player.play();
        } catch(e) {
            console.log("Browser blocked autoplay, user must click play.");
        }
    }

    download() {
        const player = document.getElementById('final-video-player');
        const a = document.createElement('a');
        a.href = player.src;
        a.download = "ai-video.mp4";
        a.click();
    }

    navigate(view) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('view-' + view).classList.add('active');
    }
}

const app = new App();
