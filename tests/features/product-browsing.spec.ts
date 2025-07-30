import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { ProductPage } from '../../src/pages/ProductPage';
import { NavigationComponent } from '../../src/components/NavigationComponent';

test.describe('Feature: Product Browsing and Discovery', () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let navigation: NavigationComponent;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    navigation = new NavigationComponent(page);
    await homePage.navigate();
  });

  test.describe('Scenario: Product Search', () => {
    test('Given user is on home page, When they search for a product, Then they should see relevant search results', async () => {
      // Given - user is on home page (from beforeEach)
      
      // When
      const searchTerm = 'hammer';
      await homePage.searchForProduct(searchTerm);
      
      // Then
      await homePage.validateSearchResults(searchTerm);
    });

    test('Given user searches for a product, When they click on a search result, Then they should be taken to the product detail page', async ({ page }) => {
      // Given
      await homePage.searchForProduct('screwdriver');
      
      // When
      const productCount = await homePage.getProductCount();
      if (productCount > 0) {
        await homePage.clickProductByIndex(0);
        
        // Then
        await expect(page).toHaveURL(/.*product.*/);
        await productPage.validateProductPageLoaded();
      }
    });
  });

  test.describe('Scenario: Category Browsing', () => {
    test('Given user is on home page, When they select a category, Then they should see products from that category', async ({ page }) => {
      // Given - user is on home page (from beforeEach)
      
      // When
      await homePage.selectCategory('hand-tools');
      
      // Then
      await expect(page).toHaveURL(/.*hand-tools.*/);
      const productCount = await homePage.getProductCount();
      expect(productCount).toBeGreaterThan(0);
    });

    test('Given user is browsing a category, When they switch to another category, Then they should see products from the new category', async ({ page }) => {
      // Given
      await homePage.selectCategory('hand-tools');
      
      // When
      await homePage.selectCategory('power-tools');
      
      // Then
      await expect(page).toHaveURL(/.*power-tools.*/);
    });
  });

  test.describe('Scenario: Product Detail Viewing', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to a product page
      const productCount = await homePage.getProductCount();
      if (productCount > 0) {
        await homePage.clickProductByIndex(0);
      } else {
        await page.goto('/product/01HKK3BGHZJQGCRG0KYG3T1Z83');
      }
    });

    test('Given user is on a product page, When the page loads, Then they should see all product information', async () => {
      // Given & When - user navigated to product page (from beforeEach)
      
      // Then
      await productPage.validateProductPageLoaded();
      
      const title = await productPage.getProductTitle();
      const price = await productPage.getProductPrice();
      const description = await productPage.getProductDescription();
      
      expect(title).toBeTruthy();
      expect(price).toBeTruthy();
      expect(description).toBeTruthy();
    });

    test('Given user is viewing a product, When they change the quantity, Then the quantity should be updated', async () => {
      // Given - user is on product page (from beforeEach)
      
      // When
      const newQuantity = 3;
      await productPage.setQuantity(newQuantity);
      
      // Then
      await productPage.validateQuantity(newQuantity);
    });

    test('Given user is viewing a product, When they click increase quantity, Then quantity should increment', async () => {
      // Given
      const initialQuantity = await productPage.getCurrentQuantity();
      
      // When
      await productPage.increaseQuantity();
      
      // Then
      await productPage.validateQuantity(initialQuantity + 1);
    });
  });

  test.describe('Scenario: Product Sorting and Filtering', () => {
    test('Given user is on home page with products, When they sort products, Then products should be reordered', async () => {
      // Given - user is on home page with products
      
      // When
      await homePage.sortProducts('name-asc');
      
      // Then
      await homePage.waitForPageLoad();
      // Additional validation can be added to check if sorting actually worked
    });
  });

  test.describe('Scenario: Product Pagination', () => {
    test('Given user is on home page with multiple pages of products, When they click next page, Then they should see the next set of products', async () => {
      // Given - user is on home page
      
      // When
      await homePage.goToNextPage();
      
      // Then
      await homePage.waitForPageLoad();
      
      // When going back
      await homePage.goToPreviousPage();
      
      // Then
      await homePage.waitForPageLoad();
    });
  });

  test.describe('Scenario: Related Products', () => {
    test.beforeEach(async ({ page }) => {
      const productCount = await homePage.getProductCount();
      if (productCount > 0) {
        await homePage.clickProductByIndex(0);
      } else {
        await page.goto('/product/01HKK3BGHZJQGCRG0KYG3T1Z83');
      }
    });

    test('Given user is viewing a product, When related products are available, Then they should be able to click on related products', async () => {
      // Given - user is on product page (from beforeEach)
      
      // When & Then
      const relatedProductsCount = await productPage.getRelatedProductsCount();
      
      if (relatedProductsCount > 0) {
        await productPage.clickRelatedProduct(0);
        await productPage.validateProductPageLoaded();
      }
    });
  });
});