// Emoji Reaction System
// Interactive emoji reactions for enhanced user engagement

class EmojiReactionSystem {
    constructor() {
        this.reactions = {
            love: { emoji: '❤️', name: 'Love', color: '#e91e63' },
            heart_eyes: { emoji: '😍', name: 'Heart Eyes', color: '#ff6b9d' },
            kiss: { emoji: '😘', name: 'Kiss', color: '#f06292' },
            heart: { emoji: '💕', name: 'Hearts', color: '#ff9a9e' },
            fire: { emoji: '🔥', name: 'Fire', color: '#ff5722' },
            sparkles: { emoji: '✨', name: 'Sparkles', color: '#ffc107' },
            smile: { emoji: '😊', name: 'Smile', color: '#4caf50' },
            party: { emoji: '🎉', name: 'Party', color: '#9c27b0' },
            rose: { emoji: '🌹', name: 'Rose', color: '#e91e63' },
            gift: { emoji: '🎁', name: 'Gift', color: '#3f51b5' }
        };
        
        this.activeReactions = new Map();
        this.animationQueue = [];
    }

    // Create floating emoji reaction
    createFloatingReaction(emoji, x, y, options = {}) {
        const defaultOptions = {
            size: 40,
            duration: 2000,
            bounce: true,
            fade: true,
            physics: true
        };

        const config = { ...defaultOptions, ...options };
        
        const reactionElement = document.createElement('div');
        reactionElement.className = 'emoji-reaction floating';
        reactionElement.textContent = emoji;
        reactionElement.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: ${config.size}px;
            z-index: 9998;
            pointer-events: none;
            user-select: none;
            transform: scale(0);
            animation: emojiReactionFloat ${config.duration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        `;

        document.body.appendChild(reactionElement);

        // Remove after animation
        setTimeout(() => {
            if (reactionElement.parentNode) {
                reactionElement.parentNode.removeChild(reactionElement);
            }
        }, config.duration);

        return reactionElement;
    }

    // Create emoji burst effect
    createEmojiBurst(emoji, centerX, centerY, count = 8, options = {}) {
        const defaultOptions = {
            radius: 100,
            size: 30,
            duration: 1500,
            staggerDelay: 50
        };

        const config = { ...defaultOptions, ...options };

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const distance = config.radius * (0.5 + Math.random() * 0.5);
            
            const targetX = centerX + Math.cos(angle) * distance;
            const targetY = centerY + Math.sin(angle) * distance;

            setTimeout(() => {
                this.createFloatingReaction(emoji, centerX, centerY, {
                    ...config,
                    targetX,
                    targetY,
                    customAnimation: true
                });
            }, i * config.staggerDelay);
        }
    }

    // Add reaction button to element
    addReactionButton(targetElement, reactions = ['love', 'heart_eyes', 'kiss', 'heart']) {
        if (!targetElement) return;

        const reactionContainer = document.createElement('div');
        reactionContainer.className = 'emoji-reaction-container';
        
        const reactionButton = document.createElement('button');
        reactionButton.className = 'emoji-reaction-trigger';
        reactionButton.innerHTML = '💕';
        reactionButton.title = 'React with emoji';

        const reactionMenu = document.createElement('div');
        reactionMenu.className = 'emoji-reaction-menu';
        reactionMenu.style.display = 'none';

        reactions.forEach(reactionKey => {
            const reaction = this.reactions[reactionKey];
            if (!reaction) return;

            const reactionOption = document.createElement('button');
            reactionOption.className = 'emoji-reaction-option';
            reactionOption.innerHTML = reaction.emoji;
            reactionOption.title = reaction.name;
            reactionOption.style.setProperty('--reaction-color', reaction.color);

            reactionOption.addEventListener('click', (e) => {
                e.stopPropagation();
                this.triggerReaction(reaction.emoji, e.target);
                this.hideReactionMenu(reactionMenu);
            });

            reactionMenu.appendChild(reactionOption);
        });

        reactionButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleReactionMenu(reactionMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', () => {
            this.hideReactionMenu(reactionMenu);
        });

        reactionContainer.appendChild(reactionButton);
        reactionContainer.appendChild(reactionMenu);
        
        targetElement.appendChild(reactionContainer);
        
        // Add styles if not already present
        this.addReactionStyles();

        return reactionContainer;
    }

    // Toggle reaction menu visibility
    toggleReactionMenu(menu) {
        if (menu.style.display === 'none' || !menu.style.display) {
            this.showReactionMenu(menu);
        } else {
            this.hideReactionMenu(menu);
        }
    }

    // Show reaction menu with animation
    showReactionMenu(menu) {
        menu.style.display = 'flex';
        menu.style.opacity = '0';
        menu.style.transform = 'scale(0.8) translateY(10px)';
        
        setTimeout(() => {
            menu.style.opacity = '1';
            menu.style.transform = 'scale(1) translateY(0)';
        }, 10);
    }

    // Hide reaction menu with animation
    hideReactionMenu(menu) {
        menu.style.opacity = '0';
        menu.style.transform = 'scale(0.8) translateY(10px)';
        
        setTimeout(() => {
            menu.style.display = 'none';
        }, 200);
    }

    // Trigger emoji reaction
    triggerReaction(emoji, sourceElement) {
        const rect = sourceElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create floating reaction
        this.createFloatingReaction(emoji, centerX, centerY);

        // Add screen shake effect
        this.addScreenShake();

        // Trigger confetti if available
        if (window.confettiSystem && ['❤️', '💕', '🎉'].includes(emoji)) {
            setTimeout(() => {
                window.confettiSystem.burst(centerX, centerY, 10);
            }, 300);
        }

        // Play reaction sound if available
        this.playReactionSound(emoji);
    }

    // Add subtle screen shake effect
    addScreenShake() {
        const body = document.body;
        body.style.animation = 'emojiShake 0.3s ease-in-out';
        
        setTimeout(() => {
            body.style.animation = '';
        }, 300);
    }

    // Play reaction sound (placeholder for future implementation)
    playReactionSound(emoji) {
        // Could be implemented with Web Audio API or HTML5 audio
        // For now, just a visual feedback
        console.log(`🔊 Playing sound for ${emoji} reaction`);
    }

    // Quick love reaction anywhere on page
    quickLoveReaction(event) {
        if (!event) return;
        
        const emoji = '💕';
        const x = event.clientX || window.innerWidth / 2;
        const y = event.clientY || window.innerHeight / 2;
        
        this.createFloatingReaction(emoji, x, y);
        
        // Trigger small confetti burst
        if (window.confettiSystem) {
            window.confettiSystem.burst(x, y, 5);
        }
    }

    // Double click love reaction
    enableDoubleClickReactions() {
        let clickCount = 0;
        let clickTimer = null;

        document.addEventListener('click', (e) => {
            clickCount++;
            
            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 300);
            } else if (clickCount === 2) {
                clearTimeout(clickTimer);
                clickCount = 0;
                
                // Trigger love reaction at click position
                this.quickLoveReaction(e);
            }
        });
    }

    // Emoji rain effect
    createEmojiRain(emoji = '💕', duration = 3000, intensity = 3) {
        const rainInterval = setInterval(() => {
            for (let i = 0; i < intensity; i++) {
                const x = Math.random() * window.innerWidth;
                const y = -50;
                
                this.createFloatingReaction(emoji, x, y, {
                    size: 20 + Math.random() * 20,
                    duration: 3000 + Math.random() * 2000
                });
            }
        }, 200);

        setTimeout(() => {
            clearInterval(rainInterval);
        }, duration);
    }

    // Celebration mode - multiple emoji effects
    celebrationMode() {
        const celebrationEmojis = ['🎉', '🎊', '✨', '💕', '❤️', '🌟'];
        
        celebrationEmojis.forEach((emoji, index) => {
            setTimeout(() => {
                this.createEmojiBurst(emoji, 
                    window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                    window.innerHeight / 2 + (Math.random() - 0.5) * 100,
                    6
                );
            }, index * 200);
        });

        // Follow with emoji rain
        setTimeout(() => {
            this.createEmojiRain('✨', 2000, 2);
        }, 1000);
    }

    // Add reaction styles
    addReactionStyles() {
        if (document.getElementById('emoji-reaction-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'emoji-reaction-styles';
        styles.textContent = `
            .emoji-reaction-container {
                position: relative;
                display: inline-block;
            }

            .emoji-reaction-trigger {
                background: rgba(255, 255, 255, 0.9);
                border: 2px solid var(--primary-color, #ff6b9d);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(10px);
            }

            .emoji-reaction-trigger:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);
                background: rgba(255, 255, 255, 1);
            }

            .emoji-reaction-menu {
                position: absolute;
                bottom: 50px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.95);
                border-radius: 25px;
                padding: 8px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                display: flex;
                gap: 5px;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 1000;
            }

