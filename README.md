# BloomDays – Daily Habit Tracker

Name: K N T Kithulgoda  
Index Number: 2022/ICT/88 


## Project Description

BloomDays is a React Native mobile app built with Expo. It helps users plan daily habits, check off what they complete, and track their progress over time.

BloomDays measures progress using each habit’s repeat schedule. For example, if a habit repeats only on weekdays, Saturday and Sunday count as rest days for that habit. This lets users track habits that follow different routines.

## Features

- **Daily check-ins** — Today shows the habits scheduled for the current day under Morning, Afternoon, Evening, or Anytime. Users can mark a habit complete or undo a check-in. The daily progress bar updates after each change.
- **Flexible scheduling** — Users can choose a category, add a note, and select the weekdays when a habit repeats. They can also set an optional target time and duration, such as `17:30 · 15 min`. These details appear on Today and My Habits.
- **Search and filters** — My Habits lets users search by habit name, category, or note. They can also filter the weekly plan by weekday or category.
- **Check-in history** — Habit Details shows completed and missed check-ins from the last seven days. A day is marked as missed when it has passed, the habit was scheduled, and there is no completion. Rest days are skipped.
- **Weekly and monthly reports** — Progress shows weekly completion rates, active streaks, and total check-ins. The monthly calendar uses colors to distinguish complete, partial, missed, pending, unscheduled, and upcoming days.

## App Screens

| Screen | What users can do |
| --- | --- |
| **Today** | View today’s routine, check off habits, and undo check-ins. |
| **My Habits** | Browse the weekly plan, search and filter habits, and open a habit to edit it. |
| **Progress** | Review weekly completion rates, the monthly calendar, active streaks, and total check-ins. |
| **Habit Details** | View a habit’s repeat schedule, notes, and recent check-ins. Edit or delete the habit. |
| **Habit Form** | Add or edit a habit and choose its category, repeat days, and optional timing details. |

## Technologies Used

| Technology | Purpose |
| --- | --- |
| React Native | Builds the mobile interface. |
| Expo | Runs the project during development and supports testing on Android. |
| JavaScript, JSX, and React Hooks | Define the app logic, screen components, and state. |
| AsyncStorage | Saves habits, schedules, and check-ins on the device. |
| Git and GitHub | Tracks changes, manages branches, and supports pull requests. |

## Local Data and Offline Use

BloomDays includes five bundled starter habits. On first launch, the app copies them into local storage. When users add or edit a habit or record a check-in, the app saves those changes with AsyncStorage. The data is available when the app is reopened.

An installed build supports offline habit tracking. BloomDays uses no public APIs or online databases.

## Project Structure

| File or folder | Purpose |
| --- | --- |
| `App.js` | Starts the app, handles navigation, and coordinates habit updates. |
| `src/screens.jsx` | Defines the five app screens. |
| `src/ui.jsx` | Contains reusable UI components, colors, and shared styles. |
| `src/habits.jsx` | Contains the starter dataset and logic for dates, schedules, search, streaks, and progress counts. |
| `src/storage.jsx` | Saves and loads habit data using AsyncStorage. |
| `test/habits.test.mjs` | Tests habit scheduling, date handling, search, streaks, and check-ins. |
| `app.json` | Contains the Expo app configuration. |
| `package.json` | Lists dependencies and commands for running and testing the project. |
| `package-lock.json` | Records the dependency versions used by `npm ci`. |
| `.gitignore` | Keeps local files such as `node_modules` out of Git. |
| `README.md` | Documents the project and explains how to run it. |

## Setup Instructions

Install Node.js 22.13.0 or later and Git. Use a compatible version of Expo Go on an Android phone or use an Android emulator.

Open a terminal and run:

```sh
git clone https://github.com/Thushani945/BloomDays.git
cd BloomDays
npm ci
npx expo start
```

On an Android phone, connect your computer and phone to the same Wi-Fi network. Open Expo Go and scan the QR code shown in the terminal. If you already have an Android emulator running, press `a` in the Expo terminal.

## How to Use

1. Open **My Habits** and tap **+ New Habit**.
2. Enter a name, choose a category and repeat days, and save the habit. Add a target time and duration if needed.
3. Open **Today** and check off the habit when you finish it.
4. Tap the habit to review its recent check-ins in **Habit Details**.
5. Open **Progress** and switch between **Week** and **Month** to review your activity.

## Tests

Run the automated tests from the project folder:

```sh
npm test
```

The tests cover date handling, repeat schedules, streaks, search, and adding or undoing a check-in.
