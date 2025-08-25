//Regex Validator List

//First & Last Name
const nameRegex = /^(?=.*[A-Za-z].*[A-Za-z])[A-Za-z\s]{2,24}$/;
export const validateName = (name) => nameRegex.test(name);

//Email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const validateEmail = (email) => emailRegex.test(email);

//Password
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
export const validatePassword = (password) => passwordRegex.test(password);
