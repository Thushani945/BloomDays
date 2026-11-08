import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { categories, filterHabits, isScheduled, reportDays, scheduleOn, scheduledStreak, plannerWeek, weekdays, weeklyPlan } from './habits';
import { Button, color, Empty, Heading, s } from './ui';

function scheduleLabel(habit, today) {
  const selected = scheduleOn(habit, today);
  return selected.length === 7 ? 'Every day' : weekdays.filter((_, day) => selected.includes(day)).join(' · ');
}

function CheckInRow({ habit, today, open, toggle }) {
  const category = categories[habit.category];
  const done = habit.days.includes(today);
  return (
    <View style={styles.row}>
      <Pressable accessibilityRole="button" onPress={() => open(habit.id)} style={styles.rowMain}>
        <Text style={[styles.icon, { backgroundColor: category.color }]}>{category.icon}</Text>
        <View style={styles.grow}>
          <Text style={s.strong}>{habit.name}</Text>
          <Text style={s.muted}>{habit.category}</Text>
        </View>
      </Pressable>
      <Pressable accessibilityRole="checkbox" accessibilityLabel={habit.name} accessibilityState={{ checked: done }}
        onPress={() => toggle(habit.id)} style={[styles.check, done && styles.checked]}>
        <Text style={{ color: done ? color.white : color.green, fontWeight: '800' }}>{done ? '✓' : '○'}</Text>
      </Pressable>
    </View>
  );
}

