export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function validatePassword(password: string) {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}

export function validatePhone(phone: string) {
  return /^(98|97|96)[0-9]{8}$/.test(phone.trim());
}

export function validateRequired(value: string) {
  return value.trim().length > 0;
}

export function validateName(name: string) {
  return /^[A-Za-z\s.'-]{3,}$/.test(name.trim());
}

export function validatePlateNumber(plate: string) {
  return /^[A-Z0-9\s-]{5,}$/.test(plate.trim().toUpperCase());
}

export function getPasswordHelp() {
  return "Password must be at least 8 characters and include one letter and one number.";
}
