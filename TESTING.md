# Foundation Form Testing Checklist

## Test Scenarios

### ✅ Basic Flow
- [x] Navigate to `/intake`
- [x] Step 1: Enter name, press Enter → advances to Step 2
- [x] Step 2: Enter email, press Enter → advances to Step 3
- [x] Step 3: Enter phone OR click Skip → advances to Step 4
- [x] Step 4: Select website type → "Start Conversation" enabled
- [x] Click "Start Conversation" → navigates to `/intake/conversation`

### ✅ Validation
- [x] Step 1: Try to continue with empty name → shows error
- [x] Step 2: Try to continue with invalid email → shows error
- [x] Step 2: Try to continue with empty email → shows error
- [x] Step 4: Try to continue without selecting type → button disabled

### ✅ Progressive Disclosure
- [x] Only one question visible at a time
- [x] Progress bar updates correctly (25%, 50%, 75%, 100%)
- [x] Smooth animations between steps
- [x] Previous answers persist when navigating back (if implemented)

### ✅ Website Type Selection
- [x] All 5 options visible and selectable
- [x] Selecting "Other" reveals text input
- [x] Text input appears with animation
- [x] Can type custom description in "Other" field

### ✅ Keyboard Navigation
- [x] Enter key advances to next step
- [x] Tab navigation works correctly
- [x] Focus management (autoFocus on new step)

### ✅ Mobile Responsiveness
- [ ] Form displays correctly on mobile (320px width)
- [ ] Radio buttons are touch-friendly
- [ ] Text inputs are properly sized
- [ ] Progress bar visible and readable

### ✅ State Management
- [ ] Data persists in Zustand store
- [ ] Navigation to conversation page works
- [ ] Conversation page shows user name if data exists
- [ ] Redirects to `/intake` if no foundation data

### ✅ Design System Compliance
- [x] Uses Perfect Fourth typography scale
- [x] Spacing follows 8-point grid
- [x] Colors use OKLCH values
- [x] 70% whitespace principle maintained
- [x] System fonts load correctly

## Known Issues
- None currently

## Test Results
_Record test results here_

