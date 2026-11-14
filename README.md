# BloomDays – Daily Habit Tracker

BloomDays is a React Native app built with Expo for my Mobile Communication and Computing ICA. It helps users plan habits around their daily routines, check off what they complete, and track their progress over time.

## Features I Added

- **Time-of-day groups** — Set a habit for Morning, Afternoon, Evening, or Anytime. The Today screen groups scheduled habits by the selected time of day.
- **Target time and duration** — Add an optional start time and planned duration, such as `17:30 · 15 min`. These details appear on Today and My Habits.
- **Check-in history** — Habit Details shows completed and missed check-ins from the last seven days. A habit is marked as missed only if it was scheduled for a past day and was left unchecked.
- **Monthly progress calendar** — Switch between a weekly report and a color-coded monthly calendar. The calendar shows complete, partial, missed, pending, unscheduled, and upcoming days.

## App Screens

| Screen | What users can do |
| --- | --- |
| **Today** | View today's scheduled habits, mark them complete, and undo a check-in. |
| **My Habits** | Plan the week, search for habits, and filter by weekday or category. |
| **Progress** | View weekly completion rates, monthly progress, active streaks, and total check-ins. |
| **Habit Details** | Read the habit's notes, schedule, and recent history. Edit or delete the habit. |
| **Habit Form** | Create or edit a habit, choose repeat days, and set optional timing details. |

## Local Data and Offline Use

BloomDays includes five starter habits. It uses AsyncStorage to save habits, schedules, and check-ins on the device. An installed build can track habits offline.

## Run the Project

With Node.js 22.13.0 or later installed, open a terminal in the project folder and run:

```sh
npm ci
npm start
```

Connect your Android phone and computer to the same Wi-Fi network, then scan the terminal QR code with Expo Go.

Run `npm test` to check date handling, scheduling, streaks, search, and check-in logic.