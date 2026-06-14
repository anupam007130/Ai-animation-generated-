/**
 * AI Creator Studio - Core Application Logic
 * Implements architectural setup for advanced AI integrations.
 */

// --- 1. Utility & UI Modules ---
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
                
                // Update Buttons
                document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update Content
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.getElementById(targetId).classList.add('active');
            });
        });
    }

    switchView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(`view-${viewId}`).classList.add('active');
    }
}

// --- 2. AI Engine Mock Modules (To be connected to APIs later) ---
class AIEngine {
    static async simulateProcess(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static async generateScript(prompt) {
        await this.simulateProcess(2000);
        return `[Scene 1: Epic drone shot]\nNarrator: Throughout history, empires have risen and fallen...\n[Scene 2: Map zoom]\nNarrator: But none quite like Rome.`;
    }

    static async generateVoiceAndSync() {
        await this.simulateProcess(2500);
        return { voiceFile: "url_to_audio", lipSyncData: {} };
    }

    static async generateVideoScenes() {
        await this.simulateProcess(3500);
        return { videoUrl: "url_to_rendered_video" };
    }

    static async generateYouTubeMetadata(prompt) {
        await this.simulateProcess(1500);
        return {
            titles: [
                "The TRUTH About Ancient Rome 🏛️",
                "Why the Roman Empire ACTUALLY Fell...",
                "1 Minute History: Julius Caesar"
            ],
            description: "Discover the hidden secrets of Ancient Rome in this quick 60-second documentary! Don't forget to like and subscribe for more daily history shorts.\n\n#history #rome #education",
            hashtags: ["#History", "#AncientRome", "#Documentary", "#Shorts", "#ViralHistory"],
            seoScore: 98,
            thumbnailText: "ROME'S DARK SECRET"
        };
    }
}

// --- 3. App Controller ---
class AppController {
    constructor() {
        this.ui = new UIManager();
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('btn-generate').addEventListener('click', () => this.startGenerationFlow());
    }

    navigate(view) {
        this.ui.switchView(view);
    }

    async startGenerationFlow() {
        const promptInput = document.getElementById('ai-prompt').value;
        if (!promptInput.trim()) {
            alert("Please enter an idea or script to generate content.");
            return;
        }

        // Navigate to Loading
        this.navigate('loading');
        
        // Step elements
        const stScript = document.getElementById('step-script');
        const stVoice = document.getElementById('step-voice');
        const stVideo = document.getElementById('step-video');
        const stMeta = document.getElementById('step-metadata');

        // 1. Script Generation
        stScript.classList.add('active');
        const script = await AIEngine.generateScript(promptInput);
        stScript.classList.replace('active', 'done');
        stScript.innerHTML = '<i class="fa-solid fa-circle-check"></i> Script Generated';
        document.getElementById('gen-script-editor').value = script;

        // 2. Voice & Lip Sync
        stVoice.classList.add('active');
        await AIEngine.generateVoiceAndSync();
        stVoice.classList.replace('active', 'done');
        stVoice.innerHTML = '<i class="fa-solid fa-circle-check"></i> Voice Generated';

        // 3. Video Rendering
        stVideo.classList.add('active');
        await AIEngine.generateVideoScenes();
        stVideo.classList.replace('active', 'done');
        stVideo.innerHTML = '<i class="fa-solid fa-circle-check"></i> Video Rendered';

        // 4. Metadata & SEO Generation
        stMeta.classList.add('active');
        const metadata = await AIEngine.generateYouTubeMetadata(promptInput);
        stMeta.classList.replace('active', 'done');
        stMeta.innerHTML = '<i class="fa-solid fa-circle-check"></i> SEO & Metadata Ready';

        this.populateStudio(metadata);

        // Transition to Studio after short delay
        setTimeout(() => {
            this.navigate('studio');
            this.resetLoadingSteps([stScript, stVoice, stVideo, stMeta]);
        }, 1000);
    }

    populateStudio(metadata) {
        // Populate Titles
        const titleList = document.getElementById('gen-titles');
        titleList.innerHTML = '';
        metadata.titles.forEach(title => {
            titleList.innerHTML += `<li>${title} <i class="fa-regular fa-copy" style="color:var(--accent-primary); cursor:pointer;"></i></li>`;
        });

        // Populate Desc
        document.getElementById('gen-desc').innerText = metadata.description;

        // Populate Tags
        const tagCloud = document.getElementById('gen-tags');
        tagCloud.innerHTML = '';
        metadata.hashtags.forEach(tag => {
            tagCloud.innerHTML += `<span class="tag">${tag}</span>`;
        });

        // Populate Thumbnail Mockup
        document.getElementById('thumb-text').innerText = metadata.thumbnailText;
    }

    resetLoadingSteps(steps) {
        const originalText = [
            '<i class="fa-solid fa-pen-nib"></i> Writing Script...',
            '<i class="fa-solid fa-microphone"></i> Generating Voice & Lip Sync...',
            '<i class="fa-solid fa-film"></i> Rendering Animations...',
            '<i class="fa-solid fa-chart-line"></i> Generating SEO & Metadata...'
        ];
        steps.forEach((step, i) => {
            step.className = 'step';
            step.innerHTML = originalText[i];
        });
    }
}

// Initialize the Application
const app = new AppController();
