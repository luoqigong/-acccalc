/**
 * Main logic file - Page interactions and functionality control
 * Acceleration Calculator - How to Calculate Acceleration
 */

// Current state
let currentTheme = 'light';
let currentMode = 'velocity';

// Page initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeEventListeners();
    initializeFormValidation();
    checkBrowserCompatibility();
});

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

// Set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    // Update theme toggle button icon
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    switch(theme) {
        case 'light':
            icon.className = 'fas fa-moon';
            break;
        case 'dark':
            icon.className = 'fas fa-sun';
            break;
        case 'high-contrast':
            icon.className = 'fas fa-adjust';
            break;
    }
    
    showThemeIndicator(theme);
}

// Display theme indicator
function showThemeIndicator(theme) {
    const themeNames = {
        light: 'Light Theme',
        dark: 'Dark Theme',
        'high-contrast': 'High Contrast Theme'
    };
    
    const indicator = document.createElement('div');
    indicator.className = 'theme-indicator';
    indicator.textContent = `Switched to ${themeNames[theme]}`;
    document.body.appendChild(indicator);
    
    setTimeout(() => indicator.classList.add('show'), 10);
    setTimeout(() => {
        indicator.classList.remove('show');
        setTimeout(() => document.body.removeChild(indicator), 300);
    }, 2000);
}

// Initialize event listeners
function initializeEventListeners() {
    // Theme switching
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', function() {
        const themes = ['light', 'dark', 'high-contrast'];
        const currentIndex = themes.indexOf(currentTheme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        
        this.classList.add('switching');
        setTimeout(() => {
            setTheme(nextTheme);
            this.classList.remove('switching');
        }, 150);
    });
    
    // Help button
    const helpBtn = document.getElementById('helpBtn');
    helpBtn.addEventListener('click', showHelpModal);
    
    // Mode switching tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            switchMode(this.dataset.mode);
        });
    });
    
    // Learning content buttons
    const learnBtns = document.querySelectorAll('.learn-more-btn');
    learnBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showLearningModal(this.dataset.topic);
        });
    });
    
    // Modal close
    const modalClose = document.getElementById('modalClose');
    const modal = document.getElementById('learningModal');
    
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Real-time form input validation
    setupInputValidation();
}

// Switch calculation mode
function switchMode(mode) {
    if (mode === currentMode) return;
    
    currentMode = mode;
    
    // Update tab status
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // Update form display
    document.querySelectorAll('.calc-form').forEach(form => {
        form.classList.toggle('active', form.id.includes(mode));
    });
    
    // Update formula display
    document.querySelectorAll('.formula-item').forEach(item => {
        item.classList.toggle('active', item.dataset.mode === mode);
    });
    
    // Hide results
    document.getElementById('resultSection').style.display = 'none';
}

// Setup input validation
function setupInputValidation() {
    const inputs = document.querySelectorAll('input[type="number"]');
    
    inputs.forEach(input => {
        input.addEventListener('input', debounce(function() {
            validateSingleInput(this);
        }, 300));
        
        input.addEventListener('blur', function() {
            validateSingleInput(this);
        });
    });
}

// Validate single input
function validateSingleInput(input) {
    const value = input.value.trim();
    const inputGroup = input.closest('.input-group');
    
    if (!value) {
        clearError(inputGroup);
        return;
    }
    
    let validationType = 'number';
    const inputId = input.id;
    
    if (inputId.includes('t')) {
        validationType = 'time';
    } else if (inputId.includes('m')) {
        validationType = 'mass';
    } else if (inputId.includes('d') || inputId.includes('f')) {
        validationType = 'positive';
    } else {
        validationType = 'non-negative';
    }
    
    const validation = validateInput(value, validationType);
    
    if (!validation.isValid) {
        showError(inputGroup, validation.error);
    } else {
        clearError(inputGroup);
    }
}

