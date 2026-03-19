# Uppsala Azure User Group (UAUG) – Website

Static website for the Uppsala Azure User Group, hosted on GitHub Pages.

## Site Structure

```
index.html              Homepage – hero, upcoming event, about section
events.html             Full event listing with filter (All / Upcoming / Past)
signup.html             Registration form (embedded Tally.so form)
submit-session.html     Speaker session submission (embedded Tally.so form)
css/style.css           All styling (including dark mode)
js/main.js              Navigation, agenda toggles, event filters, registration counter, theme toggle
images/                 Images (hero background, etc.)
```

## Hosting on GitHub Pages

1. Go to the repository **Settings → Pages**.
2. Under **Source**, select the `main` branch and `/` (root) folder.
3. Click **Save**. The site will be available at `https://<username>.github.io/UppsalaAzure/` (or your custom domain).

### Custom domain

To use a custom domain (e.g. `uppsalaazure.tech`):

1. In **Settings → Pages**, enter the domain under **Custom domain**.
2. Add a `CNAME` DNS record pointing to `<username>.github.io`.
3. GitHub will automatically create a `CNAME` file in the repo.

---

## Things That Need Manual Updates

### 1. Registration Counter

Each upcoming event has a registration counter showing how many spots are taken. **You need to update this manually** when you check the Tally dashboard.

In both `index.html` and `events.html`, find the counter element and change the `data-registered` value:

```html
<div class="reg-counter" data-registered="0" data-capacity="35">
```

Change `0` to the current number of registrations. The progress bar, "spots left" text, and color (blue → orange at 80% → red when full) all update automatically.

