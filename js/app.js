/**
 * AI Creator Studio - Advanced Fully Integrated Logic
 * Includes Real API Fetch Structure for Video Generation
 */

// --- 1. UI & Utilities Module ---
class UIManager {
    constructor() {
        this.initRipples();
        this.initThemeToggle();
        this.initNavigation();
        this.initTabs();
    }

    initRipples() {
        document.addEventListener('click', function(e) {
            const target = e.target.closest('.ripple');
            if (!target) return;
            const circle = document.createElement('span');
            const diameter = Math.max(target.clientWidth, target.clientHeight);
            const radius = diameter / 2;
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - target.getBoundingClientRect().left - radius}px`;
            circle.style.top = `${e.clientY - target.getBoundingClientRect().top - radius}px`;
            circle.classList.add('ripple-effect');
            target.appendChild(circle);
            setTimeout(() => circle.remove(), 600);
        });
    }

    initThemeToggle() {
        const toggleBtn = document.getElementById('theme-toggle');
        if(!toggleBtn) return;
        const body = document.body;
        toggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const icon = toggleBtn.querySelector('i');
            if(body.classList.contains('light-mode')) {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }

    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item[data-view]');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                app.navigate(item.dataset.view);
            });
        });
    }

    initTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.dataset.target;
                document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.getElementById(targetId).classList.add('active');
            });
        });
    }
}

// --- 2. AI Engine Module (API Connection Point) ---
class AIEngine {
    // Simulates API processing time for UI (Script & Voice)
    static async simulateTask(ms, stepElement, progressCallback) {
        let elapsed = 0;
        const interval = 100;
        return new Promise(resolve => {
            const timer = setInterval(() => {
                elapsed += interval;
                let percent = Math.min(100, Math.floor((elapsed / ms) * 100));
                if (progressCallback) progressCallback(percent);
                if (stepElement) stepElement.querySelector('span').innerText = `${percent}%`;
                
                if (elapsed >= ms) {
                    clearInterval(timer);
                    resolve();
                }
            }, interval);
        });
    }

    // REAL VIDEO GENERATION PIPELINE
    static async generateVideo(prompt, stepElement, progressCallback) {
        // UI Loading effect
        if (progressCallback) progressCallback(20);
        if (stepElement) stepElement.querySelector('span').innerText = `20%`;

        try {
            // =================================================================
            // 🚀 REAL API INTEGRATION AREA
            // Replace 'YOUR_BACKEND_API_URL' with your actual server URL or AI API
            // =================================================================
            const API_URL = 'https://api.yourbackend.com/generate-video'; // <-- YAHAN APNA API URL DALEIN
            
            // Simulating a network request delay so the UI doesn't jump instantly during testing
            await new Promise(r => setTimeout(r, 2500)); 
            if (progressCallback) progressCallback(60);
            if (stepElement) stepElement.querySelector('span').innerText = `60%`;

            // Attempting to fetch from the real API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer YOUR_API_KEY' // Agar API key required hai
                },
                body: JSON.stringify({ 
                    idea: prompt,
                    format: document.getElementById('video-format').value,
                    duration: document.getElementById('video-duration').value || 'auto',
                    language: document.getElementById('video-lang').value || 'auto'
                })
            });

            if (!response.ok) {
                throw new Error("API Request Failed or Not Configured");
            }

            const data = await response.json();
            
            if (progressCallback) progressCallback(100);
            if (stepElement) stepElement.querySelector('span').innerText = `100%`;

            // API se aane wali real video ka URL
            return { videoUrl: data.videoUrl }; 

        } catch (error) {
            console.warn("⚠️ API Connection Error (Using Fallback):", error.message);
            
            // FALLBACK SYSTEM: Jab tak API connect nahi hoti, app crash na ho
            if (progressCallback) progressCallback(100);
            if (stepElement) stepElement.querySelector('span').innerText = `100%`;
            
            app.showToast("API not connected. Showing sample video for preview.", "warning");
            
            return { videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" }; 
        }
    }

    static generateMetadata(prompt) {
        return {
            script: `[SCENE 1: Intro]\nNarrator: Welcome to this video about: ${prompt}\n\n[SCENE 2: Main Context]\nNarrator: Let's dive deeper into this fascinating topic...`,
            titles: [
                `The Truth About ${prompt.substring(0, 20)}... 😱`, 
                "The Ultimate Guide (2026)", 
                "Why You've Been Doing It Wrong..."
            ],
            description: `Here is your amazing AI-generated video based on the prompt: "${prompt}". Don't forget to like and subscribe!\n\nAuto-generated by AI Studio.`,
            hashtags: ["#Trending", "#AIStudio", "#ViralVideo", "#" + prompt.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '')],
            thumbnailText: prompt.substring(0, 15).toUpperCase() + "!"
        };
    }
}

// --- 3. Main App Controller ---
class AppController {
    constructor() {
        this.ui = new UIManager();
        this.bindEvents();
        this.loadDraft();
    }

    bindEvents() {
        const generateBtn = document.getElementById('btn-generate');
        if(generateBtn) generateBtn.addEventListener('click', () => this.startGenerationFlow());

        const promptInput = document.getElementById('ai-prompt');
        if(promptInput) promptInput.addEventListener('input', () => this.saveDraft());

        const downloadBtn = document.getElementById('btn-download');
        if(downloadBtn) downloadBtn.addEventListener('click', () => this.downloadMP4());
    }

