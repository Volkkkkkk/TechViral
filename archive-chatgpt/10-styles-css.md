# Styles CSS TechViral - System Design

## Variables CSS Principales

### Palette de Couleurs
```css
:root {
  --primary: #6366f1;      /* Indigo moderne */
  --secondary: #f59e0b;    /* Amber vibrant */
  --accent: #10b981;       /* Emerald success */
  --warm: #fef7ed;         /* Orange warm background */
  --cool: #f0f9ff;         /* Blue cool background */
  --mocha-mousse: #8B5A2B; /* Tendance 2025 */
}
```

### Effets Glassmorphisme
```css
--glass-bg: rgba(255, 255, 255, 0.1);
--glass-border: rgba(255, 255, 255, 0.2);
--glass-strong: rgba(255, 255, 255, 0.2) + blur(20px);
```

### Ombres Modernes
```css
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

## Animations et Micro-interactions

### Animations Principales
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes glow {
  0% { box-shadow: 0 0 5px var(--primary); }
  100% { box-shadow: 0 0 20px var(--primary), 0 0 30px var(--primary); }
}

@keyframes slideUp {
  0% { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes cartBounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
  50% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

## Composants de Design

### Boutons Modernes
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 1rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  /* Effet shimmer au hover */
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2xl);
}
```

### Effets de Verre (Glassmorphisme)
```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
}

.glass-strong {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### Neumorphisme (2025 Trend)
```css
.neomorphism {
  background: #f0f4f7;
  box-shadow: 
    20px 20px 60px #d1d9e6,
    -20px -20px 60px #ffffff;
}

.neomorphism-inset {
  box-shadow: 
    inset 20px 20px 60px #d1d9e6,
    inset -20px -20px 60px #ffffff;
}
```

## Cartes Produits

### Hover Effects
```css
.product-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-8px) rotateX(5deg);
  box-shadow: 0 25px 50px rgba(0,0,0,0.15);
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.5s;
}

.product-card:hover::before {
  left: 100%;
}
```

### Badges et Labels
```css
.badge-new {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 9999px;
  animation: pulse-glow 2s infinite;
}

.badge-promo {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  animation: glow 1.5s ease-in-out infinite alternate;
}
```

## Navigation et Interface

### Mega Menu
```css
.mega-menu {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.15);
  transform-origin: top;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.submenu-link {
  transition: all 0.2s ease;
  position: relative;
}

.submenu-link:hover {
  transform: translateX(4px);
}

.submenu-link::before {
  content: '';
  position: absolute;
  left: -8px;
  width: 2px;
  height: 0;
  background: var(--primary);
  transition: height 0.2s ease;
}

.submenu-link:hover::before {
  height: 16px;
}
```

### Barre de Recherche
```css
.search-bar {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideDown 0.3s ease-out;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--primary);
  background: rgba(255, 255, 255, 0.9);
}
```

## Mode Sombre

### Variables Dark Mode
```css
.dark {
  --glass-bg: rgba(0, 0, 0, 0.3);
  --glass-border: rgba(255, 255, 255, 0.1);
}

.dark .neomorphism {
  background: #2a2d3a;
  box-shadow: 
    20px 20px 60px #1e1f29,
    -20px -20px 60px #36394b;
}
```

### Transition Mode
```css
* {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

## Scrollbar Personnalisée

```css
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.dark ::-webkit-scrollbar-track {
  background: #1e293b;
}

::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary);
}
```

## Filtres et Boutons

### Boutons de Filtre
```css
.filter-btn {
  background: rgba(156, 163, 175, 0.1);
  color: #6b7280;
  border: 1px solid rgba(156, 163, 175, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-btn:hover, .filter-btn.active {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border-color: transparent;
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
}
```

## Responsive Design

### Breakpoints Principaux
```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Adaptations Mobile
```css
@media (max-width: 768px) {
  .mega-menu {
    left: 50%;
    transform: translateX(-50%);
    max-width: 90vw;
  }
  
  .product-card:hover {
    transform: none; /* Disable 3D hover on mobile */
  }
}
```

Ce système de styles CSS moderne combine les tendances 2025 (glassmorphisme, neumorphisme, micro-interactions) avec une base solide Tailwind CSS pour créer une expérience visuelle premium et performante.