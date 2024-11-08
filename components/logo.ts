import { expect, type Page } from '@playwright/test';


// Click the Tractive upper-left logo
async function clickLogo(page: Page) {
  await page.locator(".login-logo").click();
}

export { clickLogo };
