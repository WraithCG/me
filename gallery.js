document.addEventListener('DOMContentLoaded', () => {
    // 1. Identify which section (e.g., 'renders', 'assets') this iframe should display
    const container = document.getElementById('gallery-container');
    const sectionKey = new URLSearchParams(window.location.search).get('section');
    
    // Pointers
    const leftPointer = document.getElementById('scroll-left');
    const rightPointer = document.getElementById('scroll-right');

    // Stop execution if no section is defined in the URL parameters
    if (!sectionKey) return;

    // --- Pointer Visibility Logic ---
    function updatePointers() {
        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;

        // Show/Hide Left Pointer
        if (scrollLeft > 100) { // Threshold of 10px
            leftPointer.classList.add('active');
        } else {
            leftPointer.classList.remove('active');
        }

        // Show/Hide Right Pointer
        // Check if we are close to the end (allow some buffer)
        if (scrollLeft + clientWidth < scrollWidth - 10) {
            rightPointer.classList.add('active');
        } else {
            rightPointer.classList.remove('active');
        }
    }

    // Attach scroll listener
    container.addEventListener('scroll', updatePointers);
    // Also update on resize in case window width changes
    window.addEventListener('resize', updatePointers);

    // --- Pointer Click Logic ---
    // Scroll a fixed amount when clicked
    const scrollAmount = 100; 

    if(leftPointer) {
        leftPointer.addEventListener('click', () => {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    if(rightPointer) {
        rightPointer.addEventListener('click', () => {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // 2. Fetch the gallery data
    fetch('gallery.json')
        .then(response => response.json())
        .then(data => {
            // Retrieve specific items for the requested section
            const items = data[sectionKey];

            // 3. Validation: Ensure items exist and are in an array format
            if (items && Array.isArray(items)) {
                
                // Sort items by date (Newest to Oldest)
                if (sectionKey !== 'assets') {
                    items.sort((a, b) => new Date(b.date) - new Date(a.date));
                }

                // 4. Generate DOM Elements for each gallery item
                items.forEach((item, index) => {
                    const wrapper = document.createElement('div'); 
                    wrapper.className = 'gallery-item';
                    
                    // --- Thumbnail Determination Logic ---
                    // Priority 1: Explicit 'thumbnail' property in JSON
                    // Priority 2: First item in 'media' array
                    // Priority 3: Legacy 'src' property (fallback)
                    let mediaEl;
                    let thumbSrc = item.thumbnail;
                    let isVideo = false;

                    if (!thumbSrc) {
                        if (item.media && item.media.length > 0) {
                            thumbSrc = item.media[0].src;
                            isVideo = item.media[0].type === 'video';
                        } else {
                            thumbSrc = item.src;
                            isVideo = item.type === 'video';
                        }
                    }

                    // Check file extension if type isn't explicitly defined
                    if (thumbSrc && thumbSrc.match(/\.(mp4|webm|ogg)$/i)) {
                        isVideo = true;
                    }

                    // Create the visual element (Video or Image) for the grid
                    if (isVideo) {
                        mediaEl = document.createElement('video');
                        mediaEl.muted = true;
                        mediaEl.autoplay = true;
                        mediaEl.playsInline = true;
                        mediaEl.controls = false;
                        mediaEl.play();
                        // mediaEl.preload = 'metadata'; // Load only metadata to save bandwidth
                        // Add onmouseover play() logic here if desired
                        mediaEl.loop = true;

                    } else {
                        mediaEl = document.createElement('img');
                    }
                    
                    mediaEl.src = thumbSrc; 
                    mediaEl.className = 'gallery-thumb';

                    // Construct the item layout
                    wrapper.innerHTML = `
                        <div class="gallery-info">
                            <span class="gallery-title">${item.previewTitle}</span>
                            <span class="gallery-caption">${item.caption || ''}</span>
                        </div>
                    `;
                    wrapper.insertBefore(mediaEl, wrapper.firstChild);

                    // --- External Links Overlay ---
                    // Generates a hover overlay with buttons if the 'links' array exists.
                    // This now applies to ALL sections (Renders, Assets, etc.)
                    if (item.links && item.links.length > 0) {
                        const linksContainer = document.createElement('div');
                        linksContainer.className = 'gallery-item-links';

                        item.links.forEach(link => {
                            const linkEl = document.createElement('a');
                            linkEl.href = link.url;
                            linkEl.target = '_blank';
                            linkEl.textContent = link.name;
                            
                            // Apply specific styling for 'hero' (primary) links
                            if (link.hero) linkEl.classList.add('hero-link');
                            
                            linksContainer.appendChild(linkEl);
                        });
                        
                        wrapper.appendChild(linksContainer);
                    }

                    // --- Click Event Handling ---
                    wrapper.addEventListener('click', (e) => {
                        // Prevent Lightbox opening if user clicked an external link
                        if (e.target.tagName === 'A') {
                            e.stopPropagation();
                            return;
                        }
                        
                        // Communicate with the Parent Window (main.html) to open the Lightbox
                        // We pass the full list (for navigation) and current index
                        window.parent.postMessage({ 
                            type: 'openLightbox', 
                            list: items, 
                            index: index 
                        }, '*');
                    });
                    
                    container.appendChild(wrapper);
                });
            }
        })
        .catch(err => console.error("Failed to load gallery data:", err));
});