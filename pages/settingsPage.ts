import { expect, type Locator, type Page } from '@playwright/test';

class SettingsPage {

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Assert the page/form is displayed
  async verifyPageDisplayed() {
    await expect(this.page).toHaveURL("/#/settings");
  }
}

export default SettingsPage;