// Show help modal
function showHelpModal() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'User Guide';
    modalBody.innerHTML = `
        <h4>How to Use the Acceleration Calculator</h4>
        <div style="margin-bottom: 1rem;">
            <h5>1. Choose Calculation Mode</h5>
            <ul>
                <li><strong>Velocity Change</strong>: When you know initial velocity, final velocity, and time</li>
                <li><strong>Distance & Time</strong>: When you know initial velocity, distance, and time</li>
                <li><strong>Force & Mass</strong>: When you know force and mass (Newton's Second Law)</li>
            </ul>
        </div>
        
        <div style="margin-bottom: 1rem;">
            <h5>2. Enter Parameters</h5>
            <ul>
                <li>Input numerical values in the corresponding fields</li>
                <li>Select appropriate units for each parameter</li>
                <li>The system will automatically handle unit conversions</li>
            </ul>
        </div>
        
        <div style="margin-bottom: 1rem;">
            <h5>3. View Results</h5>
            <ul>
                <li>Results are displayed in m/s² units</li>
                <li>Includes detailed physical interpretation</li>
                <li>Provides safety reminders when applicable</li>
            </ul>
        </div>
        
        <div>
            <h5>4. Theme Switching</h5>
            <p>Click the theme button in the top-right corner to switch between light, dark, and high-contrast themes.</p>
        </div>
    `;
    
    showModal();
}

// Show learning content modal
function showLearningModal(topic) {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    const content = {
        fundamentals: {
            title: 'Physics Fundamentals',
            content: `
                <h4>What is Acceleration?</h4>
                <p>Acceleration is a physical quantity that describes how quickly an object's velocity changes. It's a vector quantity, meaning it has both magnitude and direction.</p>
                
                <h5>Definition</h5>
                <p>Acceleration equals the change in velocity divided by the time taken for that change to occur.</p>
                <p>Mathematical expression: a = Δv / Δt</p>
                
                <h5>Units</h5>
                <p>In the International System of Units (SI), acceleration is measured in meters per second squared (m/s²).</p>
                
                <h5>Direction</h5>
                <ul>
                    <li>Positive acceleration: velocity increases, object speeds up</li>
                    <li>Negative acceleration: velocity decreases, object slows down (deceleration)</li>
                    <li>Zero acceleration: constant velocity motion or at rest</li>
                </ul>
                
                <h5>Common Acceleration Values</h5>
                <ul>
                    <li>Gravitational acceleration: 9.8 m/s²</li>
                    <li>Normal car acceleration: 2-5 m/s²</li>
                    <li>Car emergency braking: 8-10 m/s²</li>
                    <li>Elevator startup: 1-2 m/s²</li>
                </ul>
            `
        },
        derivation: {
            title: 'Formula Derivations',
            content: `
                <h4>Acceleration Formula Derivations</h4>
                
                <h5>1. Based on Velocity Change</h5>
                <p><strong>Definition:</strong> a = Δv / Δt</p>
                <p><strong>Derivation:</strong></p>
                <p>Let initial velocity be v₀, final velocity be v, and time be t</p>
                <p>Velocity change: Δv = v - v₀</p>
                <p>Therefore: a = (v - v₀) / t</p>
                
                <h5>2. Based on Displacement and Time</h5>
                <p><strong>From kinematic equations:</strong></p>
                <p>Displacement formula: s = v₀t + ½at²</p>
                <p>Rearranging: ½at² = s - v₀t</p>
                <p>Solving for a: a = 2(s - v₀t) / t²</p>
                
                <h5>3. Based on Force and Mass</h5>
                <p><strong>Newton's Second Law:</strong></p>
                <p>F = ma</p>
                <p>Solving for a: a = F / m</p>
                
                <h5>Conditions for Derivation</h5>
                <ul>
                    <li>Uniform acceleration in straight line motion</li>
                    <li>Constant mass (for F=ma)</li>
                    <li>Neglecting air resistance and other external forces</li>
                </ul>
            `
        },
        applications: {
            title: 'Practical Applications',
            content: `
                <h4>Acceleration Applications in Real Life</h4>
                
                <h5>Transportation</h5>
                <ul>
                    <li><strong>Automotive design:</strong> Engine power, braking system design</li>
                    <li><strong>Traffic safety:</strong> Braking distance calculation, safe following distance</li>
                    <li><strong>High-speed rail:</strong> Train acceleration and braking control</li>
                    <li><strong>Aerospace:</strong> Rocket propulsion, satellite orbital calculations</li>
                </ul>
                
                <h5>Sports</h5>
                <ul>
                    <li><strong>Track and field:</strong> Sprint start analysis, long jump takeoff</li>
                    <li><strong>Ball sports:</strong> Ball trajectory prediction</li>
                    <li><strong>Swimming:</strong> Starting block takeoff optimization</li>
                </ul>
                
                <h5>Engineering Design</h5>
                <ul>
                    <li><strong>Elevator systems:</strong> Comfort control</li>
                    <li><strong>Amusement rides:</strong> Safety standard development</li>
                    <li><strong>Earthquake-resistant buildings:</strong> Seismic acceleration analysis</li>
                </ul>
                
                <h5>Medical and Health</h5>
                <ul>
                    <li><strong>Ergonomics:</strong> Seat and seatbelt design</li>
                    <li><strong>Sports rehabilitation:</strong> Training intensity control</li>
                    <li><strong>Medical equipment:</strong> Centrifuge design</li>
                </ul>
            `
        }
    };
    
    const topicContent = content[topic];
    if (topicContent) {
        modalTitle.textContent = topicContent.title;
        modalBody.innerHTML = topicContent.content;
        showModal();
    }
}

