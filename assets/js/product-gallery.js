/**
 * TechViral - Galerie Produit 360° Interactive
 * Système avancé de galerie avec rotation 360°, zoom et plein écran
 */

class ProductGallery {
    constructor(options = {}) {
        this.options = {
            images: [],
            images360: [],
            autoRotate: false,
            zoomLevel: 1,
            maxZoom: 3,
            enableTouch: true,
            enableKeyboard: true,
            ...options
        };
        
        this.currentIndex = 0;
        this.currentViewType = 'standard';
        this.zoomLevel = 1;
        this.isRotating = false;
        this.isDragging = false;
        
        this.elements = {};
        this.touchStartX = 0;
        this.touchStartY = 0;
        
        this.init();
    }

    init() {
        this.initializeElements();
        this.loadDefaultImages();
        this.setupEventListeners();
        this.setupKeyboardControls();
        this.setupTouchControls();
        this.loadFirstImage();
        
        console.log('Product Gallery initialized');
    }

    initializeElements() {
        this.elements = {
            mainImage: document.getElementById('mainProductImage'),
            thumbnailsTrack: document.getElementById('thumbnailsTrack'),
            thumbCounter: document.getElementById('thumbCounter'),
            viewTypeBadge: document.getElementById('viewTypeBadge'),
            imageLoader: document.getElementById('imageLoader'),
            fullscreenGallery: document.getElementById('fullscreenGallery'),
            fullscreenImage: document.getElementById('fullscreenImage'),
            fullscreenTitle: document.getElementById('fullscreenTitle'),
            fullscreenThumbs: document.getElementById('fullscreenThumbs'),
            
            // Controls
            zoomIn: document.getElementById('zoomIn'),
            zoomOut: document.getElementById('zoomOut'),
            resetZoom: document.getElementById('resetZoom'),
            rotate360: document.getElementById('rotate360'),
            prevThumb: document.getElementById('prevThumb'),
            nextThumb: document.getElementById('nextThumb'),
            closeFullscreen: document.getElementById('closeFullscreen'),
            fullscreenPrev: document.getElementById('fullscreenPrev'),
            fullscreenNext: document.getElementById('fullscreenNext'),
            fullscreenShare: document.getElementById('fullscreenShare')
        };
    }

    loadDefaultImages() {
        // Images par défaut si aucune n'est fournie
        if (this.options.images.length === 0) {
            this.options.images = [
                {
                    src: '/assets/images/products/product-1-main.jpg',
                    alt: 'Vue principale',
                    type: 'main'
                },
                {
                    src: '/assets/images/products/product-1-side.jpg',
                    alt: 'Vue de côté',
                    type: 'side'
                },
                {
                    src: '/assets/images/products/product-1-back.jpg',
                    alt: 'Vue arrière',
                    type: 'back'
                },
                {
                    src: '/assets/images/products/product-1-detail.jpg',
                    alt: 'Détails',
                    type: 'detail'
                },
                {
                    src: '/assets/images/products/product-1-package.jpg',
                    alt: 'Contenu du paquet',
                    type: 'package'
                },
                {
                    src: '/assets/images/products/product-1-lifestyle.jpg',
                    alt: 'En situation',
                    type: 'lifestyle'
                }
            ];
        }
        
        // Images 360° par défaut
        if (this.options.images360.length === 0) {
            // Générer 24 images pour la vue 360°
            for (let i = 1; i <= 24; i++) {
                this.options.images360.push({
                    src: `/assets/images/products/360/frame-${i.toString().padStart(3, '0')}.jpg`,
                    angle: (i - 1) * 15
                });
            }
        }
    }

