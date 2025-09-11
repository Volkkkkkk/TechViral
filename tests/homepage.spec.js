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
    
    // Vérifier les liens de navigation essentiels
    await expect(page.locator('a[href*="electronique"]')).toBeVisible();
    await expect(page.locator('a[href*="cart"]')).toBeVisible();
  });

  test('doit afficher les produits vedettes', async ({ page }) => {
    // Vérifier que la section produits est visible
    const productSection = page.locator('.product-grid, .products, [data-testid="products"]').first();
    await expect(productSection).toBeVisible();
    
    // Vérifier qu'il y a au moins 3 produits affichés
    const products = page.locator('.product-card, .product-item, [data-product]');
    await expect(products).toHaveCount(3, { timeout: 5000 });
  });

  test('doit permettre la recherche', async ({ page }) => {
    // Chercher le champ de recherche
    const searchInput = page.locator('input[type="search"], input[placeholder*="recherche"], input[name="search"]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('caméra');
      await searchInput.press('Enter');
      
      // Attendre que les résultats se chargent
      await page.waitForTimeout(1000);
      
      // Vérifier qu'il y a des résultats ou un message
      const hasResults = await page.locator('.product-card, .search-results, .no-results').count() > 0;
      expect(hasResults).toBeTruthy();
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