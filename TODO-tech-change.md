# TODO-tech-change (PHP → HTML + remove unneeded pages)

## Scope
- Convert pages to static HTML where possible/desired.
- Keep existing PHP endpoints only if required for essential functionality (auth/form submit) — but user selected **B**, so we will convert functional pages too.

## Planned page conversions
1. `events.php` → `events.html`
2. `dir.php` → `dir.html`
3. `leaders.php` → `leaders.html`
4. `partner.php` → `partner.html`
5. `contact.php` + `form.php` → `contact.html` (single static page)
6. `add-business.php` → `add-business.html`
7. Replace header/footer PHP includes by duplicating static markup in each HTML page OR by converting include files to `header.html`/`footer.html`.

## Unneeded / legacy cleanup (delete or disable)
1. Disable/remove legacy endpoints that are duplicates:
   - `dashboard.php` (already 410)
   - Disable/remove `login.php`/`logout.php`/`register.php` if you want purely-static site.
2. Update navigation links so they point to `*.html`.

## Safety checklist
- Ensure CSS links still work: `css/common.css`, `css/index.css`.
- Ensure images paths are correct (`img/...`, `join.jpg`, etc.).
- Ensure no links remain pointing to removed `*.php` pages.

## Testing
- Open `index.php` and verify links
- Open `index.html` (static) and verify links
- Test each new `*.html` page in browser

