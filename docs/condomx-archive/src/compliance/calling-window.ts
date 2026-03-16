/**
 * TCPA calling window enforcement.
 * No calls before 8am or after 9pm in the RECIPIENT's local time.
 */

export const CALLING_HOURS = { start: 8, end: 21 } as const;

/**
 * Get the current hour and minute in a given IANA timezone.
 */
function getCurrentTimeInZone(timezone: string): { hour: number; minute: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const hour = Number(parts.find(p => p.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find(p => p.type === 'minute')?.value ?? 0);
  return { hour, minute };
}

/**
 * Check if the current time falls within the TCPA-compliant calling window
 * (8:00 AM - 9:00 PM) in the recipient's local timezone.
 */
export function isWithinCallingWindow(timezone: string): boolean {
  const { hour } = getCurrentTimeInZone(timezone);
  return hour >= CALLING_HOURS.start && hour < CALLING_HOURS.end;
}

/**
 * Get the next time the calling window opens (next 8:00 AM in the recipient's timezone).
 * If currently within the window, returns the next day's 8 AM.
 * If outside the window, returns the upcoming 8 AM.
 */
export function getNextWindowOpen(timezone: string): Date {
  const now = new Date();
  const { hour } = getCurrentTimeInZone(timezone);

  // Build a date string in the target timezone to figure out the local date
  const dateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const localDateStr = dateFormatter.format(now); // YYYY-MM-DD

  // Parse the local date components
  const [yearStr, monthStr, dayStr] = localDateStr.split('-');
  let year = Number(yearStr);
  let month = Number(monthStr) - 1; // JS months are 0-indexed
  let day = Number(dayStr);

  // If we're currently within or past the window, target tomorrow's 8 AM
  if (hour >= CALLING_HOURS.start) {
    // Advance to next day
    const nextDay = new Date(Date.UTC(year, month, day + 1));
    year = nextDay.getUTCFullYear();
    month = nextDay.getUTCMonth();
    day = nextDay.getUTCDate();
  }

  // We need to find the UTC time that corresponds to 8:00 AM in the target timezone.
  // Strategy: create a candidate UTC date, check what time it is in the target zone,
  // then adjust by the offset.
  const candidate = new Date(Date.UTC(year, month, day, CALLING_HOURS.start, 0, 0));

  // Determine the offset: what time does `candidate` show in the target timezone?
  const candidateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const candidateParts = candidateFormatter.formatToParts(candidate);
  const candidateHour = Number(candidateParts.find(p => p.type === 'hour')?.value ?? 0);
  const candidateMinute = Number(candidateParts.find(p => p.type === 'minute')?.value ?? 0);

  // The offset in minutes: how far off is the candidate from the desired 8:00 AM local
  const offsetMinutes = (candidateHour - CALLING_HOURS.start) * 60 + candidateMinute;

  // Subtract the offset to land on exactly 8:00 AM local
  return new Date(candidate.getTime() - offsetMinutes * 60 * 1000);
}
