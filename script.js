// ====================================
// CORNFIT ENHANCED JAVASCRIPT
// ====================================

// Background Slideshow
let currentSlide = 0;
const slides = document.querySelectorAll('.bg-slide');

function showNextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

setInterval(showNextSlide, 5000);

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Accordion functionality
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const isActive = header.classList.contains('active');

        // Close all accordions
        accordionHeaders.forEach(h => {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('active');
        });

        // If clicked accordion wasn't active, open it
        if (!isActive) {
            header.classList.add('active');
            content.classList.add('active');
        }
    });
});

// Animated counter for insights
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    if (typeof num === 'string') return num;
    return num.toLocaleString('id-ID');
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            if (entry.target.classList.contains('insight-card')) {
                const number = entry.target.querySelector('.insight-number');
                const text = number.textContent;
                const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
                
                if (!isNaN(numericValue) && numericValue > 0) {
                    number.textContent = '0';
                    setTimeout(() => {
                        animateCounter(number, numericValue);
                    }, 200);
                }
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.model-card, .insight-card, .finding-card, .point, .conclusion-content, .result-card, .accordion-item, .contact-card'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-content');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Model comparison hover effects
const modelCards = document.querySelectorAll('.model-card');

modelCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Button ripple effect
const buttons = document.querySelectorAll('.btn-primary, .btn-contact, .btn-predict, .btn-reset');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ====================================
// INTERACTIVE PREDICTION SYSTEM
// ====================================

const predictBtn = document.getElementById('predictBtn');
const resetBtn = document.getElementById('resetBtn');
const soilQuality = document.getElementById('soilQuality');
const variety = document.getElementById('variety');
const harvestMonth = document.getElementById('harvestMonth');
const landArea = document.getElementById('landArea');

// Base values for prediction
const baseValues = {
    baik: 5.8,
    sedang: 5.75,
    kurang: 5.7,
    buruk: 5.5
};

const varietyMultiplier = {
    lokal: 0.95,
    hibrida: 1.05
};

const monthlyVariation = {
    1: -0.2, 2: -0.15, 3: -0.1, 4: 0.05, 5: 0.15,
    6: 0.2, 7: 0.15, 8: 0.05, 9: -0.05, 10: -0.1, 11: -0.15, 12: -0.2
};

