# Uppsala Azure User Group – Website

Static website for the Uppsala Azure User Group, hosted on GitHub Pages.

## Site Structure

```
index.html          Homepage – hero, upcoming event, about section
events.html         Full event listing with filter (All / Upcoming / Past)
signup.html         Registration form (embedded Tally.so form)
css/style.css       All styling
js/main.js          Navigation, agenda toggles, event filters
images/             Images (hero background, etc.)
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

## Managing Content

### Adding a New Upcoming Event

1. Open `events.html`.
2. Inside the `<div class="event-grid">`, add a new event card **above** existing ones. Use this template:

```html
<div class="event-card" data-status="upcoming">
  <div class="event-card-header">
    <span class="badge badge-upcoming">Upcoming</span>
    <h3>Event Title</h3>
    <div class="event-meta">
      <span>📅 Month Day, Year</span>
      <span>🕕 18:00 – 20:30</span>
      <span>📍 Venue Name</span>
    </div>
  </div>
  <div class="event-card-body">
    <p>Short description of the event.</p>

    <h4 style="margin: 1rem 0 0.5rem;">Speakers</h4>
    <ul style="list-style: none; margin-bottom: 1rem;">
      <li><strong>Speaker Name</strong> – Title / Role · Session Topic</li>
    </ul>

    <button class="agenda-toggle"><span class="arrow">▶</span> View Agenda</button>
    <div class="agenda-content">
      <ul class="agenda">
        <li><span class="agenda-time">18:00</span> Doors open &amp; networking</li>
        <li><span class="agenda-time">18:15</span> Welcome</li>
        <li><span class="agenda-time">18:30</span> Speaker Name – Session Topic</li>
        <li><span class="agenda-time">19:15</span> Break</li>
        <li><span class="agenda-time">19:30</span> Speaker Name – Session Topic</li>
        <li><span class="agenda-time">20:15</span> Q&amp;A &amp; networking</li>
        <li><span class="agenda-time">20:30</span> Close</li>
      </ul>
    </div>
    <br />
    <a href="signup.html" class="btn btn-primary">Register Now</a>
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
2. Remove the "Register Now" button from the event card.
3. Optionally add a recap paragraph or link to slides/recording in the event card body.
4. Update the Tally form to remove the old event option (or create a new form per event).

### Updating the Homepage Upcoming Event

The homepage (`index.html`) shows **one** featured upcoming event. When you create a new event:

1. Replace the existing upcoming event card in `index.html` with the new one.
2. Move the old event to the "Past Events" section, or just keep it in `events.html`.

### Adding Speaker Information

Inside any event card body, add speakers using:

```html
<h4 style="margin: 1rem 0 0.5rem;">Speakers</h4>
<ul style="list-style: none; margin-bottom: 1rem;">
  <li><strong>Name</strong> – Role / Company · Session Topic</li>
  <li><strong>Name</strong> – Role / Company · Session Topic</li>
</ul>
```

## Registration / Sign-Up (Tally.so)

The sign-up form is hosted on [Tally.so](https://tally.so) and embedded in `signup.html` via an iframe.

### Setting up your Tally form

1. Go to [tally.so](https://tally.so) and create a free account.
2. Create a new form with the fields you need (e.g. Name, Email, Event, Message).
3. Publish the form and copy the **form ID** from the URL (e.g. `https://tally.so/r/abc123` → ID is `abc123`).
4. In `signup.html`, replace `YOUR_FORM_ID` in the iframe `data-tally-src` attribute with your actual form ID.

### Tally features

- All submissions are stored in the Tally dashboard (no emails needed).
- Export registrations to CSV at any time.
- Optionally enable email notifications in Tally's form settings.
- Connect to Google Sheets, Notion, or Slack via Tally integrations.

### Changing the registration email

The fallback contact email (`Register@UppsalaAzure.tech`) appears in:

- `signup.html` – below the embedded form
- `index.html` – the "Get in touch" link in the about section
- Footer on all three HTML files

## Hero Background Image

The hero section uses a background image overlaid with the Azure blue gradient. To change it:

1. Place your image in the `images/` folder (e.g. `images/hero-bg.jpg`).
2. The CSS reference is in `css/style.css` under the `.hero` rule. Update the path if the filename differs.

## Local Preview

No build tools are needed. Open `index.html` directly in a browser, or use any local server:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .
```

## Checklist for Each New Event

- [ ] Add event card to `events.html`
- [ ] Update featured event on `index.html`
- [ ] Update Tally form with the new event option (or create a new form)
- [ ] After the event: flip status to "past" in HTML
