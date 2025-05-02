export const convertStringToNumberArray = (str: string, separator: string): number[] => {
  if (!str.includes(separator)) return [];
  const strArray = str.split(separator);
  const numberArray: number[] = [];
  for (const item of strArray) {
    numberArray.push(parseInt(item));
  }
  return numberArray;
};
