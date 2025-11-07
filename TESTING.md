# Foundation Form Testing Checklist

## Test Scenarios

### ✅ Basic Flow
- [ ] Navigate to `/intake`
- [ ] Step 1: Enter name, press Enter → advances to Step 2
- [ ] Step 2: Enter email, press Enter → advances to Step 3
- [ ] Step 3: Enter phone OR click Skip → advances to Step 4
- [ ] Step 4: Select website type → "Start Conversation" enabled
- [ ] Click "Start Conversation" → navigates to `/intake/conversation`

### ✅ Validation
- [ ] Step 1: Try to continue with empty name → shows error
- [ ] Step 2: Try to continue with invalid email → shows error
- [ ] Step 2: Try to continue with empty email → shows error
- [ ] Step 4: Try to continue without selecting type → button disabled

### ✅ Progressive Disclosure
- [ ] Only one question visible at a time
- [ ] Progress bar updates correctly (25%, 50%, 75%, 100%)
- [ ] Smooth animations between steps
- [ ] Previous answers persist when navigating back (if implemented)

### ✅ Website Type Selection
- [ ] All 5 options visible and selectable
- [ ] Selecting "Other" reveals text input
- [ ] Text input appears with animation
- [ ] Can type custom description in "Other" field

### ✅ Keyboard Navigation
- [ ] Enter key advances to next step
- [ ] Tab navigation works correctly
- [ ] Focus management (autoFocus on new step)

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
- [ ] Uses Perfect Fourth typography scale
- [ ] Spacing follows 8-point grid
- [ ] Colors use OKLCH values
- [ ] 70% whitespace principle maintained
- [ ] System fonts load correctly

## Known Issues
- None currently

## Test Results
_Record test results here_

