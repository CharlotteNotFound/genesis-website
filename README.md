# Genesis Ceilings & Facades

Static, dependency-free website built from `Genesis Catalog.pdf` and the approved Genesis company/project materials.

## Run locally

From this directory:

```powershell
python -m http.server 8765
```

Then open `http://127.0.0.1:8765/`.

## Site map

- `/` - Home
- `/products/` - Searchable/filterable catalog
- `/products/<product-slug>/` - 30 detailed product pages
- `/projects/` - Project case studies and gallery
- `/about/` - Company profile and global footprint
- `/contact/` - Validated enquiry form delivered to `leo@leacharm.com` through FormSubmit

## Source structure

- `assets/css/styles.css` - Responsive design system and components
- `assets/js/catalog.js` - Product and project content model
- `assets/js/site.js` - Shared navigation, footer, and interaction behavior
- `assets/js/catalog-app.js` - Catalog filtering and product-page rendering
- `assets/js/contact.js` - Contact validation, delivery state, and FormSubmit integration
- `design-system/genesis-architectural-systems/MASTER.md` - UI/UX Pro Max design-system output

## Contact form activation

The contact form posts to FormSubmit and only shows the success panel after the delivery service accepts the request. FormSubmit requires the recipient to confirm the first activation email sent to `leo@leacharm.com`. Until that link is confirmed, submissions are retained by FormSubmit and forwarded after activation.

## Version management

The production branch is `main`. Releases use semantic version tags such as `v1.0.0`, `v1.1.0`, and `v2.0.0`.

After making and testing a change, publish a new version from PowerShell:

```powershell
.\scripts\release.ps1 -Version 1.0.1 -Message "Describe the completed change"
```

This updates `VERSION`, stages all changes, creates a versioned commit, creates an annotated tag, and pushes both `main` and the tag to GitHub.

Useful history commands:

```powershell
git log --oneline --decorate --graph --all
git tag --list --sort=-version:refname
git show v1.0.0
```

To inspect an old version without changing `main`:

```powershell
git switch --detach v1.0.0
git switch main
```

To restore an old version safely while preserving history:

```powershell
git switch main
git revert <commit-hash>
git push origin main
```

For a new line of work based on an old release:

```powershell
git switch -c restore/v1.0.0 v1.0.0
```
