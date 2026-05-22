/**
 * Convert "minutes since midnight" into a 12-hour clock string with AM/PM.
 *
 * @param minutes - Integer in the range [0, 1439].
 * @returns Formatted time, e.g. `"09:01 PM"`.
 * @throws {Error} If `minutes` is not an integer, is negative, or is >= 1440.
 *
 * @example
 * minutesToClockTime(0);    // "12:00 AM"
 * minutesToClockTime(720);  // "12:00 PM"
 * minutesToClockTime(1261); // "09:01 PM"
 */
export function minutesToClockTime(minutes: number): string {
  if (!Number.isInteger(minutes) || minutes < 0 || minutes >= 1440) {
    throw new Error(
      `minutesToClockTime: expected an integer in [0, 1439], received ${minutes}`
    );
  }

  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  const hh = String(hours12).padStart(2, '0');
  const mm = String(mins).padStart(2, '0');
  return `${hh}:${mm} ${period}`;
}
