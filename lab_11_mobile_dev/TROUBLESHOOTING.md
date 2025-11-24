# Troubleshooting - Water Reminder App

## "EMFILE: too many open files" Error

### Problem
When running `npm start`, you see:
```
Error: EMFILE: too many open files, watch
```

### Cause
This is a macOS limitation on the number of file watchers. Metro bundler (React Native's development server) needs to watch many files, and you may have other projects running that are also using file watchers.

### Solutions

#### Solution 1: Stop Other Expo/Metro Servers (Recommended)
The easiest solution is to stop other running Expo or Metro bundler instances:

1. Check for other running projects (you have `lab_10_mobile_dev` running on port 8081)
2. Go to that terminal and press `Ctrl+C` to stop it
3. Come back to this project and run `npm start` again

#### Solution 2: Use Tunnel Mode
Instead of the default connection, use tunnel mode which is more reliable:

```bash
npx expo start --tunnel
```

This will create a tunnel connection that doesn't require as many file watchers.

#### Solution 3: Increase File Descriptor Limit
Temporarily increase the limit for your current terminal session:

```bash
ulimit -n 65536
npm start
```

Note: This only works for the current terminal session.

#### Solution 4: Use Expo Go with Tunnel
If the server keeps crashing, you can still test the app:

1. Install Expo Go on your phone (iOS or Android)
2. Run: `npx expo start --tunnel --port 8082`
3. Scan the QR code with your phone
4. The app will load even if the server crashes after displaying the QR code

## SDK Version Mismatch

### Problem
Error about SDK 54 vs SDK 51

### Solution
This project uses Expo SDK 51 (same as your other project). If you see version warnings:

1. Clean install:
   ```bash
   rm -rf node_modules .expo
   npm install
   ```

2. The warning about `react-native@0.74.0` vs `0.74.5` is minor and won't affect functionality

## Testing the App

Once the server is running:

1. **On Physical Device (Recommended)**:
   - Install Expo Go from App Store/Play Store
   - Scan the QR code
   - Grant notification permissions when prompted
   - Test the water reminder feature

2. **On iOS Simulator**:
   - Press `i` in the terminal
   - Note: May not work if xcrun simctl has issues

3. **On Android Emulator**:
   - Press `a` in the terminal

## Quick Start Commands

```bash
# Start with specific port
npm start

# Or use tunnel mode (more stable)
npx expo start --tunnel

# Clear cache and restart
rm -rf .expo
npm start
```

## Need Help?

If you continue to have issues:
1. Close all other terminal windows running Expo/Metro
2. Restart your terminal
3. Try tunnel mode: `npx expo start --tunnel`
