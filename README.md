# BloomDays 

BloomDays – Daily Habit Tracker is a React Native app for building small daily routines. It combines a daily check-in dashboard, flexible weekday schedules, and a weekly consistency report. Five original starter habits are included.

## Run the project

1. Install Node.js 22 LTS (22.13.0 or later) and unzip the project.
2. In the BloomDays folder, run:

   ```sh
   npm ci
   npm start
   ```

3. Open the project with [Expo Go for SDK 58](https://expo.dev/go?device=true&platform=android&sdkVersion=58) on Android. Connect the computer and phone to the same Wi-Fi for development, then scan the terminal QR code. With an Android emulator configured, you can press **a** in the Expo terminal instead.

If Expo Go asks you to sign in, use the same Expo account on your phone and in the terminal (`npx expo login`), then scan again.

Metro serves the JavaScript bundle during development. For an installed Android build that opens without Metro, install Android Studio and configure the Android SDK and JDK, then run `npx expo run:android --variant release` with a device or emulator connected. Build tools may need internet on the first build. The installed app stores its data on the device and has no account, server, public API, or remote database.

## Five screens

| Screen | What you can do |
| --- | --- |
| Today | Check off scheduled habits and review pending and completed groups |
| My Habits | Plan your weekly workload, filter routines by weekday or category, search, and edit directly |
| Progress | Browse seven-day reports with completion rates, total check-ins, and active streaks |
| Habit details | Read notes, see recent check-ins, and edit or delete the habit |
| Habit form | Create or edit a habit, select its category, and choose repeat days |

## How the code works

- `App.js` handles navigation and coordinates data changes.
- `src/screens.js` defines the five screens.
- `src/ui.js` contains shared UI and colors.
- `src/habits.js` contains the original dataset and tracking logic.
- `src/storage.js` saves and loads habits with AsyncStorage. Each habit has an ID, a name, a category, a note, and a list of local calendar dates when it was completed. Starter habits are copied into storage on first launch.

New habits record their creation date and schedule changes record their effective date. Habits saved by earlier versions default to a daily schedule and keep their existing check-ins. A streak counts consecutive scheduled check-ins, skipping rest days and allowing today to remain pending. Weekly consistency divides completed check-ins by scheduled check-ins for the selected seven-day period. Deleting a habit also removes its check-ins from Progress.

## Checks and demonstration

Run `npm test` for calendar, streak, search, and completion checks. Run `npm run check:android` to bundle the Android JavaScript.

On a device, add a habit, mark it complete, and check that it appears in Today’s Completed group and on Progress. Edit it, close the app, and reopen it to confirm the name and check-in were saved. For the offline demonstration, install the release build, turn on airplane mode, reopen the app, and repeat a check-in.

## GitHub submission

Confirm the title is available in your class. Since the ICA requires independent development, use this project as a starting point and make your own dataset and implementation changes before submitting. Keep your own commits as you develop and test those changes.

The ZIP includes the local Git history. Create an empty repository in your own GitHub account and push from the extracted BloomDays folder:

```sh
git remote add origin https://github.com/YOUR-USERNAME/bloomdays.git
git push -u origin main
```

Submission deadline provided in the brief: **15 November 2026**.
