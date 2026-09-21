# ICT461 Lab 1 — Course Registration Portal

Mulungushi University · School of Engineering and Technology · Department of
Computer Science and IT — **ICT461 Web standards and HTTP fundamentals**

A small course registration portal: an accessible, responsive registration form
that talks to a JSON API over Fetch. Built as a pair lab to demonstrate browser ↔
server communication, HTTP methods and status codes, validation on both sides,
caching headers, cookies and CORS.

## Architecture

```
browser (form UI)          web server (static files)      application + data store
http://localhost:5500  →   serve-ui.js  →  index.html  →  app.js + api.js (Fetch)
                                    |
                                    | fetch() JSON, cross-origin
                                    v
                          Express API  http://localhost:3000
                          server.js — in-memory records (a JS array)
```

There is **no database** — the lab specifies in-memory records. Consequence we
observed ourselves: every restart wipes all registrations (documented in
`AI-use.md` Entry 5).

## Running it

Requirements: Node.js 18.11+ (for `node --watch`) and Git.

```powershell
npm install

# terminal 1 — the API on port 3000
npm start

# terminal 2 — the interface on port 5500
npm run ui
```

Then open **http://localhost:5500**. Submitting the form sends a `POST` to the
API; success opens a dialog, server-side errors (400/409) are shown as visible
text under the button. The programme field is restored after reload from
`localStorage` (see `AI-use.md` for the sessionStorage comparison TODO).

## The API contract

Every row below was verified with a real request — evidence in `AI-use.md`.

| Method and route | Success | Failures implemented |
|---|---|---|
| `GET /api/courses` | 200 + course list | — |
| `GET /api/registrations/:id` | 200 + one record | 404 unknown id |
| `POST /api/registrations` | 201 + `Location` + record | 400 missing/empty field · 409 repeated studentId + course combination |
| `PUT /api/registrations/:id` | 200 full replace | 404 unknown id · 400 every required field |
| `PATCH /api/registrations/:id` | 200 programme changed, rest untouched | 404 unknown id · 400 empty/missing programme |
| `DELETE /api/registrations/:id` | 204, no body | 404 unknown id |

### Idempotency (observed, not claimed)

- **POST is not idempotent:** two identical POSTs returned `201 Created` then
  `409 Conflict` — same request, different intended effect on the server.
- **PUT is idempotent:** the same PUT twice returned `200` both times with an
  *identical ETag* — the second replacement changed nothing.
- **DELETE is idempotent in effect but not in status:** `204` then `404`.

### Design-only behaviour (labelled, per the lab instruction)

- PUT does **not** guard against creating a duplicate combination — the 409
  duplicate rule exists only on POST.
- PATCH is lenient: extra fields in the body are ignored, only `programme` is
  applied.
- Record IDs use `"reg_" + (registration.length + 1)`, which is unsafe after
  deletions — we observed an ID collision in testing (Entry 6). A monotonic
  counter would fix it; out of scope for the prototype.
- Validation checks *presence*, not quality — the server accepted
  `"Test BandaUpdated"` verbatim. A programme whitelist would be stricter.

## Decisions worth defending (short decision note)

1. **Server-side validation is mandatory even though the form has `required`.**
   The client can be bypassed; cURL sent a missing-`studentId` payload that no
   browser form would have produced, and the server rejected it with 400.
2. **There are two different 400s.** Express's body parser rejects malformed
   JSON with an HTML 400; our handler rejects valid JSON with invalid data using
   our own JSON error. Same status, different layer — useful distinction we
   discovered from real stack traces.
3. **Vocabulary:** the form now sends `programme` / `courseName` to match the
   server field names exactly. One vocabulary across the boundary, chosen late —
   which is why it is logged in `AI-use.md` Entry 4.
4. **CORS:** the middleware allows exactly `http://localhost:5500` with explicit
   methods and `Content-Type`, plus a 204 answer to `OPTIONS` preflight — not a
   wildcard. Task 3 will experiment by removing it to capture the real failure.
5. **204 must carry no body** — `res.status(204).end()` server-side, and the
   client helper skips `res.json()` for status 204.
6. **DELETE uses `findIndex` + `splice`,** the GET/PUT/PATCH use `find` — removal
   needs the position, not the object.

## Manual API tests (fixtures committed)

```powershell
# PowerShell note: use curl.exe (not curl — it aliases Invoke-WebRequest),
# and prefer -d "@file" payloads: PowerShell 5.1 mangles inline JSON with spaces
npm start                       # then, in a second terminal:
curl.exe -i http://localhost:3000/api/courses
curl.exe -i http://localhost:3000/api/registrations/reg_1
curl.exe -i -X POST http://localhost:3000/api/registrations -H "Content-Type: application/json" -d "@body.json"
curl.exe -i -X PUT http://localhost:3000/api/registrations/reg_1 -H "Content-Type: application/json" -d "@body_put.json"
curl.exe -i -X PATCH http://localhost:3000/api/registrations/reg_1 -H "Content-Type: application/json" -d "@body_patch.json"
curl.exe -i -X DELETE http://localhost:3000/api/registrations/reg_1
```

The JSON payload files (`body.json`, `body_put.json`, `body_patch.json`,
`body_patch_empty.json`, `body_bad.json`) are committed as repeatable test
fixtures.

## Interface features (Task 1)

- Semantic landmarks: `header`, `nav`, `main`, `footer`; one `h1`, logical
  heading order; `fieldset`/`legend` grouping
- Linked labels, `required` fields, real submit button, visible feedback
  (`role="status"`, `aria-live="polite"`)
- Native `<dialog>` for success with `aria-labelledby`/`aria-describedby`
- Keyboard support: Tab, Shift+Tab, Enter; visible `:focus-visible` outlines
- Flexbox layout with a Grid media query at 700px; works at 360px and 1366px
- `prefers-reduced-motion` honoured for all animations

![Registration form](assets/form.png)

## Evidence and AI usage

- `AI-use.md` — the full AI usage log required by the lab: every prompt, what was
  used or rejected, and the tests we ran. **Entry 6 is disclosed as AI-authored
  code** (requested when we ran out of steam); both partners must complete its
  explain-back checklist before submission.
- DevTools captures: `assets/devtools-elements.png` (semantic structure),
  `assets/devtools-network.png` (network panel), `assets/lighthouse-scores.png`.
- Screenshots are our own captures; no AI-generated images are submitted.

## Files

| File | Purpose |
|---|---|
| `index.html` | Interface structure and form |
| `styles.css` | Design tokens, layout, dialog, feedback states |
| `app.js` | UI behaviour — submit handler, loading state, feedback, localStorage |
| `api.js` | Client fetch helper module (skips JSON parsing on 204) |
| `server.js` | Express API — six routes, validation, CORS middleware |
| `serve-ui.js` | Dependency-free static server for port 5500 |
| `body*.json` | Manual test payloads for cURL |
| `AI-use.md` | AI usage log (lab requirement) |
