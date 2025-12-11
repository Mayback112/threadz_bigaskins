/**
 * Formats a phone number to XXX-XXX-XXXX format
 * Removes all non-digit characters first, then formats
 * 
 * @param phone - Raw phone number string (e.g., "0246181113" or "024-618-1113")
 * @returns Formatted phone number (e.g., "024-618-1113")
 */
export function formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // If we have 10 digits, format as XXX-XXX-XXXX
    if (digitsOnly.length === 10) {
        return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
    }
    
    // If we have more or less than 10 digits, still try to format but keep what we have
    if (digitsOnly.length > 6) {
        return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
    } else if (digitsOnly.length > 3) {
        return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    }
    
    // Return as-is if less than 3 digits
    return digitsOnly;
}

/**
 * Extracts only digits from a phone number
 * Useful when backend expects raw numbers
 * 
 * @param phone - Formatted or unformatted phone number
 * @returns Digits only (e.g., "0246181113")
 */
export function getPhoneDigits(phone: string): string {
    return phone.replace(/\D/g, '');
}