**Where to find the count:** Log in to [tally.so](https://tally.so) → open the sign-up form → check the submissions count.

### 2. Event Date, Time, Venue, and Agenda

These are hardcoded in the event cards in `index.html` and `events.html`. Update both files when details change. Key things to update:

- Date and time in the `event-meta` div
- Agenda times and session titles in the `agenda` list
- Speaker names and titles
- Venue name and address

### 3. Map Location

The embedded OpenStreetMap uses GPS coordinates. If the venue changes, update the `iframe` src and the "View larger map" link in both `index.html` and `events.html`. Replace the coordinates in the URL:

```
bbox=LEFT,BOTTOM,RIGHT,TOP  (bounding box around the marker)
marker=LAT,LON              (the pin location)
```

Current coordinates for Viedoc, Stationsgatan 23: **59.8562, 17.6525**

Tip: search the new address on [openstreetmap.org](https://www.openstreetmap.org), click "Share" → "HTML", and copy the embed URL.

### 4. Maximum Event Capacity

To change the max capacity (currently 35), update **both** of these in `index.html` and `events.html`:

```html
<div class="reg-counter" data-registered="0" data-capacity="35">
```
```html
<strong><span class="reg-count">0</span> / 35 registered</strong>
```

### 5. Tally Forms

Two Tally forms are embedded:

| Page | Form ID | Purpose |
|---|---|---|
| `signup.html` | `KY0NAX` | Event registration |
| `submit-session.html` | `QK0aqG` | Speaker session proposals |

To replace a form, update the `data-tally-src` URL in the iframe on the respective page.

### 6. Contact Email

The fallback email `Register@UppsalaAzure.tech` appears in:

- `signup.html` – below the embedded form
- `submit-session.html` – below the embedded form
- `index.html` – footer
- `events.html` – footer

### 7. Hero Background Image

The hero uses `images/luboshouska-uppsala-434006_1920.jpg`. To change it:

1. Place the new image in the `images/` folder.
2. Update the path in `css/style.css` — search for `url("../images/` (appears twice: once for light mode, once for dark mode).

---

## Managing Content

### Adding a New Upcoming Event

1. Open `events.html`.
2. Inside `<div class="event-grid">`, add a new event card **above** existing ones. Use this template:

```html
<div class="event-card" data-status="upcoming">
  <div class="event-card-header">
    <span class="badge badge-upcoming">Upcoming</span>
    <h3>Event Title</h3>
    <div class="event-meta">
      <span>📅 Month Day, Year</span>
      <span>🕕 17:30 – 20:00</span>
      <span>📍 Viedoc – Stationsgatan 23, Uppsala</span>
    </div>
  </div>
  <div class="event-card-body">
    <p>Short description of the event.</p>

    <h4 style="margin: 1rem 0 0.5rem;">Speakers</h4>
    <ul style="list-style: none; margin-bottom: 1rem;">
      <li><strong>Speaker Name</strong> – Title / Role</li>
    </ul>

    <button class="agenda-toggle"><span class="arrow">▶</span> View Agenda</button>
    <div class="agenda-content">
      <ul class="agenda">
        <li><span class="agenda-time">17:30</span> Opening &amp; pre-mingle with food &amp; beverages</li>
        <li><span class="agenda-time">18:00</span> Session: Speaker – Topic</li>
        <li><span class="agenda-time">18:45</span> Session: Speaker – Topic</li>
        <li><span class="agenda-time">19:30</span> Q&amp;A &amp; networking</li>
        <li><span class="agenda-time">20:00</span> Closing</li>
      </ul>
    </div>

    <!-- Registration counter -->
    <div class="reg-counter" data-registered="0" data-capacity="35">
      <div class="reg-counter-label">
        <strong><span class="reg-count">0</span> / 35 registered</strong>
        <span class="reg-spots">35 spots left</span>
      </div>
      <div class="reg-counter-bar">
        <div class="reg-counter-fill" style="width: 0%;"></div>
      </div>
    </div>

    <a href="signup.html" class="btn btn-primary">Register Now</a>

    <h4 style="margin: 1.5rem 0 0.5rem;">Location</h4>
    <p style="margin-bottom: 0.75rem;">Viedoc – Stationsgatan 23, 753 40 Uppsala</p>
    <!-- Update coordinates if venue changes -->
    <iframe
      src="https://www.openstreetmap.org/export/embed.html?bbox=17.6475%2C59.8537%2C17.6575%2C59.8587&amp;layer=mapnik&amp;marker=59.8562%2C17.6525"
      width="100%" height="300" frameborder="0"
      style="border: 1px solid var(--border); border-radius: var(--radius);"
      loading="lazy" title="Event location"
    ></iframe>
    <p style="font-size: 0.85rem; margin-top: 0.4rem;">
      <a href="https://www.openstreetmap.org/?mlat=59.8562&amp;mlon=17.6525#map=17/59.8562/17.6525" target="_blank" rel="noopener">View larger map</a>
    </p>
  </div>
</div>
```

3. Also update the **homepage** (`index.html`) – replace the current upcoming event card with the new one.

### Moving an Event to Past

When an event has taken place:

1. In `events.html` (and `index.html` if shown there), change:
   - `data-status="upcoming"` → `data-status="past"`
   - `badge-upcoming` → `badge-past`
   - Badge text from `Upcoming` → `Past`
2. Remove the "Register Now" button and the registration counter.
3. Optionally add a recap paragraph or link to slides/recording in the event card body.
4. Update the Tally form to remove the old event option (or create a new form per event).

---

## Registration / Sign-Up (Tally.so)

The sign-up form is hosted on [Tally.so](https://tally.so) and embedded in `signup.html` via an iframe.

### Tally features

- All submissions are stored in the Tally dashboard (no emails needed).
- Export registrations to CSV at any time.
- Optionally enable email notifications in Tally's form settings.
- Connect to Google Sheets, Notion, or Slack via Tally integrations.

---

## Dark Mode

The site supports dark mode in two ways:

- **Automatic** – follows the visitor's OS/browser setting via `prefers-color-scheme`
- **Manual** – sun/moon toggle button in the navigation bar, persisted across pages via `localStorage`

No action needed from you — this works automatically.

---

## Local Preview

No build tools are needed. Open `index.html` directly in a browser, or use any local server:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .
```

---

## Checklist for Each New Event

- [ ] Add event card to `events.html` (with counter, map, agenda)
- [ ] Update featured event on `index.html`
- [ ] Update Tally sign-up form with the new event option
- [ ] Update `data-registered` on both pages as registrations come in
- [ ] After the event: flip status to "past", remove counter and register button
