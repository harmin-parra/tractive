import { expect, type Locator, type Page } from '@playwright/test';

class DemoPage {

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Assert the page/form is displayed
  async verifyPageDisplayed() {
    await expect(this.page).toHaveURL("/#/map");
  }
}

export default DemoPage;
