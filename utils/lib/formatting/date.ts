// Fonction pour formater la date
export function formatDateAndTime(dateString) {
  const messageDate = new Date(dateString);
  const hour = messageDate.getHours();
  const minutes = messageDate.getMinutes();
  const day = messageDate.getDate();
  const month = getMonthName(messageDate.getMonth());
  const year = messageDate.getFullYear();

  return `${day} ${month} ${year} - ${hour}:${minutes}`;
}

export function formatDate(dateString) {
  const messageDate = new Date(dateString);
  const day = messageDate.getDate();
  const month = getMonthName(messageDate.getMonth());
  const year = messageDate.getFullYear();

  return `${day} ${month} ${year}`;
}

export function formatTime(dateString) {
  const messageDate = new Date(dateString);
  const hour = messageDate.getHours();
  const minutes = messageDate.getMinutes();

  return `${hour}:${minutes}`;
}

// Fonction pour obtenir le nom du mois en français
function getMonthName(month) {
  const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ];

  return months[month];
}
