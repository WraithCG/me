const AppState = {
    currentTheme: 'royal', // Base fallback
    currentSection: 'home',
    isMenuOpen: false,
    isLoaded: false,
    projectIndex: 0,
    projectMediaIndex: 0,
    serviceIndex: 0,
    serviceMediaIndex: 0
};

document.addEventListener('DOMContentLoaded', () => {
    renderDynamicContent();
    initializeApp();
});

function initializeApp() {
    loadPreferences();
    initTheme();
    initNavigation();
    initScrollEffects();
    initFormHandlers();
    initMobileMenu();
    generateParticles();
    initLightboxes();
    initLoaderAnimation();
    AppState.isLoaded = true;
}

// --- Loader Animation ---
function initLoaderAnimation() {
    const loader = document.getElementById('loader');
    const loaderPercent = document.getElementById('loaderPercent');
    if (!loader || !loaderPercent) return;
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            setTimeout(() => {
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: loader,
                        opacity: [1, 0],
                        duration: 500,
                        easing: 'easeInOutQuad',
                        complete: () => loader.classList.add('hidden')
                    });
                } else {
                    loader.classList.add('hidden');
                }
            }, 300);
        }
        loaderPercent.textContent = Math.floor(progress) + '%';
    }, 100);
}

// --- Navigation & Scroll Spy ---
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({ top: targetSection.offsetTop - 80, behavior: 'smooth' });
                if (AppState.isMenuOpen) toggleMobileMenu();
            }
        });
    });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', updateHeaderOnScroll);
}

function handleScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + (window.innerHeight / 3);
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            AppState.currentSection = sectionId;
            updateActiveNavLink(sectionId);
        }
    });
}

function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) link.classList.add('active');
    });
}

function updateHeaderOnScroll() {
    const header = document.querySelector('.main-header');
    if (header) {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    }
}

// --- Lightbox Core Functionality ---
function initLightboxes() {
    // Background click closing
    document.querySelectorAll('.lightbox').forEach(lb => {
        lb.addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox')) closeLightboxes();
        });
    });

    // Project Navigation Bindings
    document.getElementById('projNavPrev')?.addEventListener('click', () => navigateProject(-1));
    document.getElementById('projNavNext')?.addEventListener('click', () => navigateProject(1));
    document.getElementById('projMediaPrev')?.addEventListener('click', () => changeProjectMedia(-1));
    document.getElementById('projMediaNext')?.addEventListener('click', () => changeProjectMedia(1));

    // Service Navigation Bindings
    document.getElementById('srvNavPrev')?.addEventListener('click', () => navigateService(-1));
    document.getElementById('srvNavNext')?.addEventListener('click', () => navigateService(1));
    document.getElementById('srvMediaPrev')?.addEventListener('click', () => changeServiceMedia(-1));
    document.getElementById('srvMediaNext')?.addEventListener('click', () => changeServiceMedia(1));
}

function closeLightboxes() {
    document.querySelectorAll('.lightbox').forEach(lb => lb.classList.remove('active'));
    document.body.style.overflow = ''; 
    // Stop videos
    document.getElementById('projectMedia').innerHTML = '';
    document.getElementById('srvMedia').innerHTML = '';
}

// Coordinate-based Image Zoom logic
function handleZoom(e) {
    const img = e.target;
    if (img.classList.contains('zoomed')) {
        img.classList.remove('zoomed');
        img.style.transform = 'scale(1)';
    } else {
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const originX = (x / rect.width) * 100;
        const originY = (y / rect.height) * 100;
        
        img.style.transformOrigin = `${originX}% ${originY}%`;
        img.classList.add('zoomed');
        img.style.transform = 'scale(2.5)';
    }
}