            .emoji-reaction-option {
                background: transparent;
                border: none;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                font-size: 20px;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
            }

            .emoji-reaction-option:hover {
                transform: scale(1.3);
                background: var(--reaction-color, #ff6b9d);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }

            .emoji-reaction-option:active {
                transform: scale(1.1);
            }

            @keyframes emojiReactionFloat {
                0% {
                    transform: scale(0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    transform: scale(1.2) rotate(10deg);
                    opacity: 1;
                }
                90% {
                    transform: scale(0.8) translateY(-100px) rotate(-10deg);
                    opacity: 0.8;
                }
                100% {
                    transform: scale(0.3) translateY(-150px) rotate(-20deg);
                    opacity: 0;
                }
            }

            @keyframes emojiShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
            }

            .emoji-reaction.floating {
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
            }

            /* Mobile responsiveness */
            @media (max-width: 768px) {
                .emoji-reaction-trigger {
                    width: 35px;
                    height: 35px;
                    font-size: 16px;
                }

                .emoji-reaction-option {
                    width: 30px;
                    height: 30px;
                    font-size: 18px;
                }

                .emoji-reaction-menu {
                    bottom: 45px;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    // Initialize with double-click reactions
    init() {
        this.enableDoubleClickReactions();
        this.addReactionStyles();
    }
}

// Initialize and export
const emojiReactionSystem = new EmojiReactionSystem();
window.emojiReactionSystem = emojiReactionSystem;

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    emojiReactionSystem.init();
});