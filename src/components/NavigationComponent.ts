import { Page, Locator } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

export class NavigationComponent extends BasePage {
  // Selectors
  private readonly selectors = {
    mainMenu: '[data-test="main-menu"]',
    homeLink: '[data-test="nav-home"]',
    categoriesDropdown: '[data-test="nav-categories"]',
    contactLink: '[data-test="nav-contact"]',
    signInLink: '[data-test="nav-sign-in"]',
    cartIcon: '[data-test="nav-cart"]',
    cartCount: '[data-test="cart-count"]',
    userMenu: '[data-test="user-menu"]',
    logoutLink: '[data-test="nav-logout"]',
    accountLink: '[data-test="nav-account"]',
    favoritesLink: '[data-test="nav-favorites"]'
  };

  // Page elements using Page Factory pattern
  get mainMenu(): Locator { return this.page.locator(this.selectors.mainMenu); }
  get homeLink(): Locator { return this.page.locator(this.selectors.homeLink); }
  get categoriesDropdown(): Locator { return this.page.locator(this.selectors.categoriesDropdown); }
  get contactLink(): Locator { return this.page.locator(this.selectors.contactLink); }
  get signInLink(): Locator { return this.page.locator(this.selectors.signInLink); }
  get cartIcon(): Locator { return this.page.locator(this.selectors.cartIcon); }
  get cartCount(): Locator { return this.page.locator(this.selectors.cartCount); }
  get userMenu(): Locator { return this.page.locator(this.selectors.userMenu); }
  get logoutLink(): Locator { return this.page.locator(this.selectors.logoutLink); }
  get accountLink(): Locator { return this.page.locator(this.selectors.accountLink); }
  get favoritesLink(): Locator { return this.page.locator(this.selectors.favoritesLink); }

  constructor(page: Page) {
    super(page);
  }

  // Navigation methods
  async navigateToHome(): Promise<void> {
    await this.clickElement(this.homeLink);
    await this.waitForPageLoad();
  }

  async navigateToContact(): Promise<void> {
    await this.clickElement(this.contactLink);
    await this.waitForPageLoad();
  }

  async navigateToSignIn(): Promise<void> {
    await this.clickElement(this.signInLink);
    await this.waitForPageLoad();
  }

  async navigateToCart(): Promise<void> {
    await this.clickElement(this.cartIcon);
    await this.waitForPageLoad();
  }

  async navigateToAccount(): Promise<void> {
    await this.clickElement(this.accountLink);
    await this.waitForPageLoad();
  }

  async navigateToFavorites(): Promise<void> {
    await this.clickElement(this.favoritesLink);
    await this.waitForPageLoad();
  }

  async logout(): Promise<void> {
    await this.clickElement(this.logoutLink);
    await this.waitForPageLoad();
  }

  // Utility methods
  async getCartCount(): Promise<number> {
    if (await this.isElementVisible(this.cartCount)) {
      const countText = await this.getText(this.cartCount);
      return parseInt(countText) || 0;
    }
    return 0;
  }

  async isUserLoggedIn(): Promise<boolean> {
    return await this.isElementVisible(this.userMenu);
  }

  async expandUserMenu(): Promise<void> {
    if (await this.isElementVisible(this.userMenu)) {
      await this.clickElement(this.userMenu);
    }
  }

  // Validation methods
  async validateNavigationVisible(): Promise<void> {
    await this.validateElementVisible(this.mainMenu);
    await this.validateElementVisible(this.homeLink);
    await this.validateElementVisible(this.cartIcon);
  }

  async validateUserLoggedIn(): Promise<void> {
    await this.validateElementVisible(this.userMenu);
  }

  async validateUserLoggedOut(): Promise<void> {
    await this.validateElementVisible(this.signInLink);
  }

  async validateCartCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getCartCount();
    if (actualCount !== expectedCount) {
      throw new Error(`Expected cart count ${expectedCount}, but got ${actualCount}`);
    }
  }
}