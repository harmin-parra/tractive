import { expect, test } from '@playwright/test';
import CookiesPopup from '../pages/cookiesPopup';
import assert from 'assert';

test.use({
  storageState: 'auth.json'
});

// Valid tests
test('Accept all cookies', async ({ page }, testInfo) => {
  await page.goto('/');
  const cookies: CookiesPopup = new CookiesPopup(page);
  await testInfo.attach("Cookie popup", {body: await page.screenshot(), contentType: "image/png"});
  await cookies.verifyPopupDisplayed();
  await cookies.acceptAllCookies();
  await testInfo.attach("Accept all cookies", {body: await page.screenshot(), contentType: "image/png"});
  await cookies.verifyPopupDisplayed(false);
});

test('Accept essential cookies', async ({ page }, testInfo) => {
  await page.goto('/');
  const cookies: CookiesPopup = new CookiesPopup(page);
  await testInfo.attach("Cookie popup", {body: await page.screenshot(), contentType: "image/png"});
  await cookies.verifyPopupDisplayed();
  await cookies.acceptEssentialCookies();
  await testInfo.attach("Accept essential cookies", {body: await page.screenshot(), contentType: "image/png"});
  await cookies.verifyPopupDisplayed(false);
});

test('Customize cookies + Accept all', async ({ page }, testInfo) => {
  await page.goto('/');
  const cookies: CookiesPopup = new CookiesPopup(page);
  await cookies.verifyPopupDisplayed();
  await testInfo.attach("Cookie popup", {body: await page.screenshot(), contentType: "image/png"});
  await cookies.clickCustomizeLink();
  await testInfo.attach("Click customize", {body: await page.screenshot(), contentType: "image/png"});
  await cookies.clickCustomizeAcceptAllButton();
  await testInfo.attach("Accept all", {body: await page.screenshot(), contentType: "image/png"});
  await cookies.verifyPopupDisplayed(false);
});

test('Customize cookies + Accept selection', async ({ page }, testInfo) => {
  await page.goto('/');
  const cookies: CookiesPopup = new CookiesPopup(page);
  await testInfo.attach("Cookie popup", {body: await page.screenshot(), contentType: "image/png"});
  await cookies.verifyPopupDisplayed();
  await cookies.clickCustomizeLink();
  await testInfo.attach("Click customize", {body: await page.screenshot(), contentType: "image/png"});
  await cookies.clickCustomizeAcceptSelectionButton();
  await testInfo.attach("Accept selection", {body: await page.screenshot(), contentType: "image/png"});
  await cookies.verifyPopupDisplayed(false);
});

test('Click Privacy Policy link', async ({ page }, testInfo) => {
  await page.goto('/');
  const cookies: CookiesPopup = new CookiesPopup(page);
  await testInfo.attach("Cookie popup", {body: await page.screenshot(), contentType: "image/png"});
  await cookies.verifyPopupDisplayed();
  const pdfPromise = page.waitForEvent('popup');
  await cookies.clickPrivacyLink();
  const pdf = await pdfPromise;
  //await testInfo.attach("After Privacy Policy click", {body: await page.screenshot(), contentType: "image/png"});
  await cookies.verifyPopupDisplayed();
  // Verify if there are 2 open tabs in the browser
  assert(page.context().pages().length == 2, "Expecting 2 open tabs");
  await expect(pdf).toHaveURL(/https:\/\/assets\.tractive\.com\/static\/legal\/.*/);
});
