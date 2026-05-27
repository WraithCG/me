const portfolioData = {
    personal: {
        email: "developer@example.com",
        phone: "+91 000 000 0000",
        location: "Kanpur, Uttar Pradesh, India",
        web3formsKey: "YOUR_WEB3FORMS_ACCESS_KEY_HERE",
        status: "Available for Freelance Work",
        socials: {
            discordServer: "https://discord.gg/yourserver",
            discordDm: "https://discordapp.com/users/YOUR_DISCORD_ID",
            instagram: "https://instagram.com/yourprofile",
            reddit: "https://reddit.com/user/yourprofile",
            fab: "https://www.fab.com/sellers/yourprofile"
        }
    },
    hero: {
        title: "Freelance UE5 Gameplay Developer",
        description: "I help indie studios and creators bring their game ideas to life. From rapid prototyping to complex vehicle mechanics, I build clean, highly optimized Blueprint systems."
    },
    about: {
        text: "As an independent Gameplay Developer specializing in Unreal Engine 5, I focus on delivering scalable, bug-free mechanics. Whether you need a core gameplay loop prototyped in a week, a custom Chaos Vehicle controller, or heavy Blueprint logic optimized for better frame rates, I plug seamlessly into your pipeline to get the job done.",
        projectsDelivered: 24,
        clientRating: "5.0",
        repeatClients: 8
    },
    services: [
        {
            icon: "fa-rocket",
            title: "Rapid Prototyping",
            desc: "Turn your GDD into a playable greybox quickly. I build core loops so you can test the 'fun factor' before committing to full production.",
            extendedDesc: "Prototyping is the most crucial phase of game development. I work closely with designers to quickly iterate on core mechanics, movement systems, and game loops. Deliverables usually include a greybox level, basic player controllers, and modular blueprints that can be easily tweaked for balancing.",
            images: [
                "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000"
            ]
        },
        {
            icon: "fa-gamepad",
            title: "Custom Mechanics & Systems",
            desc: "Specializing in arcade vehicle physics (Chaos), complex character controllers, inventory systems, and AI Behavior Trees.",
            extendedDesc: "Need something highly specific? I engineer custom systems that plug seamlessly into your existing project framework. Whether it is an Asphalt 8-style drifting mechanic using Chaos Vehicles, an RPG inventory system, or advanced AI patrol behaviors, I ensure the logic is scalable and deeply commented.",
            images: [
                "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&q=80&w=1000"
            ]
        },
        {
            icon: "fa-tachometer-alt",
            title: "Blueprint Optimization",
            desc: "Game running slow? I refactor heavy, 'spaghetti' Tick-based logic into clean, event-driven, performant node networks.",
            extendedDesc: "Frame drops and stuttering often originate from poorly structured Blueprint logic. I run deep profiling sessions to identify bottlenecks. Services include migrating logic off the Event Tick, implementing interface communication to replace hard casting, and converting complex math into fast, event-driven macros.",
            images: [
                "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000",
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000"
            ]
        },
        {
            icon: "fa-layer-group",
            title: "UMG / UI Implementation",
            desc: "Building responsive, dynamic main menus, complex HUDs, and interactive 3D widgets that communicate perfectly with game state.",
            extendedDesc: "A great UI is critical to player retention. I translate your Figma/UI designs directly into pixel-perfect UMG widgets. This includes dynamic HUD elements (health bars, minimaps, crosshairs), complex nested inventory grids, and 3D spatial widgets that interact properly with the player camera.",
            images: []
        }
    ],
    testimonials: [
        {
            quote: "Kan3an delivered the arcade racing controller exactly as requested. The Asphalt 8-style physics feel incredible, and the Blueprints were immaculately organized.",
            client: "Indie Racing Studio",
            role: "Project Lead"
        },
        {
            quote: "We brought him in to fix our frame-rate drops. He identified our heavy tick functions, refactored them to events, and boosted our FPS by 40%. Highly recommended.",
            client: "VR Startup",
            role: "Technical Director"
        },
        {
            quote: "Kan3an delivered the arcade racing controller exactly as requested. The Asphalt 8-style physics feel incredible, and the Blueprints were immaculately organized.",
            client: "Indie Racing Studio",
            role: "Project Lead"
        },
        {
            quote: "We brought him in to fix our frame-rate drops. He identified our heavy tick functions, refactored them to events, and boosted our FPS by 40%. Highly recommended.",
            client: "VR Startup",
            role: "Technical Director"
        }
    ],
    projects: [
        {
            title: "2.5D Side Scroller Game Creator Template with Motion Matching",
            date: "Jan 2026",
            role: "Gameplay Programmer",
            desc: "A flexible framework that allows you to create optimized side scroller action-adventure games with motion matching support. This template has got you covered with everything you need to start your action-adventure side-scroller game journey.",
            tags: ["Unreal Engine 5", "SideScroller", "Blueprints"],
            icon: "fa-rpg",
            thumbnail: "https://media.fab.com/image_previews/gallery_images/6283f226-8ca2-4a52-a03d-54f1fbae6d35/af32720e-ef61-4097-852d-e68f24471467.jpg",
            media: [
                { type: "image", url: "https://media.fab.com/image_previews/gallery_images/6283f226-8ca2-4a52-a03d-54f1fbae6d35/af32720e-ef61-4097-852d-e68f24471467.jpg" },
                { type: "image", url: "https://media.fab.com/image_previews/gallery_images/d5fdc12f-7372-47a7-b691-cac8e71644c9/8d9b6dd0-a608-46f0-a660-18a8bb4bde4e.jpg" },
                { type: "image", url: "https://media.fab.com/image_previews/gallery_images/b89f2439-9346-4673-84f8-ea6ff954a09a/a9462cd0-a157-4298-8a89-b57416ccf1c1.jpg" },
                { type: "image", url: "https://media.fab.com/image_previews/gallery_images/b49d9964-b421-41f3-990d-b26d02cb13fd/7208f6a0-9a75-4953-8bde-8492f2834f0f.jpg" },
                { type: "image", url: "https://media.fab.com/image_previews/gallery_images/66f2dfec-2fa4-4792-a198-ebb5945ca83f/5f49eae5-c57a-4141-8bca-f5bc1317593f.jpg" },
                { type: "image", url: "https://media.fab.com/image_previews/gallery_images/404343ed-e77d-4f12-9c38-7fad51b0d1fb/43ff52f8-25b5-4f75-9200-797a89d54fcc.jpg" }
            ],
            features: [
                "Interfaces have been used for most communication between classes",
                "Blueprints contain modular functions and clean-commented graphs",
                "Interaction System",
                "Character Selection System",
                "Character Customization System",
                "Widgets Management System",
                "Dynamic Camera System with Movement Awareness",
                "Environment Creation Tools",
                "Dynamic Parkour System - Jump, Vault, Climb, Mantle",
                "Metahumans Support",
                "Demo Main Menu, Pause Menu, Death Menu, Character Selection and Customization Menu",
                "Example content included for each system"
            ],
            links: {
                live: "https://youtube.com/"
            }
        },
        {
            title: "Software Architecture Docs",
            date: "Nov 2025",
            role: "Full-Stack Dev",
            desc: "Built a comprehensive documentation website for internal software and game projects, featuring dynamic project selection, nested sections, and advanced search functionality.",
            tags: ["Web Dev", "Documentation", "System Design"],
            icon: "fa-project-diagram",
            thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000",
            media: [
                { type: "image", url: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000" },
                { type: "image", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000" }
            ],
            features: [
                "Dynamic markdown parsing and rendering",
                "Interactive ER Diagram viewer",
                "Full-text search across all documentation",
                "Automated deployment pipeline"
            ],
            links: {
                live: "https://yourdocs.com"
            }
        },
        {
            title: "Real-time Vision Processor",
            date: "May 2025",
            role: "C++ / Android Dev",
            desc: "Engineered an Android application utilizing OpenCV and OpenGL ES to process and render camera frames efficiently in real-time.",
            tags: ["Android", "OpenCV", "OpenGL ES"],
            icon: "fa-camera",
            thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000",
            media: [
                { type: "video", url: "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=0" },
                { type: "image", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000" }
            ],
            features: [
                "Native C++ JNI integration for maximum speed",
                "Real-time edge detection and custom filtering",
                "Custom OpenGL shaders for post-processing",
                "Optimized memory management to prevent leaks"
            ]
        }
    ]
};