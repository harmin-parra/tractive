import { expect, type Locator, type Page } from '@playwright/test';
import { Language, LoginFormTitle } from '../components/language';

class LoginPage {

  page: Page;
  emailInput: Locator;          // Input Email WebElement
  passwordInput: Locator;       // Input Password WebElement
  signinButton: Locator;        // Submit button WebElement
  forgotLink: Locator;          // Forgot password link WebElement
  tryDemoLink: Locator;         // Try demo link WebElement
  signupLink: Locator;          // Signup link WebElement
  appleSigninButton: Locator;   // Apple signup button WebElement
  googleSigninButton: Locator;  // Google signup button WebElement
  form: Locator;                // Form locator

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.signinButton = page.locator('button[type="submit"]');
    this.forgotLink = page.locator(".forgot");
    this.tryDemoLink = page.locator("button[class='demo-try']");
    this.signupLink = page.locator("a[href='#/signup']");
    this.appleSigninButton = page.locator("//tcommon-apple-signin-button");
    this.googleSigninButton = page.locator("//tcommon-google-signin-button");
    this.form = page.locator("form[name='loginForm']");
  }

  // Assert the page/form is displayed
  async verifyPageDisplayed() {
    await expect(this.form).toBeAttached();
  }

  // Email input methods
  async setEmail(value: string) {
    await this.emailInput.fill(value);
  }

  // password input methods
  async setPassword(value: string) {
    await this.passwordInput.fill(value);
  }

  // Sign up button methods
  async clickSignupLink() {
    await this.signupLink.click();
  }

  // Sign in button methods
  async clickSigninButton() {
    await expect(this.signinButton).toBeEnabled();
    await this.signinButton.click();
  }
  
  async clickAppleSigninButton() {
    await this.appleSigninButton.click();
  }

  async clickGoogleSigninButton() {
    await this.googleSigninButton.click();
  }

  // Assert sign in button enabled
  async assertSigninButtonEnabled(enabled: boolean) {
    if (enabled)
      return await expect(this.signinButton).toBeEnabled();
    else
      return await expect(this.signinButton).not.toBeEnabled();
  }

  // Forgot password link methods
  async clickForgotLink() {
    await this.forgotLink.click();
  }

  // Try demo link methods
  async clickTryDemoLink() {
    await this.tryDemoLink.click();
  }

  // Internationalization assertions
  async verifyInternationalization(lang: Language) {
    // Get the corresponding key of the Language enum value.
    var key = Object.keys(Language).find( key => Language[key] === lang);
    // Verify the title
    await expect(this.form.locator('h2')).toHaveText(LoginFormTitle[key]);
    // TODO: verify form labels (email, password, button label, etc.)
  }

}

export default LoginPage;
