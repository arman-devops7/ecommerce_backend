export const filterAvail = (propertiesName, json) => {
  return Object.fromEntries(
    Object.entries(json)
      .filter(([key, value]) => propertiesName.includes(key))
      .map(([key, value]) => [key, value ?? null])
  );
};
// Object.entries(json): Converts the object into key-value pairs.
// .filter(([key]) => propertiesName.includes(key)): Keeps only the keys found in propertiesName.
// .map(([key, value]) => [key, value ?? null]): Replaces undefined values with null.
// Object.fromEntries(): Converts the filtered key-value pairs back into an object.
// value ?? null assigns null only if value is null or undefined (ignores false and 0).