// --- Project Lightbox ---
function openProject(index) {
    if (typeof portfolioData === 'undefined' || !portfolioData.projects[index]) return;
    
    AppState.projectIndex = index;
    AppState.projectMediaIndex = 0; 
    
    const project = portfolioData.projects[index];
    const lb = document.getElementById('projectLightbox');
    
    document.getElementById('proj-title').textContent = project.title;
    document.getElementById('proj-desc').innerHTML = `<p>${project.desc}</p>`;
    document.getElementById('proj-date').textContent = project.date || 'N/A';
    document.getElementById('proj-role').textContent = project.role || 'Freelancer';
    
    document.getElementById('proj-tags').innerHTML = project.tags ? project.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';

    const feats = document.getElementById('project-features');
    if (project.features && project.features.length > 0) {
        feats.innerHTML = `<h4>Project Scope</h4><ul>${project.features.map(f => `<li><i class="fas fa-check"></i> <span>${f}</span></li>`).join('')}</ul>`;
    } else {
        feats.innerHTML = '';
    }
    
    renderProjectMedia();

    const actions = document.getElementById('proj-actions');
    let linksHtml = '';
    if (project.links) {
        if (project.links.github) linksHtml += `<a href="${project.links.github}" target="_blank" class="btn btn-secondary"><i class="fas fa-code-branch"></i> Source</a>`;
        if (project.links.live) linksHtml += `<a href="${project.links.live}" target="_blank" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> Live View</a>`;
    }
    actions.innerHTML = linksHtml;

    lb.classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function renderProjectMedia() {
    const project = portfolioData.projects[AppState.projectIndex];
    const mediaContainer = document.getElementById('projectMedia');
    const prev = document.getElementById('projMediaPrev');
    const next = document.getElementById('projMediaNext');
    const dots = document.getElementById('projMediaDots');
    
    if (!project.media || project.media.length === 0) {
        if (project.thumbnail) {
            mediaContainer.innerHTML = `<img src="${project.thumbnail}" alt="${project.title}" class="zoomable-image" onclick="handleZoom(event)">`;
        } else {
            mediaContainer.innerHTML = `<i class="fas ${project.icon || 'fa-project-diagram'} fa-10x" style="opacity:0.2; color: var(--primary);"></i>`;
        }
        prev.style.display = 'none'; next.style.display = 'none'; dots.innerHTML = ''; return;
    }
    
    const curr = project.media[AppState.projectMediaIndex];
    if (curr.type === 'video') {
        mediaContainer.innerHTML = `<iframe src="${curr.url}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    } else {
        mediaContainer.innerHTML = `<img src="${curr.url}" alt="${project.title}" class="zoomable-image" onclick="handleZoom(event)">`;
    }
    
    if (project.media.length > 1) {
        prev.style.display = 'flex'; next.style.display = 'flex';
        dots.innerHTML = project.media.map((_, i) => `<div class="media-dot ${i === AppState.projectMediaIndex ? 'active' : ''}" onclick="setProjectMedia(${i})"></div>`).join('');
    } else {
        prev.style.display = 'none'; next.style.display = 'none'; dots.innerHTML = '';
    }
}

function changeProjectMedia(dir) {
    const project = portfolioData.projects[AppState.projectIndex];
    if (!project.media || project.media.length <= 1) return;
    AppState.projectMediaIndex += dir;
    if (AppState.projectMediaIndex >= project.media.length) AppState.projectMediaIndex = 0;
    if (AppState.projectMediaIndex < 0) AppState.projectMediaIndex = project.media.length - 1;
    renderProjectMedia();
}

function setProjectMedia(idx) { AppState.projectMediaIndex = idx; renderProjectMedia(); }

function navigateProject(dir) {
    let newIndex = AppState.projectIndex + dir;
    if (newIndex >= portfolioData.projects.length) newIndex = 0;
    if (newIndex < 0) newIndex = portfolioData.projects.length - 1;
    openProject(newIndex);
}

// --- Service Lightbox ---
function openService(index) {
    if (typeof portfolioData === 'undefined' || !portfolioData.services[index]) return;
    
    AppState.serviceIndex = index;
    AppState.serviceMediaIndex = 0; 
    
    const service = portfolioData.services[index];
    const lb = document.getElementById('serviceLightbox');
    
    document.getElementById('srv-title').textContent = service.title;
    document.getElementById('srv-icon').className = `fas ${service.icon}`;
    document.getElementById('srv-desc').innerHTML = `<p>${service.extendedDesc || service.desc}</p>`;
    
    renderServiceMedia();

    lb.classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function renderServiceMedia() {
    const service = portfolioData.services[AppState.serviceIndex];
    const mediaContainer = document.getElementById('srvMedia');
    const prev = document.getElementById('srvMediaPrev');
    const next = document.getElementById('srvMediaNext');
    const dots = document.getElementById('srvMediaDots');
    
    if (!service.images || service.images.length === 0) {
        mediaContainer.innerHTML = `<i class="fas ${service.icon}" style="font-size: 10rem; opacity:0.2; color: var(--primary);"></i>`;
        prev.style.display = 'none'; next.style.display = 'none'; dots.innerHTML = ''; return;
    }
    
    mediaContainer.innerHTML = `<img src="${service.images[AppState.serviceMediaIndex]}" alt="${service.title}" class="zoomable-image" onclick="handleZoom(event)">`;
    
    if (service.images.length > 1) {
        prev.style.display = 'flex'; next.style.display = 'flex';
        dots.innerHTML = service.images.map((_, i) => `<div class="media-dot ${i === AppState.serviceMediaIndex ? 'active' : ''}" onclick="setServiceMedia(${i})"></div>`).join('');
    } else {
        prev.style.display = 'none'; next.style.display = 'none'; dots.innerHTML = '';
    }
}

function changeServiceMedia(dir) {
    const service = portfolioData.services[AppState.serviceIndex];
    if (!service.images || service.images.length <= 1) return;
    AppState.serviceMediaIndex += dir;
    if (AppState.serviceMediaIndex >= service.images.length) AppState.serviceMediaIndex = 0;
    if (AppState.serviceMediaIndex < 0) AppState.serviceMediaIndex = service.images.length - 1;
    renderServiceMedia();
}

function setServiceMedia(idx) { AppState.serviceMediaIndex = idx; renderServiceMedia(); }

function navigateService(dir) {
    let newIndex = AppState.serviceIndex + dir;
    if (newIndex >= portfolioData.services.length) newIndex = 0;
    if (newIndex < 0) newIndex = portfolioData.services.length - 1;
    openService(newIndex);
}

// --- Dynamic Rendering ---
function renderDynamicContent() {
    if (typeof portfolioData === 'undefined') return;

    // Personal & Social Links
    if (portfolioData.personal) {
        const socials = portfolioData.personal.socials;
        if (socials) {
            document.querySelectorAll('.discord-link').forEach(el => el.href = socials.discordServer);
            document.querySelectorAll('.instagram-link').forEach(el => el.href = socials.instagram);
            document.querySelectorAll('.reddit-link').forEach(el => el.href = socials.reddit);
            document.querySelectorAll('.fab-link').forEach(el => el.href = socials.fab);
            
            const discordDm = document.querySelector('.discord-dm-link');
            if (discordDm) discordDm.href = socials.discordDm;
        }

        const emailLink = document.querySelector('.contact-email');
        if (emailLink) { emailLink.href = `mailto:${portfolioData.personal.email}`; emailLink.textContent = portfolioData.personal.email; }
        
        const statusBadge = document.getElementById('availabilityStatus');
        if (statusBadge) statusBadge.textContent = portfolioData.personal.status || "Available";
        
        const formKey = document.getElementById('web3formsKey');
        if (formKey) formKey.value = portfolioData.personal.web3formsKey || "";
    }
    
    // Text blocks
    if (document.querySelector('.hero-title .title-text')) document.querySelector('.hero-title .title-text').textContent = portfolioData.hero.title;
    if (document.querySelector('.hero-description')) document.querySelector('.hero-description').textContent = portfolioData.hero.description;
    if (document.querySelector('.about-text')) document.querySelector('.about-text').textContent = portfolioData.about.text;
    
    // Stats
    if (portfolioData.about) {
        const counts = { '.projects-count': 'projectsDelivered', '.repeat-clients': 'repeatClients', '.client-rating': 'clientRating' };
        Object.keys(counts).forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.setAttribute('data-count', portfolioData.about[counts[selector]]);
        });
    }

    // Services (Click to open Service Lightbox)
    const servicesGrid = document.getElementById('servicesGrid');
    if (servicesGrid && portfolioData.services) {
        servicesGrid.innerHTML = portfolioData.services.map((service, index) => `
            <div class="service-card glass-panel fade-in" onclick="openService(${index})">
                <div class="service-icon"><i class="fas ${service.icon}"></i></div>
                <h3 class="service-title">${service.title}</h3>
                <p class="service-desc">${service.desc}</p>
                <span class="service-cta">View Details <i class="fas fa-arrow-right"></i></span>
            </div>
        `).join('');
    }

    // Testimonials
    const testGrid = document.getElementById('testimonialsGrid');
    if (testGrid && portfolioData.testimonials) {
        testGrid.innerHTML = portfolioData.testimonials.map(review => `
            <div class="testimonial-card glass-panel fade-in">
                <i class="fas fa-quote-left quote-icon"></i>
                <p class="testimonial-text">"${review.quote}"</p>
                <div class="testimonial-author">
                    <div class="author-info">
                        <h4 class="author-name">${review.client}</h4>
                        <span class="author-role">${review.role}</span>
                    </div>
                    <div class="stars">
                        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Projects Grid
    const projContainer = document.querySelector('.projects-grid');
    if (projContainer && portfolioData.projects) {
        projContainer.innerHTML = portfolioData.projects.map((proj, index) => `
            <div class="project-card glass-panel fade-in" onclick="openProject(${index})">
                <div class="project-image">
                    <div class="project-overlay">
                        <div class="project-links">
                            <span class="project-link"><i class="fas fa-expand-alt"></i></span>
                        </div>
                    </div>
                    ${proj.thumbnail ? `<img src="${proj.thumbnail}" alt="${proj.title}" style="width:100%; height:100%; object-fit:cover;">` : `<div class="project-placeholder"><i class="fas ${proj.icon || 'fa-code'}"></i></div>`}
                </div>
                <div class="project-content">
                    <h3 class="project-title">${proj.title}</h3>
                    <p class="project-description">${proj.desc.substring(0, 110)}...</p>
                    <div class="project-tags">
                        ${proj.tags ? proj.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// --- Web3Forms Handler Integration ---
function initFormHandlers() {
    const form = document.getElementById('contactForm');
    const result = document.getElementById('formResult');
    const submitText = document.getElementById('submitText');
    const submitIcon = document.getElementById('submitIcon');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        submitText.textContent = "Sending Inquiry...";
        submitIcon.className = "fas fa-spinner fa-spin";
        result.style.display = "none";

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                result.innerHTML = "Inquiry sent successfully! I will get back to you shortly.";
                result.style.color = "var(--green)";
                result.style.display = "block";
                form.reset();
            } else {
                result.innerHTML = json.message;
                result.style.color = "red";
                result.style.display = "block";
            }
        })
        .catch(error => {
            result.innerHTML = "Something went wrong! Please email directly.";
            result.style.color = "red";
            result.style.display = "block";
        })
        .then(function() {
            submitText.textContent = "Submit Inquiry";
            submitIcon.className = "fas fa-paper-plane";
            setTimeout(() => { result.style.display = "none"; }, 6000);
        });
    });
}

// --- Theme & General Setup ---
function loadPreferences() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) AppState.currentTheme = savedTheme;
}

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    setTheme(AppState.currentTheme);
}

function toggleTheme() {
    const themes = ['dark', 'cosmic', 'cyberpunk', 'royal', 'metal', 'hc-gold'];
    const currentIndex = themes.indexOf(AppState.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    setTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
}

function setTheme(theme) {
    AppState.currentTheme = theme;
    document.body.classList.remove('theme-cosmic', 'theme-cyberpunk', 'theme-royal', 'theme-metal', 'theme-hc-gold');
    if (['cosmic', 'cyberpunk', 'royal', 'metal', 'hc-gold'].includes(theme)) {
        document.body.classList.add(`theme-${theme}`);
    }
    updateThemeUI();
}

function updateThemeUI() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            const icons = { 'dark': 'fas fa-moon', 'cosmic': 'fas fa-meteor', 'cyberpunk': 'fas fa-bolt', 'royal': 'fas fa-crown', 'metal': 'fas fa-cog', 'hc-gold': 'fas fa-gem' };
            icon.className = icons[AppState.currentTheme] || 'fas fa-moon';
        }
    }
}

function initScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in, .section').forEach(el => observer.observe(el));
    
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const targetText = stat.getAttribute('data-count') || "0";
                const isFloat = targetText.includes('.');
                const target = parseFloat(targetText);
                
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: { value: 0 }, value: target, duration: 2000, easing: 'easeOutExpo',
                        update: anim => {
                            let val = anim.animatables[0].target.value;
                            stat.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
                        }
                    });
                } else {
                    stat.textContent = targetText; 
                }
                statObserver.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number').forEach(stat => statObserver.observe(stat));
}

function initMobileMenu() {
    document.getElementById('menuToggle')?.addEventListener('click', toggleMobileMenu);
}

function toggleMobileMenu() {
    AppState.isMenuOpen = !AppState.isMenuOpen;
    document.getElementById('navMenu')?.classList.toggle('active', AppState.isMenuOpen);
}

function generateParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = ['BP', 'UE', 'Node', '()', '{}', 'Client', 'Fix'][Math.floor(Math.random() * 7)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}