// Show modal
function showModal() {
    const modal = document.getElementById('learningModal');
    modal.classList.add('active');
    modal.style.display = 'flex';
    
    // Disable background scrolling
    document.body.style.overflow = 'hidden';
    
    // Focus modal for accessibility
    modal.focus();
}

// Close modal
function closeModal() {
    const modal = document.getElementById('learningModal');
    
    // Add closing animation class
    modal.classList.add('closing');
    
    // Wait for animation to complete before hiding modal
    setTimeout(() => {
        modal.classList.remove('active', 'closing');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// Check browser compatibility
function checkBrowserCompatibility() {
    const support = {
        css: {
            grid: CSS && CSS.supports('display', 'grid'),
            flexbox: CSS && CSS.supports('display', 'flex'),
            customProperties: CSS && CSS.supports('--css', 'variables')
        },
        js: {
            es6: typeof Symbol !== 'undefined',
            fetch: typeof fetch !== 'undefined',
            promise: typeof Promise !== 'undefined'
        }
    };
    
    const unsupported = [];
    
    if (!support.css.grid) unsupported.push('CSS Grid');
    if (!support.css.flexbox) unsupported.push('CSS Flexbox');
    if (!support.js.es6) unsupported.push('ES6 Syntax');
    
    if (unsupported.length > 0) {
        console.warn('Browser compatibility warning:', unsupported.join(', '));
    }
}

// 初始化表单验证
function initializeFormValidation() {
    const forms = document.querySelectorAll('.calc-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    });
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter 快速计算
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        calculate(currentMode);
    }
    
    // 数字键快速切换模式
    if (e.key >= '1' && e.key <= '3' && !e.ctrlKey && !e.altKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT') {
            const modes = ['velocity', 'distance', 'force', 'kinematic'];
            const modeIndex = parseInt(e.key) - 1;
            if (modes[modeIndex]) {
                switchMode(modes[modeIndex]);
            }
        }
    }
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
    showToast('发生了一个错误，请刷新页面重试', 5000);
});

// 导出函数供全局使用
window.switchMode = switchMode;
window.calculate = calculate;
window.resetForm = resetForm;
