export default function ConvertDate (createTime) {
  let time;

  // show time
  const notificationTime = new Date(createTime);
  const currentTime = new Date();
  const timeDiff = (currentTime.getTime() - notificationTime.getTime()) / 1000;
  const minuteInSeconds = 60;
  const hourInSeconds = 3600;
  const dayInSeconds = 86400;
  const weekInSeconds = dayInSeconds * 7;
  const yearInSeconds = dayInSeconds * 365;

  if (timeDiff < minuteInSeconds) {
    time = 'now';
  } else if (timeDiff < hourInSeconds) {
    const minutes = Math.floor(timeDiff / 60);
    time = `${minutes} minutes ago`;
  } else if (timeDiff < dayInSeconds) {
    const hours = Math.floor(timeDiff / 3600);
    time = `${hours} hours ago`;
  } else if (timeDiff < weekInSeconds) {
    const days = Math.floor(timeDiff / 86400);
    time = `${days} days ago`;
  } else if (timeDiff < yearInSeconds) {
    const weeks = Math.floor(timeDiff / weekInSeconds);
    time = `${weeks} weeks ago`;
  } else {
    const years = Math.floor(timeDiff / yearInSeconds);
    time = `${years} years ago`;
  }
  return time;
}