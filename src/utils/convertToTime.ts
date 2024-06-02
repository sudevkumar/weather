export const convertToTime = (time: number) => {
  let date = new Date(time * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let minute =
    minutes.toString().split("").length === 0
      ? "00"
      : minutes.toString().split("").length === 1
      ? "0" + `${minutes}`
      : minutes;

  return `${hours}:${minute}`;
};
