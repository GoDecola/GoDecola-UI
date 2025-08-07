export const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

export const convertDateString = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    return '';
  }

  const dateOnly = dateString.split('T')[0];

  const [year, month, day] = dateOnly.split('-');

  if (!year || !month || !day) {
    return '';
  }

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString('pt-BR');
};