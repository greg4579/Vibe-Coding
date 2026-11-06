# Browser review checklist

Run `npm start`, then open http://127.0.0.1:8090 in a current browser.

- Check widths of 320, 480, 736, and 1024 pixels: no horizontal overflow, clipped labels, or overlapping controls.
- Use only Tab, Shift+Tab, Enter, and Space to reach chapter selection, lessons, exercise choices, footer links, and quiz retries. Confirm a visible focus indicator.
- Open every chapter and all three lesson tabs. Confirm Previous/Next and Start practice work.
- In chapter 1, switch between chest and limb diagrams and select all ten electrode controls. Confirm each label highlights the matching position and updates its landmark.
- In chapter 2, confirm the highlighted pairs/trio change between lessons and that text remains legible on mobile.
- In chapter 3, select all six lead directions; compare Toward, Away, and Perpendicular in lesson 2.
- In chapter 4, select all four groups on the report grid and confirm the highlighted lead names match the chosen group.
- In every matching exercise, make a wrong match, correct it, finish the exercise, and restart it.
- In every quiz, complete one round with some mistakes, retry, then complete another round. Confirm the new round does not retain the previous score or missed-question list.
- Switch sections and chapters mid-exercise and mid-question. Confirm the current page session preserves your position.
- Verify reference links open in a separate tab and the app stays usable.
- Reload the page and confirm a new session opens chapter 2.
- With a screen reader, confirm labels, selected states, and live feedback are understandable.

On GitHub Pages, also confirm all relative CSS/module paths load from a repository subpath. These browser/deployment checks are separate from the in-memory automated tests.
