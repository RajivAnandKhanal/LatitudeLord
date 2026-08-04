/**
 * Returns a greeting based on the current time of day.
 *
 * Uses the device's local clock rather than deriving a timezone from GPS
 * coordinates: `Date` in JS always reports the phone's current system
 * timezone, and phones set that automatically from network/location as the
 * user travels — so this already reflects "local time where the user is"
 * without needing a separate lat/lng → timezone lookup (which would mean an
 * extra paid API or a large offline timezone-boundary dataset for something
 * the OS already tracks correctly).
 */
export function getTimeBasedGreeting(date: Date = new Date()): string {
  const hour = date.getHours();

  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}
