// Social Sharing Utilities
// Modern social media sharing functionality

class SocialSharing {
    constructor() {
        this.appName = 'Expressing Love';
        this.baseUrl = window.location.origin;
        this.defaultMessage = '💕 Express your love in the most beautiful way! ';
    }

    // Share on Facebook
    shareOnFacebook(url, title, description) {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url || this.getCurrentUrl())}&quote=${encodeURIComponent(title || this.defaultMessage)}`;
        this.openPopup(shareUrl, 'facebook-share', 600, 400);
    }

    // Share on Twitter/X
    shareOnTwitter(text, url, hashtags) {
        const twitterText = text || this.defaultMessage;
        const twitterUrl = url || this.getCurrentUrl();
        const twitterHashtags = hashtags || 'ExpressingLove,Love,Romance';
        
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(twitterUrl)}&hashtags=${encodeURIComponent(twitterHashtags)}`;
        this.openPopup(shareUrl, 'twitter-share', 550, 420);
    }

    // Share on WhatsApp
    shareOnWhatsApp(text, url) {
        const message = `${text || this.defaultMessage} ${url || this.getCurrentUrl()}`;
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        
        if (this.isMobile()) {
            window.open(shareUrl, '_blank');
        } else {
            window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
        }
    }

    // Share on Telegram
    shareOnTelegram(text, url) {
        const message = text || this.defaultMessage;
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url || this.getCurrentUrl())}&text=${encodeURIComponent(message)}`;
        this.openPopup(shareUrl, 'telegram-share', 600, 400);
    }

    // Share on LinkedIn
    shareOnLinkedIn(url, title, summary) {
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url || this.getCurrentUrl())}&title=${encodeURIComponent(title || this.appName)}&summary=${encodeURIComponent(summary || this.defaultMessage)}`;
        this.openPopup(shareUrl, 'linkedin-share', 600, 400);
    }

    // Share on Pinterest
    shareOnPinterest(url, media, description) {
        const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url || this.getCurrentUrl())}&media=${encodeURIComponent(media || '')}&description=${encodeURIComponent(description || this.defaultMessage)}`;
        this.openPopup(shareUrl, 'pinterest-share', 750, 320);
    }

    // Native Web Share API (for supported browsers)
    async nativeShare(data) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: data.title || this.appName,
                    text: data.text || this.defaultMessage,
                    url: data.url || this.getCurrentUrl()
                });
                return { success: true };
            } catch (error) {
                console.log('Native sharing failed:', error);
                return { success: false, error: error.message };
            }
        } else {
            return { success: false, error: 'Native sharing not supported' };
        }
    }

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text || this.getCurrentUrl());
            this.showToast('Link copied to clipboard!', 'success');
            return { success: true };
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            // Fallback for older browsers
            this.fallbackCopyToClipboard(text || this.getCurrentUrl());
            return { success: true };
        }
    }

    // Fallback copy method for older browsers
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showToast('Link copied to clipboard!', 'success');
        } catch (error) {
            console.error('Fallback copy failed:', error);
            this.showToast('Failed to copy link', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    // Generate QR Code using qr-server.com API
    generateQRCode(url, size = 200) {
        const qrUrl = url || this.getCurrentUrl();
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrUrl)}`;
        return qrCodeUrl;
    }

    // Show QR Code modal
    showQRCodeModal(url) {
        const qrCodeUrl = this.generateQRCode(url);
        const modal = document.createElement('div');
        modal.className = 'qr-modal';
        modal.innerHTML = `
            <div class="qr-modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="qr-modal-content">
                <div class="qr-modal-header">
                    <h3>📱 Share via QR Code</h3>
                    <button onclick="this.closest('.qr-modal').remove()" class="qr-close">&times;</button>
                </div>
                <div class="qr-modal-body">
                    <div class="qr-code-container">
                        <img src="${qrCodeUrl}" alt="QR Code" class="qr-code-image">
                    </div>
                    <p>Scan this QR code to visit the page</p>
                    <div class="qr-actions">
                        <button onclick="window.socialSharing.downloadQRCode('${qrCodeUrl}')" class="btn primary">
                            📥 Download QR Code
                        </button>
                        <button onclick="window.socialSharing.copyToClipboard('${url || this.getCurrentUrl()}')" class="btn secondary">
                            📋 Copy Link
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles if not already present
        this.addQRModalStyles();
        
        document.body.appendChild(modal);
        
        // Add animation
        setTimeout(() => modal.classList.add('show'), 10);
    }

    // Download QR Code
    downloadQRCode(qrCodeUrl) {
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `qr-code-${Date.now()}.png`;
        link.click();
    }

    // Email sharing
    shareViaEmail(subject, body, url) {
        const emailSubject = subject || `Check out ${this.appName}!`;
        const emailBody = `${body || this.defaultMessage}\n\n${url || this.getCurrentUrl()}`;
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.open(mailtoUrl);
    }

    // SMS sharing (mobile only)
    shareViaSMS(text, url) {
        if (this.isMobile()) {
            const message = `${text || this.defaultMessage} ${url || this.getCurrentUrl()}`;
            window.open(`sms:?body=${encodeURIComponent(message)}`);
        } else {
            this.showToast('SMS sharing is only available on mobile devices', 'info');
        }
    }

    // Utility methods
    getCurrentUrl() {
        return window.location.href;
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    openPopup(url, name, width, height) {
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);
        const popup = window.open(url, name, `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`);
        
        if (popup) {
            popup.focus();
        } else {
            this.showToast('Please allow popups for social sharing', 'error');
        }
    }

    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `social-toast ${type}`;
        toast.textContent = message;
        
        // Add styles if not already present
        this.addToastStyles();
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Add QR modal styles
    addQRModalStyles() {
        if (document.getElementById('qr-modal-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'qr-modal-styles';
        styles.textContent = `
            .qr-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(5px);
            }
            
            .qr-modal.show {
                opacity: 1;
            }
            
            .qr-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            
            .qr-modal-content {
                background: white;
                border-radius: 20px;
                max-width: 400px;
                width: 90%;
                position: relative;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .qr-modal.show .qr-modal-content {
                transform: scale(1);
            }
            
            .qr-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 25px;
                border-bottom: 1px solid #eee;
                background: linear-gradient(135deg, #ff6b9d, #ff9a9e);
                color: white;
                border-radius: 20px 20px 0 0;
            }
            
            .qr-modal-header h3 {
                margin: 0;
                font-size: 1.3rem;
            }
            
            .qr-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: white;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s ease;
            }
            
            .qr-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .qr-modal-body {
                padding: 30px 25px;
                text-align: center;
            }
            
            .qr-code-container {
                margin: 20px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 15px;
                display: inline-block;
            }
            
            .qr-code-image {
                max-width: 200px;
                height: auto;
                border-radius: 10px;
            }
            
            .qr-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin-top: 25px;
            }
            
            .qr-actions .btn {
                padding: 12px 20px;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
                text-decoration: none;
                display: inline-block;
                transition: all 0.3s ease;
            }
            
            .qr-actions .btn.primary {
                background: linear-gradient(135deg, #ff6b9d, #ff9a9e);
                color: white;
            }
            
            .qr-actions .btn.secondary {
                background: #f8f9fa;
                color: #333;
                border: 2px solid #ddd;
            }
            
            .qr-actions .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            @media (max-width: 480px) {
                .qr-modal-content {
                    width: 95%;
                    margin: 10px;
                }
                
                .qr-actions {
                    flex-direction: column;
                    gap: 10px;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // Add toast styles
    addToastStyles() {
        if (document.getElementById('social-toast-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'social-toast-styles';
        styles.textContent = `
            .social-toast {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 50px;
                color: white;
                font-weight: bold;
                z-index: 1001;
                transform: translateX(100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                max-width: 350px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
            }
            
            .social-toast.show {
                transform: translateX(0);
            }
            
            .social-toast.success {
                background: linear-gradient(135deg, #4caf50, #66bb6a);
            }
            
            .social-toast.error {
                background: linear-gradient(135deg, #f44336, #ef5350);
            }
            
            .social-toast.info {
                background: linear-gradient(135deg, #2196f3, #42a5f5);
            }
            
            @media (max-width: 480px) {
                .social-toast {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    text-align: center;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Initialize and export
const socialSharing = new SocialSharing();
window.socialSharing = socialSharing;