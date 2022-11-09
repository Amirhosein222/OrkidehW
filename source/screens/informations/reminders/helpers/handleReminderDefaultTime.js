export function handleReminderDefaultTime(reminders, type) {
  if (!reminders.length) {
    return '10:00';
  }

  const reminder = reminders.filter(rem => rem.type === type);
  if (!reminder.length) {
    return '10:00';
  }
  return (reminder[0].time && reminder[0].time.replace(':00', '')) || '10:00';
}
