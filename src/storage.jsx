import AsyncStorage from '@react-native-async-storage/async-storage';
import { dateKey, starterHabits } from './habits';

const STORAGE_KEY = 'bloomdays.habits.v1';

export async function loadHabits() {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  if (saved !== null) return JSON.parse(saved);
  const createdOn = dateKey();
  const habits = starterHabits.map(habit => ({ ...habit, days: [], createdOn }));
  await saveHabits(habits);
  return habits;
}

export function saveHabits(habits) {
  return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}
