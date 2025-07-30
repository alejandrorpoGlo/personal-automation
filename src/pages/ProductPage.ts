import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  // Selectors
  private readonly selectors = {
    productTitle: '[data-test="product-title"]',
    productPrice: '[data-test="product-price"]',
    productDescription: '[data-test="product-description"]',
    productImage: '[data-test="product-image"]',
    addToCartButton: '[data-test="add-to-cart"]',
    quantityInput: '[data-test="quantity"]',
    increaseQuantityButton: '[data-test="increase-quantity"]',
    decreaseQuantityButton: '[data-test="decrease-quantity"]',
    productBrand: '[data-test="product-brand"]',
    productCategory: '[data-test="product-category"]',
    productStock: '[data-test="product-stock"]',
    relatedProducts: '[data-test="related-products"]',
    productReviews: '[data-test="product-reviews"]',
    addToFavoritesButton: '[data-test="add-to-favorites"]',
    shareButton: '[data-test="share-product"]',
    breadcrumbNav: '[data-test="breadcrumb"]',
    backButton: '[data-test="back-button"]',
    productGallery: '[data-test="product-gallery"]',
    galleryThumbnails: '[data-test="gallery-thumbnail"]'
  };

  // Page elements using Page Factory pattern
  get productTitle(): Locator { return this.page.locator(this.selectors.productTitle); }
  get productPrice(): Locator { return this.page.locator(this.selectors.productPrice); }
  get productDescription(): Locator { return this.page.locator(this.selectors.productDescription); }
  get productImage(): Locator { return this.page.locator(this.selectors.productImage); }
  get addToCartButton(): Locator { return this.page.locator(this.selectors.addToCartButton); }
  get quantityInput(): Locator { return this.page.locator(this.selectors.quantityInput); }
  get increaseQuantityButton(): Locator { return this.page.locator(this.selectors.increaseQuantityButton); }
  get decreaseQuantityButton(): Locator { return this.page.locator(this.selectors.decreaseQuantityButton); }
  get productBrand(): Locator { return this.page.locator(this.selectors.productBrand); }
  get productCategory(): Locator { return this.page.locator(this.selectors.productCategory); }
  get productStock(): Locator { return this.page.locator(this.selectors.productStock); }
  get relatedProducts(): Locator { return this.page.locator(this.selectors.relatedProducts); }
  get productReviews(): Locator { return this.page.locator(this.selectors.productReviews); }
  get addToFavoritesButton(): Locator { return this.page.locator(this.selectors.addToFavoritesButton); }
  get shareButton(): Locator { return this.page.locator(this.selectors.shareButton); }
  get breadcrumbNav(): Locator { return this.page.locator(this.selectors.breadcrumbNav); }
  get backButton(): Locator { return this.page.locator(this.selectors.backButton); }
  get productGallery(): Locator { return this.page.locator(this.selectors.productGallery); }
  get galleryThumbnails(): Locator { return this.page.locator(this.selectors.galleryThumbnails); }

  constructor(page: Page) {
    super(page, '/product/**');
  }

  // Page specific methods
  async addToCart(quantity: number = 1): Promise<void> {
    await this.setQuantity(quantity);
    await this.clickElement(this.addToCartButton);
    await this.waitForPageLoad();
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.fillText(this.quantityInput, quantity.toString());
  }

  async increaseQuantity(): Promise<void> {
    await this.clickElement(this.increaseQuantityButton);
  }

  async decreaseQuantity(): Promise<void> {
    await this.clickElement(this.decreaseQuantityButton);
  }

  async addToFavorites(): Promise<void> {
    await this.clickElement(this.addToFavoritesButton);
  }

  async shareProduct(): Promise<void> {
    await this.clickElement(this.shareButton);
  }

  async goBack(): Promise<void> {
    await this.clickElement(this.backButton);
    await this.waitForPageLoad();
  }

  async selectGalleryImage(index: number): Promise<void> {
    const thumbnail = this.galleryThumbnails.nth(index);
    await this.clickElement(thumbnail);
  }

  async clickRelatedProduct(index: number): Promise<void> {
    const relatedProduct = this.relatedProducts.nth(index);
    await this.clickElement(relatedProduct);
    await this.waitForPageLoad();
  }

  // Getter methods
  async getProductTitle(): Promise<string> {
    return await this.getText(this.productTitle);
  }

  async getProductPrice(): Promise<string> {
    return await this.getText(this.productPrice);
  }

  async getProductDescription(): Promise<string> {
    return await this.getText(this.productDescription);
  }

  async getProductBrand(): Promise<string> {
    return await this.getText(this.productBrand);
  }

  async getProductCategory(): Promise<string> {
    return await this.getText(this.productCategory);
  }

  async getProductStock(): Promise<string> {
    return await this.getText(this.productStock);
  }

  async getCurrentQuantity(): Promise<number> {
    const quantity = await this.quantityInput.inputValue();
    return parseInt(quantity) || 1;
  }

  async getRelatedProductsCount(): Promise<number> {
    return await this.relatedProducts.count();
  }

  async getGalleryImagesCount(): Promise<number> {
    return await this.galleryThumbnails.count();
  }

  // Validation methods
  async validateProductPageLoaded(): Promise<void> {
    await this.validateElementVisible(this.productTitle);
    await this.validateElementVisible(this.productPrice);
    await this.validateElementVisible(this.addToCartButton);
  }

  async validateProductInformation(expectedTitle: string, expectedPrice?: string): Promise<void> {
    await this.validateElementText(this.productTitle, expectedTitle);
    if (expectedPrice) {
      await this.validateElementText(this.productPrice, expectedPrice);
    }
  }

  async validateQuantity(expectedQuantity: number): Promise<void> {
    const currentQuantity = await this.getCurrentQuantity();
    if (currentQuantity !== expectedQuantity) {
      throw new Error(`Expected quantity ${expectedQuantity}, but got ${currentQuantity}`);
    }
  }

  async validateAddToCartEnabled(): Promise<void> {
    const isEnabled = await this.addToCartButton.isEnabled();
    if (!isEnabled) {
      throw new Error('Add to Cart button is not enabled');
    }
  }

  async validateInStock(): Promise<void> {
    const stockText = await this.getProductStock();
    if (stockText.toLowerCase().includes('out of stock')) {
      throw new Error('Product is out of stock');
    }
  }
}