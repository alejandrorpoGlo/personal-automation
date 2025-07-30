import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { HomePage } from '../../src/pages/HomePage';
import { NavigationComponent } from '../../src/components/NavigationComponent';

test.describe('Feature: User Authentication', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let navigation: NavigationComponent;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    navigation = new NavigationComponent(page);
  });

  test.describe('Scenario: User Login Flow', () => {
    test('Given user is on home page, When they click sign in, Then they should be redirected to login page', async ({ page }) => {
      // Given
      await homePage.navigate();
      
      // When
      await navigation.navigateToSignIn();
      
      // Then
      await expect(page).toHaveURL(/.*auth\/login.*/);
      await loginPage.validateLoginPageLoaded();
    });

    test('Given user is on login page with valid credentials, When they submit login form, Then they should be logged in successfully', async ({ page }) => {
      // Given
      await loginPage.navigate();
      const testEmail = 'customer@practicesoftwaretesting.com';
      const testPassword = 'welcome01';
      
      // When
      await loginPage.login(testEmail, testPassword);
      
      // Then
      await expect(page).toHaveURL(/.*account.*|.*\/$/);
    });

    test('Given user is on login page with invalid credentials, When they submit login form, Then they should see error message', async () => {
      // Given
      await loginPage.navigate();
      
      // When
      await loginPage.login('invalid@email.com', 'wrongpassword');
      
      // Then
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
    });
  });

  test.describe('Scenario: User Logout Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await loginPage.navigate();
      const testEmail = 'customer@practicesoftwaretesting.com';
      const testPassword = 'welcome01';
      await loginPage.login(testEmail, testPassword);
      await page.waitForURL(/.*account.*|.*\/$/);
    });

    test('Given user is logged in, When they click logout, Then they should be logged out successfully', async () => {
      // Given - user is logged in (from beforeEach)
      if (await navigation.isUserLoggedIn()) {
        // When
        await navigation.logout();
        
        // Then
        await navigation.validateUserLoggedOut();
      }
    });
  });

  test.describe('Scenario: Password Reset Flow', () => {
    test('Given user is on login page, When they click forgot password, Then they should be redirected to password reset page', async ({ page }) => {
      // Given
      await loginPage.navigate();
      
      // When
      await loginPage.navigateToForgotPassword();
      
      // Then
      await expect(page).toHaveURL(/.*forgot-password.*/);
    });
  });

  test.describe('Scenario: Registration Flow', () => {
    test('Given user is on login page, When they click register link, Then they should be redirected to registration page', async ({ page }) => {
      // Given
      await loginPage.navigate();
      
      // When
      await loginPage.navigateToRegister();
      
      // Then
      await expect(page).toHaveURL(/.*register.*/);
    });
  });
});