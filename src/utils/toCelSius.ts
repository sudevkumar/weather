export const toCelSius = (temp: number) => {
  const celSius = temp - 273.15;
  return Math.floor(celSius);
};
