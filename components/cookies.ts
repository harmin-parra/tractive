import { expect, type Locator, type Page } from '@playwright/test';
import CookiesPopup from '../pages/cookiesPopup';


// Get rid of the cookies dialog if we want to test other things.
async function acceptCookies(page: Page) {
  const cookies: CookiesPopup = new CookiesPopup(page);
  try {
    await expect(cookies.popup).toBeAttached();
    await cookies.acceptAllCookies();
  }
  catch(error) {};
}

export { acceptCookies };
