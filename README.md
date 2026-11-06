# Vibe Coding

A collection of independent code projects. Each app has its own folder, README, dependencies, and tests.

## Projects

| Project                     | Description                                                           | Source                                                    | Local entry point                                          |
| --------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| HEART pathway configuration | Configure the existing clinical pathway rules and reference materials | [Project README](projects/heart-pathway-config/README.md) | [Open prototype](projects/heart-pathway-config/index.html) |
| ECG Learning Tool | Four visual ECG chapters with guided practice and mixed recall | [Project README](projects/ecg-learning-tool/README.md) | [Web entry point](projects/ecg-learning-tool/public/index.html) |

The ECG Learning Tool lives in its own project folder alongside HEART. Its source, dependencies, and tests remain independent.

## Start HEART

Open `projects/heart-pathway-config/index.html` in a modern browser, or use Node.js 22 or later:

```sh
cd projects/heart-pathway-config
npm start
```

Open **http://127.0.0.1:4173**. The app runs without installing dependencies. Install its development tools with `npm ci` when you want to run checks or tests.

## Start the ECG Learning Tool

From the repository root:

```sh
cd projects/ecg-learning-tool
npm start
```

Open **http://127.0.0.1:8090**. No dependency installation is needed. Run `npm run check` from this project folder to validate and build it. Serve this app over HTTP; opening its HTML directly does not reliably load browser modules.

## How this repository is organized

| Location                         | Purpose                                                      |
| -------------------------------- | ------------------------------------------------------------ |
| `projects/heart-pathway-config/` | HEART application, assets, scripts, tests, and documentation |
| `projects/ecg-learning-tool/` | ECG lessons, diagrams, practice, recall, tests, and documentation |
| `.github/workflows/`             | GitHub automation for the repository and individual projects |
| `scripts/build-site.mjs`         | Builds the catalog, HEART, and ECG tool for static hosting      |
| `index.html`                     | Home page linking to the available projects                  |
| `docs/ADDING_PROJECTS.md`        | How to add another independent project                       |

`main` is the primary version of this whole collection. Separate project folders keep apps organized. Use branches to work on proposed changes and pull requests to review them before merging into `main`.

## Add another project

Place each new app under `projects/<project-name>/`, preserving its folders and filenames. Add it to the project table and the home page. Keep its dependencies and tests in its own folder. [Detailed steps](docs/ADDING_PROJECTS.md).

## Checks

From `projects/heart-pathway-config/`:

```sh
npm ci
npm run format:check
npm run check
npm test
npx playwright install chromium
npm run test:browser
npm run build
```

GitHub Actions performs these checks on relevant pull requests and pushes to `main`. The Chromium suite requires an installed browser. See the [project verification notes](projects/heart-pathway-config/docs/VERIFICATION.md) for local environment limitations.

## Optional web preview

The repository's Pages workflow is manual. After merging these files, set **Settings → Pages → Source** to **GitHub Actions**, then run **Actions → Deploy Vibe Coding to GitHub Pages → Run workflow**. The published site has a project catalog with HEART at `/projects/heart-pathway-config/` and the ECG tool at `/projects/ecg-learning-tool/`. The shared workflow validates both apps and publishes them at distinct URL paths.

To create the same static-site files locally:

```sh
node scripts/build-site.mjs
```

Deploy the generated `_site/` folder to a static host. Building does not publish anything.

## Prototype status

HEART is a UI prototype using supplied example data. Save lasts until the page is reloaded. The existing clinical evaluator and production services are separate. Project-specific details are in its README.

The existing unlicensed status and third-party branding/reference terms are retained. See [LICENSE.md](LICENSE.md).

