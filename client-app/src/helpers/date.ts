export const getDate = (d?: string): string => {
  const date = d ? new Date(d) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${year}/${month + 1}/${day} ${hours}:${minutes}:${seconds}`;
};
