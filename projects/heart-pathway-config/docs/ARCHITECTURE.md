# Architecture and configuration mapping

## Application structure

`index.html` loads the stylesheet and two deferred classic scripts. `demo-data.js` assigns the supplied data to `window.HEART_DEMO_DATA`. `app.js` runs inside a private function and makes editable copies of the data. Classic scripts are intentional: the page also opens directly from disk without module-origin restrictions or a server.

There is no build-time framework. The build script copies the static page and assets into `dist/`. Development tools are confined to formatting and browser tests.

## State and Save behavior

The application keeps a `saved` snapshot and an editable `draft` in memory. Their serialized values determine whether Save/Cancel are enabled. A successful Save trims the pathway title, replaces `saved`, and increments an in-memory revision. Cancel restores `saved`; restoring defaults affects only the selected rule's draft.

Reload resets the app to the supplied data. Switching between rules or tabs retains pending edits. The `beforeunload` handler asks the browser to protect unsaved edits when it permits that prompt.

The pathway ID is `post_tavr_monitoring`. The title is a separate field. Reference associations use immutable rule IDs, so renaming a pathway or changing a finding-family label retains those associations.

## Existing JSON fields

The original file is retained in `examples/mcot_candidacy_criteria.json`. The UI uses shorter field names for presentation; it does not provide an export adapter to the existing service.

| Original field               | UI demo field              | Treatment                             |
| ---------------------------- | -------------------------- | ------------------------------------- |
| `criteria[].id`              | `rules[].id`               | Stable identity; read-only            |
| `dxl_statement_family`       | `family`                   | Editable finding-family text          |
| `dxl_statement_codes`        | `codes`                    | Selected code list                    |
| `candidate_reasons`          | `reasons`                  | Editable phrase list                  |
| `priority`                   | `priority`                 | Existing three-value dropdown         |
| `priority_rank`              | `ranks`                    | Existing presentation mapping         |
| `recommended_monitoring`     | `monitor`                  | Existing modality identifiers         |
| `context`                    | `context`                  | Empty UI string represents `null`     |
| `candidate_when`             | `rationale`                | Explanatory text                      |
| `measurement_thresholds.PR`  | `pr`                       | Numeric input represented as a string |
| `measurement_thresholds.QRS` | `qrs`                      | Numeric input represented as a string |
| `class`                      | `classification`           | Read-only supplied metadata           |
| `version`                    | Displayed rule-set version | `2.1.0`                               |

The PR/QRS comparison control shows the supplied `greater_than_or_equal_to` operator. It does not offer another comparison basis. The eight-hour interval comes from the supplied HEART panel and remains read-only because it has no field in the example JSON.

The code picker contains the union of codes in the example file. It is not a complete or validated DXL dictionary. For service integration, replace that list with the supported versioned code catalog and retain any existing unexposed fields when updating a rule.

## Pathway and reference metadata

Customer feature enablement, pathway title/ID/enablement, and rule enablement are UI concepts added around the example. Their backend field bindings remain to be supplied by the existing configuration service.

Pathway references contain a stable reference ID, title, publisher, publication year/version, source URL, relevant section, applicability notes, selected rule IDs, provided-by text, and a recorded-review status. The two supplied records have no rule associations selected and have review status `Not recorded`.

The ESC record uses its publisher DOI link. The ACC record uses the supplied PDF link. The package includes links and metadata, not copies of the documents. Opening a link is separate from saving reference metadata.

## Integration boundaries

Connect the existing configuration API at the current initialization, Save, default restoration, and reference-management boundaries. Replace the in-memory revision with the service's version/concurrency token. The service should provide the effective configuration, permitted fields and ranges, supported operators, supported code catalog, and activation behavior.

Permission checks, customer authorization, persistence, audit logging, concurrent-update enforcement, and clinical review belong to the integrated service. The mock account text and review-status display do not implement those functions.

The first-release design has one pathway. The selector and disabled Add pathway control reserve the navigation pattern; this code does not silently clone rules or create an empty clinical pathway. A later implementation should introduce a collection keyed by pathway ID and define template selection, empty states, and per-pathway Save scope.

## Browser and server behavior

User-entered text is escaped before interpolation into rendered HTML. Reference URLs are limited to HTTP/HTTPS. New reference windows use `noopener noreferrer`. No patient data is processed, and no configuration is submitted to a backend.

The included local server binds to loopback by default and serves only the page and assets. It is a local development convenience; deploy the static build through a static host for shared access.
