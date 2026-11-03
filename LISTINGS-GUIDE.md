# How to add or change a listing

All Denver metro listings live in **listings.csv**. The website reads this file every time someone opens the page, so you never need to touch the code. Change the file on GitHub, and Netlify republishes the site in about a minute.

## Editing on GitHub (easiest)

1. Go to your repository on github.com and click **listings.csv**.
2. Click the pencil icon (Edit this file).
3. Add a new line at the bottom, or change an existing line.
4. Click **Commit changes**, then **Commit changes** again.

You can also open listings.csv in Excel, Numbers, or Google Sheets. When saving, choose **CSV (comma-separated)**, and keep the first row (the column names) exactly as it is.

## The columns, in order

| Column | What goes in it | Example |
|---|---|---|
| ID | Short, permanent label. Lowercase, dashes, no spaces. Never change it once set. | `metro-caring` |
| Name | Name people will recognize | `Metro Caring Fresh Foods Market` |
| Type | Exactly one of: `Food pantry`, `Free meal`, `One-time event`, `Assistance program` | `Food pantry` |
| Address | Street address. Leave blank for phone-only help. | `1100 E 18th Ave` |
| City | City | `Denver` |
| Zip | 5-digit zip code | `80218` |
| Latitude | Optional. If blank, the middle of the zip code is used. | `39.7456` |
| Longitude | Optional. Same as above. Denver longitudes start with a minus sign. | `-104.9714` |
| Days | Short day names with spaces: `Mon Tue Wed Thu Fri Sat Sun`. Blank for one-time events, or if days are unknown. | `Mon Tue Fri` |
| Hours | Plain words | `9am-noon` |
| What to bring | Plain words, or blank | `Photo ID if you have one` |
| Phone | Any format | `303-860-7200` |
| Website | Full link starting with https:// | `https://metrocaring.org` |
| Notes | Anything else helpful | `Closed holidays.` |
| Event date | Only for one-time events: `YYYY-MM-DD`. The event disappears from the site after this date. | `2026-11-21` |
| Last verified | The date you confirmed the info: `YYYY-MM-DD`. After 30 days the site shows "Hours may have changed, please call first." If blank, the site says "Not confirmed yet." | `2026-10-27` |
| Source | The web page where you confirmed the info | `https://metrocaring.org` |
| Active | `Y` to show, `N` to hide. Use `N` instead of deleting a row. | `Y` |
| Distribution hours | When food is actually handed out, in the exact format below (not office hours). Powers "Open now" and "Look ahead." Leave blank if unknown: the site then says "Hours not listed, call ahead." | `Mon Wed 09:00-12:00; Sat 10:00-13:00` |
| Wheelchair accessible | `Yes`, `No`, or blank if unknown. The site shows "Unknown" when blank. | `Yes` |
| Service style | `Walk-in`, `Drive-through`, `Walk-in and drive-through`, or blank if unknown | `Drive-through` |

## The Distribution hours format

The site reads this column to work out "Open now" and "Look ahead," so it uses a strict format:

- **Times** use the 24-hour clock with a dash and no spaces: `09:00-12:00`, `13:00-15:30`, `18:00-19:30`.
- **Days** use short names: `Mon Tue Wed Thu Fri Sat Sun`. A range works too: `Mon-Fri`.
- **Several time slots** on the same days go one after another: `Mon 09:00-11:30 13:00-15:00`.
- **Different schedules** for different days are separated with a semicolon: `Mon Wed 09:00-12:00; Tue 16:00-19:00`.
- **Only some weeks of the month:** put `1st`, `2nd`, `3rd`, `4th`, `5th`, or `last` before the day: `1st 3rd Sat 09:00-12:00`. Example: "closed the first Thursday" is `2nd 3rd 4th 5th Thu 09:00-12:00`.
- **One-time events:** just the times, like `10:00-13:00`. The site uses the Event date.

The **Hours** column is still the friendly version people read on the card. Write it in plain words, like `Mon and Wed 9am-noon`. If Hours is blank, the site shows the Distribution hours instead.

Seasonal schedules (like "Jan-Oct: 1st, 2nd, and 4th Thursdays") can't be written in one line. Enter the schedule for the current season and update it when the season changes.

## Rules that keep the file working

- **Commas:** if a field has a comma in it, put double quotes around the whole field: `"Mon, Wed 9am-noon"`.
- **Quote marks inside a field:** write them twice: `"Ask for the ""Fresh Box"""`.
- One listing per line. Do not add or rename columns.
- To hide a place temporarily or permanently, set Active to `N` rather than deleting the line. That keeps the history easy to follow.
- Listings without an address or zip (like phone hotlines) appear in a "Help by phone" section for anyone searching in the Denver area.

## For the weekly update assistant

- Change only `listings.csv`. Do not edit any other file.
- Keep the header row and column order exactly as above.
- Never change an existing ID. New rows get a new, unique ID.
- One pull request per week. In the description, list each change in plain words: added, changed (which field, old value, new value), or set to Active `N`, with the Source link for each.
- Update `Last verified` and `Source` only when the information was actually confirmed on that page that day.
- If sources disagree, say so in Notes ("Schedules posted online do not agree. Please call to confirm.") instead of guessing.
- Use `Active` = `N` for places that appear closed, rather than deleting rows.
- Fill in `Distribution hours`, `Wheelchair accessible`, and `Service style` only from what the source actually says. Leave them blank rather than guessing.
- Check seasonal schedules (for example Bienvenidos Food Bank changes in January) and update `Distribution hours` when the season changes.
- New places people suggest through the website's form arrive in Netlify (Forms). Treat them as leads to verify, never as confirmed listings.
