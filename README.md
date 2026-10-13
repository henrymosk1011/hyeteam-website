# HyeTeam

Website for **HyeTeam**, a virtual assistant staffing agency that connects businesses around the world with highly skilled Virtual Assistants from Armenia.

Designed by [TENELEVENMEDIA](https://www.tenelevenmedia.com).

## Overview

A fast, static website with no build step. Every page is plain HTML, one shared stylesheet, and one shared script.

* Smooth scrolling with [Lenis](https://github.com/darkroomengineering/lenis)
* Scroll animations, horizontal scrolling sections and page transitions with [GSAP](https://gsap.com) and ScrollTrigger
* Respects "reduce motion" settings and works with JavaScript turned off
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
| Not found | `/404.html` |

The previous site's addresses (`/about-us`, `/hire-a-virtual-assistant`, `/become-a-virtual-assistant`, `/privacy-policy`, `/terms-and-conditions`) redirect to the new pages so existing links and search results keep working.

## Project structure

```
index.html              Home
about/ hire/ apply/     Inner pages (each has an index.html)
contact/
blog/                   Blog index and articles
privacy/ terms/         Privacy Policy and Terms and Conditions
404.html                Not found page
assets/css/main.css     All styles (colors and type at the top)
assets/js/main.js       All interactions and animations
assets/vendor/          GSAP 3.15.0, ScrollTrigger, Lenis 1.3.26
assets/img/            Logo files, favicons and the social share image
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

**Forms.** The contact form and the Virtual Assistant application work right away: on submit they open the visitor's email app with a message to `info@hyeteam.com` already written. To receive submissions directly instead, create a form endpoint (Formspree, Basin, Getform or similar) and paste its URL into the form's `data-endpoint` attribute in `contact/index.html` and `apply/index.html`.

**Strategy Call link.** "Schedule a Strategy Call" buttons go to the contact form with "A free Strategy Call" preselected. To send people to a booking page such as Calendly, replace `contact/?topic=strategy#form` in those buttons with the booking link.

**Social links.** The footer's "Social" column links to Instagram (`instagram.com/hyeteam`) and Facebook (`facebook.com/hyeteam`).

**Copyright year.** The footer year updates itself from the visitor's clock, so it shows 2027 starting January 1, 2027 with no edits needed.

**Writing style.** The site copy intentionally uses no dashes or hyphens. Keep that in mind when adding text (for example "full time", "back office", "US based").

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
| Taking notes | [Aleksei Zhivilov](https://unsplash.com/photos/4CMDPkkST7I) |
| Desk with glasses | [Irfan Syahmi](https://unsplash.com/photos/QQeIkbnwAbA) |
| Weekly planner | [Renáta-Adrienn](https://unsplash.com/photos/ebvCsRypmxM) |
| Wall calendar | [Nathan Dumlao](https://unsplash.com/photos/tG4waP7YiAg) |
| Calculator | [FIN](https://unsplash.com/photos/741iShluYhk) |
| Laptop on dark desk | [Luca Bravo](https://unsplash.com/photos/9l_326FISzk) |
| Assistant with headphones | [Rodrigo Rodrigues](https://unsplash.com/photos/PEm8fqi4vBA) |
| Social media phone | [Berke Citak](https://unsplash.com/photos/0cpyFsSUiSc) |
| Medical professional | [Jonathan Borba](https://unsplash.com/photos/uBb_ZDIrquc) |
| Scales of justice | [Nellie Adamyan](https://unsplash.com/photos/I2Ge7bLAhV4) |
| Law library | [Nasser Eledroos](https://unsplash.com/photos/dykSg3AgqV4) |
| Video call | [Vitaly Gariev](https://unsplash.com/photos/GD4jccM_K_E) |
| Organized workstation | [Arnel Hasanovic](https://unsplash.com/photos/MNd-Rka1o0Q) |
| Working from home | [Luca Nicoletti](https://unsplash.com/photos/mNJVyLyiLtw) |
| Working by the window | [Filip Rankovic Grobgaard](https://unsplash.com/photos/mhQAQATZApA) |
| Sunlit desk | [Minh Pham](https://unsplash.com/photos/IisDPFNUS4k) |
| Smiling at the laptop | [Rodrigo Rodrigues](https://unsplash.com/photos/xEqFIzP0_3c) |
| At the desk | [Vitaly Gariev](https://unsplash.com/photos/wAPhLocO-ms) |
| Notepad | [Marissa Grootes](https://unsplash.com/photos/flRm0z3MEoA) |
| Doctor's office | [charlesdeluvio](https://unsplash.com/photos/S5meg_j_W1U) |

## Third party code

* GSAP 3.15.0 and ScrollTrigger, under the [GSAP Standard License](https://gsap.com/standard-license) (free for commercial websites)
* Lenis 1.3.26, MIT License
