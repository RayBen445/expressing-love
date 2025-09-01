// Countdown Timer System
// Beautiful countdown timers for special dates and anniversaries

class CountdownSystem {
    constructor() {
        this.activeCountdowns = new Map();
        this.updateInterval = null;
    }

    // Create a countdown timer
    createCountdown(targetDate, options = {}) {
        const defaultOptions = {
            id: `countdown_${Date.now()}`,
            title: 'Special Day',
            description: 'Something amazing is coming!',
            showDays: true,
            showHours: true,
            showMinutes: true,
            showSeconds: true,
            onComplete: null,
            autoRemove: true,
            style: 'elegant', // elegant, modern, romantic, minimal
            color: 'pink' // pink, red, purple, blue, gold
        };

        const config = { ...defaultOptions, ...options };
        const countdown = {
            ...config,
            targetDate: new Date(targetDate),
            element: null,
            timeLeft: null
        };

        this.activeCountdowns.set(config.id, countdown);
        this.startUpdateLoop();
        
        return config.id;
    }

    // Generate countdown HTML
    generateCountdownHTML(countdown) {
        const { title, description, style, color, id } = countdown;
        
        const styleClasses = {
            elegant: 'countdown-elegant',
            modern: 'countdown-modern', 
            romantic: 'countdown-romantic',
            minimal: 'countdown-minimal'
        };

        const colorClasses = {
            pink: 'countdown-pink',
            red: 'countdown-red',
            purple: 'countdown-purple',
            blue: 'countdown-blue',
            gold: 'countdown-gold'
        };

        return `
            <div class="countdown-container ${styleClasses[style]} ${colorClasses[color]}" id="countdown-${id}">
                <div class="countdown-header">
                    <h3 class="countdown-title">${title}</h3>
                    <p class="countdown-description">${description}</p>
                </div>
                <div class="countdown-display" id="countdown-display-${id}">
                    <div class="countdown-unit">
                        <span class="countdown-value" id="days-${id}">00</span>
                        <span class="countdown-label">Days</span>
                    </div>
                    <div class="countdown-separator">:</div>
                    <div class="countdown-unit">
                        <span class="countdown-value" id="hours-${id}">00</span>
                        <span class="countdown-label">Hours</span>
                    </div>
                    <div class="countdown-separator">:</div>
                    <div class="countdown-unit">
                        <span class="countdown-value" id="minutes-${id}">00</span>
                        <span class="countdown-label">Minutes</span>
                    </div>
                    <div class="countdown-separator">:</div>
                    <div class="countdown-unit">
                        <span class="countdown-value" id="seconds-${id}">00</span>
                        <span class="countdown-label">Seconds</span>
                    </div>
                </div>
                <div class="countdown-progress">
                    <div class="countdown-progress-bar" id="progress-${id}"></div>
                </div>
                <button class="countdown-close" onclick="countdownSystem.removeCountdown('${id}')">&times;</button>
            </div>
        `;
    }

    // Calculate time remaining
    calculateTimeLeft(targetDate) {
        const now = new Date().getTime();
        const target = new Date(targetDate).getTime();
        const difference = target - now;

        if (difference <= 0) {
            return null;
        }

        return {
            total: difference,
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
    }

    // Update countdown display
    updateCountdownDisplay(countdown) {
        const { id } = countdown;
        const timeLeft = this.calculateTimeLeft(countdown.targetDate);
        
        if (!timeLeft) {
            this.handleCountdownComplete(countdown);
            return;
        }

        countdown.timeLeft = timeLeft;

        // Update display values with animation
        this.updateValueWithAnimation(`days-${id}`, timeLeft.days);
        this.updateValueWithAnimation(`hours-${id}`, timeLeft.hours);
        this.updateValueWithAnimation(`minutes-${id}`, timeLeft.minutes);
        this.updateValueWithAnimation(`seconds-${id}`, timeLeft.seconds);

        // Update progress bar (assume 1 year countdown for calculation)
        const totalYear = 365 * 24 * 60 * 60 * 1000;
        const progress = Math.max(0, Math.min(100, ((totalYear - timeLeft.total) / totalYear) * 100));
        const progressBar = document.getElementById(`progress-${id}`);
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }

    // Animate value changes
    updateValueWithAnimation(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const formattedValue = newValue.toString().padStart(2, '0');
        if (element.textContent !== formattedValue) {
            element.style.transform = 'scale(1.2)';
            element.style.color = 'var(--accent-color, #ffc1cc)';
            
            setTimeout(() => {
                element.textContent = formattedValue;
                element.style.transform = 'scale(1)';
                element.style.color = '';
            }, 150);
        }
    }

    // Handle countdown completion
    handleCountdownComplete(countdown) {
        const { id, onComplete, autoRemove, title } = countdown;
        
        // Trigger confetti celebration
        if (window.confettiSystem) {
            window.confettiSystem.successCelebration();
        }

        // Show completion message
        this.showCompletionMessage(title);

        // Call completion callback
        if (typeof onComplete === 'function') {
            onComplete(countdown);
        }

        // Auto remove if enabled
        if (autoRemove) {
            setTimeout(() => {
                this.removeCountdown(id);
            }, 5000);
        }
    }

    // Show completion message
    showCompletionMessage(title) {
        const modal = document.createElement('div');
        modal.className = 'countdown-completion-modal';
        modal.innerHTML = `
            <div class="completion-modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="completion-modal-content">
                <div class="completion-celebration">🎉</div>
                <h2>Time's Up! 💕</h2>
                <p><strong>${title}</strong> has arrived!</p>
                <p>Hope it's everything you dreamed of! ✨</p>
                <button onclick="this.closest('.countdown-completion-modal').remove()" class="btn primary">
                    Celebrate! 🎊
                </button>
            </div>
        `;

        this.addCompletionModalStyles();
        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => modal.classList.add('show'), 100);
    }

