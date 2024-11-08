import { expect, type Locator, type Page } from '@playwright/test';
import { Language, SignupFormTitle } from '../components/language';

class SignupPage {

  page: Page;
  firstNameInput: Locator;      // Input first name WebElement
  lastNameInput: Locator;       // Input last name WebElement
  emailInput: Locator;          // Input Email WebElement
  passwordInput: Locator;       // Input Password WebElement
  newsletterCheckbox: Locator;  // Newsletter checkbox WebElement
  createButton: Locator;        // Create button WebElement
  cancelLink: Locator;          // Cancel link WebElement
  tryDemoLink: Locator;         // Try demo link WebElement
  privacyLink: Locator;         // Privacy policy link WebElement
  termsLink: Locator;           // Terms and conditions link WebElement
  form: Locator;                // Form locator
  
  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator("input[name='firstName']");
    this.lastNameInput = page.locator("input[name='lastName']");
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.newsletterCheckbox = page.locator(".tcommon-check__mask");
    this.createButton = page.locator('button[type="submit"]');
    this.cancelLink = page.locator("a[href='#/']");
    this.tryDemoLink = page.locator("button[class='demo-try']");
    this.privacyLink = page.locator("a[href='https://tractive.com/privacy']");
    this.termsLink = page.locator("a[href='https://tractive.com/terms']");
    this.form = page.locator("form[name='signUpForm']");
  }

  // Assert the page/form is displayed
  async verifyPageDisplayed() {
    await expect(this.form).toBeAttached();
  }

  // First name input methods
  async setFirstName(value: string) {
    await this.firstNameInput.fill(value);
  }

  // Last name input methods
  async setLastName(value: string) {
    await this.lastNameInput.fill(value);
  }

  // Email input methods
  async setEmail(value: string) {
    await this.emailInput.fill(value);
  }

  // password input methods
  async setPassword(value: string) {
    await this.passwordInput.fill(value);
  }

  // newsletter checkbox methods
  async checkNewsletterCheckbox() {
    await this.newsletterCheckbox.check();
  }

  async uncheckNewsletterCheckbox() {
    await this.newsletterCheckbox.uncheck();
  }

  // Create button methods
  async clickCreateButton() {
    await this.createButton.click();
  }

  // Assert sign in button enabled
  async assertCreateButtonEnabled(enabled: boolean) {
    if (enabled)
      return await expect(this.createButton).toBeEnabled();
    else
      return await expect(this.createButton).not.toBeEnabled();
  }

  // Try-demo link methods
  async clickTryDemoLink() {
    await this.tryDemoLink.click();
  }

  // Cancel link methods
  async clickCancelLink() {
    await this.cancelLink.click();
  }

  // Privacy link methods
  async clickPrivacyLink() {
    await this.privacyLink.click();
  }

  // Privacy link methods
  async clickTermsLink() {
    await this.termsLink.click();
  }

  // Internationalization assertions
  async verifyInternationalization(lang: Language) {
    // Get the corresponding key of the Language enum value.
    var key = Object.keys(Language).find( key => Language[key] === lang );
    // Verify the title
    await expect(this.form.locator('h2')).toHaveText(SignupFormTitle[String(key)]);
    // TODO: verify form input and button labels
  }

}

export default SignupPage;
