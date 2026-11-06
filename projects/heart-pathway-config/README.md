# HEART pathway configuration prototype

A standalone, Philips-themed prototype for configuring the existing HEART clinical pathway rules. It preserves the current design: an editable pathway title, customer/pathway/rule switches, six supplied example rules, PR and QRS thresholds, and pathway reference materials.

This project lives in [`projects/heart-pathway-config`](../../README.md) inside the Vibe-Coding repository.

## Run it

For terminal commands, first open this project folder from the repository root:

```sh
cd projects/heart-pathway-config
```

Open `index.html` directly in a modern browser. No installation or build is required.

For a local development server, use Node.js 22 or later:

```sh
npm start
```

Open **http://127.0.0.1:4173**. To use another port:

```sh
npm start -- --port 8080
```

The application has **no runtime dependencies**, external fonts, CDN scripts, backend, or API keys. The only outbound navigation is opening a reference link selected by the user.

## What works

- Rename the pathway while retaining its stable ID, rules, and reference links.
- Enable or disable the customer feature, pathway, or individual rules.
- Edit finding families, supported DXL codes, reason phrases, thresholds, context, priority, monitoring type, and rationale.
- Save pending edits, cancel them, or restore an individual rule's supplied defaults.
- Review the ESC and ACC reference links, edit their details, add a reference, and associate references with individual rules.
- Navigate rule/reference tabs with a mouse or keyboard and use the layout on smaller screens.

**Save is in memory for the current browser page. Reloading restores the sample configuration.** The app does not write files, use local storage, or send configuration to a service.

The first release is modeled as **one pathway**. The pathway selector and disabled **Add pathway** control show the planned extension. Additional pathway creation is not implemented. The eight-hour ECG pair interval is displayed as read-only because the supplied JSON does not define its configuration binding.

## Repository layout

```text
index.html                     Static page and dialogs
assets/css/styles.css          Responsive Philips-themed presentation
assets/js/demo-data.js         Six rules and two supplied reference records
assets/js/app.js               Rendering, validation, and session state
scripts/serve.mjs              Dependency-free local preview server
scripts/build.mjs              Static deployment bundle generator
scripts/check.mjs              Syntax, asset, and source-mapping checks
tests/                         HTTP and Chromium interaction tests
docs/ARCHITECTURE.md            State, field mappings, and integration boundaries
docs/examples/                 Original example rules JSON
.github/workflows/ci.yml       Formatting, checks, tests, and build
.github/workflows/pages.yml    Optional manually triggered Pages deployment
```

## Development and validation

Install the locked development tools and Chromium:

```sh
npm ci
npx playwright install chromium
npm run format:check
npm run check
npm test
npm run test:browser
npm run build
```

On a Linux system missing browser libraries, use `npx playwright install --with-deps chromium`.

To use an already installed Chromium, set `CHROMIUM_EXECUTABLE_PATH` to its absolute path before the browser suite. For example, on Linux:

```sh
CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
```

`npm run format` formats the source. `npm test` runs DOM interaction and HTTP tests without a browser installation. `npm run test:browser` exercises the UI in Chromium: title edits, parent/rule switches, validation, Save/Cancel, default restoration, references, keyboard navigation, mobile width, escaped user text, and direct file opening. Tests do not validate clinical recommendations. See [local verification](docs/VERIFICATION.md) for the checks completed while packaging.

## Working in this repository

The source is already organized within `greg4579/Vibe-Coding`. Keep this folder and its internal structure together when updating or copying the project.

The repository-level workflow [`.github/workflows/heart-ci.yml`](../../.github/workflows/heart-ci.yml) checks formatting, validates the source, runs DOM/HTTP and Chromium tests, and builds this project. It runs for changes to this project or its workflow.

The project is independently runnable; additional apps belong in their own folders under `projects/`. See [adding projects](../../docs/ADDING_PROJECTS.md).

## Optional GitHub Pages preview

The repository has one manual [Pages workflow](../../.github/workflows/pages.yml). It builds a project catalog at the site root and this app under `projects/heart-pathway-config/`.

1. In the repository, open **Settings → Pages** and select **GitHub Actions** as the source.
2. Open **Actions → Deploy Vibe Coding to GitHub Pages → Run workflow** after the reorganization is merged.
3. Open the deployment URL and select **Open HEART prototype**.

To build the combined site locally, run this from the repository root:

```sh
node scripts/build-site.mjs
```

The `_site/` output contains the catalog and built app. Pages availability and visibility depend on the GitHub account and repository settings. The workflow does not deploy automatically on pushes or pull requests.

For another static host, you can still run `npm run build` from this project folder and deploy only its `dist/` contents. Preview that standalone bundle with `npm start -- --dir dist`.

## Integration status

This is a **configuration-screen prototype**, not the HEART clinical evaluator. It has no real authentication, customer isolation, server persistence, audit records, or clinical approval workflow. The configuration checks are UI checks, not validated clinical limits. The original example data is preserved for traceability; it is not a released clinical template.

Reference materials are linked, not bundled. Their status is **Not recorded**; adding or mapping a source does not establish Medical Affairs review or validate the configured values. See [architecture and mappings](docs/ARCHITECTURE.md) for the fields to connect to the existing service.

## License and branding

The package is marked **UNLICENSED** and grants no open-source license. Philips branding and linked third-party documents are not relicensed by this repository. See [LICENSE.md](LICENSE.md).