    saveDraft() {
        const promptText = document.getElementById('ai-prompt').value;
        localStorage.setItem('ai_studio_draft', promptText);
    }

    loadDraft() {
        const draft = localStorage.getItem('ai_studio_draft');
        if(draft && document.getElementById('ai-prompt')) {
            document.getElementById('ai-prompt').value = draft;
        }
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'fa-check-circle';
        if(type === 'error') icon = 'fa-circle-exclamation';
        if(type === 'warning') icon = 'fa-triangle-exclamation';

        toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }

    updateMainProgress(percent) {
        document.getElementById('main-progress-bar').style.width = `${percent}%`;
        document.getElementById('progress-percentage').innerText = `${Math.floor(percent)}%`;
    }

    async startGenerationFlow() {
        const promptInput = document.getElementById('ai-prompt').value;
        if (!promptInput.trim()) {
            this.showToast("Please enter a prompt first.", "error");
            return;
        }

        try {
            this.navigate('loading');
            this.updateMainProgress(0);
            
            const stScript = document.getElementById('step-script');
            const stVoice = document.getElementById('step-voice');
            const stVideo = document.getElementById('step-video');
            const stMeta = document.getElementById('step-metadata');

            // 1. Script Generation (0 - 25%)
            stScript.className = 'step active';
            await AIEngine.simulateTask(1500, stScript, (p) => this.updateMainProgress(p * 0.25));
            stScript.classList.replace('active', 'done');

            // 2. Voice Generation (25 - 50%)
            stVoice.className = 'step active';
            await AIEngine.simulateTask(2000, stVoice, (p) => this.updateMainProgress(25 + (p * 0.25)));
            stVoice.classList.replace('active', 'done');

            // 3. Video Rendering API Call (50 - 85%)
            stVideo.className = 'step active';
            const videoData = await AIEngine.generateVideo(promptInput, stVideo, (p) => this.updateMainProgress(50 + (p * 0.35)));
            this.currentVideoUrl = videoData.videoUrl;
            stVideo.classList.replace('active', 'done');

            // 4. Metadata (85 - 100%)
            stMeta.className = 'step active';
            await AIEngine.simulateTask(1000, stMeta, (p) => this.updateMainProgress(85 + (p * 0.15)));
            stMeta.classList.replace('active', 'done');
            
            const metadata = AIEngine.generateMetadata(promptInput);
            this.populateStudio(metadata);

            this.updateMainProgress(100);
            this.showToast("Process Completed!");

            // Setup Video Player
            const player = document.getElementById('final-video-player');
            const fallback = document.getElementById('video-fallback');
            
            if(this.currentVideoUrl) {
                player.src = this.currentVideoUrl;
                player.classList.remove('hidden');
                fallback.classList.add('hidden');
            } else {
                player.classList.add('hidden');
                fallback.classList.remove('hidden');
            }

            setTimeout(() => {
                this.navigate('studio');
                localStorage.removeItem('ai_studio_draft');
            }, 1000);

        } catch (error) {
            console.error(error);
            this.showToast("Generation failed. Please try again.", "error");
            this.navigate('create');
        }
    }

    populateStudio(metadata) {
        document.getElementById('gen-script-editor').value = metadata.script;
        
        const titleList = document.getElementById('gen-titles');
        titleList.innerHTML = '';
        metadata.titles.forEach(title => {
            titleList.innerHTML += `<li>${title}</li>`;
        });

        document.getElementById('gen-desc').innerText = metadata.description;
        
        const tagCloud = document.getElementById('gen-tags');
        tagCloud.innerHTML = '';
        metadata.hashtags.forEach(tag => {
            tagCloud.innerHTML += `<span class="tag">${tag}</span>`;
        });

        document.getElementById('thumb-text').innerText = metadata.thumbnailText;
    }

    // Advanced MP4 Download logic
    async downloadMP4() {
        if (!this.currentVideoUrl) {
            this.showToast("No video available to download", "error");
            return;
        }

        const btn = document.getElementById('btn-download');
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Downloading...`;
        btn.disabled = true;

        try {
            const response = await fetch(this.currentVideoUrl);
            if (!response.ok) throw new Error("Network response failed");
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `AI_Studio_Output_${Date.now()}.mp4`;
            document.body.appendChild(a);
            
            a.click();
            
            window.URL.revokeObjectURL(url);
            a.remove();
            
            this.showToast("Download Complete!", "success");
        } catch (error) {
            console.error("Download Error:", error);
            window.open(this.currentVideoUrl, '_blank');
            this.showToast("Opened in new tab to download.", "success");
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    copyToClipboard(elementId) {
        const el = document.getElementById(elementId);
        const text = el.innerText || el.value;
        if(!text) return;

        navigator.clipboard.writeText(text).then(() => {
            this.showToast("Copied to clipboard!");
        }).catch(() => {
            this.showToast("Failed to copy", "error");
        });
    }

    navigate(view) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(`view-${view}`).classList.add('active');
        
        if(view === 'create') {
            document.getElementById('main-progress-bar').style.width = '0%';
            document.getElementById('progress-percentage').innerText = '0%';
            document.querySelectorAll('.step').forEach(s => {
                s.className = 'step';
                s.querySelector('span').innerText = '0%';
            });
        }
    }
}

// Initialize App
const app = new AppController();
