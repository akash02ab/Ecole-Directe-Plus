import CryptoJS from 'crypto-js';
import { v5 as uuidv5 } from "uuid";

const key = "THIS_IS_A_PLACEHOLDER_FOR_YOUR_OWN_SECURITY" // Replace this key with a string of your choice
const UUID_NAMESPACE = "7bbc8dba-be5b-4ff2-b516-713692d5f601";

export function areOccurenciesEqual(obj1, obj2) {
    if (typeof obj1 !== "object" || typeof obj2 !== "object") {
        return obj1 === obj2;
    }
    if (obj1?.length !== obj2?.length) {
        return false;
    }
    for (const i in obj1) {
        if (obj2.hasOwnProperty(i)) {
            if (!areOccurenciesEqual(obj1[i], obj2[i])) {
                return false;
            }
        }
    }
    return true;
}

export function createUserLists(accountNumber) {
    const list = [];
    for (let i = 0; i < accountNumber; i++) {
        list.push(undefined);
    }
    return list;
}

export function getCurrentSchoolYear() {
    /**
     * return an array:
     * 0: start year bound
     * 1: end year bound
     */
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();

    if (month >= 8) {
        return [year, (year + 1)];
    }

    return [(year - 1), year];
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function encrypt(chain) {
    if (!chain) {
        return chain
    }
    return CryptoJS.AES.encrypt(chain, key).toString()
}

export function decrypt(chain) {
    if (!chain) {
        return chain
    }
    return CryptoJS.AES.decrypt(chain, key).toString(CryptoJS.enc.Utf8)
}

export function decodeBase64(string) {
    const decodedText = atob(string);

    const bytes = new Uint8Array(decodedText.length);
    for (let i = 0; i < decodedText.length; i++) {
        bytes[i] = decodedText.charCodeAt(i);
    }

    const textDecoder = new TextDecoder('utf-8');
    const output = textDecoder.decode(bytes);

    return output;
}

export function generateUUID(string) {
    return uuidv5(string, UUID_NAMESPACE);
}

export function sendToWebhook(targetWebhook, data) {
    let stringifiedData = JSON.stringify(data)
    // prevent data from exceeding 2000 characters
    while (stringifiedData.length > 1900) {
        stringifiedData = stringifiedData.slice(0, stringifiedData.length);
    }
    return fetch(
        targetWebhook,
        {
            method: "POST",
            headers: {
                "user-agent": navigator.userAgent,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content: stringifiedData })
        }
    );
}
