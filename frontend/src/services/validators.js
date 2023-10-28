export function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

export function isValidPass(pass) {
    return pass.length >= 4;
}

export function isSamePass(pass1, pass2) {
    return pass1 === pass2;
}

export function isValidText(text) {
    return text.length >= 10;
}
