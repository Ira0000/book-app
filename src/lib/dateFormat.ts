export const formatDate = (isoString: string): string => {
  const dateObject = new Date(isoString);

  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const year = dateObject.getFullYear();

  return `${day}.${month}.${year}`;
};

export const formatTimeRead = (start: string, finish: string): string => {
  const startTime = new Date(start);
  const finishTime = new Date(finish);
  const timeReadMilliseconds = finishTime.getTime() - startTime.getTime();

  const totalMinutes = Math.floor(timeReadMilliseconds / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }
  return `${minutes} minutes`;
};

export const formatTimeReadInMinutes = (
  start: string,
  finish: string
): number => {
  const startTime = new Date(start);
  const finishTime = new Date(finish);
  const timeReadMilliseconds = finishTime.getTime() - startTime.getTime();

  const totalMinutes = Math.floor(timeReadMilliseconds / (1000 * 60));
  return totalMinutes;
};

export const calculateTimeLeftToRead = (
  totalPages: number,
  pagesRead: number,
  timeRead: number
): number | null => {
  if (pagesRead === 0 || timeRead === 0) {
    return null;
  }

  const readingSpeed = pagesRead / timeRead;
  const pagesLeft = totalPages - pagesRead;

  if (pagesLeft < 0) {
    return 0;
  }

  const timeLeftInMinutes = pagesLeft / readingSpeed;
  return timeLeftInMinutes;
};

// New helper function to format minutes into hours and minutes
export const formatTimeLeft = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);

  if (hours > 0) {
    return `${hours} hours ${remainingMinutes} minutes left`;
  } else {
    return `${remainingMinutes} minutes left`;
  }
};

export const formatReadingSpeed = (
  startPage: number,
  finishPage: number,
  start: string,
  finish: string
): string => {
  const pagesRead = finishPage - startPage;

  const startTime = new Date(start);
  const finishTime = new Date(finish);
  const timeReadMilliseconds = finishTime.getTime() - startTime.getTime();

  const totalHours = timeReadMilliseconds / (1000 * 60 * 60);

  if (totalHours === 0) {
    return "N/A";
  }

  const readingSpeed = pagesRead / totalHours;

  return `${readingSpeed.toFixed(0)} pages per hour`;
};
