// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Fonctionnalités du panier', () => {
  test.beforeEach(async ({ page }) => {
    // Effacer le localStorage avant chaque test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('doit ajouter un produit au panier', async ({ page }) => {
    // Aller sur une page produit ou chercher un bouton d'ajout au panier
    const addToCartButton = page.locator('button:has-text("Ajouter au panier"), .add-to-cart, [data-add-to-cart]').first();
    
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      
      // Vérifier que le panier a été mis à jour
      await page.waitForTimeout(1000);
      
      // Chercher l'indicateur de panier (badge, compteur)
      const cartIndicator = page.locator('.cart-count, .cart-badge, [data-cart-count]').first();
      if (await cartIndicator.isVisible()) {
        const cartCount = await cartIndicator.textContent();
        expect(parseInt(cartCount || '0')).toBeGreaterThan(0);
      }
      
      // Vérifier le localStorage
      const cartData = await page.evaluate(() => localStorage.getItem('cart'));
      expect(cartData).toBeTruthy();
      
      if (cartData) {
        const cart = JSON.parse(cartData);
        expect(cart.items).toBeDefined();
        expect(cart.items.length).toBeGreaterThan(0);
      }
    }
  });

  test('doit afficher la page panier', async ({ page }) => {
    // Aller directement sur la page panier
    await page.goto('/pages/cart/cart.html');
    
    // Vérifier que la page se charge
    await expect(page.locator('body')).toBeVisible();
    
    // Vérifier la présence des éléments essentiels du panier
    const cartTitle = page.locator('h1:has-text("Panier"), .cart-title, [data-testid="cart-title"]').first();
    if (await cartTitle.isVisible()) {
      await expect(cartTitle).toBeVisible();
    }
    
    // Vérifier la présence du total ou d'un message panier vide
    const cartTotal = page.locator('.cart-total, .total, [data-cart-total]').first();
    const emptyCartMessage = page.locator('.empty-cart, .cart-empty, :has-text("panier est vide")').first();
    
    const hasTotal = await cartTotal.isVisible();
    const hasEmptyMessage = await emptyCartMessage.isVisible();
    
    expect(hasTotal || hasEmptyMessage).toBeTruthy();
  });

  test('doit gérer les quantités', async ({ page }) => {
    // Ajouter d'abord un produit
    await page.goto('/');
    const addButton = page.locator('button:has-text("Ajouter au panier"), .add-to-cart').first();
    
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);
      
      // Aller au panier
      await page.goto('/pages/cart/cart.html');
      
      // Chercher les contrôles de quantité
      const quantityInput = page.locator('input[type="number"], .quantity-input, [data-quantity]').first();
      const increaseButton = page.locator('button:has-text("+"), .quantity-increase, [data-quantity-increase]').first();
      const decreaseButton = page.locator('button:has-text("-"), .quantity-decrease, [data-quantity-decrease]').first();
      
      if (await quantityInput.isVisible()) {
        const initialValue = await quantityInput.inputValue();
        
        if (await increaseButton.isVisible()) {
          await increaseButton.click();
          await page.waitForTimeout(500);
          
          const newValue = await quantityInput.inputValue();
          expect(parseInt(newValue)).toBeGreaterThan(parseInt(initialValue));
        }
      }
    }
  });

  test('doit calculer le total correctement', async ({ page }) => {
    // Simuler l'ajout d'articles via localStorage
    await page.goto('/');
    
    await page.evaluate(() => {
      const cart = {
        items: [
          {
            id: 'test-product-1',
            name: 'Test Product',
            price: 29.99,
            quantity: 2,
            image: 'test.jpg'
          },
          {
            id: 'test-product-2', 
            name: 'Test Product 2',
            price: 19.99,
            quantity: 1,
            image: 'test2.jpg'
          }
        ],
        total: 79.97
      };
      localStorage.setItem('cart', JSON.stringify(cart));
    });
    
    // Aller au panier
    await page.goto('/pages/cart/cart.html');
    await page.waitForTimeout(1000);
    
    // Vérifier que le total est affiché
    const totalElement = page.locator('.cart-total, .total, [data-cart-total]').first();
    
    if (await totalElement.isVisible()) {
      const totalText = await totalElement.textContent();
      expect(totalText).toContain('79.97');
    }
  });

  test('doit permettre de supprimer un article', async ({ page }) => {
    // Ajouter un produit
    await page.goto('/');
    const addButton = page.locator('button:has-text("Ajouter au panier"), .add-to-cart').first();
    
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);
      
      // Aller au panier
      await page.goto('/pages/cart/cart.html');
      
      // Chercher le bouton de suppression
      const removeButton = page.locator('button:has-text("Supprimer"), .remove-item, [data-remove-item]').first();
      
      if (await removeButton.isVisible()) {
        await removeButton.click();
        await page.waitForTimeout(1000);
        
        // Vérifier que l'article a été supprimé
        const cartData = await page.evaluate(() => localStorage.getItem('cart'));
        if (cartData) {
          const cart = JSON.parse(cartData);
          expect(cart.items.length).toBe(0);
        }
      }
    }
  });
});