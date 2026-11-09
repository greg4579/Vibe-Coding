# ECG Learning Tool

A standalone, Philips-inspired ECG learning prototype with four chapters, interactive placement diagrams, guided matching, and mixed recall. It runs in a browser without ChatGPT, API keys, a backend, or third-party JavaScript dependencies.

## Start locally

Install Node.js 22 or newer; Node 24 is used by the included GitHub workflow. Extract this project and open a terminal in the folder containing `package.json`.

```sh
npm start
```

Open **http://127.0.0.1:8090**. No `npm install` is needed. Serve the app over HTTP; opening `public/index.html` directly with a `file://` URL will not reliably load browser modules.

## Guided session

Use **Open guided session** above the chapter selector for the curated November 9, 2026 session. A direct link can use `?session=2026-11-09`. It has two written retrieval questions before teaching, two placement questions, then answer comparison and explicit self-assessment. Missed or prompted answers require a short teach-back. The dated session is not an automatic daily lesson generator.

Written responses and self-assessments are saved in this browser’s local storage, with a visible fallback when unavailable. They are not sent to a server or synchronized with ChatGPT. No answers, scores, or mastery claims from chat are preloaded. Self-assessment does not mark a chapter retained. The summary shows review targets and separates these from completed reviews. Chapter browsing still starts at Chapter 1, lesson 1.

## Included learning content

| Chapter | Learn | Practice | Recall |
| --- | --- | --- | --- |
| 1. Lead foundations | Electrodes vs. leads; lead families; viewing planes; selectable electrode diagrams | Sort all 12 leads into limb and chest families | 3 foundation questions |
| 2. Place the electrodes | V1/V2 anchors; V4 before V3; horizontal V4–V6 alignment | Match 6 chest electrodes to landmarks | 3 chapter questions + 2 from chapter 1 |
| 3. Read the viewing angles | Limb compass; depolarization polarity; lead angle vs. cardiac axis | Match 6 limb leads to positive directions | 3 chapter questions + 2 from earlier chapters |
| 4. Connect leads to heart regions | Conventional inferior, lateral, septal, and anterior groups | Sort 11 leads into 4 conventional groups; aVR remains separate | 3 chapter questions + 2 from earlier chapters |

The tool opens at **Chapter 1 → Learn → Lesson 1 (Sensors & views)**. Use the chapter selector, then the **Learn · Practice · Recall** links to move through the material. Each quiz can be retried. Your position and scores survive section/chapter switches in the current page session. Reloading starts a new session at Chapter 1, lesson 1.

The review intervals are learning guidance, not an active scheduling feature. The chapter quizzes do not store long-term progress. The app does not send reminders, authenticate users, collect analytics, or submit quiz answers anywhere. Clinical reference links open external sites.

## Validate and build

```sh
npm test
npm run build
```

Or run all syntax, content, interaction, server-handler, and build checks:

```sh
npm run check
```

`dist/` contains only the deployable website. It is generated and ignored by Git. Automated interaction checks use a small in-memory DOM model; they do not substitute for browser layout or accessibility testing. See [docs/VALIDATION.md](docs/VALIDATION.md).

## Repository and shared deployment

This app is an independent project in [greg4579/Vibe-Coding](https://github.com/greg4579/Vibe-Coding), under `projects/ecg-learning-tool/`. HEART remains in `projects/heart-pathway-config/`.

From the repository root, run:

```sh
cd projects/ecg-learning-tool
npm start
```

The app-specific checks live at the repository root in `.github/workflows/ecg-ci.yml`. They run on relevant pushes and pull requests. The shared `.github/workflows/pages.yml` validates and deploys the project catalog and both apps.

To publish the shared site:

1. In the repository, open **Settings → Pages** and select **GitHub Actions** as the source.
2. Open **Actions → Deploy Vibe Coding to GitHub Pages → Run workflow** and run it on `main`.

The ECG app is published at `/Vibe-Coding/projects/ecg-learning-tool/`; HEART keeps its separate `/Vibe-Coding/projects/heart-pathway-config/` URL. Each app uses relative asset paths.

Build the entire collection from the repository root with:

```sh
node scripts/build-site.mjs
```

The output `_site/` contains the project catalog and separate app folders. Building does not publish the site. Individual `dist/` output still contains only this ECG app.

GitHub reference: [configure a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Source layout

| Path | Purpose |
| --- | --- |
| `public/index.html` | App shell, chapter selector, chapter 1 markup, and diagram sources |
| `public/assets/styles.css` | Standalone page styling and responsive Philips-inspired UI |
| `public/assets/chapters.js` | Editable chapter 2–4 lessons, practice mappings, recall questions, and references |
| `public/assets/foundations.js` | Chapter 1 interactions and retryable quiz |
| `public/assets/app.js` | Chapter 2–4 navigation, diagrams, matching, and recall |
| `scripts/serve.mjs` | Local HTTP server, bound to 127.0.0.1 |
| `scripts/build.mjs` | Copies the website into `dist/` |
| `tests/` | Content validation and interaction regressions |
| `../../.github/workflows/ecg-ci.yml` | App-specific validation |
| `../../.github/workflows/pages.yml` | Shared site deployment |
| `docs/CONTENT.md` | Content editing and clinical reference notes |
| `docs/MANUAL_TESTS.md` | Browser review checklist |

## Branding and licensing

This is an educational prototype with Philips-inspired colors and typography; it is not an official Philips product. The repository is marked `UNLICENSED`; an open-source license has not been selected. Reference PDFs are linked rather than bundled.
