let timeout;

export function debounce(cb, millis) {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(cb, millis);
}
