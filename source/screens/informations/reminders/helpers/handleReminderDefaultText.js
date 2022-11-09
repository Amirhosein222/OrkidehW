export function handleReminderDefaultText(reminders, type) {
  if (!reminders.length) {
    return null;
  }

  const reminder = reminders.filter(rem => rem.type === type);
  if (!reminder.length) {
    return null;
  }
  return (reminder[0].description && reminder[0].description) || null;
}