    setupEventListeners() {
        // Zoom controls
        this.elements.zoomIn?.addEventListener('click', () => this.zoomIn());
        this.elements.zoomOut?.addEventListener('click', () => this.zoomOut());
        this.elements.resetZoom?.addEventListener('click', () => this.resetZoom());
        
        // 360° rotation
        this.elements.rotate360?.addEventListener('click', () => this.toggle360View());
        
        // Thumbnail navigation
        this.elements.prevThumb?.addEventListener('click', () => this.previousImage());
        this.elements.nextThumb?.addEventListener('click', () => this.nextImage());
        
        // View type buttons
        document.querySelectorAll('.view-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const viewType = btn.dataset.type;
                if (!btn.disabled) {
                    this.switchViewType(viewType);
                }
            });
        });
        
        // Fullscreen controls
        this.elements.closeFullscreen?.addEventListener('click', () => this.closeFullscreen());
        this.elements.fullscreenPrev?.addEventListener('click', () => this.previousImage(true));
        this.elements.fullscreenNext?.addEventListener('click', () => this.nextImage(true));
        this.elements.fullscreenShare?.addEventListener('click', () => this.shareImage());
        
        // Double-click to fullscreen
        this.elements.mainImage?.addEventListener('dblclick', () => this.openFullscreen());
        
        // Mouse wheel zoom
        this.elements.mainImage?.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        });
        
        // Image loading
        this.elements.mainImage?.addEventListener('load', () => this.hideLoader());
        this.elements.mainImage?.addEventListener('error', () => this.handleImageError());
    }

    setupKeyboardControls() {
        if (!this.options.enableKeyboard) return;
        
        document.addEventListener('keydown', (e) => {
            if (this.elements.fullscreenGallery.classList.contains('hidden')) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousImage(true);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextImage(true);
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.closeFullscreen();
                    break;
                case '+':
                case '=':
                    e.preventDefault();
                    this.zoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    this.zoomOut();
                    break;
                case '0':
                    e.preventDefault();
                    this.resetZoom();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggle360View();
                    break;
            }
        });
    }

    setupTouchControls() {
        if (!this.options.enableTouch) return;
        
        const mainImage = this.elements.mainImage;
        if (!mainImage) return;
        
        // Touch events for swipe navigation
        mainImage.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        });
        
        mainImage.addEventListener('touchend', (e) => {
            if (!this.touchStartX || !this.touchStartY) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = this.touchStartX - touchEndX;
            const deltaY = this.touchStartY - touchEndY;
            
            // Swipe horizontal (navigation)
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > 50) {
                    if (deltaX > 0) {
                        this.nextImage();
                    } else {
                        this.previousImage();
                    }
                }
            }
            
            // Swipe vertical (zoom)
            else if (Math.abs(deltaY) > 50) {
                if (deltaY > 0) {
                    this.zoomOut();
                } else {
                    this.zoomIn();
                }
            }
            
            this.touchStartX = 0;
            this.touchStartY = 0;
        });
        
        // Pinch to zoom (simplified)
        let lastTouchDistance = 0;
        
        mainImage.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                
                const distance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                
                if (lastTouchDistance > 0) {
                    if (distance > lastTouchDistance + 10) {
                        this.zoomIn();
                    } else if (distance < lastTouchDistance - 10) {
                        this.zoomOut();
                    }
                }
                
                lastTouchDistance = distance;
            }
        });
        
        mainImage.addEventListener('touchend', () => {
            lastTouchDistance = 0;
        });
    }

    loadFirstImage() {
        if (this.options.images.length > 0) {
            this.loadImage(0);
            this.generateThumbnails();
            this.updateCounter();
        }
    }

    loadImage(index, isFullscreen = false) {
        const image = this.options.images[index];
        if (!image) return;
        
        const targetImg = isFullscreen ? this.elements.fullscreenImage : this.elements.mainImage;
        
        this.showLoader();
        
        // Précharger l'image
        const img = new Image();
        img.onload = () => {
            targetImg.src = image.src;
            targetImg.alt = image.alt;
            this.currentIndex = index;
            this.updateThumbnailsActive();
            this.updateCounter();
            this.hideLoader();
        };
        
        img.onerror = () => {
            this.handleImageError();
        };
        
        img.src = image.src;
    }

    generateThumbnails() {
        if (!this.elements.thumbnailsTrack) return;
        
        this.elements.thumbnailsTrack.innerHTML = '';
        
        this.options.images.forEach((image, index) => {
            const thumb = document.createElement('div');
            thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumb.innerHTML = `<img src="${image.src}" alt="${image.alt}" loading="lazy">`;
            
            thumb.addEventListener('click', () => {
                this.loadImage(index);
            });
            
            this.elements.thumbnailsTrack.appendChild(thumb);
        });
        
        // Generate fullscreen thumbnails
        if (this.elements.fullscreenThumbs) {
            this.elements.fullscreenThumbs.innerHTML = '';
            
            this.options.images.forEach((image, index) => {
                const thumb = document.createElement('div');
                thumb.className = 'w-12 h-12 rounded cursor-pointer overflow-hidden border-2 border-transparent hover:border-white/50 transition-all';
                thumb.innerHTML = `<img src="${image.src}" alt="${image.alt}" class="w-full h-full object-cover">`;
                
                thumb.addEventListener('click', () => {
                    this.loadImage(index, true);
                });
                
                this.elements.fullscreenThumbs.appendChild(thumb);
            });
        }
    }

    updateThumbnailsActive() {
        const thumbnails = this.elements.thumbnailsTrack?.querySelectorAll('.thumbnail');
        thumbnails?.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update fullscreen thumbnails
        const fullscreenThumbs = this.elements.fullscreenThumbs?.children;
        if (fullscreenThumbs) {
            Array.from(fullscreenThumbs).forEach((thumb, index) => {
                thumb.classList.toggle('border-white', index === this.currentIndex);
                thumb.classList.toggle('border-transparent', index !== this.currentIndex);
            });
        }
    }

    updateCounter() {
        if (this.elements.thumbCounter) {
            this.elements.thumbCounter.textContent = 
                `${this.currentIndex + 1}/${this.options.images.length}`;
        }
        
        if (this.elements.fullscreenTitle) {
            const image = this.options.images[this.currentIndex];
            this.elements.fullscreenTitle.textContent = 
                `${image?.alt || 'Image'} - ${this.currentIndex + 1} sur ${this.options.images.length}`;
        }
    }

    previousImage(isFullscreen = false) {
        const newIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.options.images.length - 1;
        this.loadImage(newIndex, isFullscreen);
    }

    nextImage(isFullscreen = false) {
        const newIndex = this.currentIndex < this.options.images.length - 1 ? this.currentIndex + 1 : 0;
        this.loadImage(newIndex, isFullscreen);
    }

    zoomIn() {
        if (this.zoomLevel < this.options.maxZoom) {
            this.zoomLevel += 0.2;
            this.applyZoom();
        }
    }

    zoomOut() {
        if (this.zoomLevel > 1) {
            this.zoomLevel -= 0.2;
            this.applyZoom();
        }
    }

    resetZoom() {
        this.zoomLevel = 1;
        this.applyZoom();
    }

    applyZoom() {
        const images = [this.elements.mainImage, this.elements.fullscreenImage];
        
        images.forEach(img => {
            if (img) {
                img.style.transform = `scale(${this.zoomLevel})`;
                
                if (this.zoomLevel > 1) {
                    img.style.cursor = 'grab';
                    img.parentElement.classList.add('zoomed');
                } else {
                    img.style.cursor = 'default';
                    img.parentElement.classList.remove('zoomed');
                }
            }
        });
        
        this.updateViewBadge();
    }

    switchViewType(type) {
        const viewButtons = document.querySelectorAll('.view-type-btn');
        viewButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        
        this.currentViewType = type;
        
        switch(type) {
            case 'standard':
                this.resetZoom();
                this.stop360Rotation();
                break;
            case '360':
                this.start360View();
                break;
            case 'zoom':
                this.zoomLevel = 2;
                this.applyZoom();
                break;
            case 'ar':
                // AR functionality would be implemented here
                this.showARNotification();
                break;
        }
        
        this.updateViewBadge();
    }

    start360View() {
        if (this.options.images360.length === 0) {
            this.show360NotAvailable();
            return;
        }
        
        this.currentViewType = '360';
        this.isRotating = true;
        
        // Show 360° controls
        const controls360 = document.getElementById('controls360');
        if (controls360) {
            controls360.classList.remove('hidden');
        }
        
        // Start rotation animation
        this.animate360();
    }

    animate360() {
        if (!this.isRotating) return;
        
        let currentFrame = 0;
        const totalFrames = this.options.images360.length;
        
        const rotateInterval = setInterval(() => {
            if (!this.isRotating) {
                clearInterval(rotateInterval);
                return;
            }
            
            const frame = this.options.images360[currentFrame];
            if (frame && this.elements.mainImage) {
                this.elements.mainImage.src = frame.src;
            }
            
            currentFrame = (currentFrame + 1) % totalFrames;
        }, 100);
    }

    stop360Rotation() {
        this.isRotating = false;
        
        // Hide 360° controls
        const controls360 = document.getElementById('controls360');
        if (controls360) {
            controls360.classList.add('hidden');
        }
        
        // Return to current standard image
        this.loadImage(this.currentIndex);
    }

    toggle360View() {
        if (this.currentViewType === '360') {
            this.switchViewType('standard');
        } else {
            this.switchViewType('360');
        }
    }

    updateViewBadge() {
        if (!this.elements.viewTypeBadge) return;
        
        let badgeText = '';
        
        switch(this.currentViewType) {
            case 'standard':
                badgeText = this.zoomLevel > 1 ? `Vue Standard (${Math.round(this.zoomLevel * 100)}%)` : 'Vue Standard';
                break;
            case '360':
                badgeText = 'Vue 360°';
                break;
            case 'zoom':
                badgeText = `Zoom HD (${Math.round(this.zoomLevel * 100)}%)`;
                break;
            case 'ar':
                badgeText = 'Réalité Augmentée';
                break;
        }
        
        this.elements.viewTypeBadge.querySelector('div').textContent = badgeText;
    }

    openFullscreen() {
        this.elements.fullscreenGallery?.classList.remove('hidden');
        this.loadImage(this.currentIndex, true);
        document.body.style.overflow = 'hidden';
    }

    closeFullscreen() {
        this.elements.fullscreenGallery?.classList.add('hidden');
        document.body.style.overflow = '';
    }

    shareImage() {
        const image = this.options.images[this.currentIndex];
        
        if (navigator.share) {
            navigator.share({
                title: 'TechViral - ' + (image?.alt || 'Produit'),
                text: 'Découvrez ce produit sur TechViral',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Lien copié dans le presse-papier');
            });
        }
    }

    showLoader() {
        this.elements.imageLoader?.classList.remove('hidden');
        this.elements.mainImage?.classList.add('loading-pulse');
    }

    hideLoader() {
        this.elements.imageLoader?.classList.add('hidden');
        this.elements.mainImage?.classList.remove('loading-pulse');
    }

    handleImageError() {
        this.hideLoader();
        
        if (this.elements.mainImage) {
            this.elements.mainImage.src = '/assets/images/placeholder-error.svg';
            this.elements.mainImage.alt = 'Erreur de chargement de l\'image';
        }
        
        this.showNotification('Erreur lors du chargement de l\'image', 'error');
    }

    show360NotAvailable() {
        this.showNotification('Vue 360° non disponible pour ce produit', 'warning');
        
        // Reset to standard view
        this.switchViewType('standard');
    }

    showARNotification() {
        this.showNotification('Fonctionnalité AR bientôt disponible !', 'info');
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-60 px-4 py-3 rounded-lg text-white text-sm font-medium transform transition-all duration-300 translate-x-full`;
        
        // Set background color based on type
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        
        notification.classList.add(colors[type] || colors.info);
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Public methods for external control
    setImages(images, images360 = []) {
        this.options.images = images;
        this.options.images360 = images360;
        this.currentIndex = 0;
        this.loadFirstImage();
    }

    getCurrentImage() {
        return this.options.images[this.currentIndex];
    }

    goToImage(index) {
        if (index >= 0 && index < this.options.images.length) {
            this.loadImage(index);
        }
    }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if gallery container exists
    if (document.querySelector('.product-gallery')) {
        window.productGallery = new ProductGallery();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductGallery;
}