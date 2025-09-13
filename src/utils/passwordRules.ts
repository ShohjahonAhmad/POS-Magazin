export const parolLength = (value : string) => {
    return value.length >= 8
  }
  
export const parolNumber = (value: string) => {
    return /[0-9]/.test(value)
  }
  
export const parolUpperCase = (value: string) => {
    return /[A-Z]/.test(value)
  }
  
export const parolLowerCase = (value: string) => {
    return /[a-z]/.test(value)
  }

const passwordRules = [
  { check: parolLength, message: "Parol kamida 8 belgidan iborat bo'lishi shart" },
  { check: parolNumber, message: "Parol kamida 1 ta raqamdan iborat bo'lishi shart" },
  { check: parolLowerCase, message: "Parol kamida 1 ta kichik harfdan iborat bo'lishi shart" },
  { check: parolUpperCase, message: "Parol kamida 1 ta katta harfdan iborat bo'lishi shart" },
];

export default passwordRules
