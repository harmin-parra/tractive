import { expect, test } from '@playwright/test';
import assert, { AssertionError } from 'assert';
import { acceptCookies } from '../components/cookies';
import { Language, selectLanguage } from '../components/language';
import { clickLogo } from '../components/logo';
import LoginPage from '../pages/loginPage';
import SignupPage from '../pages/signupPage';
import DemoPage from '../pages/demoPage';
import ActivationPage from '../pages/activationPage';
import TractivePage from '../pages/tractivePage';
import * as data from '../data';


test.use({
  storageState: 'auth.json'
});

// Open Login page and click 'Create account' link
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await acceptCookies(page);
  const login: LoginPage = new LoginPage(page);
  await login.verifyPageDisplayed();
  await login.clickSignupLink();
});

// Valid tests
test('Sign up with email', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await signup.setFirstName(data.firstname);
  await signup.setLastName(data.lastname);
  await signup.setEmail(data.email);
  await signup.setPassword(data.password);
  await signup.checkNewsletterCheckbox();
  await signup.assertCreateButtonEnabled(true);
  await testInfo.attach("Filled out form", {body: await page.screenshot(), contentType: "image/png"});
  await signup.clickCreateButton();
  await page.waitForTimeout(3000);  // Necessary delay to take the next screenshot
  await testInfo.attach("After Sign-up", {body: await page.screenshot(), contentType: "image/png"});
  // Verify if we land in the Activation page
  const activation: ActivationPage = new ActivationPage(page);
  await activation.verifyPageDisplayed();
});

test('Cancel Sign up', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await signup.clickCancelLink();
  await testInfo.attach("Cancel", {body: await page.screenshot(), contentType: "image/png"});
  // Verify if we land in the Login page
  const login = new LoginPage(page);
  await login.verifyPageDisplayed();
});

test('Click Tractive logo', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await clickLogo(page);
  await page.waitForTimeout(3000);  // Necessary delay to take the next screenshot
  await testInfo.attach("After logo click", {body: await page.screenshot(), contentType: "image/png"});
  // Verify if we land in the Tractive page
  const tractive: TractivePage = new TractivePage(page);
  await tractive.verifyPageDisplayed();
});

test('Try demo', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await signup.clickTryDemoLink();
  await page.waitForTimeout(3000); // Necessary delay for the next screenshot
  await testInfo.attach("Try demo", {body: await page.screenshot(), contentType: "image/png"});
  // Verify if we land in the Demo page
  const demo: DemoPage = new DemoPage(page);
  await demo.verifyPageDisplayed();
});

test('Click Privacy Policy link', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  const pdfPromise = page.waitForEvent('popup');
  await signup.clickPrivacyLink();
  const pdf = await pdfPromise;
  // Verify if there are 2 open tabs in the browser
  assert(page.context().pages().length == 2, "Expecting 2 open tabs");
  await expect(pdf).toHaveURL(/https:\/\/assets\.tractive\.com\/static\/legal\/.*/);
});

test('Click Terms & Conditions link', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  const pdfPromise = page.waitForEvent('popup');
  await signup.clickTermsLink();
  const pdf = await pdfPromise;
  // Verify if there are 2 open tabs in the browser
  assert(page.context().pages().length == 2, "Expecting 2 open tabs");
  await expect(pdf).toHaveURL(/https:\/\/assets\.tractive\.com\/static\/legal\/.*/);
});

// Internationalization tests
test('Sign up page in French', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await selectLanguage(page, Language.French);
  await page.waitForTimeout(3000); // Necessary delay for the next screenshot
  await testInfo.attach("French language", {body: await page.screenshot(), contentType: "image/png"});
});

// Invalid tests
test('Sign up with already existing email', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await signup.setFirstName("Ernest");
  await signup.setLastName("Hemingway");
  await signup.setEmail(data.email);
  await signup.setPassword(data.password);
  await signup.checkNewsletterCheckbox();
  await testInfo.attach("Filled out form", {body: await page.screenshot(), contentType: "image/png"});
  await signup.assertCreateButtonEnabled(true);
  await signup.clickCreateButton();
  // Verify if we land in the Activation page
  try {
    const activation: ActivationPage = new ActivationPage(page);
    await activation.verifyPageDisplayed();
    throw new AssertionError({message: "An account was created with the same email of an already existing account."});
  } catch(error) {
    if (error instanceof AssertionError)
      throw error;
  } finally {
    await testInfo.attach("After sign-up attempt", {body: await page.screenshot(), contentType: "image/png"});
  }
});

test('Sign up with empty form', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await signup.assertCreateButtonEnabled(false);
});

test('Sign up with empty first name', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await signup.setLastName(data.lastname);
  await signup.setEmail(data.dummyemail);
  await signup.setPassword(data.password);
  await testInfo.attach("Filled out form", {body: await page.screenshot(), contentType: "image/png"});
  await signup.assertCreateButtonEnabled(false);
});

test('Sign up with empty last name', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await signup.setFirstName(data.firstname);
  await signup.setEmail(data.dummyemail);
  await signup.setPassword(data.password);
  await testInfo.attach("Filled out form", {body: await page.screenshot(), contentType: "image/png"});
  await signup.assertCreateButtonEnabled(false);
});

test('Sign up with empty email', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await signup.setFirstName(data.firstname);
  await signup.setLastName(data.lastname);
  await signup.setPassword(data.password);
  await testInfo.attach("Filled out form", {body: await page.screenshot(), contentType: "image/png"});
  await signup.assertCreateButtonEnabled(false);
});

test('sign up with invalid email', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await signup.setFirstName(data.firstname);
  await signup.setLastName(data.lastname);
  await signup.setEmail("xxxx");
  await signup.setPassword(data.password);
  await testInfo.attach("Filled out form", {body: await page.screenshot(), contentType: "image/png"});
  await signup.assertCreateButtonEnabled(false);
});

test('Sign up with empty password', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.setFirstName(data.firstname);
  await signup.setLastName(data.lastname);
  await signup.setEmail(data.dummyemail);
  await testInfo.attach("Filled out form", {body: await page.screenshot(), contentType: "image/png"});
  await signup.assertCreateButtonEnabled(false);
});

test('Sign up with short password', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await signup.setFirstName(data.firstname);
  await signup.setLastName(data.lastname);
  await signup.setEmail(data.dummyemail);
  await signup.setPassword('x'.repeat(7));
  await testInfo.attach("Filled out form", {body: await page.screenshot(), contentType: "image/png"});
  await signup.assertCreateButtonEnabled(false);
});
