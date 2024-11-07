import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginPage';
import { clickLogo } from '../components/logo';
import { Language, selectLanguage } from '../components/language';
import { acceptCookies } from '../components/cookies';
import * as data from '../data';
import { AssertionError } from 'assert';
import DemoPage from '../pages/demoPage';
import SettingsPage from '../pages/settingsPage';


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
  // Verify if we land in the Settings page
  try {
    const settings: SettingsPage = new SettingsPage(page);
    await settings.verifyPageDisplayed();
  } catch(error) {
      throw new AssertionError({message: "Login failure."});
  } finally {
    await testInfo.attach("After login attempt", {body: await page.screenshot(), contentType: "image/png"});
  }
});

test('Click Tractive logo', async ({ page }, testInfo) => {
  const login: LoginPage = new LoginPage(page);
  await testInfo.attach("Login page", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyPageDisplayed();
  await clickLogo(page);
  await page.waitForTimeout(3000);  // Necessary delay to take the next screenshot
  await testInfo.attach("After logo click", {body: await page.screenshot(), contentType: "image/png"});
});

test('Try demo', async ({ page }, testInfo) => {
  const login: LoginPage = new LoginPage(page);
  await testInfo.attach("Login page", {body: await page.screenshot(), contentType: "image/png"});
  await login.verifyPageDisplayed();
  await login.clickTryDemoLink();
  const demo: DemoPage = new DemoPage(page);
  await page.waitForTimeout(3000);  // Necessary delay to take the next screenshot
  await testInfo.attach("After try-demo click", {body: await page.screenshot(), contentType: "image/png"});
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
  await selectLanguage(page, Language.English_US);
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
