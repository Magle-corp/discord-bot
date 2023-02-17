import { formatInTimeZone } from "date-fns-tz";

const formatAtTimeZone = (date) => {
  return formatInTimeZone(date, process.env.TZ, "dd-MM HH:mm");
};

export default {
  formatAtTimeZone,
};
