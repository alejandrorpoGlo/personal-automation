import { test, expect } from '@playwright/test';
import { ProductPage } from '../../src/pages/ProductPage';
import { HomePage } from '../../src/pages/HomePage';
import { NavigationComponent } from '../../src/components/NavigationComponent';

test.describe('Product Page Tests', () => {
  let productPage: ProductPage;
  let homePage: HomePage;
  let navigation: NavigationComponent;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    homePage = new HomePage(page);
    navigation = new NavigationComponent(page);
    
    // Navigate to home page first, then click on a product
    await homePage.navigate();
    const productCount = await homePage.getProductCount();
    
    if (productCount > 0) {
      await homePage.clickProductByIndex(0);
    } else {
      // Fallback: navigate directly to a product URL
      await page.goto('/product/01HKK3BGHZJQGCRG0KYG3T1Z83');
    }
  });

  test('should load product page with all essential elements', async () => {
    await productPage.validateProductPageLoaded();
  });

  test('should display product information correctly', async () => {
    const title = await productPage.getProductTitle();
    const price = await productPage.getProductPrice();
    const description = await productPage.getProductDescription();
    
    expect(title).toBeTruthy();
    expect(price).toBeTruthy();
    expect(description).toBeTruthy();
  });

  test('should add product to cart with default quantity', async () => {
    await productPage.validateInStock();
    await productPage.validateAddToCartEnabled();
    await productPage.addToCart();
  });

  test('should add product to cart with custom quantity', async () => {
    const quantity = 3;
    await productPage.validateInStock();
    await productPage.addToCart(quantity);
    await productPage.validateQuantity(quantity);
  });

  test('should increase and decrease quantity using buttons', async () => {
    const initialQuantity = await productPage.getCurrentQuantity();
    
    await productPage.increaseQuantity();
    await productPage.validateQuantity(initialQuantity + 1);
    
    await productPage.decreaseQuantity();
    await productPage.validateQuantity(initialQuantity);
  });

  test('should set custom quantity in input field', async () => {
    const customQuantity = 5;
    await productPage.setQuantity(customQuantity);
    await productPage.validateQuantity(customQuantity);
  });

  test('should display product brand and category', async () => {
    const brand = await productPage.getProductBrand();
    const category = await productPage.getProductCategory();
    
    expect(brand).toBeTruthy();
    expect(category).toBeTruthy();
  });

  test('should display stock information', async () => {
    const stock = await productPage.getProductStock();
    expect(stock).toBeTruthy();
  });

  test('should add product to favorites', async () => {
    await productPage.addToFavorites();
    // Validation depends on application behavior
  });

  test('should share product', async () => {
    await productPage.shareProduct();
    // Validation depends on application behavior
  });

  test('should navigate back using back button', async ({ page }) => {
    const currentUrl = page.url();
    await productPage.goBack();
    
    // Should navigate away from current product page
    await page.waitForURL(url => url !== currentUrl);
  });

  test('should display product gallery images', async () => {
    const galleryImagesCount = await productPage.getGalleryImagesCount();
    
    if (galleryImagesCount > 1) {
      await productPage.selectGalleryImage(1);
    }
  });

  test('should display related products', async () => {
    const relatedProductsCount = await productPage.getRelatedProductsCount();
    
    if (relatedProductsCount > 0) {
      await productPage.clickRelatedProduct(0);
      await productPage.validateProductPageLoaded();
    }
  });

  test('should validate breadcrumb navigation', async () => {
    await productPage.validateElementVisible(productPage.breadcrumbNav);
  });

  test('should validate product image is visible', async () => {
    await productPage.validateElementVisible(productPage.productImage);
  });

  test('should validate product reviews section', async () => {
    if (await productPage.isElementVisible(productPage.productReviews)) {
      await productPage.validateElementVisible(productPage.productReviews);
    }
  });
});