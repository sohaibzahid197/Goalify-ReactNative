# Step Counter Testing Checklist

## Pre-Testing Requirements
- [ ] Device is connected via USB or emulator is running
- [ ] Device has step counter sensor (most phones 2015+)
- [ ] Android version is 5.0+ (API 24+)
- [ ] For Android 10+ (API 29+), permission will be requested

## Installation Test
- [ ] App uninstalled successfully
- [ ] Build completed without errors
- [ ] App installed successfully
- [ ] App launches without crashes

## Step Counter Functionality Tests

### 1. Permission Test
- [ ] On Android 10+, permission dialog appears when starting step counter
- [ ] Permission can be granted
- [ ] Permission can be denied (should show error message)
- [ ] App handles permission denial gracefully

### 2. Step Counter Availability
- [ ] Step counter card appears on HomeScreen
- [ ] If sensor unavailable, shows "not available" message
- [ ] If sensor available, shows step counter UI

### 3. Start/Stop Functionality
- [ ] "Start Tracking" button is visible
- [ ] Clicking "Start Tracking" requests permission (if needed)
- [ ] After permission granted, step counter starts
- [ ] Status indicator shows "Tracking steps..."
- [ ] "Stop" button appears when active
- [ ] Clicking "Stop" stops the step counter
- [ ] Status indicator disappears when stopped

### 4. Step Counting
- [ ] Step count displays correctly (starts at 0 or current count)
- [ ] Step count updates in real-time when walking
- [ ] Step count increments correctly
- [ ] Step count is formatted with commas (e.g., 1,234)

### 5. Reset Functionality
- [ ] "Reset" button appears when step counter is active
- [ ] Clicking "Reset" shows confirmation dialog
- [ ] Confirming reset sets step count to 0
- [ ] Canceling reset does not change step count

### 6. Error Handling
- [ ] If sensor unavailable, shows appropriate message
- [ ] If permission denied, shows error message
- [ ] Errors are displayed in user-friendly format
- [ ] App doesn't crash on errors

### 7. UI/UX Tests
- [ ] Step counter card matches app theme (light/dark)
- [ ] Icons display correctly
- [ ] Text is readable
- [ ] Buttons are properly sized and clickable
- [ ] Loading indicators show when appropriate
- [ ] Card layout is responsive

### 8. Integration Tests
- [ ] Step counter appears on HomeScreen
- [ ] Step counter doesn't interfere with other features
- [ ] Navigation works correctly
- [ ] Theme switching works with step counter visible

## Real Device Testing (Recommended)
- [ ] Test on physical Android device
- [ ] Walk around and verify step count increases
- [ ] Test with app in background (steps should continue)
- [ ] Test after app restart (baseline resets, which is expected)

## Edge Cases
- [ ] App handles rapid start/stop clicks
- [ ] App handles multiple permission requests
- [ ] App handles sensor disconnection gracefully
- [ ] App handles low battery scenarios

## Performance Tests
- [ ] Step counter doesn't drain battery excessively
- [ ] App remains responsive while tracking steps
- [ ] No memory leaks after multiple start/stop cycles

## Notes
- Step counter sensor is cumulative (counts since last boot)
- Baseline is set on first start to calculate daily steps
- Baseline resets on app restart (this is expected behavior)
- For persistent daily tracking, consider storing baseline in AsyncStorage

## Known Limitations
- Emulators typically don't have step sensors
- Step counter requires physical device for accurate testing
- Permission is required on Android 10+ (API 29+)
