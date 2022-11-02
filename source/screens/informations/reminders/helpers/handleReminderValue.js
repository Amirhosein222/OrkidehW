export function handleReminderValue(reminders, type) {
  const reminder = reminders.filter(rem => rem.type === type);
  return reminder[0].send_notif === 1 ? true : false;
}
