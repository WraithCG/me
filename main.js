let currentLightboxList = [];
let currentLightboxIndex = 0;

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    // 1. Set the visual theme immediately to avoid flickering
    applyRandomTheme();

    // 2. Fetch Portfolio Data (Profile, Resume, etc.)
    fetch('data.json')
        .then(r => r.json())
        .then(d => {
            populateData(d); // Fill HTML with JSON data
            initializeInteractivity(d); // Setup buttons, drawers, and scroll logic
        })
        .catch(e => console.error("Error loading data.json:", e));

    // 3. Fetch Reviews specifically (separated to allow independent updates)
    fetch('gallery.json')
        .then(r => r.json())
        .then(d => {
            if (d.reviews) populateReviews(d.reviews);
        })
        .catch(e => console.error("Error loading reviews:", e));

    // 4. Utility Setups
    setupAutoResizeTextarea();

    // 5. Visual Effects
    initStarfield(); // Canvas background; reads CSS variables for color
    initializeTimeCard(); // Real-time clock widget
});

// === THEME ENGINE ===
// Randomly selects a theme class and applies it to the body
function applyRandomTheme() {
    const themes = ['theme-default', 'theme-cosmic', 'theme-cyberpunk', 'theme-royal', 'theme-metal'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    // Clean up old classes before adding new ones
    document.body.classList.remove('theme-cosmic', 'theme-cyberpunk', 'theme-royal', 'theme-metal', 'dark-theme');

    if (randomTheme !== 'theme-default') {
        document.body.classList.add(randomTheme, 'dark-theme');
    }
}

// === DATA POPULATION ===
// Injects JSON data into specific HTML IDs
function populateData(data) {
    document.getElementById('nav-logo').textContent = data.navLogo || ' ';

    if (data.home.profileImage) {
        document.getElementById('profile-img').src = data.home.profileImage;
    }

    document.getElementById('home-title').innerHTML = data.home.name;

    // Generate Profession Tags
    if (data.home.professions) {
        document.getElementById('home-professions').innerHTML = data.home.professions
            .map(p => `<span class="profession-item">${p}</span>`).join('');
    }

    // Contact Info
    // document.getElementById('contact-info').innerHTML = `
    //     <span class="home-information"><i class="bx bx-map home-icon"></i> ${data.home.contact.address}</span>
    //     <span class="home-information"><i class="bx bx-envelope home-icon"></i> ${data.home.contact.email}</span>`;

    document.getElementById('contact-info').innerHTML = `
        <span class="home-information"><i class="bx bx-envelope home-icon"></i> ${data.home.contact.email}</span>`;


    document.getElementById('profile-description').textContent = data.profileDescription;

    // Timeline Generation: Education & Experience
    if (data.education) {
        document.getElementById('education-container').innerHTML = data.education.map((e, i) => `
            <div class="education-content">
                <div class="education-time">
                    <span class="education-rounder"></span>
                    ${i < data.education.length - 1 ? '<span class="education-line"></span>' : ''}
                </div>
                <div class="education-data bd-grid">
                    <h3 class="education-title">${e.title}</h3>
                    <span class="education-studies">${e.institution}</span>
                    <span class="education-year">${e.year}</span>
                </div>
            </div>`).join('');
    }

    // Skills Columns
    if (data.skills) {
        document.getElementById('skills-col1').innerHTML = data.skills[0].map(s => `<li class="skills-name"><span class="skills-circle"></span> ${s.name}</li>`).join('');
        document.getElementById('skills-col2').innerHTML = data.skills[1].map(s => `<li class="skills-name"><span class="skills-circle"></span> ${s.name}</li>`).join('');
    }

    // Software List with SVG icons
    if (data.software) {
        document.getElementById('software-container').innerHTML = data.software.map(sw => `
            <div class="software-content">
                <div class="software-info">${sw.svg || ''}<span class="software-name">${sw.name}</span></div>
                <span class="software-experience">${sw.experience}</span>
            </div>`).join('');
    }

    // Experience Timeline
    // if (data.experience) {
    //     document.getElementById('experience-container').innerHTML = data.experience.map((e,i) => `
    //         <div class="experience-content">
    //             <div class="experience-time">
    //                 <span class="experience-rounder"></span>
    //                 ${i < data.experience.length-1 ? '<span class="experience-line"></span>' : ''}
    //             </div>
    //             <div class="experience-data bd-grid">
    //                 <div class="experience-title-group">
    //                     <h3 class="experience-title">${e.title}</h3>
    //                     <span class="experience-duration">${calculateDuration(e.startDate, e.endDate)}</span>
    //                 </div>
    //                 <span class="experience-company">${e.company}</span>
    //                 ${e.tasks ? `<ul class="experience-tasks">${e.tasks.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
    //             </div>
    //         </div>`).join('');
    // }

    // Interests
    if (data.interests) {
        document.getElementById('interests-container').innerHTML = data.interests.map(i => `
            <div class="interests-content">
                <i class="bx ${i.icon} interests-icon"></i>
                <span class="interests-name">${i.name}</span>
                ${i.favorites ? `<ul class="favorites-list">${i.favorites.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}
            </div>`).join('');
    }

    // Floating Social Buttons
    const socialContainer = document.getElementById('floating-socials-container');
    if (socialContainer && data.svg_socials) {
        socialContainer.innerHTML = '';
        data.svg_socials.forEach(social => {
            socialContainer.innerHTML += `
                <div class="social-button-wrapper">
                    <a href="${social.url}" target="_blank" class="button" title="${social.name}">
                        ${social.svg}
                    </a>
                    <span class="social-handle-pop">${social.handle}</span>
                </div>`;
        });
    }

    if (data.quotes) displayRandomQuote(data.quotes);
}

function populateReviews(reviews) {
    document.getElementById('reviews-container').innerHTML = reviews.map(r => `
        <div class="review-card glass-panel">
            <div class="review-header">
                <div class="reviewer-info">
                    <img src="${r.avatar}" class="reviewer-avatar">
                    <div>
                        <div class="reviewer-name">${r.name}</div>
                        <div class="reviewer-company">${r.company}</div>
                    </div>
                </div>
                <div class="review-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
            </div>
            <p class="review-text">"${r.text}"</p>
        </div>`).join('');
}

function displayRandomQuote(quotes) {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote-text').textContent = `“${q.text}”`;
    document.getElementById('quote-author').textContent = q.author;
}

// === INTERACTIVITY & EVENT LISTENERS ===
function initializeInteractivity(portfolioData) {
    // Navigation Toggle (Mobile)
    document.getElementById('nav-toggle').addEventListener('click', () => document.getElementById('nav-menu').classList.toggle('show-menu'));
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => document.getElementById('nav-menu').classList.remove('show-menu')));

    // Scroll Active Link Highlighting
    const sections = document.querySelectorAll('section[id], .resume-right[id]');
    window.addEventListener('scroll', () => {
        sections.forEach(c => {
            const top = c.offsetTop - 50, height = c.offsetHeight, id = c.getAttribute('id');
            const link = document.querySelector('.nav-menu a[href*=' + id + ']');
            if (link) link.classList.toggle('active-link', window.scrollY > top && window.scrollY <= top + height);
        });
        document.getElementById('scroll-top').classList.toggle('show-scroll', window.scrollY >= 200);
    });

    // Drawer (Accordion) Logic
    const drawers = document.querySelectorAll('.drawer');
    drawers.forEach(d => {
        let t;
        const title = d.querySelector('.drawer-title');

        // Hover to open
        title.addEventListener('mouseenter', () => t = setTimeout(() => {
            drawers.forEach(dr => !dr.classList.contains('locked-open') && dr.classList.remove('open'));
            d.classList.add('open');
            // if(d.closest('.resume-right')) setTimeout(updateQuoteVisibility, 50); 
        }, 700));

        title.addEventListener('mouseleave', () => clearTimeout(t));

        // Click to Lock/Unlock
        title.addEventListener('click', () => {
            clearTimeout(t);
            if (!d.classList.contains('open')) triggerLightning(title); // Visual FX on open

            const locked = d.classList.contains('locked-open');
            drawers.forEach(dr => dr.classList.remove('locked-open', 'open'));

            if (!locked) {
                d.classList.add('locked-open', 'open');
                setTimeout(() => d.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
            }
            // if(d.closest('.resume-right')) setTimeout(updateQuoteVisibility, 50);
        });

        d.addEventListener('mouseleave', () => {
            if (!d.classList.contains('locked-open')) d.classList.remove('open');
            if (d.closest('.resume-right')) setTimeout(updateQuoteVisibility, 400);
        });
    });

    // Toggle Quote visibility based on drawer state
    function updateQuoteVisibility() {
        const qc = document.getElementById('thought-of-the-day'); if (!qc) return;
        qc.classList.toggle('hidden', document.querySelector('.resume-right .drawer.open'));
        if (!qc.classList.contains('hidden') && portfolioData.quotes) displayRandomQuote(portfolioData.quotes);
    }

    // Hover effect for Interests
    document.querySelectorAll('.interests-content').forEach(el => {
        let t;
        el.addEventListener('mouseenter', () => t = setTimeout(() => el.classList.add('show-favorites'), 500));
        el.addEventListener('mouseleave', () => { clearTimeout(t); el.classList.remove('show-favorites') });
    });

    // Lightning FX triggers
    const profileContainer = document.getElementById('profile-container');
    profileContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerLightning(profileContainer);
        // console.log("Profile lightning triggered");
    });
    document.addEventListener('click', () => document.querySelectorAll('.resume-bottom-line, .page-bottom-line, .page-top-line').forEach(l => triggerLightning(l)));

    // Contact Form Logic
    const contactForm = document.getElementById('contact-form'), btn = document.getElementById('contact-button'), wrap = document.getElementById('contact-button-wrapper');
    const inputs = contactForm.querySelectorAll('input, textarea');

    // Live Validation Visuals
    const checkValidity = () => {
        const valid = [...inputs].every(i => i.checkValidity());
        btn.disabled = !valid;
        if (valid && !wrap.querySelector('.lightning-overlay')) {
            const l = document.createElement('div'); l.className = 'lightning-overlay';
            l.innerHTML = '<div class="lightning-border"></div><div class="lightning-glow-1"></div><div class="lightning-glow-2"></div>';
            wrap.appendChild(l); wrap.classList.add('valid-glow');
        }
        else if (!valid) {
            wrap.classList.remove('valid-glow');
            const l = wrap.querySelector('.lightning-overlay'); if (l) l.remove();
        }
    };
    inputs.forEach(i => i.addEventListener('input', checkValidity));

    // Form Submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const key = "46fc9be7-5f6d-42d1-a21a-844296f6d2ba";
        if (key.includes("YOUR_")) { alert("Update Access Key in main.js"); return; }

        btn.disabled = true; btn.textContent = "Sending...";
        const fd = new FormData(contactForm); fd.append("access_key", key);

        fetch("https://api.web3forms.com/submit", { method: "POST", body: fd }).then(async r => {
            if (r.status == 200) {
                wrap.classList.remove('valid-glow'); wrap.querySelector('.lightning-overlay')?.remove();
                btn.textContent = "Thanks!"; contactForm.reset();
                setTimeout(() => { btn.textContent = "Send message →"; checkValidity(); }, 4000);
            }
            else { btn.textContent = "Error!"; setTimeout(() => { btn.textContent = "Send message →"; btn.disabled = false; }, 3000); }
        }).catch(() => { btn.textContent = "Error!"; setTimeout(() => { btn.textContent = "Send message →"; btn.disabled = false; }, 3000); });
    });

    // Lightbox Logic (Inter-iframe communication)
    const lightbox = document.getElementById('lightbox');
    window.addEventListener('message', (e) => {
        if (e.data?.type === 'openLightbox') {
            currentLightboxList = e.data.list || [];
            currentLightboxIndex = e.data.index || 0;
            updateLightbox();
        }
    });

    document.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); navLightbox(-1) });
    document.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); navLightbox(1) });
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') navLightbox(-1);
            else if (e.key === 'ArrowRight') navLightbox(1);
            else if (e.key === 'Escape') closeLightbox();
        }
    });
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.getElementById('home-data').addEventListener('click', () => {
        console.log("Profile image clicked");
        if (screen.width <= 968) {
            const contact = document.getElementById('contact');
            if (contact.style.display === "none" || getComputedStyle(contact).display === "none") {
                contact.style.display = "flex";
                contact.right = "50%";
            } else {
                contact.style.display = "none";
                console.log("Contact section hidden");
            }
        }
    });
}

// === HELPER FUNCTIONS ===

// Creates a visual lightning strike effect on an element
function triggerLightning(el) {
    if (!el) return;
    const old = el.querySelector('.lightning-effect'); if (old) old.remove();
    const l = document.createElement('div');
    l.className = 'lightning-effect';
    l.innerHTML = '<div class="lightning-border"></div><div class="lightning-glow-1"></div><div class="lightning-glow-2"></div>';
    el.appendChild(l);
    setTimeout(() => l.remove(), 1200);
}

// Lightbox Navigation
function navLightbox(dir) {
    if (!currentLightboxList.length) return;
    currentLightboxIndex = (currentLightboxIndex + dir + currentLightboxList.length) % currentLightboxList.length;
    updateLightbox();
}

function updateLightbox() { showLightbox(currentLightboxList[currentLightboxIndex]); }

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.querySelectorAll('#lightbox video').forEach(v => v.pause());
}

// Populate Lightbox UI
function showLightbox(item) {
    if (!item) return;
    const lb = document.getElementById('lightbox');
    const mc = document.getElementById('lightbox-media-container');
    mc.innerHTML = '';

    // Handle 'media' array (multiple items) or legacy single 'src'
    const addMediaToDom = (m) => {
        const isVideo = m.type === 'video' || (m.src && m.src.match(/\.(mp4|webm|ogg)$/i));
        const el = document.createElement(isVideo ? 'video' : 'img');
        el.src = m.src;
        if (isVideo) {
            el.controls = true;
            el.loop = true;
        } else {
            el.alt = item.caption || '';
        }
        mc.appendChild(el);
    };

    if (item.media && item.media.length > 0) {
        item.media.forEach(addMediaToDom);
    } else if (item.src) {
        addMediaToDom(item);
    }

    document.getElementById('lightbox-title').textContent = item.title || '';
    document.getElementById('lightbox-caption').textContent = item.caption || '';

    // External Links
    const lc = document.getElementById('lightbox-links'); lc.innerHTML = '';
    if (item.links) {
        item.links.forEach(l => {
            lc.innerHTML += `<a href="${l.url}" target="_blank" class="${l.hero ? 'hero-link' : ''}">${l.hero ? "<i class='bx bx-link-external'></i> " : ""}${l.name}</a>`;
        });
    }

    // Meta Tags
    const meta = document.getElementById('lightbox-meta'); meta.innerHTML = '';
    if (item.date) meta.innerHTML += `<div class="meta-item"><i class='bx bx-calendar'></i> ${item.date}</div>`;
    if (item.client) meta.innerHTML += `<div class="meta-item"><i class='bx bx-briefcase'></i> ${item.client}</div>`;
    if (item.software) meta.innerHTML += `<div class="meta-tags-group"><span class="meta-label">Software:</span> ${item.software.map(s => `<span class="meta-tag software">${s}</span>`).join('')}</div>`;

    // Description (handles array of paragraphs or single string)
    const desc = document.getElementById('lightbox-description'); desc.innerHTML = '';
    if (Array.isArray(item.description)) {
        item.description.forEach(p => desc.innerHTML += `<p>${p}</p>`);
    } else if (item.description) {
        desc.innerHTML = `<p>${item.description}</p>`;
    }

    lb.classList.add('active');

    // --- NEW: Features List ---
    // If the item has a 'features' array (common in Asset Store items), display it
    if (item.features && Array.isArray(item.features) && item.features.length > 0) {
        const featureList = document.createElement('ul');
        featureList.className = 'lightbox-features';
        // Add a small header for context if desired
        // featureList.innerHTML = '<li><strong>Features:</strong></li>'; 

        item.features.forEach(f => {
            const li = document.createElement('li');
            li.textContent = f;
            featureList.appendChild(li);
        });
        desc.appendChild(featureList); // Append to description area
    }
}

function calculateDuration(s, e) {
    const start = new Date(s), end = (e.toLowerCase() === 'present') ? new Date() : new Date(e);
    let y = end.getFullYear() - start.getFullYear();
    let m = end.getMonth() - start.getMonth();
    if (m < 0) { y--; m += 12; }
    return [y > 0 ? `${y} yr${y > 1 ? 's' : ''}` : '', m > 0 ? `${m} mo${m > 1 ? 's' : ''}` : ''].filter(Boolean).join(' ') || "Less than a month";
}

function setupAutoResizeTextarea() {
    document.querySelectorAll("textarea").forEach(tx => tx.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";
    }));
}

// === CANVAS STARFIELD ===
function initStarfield() {
    "use strict";
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight;

    // Fetch theme color to tint the stars
    const bodyStyle = getComputedStyle(document.body);
    const themeHue = bodyStyle.getPropertyValue('--first-color-hue').trim();
    var hue = parseInt(themeHue) || 217;

    var stars = [], count = 0, maxStars = 550;

    // Cache star sprite
    var canvas2 = document.createElement('canvas'), ctx2 = canvas2.getContext('2d');
    canvas2.width = 100; canvas2.height = 100;
    var half = canvas2.width / 2, gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient2.addColorStop(0.025, 'hsla(' + hue + ', 99%, 99%, 100%)');
    gradient2.addColorStop(0.1, 'hsla(' + hue + ', 99%, 63%, 60%)');
    gradient2.addColorStop(0.25, 'hsla(' + hue + ', 64%, 55%, 0%)');
    ctx2.fillStyle = gradient2; ctx2.beginPath(); ctx2.arc(half, half, half, 0, Math.PI * 2); ctx2.fill();

    function random(min, max) {
        if (arguments.length < 2) { max = min; min = 0; }
        if (min > max) { var hold = max; max = min; min = hold; }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function maxOrbit(x, y) {
        var max = Math.max(x, y), diameter = Math.round(Math.sqrt(max * max + max * max));
        return diameter / 2;
    }

    var Star = function () {
        this.orbitRadius = random(maxOrbit(w, h));
        this.radius = random(60, this.orbitRadius) / 12;
        this.orbitX = w / 2; this.orbitY = h / 2;
        this.timePassed = random(0, maxStars);
        this.speed = random(this.orbitRadius) / 1000000;
        this.alpha = random(2, 10) / 10;
        count++; stars[count] = this;
    }

    Star.prototype.draw = function () {
        var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
            y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
            twinkle = random(10);

        if (twinkle === 1 && this.alpha > 0) this.alpha -= 0.05;
        else if (twinkle === 2 && this.alpha < 1) this.alpha += 0.05;

        ctx.globalAlpha = this.alpha;
        ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
        this.timePassed += this.speed;
    }

    for (var i = 0; i < maxStars; i++) new Star();

    function animation() {
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';
        for (var i = 1, l = stars.length; i < l; i++) stars[i].draw();
        ctx.globalCompositeOperation = 'source-over';
        window.requestAnimationFrame(animation);
    }

    animation();

    window.addEventListener('resize', () => {
        if (canvas) { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
        stars = []; count = 0;
        for (var i = 0; i < maxStars; i++) new Star();
    });
}

// === WIDGET: TIME CARD ===
function initializeTimeCard() {
    const timeEl = document.getElementById('time-card-text');
    const subTextEl = document.getElementById('time-card-subtext');
    const dayEl = document.getElementById('time-card-day');
    const moonIcon = document.getElementById('time-card-icon');
    const sunIcon = document.getElementById('time-card-icon-sun');

    function getDaySuffix(day) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th";
        }
    }

    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;

        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedHours = hours < 10 ? ' ' + hours : hours;

        const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
        const monthName = now.toLocaleDateString('en-US', { month: 'long' });
        const dayNumber = now.getDate();
        const daySuffix = getDaySuffix(dayNumber);

        if (timeEl) timeEl.textContent = `${formattedHours}:${formattedMinutes}`;
        if (subTextEl) subTextEl.textContent = ampm;
        if (dayEl) dayEl.textContent = `${dayName}, ${monthName} ${dayNumber}${daySuffix}`;

        // Toggle Sun/Moon icon based on hour
        const militaryHour = now.getHours();
        const isDay = militaryHour >= 6 && militaryHour < 18;

        if (isDay) {
            if (moonIcon) moonIcon.style.display = 'none';
            if (sunIcon) sunIcon.style.display = 'block';
        } else {
            if (moonIcon) moonIcon.style.display = 'block';
            if (sunIcon) sunIcon.style.display = 'none';
        }
    }

    updateTime();
    setInterval(updateTime, 10000);
}