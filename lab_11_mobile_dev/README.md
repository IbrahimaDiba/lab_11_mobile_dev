# Water Reminder App

A React Native mobile application that requests notification permissions and allows users to schedule water reminder notifications.

## Features

- 🔔 Request notification permissions on app launch
- ⏰ Schedule water reminder notifications for 3 minutes in the future
- 💧 Beautiful water-themed UI with gradient backgrounds
- ✨ Smooth animations and transitions
- 📱 Works on both iOS and Android
- 🎨 Premium, modern design

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Run on device/simulator:**
   - **iOS Simulator:** Press `i` in the terminal
   - **Android Emulator:** Press `a` in the terminal
   - **Physical Device:** Scan the QR code with Expo Go app

## How to Use

1. Launch the app
2. Grant notification permissions when prompted
3. Tap "Schedule Reminder" button
4. Wait 3 minutes to receive the water reminder notification
5. Tap the notification to open the app

## Requirements

- Node.js 14 or higher
- Expo CLI
- iOS Simulator (for iOS testing) or Android Emulator (for Android testing)
- Expo Go app (for testing on physical devices)

## Notification Permissions

- **iOS:** The app will request notification permissions on first launch
- **Android:** Permissions are automatically granted on Android 12 and below. On Android 13+, the app will request permission.

## Technologies Used

- React Native
- Expo
- expo-notifications
- expo-device

## License

MIT
