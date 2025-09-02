/**
 * Phone number formatting utilities
 * Format: +00 00 00000 0000 (Country code + Area code + Number in groups)
 */

/**
 * Formats a phone number to the format: +00 00 00000 0000
 * @param {string} phone - Raw phone number input
 * @returns {string} - Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';

  // Remove all non-numeric characters
  const numbersOnly = phone.replace(/\D/g, '');

  // If it starts with country code and has enough digits
  if (numbersOnly.length >= 11) {
    const countryCode = numbersOnly.slice(0, 2);
    const areaCode = numbersOnly.slice(2, 4);
    const firstPart = numbersOnly.slice(4, 9);
    const secondPart = numbersOnly.slice(9, 13);

    let formatted = `+${countryCode} ${areaCode}`;
    if (firstPart) formatted += ` ${firstPart}`;
    if (secondPart) formatted += ` ${secondPart}`;

    return formatted;
  }

  // For shorter numbers, format what we have
  if (numbersOnly.length >= 4) {
    const countryCode = numbersOnly.slice(0, 2);
    const areaCode = numbersOnly.slice(2, 4);
    const remaining = numbersOnly.slice(4);

    let formatted = `+${countryCode} ${areaCode}`;
    if (remaining.length > 0) {
      if (remaining.length <= 5) {
        formatted += ` ${remaining}`;
      } else {
        formatted += ` ${remaining.slice(0, 5)} ${remaining.slice(5)}`;
      }
    }

    return formatted;
  }

  // If only country code or less
  if (numbersOnly.length >= 2) {
    const countryCode = numbersOnly.slice(0, 2);
    const rest = numbersOnly.slice(2);
    return `+${countryCode}${rest ? ` ${rest}` : ''}`;
  }

  return numbersOnly ? `+${numbersOnly}` : '';
};

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone number
 */
export const validatePhone = (phone) => {
  if (!phone) return false;

  const numbersOnly = phone.replace(/\D/g, '');

  // Valid phone numbers should have between 10-15 digits
  return numbersOnly.length >= 10 && numbersOnly.length <= 15;
};

/**
 * Masks phone input as user types in format: +00 00 00000 0000
 * @param {string} value - Current input value
 * @returns {string} - Masked phone number
 */
export const maskPhone = (value) => {
  if (!value) return '';

  const numbersOnly = value.replace(/\D/g, '');

  if (numbersOnly.length === 0) return '';

  // Build the formatted string progressively
  let formatted = '+';

  // Country code (first 2 digits)
  if (numbersOnly.length >= 1) {
    formatted += numbersOnly.slice(0, Math.min(2, numbersOnly.length));
  }

  // Area code (next 2 digits)
  if (numbersOnly.length > 2) {
    formatted += ` ${numbersOnly.slice(2, Math.min(4, numbersOnly.length))}`;
  }

  // First part of number (next 5 digits)
  if (numbersOnly.length > 4) {
    formatted += ` ${numbersOnly.slice(4, Math.min(9, numbersOnly.length))}`;
  }

  // Second part of number (remaining digits)
  if (numbersOnly.length > 9) {
    formatted += ` ${numbersOnly.slice(9, Math.min(13, numbersOnly.length))}`;
  }

  return formatted;
};

// Legacy exports for backward compatibility
export const formatBrazilianPhone = formatPhone;
export const validateBrazilianPhone = validatePhone;
export const maskBrazilianPhone = maskPhone;
