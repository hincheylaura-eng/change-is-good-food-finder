# Change is Good Food Finder

*from the mud, into the light.*

Find free food and assistance. Detailed listings for the Denver metro area, and links to free national services for everywhere else in the US.

A free community project by Change is Good.

## What's in this folder

| File | What it does |
|---|---|
| `index.html` | The page itself |
| `styles.css` | Colors, sizes, layout |
| `app.js` | Zip code search, distance, filters, English/Español |
| `listings.csv` | **All Denver metro listings. The only file you need to edit.** See `LISTINGS-GUIDE.md`. |
| `zipcodes.csv` | Map points for every Colorado zip code, from the US Census Bureau 2024 ZCTA Gazetteer. Zip codes outside Colorado get the national options. |
| `images/` | `lotus.png` (header logo: the lotus cut from `logo.png`), plus the browser tab and home-screen icons |
| `logo.png` | Original logo (not loaded by the site; kept as the master copy) |
| `netlify.toml` | Tells Netlify there's no build step |
| `SETUP-GUIDE.md` | How to put the site online with GitHub and Netlify |

No frameworks, no build step, no database, no tracking, no cookies, no API keys.

## Trying it on your own computer

Opening `index.html` by double-clicking won't load the listings (browsers block that for safety). On a Mac, open Terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000
