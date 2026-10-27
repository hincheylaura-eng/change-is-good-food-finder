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
