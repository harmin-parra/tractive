import { expect, type Locator, type Page } from '@playwright/test';
import { AssertionError } from 'assert';

enum Cookies {
  Analytics = "analytics",
  Marketing = "marketing",
  Required = "required"
}

class CookiesPopup {

  page: Page;
  popup: Locator;
  okButton: Locator;               // OK button WebElement
  essentialButton: Locator;        // Accept essential button WebElement
  customizeLink: Locator;          // Customize link WebElement
  privacyLink: Locator;            // Privacy link WebElement
  acceptAllButton: Locator;        // Customize All button WebElement
  acceptSelectionButton: Locator;  // Customize Accept Selection button WebElement

  constructor(page: Page) {
    this.page = page;
    this.popup = page.locator(".tractive-cookie-consent-popup");
    this.okButton = this.popup.locator("//button[2]");
    this.essentialButton = this.popup.locator("//button[1]");
    this.customizeLink = this.popup.locator(".js-cookie-consent-settings");
    this.privacyLink = this.popup.locator("a[href='https://tractive.com/gen/l/privacy']");
    this.acceptAllButton = this.popup.locator("//button");
    this.acceptSelectionButton = this.popup.locator(".js-cookie-consent-update");
  }

  // Assert the popup is displayed
  async verifyPopupDisplayed(displayed: boolean = true) {
    if (displayed)
      await expect(this.popup).toBeAttached();
    else
      await expect(this.popup).not.toBeAttached();
  }
  
  // OK button methods
  async acceptAllCookies() {
    await expect(this.popup).toBeAttached();
    await this.okButton.click();
    await this.verifyCookiePresent(Cookies.Analytics);
    await this.verifyCookiePresent(Cookies.Marketing);
    await this.verifyCookiePresent(Cookies.Required);
  }
  
  // Essential cookies button methods
  async acceptEssentialCookies() {
    await expect(this.popup).toBeAttached();
    await this.essentialButton.click();
    await this.verifyCookiePresent(Cookies.Required);
  }

  // Customization of cookies methods
  async clickCustomizeLink() {
    await this.customizeLink.click();
    // Verify first slide is disabled
    expect(this.page.locator(".slider").first()).toBeDisabled();
  }

  async clickCustomizeAcceptAllButton() {
    await this.acceptAllButton.click();
    await this.verifyCookiePresent(Cookies.Analytics);
    await this.verifyCookiePresent(Cookies.Marketing);
    await this.verifyCookiePresent(Cookies.Required);
  }

  async clickCustomizeAcceptSelectionButton() {
    await this.acceptSelectionButton.click();
  }

  // Privacy link methods
  async clickPrivacyLink() {
    await this.privacyLink.click();
  }

  // Verify a given value is present in the "cookie_consent" cookie.
  async verifyCookiePresent(value: Cookies) {
    var cookie_found = false;
    const cookies = await this.page.context().cookies();
    for (let cookie of cookies) {
      if (cookie['domain'].endsWith(".tractive.com") && cookie['name'] == "cookie_consent") {
        let values = cookie['value'].split(',');
        if (!values.includes(value))
          throw new AssertionError({message: `"${value}" is not present in the cookies`})
        cookie_found = true;
      }
    }
    if (!cookie_found)
      throw new AssertionError({message: `"${value}" is not present in the cookies`})
  }
}

export default CookiesPopup;
