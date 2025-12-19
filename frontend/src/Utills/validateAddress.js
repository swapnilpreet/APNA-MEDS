export const validateAddress = (formData) => {
  const { address, city, postalcode, country } = formData;
  if (
    !address.trim() ||
    !city.trim() ||
    !country.trim() ||
    !postalcode.toString().trim()
  ) {
    return "Please fill in all address fields correctly";
  }
  if (isNaN(postalcode) || postalcode.toString().length < 4) {
    return "Postal code must be a valid number with at least 4 digits";
  }
  if (address.trim().length < 5) {
    return "Address must be at least 5 characters long";
  }
  return null;
};