    // Display countdown in container
    displayCountdown(countdownId, containerId) {
        const countdown = this.activeCountdowns.get(countdownId);
        if (!countdown) return false;

        const container = document.getElementById(containerId);
        if (!container) return false;

        container.innerHTML = this.generateCountdownHTML(countdown);
        countdown.element = container.firstElementChild;
        
        // Add styles if not already present
        this.addCountdownStyles();
        
        // Initial update
        this.updateCountdownDisplay(countdown);
        
        return true;
    }

    // Remove countdown
    removeCountdown(countdownId) {
        const countdown = this.activeCountdowns.get(countdownId);
        if (!countdown) return;

        // Remove element with animation
        if (countdown.element) {
            countdown.element.style.transform = 'scale(0)';
            countdown.element.style.opacity = '0';
            setTimeout(() => {
                if (countdown.element && countdown.element.parentNode) {
                    countdown.element.parentNode.removeChild(countdown.element);
                }
            }, 300);
        }

        this.activeCountdowns.delete(countdownId);

        // Stop update loop if no active countdowns
        if (this.activeCountdowns.size === 0) {
            this.stopUpdateLoop();
        }
    }

    // Start update loop
    startUpdateLoop() {
        if (this.updateInterval) return;

        this.updateInterval = setInterval(() => {
            this.activeCountdowns.forEach((countdown) => {
                this.updateCountdownDisplay(countdown);
            });
        }, 1000);
    }

    // Stop update loop
    stopUpdateLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Quick anniversary countdown
    createAnniversaryCountdown(anniversaryDate, years, containerSelector) {
        const nextAnniversary = new Date(anniversaryDate);
        nextAnniversary.setFullYear(new Date().getFullYear());
        
        // If anniversary has passed this year, set for next year
        if (nextAnniversary < new Date()) {
            nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1);
        }

        const countdownId = this.createCountdown(nextAnniversary, {
            title: `${years} Year Anniversary! 💕`,
            description: `Celebrating your beautiful journey together`,
            style: 'romantic',
            color: 'pink',
            onComplete: (countdown) => {
                if (window.confettiSystem) {
                    window.confettiSystem.heartBurst();
                }
            }
        });

        if (containerSelector) {
            const container = document.querySelector(containerSelector);
            if (container) {
                container.innerHTML = this.generateCountdownHTML(this.activeCountdowns.get(countdownId));
                this.addCountdownStyles();
            }
        }

