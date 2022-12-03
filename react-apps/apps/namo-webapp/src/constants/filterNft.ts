export const SORT = {
  DESC: 'DESC',
  ASC: 'ASC',
};

export const listFilterPrice = [
  { value: SORT.DESC, label: 'Highest to lowest' },
  { value: SORT.ASC, label: 'Lowest to highest' },
];
export const listVisibility = [
  { value: true, label: 'Visible' },
  { value: false, label: 'Invisible' },
];

export const listFilterStatus = [
  { value: 'FORRENT', label: 'For rent' },
  { value: 'RENTED', label: 'Rented' },
  { value: 'UNAVAILABLE', label: 'Unavailable' },
];

export const listFilterSort = [
  { value: SORT.DESC, label: 'Newest to oldest' },
  { value: SORT.ASC, label: 'Oldest to newest' },
];
