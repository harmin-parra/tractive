import { test } from '@playwright/test';
import { Language, selectLanguage } from '../components/language';
import LoginPage from '../pages/loginPage';
import SignupPage from '../pages/signupPage';
import DemoPage from '../pages/demoPage';
import { acceptCookies } from '../components/cookies';
import * as data from '../data';
import ActivationPage from '../pages/activationPage';
import { AssertionError } from 'assert';


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
  // Verify if we land in the Activation page
  try {
    const activation: ActivationPage = new ActivationPage(page);
    await activation.verifyPageDisplayed();
  } catch(error) {
      throw new AssertionError({message: "Sign-up failure. The sign-up page is still displayed"});
  } finally {
    await testInfo.attach("After sign-up attempt", {body: await page.screenshot(), contentType: "image/png"});
  }
});

test('Cancel Sign up', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await signup.clickCancelLink();
  await testInfo.attach("Cancel", {body: await page.screenshot(), contentType: "image/png"});
  const login = new LoginPage(page);
  await login.verifyPageDisplayed();
});

test('Try demo', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await signup.clickTryDemoLink();
  await page.waitForTimeout(3000); // Necessary delay for the next screenshot
  await testInfo.attach("Try demo", {body: await page.screenshot(), contentType: "image/png"});
  const demo: DemoPage = new DemoPage(page);
  await demo.verifyPageDisplayed();
});

// Internationalization tests
test('Sign up page in French', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await selectLanguage(page, Language.French);
  await page.waitForTimeout(3000); // Necessary delay for the next screenshot
  await testInfo.attach("French language", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyInternationalization(Language.French);
  await selectLanguage(page, Language.English_US);
});

// Invalid tests
test('Account already exists', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await signup.setFirstName(data.firstname);
  await signup.setLastName(data.lastname);
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
    throw new AssertionError({message: "An account was created with the same information of an already existing account."});
  } catch(error) {
    if (error instanceof AssertionError)
      throw error;
  } finally {
    await testInfo.attach("After creation attempt", {body: await page.screenshot(), contentType: "image/png"});
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
