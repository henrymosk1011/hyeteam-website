# HyeTeam

Website for **HyeTeam**, a virtual assistant staffing agency that connects businesses around the world with highly skilled Virtual Assistants from Armenia.

Designed by [TENELEVENMEDIA](https://www.tenelevenmedia.com).

## Overview

A fast, static website with no build step. Every page is plain HTML, one shared stylesheet, and one shared script.

* Smooth scrolling with [Lenis](https://github.com/darkroomengineering/lenis)
* Scroll animations, horizontal scrolling sections and page transitions with [GSAP](https://gsap.com) and ScrollTrigger
* Respects "reduce motion" settings and works with JavaScript turned off
* Built to WCAG 2.2 Level AA (see [Accessibility](#accessibility))
* Search ready: titles, descriptions, structured data, sitemap (see [Search engines and analytics](#search-engines-and-analytics))
* Responsive from small phones to large desktop screens

## Pages

| Page | Path |
| --- | --- |
| Home | `/` |
| About | `/about/` |
| Hire a Virtual Assistant | `/hire/` |
| Become a Virtual Assistant | `/apply/` |
| Contact | `/contact/` |
| Blog | `/blog/` |
| Blog articles | `/blog/legal/`, `/blog/healthcare/`, `/blog/efficiency/` |
| Privacy Policy | `/privacy/` |
| Terms and Conditions | `/terms/` |
| Accessibility Statement | `/accessibility/` |
| Not found | `/404.html` |

The previous site's addresses (`/about-us`, `/hire-a-virtual-assistant`, `/become-a-virtual-assistant`, `/privacy-policy`, `/terms-and-conditions`) redirect to the new pages so existing links and search results keep working.

## Project structure

```
index.html              Home
about/ hire/ apply/     Inner pages (each has an index.html)
contact/
blog/                   Blog index and articles
privacy/ terms/         Privacy Policy and Terms and Conditions
accessibility/          Accessibility Statement
404.html                Not found page
assets/css/main.css     All styles (colors and type at the top)
assets/js/config.js     Site settings: form email and Google Analytics ID
assets/js/main.js       All interactions and animations
assets/vendor/          GSAP 3.15.0, ScrollTrigger, Lenis 1.3.26
assets/img/            Logo files, favicons and the social share image
assets/img/team/       Team photos, resized and cropped for each layout
sitemap.xml, robots.txt Search engine files
```

## Preview locally

From the project folder run either of these, then open the address it prints:

```
python3 -m http.server 8080
npx serve .
```

## Deploy

The site works on any static host.

* **GitHub Pages:** Settings, then Pages, then deploy from the `main` branch and the root folder. Add `www.hyeteam.com` as the custom domain.
* **Netlify or Vercel:** import the repository. No build command is needed and the publish folder is the project root.

## Common edits

**Logo.** The official HyeTeam logo was rebuilt as crisp vectors: the circular monogram from exact measurements and the wordmark from Poppins Bold, its original typeface. Standalone files live in `assets/img/` (`hyeteam-logo.svg`, `hyeteam-icon.svg`). On the pages, the logo is defined once per page in a hidden `<svg class="sprite">` at the top of the body and reused in the header, the intro animation and the footer, so it can change color with each section (logo blue on dark sections, near black on light and blue sections).

**Colors and fonts.** Edit the tokens at the top of `assets/css/main.css`:

* `--brand` `#02adff` (HyeTeam blue: buttons, accents and the blue sections)
* `--brand-soft` `#89cff0` (logo blue)
* `--brand-deep` `#0088cf` and `--brand-ink` `#0070ad` (the same blue, deepened so accent text stays readable on light backgrounds)
* `--ink` `#0a0e12` (near black) and `--paper` `#f2f6f9` (cool off white)
* Fonts: Inter Tight and Instrument Serif from Google Fonts (the logo itself is a vector, so it needs no font)

**Contact details.** Email, phone and address appear in the header menu, footer, contact page and privacy policy of every page. Search the project for `info@hyeteam.com` and `972.483.0260` to update them.

**Forms.** See [Contact form email](#contact-form-email). The receiving address is `formEmail` in `assets/js/config.js`.

**Strategy Call link.** "Schedule a Strategy Call" buttons go to the contact form with "A free Strategy Call" preselected. To send people to a booking page such as Calendly, replace `contact/?topic=strategy#form` in those buttons with the booking link.

**Social links.** The footer's "Social" column links to Instagram (`instagram.com/hyeteam`) and Facebook (`facebook.com/hyeteam`).

**Copyright year.** The footer year updates itself from the visitor's clock, so it shows 2027 starting January 1, 2027 with no edits needed.

**Writing style.** The site copy intentionally uses no dashes or hyphens. Keep that in mind when adding text (for example "full time", "back office", "US based").

## Contact form email

The contact form and the Virtual Assistant application send every submission straight to `info@hyeteam.com` through [FormSubmit](https://formsubmit.co), a free form to email service. Nothing to install and no account needed. Visitors stay on the page and see a thank you message. Each email arrives as a neat table with the visitor's details, and pressing Reply answers the visitor directly.

**One time activation (do this once the site is live):**

1. Open the live Contact page and send yourself a test message.
2. FormSubmit sends an activation email to `info@hyeteam.com` (it comes from FormSubmit and contains an **Activate Form** button). Check the spam folder if it is not in the inbox.
3. Click **Activate Form** in that email.
4. Send one more test message. It should arrive within a minute or two.

Until the form is activated, visitors who submit see a note offering to send the same message from their own email app, so nothing is lost. If the site later moves to a different web address, FormSubmit may ask you to activate again.

**To change the receiving address,** edit `formEmail` in `assets/js/config.js`. The new address needs the same one time activation.

**Spam:** both forms include a hidden trap field that bots fill in and people never see, so most spam is dropped before it is sent.

**Analytics:** when Google Analytics is turned on, each successful form submission is recorded as a `generate_lead` event.

## Accessibility

The site is built and tested to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA, the standard commonly used for the Americans with Disabilities Act (ADA). The public [Accessibility Statement](https://www.hyeteam.com/accessibility/) explains this to visitors and tells them how to ask for help.

What is in place:

* Every page works with a keyboard alone: skip link, visible focus ring, logical tab order, and the mobile menu keeps focus inside while it is open (Escape closes it). Cards inside the sideways scrolling sections scroll into view when they receive keyboard focus.
* Color contrast meets AA everywhere, including text over photos and on the blue sections.
* Every image has a text alternative, and decorative images are hidden from screen readers.
* Animated headlines are read as one sentence by screen readers, not word by word.
* Forms have visible labels, required fields marked with an asterisk, and clear error messages under each field that screen readers announce.
* Scrolling text bands have a pause button (the choice is remembered), the hero badge only turns while you scroll, and all motion is off for visitors who choose reduced motion in their device settings.
* Pages reflow at 320 pixels wide (400 percent zoom) and hold up when text spacing is increased.

How it was tested: automated checks with axe and Google Lighthouse on every page (desktop and mobile, with and without animation), a keyboard pass through every page, plus checks for reflow, text spacing, color contrast over images, and screen reader names.

Keep it accessible when editing:

* Give every new image a short, meaningful `alt` text, or `alt=""` if it is purely decorative.
* Keep headings in order (one `h1` per page, then `h2`, then `h3`).
* Check contrast for any new colors at [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/).
* Do not remove the marquee pause button or the focus styles.
* After changes, run Lighthouse in Chrome (DevTools, Lighthouse tab) and aim for 100 in Accessibility.

No automated test can promise legal compliance. For extra assurance, a manual review with a screen reader (VoiceOver on Mac or iPhone, NVDA on Windows) is a good yearly habit, and update the date on the Accessibility Statement when you do.

## Search engines and analytics

Already built in: a unique title and description on every page, canonical links, Open Graph and social sharing tags, structured data for Google (Organization, WebSite, Service, BlogPosting, and breadcrumbs), `sitemap.xml`, `robots.txt`, descriptive image text, fast loading images, and redirects from the old site's addresses. Every public page scores 100 for SEO, Accessibility, and Best Practices in Google Lighthouse (the 404 page is intentionally hidden from search).

### 1. Put the site on www.hyeteam.com

1. In GitHub, open the repository, then **Settings**, then **Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
2. In the same screen, enter `www.hyeteam.com` under **Custom domain** and save.
3. At your domain registrar (where hyeteam.com is managed), set these DNS records:
   * `CNAME` record: host `www`, value `henrymosk1011.github.io`
   * `A` records for the bare domain (host `@`): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
4. Wait for DNS to update (minutes to a few hours), then tick **Enforce HTTPS** on the GitHub Pages screen.

### 2. Google Search Console (how Google finds and ranks the site)

1. Go to [search.google.com/search-console](https://search.google.com/search-console) and sign in with the Google account that should own the site.
2. Click **Add property** and choose **Domain**. Enter `hyeteam.com`.
3. Google shows a `TXT` record. Add it at your domain registrar as a new DNS record (host `@`), then click **Verify**. It can take a little while for DNS to update; try Verify again if needed.
4. In the left menu, open **Sitemaps**, enter `https://www.hyeteam.com/sitemap.xml`, and click **Submit**.
5. Open **URL inspection**, enter `https://www.hyeteam.com/`, and click **Request indexing**. Repeat for the Hire and About pages.
6. Check back in a few days: **Pages** shows what is indexed, and **Performance** shows searches, clicks, and ranking positions.

### 3. Google Analytics 4 (visitor numbers)

1. Go to [analytics.google.com](https://analytics.google.com) and click **Start measuring** (or **Admin**, then **Create**, then **Property**).
2. Name the property `HyeTeam`, pick your time zone and currency, and continue through the business questions.
3. Choose **Web** as the platform, enter `https://www.hyeteam.com`, name the stream `HyeTeam website`, and create it.
4. Copy the **Measurement ID**. It looks like `G-AB12CD34EF`.
5. In GitHub, open `assets/js/config.js`, click the pencil icon to edit, and paste the ID between the quotes: `gaMeasurementId: 'G-AB12CD34EF'`. Commit the change to `main`.
6. Visit the live site, then check **Reports**, then **Realtime** in Analytics. Your visit should appear within a minute.
7. After the first form submission, open **Admin**, then **Events**, and mark `generate_lead` as a **key event** so contact requests show up as conversions.
8. Optional: in **Admin**, then **Product links**, then **Search Console links**, link the Search Console property to see search data inside Analytics.

If you plan to market to visitors in the European Union or the United Kingdom, add a cookie consent banner before turning Analytics on.

### 4. Bing and other search engines

Go to [bing.com/webmasters](https://www.bing.com/webmasters), sign in, and choose **Import from Google Search Console**. Yahoo and DuckDuckGo draw on Bing's results, so this covers them too.

### 5. Google Business Profile (optional)

A free profile at [business.google.com](https://business.google.com) can show HyeTeam on Google Maps and in local results. Google only allows an address that is staffed during business hours; if the Dallas address is a mailbox, set the profile up as a service area business and hide the address.

### 6. Health checks

* [PageSpeed Insights](https://pagespeed.web.dev): speed and Core Web Vitals for the live site.
* [Rich Results Test](https://search.google.com/test/rich-results): confirms Google can read the structured data.
* When you add a blog post or page, add it to `sitemap.xml` so Google finds it quickly.

## Images

Photos are high resolution images from [Unsplash](https://unsplash.com/license), loaded from Unsplash's image CDN at the right size for each screen. Real photos of the HyeTeam assistants and office are a great upgrade whenever they are available: swap the `images.unsplash.com` links for your own files.

Do not use Unsplash photo `1783094268362-c49d7f290c82` (woman in blue scrubs with a tattoo) anywhere on the site.

| Use | Photo |
| --- | --- |
| Home hero | [Aleksei Zhivilov](https://unsplash.com/photos/5I263mnTkPc) |
| Yerevan and Ararat | [Ash Shvoyan](https://unsplash.com/photos/JJx2ReM1VFI) |
| Ararat at sunset | [Alexander Gluschenko](https://unsplash.com/photos/PEcaJoGe_Xs) |
| Ararat over the city | [Alexander Gluschenko](https://unsplash.com/photos/aArejlMN4ds) |
| Yerevan at dusk | [Aleksei Agafonov](https://unsplash.com/photos/faCnugnJwpE) |
| The Cascade | [Hrag Kosbekian](https://unsplash.com/photos/al_KyWWoyUI) |
| Cascade sculptures | [Tigran Shishmanyan](https://unsplash.com/photos/R1qepPVFzx0) |
| Desk with glasses | [Irfan Syahmi](https://unsplash.com/photos/QQeIkbnwAbA) |
| Weekly planner | [Renáta-Adrienn](https://unsplash.com/photos/ebvCsRypmxM) |
| Wall calendar | [Nathan Dumlao](https://unsplash.com/photos/tG4waP7YiAg) |
| Calculator | [FIN](https://unsplash.com/photos/741iShluYhk) |
| Laptop on dark desk | [Luca Bravo](https://unsplash.com/photos/9l_326FISzk) |
| Social media phone | [Berke Citak](https://unsplash.com/photos/0cpyFsSUiSc) |
| Medical professional | [Jonathan Borba](https://unsplash.com/photos/uBb_ZDIrquc) |
| Scales of justice | [Nellie Adamyan](https://unsplash.com/photos/I2Ge7bLAhV4) |
| Law library | [Nasser Eledroos](https://unsplash.com/photos/dykSg3AgqV4) |
| Video call | [Vitaly Gariev](https://unsplash.com/photos/GD4jccM_K_E) |
| Organized workstation | [Arnel Hasanovic](https://unsplash.com/photos/MNd-Rka1o0Q) |
| Working by the window | [Filip Rankovic Grobgaard](https://unsplash.com/photos/mhQAQATZApA) |
| Sunlit desk | [Minh Pham](https://unsplash.com/photos/IisDPFNUS4k) |
| At the desk | [Vitaly Gariev](https://unsplash.com/photos/wAPhLocO-ms) |
| Notepad | [Marissa Grootes](https://unsplash.com/photos/flRm0z3MEoA) |
| Doctor's office | [charlesdeluvio](https://unsplash.com/photos/S5meg_j_W1U) |

The team photos come from [Pexels](https://www.pexels.com/license/) and are stored in the project itself (`assets/img/team/`) as WebP files in four sizes, each cropped around the person for the spot it fills.

| Use | Photo |
| --- | --- |
| Home statement, Reliable | [Businesswoman on a phone call](https://www.pexels.com/photo/focused-businesswoman-on-a-phone-call-34232430/) |
| Virtual Reception service card | [Man on the phone at his desk](https://www.pexels.com/photo/man-sitting-at-the-desk-in-an-office-and-talking-on-the-phone-6803547/) |
| Become a VA page | [Woman working in a modern office](https://www.pexels.com/photo/professional-woman-working-in-modern-office-space-35730233/) |
| Startups and founders card, Coachable | [Woman in a blazer](https://www.pexels.com/photo/a-woman-wearing-a-blazer-7611185/) |
| About page, Work ethic | [Woman with a laptop](https://www.pexels.com/photo/brunette-woman-sitting-with-laptop-17810857/) |

## Third party code

* GSAP 3.15.0 and ScrollTrigger, under the [GSAP Standard License](https://gsap.com/standard-license) (free for commercial websites)
* Lenis 1.3.26, MIT License
