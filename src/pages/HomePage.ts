import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Selectors
  private readonly selectors = {
    logo: '[data-test="nav-logo"]',
    searchInput: '[data-test="search-query"]',
    searchButton: '[data-test="search-submit"]',
    categoryMenu: '[data-test="nav-categories"]',
    contactMenu: '[data-test="nav-contact"]',
    signInMenu: '[data-test="nav-sign-in"]',
    homeLink: '[data-test="nav-home"]',
    cartIcon: '[data-test="nav-cart"]',
    productCards: '[data-test="product-01"]',
    categoryLinks: '[data-test="category-link"]',
    handToolsCategory: '[data-test="nav-hand-tools"]',
    powerToolsCategory: '[data-test="nav-power-tools"]',
    otherCategory: '[data-test="nav-other"]',
    specialToolsCategory: '[data-test="nav-special-tools"]',
    paginationNext: '[data-test="pagination-next"]',
    paginationPrevious: '[data-test="pagination-previous"]',
    sortDropdown: '[data-test="sort"]',
    filtersPanel: '[data-test="filters"]',
    priceSlider: '[data-test="price-slider"]',
    brandFilter: '[data-test="brand-filter"]'
  };

  // Page elements using Page Factory pattern
  get logo(): Locator { return this.page.locator(this.selectors.logo); }
  get searchInput(): Locator { return this.page.locator(this.selectors.searchInput); }
  get searchButton(): Locator { return this.page.locator(this.selectors.searchButton); }
  get categoryMenu(): Locator { return this.page.locator(this.selectors.categoryMenu); }
  get contactMenu(): Locator { return this.page.locator(this.selectors.contactMenu); }
  get signInMenu(): Locator { return this.page.locator(this.selectors.signInMenu); }
  get homeLink(): Locator { return this.page.locator(this.selectors.homeLink); }
  get cartIcon(): Locator { return this.page.locator(this.selectors.cartIcon); }
  get productCards(): Locator { return this.page.locator(this.selectors.productCards); }
  get categoryLinks(): Locator { return this.page.locator(this.selectors.categoryLinks); }
  get handToolsCategory(): Locator { return this.page.locator(this.selectors.handToolsCategory); }
  get powerToolsCategory(): Locator { return this.page.locator(this.selectors.powerToolsCategory); }
  get otherCategory(): Locator { return this.page.locator(this.selectors.otherCategory); }
  get specialToolsCategory(): Locator { return this.page.locator(this.selectors.specialToolsCategory); }
  get paginationNext(): Locator { return this.page.locator(this.selectors.paginationNext); }
  get paginationPrevious(): Locator { return this.page.locator(this.selectors.paginationPrevious); }
  get sortDropdown(): Locator { return this.page.locator(this.selectors.sortDropdown); }
  get filtersPanel(): Locator { return this.page.locator(this.selectors.filtersPanel); }
  get priceSlider(): Locator { return this.page.locator(this.selectors.priceSlider); }
  get brandFilter(): Locator { return this.page.locator(this.selectors.brandFilter); }

  constructor(page: Page) {
    super(page, '/');
  }

  // Page specific methods
  async searchForProduct(productName: string): Promise<void> {
    await this.fillText(this.searchInput, productName);
    await this.clickElement(this.searchButton);
    await this.waitForPageLoad();
  }

  async selectCategory(category: string): Promise<void> {
    const categoryMap: { [key: string]: Locator } = {
      'hand-tools': this.handToolsCategory,
      'power-tools': this.powerToolsCategory,
      'other': this.otherCategory,
      'special-tools': this.specialToolsCategory
    };

    const categoryElement = categoryMap[category];
    if (categoryElement) {
      await this.clickElement(categoryElement);
      await this.waitForPageLoad();
    }
  }

  async navigateToSignIn(): Promise<void> {
    await this.clickElement(this.signInMenu);
    await this.waitForPageLoad();
  }

  async navigateToCart(): Promise<void> {
    await this.clickElement(this.cartIcon);
    await this.waitForPageLoad();
  }

  async sortProducts(sortOption: string): Promise<void> {
    await this.selectOption(this.sortDropdown, sortOption);
    await this.waitForPageLoad();
  }

  async goToNextPage(): Promise<void> {
    if (await this.isElementVisible(this.paginationNext)) {
      await this.clickElement(this.paginationNext);
      await this.waitForPageLoad();
    }
  }

  async goToPreviousPage(): Promise<void> {
    if (await this.isElementVisible(this.paginationPrevious)) {
      await this.clickElement(this.paginationPrevious);
      await this.waitForPageLoad();
    }
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  async clickProductByIndex(index: number): Promise<void> {
    const product = this.productCards.nth(index);
    await this.clickElement(product);
    await this.waitForPageLoad();
  }

  // Validation methods
  async validateHomePageLoaded(): Promise<void> {
    await this.validateElementVisible(this.logo);
    await this.validateElementVisible(this.searchInput);
    await this.validateElementVisible(this.categoryMenu);
  }

  async validateSearchResults(searchTerm: string): Promise<void> {
    await this.validateUrl(`**/search?q=${searchTerm}**`);
    const productCount = await this.getProductCount();
    console.log(`Found ${productCount} products for search: ${searchTerm}`);
  }
}