export const validatePatient = (formData) => {
  const { name, age } = formData;
  if (!name.trim() || !age.toString().trim()) {
    return "Please fill in both name and age fields";
  }
  if (isNaN(age)) {
    return "Age must be a number";
  }
  if (name.trim().length < 4) {
    return "Name must be at least 4 characters long";
  }
  if (Number(age) < 10 || Number(age) > 120) {
    return "Age must be between 10 and 120";
  }
  return null;
};