export function Today({ habits, now, today, open, toggle }) {
  const planned = habits.filter(
    habit => habit.days.includes(today) || isScheduled(habit, now, today)
  );
  const completed = planned.filter(habit => habit.days.includes(today));
  const percent = planned.length
    ? Math.round((completed.length / planned.length) * 100)
    : 0;
  const day = now.toLocaleDateString('en-LK', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Heading eyebrow="✿  BLOOMDAYS" title="Today" subtitle={day} />

      <View style={styles.hero}>
        <Text accessible={false} pointerEvents="none" style={styles.flower}>✿</Text>
        <Text style={styles.heroLabel}>DAILY CHECK-IN</Text>
        <Text style={styles.heroTitle}>
          {planned.length ? `${percent}% complete` : 'Rest day'}
        </Text>
        <View
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: percent }}
          style={styles.track}
        >
          <View style={[styles.fill, { width: `${percent}%` }]} />
        </View>
        <Text style={styles.heroLabel}>
          {completed.length} of {planned.length} scheduled habits complete
        </Text>
      </View>

      {planned.length === 0 && (
        <Empty title="Nothing scheduled today">
          Add a habit or adjust its schedule in My Habits.
        </Empty>
      )}

      {['Morning', 'Afternoon', 'Evening', 'Anytime'].map(period => {
        const group = planned.filter(
          habit => (habit.timeOfDay ?? 'Anytime') === period
        );

        if (group.length === 0) return null;

        return (
          <React.Fragment key={period}>
            <Text style={s.section}>{period} · {group.length}</Text>
            {group.map(habit => (
              <CheckInRow
                key={habit.id}
                habit={habit}
                today={today}
                open={open}
                toggle={toggle}
              />
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
}

function CategoryPicker({ options, value, select }) {
  return (
    <View style={styles.chips}>
      {options.map(option => (
        <Pressable key={option} accessibilityRole="button" accessibilityState={{ selected: option === value }}
          onPress={() => select(option)} style={[styles.chip, option === value && styles.activeChip]}>
          <Text style={{ color: color.green, fontWeight: '700' }}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function RoutineCard({ habit, today, open, edit }) {
  const category = categories[habit.category];
  const schedule = scheduleOn(habit, today);
  return (
    <View style={[styles.panel, styles.routineCard]}>
      <Pressable accessibilityRole="button" accessibilityLabel={'View details for ' + habit.name}
        onPress={() => open(habit.id)} style={styles.rowMain}>
        <Text accessible={false} style={[styles.icon, { backgroundColor: category.color }]}>{category.icon}</Text>
        <View style={styles.grow}>
          <Text style={s.muted}>{habit.category}</Text>
          <Text style={s.strong}>{habit.name}</Text>
        </View>
        <Text accessible={false} style={styles.chevron}>›</Text>
      </Pressable>
      <View style={styles.routineFooter}>
        <Text style={[styles.chartValue, styles.grow]}>{scheduleLabel(habit, today)}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={'Edit ' + habit.name}
          onPress={() => edit(habit.id)} style={styles.editLink}>
          <Text style={styles.chartValue}>Edit</Text>
        </Pressable>
      </View>
      <View style={styles.scheduleStrip} accessible accessibilityLabel={'Repeats ' + scheduleLabel(habit, today)}>
        {plannerWeek.map(day => (
          <View key={day} style={[styles.scheduleDay, schedule.includes(day) && styles.scheduleDayActive]}>
            <Text style={styles.chartValue}>{weekdays[day].slice(0, 2)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function ManageHabits({ habits, today, open, add, edit }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedDay, setSelectedDay] = useState(null);
  const week = weeklyPlan(habits, today);
  const planned = week.reduce((total, day) => total + day.count, 0);
  const results = filterHabits(habits, query, category, false, today)
    .filter(habit => selectedDay === null || scheduleOn(habit, today).includes(selectedDay));
  return (
    <>
      <Heading eyebrow="ROUTINE PLANNER" title="My Habits" subtitle="Build a weekly routine that fits your schedule." />
      <View style={styles.planner}>
        <Text style={s.section}>Your weekly plan</Text>
        <Text style={s.muted}>{habits.length} routines · {planned} planned sessions per week</Text>
        <View style={styles.scheduleStrip}>
          {week.map(({ day, count }) => (
            <Pressable key={day} accessibilityRole="button" accessibilityState={{ selected: day === selectedDay }}
              accessibilityLabel={weekdays[day] + ', ' + count + ' scheduled'}
              onPress={() => setSelectedDay(current => current === day ? null : day)}
              style={[styles.plannerDay, day === selectedDay && styles.activeChip]}>
              <Text style={styles.plannerLabel}>{weekdays[day].slice(0, 2)}</Text>
              <Text style={styles.plannerCount}>{count}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={s.muted}>Tap a day to see its routines.</Text>
      </View>
      <Button label="+ New Habit" onPress={add} />
      <TextInput accessibilityLabel="Search routines" placeholder="Search names, categories, or notes" placeholderTextColor={color.muted}
        value={query} onChangeText={setQuery} style={s.input} />
      <CategoryPicker options={['All', ...Object.keys(categories)]} value={category} select={setCategory} />
      <Text style={s.section}>{selectedDay === null ? 'All routines' : weekdays[selectedDay] + ' routines'} · {results.length}</Text>
      {(selectedDay !== null || category !== 'All' || query !== '') && <Button label="Clear filters" secondary onPress={() => {
        setSelectedDay(null);
        setCategory('All');
        setQuery('');
      }} />}
      {results.length === 0 && <Empty title={habits.length ? 'No matching routines' : 'Build your first routine'}>
        {habits.length ? 'Try another day, category, or search.' : 'Add a habit and choose the days you want to repeat it.'}
      </Empty>}
      {results.map(habit => <RoutineCard key={habit.id} {...{ habit, today, open, edit }} />)}
    </>
  );
}

export function Progress({ habits, now }) {
  const [weeksAgo, setWeeksAgo] = useState(0);
  const week = reportDays(habits, now, weeksAgo);
  const done = week.reduce((total, day) => total + day.done, 0);
  const planned = week.reduce((total, day) => total + day.planned, 0);
  const bestStreak = Math.max(0, ...habits.map(habit => scheduledStreak(habit, now)));
  const format = date => date.toLocaleDateString('en-LK', { month: 'short', day: 'numeric' });
  return (
    <>
      <Heading eyebrow="ACTIVITY REPORT" title="Progress" subtitle="See how consistently you follow your schedule." />
      <View style={styles.stats}>
        <View style={[styles.stat, { backgroundColor: '#DBF2CD' }]}>
          <Text style={styles.statNumber}>{bestStreak}</Text><Text style={s.muted}>Top active streak</Text>
        </View>
        <View style={[styles.stat, { backgroundColor: '#EEE0FF' }]}>
          <Text style={styles.statNumber}>{habits.reduce((total, habit) => total + habit.days.length, 0)}</Text>
          <Text style={s.muted}>Total check-ins</Text>
        </View>
      </View>
      <View style={styles.panel}>
        <Text style={s.section}>Weekly consistency</Text>
        <View style={styles.weekNav}>
          <Button label="‹ Older" secondary onPress={() => setWeeksAgo(value => value + 1)} />
          <Button label="Newer ›" secondary disabled={weeksAgo === 0} onPress={() => setWeeksAgo(value => value - 1)} />
        </View>
        <Text style={s.muted}>{format(week[0].date)} – {format(week[6].date)} · {week[6].date.getFullYear()}</Text>
        <Text style={styles.statNumber}>{planned ? Math.round(done / planned * 100) + '%' : '—'}</Text>
        <Text style={s.muted}>{done} of {planned} scheduled check-ins complete</Text>
        {week.map(day => (
          <View key={day.key} style={styles.chartRow} accessible accessibilityLabel={day.key + ', ' + day.done + ' of ' + day.planned + ' complete'}>
            <Text style={[s.muted, { width: 44 }]}>{weekdays[day.date.getDay()]}</Text>
            <View style={[styles.track, styles.grow, { backgroundColor: '#E8EFE3' }]}>
              <View style={[styles.fill, { backgroundColor: '#4B805A', width: (day.planned ? day.done / day.planned * 100 : 0) + '%' }]} />
            </View>
            <Text style={styles.chartValue}>{day.planned ? day.done + '/' + day.planned : '—'}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

export function Details({ habit, now, today, edit, remove }) {
  const category = categories[habit.category];
  const recent = [...habit.days].sort().reverse().slice(0, 7);
  return (
    <>
      <View style={[styles.panel, { backgroundColor: category.color }]}>
        <Text style={{ fontSize: 34 }}>{category.icon}</Text>
        <Heading eyebrow={habit.category.toUpperCase()} title={habit.name} subtitle={habit.note || 'A small action to return to every day.'} />
      </View>
      <View style={styles.panel}>
        <Text style={s.strong}>Schedule</Text>
        <Text style={s.muted}>{scheduleLabel(habit, today)}</Text>
      </View>
      <View style={styles.stats}>
        <View style={styles.stat}><Text style={styles.statNumber}>{scheduledStreak(habit, now)}</Text><Text style={s.muted}>Scheduled check-in streak</Text></View>
        <View style={styles.stat}><Text style={styles.statNumber}>{habit.days.length}</Text><Text style={s.muted}>Days completed</Text></View>
      </View>
      <View style={styles.panel}>
        <Text style={s.section}>Recent check-ins</Text>
        {recent.length ? recent.map(day => <Text key={day} style={s.muted}>✓  {day}</Text>) : <Text style={s.muted}>Your completed days will appear here.</Text>}
      </View>
      <Button label="Edit habit" secondary onPress={edit} />
      <Button label="Delete habit" secondary danger onPress={() => Alert.alert('Delete this habit?', 'Its check-ins will also be deleted.', [
        { text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: remove },
      ])} />
    </>
  );
}

export function HabitForm({ habit, today, save }) {
  const [name, setName] = useState(habit?.name ?? '');
  const [category, setCategory] = useState(habit?.category ?? 'Wellness');
  const [note, setNote] = useState(habit?.note ?? '');
  const [timeOfDay, setTimeOfDay] = useState(habit?.timeOfDay ?? 'Anytime');
  const [selectedDays, setSelectedDays] = useState(() => scheduleOn(habit ?? {}, today));
  const [error, setError] = useState('');

  function submit() {
    if (!name.trim()) {
      setError('Enter a habit name to continue.');
      return;
    }
    if (!selectedDays.length) {
      setError('Choose at least one day.');
      return;
    }
    save({
      name: name.trim(),
      category,
      note: note.trim(),
      selectedDays,
      timeOfDay,
    });
  }

  return (
    <>
      <Heading eyebrow="03  /  PLANT SOMETHING" title={habit ? 'Edit Habit' : 'New Habit'} subtitle="Choose an action and the days you want to do it." />
      <Text style={s.strong}>Habit name</Text>
      <TextInput accessibilityLabel="Habit name" placeholder="e.g. Stretch for five minutes" placeholderTextColor={color.muted}
        value={name} onChangeText={value => { setName(value); setError(''); }} maxLength={60} style={s.input} />
      <Text style={s.strong}>Category</Text>
      <CategoryPicker options={Object.keys(categories)} value={category} select={setCategory} />
      <Text style={s.strong}>Note (optional)</Text>
      <TextInput accessibilityLabel="Habit note" placeholder="When or how will you do it?" placeholderTextColor={color.muted}
        value={note} onChangeText={setNote} maxLength={240} multiline style={[s.input, { minHeight: 100, textAlignVertical: 'top' }]} />

      <Text style={s.strong}>Time of day</Text>
      <CategoryPicker
        options={['Anytime', 'Morning', 'Afternoon', 'Evening']}
        value={timeOfDay}
        select={setTimeOfDay}
      />

      <Text style={s.strong}>Repeat on</Text>
      <View style={styles.chips}>
        {weekdays.map((label, day) => {
          const checked = selectedDays.includes(day);
          return (
            <Pressable key={label} accessibilityRole="checkbox" accessibilityState={{ checked }}
              style={[styles.chip, checked && styles.activeChip]} onPress={() => {
                setSelectedDays(current => current.includes(day) ? current.filter(value => value !== day) : [...current, day]);
                setError('');
              }}>
              <Text style={styles.chartValue}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text accessibilityLiveRegion="polite" style={{ color: color.danger }}>{error}</Text> : null}
      <Button label="Save habit" onPress={submit} />
    </>
  );
}
const styles = StyleSheet.create({
  planner: { padding: 16, gap: 12, borderRadius: 24, backgroundColor: '#E8E0FB' },
  scheduleStrip: { flexDirection: 'row', gap: 4 },
  plannerDay: { flex: 1, minHeight: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: color.white, borderWidth: 1, borderColor: color.white },
  plannerLabel: { fontSize: 12, fontWeight: '700', color: color.muted },
  plannerCount: { fontSize: 18, fontWeight: '800', color: color.green },
  routineCard: { borderColor: color.line, borderWidth: 1 },
  routineFooter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scheduleDay: { flex: 1, alignItems: 'center', paddingVertical: 5, borderRadius: 8, backgroundColor: '#F2F3EE' },
  scheduleDayActive: { backgroundColor: '#DBF2CD' },
  editLink: { minHeight: 44, minWidth: 52, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EFF3EA', borderRadius: 12 },
  chevron: { fontSize: 25, color: color.muted, paddingHorizontal: 8 },
  chartValue: { color: color.green, fontWeight: '800' },
  weekNav: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: color.white, borderRadius: 19, padding: 10, gap: 10, borderColor: color.line, borderWidth: 1 },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  grow: { flex: 1 },
  icon: { fontSize: 22, width: 48, lineHeight: 48, textAlign: 'center', borderRadius: 14, overflow: 'hidden' },
  check: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFF3EA', borderRadius: 15 },
  checked: { backgroundColor: color.green },
  hero: { backgroundColor: color.green, padding: 22, borderRadius: 26, gap: 12, overflow: 'hidden' },
  heroLabel: { color: '#E1F1DF', fontSize: 13, fontWeight: '700' },
  heroTitle: { color: color.white, fontSize: 32, fontWeight: '800' },
  flower: { position: 'absolute', top: -26, right: -16, color: '#FFFFFF15', fontSize: 138 },
  track: { height: 9, borderRadius: 6, backgroundColor: '#416650', overflow: 'hidden' },
  fill: { backgroundColor: color.lime, height: '100%', borderRadius: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 22, backgroundColor: color.white, borderWidth: 1, borderColor: color.line, minHeight: 44, justifyContent: 'center', paddingHorizontal: 13 },
  activeChip: { backgroundColor: color.lime, borderColor: '#99AD5C' },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, borderRadius: 20, backgroundColor: color.white, padding: 15 },
  statNumber: { fontSize: 30, fontWeight: '800', color: color.green },
  panel: { backgroundColor: color.white, borderRadius: 22, padding: 18, gap: 10 },
  chartRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 3 },
});
