import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { NavigationComponent } from '../../src/components/NavigationComponent';

test.describe('Home Page Tests', () => {
  let homePage: HomePage;
  let navigation: NavigationComponent;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    navigation = new NavigationComponent(page);
    await homePage.navigate();
  });

  test('should load home page with all essential elements', async () => {
    await homePage.validateHomePageLoaded();
    await navigation.validateNavigationVisible();
  });

  test('should search for products successfully', async () => {
    const searchTerm = 'hammer';
    await homePage.searchForProduct(searchTerm);
    await homePage.validateSearchResults(searchTerm);
  });

  test('should navigate to different categories', async ({ page }) => {
    await homePage.selectCategory('hand-tools');
    await expect(page).toHaveURL(/.*hand-tools.*/);
    
    await homePage.selectCategory('power-tools');
    await expect(page).toHaveURL(/.*power-tools.*/);
  });

  test('should display product cards on home page', async () => {
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test('should navigate to product page when clicking on product', async () => {
    const productCount = await homePage.getProductCount();
    if (productCount > 0) {
      await homePage.clickProductByIndex(0);
      await expect(homePage.page).toHaveURL(/.*product.*/);
    }
  });

  test('should sort products using dropdown', async () => {
    await homePage.sortProducts('name-asc');
    await homePage.waitForPageLoad();
  });

  test('should navigate through pagination', async () => {
    await homePage.goToNextPage();
    await homePage.goToPreviousPage();
  });

  test('should navigate to sign in from home page', async ({ page }) => {
    await homePage.navigateToSignIn();
    await expect(page).toHaveURL(/.*auth\/login.*/);
  });

  test('should navigate to cart from home page', async ({ page }) => {
    await homePage.navigateToCart();
    await expect(page).toHaveURL(/.*cart.*/);
  });
});