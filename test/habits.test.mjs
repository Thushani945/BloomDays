import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { dateKey, filterHabits, starterHabits, streak, toggleDay } from '../src/habits.js';

const jan1 = new Date(2026, 0, 1, 12);

test('calendar dates roll over in local time', () => {
  assert.equal(dateKey(jan1), '2026-01-01');
  assert.equal(dateKey(jan1, -1), '2025-12-31');
});

test('a completion can be added and undone without changing prior state', () => {
  const days = ['2025-12-31'];
  const completed = toggleDay(days, '2026-01-01');
  assert.deepEqual(completed, ['2025-12-31', '2026-01-01']);
  assert.deepEqual(toggleDay(completed, '2026-01-01'), days);
  assert.deepEqual(days, ['2025-12-31']);
});

test('an active streak allows a pending today but ends at a missed day', () => {
  assert.equal(streak(['2025-12-30', '2025-12-31'], jan1), 2);
  assert.equal(streak(['2025-12-29', '2026-01-01'], jan1), 1);
  assert.equal(streak(['2025-12-30'], jan1), 0);
});

test('search matches notes and combines with category and completion filters', () => {
  const today = dateKey(jan1);
  const habits = starterHabits.map(habit => ({ ...habit, days: habit.id === 'walk' ? [today] : [] }));
  assert.deepEqual(filterHabits(habits, ' AFTER CLASS ', 'Movement', true, today).map(habit => habit.id), ['walk']);
  assert.deepEqual(filterHabits(habits, '', 'Learning', true, today), []);
  assert.equal(filterHabits(habits, '', 'All', false, today).length, 5);
});
