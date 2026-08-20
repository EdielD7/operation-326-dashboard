# Operation 326: Digital Transformation & Project Handover

---

## Project Overview

The Operation 326 Dashboard is a modern, interactive web platform that turns a
static list of unreached people groups into an experience the public can explore.

The delivered platform includes:

- **A searchable directory** of 281 people groups, filterable in real time by
  region, country, status and free-text search — results update instantly as the
  user types, with no page reloads or waiting.
- **An interactive world map** with nine regional markers that reveal live counts
  on hover or keyboard focus.
- **A regional carousel** where each card is clickable, filtering the directory
  and guiding the visitor straight to the relevant records.
- **Downloadable prayer cards** presented in a full-screen viewer, making the
  material immediately shareable by supporters.
- **A fully responsive layout** that adapts from wide desktop displays down to
  mobile devices.

Accessibility was treated as a requirement rather than an afterthought: every
interactive element is reachable and operable by keyboard, and all controls carry
descriptive labels for screen-reader users.

---

## Performance & Optimization

Page weight directly affects how many visitors stay long enough to engage. The
delivered build was optimised specifically for fast first impressions.

| Metric                | Before   | After    | Improvement |
| --------------------- | -------- | -------- | ----------- |
| Total image payload   | 5.9 MB   | 1.4 MB   | **-76%**    |
| Hero image            | 1.67 MB  | 319 KB   | **-81%**    |
| Compressed app bundle | —        | ~74 KB   | —           |

Key measures applied:

- **Photography converted to WebP**, a modern format delivering the same visual
  quality at a fraction of the file size.
- **Logos rebuilt as vector SVG**, so they stay perfectly sharp on any screen —
  including high-resolution and retina displays — while weighing only a few
  kilobytes.
- **Deferred loading** of off-screen imagery, so the visitor's connection is spent
  first on what is immediately visible.

The result is a site that loads close to instantly, performs well on mobile
networks, and reduces bandwidth costs.

---

## Future-Proof Architecture (React vs. Legacy Builders)

This platform was built on React — the same technology stack used by Netflix,
Airbnb and Meta — rather than on a visual page builder such as Webflow or
WordPress. That decision carries three concrete advantages for the organisation.

### 1. Total Ownership & Zero Lock-in

**The organisation owns 100% of this code, outright and permanently.**

There is no proprietary platform holding the site hostage. With builder
ecosystems, the site exists only inside that vendor's environment: monthly fees
scale with traffic and features, premium plugins carry their own recurring
licences, and exporting the site — when it is possible at all — typically yields
an unusable fragment.

Here, the entire source is delivered as standard, portable files. The site can be
moved between hosting providers, handed to any React developer worldwide, or
extended in-house at any time. There is no vendor whose pricing changes can
force the organisation's hand, and no annual subscription simply to keep the
site online.

### 2. Enterprise-Grade Security

**There is no attack surface to defend, because there is no server-side software.**

The overwhelming majority of website breaches in the builder ecosystem trace back
to two causes: outdated third-party plugins and exposed databases. A typical
WordPress install runs a dozen or more plugins from independent authors, each one
a potential vulnerability requiring constant patching.

This platform has neither. It compiles to **static files served over a global
CDN** — there is no database to breach, no login portal to brute-force, no plugin
ecosystem to keep patched, and no server-side code that an attacker can execute.
For an organisation handling sensitive field research about people groups in
restricted-access regions, this materially reduces risk. It also removes the
recurring maintenance burden of security updates.

### 3. Limitless Interactivity

**The experience delivered here is not achievable in a visual builder.**

The directory filters 281 records across four simultaneous criteria — search
term, region, country and status — and repaints results **instantly, without a
single page reload**. Clicking a region card filters the table and scrolls to it
in one motion. The map markers compute their counts from the same live dataset,
so every figure on the page always agrees.

In a visual builder, this class of interaction is constrained by what the tool's
interface exposes. Filtering large datasets usually means a page reload per
interaction, a paid third-party widget, or an accepted compromise in the
experience. React places no such ceiling: as the organisation's ambitions grow —
richer visualisations, saved searches, user accounts, multilingual content — the
architecture already supports them.

---

## Low-Code / No-Code Readiness

**The site can be kept up to date without programming knowledge.**

The platform was built on a clean separation between *design* (how the site
looks) and *data* (what the site says). Every people group record lives in a
single, decoupled data file — `peopleGroups.js` — structured as a simple JSON-style
list. Each entry contains plain, readable fields:

```
name · country · region · status · prayer card link
```

Adding a new people group means adding one line to that list. The rest of the
interface responds automatically: the directory grows, the region and country
filters gain the new values, the map counters increase, and the carousel
statistics recalculate. **No component, layout or styling needs to be touched.**

**Headless CMS Ready.** Because the data layer is fully decoupled from the
interface, the project is prepared to connect to a Low-Code content platform such
as **Airtable, Notion, Contentful or Sanity**. Once connected, the team edits
records in a familiar visual spreadsheet or form interface, and the React front
end updates itself from that source — no developer involvement required for
routine content changes.

This protects the organisation's investment: it retains ownership of its content
workflow, and day-to-day updates carry no engineering cost.

---

## Deployment

The project produces a **fully static build** — a self-contained set of files with
no database or application server to maintain. This means **Zero-Config
Deployment**:

- **Drag and drop:** the build folder can be dropped directly onto a hosting
  provider such as **Netlify** or **Vercel** and is live within seconds.
- **Git-connected:** alternatively, the repository can be linked so that every
  approved change is published automatically.
- **Low-cost, highly scalable hosting architecture,** with free tiers suitable for
  the initial launch phase, ensuring predictable scaling costs without expensive
  legacy server maintenance. Static files are served from a global content
  delivery network, absorb traffic spikes without provisioning work, and present a
  minimal security surface — there is no server-side software to patch.

As traffic grows, costs scale in clear, published increments tied to bandwidth
rather than to platform licences, seat counts or plugin subscriptions. HTTPS and
custom domains are included at every tier.

---

## Sign-off

Prepared and Developed by Ediel Jonathan, Front-end Web Developer.
