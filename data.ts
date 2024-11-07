export const email = "harmin@free.fr";
export const dummyemail = "dummy@free.fr";
export const password = "password";
export const firstname = "Harmin";
export const lastname = "Parra";

// Get random email based on current date.
export function getRandomEmail(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}@free.fr`;
}
