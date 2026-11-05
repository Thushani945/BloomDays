import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { categories, dateKey, filterHabits, streak } from './habits';
import { Button, color, Empty, Heading, s } from './ui';

export function HabitRow({ habit, today, open, toggle }) {
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

export function Today({ habits, now, today, open, toggle, add }) {
  const done = habits.filter(habit => habit.days.includes(today)).length;
  const percent = habits.length ? Math.round(done / habits.length * 100) : 0;
  const day = now.toLocaleDateString('en-LK', { weekday: 'long', month: 'long', day: 'numeric' });
  return (
    <>
      <Heading eyebrow="✿  BLOOMDAYS" title="Today" subtitle={day} />
      <View style={styles.hero}>
        <Text accessible={false} pointerEvents="none" style={styles.flower}>✿</Text>
        <Text style={styles.heroLabel}>YOUR DAILY GARDEN</Text>
        <Text style={styles.heroTitle}>{percent}% in bloom</Text>
        <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: percent }} style={styles.track}>
          <View style={[styles.fill, { width: percent + '%' }]} />
        </View>
        <Text style={styles.heroLabel}>{done} of {habits.length} habits completed</Text>
      </View>
      <Text style={s.section}>Daily habits</Text>
      {habits.length === 0 && <Empty title="Plant your first habit">Choose one small action you can do every day.</Empty>}
      {habits.map(habit => <HabitRow key={habit.id} {...{ habit, today, open, toggle }} />)}
      <Button label="+ Plant a habit" onPress={add} />
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

export function Garden({ habits, today, open, toggle, add }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [completedOnly, setCompletedOnly] = useState(false);
  const results = filterHabits(habits, query, category, completedOnly, today);
  return (
    <>
      <Heading eyebrow="01  /  COLLECTION" title="My garden" subtitle="Find and manage your daily habits." />
      <TextInput accessibilityLabel="Search habits" placeholder="Search habits" placeholderTextColor={color.muted}
        value={query} onChangeText={setQuery} style={s.input} />
      <CategoryPicker options={['All', ...Object.keys(categories)]} value={category} select={setCategory} />
      <View style={styles.row}>
        <Text style={[s.strong, styles.grow]}>Completed today</Text>
        <Switch accessibilityLabel="Show only habits completed today" value={completedOnly}
          onValueChange={setCompletedOnly} trackColor={{ true: '#57936D' }} />
      </View>
      <Text style={s.muted}>{results.length} {results.length === 1 ? 'habit' : 'habits'}</Text>
      {results.length === 0 && <Empty title="No habits found">Try a different search or category, or plant a habit.</Empty>}
      {results.map(habit => <HabitRow key={habit.id} {...{ habit, today, open, toggle }} />)}
      <Button label="+ Plant a habit" onPress={add} />
    </>
  );
}

export function Progress({ habits, now }) {
  const week = Array.from({ length: 7 }, (_, index) => {
    const offset = index - 6;
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const key = dateKey(now, offset);
    return {
      key,
      label: day.toLocaleDateString('en-LK', { weekday: 'short' }),
      count: habits.filter(habit => habit.days.includes(key)).length,
    };
  });
  const weeklyTotal = week.reduce((total, day) => total + day.count, 0);
  const bestStreak = Math.max(0, ...habits.map(habit => streak(habit.days, now)));
  return (
    <>
      <Heading eyebrow="02  /  YOUR GROWTH" title="Progress" subtitle="See what you completed over the last seven days." />
      <View style={styles.stats}>
        <View style={[styles.stat, { backgroundColor: '#EEE0FF' }]}><Text style={styles.statNumber}>{weeklyTotal}</Text><Text style={s.muted}>Check-ins in 7 days</Text></View>
        <View style={[styles.stat, { backgroundColor: '#DBF2CD' }]}><Text style={styles.statNumber}>{bestStreak}</Text><Text style={s.muted}>Top active streak</Text></View>
      </View>
      <View style={styles.panel}>
        <Text style={s.section}>Last 7 days</Text>
        {week.map(day => (
          <View key={day.key} style={styles.chartRow} accessible accessibilityLabel={day.key + ', ' + day.count + ' completed'}>
            <Text style={[s.muted, { width: 44 }]}>{day.label}</Text>
            <View style={[styles.track, styles.grow, { backgroundColor: '#E8EFE3' }]}>
              <View style={[styles.fill, { backgroundColor: '#4B805A', width: (habits.length ? day.count / habits.length * 100 : 0) + '%' }]} />
            </View>
            <Text style={s.strong}>{day.count}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

export function Details({ habit, now, today, toggle, edit, remove }) {
  const category = categories[habit.category];
  const done = habit.days.includes(today);
  const recent = [...habit.days].sort().reverse().slice(0, 7);
  return (
    <>
      <View style={[styles.panel, { backgroundColor: category.color }]}>
        <Text style={{ fontSize: 34 }}>{category.icon}</Text>
        <Heading eyebrow={habit.category.toUpperCase()} title={habit.name} subtitle={habit.note || 'A small action to return to every day.'} />
      </View>
      <Button label={done ? 'Undo today’s completion' : 'Mark complete for today'} onPress={() => toggle(habit.id)} />
      <View style={styles.stats}>
        <View style={styles.stat}><Text style={styles.statNumber}>{streak(habit.days, now)}</Text><Text style={s.muted}>Day streak</Text></View>
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

export function HabitForm({ habit, save }) {
  const [name, setName] = useState(habit?.name ?? '');
  const [category, setCategory] = useState(habit?.category ?? 'Wellness');
  const [note, setNote] = useState(habit?.note ?? '');
  const [error, setError] = useState('');
  function submit() {
    if (!name.trim()) {
      setError('Enter a habit name to continue.');
      return;
    }
    save({ name: name.trim(), category, note: note.trim() });
  }
  return (
    <>
      <Heading eyebrow="03  /  PLANT SOMETHING" title={habit ? 'Edit habit' : 'New habit'} subtitle="Choose a small action you can repeat every day." />
      <Text style={s.strong}>Habit name</Text>
      <TextInput accessibilityLabel="Habit name" placeholder="e.g. Stretch for five minutes" placeholderTextColor={color.muted}
        value={name} onChangeText={value => { setName(value); setError(''); }} maxLength={60} style={s.input} />
      {error ? <Text accessibilityLiveRegion="polite" style={{ color: color.danger }}>{error}</Text> : null}
      <Text style={s.strong}>Category</Text>
      <CategoryPicker options={Object.keys(categories)} value={category} select={setCategory} />
      <Text style={s.strong}>Note (optional)</Text>
      <TextInput accessibilityLabel="Habit note" placeholder="When or how will you do it?" placeholderTextColor={color.muted}
        value={note} onChangeText={setNote} maxLength={240} multiline style={[s.input, { minHeight: 100, textAlignVertical: 'top' }]} />
      <Button label="Save habit" onPress={submit} />
    </>
  );
}

const styles = StyleSheet.create({
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
