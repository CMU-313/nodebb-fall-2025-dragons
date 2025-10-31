## User Guide

### Overview
This guide focuses on where you see the new features in the UI:
- Answered / Unanswered status on posts
- Pin posts (admin only)
- Public vs. Private posts (with a lock icon)
- Filter for Unanswered posts


---

## Where to see each feature in the UI

### 1) Mark posts “Answered” / “Unanswered”
- Post page: Each reply can be marked as the accepted answer by eligible users (topic owner, the reply’s author, or admins/mods). When marked, the post shows as Answered in the post area so readers can quickly identify the accepted solution.


Who can toggle it: topic owner, post owner, or admins/moderators.

### 2) Pin posts (admin only)
- Post actions menu: Open the post’s “more” menu (three dots) on a reply. Admins will see “Pin” or “Unpin”.
- In-thread appearance: Pinned posts may be visually denoted (e.g., a pin icon) and/or prioritized in position depending on your theme. If your theme doesn’t surface a pin icon by default, it still respects the `pinned` flag for custom indicators.

Who can toggle it: administrators only.

### 3) Public vs. Private posts
- Post header: Private posts show a lock icon next to the post index/time. This is visible to anyone viewing the thread so it’s clear the post is private.


- Post actions menu: Only the post owner and administrators will see the control to change a post’s privacy (Public ↔ Private).

Who sees what:
- Public posts: display to everyone who can view the topic.
- Private posts: display to course administrators and the post creator.
- Only the post owner and admins see the privacy toggle.

### 4) Filter by Unanswered posts
- Topic toolbar: Use the Unanswered filter/toggle (if your theme surfaces it) to hide posts that have already been marked as Answered, letting you focus on questions still needing attention.
- If your theme doesn’t show an Unanswered toggle, the post data still includes `answered: true|false`, so a theme or small customization can add an “Unanswered” pill to filter client‑side.


## Quick manual checks (UI-first)
- Answered/Unanswered: Mark a reply as Answered, confirm the post shows the Answered state in the thread. Unmark it and confirm it returns to Unanswered.
- Pin/Unpin: As an admin, use the post menu to pin a reply and observe any pin indicator or position change. Unpin to restore normal state.
- Public/Private: Toggle a post to Private and look for the lock icon in the post header; view as a non-owner user to confirm visibility rules.
- Unanswered filter: Enable the Unanswered filter (if present) and confirm answered replies are hidden.

---

## Where are the automated tests
- `test/posts/answered.js`: lifecycle and permissions for Answered/Unanswered.
- `test/posts.js`: includes pin/unpin and public/private scenarios.
- `test/api.js`: validates documented routes and schema consistency across the app.