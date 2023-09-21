
/**
 * it converts a given value to date then format it properly 'YYYY-MM-DD'
 * @param {any} value value to be converted
 * @return {string} the formatted value
 */

export function toDateString(value: any): string {
  return new Date(value).toLocaleDateString('en-CA', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  })
}

/**
 * it checks if the value exists
 * @param {string} value string to tested
 * @return {boolean} if there is value or not
 */

export function hasValue(value: any): boolean {
  return value && value !== undefined && value !== null;
}

/**
 * it checks if there is content in the value
 * @param {string} value string to tested
 * @return {boolean} if there is value or not
 */

export function isNotEmpty(value: string): boolean {
  return hasValue(value) && value.trim().length > 0;
}

/**
 * it checks if the date is grater or equals to today
 * @param {date} date to be set
 * @return {boolean} if it has started or not
 */

export function hasStarted(date: Date): boolean {
  if (!hasValue(date)) return false;
  const currentDate = setTimeToZero(new Date());
  date = setTimeToZero(date);
  return currentDate >= date;
}

/**
 * it sets the time to 0 (zero) 
 * @param {date} date to be set
 * @return {date} updated date
 */

export function setTimeToZero(date: Date): Date | any {
  if (!hasValue(date)) return date;
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * it simulates a asynchronous call to an API function
 * @param {Function} callback the function to be called
 */

export async function asyncMethod(callback: Function) {
  const delayPromise = (ms: number) => new Promise(res => setTimeout(res, ms))
  await delayPromise(500)
  return callback()
}