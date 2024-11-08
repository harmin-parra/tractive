import { expect, type Locator, type Page } from '@playwright/test';

class ForgotPage {

  page: Page;
  form: Locator; // Form locator

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator("form[name='forgotPasswordForm']");
  }

  // Assert the page/form is displayed
  async verifyPageDisplayed() {
    await expect(this.form).toBeAttached();
  }
}

export default ForgotPage;
