export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds} sec ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)
    return minutes === 1 ? "1 min ago" : `${minutes} mins ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24)
    return hours === 1 ? "1 hr ago" : `${hours} hrs ago`;

  const days = Math.floor(hours / 24);
  if (days < 30)
    return days === 1 ? "1 day ago" : `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months < 12)
    return months === 1 ? "1 month ago" : `${months} months ago`;

  const years = Math.floor(months / 12);
  return years === 1 ? "1 year ago" : `${years} years ago`;
};
