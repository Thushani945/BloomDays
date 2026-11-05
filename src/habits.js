export const categories = {
  Wellness: { icon: '💧', color: '#DCEEFF' },
  Movement: { icon: '👟', color: '#FFDCCD' },
  Learning: { icon: '📚', color: '#EEE0FF' },
  Mindfulness: { icon: '🌿', color: '#DBF2CD' },
  Routine: { icon: '☀️', color: '#FFF0BF' },
};

export const starterHabits = [
  { id: 'water', name: 'Water before tea', category: 'Wellness', note: 'Drink a glass of water before your first cup of tea.' },
  { id: 'walk', name: 'Ten-minute walk', category: 'Movement', note: 'Take a short walk after class or during a break.' },
  { id: 'read', name: 'Read five pages', category: 'Learning', note: 'Pick a book and leave it somewhere easy to see.' },
  { id: 'reflect', name: 'One good thing', category: 'Mindfulness', note: 'Write one thing you appreciated about today.' },
  { id: 'pack', name: 'Pack for tomorrow', category: 'Routine', note: 'Get your bag and essentials ready before bed.' },
];

export function dateKey(date = new Date(), offset = 0) {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
  return [day.getFullYear(), day.getMonth() + 1, day.getDate()]
    .map((number, index) => String(number).padStart(index === 0 ? 4 : 2, '0')).join('-');
}

export function toggleDay(days, key) {
  return days.includes(key) ? days.filter(day => day !== key) : [...days, key];
}

export function streak(days, now = new Date()) {
  return scheduledStreak({ days }, now);
}

export function filterHabits(habits, query, category, completedOnly, today) {
  const search = query.trim().toLowerCase();
  return habits.filter(habit =>
    (category === 'All' || habit.category === category) &&
    (!completedOnly || habit.days.includes(today)) &&
    [habit.name, habit.note, habit.category].some(value => value.toLowerCase().includes(search))
  );
}

export const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const daily = [0, 1, 2, 3, 4, 5, 6];

export function scheduleOn(habit, key) {
  return habit.schedule?.findLast(period => period.from <= key)?.weekdays ?? daily;
}

export function isScheduled(habit, date, key = dateKey(date)) {
  return (!habit.createdOn || key >= habit.createdOn) && scheduleOn(habit, key).includes(date.getDay());
}

export function updateSchedule(habit, selected, today) {
  const periods = habit.schedule ?? [];
  if (daily.every(day => selected.includes(day) === scheduleOn(habit, today).includes(day))) return periods;
  return [...periods.filter(period => period.from < today), { from: today, weekdays: selected }];
}

export function scheduledStreak(habit, now = new Date()) {
  const completed = new Set(habit.days);
  let count = 0;
  const today = dateKey(now);
  for (let offset = completed.has(today) ? 0 : -1; ; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const key = dateKey(date);
    if (habit.createdOn && key < habit.createdOn) break;
    if (completed.has(key)) count += 1;
    else if (isScheduled(habit, date, key)) break;
  }
  return count;
}

export function reportDays(habits, now, weeksAgo = 0) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + index - 6 - weeksAgo * 7);
    const key = dateKey(date);
    const done = habits.filter(habit => habit.days.includes(key));
    const planned = habits.filter(habit => habit.days.includes(key) || isScheduled(habit, date, key));
    return { key, date, done: done.length, planned: planned.length };
  });
}
