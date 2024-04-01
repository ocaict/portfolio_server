let emailRule = /^([a-z\d-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
let phoneRule = /^\d{11}$/;
let nameRule = /^[a-zA-Z]+(?:\s[a-zA-Z]+)?$/i;
const messageRule = /^[\s\S]{6,120}$/i;

export const isValidEmail = (email) => emailRule.test(email);

export const isValidPhoneNumber = (phone) => phoneRule.test(phone);

export const isValidName = (name) => nameRule.test(name);
export const isValidMessage = (message) => messageRule.test(message);
