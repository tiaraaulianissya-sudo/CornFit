// ===================================
// JavaScript untuk Tab Informasi Umum Jagung
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Smooth Scroll untuk navigasi internal
    initSmoothScroll();
    
    // 2. Animasi saat scroll (fade in effect)
    initScrollAnimation();
    
    // 3. Back to Top Button
    initBackToTop();
    
    // 4. Accordion untuk section yang panjang (optional)
    initAccordion();
    
    // 5. Print Page Functionality
    initPrintButton();
    
    // 6. Search/Filter Functionality
    initSearchFunction();
    
    // 7. Dark Mode Toggle (optional)
    initDarkMode();
});

// ===================================
// 1. SMOOTH SCROLL
// ===================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// 2. SCROLL ANIMATION (Fade In)
// ===================================
function initScrollAnimation() {
    const sections = document.querySelectorAll('.content-section');
    
    // Tambahkan class untuk animasi
    sections.forEach(section => {
        section.classList.add('fade-in-section');
    });
    
    // Observer untuk detect scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Tambahkan CSS untuk animasi
    addAnimationStyles();
}

function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fade-in-section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .fade-in-section.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// 3. BACK TO TOP BUTTON
// ===================================
function initBackToTop() {
    // Buat button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Kembali ke atas');
    document.body.appendChild(backToTopBtn);
    
    // Tampilkan button saat scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Click event
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Tambahkan CSS
    addBackToTopStyles();
}

function addBackToTopStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 1000;
        }
        
        .back-to-top.show {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            background-color: #45a049;
            transform: translateY(-5px);
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// 4. ACCORDION FUNCTIONALITY (Optional)
// ===================================
function initAccordion() {
    const headers = document.querySelectorAll('.content-section h2');
    
    headers.forEach(header => {
        header.style.cursor = 'pointer';
        header.style.userSelect = 'none';
        
        // Tambahkan icon
        const icon = document.createElement('span');
        icon.className = 'accordion-icon';
        icon.textContent = ' ▼';
        icon.style.fontSize = '0.8em';
        icon.style.marginLeft = '10px';
        header.appendChild(icon);
        
        header.addEventListener('click', function() {
            const section = this.parentElement;
            const content = Array.from(section.children).slice(1); // Semua kecuali h2
            
            section.classList.toggle('collapsed');
            
            content.forEach(el => {
                if (section.classList.contains('collapsed')) {
                    el.style.display = 'none';
                    icon.textContent = ' ▶';
                } else {
                    el.style.display = '';
                    icon.textContent = ' ▼';
                }
            });
        });
    });
}

// ===================================
// 5. PRINT FUNCTIONALITY
// ===================================
function initPrintButton() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '🖨️ Cetak Halaman';
    printBtn.className = 'print-btn';
    printBtn.onclick = function() {
        window.print();
    };
    
    header.appendChild(printBtn);
    
    // Tambahkan CSS
    const style = document.createElement('style');
    style.textContent = `
        .print-btn {
            background-color: white;
            color: #4CAF50;
            border: 2px solid white;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            margin-top: 15px;
            transition: all 0.3s ease;
        }
        
        .print-btn:hover {
            background-color: #f0f0f0;
            transform: scale(1.05);
        }
        
        @media print {
            .back-to-top, .print-btn, .search-container, .dark-mode-toggle {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// 6. SEARCH/FILTER FUNCTIONALITY
// ===================================
function initSearchFunction() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    // Buat search box
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="searchInput" placeholder="🔍 Cari informasi..." />
        <button id="clearSearch">✕</button>
    `;
    
    // Insert setelah header
    const header = document.querySelector('.header');
    header.after(searchContainer);
    
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    const sections = document.querySelectorAll('.content-section');
    
    // Search event
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            if (text.includes(searchTerm) || searchTerm === '') {
                section.style.display = '';
                highlightText(section, searchTerm);
            } else {
                section.style.display = 'none';
            }
        });
        
        clearBtn.style.display = searchTerm ? 'block' : 'none';
    });
    
    // Clear search
    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    });
    
    // Tambahkan CSS
    addSearchStyles();
}

function highlightText(element, searchTerm) {
    // Reset highlight
    element.querySelectorAll('.highlight').forEach(span => {
        const parent = span.parentNode;
        parent.replaceChild(document.createTextNode(span.textContent), span);
        parent.normalize();
    });
    
    if (!searchTerm) return;
    
    // Highlight baru
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const nodesToReplace = [];
    let node;
    
    while (node = walker.nextNode()) {
        if (node.nodeValue.toLowerCase().includes(searchTerm)) {
            nodesToReplace.push(node);
        }
    }
    
    nodesToReplace.forEach(node => {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const text = node.nodeValue;
        const fragment = document.createDocumentFragment();
        
        let lastIndex = 0;
        text.replace(regex, (match, p1, offset) => {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, offset)));
            const span = document.createElement('span');
            span.className = 'highlight';
            span.textContent = match;
            fragment.appendChild(span);
            lastIndex = offset + match.length;
        });
        
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        node.parentNode.replaceChild(fragment, node);
    });
}

function addSearchStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .search-container {
            position: relative;
            max-width: 1200px;
            margin: -10px auto 30px;
            padding: 0 20px;
        }
        
        #searchInput {
            width: 100%;
            padding: 15px 45px 15px 15px;
            font-size: 16px;
            border: 2px solid #4CAF50;
            border-radius: 8px;
            outline: none;
            transition: all 0.3s ease;
        }
        
        #searchInput:focus {
            border-color: #45a049;
            box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
        }
        
        #clearSearch {
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #999;
            display: none;
        }
        
        #clearSearch:hover {
            color: #333;
        }
        
        .highlight {
            background-color: #FFEB3B;
            padding: 2px 4px;
            border-radius: 3px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// 7. DARK MODE TOGGLE (Optional)
// ===================================
function initDarkMode() {
    const toggle = document.createElement('button');
    toggle.className = 'dark-mode-toggle';
    toggle.innerHTML = '🌙';
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    document.body.appendChild(toggle);
    
    // Cek localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        toggle.innerHTML = '☀️';
    }
    
    toggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            toggle.innerHTML = '☀️';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            toggle.innerHTML = '🌙';
            localStorage.setItem('darkMode', 'disabled');
        }
    });
    
    addDarkModeStyles();
}

function addDarkModeStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .dark-mode-toggle {
            position: fixed;
            bottom: 90px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 1000;
            transition: all 0.3s ease;
        }
        
        .dark-mode-toggle:hover {
            transform: scale(1.1);
        }
        
        /* Dark Mode Styles */
        body.dark-mode {
            background-color: #1a1a1a;
            color: #e0e0e0;
        }
        
        body.dark-mode .content-section {
            background-color: #2d2d2d;
            color: #e0e0e0;
        }
        
        body.dark-mode .header {
            background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%);
        }
        
        body.dark-mode .season-card {
            background: #3a3a3a;
            border-color: #4CAF50;
        }
        
        body.dark-mode .highlight-box {
            background-color: #2d4a2d;
        }
        
        body.dark-mode .info-box {
            background-color: #4a4520;
        }
        
        body.dark-mode .component-item {
            background-color: #3a5a3a;
            color: #a8d5a8;
        }
        
        body.dark-mode #searchInput {
            background-color: #2d2d2d;
            color: #e0e0e0;
            border-color: #4CAF50;
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function untuk optimasi
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Console log untuk debugging
console.log('✅ Info Jagung JS loaded successfully!');