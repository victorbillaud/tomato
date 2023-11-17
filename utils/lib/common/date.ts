// Write a dateHelper function that takes a date and returns a string in the format of YYYY-MM-DD or YYYY-MM-DD HH:mm:ss or 
// 14, October 2020 or 14, October 2020 12:00:00. The function should be able to take a second argument that specifies the format
import dateFormat, { DateFormatMasks } from "dateformat";


export const dateHelper = (date: Date, format: DateFormatMasks) => {
    return dateFormat(date, format);
};