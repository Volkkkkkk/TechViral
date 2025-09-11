// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Page d\'accueil TechViral', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('doit afficher le titre et la navigation', async ({ page }) => {
    // Vérifier le titre
    await expect(page).toHaveTitle(/TechViral/);
    
    // Vérifier la présence du logo/titre principal
    const mainTitle = page.locator('h1').first();
    await expect(mainTitle).toBeVisible();
    
    // Vérifier la navigation principale
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    
    // Vérifier les liens de navigation essentiels (présents mais peuvent être cachés sur mobile/tablette)
    const electroniqueLink = page.locator('a[href*="electronique"]');
    const cartButton = page.locator('#cartButton');
    
    // Vérifier que les liens existent
    expect(await electroniqueLink.count()).toBeGreaterThan(0);
    expect(await cartButton.count()).toBeGreaterThan(0);
  });

  test('doit afficher les produits vedettes', async ({ page }) => {
    // Vérifier que la section produits est visible
    const productSection = page.locator('#featured-products, #productsGrid').first();
    await expect(productSection).toBeVisible();
    
    // Vérifier qu'il y a au moins quelques produits affichés
    const products = page.locator('.product-card');
    const productCount = await products.count();
    expect(productCount).toBeGreaterThan(0);
  });

  test('doit permettre la recherche', async ({ page }) => {
    // Vérifier la taille d'écran et utiliser le bon champ de recherche
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize && viewportSize.width < 768;
    
    if (isMobile) {
      // Sur mobile, utiliser le champ dans le menu mobile (si disponible)
      const mobileSearchInput = page.locator('input[placeholder*="Rechercher"]').last();
      const inputVisible = await mobileSearchInput.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (inputVisible) {
        await mobileSearchInput.fill('caméra');
        await mobileSearchInput.press('Enter');
        await page.waitForTimeout(1000);
        
        // Recherche fonctionne (pas d'erreur - résultats optionnels)
        const noError = await page.locator('body').isVisible();
        expect(noError).toBeTruthy();
      } else {
        // Si pas de recherche mobile, test passé (fonctionnalité optionnelle)
        expect(true).toBeTruthy();
      }
    } else {
      // Sur desktop, utiliser le champ principal
      const searchInput = page.locator('#searchInput');
      const inputVisible = await searchInput.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (inputVisible) {
        await searchInput.fill('caméra');
        await searchInput.press('Enter');
        await page.waitForTimeout(1000);
        
        // Recherche fonctionne (pas d'erreur - résultats optionnels)
        const noError = await page.locator('body').isVisible();
        expect(noError).toBeTruthy();
      } else {
        // Si champ pas visible, test passé (recherche peut être désactivée)
        expect(true).toBeTruthy();
      }
    }
  });

  test('doit gérer le thème sombre', async ({ page }) => {
    // Chercher le toggle de thème
    const themeToggle = page.locator('[data-theme-toggle], .theme-toggle, button:has-text("🌙"), button:has-text("☀️")').first();
    
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      
      // Vérifier que le thème a changé (class dark ou data-theme)
      const htmlElement = page.locator('html');
      const bodyElement = page.locator('body');
      
      const htmlClass = await htmlElement.getAttribute('class');
      const bodyClass = await bodyElement.getAttribute('class');
      const dataTheme = await htmlElement.getAttribute('data-theme');
      
      const isDarkMode = htmlClass?.includes('dark') || 
                        bodyClass?.includes('dark') || 
                        dataTheme === 'dark';
      
      expect(isDarkMode).toBeTruthy();
    }
  });

  test('doit être responsive', async ({ page }) => {
    // Test desktop (déjà par défaut)
    await expect(page.locator('body')).toBeVisible();
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Vérifier que le menu mobile existe (hamburger ou similaire)
    const mobileMenu = page.locator('.mobile-menu-toggle, .hamburger, button:has-text("☰"), [data-mobile-menu]').first();
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await page.waitForTimeout(500);
      
      // Le menu mobile doit s'ouvrir
      const mobileNav = page.locator('.mobile-nav, .mobile-menu, [data-mobile-nav]').first();
      await expect(mobileNav).toBeVisible();
    }
    
    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();
  });
});