// Confetti Animation System
// Beautiful confetti effects for celebrations

class ConfettiSystem {
    constructor() {
        this.isActive = false;
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.colors = ['#ff6b9d', '#ff9a9e', '#ffc1cc', '#ffb3ba', '#bae1ff', '#b3d9ff', '#c7ceea'];
    }

    // Initialize canvas
    init() {
        if (this.canvas) return;

        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        this.canvas.id = 'confetti-canvas';

        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    // Resize canvas
    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Create confetti particle
    createParticle(x, y) {
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || -10,
            vx: (Math.random() - 0.5) * 6,
            vy: Math.random() * -8 - 2,
            gravity: 0.3,
            friction: 0.99,
            opacity: 1,
            decay: Math.random() * 0.02 + 0.01,
            size: Math.random() * 8 + 4,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            shape: Math.random() > 0.5 ? 'circle' : 'square'
        };
    }

    // Update particle physics
    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += particle.gravity;
        particle.vx *= particle.friction;
        particle.vy *= particle.friction;
        particle.opacity -= particle.decay;
        particle.rotation += particle.rotationSpeed;

        return particle.opacity > 0 && particle.y < this.canvas.height + 100;
    }

    // Draw particle
    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation * Math.PI / 180);
        this.ctx.fillStyle = particle.color;

        if (particle.shape === 'circle') {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        }

        this.ctx.restore();
    }

    // Animation loop
    animate() {
        if (!this.isActive) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            if (this.updateParticle(particle)) {
                this.drawParticle(particle);
                return true;
            }
            return false;
        });

        // Continue animation if particles exist or still active
        if (this.particles.length > 0 || this.isActive) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.stop();
        }
    }

    // Start confetti burst
    burst(x, y, particleCount = 50) {
        this.init();
        
        const centerX = x !== undefined ? x : this.canvas.width / 2;
        const centerY = y !== undefined ? y : this.canvas.height / 2;

        for (let i = 0; i < particleCount; i++) {
            const particle = this.createParticle(centerX, centerY);
            particle.vx = (Math.random() - 0.5) * 12;
            particle.vy = Math.random() * -15 - 5;
            this.particles.push(particle);
        }

        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }

    // Continuous confetti rain
    rain(duration = 3000, intensity = 3) {
        this.init();
        this.isActive = true;

        const rainInterval = setInterval(() => {
            if (!this.isActive) {
                clearInterval(rainInterval);
                return;
            }

            for (let i = 0; i < intensity; i++) {
                const particle = this.createParticle(
                    Math.random() * this.canvas.width,
                    -20
                );
                particle.vy = Math.random() * 3 + 2;
                this.particles.push(particle);
            }
        }, 100);

        // Stop rain after duration
        setTimeout(() => {
            this.isActive = false;
            clearInterval(rainInterval);
        }, duration);

        this.animate();
    }

    // Heart-shaped confetti burst
    heartBurst(x, y, particleCount = 60) {
        this.init();
        
        const centerX = x !== undefined ? x : this.canvas.width / 2;
        const centerY = y !== undefined ? y : this.canvas.height / 2;

        // Create heart shape pattern
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const heartX = 16 * Math.pow(Math.sin(angle), 3);
            const heartY = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
            
            const particle = this.createParticle(centerX, centerY);
            particle.vx = heartX * 0.3 + (Math.random() - 0.5) * 2;
            particle.vy = heartY * 0.3 - Math.random() * 3;
            particle.color = ['#ff6b9d', '#ff9a9e', '#ffc1cc', '#ffb3ba'][Math.floor(Math.random() * 4)];
            this.particles.push(particle);
        }

        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }

    // Firework effect
    firework(x, y, particleCount = 80) {
        this.init();
        
        const centerX = x !== undefined ? x : this.canvas.width / 2;
        const centerY = y !== undefined ? y : this.canvas.height * 0.3;

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = Math.random() * 8 + 4;
            
            const particle = this.createParticle(centerX, centerY);
            particle.vx = Math.cos(angle) * velocity;
            particle.vy = Math.sin(angle) * velocity;
            particle.gravity = 0.2;
            particle.size = Math.random() * 6 + 2;
            this.particles.push(particle);
        }

        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }

    // Stop all animations
    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.particles = [];
        if (this.canvas && this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    // Remove canvas
    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
            this.canvas = null;
            this.ctx = null;
        }
    }

    // Gift celebration - combines multiple effects
    giftCelebration(x, y) {
        // Start with a heart burst
        this.heartBurst(x, y, 40);
        
        // Follow with firework
        setTimeout(() => {
            this.firework(x, y, 60);
        }, 500);
        
        // End with confetti rain
        setTimeout(() => {
            this.rain(2000, 2);
        }, 1000);
    }

    // Success celebration
    successCelebration() {
        // Multiple bursts across screen
        this.burst(this.canvas.width * 0.2, this.canvas.height * 0.3, 30);
        setTimeout(() => this.burst(this.canvas.width * 0.8, this.canvas.height * 0.3, 30), 200);
        setTimeout(() => this.burst(this.canvas.width * 0.5, this.canvas.height * 0.2, 40), 400);
        setTimeout(() => this.rain(2500, 3), 600);
    }

    // Love explosion effect
    loveExplosion(x, y) {
        const centerX = x !== undefined ? x : this.canvas.width / 2;
        const centerY = y !== undefined ? y : this.canvas.height / 2;
        
        this.init();

        // Create multiple waves of hearts
        for (let wave = 0; wave < 3; wave++) {
            setTimeout(() => {
                for (let i = 0; i < 20; i++) {
                    const particle = this.createParticle(centerX, centerY);
                    const angle = (i / 20) * Math.PI * 2;
                    const velocity = (wave + 1) * 4;
                    
                    particle.vx = Math.cos(angle) * velocity;
                    particle.vy = Math.sin(angle) * velocity;
                    particle.color = ['#ff1744', '#ff6b9d', '#ff9a9e', '#ffc1cc'][Math.floor(Math.random() * 4)];
                    particle.size = Math.random() * 10 + 6;
                    particle.shape = 'heart';
                    
                    this.particles.push(particle);
                }
            }, wave * 300);
        }

        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }

    // Custom particle shape (heart)
    drawHeart(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size / 20, size / 20);
        ctx.fillStyle = ctx.fillStyle || '#ff6b9d';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-10, -5, -20, 5, 0, 15);
        ctx.bezierCurveTo(20, 5, 10, -5, 0, 0);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize and export
const confettiSystem = new ConfettiSystem();
window.confettiSystem = confettiSystem;