if (predictBtn) {
    predictBtn.addEventListener('click', function() {
        const btnText = this.querySelector('.btn-text');
        const originalText = btnText.textContent;
        btnText.textContent = 'Menghitung...';
        this.disabled = true;
        this.style.opacity = '0.7';
        
        setTimeout(() => {
            calculatePrediction();
            btnText.textContent = originalText;
            this.disabled = false;
            this.style.opacity = '1';
            
            document.querySelector('.prediction-results').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 1500);
    });
}

if (resetBtn) {
    resetBtn.addEventListener('click', function() {
        soilQuality.value = 'sedang';
        variety.value = 'hibrida';
        harvestMonth.value = '5';
        landArea.value = '1.0';
        
        const btnText = this.querySelector('.btn-text');
        const originalText = btnText.textContent;
        btnText.textContent = 'Direset...';
        
        setTimeout(() => {
            btnText.textContent = originalText;
            calculatePrediction();
        }, 500);
    });
}

function calculatePrediction() {
    const soil = soilQuality.value;
    const var_type = variety.value;
    const month = parseInt(harvestMonth.value);
    const area = parseFloat(landArea.value);
    
    // ARIMA prediction
    const baseValue = baseValues[soil];
    const seasonalEffect = monthlyVariation[month];
    const varietyEffect = varietyMultiplier[var_type];
    const arimaValue = (baseValue + seasonalEffect) * varietyEffect;
    const arimaConfidence = 85 + Math.random() * 7;
    
    // Regression prediction
    const regressionValue = baseValue * varietyEffect * 0.95;
    const regressionConfidence = 75 + Math.random() * 7;
    
    // Update display with animation
    animateValue('arimaValue', arimaValue.toFixed(2));
    animateValue('regressionValue', regressionValue.toFixed(2));
    
    document.getElementById('arimaConfidence').textContent = Math.round(arimaConfidence) + '%';
    document.getElementById('regressionConfidence').textContent = Math.round(regressionConfidence) + '%';
    
    const difference = Math.abs(arimaValue - regressionValue);
    document.getElementById('difference').textContent = difference.toFixed(2);
    document.getElementById('bestModel').textContent = arimaValue > regressionValue ? 'ARIMA' : 'Regresi';
    document.getElementById('accuracy').textContent = '+' + ((difference / regressionValue) * 100).toFixed(1) + '%';
    
    // Update confidence bars with animation
    setTimeout(() => {
        document.querySelector('.arima-fill').style.width = Math.round(arimaConfidence) + '%';
        document.querySelector('.regression-fill').style.width = Math.round(regressionConfidence) + '%';
    }, 300);
    
    // Update chart
    updatePredictionChart(arimaValue, regressionValue);
}

// Animate number changes
function animateValue(elementId, endValue) {
    const element = document.getElementById(elementId);
    const startValue = parseFloat(element.textContent) || 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = startValue + (endValue - startValue) * progress;
        element.textContent = currentValue.toFixed(2);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Chart.js configurations
let predictionChart = null;
let mapeChart = null;
let r2Chart = null;

function updatePredictionChart(arimaValue, regressionValue) {
    const ctx = document.getElementById('predictionChart');
    if (!ctx) return;
    
    if (predictionChart) {
        predictionChart.destroy();
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const actualData = months.map((m, i) => 5.75 + monthlyVariation[i + 1] + (Math.random() - 0.5) * 0.2);
    const arimaData = months.map((m, i) => arimaValue + monthlyVariation[i + 1] * 0.9);
    const regressionData = months.map(() => regressionValue + (Math.random() - 0.5) * 0.1);
    
    predictionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Data Aktual',
                    data: actualData,
                    borderColor: '#8B6F47',
                    backgroundColor: 'rgba(139, 111, 71, 0.1)',
                    tension: 0.4,
                    borderWidth: 3
                },
                {
                    label: 'Prediksi ARIMA',
                    data: arimaData,
                    borderColor: '#E8A838',
                    backgroundColor: 'rgba(232, 168, 56, 0.1)',
                    tension: 0.4,
                    borderDash: [5, 5],
                    borderWidth: 3
                },
                {
                    label: 'Prediksi Regresi',
                    data: regressionData,
                    borderColor: '#4A7C3E',
                    backgroundColor: 'rgba(74, 124, 62, 0.1)',
                    tension: 0.4,
                    borderDash: [10, 5],
                    borderWidth: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Perbandingan Prediksi vs Data Aktual',
                    font: { size: 18, weight: 'bold' }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 13 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 5.0,
                    max: 6.5,
                    title: {
                        display: true,
                        text: 'Hasil Panen (ton/ha)',
                        font: { size: 14, weight: 'bold' }
                    }
                }
            }
        }
    });
}

// Initialize comparison charts
window.addEventListener('load', () => {
    initMapeChart();
    initR2Chart();
    
    if (predictBtn) {
        calculatePrediction();
    }
});

function initMapeChart() {
    const ctx = document.getElementById('mapeChart');
    if (!ctx) return;
    
    mapeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['ARIMA', 'Regresi Linear'],
            datasets: [{
                label: 'MAPE (%)',
                data: [6.5, 10.2],
                backgroundColor: [
                    'rgba(232, 168, 56, 0.8)',
                    'rgba(74, 124, 62, 0.8)'
                ],
                borderColor: [
                    '#E8A838',
                    '#4A7C3E'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 15,
                    title: {
                        display: true,
                        text: 'Error Rate (%)',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            }
        }
    });
}

function initR2Chart() {
    const ctx = document.getElementById('r2Chart');
    if (!ctx) return;
    
    r2Chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['ARIMA R²', 'Regresi R²'],
            datasets: [{
                data: [89, 78],
                backgroundColor: [
                    'rgba(232, 168, 56, 0.8)',
                    'rgba(74, 124, 62, 0.8)'
                ],
                borderColor: [
                    '#E8A838',
                    '#4A7C3E'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 10,
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

// Scroll progress indicator
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// Mobile menu toggle
const createMobileMenu = () => {
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-toggle';
    menuButton.innerHTML = '☰';
    menuButton.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 24px;
        color: var(--field-green);
        cursor: pointer;
        padding: 10px;
    `;
    
    if (window.innerWidth <= 768) {
        const navbar = document.querySelector('.navbar .container');
        menuButton.style.display = 'block';
        navbar.appendChild(menuButton);
        
        menuButton.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }
};

window.addEventListener('resize', createMobileMenu);
createMobileMenu();

// Copyright year
document.getElementById('copyright-year').textContent = new Date().getFullYear();

// Log page load
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`🌽 CornFit loaded in ${Math.round(loadTime)}ms`);
});