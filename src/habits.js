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
  const completed = new Set(days);
  let offset = completed.has(dateKey(now)) ? 0 : -1;
  let count = 0;
  while (completed.has(dateKey(now, offset))) {
    count += 1;
    offset -= 1;
  }
  return count;
}

export function filterHabits(habits, query, category, completedOnly, today) {
  const search = query.trim().toLowerCase();
  return habits.filter(habit =>
    (category === 'All' || habit.category === category) &&
    (!completedOnly || habit.days.includes(today)) &&
    [habit.name, habit.note, habit.category].some(value => value.toLowerCase().includes(search))
  );
}
