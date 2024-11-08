import { type Page } from '@playwright/test';

// Enums for internationalization tests
enum Language {
    English_US = "English (US)",
    English_UK = "English (UK)",
    Spanish = "Español",
    French = "Français",
    German = "Deutsch"
    // TODO: Add the remaining languages
}

// Title of Forms
enum LoginFormTitle {
    English_US = "Sign in",
    English_UK = "Sign in",
    Spanish = "Iniciar sesión",
    French = "Se connecter",
    German = "Anmelden"
    // TODO: Add the remaining languages
}

enum SignupFormTitle {
    English_US = "Create account",
    English_UK = "Create account",
    Spanish = "Crear una cuenta",
    French = "Créer un compte",
    German = "Konto erstellen"
    // TODO: Add the remaining languages
}

// Labels of forms
// TODO: Add enums for form input and button labels (firstname, lastname, password, email, etc)

// Changes the language for the website
async function selectLanguage(page: Page, lang: Language) {
  await page.locator('tcommon-language-selector').click();
  await page.getByText(lang).click();
}

export { Language, LoginFormTitle, SignupFormTitle, selectLanguage };
