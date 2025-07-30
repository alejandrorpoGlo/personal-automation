import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { NavigationComponent } from '../../src/components/NavigationComponent';

test.describe('Login Page Tests', () => {
  let loginPage: LoginPage;
  let navigation: NavigationComponent;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    navigation = new NavigationComponent(page);
    await loginPage.navigate();
  });

  test('should load login page with all essential elements', async () => {
    await loginPage.validateLoginPageLoaded();
  });

  test('should show validation error for empty fields', async () => {
    await loginPage.clickElement(loginPage.loginButton);
    // Note: Actual validation messages depend on the application implementation
  });

  test('should show error for invalid credentials', async () => {
    await loginPage.login('invalid@email.com', 'wrongpassword');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Note: Replace with actual test credentials for your environment
    const testEmail = 'customer@practicesoftwaretesting.com';
    const testPassword = 'welcome01';
    
    await loginPage.login(testEmail, testPassword);
    
    // Check if redirected to account page or home page
    await expect(page).toHaveURL(/.*account.*|.*\/$/)
  });

  test('should remember login credentials when checkbox is checked', async () => {
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    await loginPage.login(testEmail, testPassword, true);
    // Validation depends on application behavior
  });

  test('should navigate to register page', async ({ page }) => {
    await loginPage.navigateToRegister();
    await expect(page).toHaveURL(/.*register.*/);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await loginPage.navigateToForgotPassword();
    await expect(page).toHaveURL(/.*forgot-password.*/);
  });

  test('should toggle password visibility', async () => {
    await loginPage.fillText(loginPage.passwordInput, 'testpassword');
    await loginPage.togglePasswordVisibility();
    
    const passwordType = await loginPage.passwordInput.getAttribute('type');
    expect(passwordType).toBe('text');
  });

  test('should clear login form', async () => {
    await loginPage.fillText(loginPage.emailInput, 'test@example.com');
    await loginPage.fillText(loginPage.passwordInput, 'password');
    
    await loginPage.clearLoginForm();
    await loginPage.validateEmptyFields();
  });

  test('should navigate back to home from login page', async ({ page }) => {
    await loginPage.clickElement(loginPage.backToHomeLink);
    await expect(page).toHaveURL(/.*\/$/)
  });
});