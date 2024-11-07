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
  await signup.setEmail("abcdef@free.fr");
  await signup.setPassword(data.password);
  await signup.checkNewsletterCheckbox();
  await signup.assertCreateButtonEnabled(true);
  await testInfo.attach("Filled out form", {body: await page.screenshot(), contentType: "image/png"});
  await signup.clickCreateButton();
  await page.waitForTimeout(3000);  // Necessary delay to take screenshot of popup error (if any).
  await testInfo.attach("After sign up", {body: await page.screenshot(), contentType: "image/png"});
  try {
    await signup.verifyPageDisplayed();
    throw new AssertionError({message: "Sign-up failure. Sign-up page is still displayed"});
  } catch(error) {
    if (error instanceof AssertionError)
      throw error;
  }
  // TODO: Verify the next web page is displayed
  // TODO: Verify the next web page is displayed
  //const activation: ActivationPage = new ActivationPage(page);
  //await activation.verifyPageDisplayed();
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
  throw new AssertionError({ message: "Depends on failing 'Sign up with email' test" });
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
  await testInfo.attach("After creation attempt", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
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

/*
test('Sign up with long password', async ({ page }, testInfo) => {
  const signup: SignupPage = new SignupPage(page);
  await testInfo.attach("Sign up page", {body: await page.screenshot(), contentType: "image/png"});
  await signup.verifyPageDisplayed();
  await signup.setFirstName(data.firstname);
  await signup.setLastName(data.lastname);
  await signup.setEmail(data.dummyemail);
  await signup.setPassword('x'.repeat(64));
  await testInfo.attach("Filled out form", {body: await page.screenshot(), contentType: "image/png"});
  await signup.assertCreateButtonEnabled(false);
});
*/