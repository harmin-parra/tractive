import { expect, test } from '@playwright/test';
import { AssertionError } from 'assert';
import { clickLogo } from '../components/logo';
import { Language, selectLanguage } from '../components/language';
import { acceptCookies } from '../components/cookies';
import LoginPage from '../pages/loginPage';
import DemoPage from '../pages/demoPage';
import SettingsPage from '../pages/settingsPage';
import TractivePage from '../pages/tractivePage';
import ForgotPage from '../pages/forgotPage';
import * as data from '../data';


test.use({
  storageState: 'auth.json'
});

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await acceptCookies(page);
});

// Valid tests
test('Login with valid account', async ({ page }, testInfo) => {
  const login: LoginPage = new LoginPage(page);
  await testInfo.attach("Login page", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyPageDisplayed();
  await login.setEmail(data.email);
  await login.setPassword(data.password);
  await testInfo.attach("Filled out form", {body: await page.screenshot(), contentType: "image/png"});
  await login.assertSigninButtonEnabled(true);
  await login.clickSigninButton();
  await page.waitForTimeout(3000);  // Necessary delay to take the next screenshot
  await testInfo.attach("After logo click", {body: await page.screenshot(), contentType: "image/png"});
  // Verify if we land in the Settings page
  const settings: SettingsPage = new SettingsPage(page);
  await settings.verifyPageDisplayed();
});

test('Login with Apple', async ({ page }, testInfo) => {
  const login: LoginPage = new LoginPage(page);
  await testInfo.attach("Login page", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyPageDisplayed();
  const popupPromise = page.waitForEvent('popup');
  await login.clickAppleSigninButton();
  const popup = await popupPromise;
  await popup.waitForTimeout(5000);  // Necessary delay to for the popup to load
  await expect(popup).toHaveURL(/https:\/\/appleid\.apple\.com\/auth\/authorize\?client_id=.*/);
  await testInfo.attach("After logo click", {body: await popup.screenshot(), contentType: "image/png"});
});

test('Login with Google', async ({ page }, testInfo) => {
  const login: LoginPage = new LoginPage(page);
  await testInfo.attach("Login page", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyPageDisplayed();
  const popupPromise = page.waitForEvent('popup');
  await login.clickGoogleSigninButton();
  const popup = await popupPromise;
  await popup.waitForTimeout(5000);  // Necessary delay to for the popup to load
  await expect(popup).toHaveURL(/https:\/\/accounts\.google\.com\/v3\/signin\/identifier\?.*/);
  await testInfo.attach("After logo click", {body: await popup.screenshot(), contentType: "image/png"});
});

test('Click Tractive logo', async ({ page }, testInfo) => {
  const login: LoginPage = new LoginPage(page);
  await testInfo.attach("Login page", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyPageDisplayed();
  await clickLogo(page);
  await page.waitForTimeout(3000);  // Necessary delay to take the next screenshot
  await testInfo.attach("After logo click", {body: await page.screenshot(), contentType: "image/png"});
  // Verify if we land in the Tractive page
  const tractive: TractivePage = new TractivePage(page);
  await tractive.verifyPageDisplayed();
});

test('Click Forgot password link', async ({ page }, testInfo) => {
  const login: LoginPage = new LoginPage(page);
  await testInfo.attach("Login page", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyPageDisplayed();
  await login.clickForgotLink();
  await testInfo.attach("After Forgot password click", {body: await page.screenshot(), contentType: "image/png"});
  // Verify if we land in the Forgot Password page
  const forgot: ForgotPage = new ForgotPage(page);
  await forgot.verifyPageDisplayed();
});

test('Try demo', async ({ page }, testInfo) => {
  const login: LoginPage = new LoginPage(page);
  await testInfo.attach("Login page", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyPageDisplayed();
  await login.clickTryDemoLink();
  await page.waitForTimeout(3000);  // Necessary delay to take the next screenshot
  await testInfo.attach("After try-demo click", {body: await page.screenshot(), contentType: "image/png"});
  // Verify if we land in the Demo page
  const demo: DemoPage = new DemoPage(page);
  await demo.verifyPageDisplayed();
});

// Internationalization tests
test('Login page in French', async ({ page }, testInfo) => {
  const login: LoginPage = new LoginPage(page);
  await testInfo.attach("Login page in English", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyPageDisplayed();
  await selectLanguage(page, Language.French);
  await page.waitForTimeout(3000);  // Necessary delay to take the next screenshot
  await testInfo.attach("Login page in French", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyInternationalization(Language.French);
});

// Invalid tests
test('Login without credentials', async ({ page }, testInfo) => {
  const login: LoginPage = new LoginPage(page);
  await testInfo.attach("Login page", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyPageDisplayed();
  await testInfo.attach("Filled out form", {body: await page.screenshot(), contentType: "image/png"});
  await login.assertSigninButtonEnabled(false);
});

test('Login with empty email', async ({ page }, testInfo) => {
  const login: LoginPage = new LoginPage(page);
  await testInfo.attach("Login page", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyPageDisplayed();
  await login.setPassword(data.password);
  await testInfo.attach("Filled out form", {body: await page.screenshot(), contentType: "image/png"});
  await login.assertSigninButtonEnabled(false);
});

test('Login with unknown email', async ({ page }, testInfo) => {
  const login: LoginPage = new LoginPage(page);
  await testInfo.attach("Login page", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyPageDisplayed();
  await login.setEmail("unknown@free.fr");
  await login.setPassword(data.password);
  await testInfo.attach("Filled out form", {body: await page.screenshot(), contentType: "image/png"});
  await login.assertSigninButtonEnabled(true);
  await login.clickSigninButton();
  await page.waitForTimeout(3000);  // Necessary delay to take the next screenshot
  await testInfo.attach("After login attempt", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyPageDisplayed();
});

test('Login with wrong password', async ({ page }, testInfo) => {
  const login: LoginPage = new LoginPage(page);
  await testInfo.attach("Login page", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyPageDisplayed();
  await login.setEmail(data.email);
  await login.setPassword(data.password + 'xxx');
  await testInfo.attach("Filled out form", {body: await page.screenshot(), contentType: "image/png"});
  await login.assertSigninButtonEnabled(true);
  await login.clickSigninButton();
  await page.waitForTimeout(3000);  // Necessary delay to take the next screenshot
  await testInfo.attach("After login attempt", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyPageDisplayed();
});

test('Login with empty password', async ({ page }, testInfo) => {
  const login: LoginPage = new LoginPage(page);
  await testInfo.attach("Login page", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyPageDisplayed();
  await login.setEmail(data.email);
  await testInfo.attach("Filled out form", {body: await page.screenshot(), contentType: "image/png"});
  await login.assertSigninButtonEnabled(false);
});
