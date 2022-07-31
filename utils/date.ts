import dayjs from 'dayjs';
import { ConfigType } from 'dayjs';

export function datetimeFormatter(datetime: ConfigType, format = 'YYYY-MM-DD hh:mm') {
  return dayjs(datetime).format(format);
}