# Working on the HyeTeam website

* **Always publish changes.** When the owner asks for a change to the site, commit it, merge it into `main`, and make sure it is live. Do not stop at a branch or a preview link, and do not ask first. Pushing to `main` deploys to www.hyeteam.com through Cloudflare Pages (project `hyeteam`) in about a minute.
* After merging, confirm the production deploy succeeded and that the live page shows the change.
* Hosting and DNS are described in the README under "Deploy" and "Put the site on www.hyeteam.com". www.hyeteam.com is served by the `hyeteam-bridge` Worker; do not point `www` back at `hyeteam.pages.dev` while the old Webflow site still lists the domain.
* Site copy uses no dashes or hyphens (see "Writing style" in the README).
