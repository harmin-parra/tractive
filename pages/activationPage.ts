import { expect, type Locator, type Page } from '@playwright/test';

class ActivationPage {

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Assert the page/form is displayed
  async verifyPageDisplayed() {
    await expect(this.page).toHaveURL("https://staging.tractive.com/activation/#/activation/device");
  }
}

export default ActivationPage;
