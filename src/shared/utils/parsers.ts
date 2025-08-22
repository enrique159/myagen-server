export const parseBoolean = (value?: string | number | boolean) => {
  if (!value) return false;
  return value === 'true' || value === 1 || value === true;
};

export const parseNumber = (value?: string | number | boolean) => {
  if (!value) return 0;
  return Number(value);
};
