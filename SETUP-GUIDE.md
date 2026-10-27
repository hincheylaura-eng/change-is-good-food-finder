# Putting your site online: step by step

This takes about 15 minutes. You don't need any developer tools. Everything happens in your web browser.

When you're done:
- Your files will live on **GitHub** (a safe online home for the folder).
- **Netlify** will turn those files into a public website.
- Any time `listings.csv` changes on GitHub, Netlify updates the website automatically, usually within a minute.

Netlify's and GitHub's buttons sometimes get renamed. If a button doesn't match exactly, look for one with similar words.

---

## Part 1: Put the folder on GitHub

**1. Create the repository (the online folder).**
1. Go to **https://github.com/new** (you're already signed in as hincheylaura-eng).
2. **Repository name:** `change-is-good-food-finder`
3. **Description** (optional): `Find free food and assistance. A free community project by Change is Good.`
4. Choose **Public**.
5. Leave every other box unchecked (no README, no .gitignore, no license). Your folder already has what it needs.
6. Click **Create repository**.

**2. Upload your files.**
1. On the next page, find the line "…or **uploading an existing file**" and click that link.
2. Open your `change-is-good-food-finder` folder in Finder (it's in Documents).
3. Select everything you see in the folder (press Command + A) and drag it all into the browser window where it says "Drag files here."
   That should include: `index.html`, `styles.css`, `app.js`, `listings.csv`, `zipcodes.csv`, `netlify.toml`, `logo.png`, the `images` folder, and the three `.md` guide files.
4. Wait until every file shows in the list. Make sure the `images` folder came through (you'll see files like `images/logo.jpg`).
5. At the bottom, in the first box, type: `First version of the site`
6. Click **Commit changes**.

You should now see all your files listed on the repository page.

---

## Part 2: Connect GitHub to Netlify

**3. Start a new Netlify site.**
1. Go to **https://app.netlify.com** and sign in.
2. Click **Add new project** (it may say **Add new site**), then **Import an existing project**.
3. Under "Import a Git repository," click **GitHub**.
4. A GitHub window may pop up asking to allow Netlify. If it asks which repositories Netlify can see, choose **Only select repositories**, pick `change-is-good-food-finder`, and click **Install** or **Save**.

**4. Pick your repository.**
1. Back on Netlify, click **change-is-good-food-finder** in the list.
   (Don't see it? Click "Configure the Netlify app on GitHub" at the bottom of the list and add the repository there.)

**5. Settings: leave them almost empty.**
1. **Branch to deploy:** `main`
2. **Build command:** leave **empty**.
3. **Publish directory:** leave empty or type a single period: `.`
4. Click **Deploy** (it may say "Deploy change-is-good-food-finder").

**6. Wait about a minute.** When it says **Published**, click the link Netlify shows (it will look like `random-words-12345.netlify.app`). That's your live site. Try a zip code like `80203`.

**6b. Make it public.** Netlify may start new projects as **Private**, which means visitors see a login page instead of your site. On the project's overview page, click **Make public**, keep "Public: Anyone on the internet," and click **Make public** again.

**6c. Turn off the Netlify badge (optional).** Go to **Project configuration** → **General** → **Powered by Netlify badge** → **Configure**, uncheck "Show the badge on this project," and click **Save**.

**7. Give it a nicer address (free).**
1. In Netlify, go to **Project configuration** (or **Site configuration**) → **Change project name** (or **Change site name**).
2. Type something like `changeisgood-foodfinder` and save.
3. Your site is now at `https://changeisgood-foodfinder.netlify.app`.
   (Later, if you buy your own domain, Netlify's **Domain management** page walks you through connecting it.)

---

## Part 3: How updates work from now on

- **You edit a listing:** open `listings.csv` on GitHub, click the pencil, make the change, click **Commit changes**. The site updates by itself in about a minute. See `LISTINGS-GUIDE.md` for the column rules.
- **The weekly assistant proposes changes:** you'll get a **pull request** on GitHub. Open it, click the **Files changed** tab to see exactly which lines changed (red = removed, green = added). If it looks right, click **Merge pull request**, then **Confirm merge**. The site updates within a minute. If something looks wrong, leave a comment or click **Close pull request**.
- **To check the update went live:** in Netlify, open **Deploys**. The newest one at the top should say **Published**.

## If something goes wrong

- **Site shows "We couldn't load the listings":** a line in `listings.csv` likely has a stray quote mark. Open the file on GitHub, click **History**, and compare the last change. You can always undo by editing the line back.
- **Netlify says "Deploy failed":** open the failed deploy and check the log. With this project there's no build step, so make sure the Build command box is empty (Project configuration → Build & deploy).
- **The logo or icon is missing:** make sure the `images` folder uploaded to GitHub.
