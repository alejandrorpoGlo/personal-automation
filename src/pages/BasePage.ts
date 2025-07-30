import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;
  protected url: string;

  constructor(page: Page, url: string = '') {
    this.page = page;
    this.url = url;
  }

  // Navigation methods
  async navigate(): Promise<void> {
    await this.page.goto(this.url);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // Common actions
  async clickElement(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.click();
  }

  async fillText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.fill(text);
  }

  async selectOption(locator: Locator, option: string): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.selectOption(option);
  }

  async getText(locator: Locator): Promise<string> {
    await expect(locator).toBeVisible();
    return await locator.textContent() || '';
  }

  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await expect(locator).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  // Validation methods
  async validateUrl(expectedUrl: string): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }

  async validateTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async validateElementText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toHaveText(expectedText);
  }

  async validateElementVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async validateElementCount(locator: Locator, count: number): Promise<void> {
    await expect(locator).toHaveCount(count);
  }
}