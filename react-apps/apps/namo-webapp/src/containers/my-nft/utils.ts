export const durationToDay = (duration: string) => {
  switch (duration) {
    case 'oneDay':
      return 1;
    case 'oneWeek':
      return 7;
    case 'oneMonth':
      return 30;
    default:
      return -1;
  }
};
export const timeAndUnitToDay = (time: number, unit: string) => {
  switch (unit) {
    case 'day':
      return 1 * time;
    case 'week':
      return 7 * time;
    case 'month':
      return 30 * time;
    default:
      return -1;
  }
};
