import React, { useEffect, useRef, useState } from 'react';
import { Alert, AppState, BackHandler, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { dateKey, toggleDay } from './src/habits';
import { Details, Garden, HabitForm, Progress, Today } from './src/screens';
import { loadHabits, saveHabits } from './src/storage';
import { Button, color, Empty } from './src/ui';

const tabs = [
  { name: 'Today', icon: '☀' },
  { name: 'Garden', icon: '✿' },
  { name: 'Progress', icon: '↗' },
];

function Tracker() {
  const [habits, setHabits] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [routes, setRoutes] = useState([{ name: 'Today' }]);
  const [now, setNow] = useState(() => new Date());
  const saving = useRef(false);
  const route = routes[routes.length - 1];
  const habit = habits?.find(item => item.id === route.id);
  const today = dateKey(now);

  async function load() {
    setLoadError(false);
    try {
      setHabits(await loadHabits());
    } catch {
      setLoadError(true);
    }
  }

  useEffect(() => {
    load();
    const refreshDate = () => setNow(new Date());
    const timer = setInterval(refreshDate, 15000);
    const subscription = AppState.addEventListener('change', refreshDate);
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, []);

  function back() {
    setRoutes(current => current.length > 1 ? current.slice(0, -1) : current);
  }

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (routes.length === 1) return false;
      back();
      return true;
    });
    return () => subscription.remove();
  }, [routes.length]);

  function push(name, id) {
    setRoutes(current => [...current, { name, id }]);
  }

  async function update(next, onSaved) {
    if (saving.current) return;
    saving.current = true;
    try {
      await saveHabits(next);
      setHabits(next);
      onSaved?.();
    } catch {
      Alert.alert('Could not save', 'Your previous habits are still available. Please try again.');
    } finally {
      saving.current = false;
    }
  }

  function toggle(id) {
    const currentDate = new Date();
    setNow(currentDate);
    update(habits.map(item => item.id === id
      ? { ...item, days: toggleDay(item.days, dateKey(currentDate)) }
      : item));
  }

  function save(fields) {
    const next = habit
      ? habits.map(item => item.id === habit.id ? { ...item, ...fields } : item)
      : [...habits, { ...fields, id: String(Date.now()), days: [] }];
    update(next, back);
  }

  const listProps = { habits, now, today, toggle, open: id => push('Details', id), add: () => push('Form') };
  let screen;
  if (loadError) {
    screen = <><Empty title="Could not open your garden">Try loading your saved habits again.</Empty><Button label="Try again" onPress={load} /></>;
  } else if (!habits) {
    screen = <Empty title="Opening your garden">Loading saved habits…</Empty>;
  } else {
    switch (route.name) {
      case 'Garden': screen = <Garden {...listProps} />; break;
      case 'Progress': screen = <Progress habits={habits} now={now} />; break;
      case 'Form': screen = <HabitForm habit={habit} save={save} />; break;
      case 'Details': screen = habit && <Details {...{ habit, now, today, toggle }}
        edit={() => push('Form', habit.id)}
        remove={() => update(habits.filter(item => item.id !== habit.id), back)} />; break;
      default: screen = <Today {...listProps} />;
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      {routes.length > 1 && <Pressable accessibilityRole="button" onPress={back} style={styles.back}>
        <Text style={styles.tabText}>‹  Back</Text>
      </Pressable>}
      <ScrollView key={route.name + (route.id ?? '')} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {screen}
      </ScrollView>
      {routes.length === 1 && habits && <View style={styles.tabs}>
        {tabs.map(tab => {
          const active = route.name === tab.name;
          return <Pressable key={tab.name} accessibilityRole="tab" accessibilityLabel={tab.name} accessibilityState={{ selected: active }}
            onPress={() => setRoutes([{ name: tab.name }])} style={[styles.tab, active && styles.active]}>
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={styles.tabText}>{tab.name}</Text>
          </Pressable>;
        })}
      </View>}
    </SafeAreaView>
  );
}

export default function App() {
  return <SafeAreaProvider><Tracker /></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.paper },
  content: { padding: 18, paddingBottom: 24, gap: 13, width: '100%', maxWidth: 640, alignSelf: 'center' },
  back: { minHeight: 48, paddingHorizontal: 20, justifyContent: 'center', alignSelf: 'flex-start' },
  tabs: { flexDirection: 'row', backgroundColor: color.white, borderTopWidth: 1, borderTopColor: color.line, padding: 7, gap: 7 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 18, minHeight: 56 },
  active: { backgroundColor: color.lime },
  tabText: { color: color.green, fontWeight: '800', fontSize: 13 },
  tabIcon: { color: color.green, fontSize: 20, fontWeight: '800' },
});
