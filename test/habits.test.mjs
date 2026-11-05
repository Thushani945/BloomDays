import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { dateKey, filterHabits, isScheduled, reportDays, scheduledStreak, starterHabits, streak, toggleDay, updateSchedule, weeklyPlan } from '../src/habits.js';

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

test('scheduled streak skips rest days but stops at a missed check-in', () => {
  const monday = new Date(2026, 0, 5, 12);
  const habit = {
    createdOn: '2026-01-01',
    schedule: [{ from: '2026-01-01', weekdays: [1, 3, 5] }],
    days: ['2026-01-02', '2026-01-05'],
  };
  assert.equal(scheduledStreak(habit, monday), 2);
  assert.equal(scheduledStreak(habit, new Date(2026, 0, 8, 12)), 0);
});

test('schedule edits apply forward and keep historical check-ins visible', () => {
  const friday = new Date(2026, 0, 2, 12);
  const habit = { days: ['2026-01-01', '2026-01-02'], createdOn: '2026-01-01' };
  habit.schedule = updateSchedule(habit, [1, 2], dateKey(friday));
  assert.equal(isScheduled(habit, jan1), true);
  assert.equal(isScheduled(habit, friday), false);
  const report = reportDays([habit], friday);
  assert.deepEqual(report.slice(-3).map(day => [day.done, day.planned]), [[0, 0], [1, 1], [1, 1]]);
});

test('legacy daily habits keep their completion history and remain scheduled', () => {
  const legacy = { days: ['2026-01-01'] };
  assert.equal(isScheduled(legacy, jan1), true);
  assert.equal(scheduledStreak(legacy, jan1), 1);
  assert.equal(reportDays([legacy], jan1, 1)[6].key, '2025-12-25');
});

test('planner counts repeat days regardless of completion history', () => {
  const mondayOnly = { days: [], schedule: [{ from: '2026-01-01', weekdays: [1] }] };
  const legacy = { days: ['2026-01-01'] };
  assert.deepEqual(weeklyPlan([mondayOnly, legacy], '2026-01-01'), [
    { day: 1, count: 2 }, { day: 2, count: 1 }, { day: 3, count: 1 },
    { day: 4, count: 1 }, { day: 5, count: 1 }, { day: 6, count: 1 },
    { day: 0, count: 1 },
  ]);
});