        return countdownId;
    }

    // Quick birthday countdown
    createBirthdayCountdown(birthdayDate, name, containerSelector) {
        const nextBirthday = new Date(birthdayDate);
        nextBirthday.setFullYear(new Date().getFullYear());
        
        if (nextBirthday < new Date()) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }

        const countdownId = this.createCountdown(nextBirthday, {
            title: `${name}'s Birthday! 🎂`,
            description: `Get ready to celebrate!`,
            style: 'modern',
            color: 'gold',
            onComplete: () => {
                if (window.confettiSystem) {
                    window.confettiSystem.firework();
                }
            }
        });

        if (containerSelector) {
            this.displayCountdown(countdownId, containerSelector.replace('#', ''));
        }

        return countdownId;
    }

    // Add countdown styles
    addCountdownStyles() {
        if (document.getElementById('countdown-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'countdown-styles';
        styles.textContent = `
            .countdown-container {
                background: rgba(255, 255, 255, 0.95);
                border-radius: 20px;
                padding: 30px;
                margin: 20px 0;
                text-align: center;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                position: relative;
                transition: all 0.3s ease;
            }

            .countdown-container:hover {
                transform: translateY(-5px);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            }

            .countdown-header {
                margin-bottom: 30px;
            }

            .countdown-title {
                font-size: 1.8rem;
                margin: 0 0 10px 0;
                font-weight: bold;
                background: linear-gradient(135deg, var(--primary-color, #ff6b9d), var(--secondary-color, #ff9a9e));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .countdown-description {
                margin: 0;
                color: #666;
                font-size: 1rem;
                opacity: 0.8;
            }

            .countdown-display {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 20px;
                margin: 30px 0;
                flex-wrap: wrap;
            }

            .countdown-unit {
                display: flex;
                flex-direction: column;
                align-items: center;
                min-width: 70px;
            }

            .countdown-value {
                font-size: 3rem;
                font-weight: bold;
                color: var(--primary-color, #ff6b9d);
                line-height: 1;
                transition: all 0.3s ease;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .countdown-label {
                font-size: 0.9rem;
                color: #666;
                font-weight: 600;
                margin-top: 5px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .countdown-separator {
                font-size: 2rem;
                font-weight: bold;
                color: var(--accent-color, #ffc1cc);
                margin: 0 10px;
            }

            .countdown-progress {
                width: 100%;
                height: 6px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 3px;
                overflow: hidden;
                margin-top: 20px;
            }

            .countdown-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-color, #ff6b9d), var(--secondary-color, #ff9a9e));
                border-radius: 3px;
                transition: width 1s ease;
                box-shadow: 0 2px 4px rgba(255, 107, 157, 0.3);
            }

            .countdown-close {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #999;
                cursor: pointer;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .countdown-close:hover {
                background: rgba(255, 107, 157, 0.1);
                color: var(--primary-color, #ff6b9d);
            }

            /* Style variations */
            .countdown-elegant {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 249, 250, 0.9));
                border: 2px solid rgba(255, 107, 157, 0.2);
            }

            .countdown-modern {
                background: rgba(255, 255, 255, 0.9);
                border-radius: 15px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            }

            .countdown-romantic {
                background: linear-gradient(135deg, rgba(255, 240, 245, 0.95), rgba(255, 228, 238, 0.9));
                border: 1px solid rgba(255, 192, 203, 0.3);
            }

            .countdown-romantic .countdown-value {
                text-shadow: 0 2px 8px rgba(255, 107, 157, 0.3);
            }

            .countdown-minimal {
                background: rgba(255, 255, 255, 0.98);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                border: none;
            }

            /* Color variations */
            .countdown-pink {
                --primary-color: #ff6b9d;
                --secondary-color: #ff9a9e;
                --accent-color: #ffc1cc;
            }

            .countdown-red {
                --primary-color: #e91e63;
                --secondary-color: #f06292;
                --accent-color: #f8bbd9;
            }

            .countdown-purple {
                --primary-color: #9c27b0;
                --secondary-color: #ba68c8;
                --accent-color: #e1bee7;
            }

            .countdown-blue {
                --primary-color: #2196f3;
                --secondary-color: #64b5f6;
                --accent-color: #bbdefb;
            }

            .countdown-gold {
                --primary-color: #ff9800;
                --secondary-color: #ffb74d;
                --accent-color: #ffe0b2;
            }

            /* Completion modal */
            .countdown-completion-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(5px);
            }

            .countdown-completion-modal.show {
                opacity: 1;
            }

            .completion-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

            .completion-modal-content {
                background: white;
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                position: relative;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .countdown-completion-modal.show .completion-modal-content {
                transform: scale(1);
            }

            .completion-celebration {
                font-size: 4rem;
                margin-bottom: 20px;
                animation: bounce 1s infinite;
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }

            /* Mobile responsiveness */
            @media (max-width: 768px) {
                .countdown-container {
                    padding: 20px;
                    margin: 15px 0;
                }

                .countdown-display {
                    gap: 15px;
                }

                .countdown-value {
                    font-size: 2.5rem;
                }

                .countdown-unit {
                    min-width: 60px;
                }

                .countdown-separator {
                    font-size: 1.5rem;
                    margin: 0 5px;
                }
            }

            @media (max-width: 480px) {
                .countdown-display {
                    gap: 10px;
                }

                .countdown-value {
                    font-size: 2rem;
                }

                .countdown-title {
                    font-size: 1.5rem;
                }

                .countdown-separator {
                    display: none;
                }

                .completion-modal-content {
                    padding: 30px 20px;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    // Add completion modal styles
    addCompletionModalStyles() {
        if (document.getElementById('completion-modal-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'completion-modal-styles';
        styles.textContent = `
            .btn {
                padding: 12px 24px;
                border: none;
                border-radius: 25px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-block;
                margin-top: 15px;
            }

            .btn.primary {
                background: linear-gradient(135deg, #ff6b9d, #ff9a9e);
                color: white;
            }

            .btn.primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(255, 107, 157, 0.3);
            }
        `;

        document.head.appendChild(styles);
    }

    // Get all active countdowns
    getActiveCountdowns() {
        return Array.from(this.activeCountdowns.values());
    }

    // Clear all countdowns
    clearAllCountdowns() {
        this.activeCountdowns.forEach((countdown, id) => {
            this.removeCountdown(id);
        });
    }
}

// Initialize and export
const countdownSystem = new CountdownSystem();
window.countdownSystem = countdownSystem;