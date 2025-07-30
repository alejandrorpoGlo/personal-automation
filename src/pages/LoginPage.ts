import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Selectors
  private readonly selectors = {
    emailInput: '[data-test="email"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="login-submit"]',
    registerLink: '[data-test="register-link"]',
    forgotPasswordLink: '[data-test="forgot-password"]',
    errorMessage: '[data-test="login-error"]',
    successMessage: '[data-test="login-success"]',
    rememberMeCheckbox: '[data-test="remember-me"]',
    showPasswordToggle: '[data-test="show-password"]',
    backToHomeLink: '[data-test="nav-home"]'
  };

  // Page elements using Page Factory pattern
  get emailInput(): Locator { return this.page.locator(this.selectors.emailInput); }
  get passwordInput(): Locator { return this.page.locator(this.selectors.passwordInput); }
  get loginButton(): Locator { return this.page.locator(this.selectors.loginButton); }
  get registerLink(): Locator { return this.page.locator(this.selectors.registerLink); }
  get forgotPasswordLink(): Locator { return this.page.locator(this.selectors.forgotPasswordLink); }
  get errorMessage(): Locator { return this.page.locator(this.selectors.errorMessage); }
  get successMessage(): Locator { return this.page.locator(this.selectors.successMessage); }
  get rememberMeCheckbox(): Locator { return this.page.locator(this.selectors.rememberMeCheckbox); }
  get showPasswordToggle(): Locator { return this.page.locator(this.selectors.showPasswordToggle); }
  get backToHomeLink(): Locator { return this.page.locator(this.selectors.backToHomeLink); }

  constructor(page: Page) {
    super(page, '/auth/login');
  }

  // Page specific methods
  async login(email: string, password: string, rememberMe: boolean = false): Promise<void> {
    await this.fillText(this.emailInput, email);
    await this.fillText(this.passwordInput, password);
    
    if (rememberMe) {
      await this.clickElement(this.rememberMeCheckbox);
    }
    
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  async navigateToRegister(): Promise<void> {
    await this.clickElement(this.registerLink);
    await this.waitForPageLoad();
  }

  async navigateToForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
    await this.waitForPageLoad();
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.clickElement(this.showPasswordToggle);
  }

  async clearLoginForm(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  async getErrorMessage(): Promise<string> {
    if (await this.isElementVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  async getSuccessMessage(): Promise<string> {
    if (await this.isElementVisible(this.successMessage)) {
      return await this.getText(this.successMessage);
    }
    return '';
  }

  // Validation methods
  async validateLoginPageLoaded(): Promise<void> {
    await this.validateElementVisible(this.emailInput);
    await this.validateElementVisible(this.passwordInput);
    await this.validateElementVisible(this.loginButton);
  }

  async validateLoginError(expectedError: string): Promise<void> {
    await this.validateElementVisible(this.errorMessage);
    await this.validateElementText(this.errorMessage, expectedError);
  }

  async validateLoginSuccess(): Promise<void> {
    await this.validateUrl('**/account');
  }

  async validateEmptyFields(): Promise<void> {
    const emailValue = await this.emailInput.inputValue();
    const passwordValue = await this.passwordInput.inputValue();
    
    if (emailValue !== '' || passwordValue !== '') {
      throw new Error('Form fields are not empty');
    }
  }
}