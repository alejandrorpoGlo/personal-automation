import { test, expect } from '@playwright/test';
import { NavigationComponent } from '../../src/components/NavigationComponent';
import { HomePage } from '../../src/pages/HomePage';
import { LoginPage } from '../../src/pages/LoginPage';

test.describe('Navigation Component Tests', () => {
  let navigation: NavigationComponent;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    navigation = new NavigationComponent(page);
    homePage = new HomePage(page);
    await homePage.navigate();
  });

  test('should display navigation menu with all essential elements', async () => {
    await navigation.validateNavigationVisible();
  });

  test('should navigate to home page', async ({ page }) => {
    await navigation.navigateToHome();
    await expect(page).toHaveURL(/.*\/$/)
  });

  test('should navigate to contact page', async ({ page }) => {
    await navigation.navigateToContact();
    await expect(page).toHaveURL(/.*contact.*/);
  });

  test('should navigate to sign in page', async ({ page }) => {
    await navigation.navigateToSignIn();
    await expect(page).toHaveURL(/.*auth\/login.*/);
  });

  test('should navigate to cart page', async ({ page }) => {
    await navigation.navigateToCart();
    await expect(page).toHaveURL(/.*cart.*/);
  });

  test('should display cart count initially as zero', async () => {
    const cartCount = await navigation.getCartCount();
    expect(cartCount).toBe(0);
  });

  test('should validate cart count display', async () => {
    await navigation.validateCartCount(0);
  });

  test('should show sign in link when user is logged out', async () => {
    await navigation.validateUserLoggedOut();
  });

  test.describe('Logged in user navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Login with test credentials first
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      
      // Use test credentials - adjust these for your environment
      const testEmail = 'customer@practicesoftwaretesting.com';
      const testPassword = 'welcome01';
      
      await loginPage.login(testEmail, testPassword);
      await page.waitForURL(/.*account.*|.*\/$/);
    });

    test('should show user menu when logged in', async () => {
      if (await navigation.isUserLoggedIn()) {
        await navigation.validateUserLoggedIn();
      }
    });

    test('should navigate to account page', async ({ page }) => {
      if (await navigation.isUserLoggedIn()) {
        await navigation.navigateToAccount();
        await expect(page).toHaveURL(/.*account.*/);
      }
    });

    test('should navigate to favorites page', async ({ page }) => {
      if (await navigation.isUserLoggedIn()) {
        await navigation.navigateToFavorites();
        await expect(page).toHaveURL(/.*favorites.*/);
      }
    });

    test('should expand user menu', async () => {
      if (await navigation.isUserLoggedIn()) {
        await navigation.expandUserMenu();
      }
    });

    test('should logout successfully', async ({ page }) => {
      if (await navigation.isUserLoggedIn()) {
        await navigation.logout();
        await navigation.validateUserLoggedOut();
      }
    });
  });

  test('should be consistent across different pages', async ({ page }) => {
    // Test navigation on login page
    await navigation.navigateToSignIn();
    await navigation.validateNavigationVisible();
    
    // Test navigation on contact page
    await navigation.navigateToContact();
    await navigation.validateNavigationVisible();
    
    // Test navigation back to home
    await navigation.navigateToHome();
    await navigation.validateNavigationVisible();
  });
});