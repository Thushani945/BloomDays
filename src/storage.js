import AsyncStorage from '@react-native-async-storage/async-storage';
import { starterHabits } from './habits';

const STORAGE_KEY = 'bloomdays.habits.v1';

export async function loadHabits() {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  if (saved !== null) return JSON.parse(saved);
  const habits = starterHabits.map(habit => ({ ...habit, days: [] }));
  await saveHabits(habits);
  return habits;
}

export function saveHabits(habits) {
  return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}
