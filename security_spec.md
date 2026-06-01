# Security Specification - HyperVision

## 1. Data Invariants
- A user document must exist for any authenticated activity.
- Users can only create their own profile.
- Only the 'teacher' (specifically the platform owner) can write to courses and attendance.
- Attendance records must be linked to a valid student.
- All documents must have a `createdAt` timestamp set at creation.

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)

1. **Identity Spoofing (Create User):** Try to create a user document with a UID that doesn't match the auth UID.
   - `path: /users/other_uid`, `data: { uid: 'other_uid', role: 'student' ... }` -> `PERMISSION_DENIED`
2. **Privilege Escalation:** A student tries to create a user document with `role: 'teacher'`. (Wait, should we allow this? The UI lets them choose. But usually, we only trust certain emails).
   - Actually, the current `AuthScreen` lets anyone pick 'teacher'. I should probably restrict 'teacher' role creation to a whitelist if it's high-stakes.
3. **Ghost Field Injection:** Adding `isAdmin: true` to a user document.
   - `data: { uid: 'my_uid', role: 'student', isAdmin: true ... }` -> `PERMISSION_DENIED` (via `isValidUser` strict key check).
4. **Timestamp Manipulation:** Setting `createdAt` to a past or future date manually.
   - `data: { createdAt: timestamp_from_1990 ... }` -> `PERMISSION_DENIED`.
5. **ID Poisoning:** Using a 2KB string as a `courseId`.
   - `path: /courses/very_long_string...` -> `PERMISSION_DENIED`.
6. **Orphaned Attendance:** Student tries to create an attendance record for themselves (Only teachers should).
   - `path: /attendance/new_id`, `auth: student` -> `PERMISSION_DENIED`.
7. **Cross-User Data Leak:** Authenticated user tries to `get` another user's private data.
   - `path: /users/other_uid`, `auth: user_a` -> `PERMISSION_DENIED`.
8. **Malicious Course Update:** A student tries to edit a course module.
   - `path: /courses/module_1`, `auth: student` -> `PERMISSION_DENIED`.
9. **Resource Exhaustion:** Creating a user document with an extremely large `displayName` (e.g., 500KB).
   - `data: { displayName: 'A'.repeat(500000) ... }` -> `PERMISSION_DENIED`.
10. **State Shortcutting:** Updating `role` after creation.
    - `op: update`, `data: { role: 'teacher' }` -> `PERMISSION_DENIED` (immutable role).
11. **PII Blanket Read:** Non-teacher user tries to `list` all users.
    - `path: /users`, `op: list` -> `PERMISSION_DENIED`.
12. **Unverified Email Access:** (If we enforce email verification).
    - `auth: { email_verified: false }` -> `PERMISSION_DENIED`.

## 3. Test Runner (Draft)
I will implement these checks in the rules logic.
