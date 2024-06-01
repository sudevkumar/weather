export const convertToTime = (time: number) => {
  let date = new Date(time * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();

  return `${hours}:${minutes}`;
};
