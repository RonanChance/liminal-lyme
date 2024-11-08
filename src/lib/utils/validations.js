export function isValidUrl(str) {
    try {
        const url = new URL(str.includes("://") ? str : `https://${str}`); // This will throw if `str` is not a valid URL
        return true;
    } catch (_) {
        return false;
    }
}