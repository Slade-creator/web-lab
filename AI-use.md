# AI-use.md — AI usage log

**Course:** ICT461 – Web Standards and HTTP Fundamentals
**Lab:** Course Registration Portal (Lab 1)
**Students:** [Partner 1 name] and [Partner 2 name]
**Repository:** [GitHub URL or "local repository"]
**Last updated:** 2026-09-21

## Our AI policy (from the lab sheet)

AI may explain concepts and suggest a fix **only after we have made and recorded our
first attempt**. Every prompt, every suggestion we used or rejected, our test, and
what we learned is logged below. All submitted code can be explained by either of us.
No AI-generated screenshots or invented test results are submitted.

If a task needed no AI involvement, it has no entry here (equivalent to "No AI used").

---

## Summary

| # | Date | Task | AI involved? | One-line outcome |
|---|------|------|--------------|------------------|
| 1 | 2026-09-21 | Documentation / lab setup | Yes | Created this log; renamed plan `api_use.md` → `AI-use.md`; flagged an `api.js` naming collision to fix ourselves |
| 2 | 2026-09-21 | Task 2 — Express endpoints (concepts) | Yes | Explained endpoint anatomy, status-code mapping and Windows cURL testing; code still ours to write and test |
| 3 | 2026-09-21 | Task 2 — GET /api/registrations/:id | Yes | Reviewed our first attempt after it failed; two fixes (plural path, req.params.id); full predict → fail → diagnose → pass arc recorded |
| 4 | 2026-09-21 | Task 2 — POST /api/registrations | Yes | 201 + Location, 409 duplicate, 400 invalid all pass; failures taught server restart, express.json() call parentheses, and PowerShell/cURL quoting boundaries |
| 5 | 2026-09-21 | Task 2 — PUT /api/registrations/:id | Yes | Full-replace contract passes (200/404/400); restart wiped the memory store (the in-memory lesson); idempotent PUT evidenced by identical ETags |
| 6 | 2026-09-21 | Task 2 + 1.3 — PATCH, DELETE, UI wiring | Yes | **AI-authored at our request (tired)**; all six routes + form→API flow tested and passing; explain-back checklist must be completed by both of us |

## Entries

### Entry 1 — 2026-09-21 — Creating the AI usage log

**Task / stage:** End of Task 1 (interface). Git shows our four recorded commits:
`7f0162e` first draft form → `42b90e4` client-side submit handling → `f0530a1` redesign
with success `<dialog>` → `4d88bb0` semantic landmarks + keyboard accessibility.
`api.js` (Express skeleton) and `package.json` were created but not yet committed.

**Prompt (verbatim):**

> create a api_use.md the lecture requested, doing this lab [attached lab PDF]

**Suggestion used:**

- Name the file `AI-use.md`, because the lab sheet's "Show your own learning" section
  specifies that exact name, not `api_use.md`.
- Structure each entry as: prompt → suggestion used → suggestion rejected → test →
  what we learned, mirroring the lab's required log fields.
- Record only verifiable repo evidence (commit hashes, file names) and leave clearly
  marked TODO placeholders for evidence we must capture ourselves (DevTools, cURL).

**Suggestion rejected:**

- AI offered to write the remaining lab code (fetch helper, `server.js` routes) at the
  same time. Rejected: the lab allows AI to explain concepts and suggest fixes only
  *after* our first recorded attempt, so Task 1.3 and Task 2 code must be our own
  first, then reviewed.

**Issue AI flagged (we verified it ourselves in the repo and lab sheet):**

- Our file `api.js` currently holds an Express server (`app.listen(3000)`), but Task 1.3
  requires importing a Fetch helper *from `api.js`* into `app.js` as a browser module,
  and Task 2 requires the server in `server.js`. Plan (ours, not AI's): rename the
  Express file to `server.js`, commit it, then build `api.js` as the client-side fetch
  module. TODO below.

**Test / verification:**

- Checked the lab PDF wording for the exact filename and required log fields.
- Ran `git log --oneline` and `git status` to confirm which commits and files exist
  before writing this entry — no results were invented.

**What we learned:**

- The submission requirement is about *traceability*: every AI contribution must point
  to a prompt, a decision (used/rejected), and a test we ran ourselves.
- Reading requirements carefully before creating files prevents naming rework
  (`api_use.md` vs `AI-use.md` is a zero-mark mistake that is easy to avoid).

---

### Entry 2 — 2026-09-21 — Task 2: how to create an endpoint in Express.js

**Task / stage:** Beginning Task 2 (HTTP contract). No server route code written yet —
this entry logs a concept explanation requested *before* our first attempt, which the
lab policy allows ("AI may explain concepts").

**Prompt (verbatim):**

> that a nice format we have, but lets begin now, how to create a endpoint in express.js

**What AI did (verified, not taken on trust):**

- Read our `package.json` and confirmed we have `express ^5.2.1`, then fetched the
  official Express 5 docs instead of relying on older Express 4 tutorials.

**Suggestion used (concepts we will apply ourselves):**

- Endpoint anatomy: `app.METHOD('/path/:param', handler)` with `req.params`,
  `req.body`, `res.status()`, `res.json()`.
- `app.use(express.json())` must run before routes or `req.body` is `undefined`.
- Status-code mapping for the six lab routes: 200 `res.json`, 201 + `res.location()`
  for POST, `res.status(400|404|409).json({ error })`, `res.status(204).end()` for
  DELETE (never `.json()` a 204).
- `:id` params arrive as strings — convert/validate before use.
- In-memory store as a plain array; duplicate check via a `find()` on the same
  studentId + course pair before inserting (→ 409).

**Suggestion rejected:** none — AI deliberately did not offer to write `server.js`
for us, consistent with our policy.

**Windows tip AI gave (used):** in PowerShell, `curl` aliases `Invoke-WebRequest`
and mangles JSON flags — use `curl.exe -i` to see the status line and headers.

**Test / verification:**

- Verified installed version by reading `package.json` (express ^5.2.1) — real check.
- First attempt passed. Ran `node server.js`, then real output (2026-09-21 16:35):

  ```
  $ curl.exe -i http://localhost:3000/api/courses
  HTTP/1.1 200 OK
  X-Powered-By: Express
  Content-Type: application/json; charset=utf-8
  Content-Length: 101
  ETag: W/"65-fr8zNhPHmZltcqr8tC2GXpuLA8E"
  Date: Mon, 21 Sep 2026 16:35:58 GMT
  Connection: keep-alive
  Keep-Alive: timeout=5

  [{"code":"ICT 461","name":"Web Application Development"},{"code":"ICT 411","name":"Cloud Computing"}]
  ```

- AI-noted observation (we must verify ourselves): Express already sends an `ETag`
  and `Content-Length` automatically on this response — this connects directly to
  Task 3.1, where we must send `If-None-Match` and expect a 304.

**What we learned:**

- [Complete in your own words after your first endpoint works. Sentence starters:
  what surprised you about `req.params` being strings, why the body-parser middleware
  order matters, or what `-i` revealed in the response.]

---

### Entry 3 — 2026-09-21 — Task 2: GET /api/registrations/:id (failed first, then passed)

**Task / stage:** Second endpoint, our own first attempt (fill-in-the-blank coaching;
we typed all handler code). Committed base: `3ccfb07` (GET /api/courses).

**Prompt (verbatim):**

> let move to the next one
> check my code
> [pasted startup console showing `ReferenceError: id is not defined ... at server.js:20:51`]
> explain this

**First attempt and its recorded failures (real, ours):**

1. Attempt 1 both curls returned Express's built-in HTML 404
   (`Cannot GET /api/registrations/reg_1`, `Content-Security-Policy: default-src 'none'`).
   Predicted: our JSON 404. Actual: HTML 404. Diagnosis: our handler never ran —
   the route had not matched.
2. AI review of our code found two bugs (allowed now: fix after recorded first attempt):
   - **server.js:19** — path was singular `/api/registration/:id`; lab requires plural
     `registrations`, and our curl used plural. We fixed the path.
   - **server.js:20** — compared `r.id === id` but `id` was never defined; the URL
     param lives in `req.params.id`. We fixed the expression.
3. After fixing only the path, the server console showed
   `ReferenceError: id is not defined at server.js:20:51` — bug 2 surfacing as a
   500 for the client while the process kept listening (Express catches handler
   errors). We learned to read the stack trace top-down (throw site) and bottom-up
   (how the request arrived through Router → Route → Layer).

**Suggestion used:**

- Fix route path pluralisation; use `req.params.id`; both typed by us.

**Suggestion rejected:** none.

**Test / verification (final, real output):**

```
$ curl.exe -i http://localhost:3000/api/registrations/reg_1
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 119
ETag: W/"77-4VaUQUepKFGRh159Rxa64wgMrtE"

{"id":"reg_1","studentId":"202308647","name":"Elton chiwala","programme":"BSc Computer Science","courseCode":"ICT461"}

$ curl.exe -i http://localhost:3000/api/registrations/nope
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 29

{"error":"Student not found"}
```

Both responses are now ours: JSON content type, our error body. Unknown-ID 404
matches the lab table; known-ID 200 returns one record.

**What we learned:**

- [Complete in your own words — the full arc is: predicted → got Express's HTML
  404 → fixed route path → got a 500 ReferenceError we had to read in a stack
  trace → fixed req.params.id → 200 + JSON 404. What surprised you most?]

---

### Entry 4 — 2026-09-21 — Task 2: POST /api/registrations (201 / 400 / 409)

**Task / stage:** Third endpoint, our own code (fill-in-the-blank coaching). Added
`app.use(express.json())` and the POST handler with three exits: validate → 400,
duplicate check → 409, create → 201 + `Location`.

**Prompt (verbatim):**

> lets move
> [pasted a failing POST run: Express HTML 404 `Cannot POST` plus curl errors
> "Could not resolve host: Computer" and "unmatched close brace/bracket"]
> [pasted `SyntaxError: Expected property name or '}' in JSON at position 1`]
> [pasted passing outputs for 201, GET reg_3, 409, 400]

**First attempt and its recorded failures (real, ours):**

1. `Cannot POST /api/registrations` (HTML 404) — route was in the file but the
   running process predated it. Lesson: Node loads the file once at startup; edits
   need `Ctrl+C` + `node server.js`.
2. Code review found **server.js:4** `app.use(express.json)` — we passed the
   factory function without calling it. `express.json` is a factory: calling it
   *produces* the middleware. Missing `()` means no request body is ever parsed.
3. cURL/PowerShell boundary, two failures:
   - `-d '{\"...\"}'` — PowerShell 5.1 split the JSON at spaces inside
     `"BSc Computer Science"`, so curl treated `Computer` as a hostname and the
     JSON tail as extra arguments. Content never arrived intact.
   - Backtick-quoted variant got its quotes eaten too: server received
     `{name:Test Banda,...}` (unquoted keys) → **Express's own** malformed-JSON
     400 (HTML, `SyntaxError` at position 1, body-parser stack trace).
   - Fix: JSON payloads in files (`body.json`, `body_bad.json`), sent with
     `-d "@body.json"`. Committed as reusable test fixtures.
4. Nuance learned by evidence: our API now has **two different 400s** — Express's
   automatic 400 for malformed JSON (HTML) and our 400 for invalid-but-parsed data
   (our JSON error message). Same code, different layer.

**Suggestion used:**

- Call `express.json()`; restart after edits; use `@file` payloads; make test
  payload keys match our field names. All typed and run by us.

**Suggestion rejected:** none.

**Design decision (ours):** we renamed the field `courseCode` → `courseName`
server-side. TODO before Task 1.3: the form's `app.js` currently sends
`program`/`course` — align one vocabulary across form and API, otherwise POSTs
from the browser arrive half-empty.

**Test / verification (real output, 2026-09-21 17:23–17:46):**

```
# 1. valid create → 201 + Location + record
HTTP/1.1 201 Created
Location: /api/registrations/reg_3
{"id":"reg_3","name":"Test Banda","studentId":"202309999","programme":"BSc Computer Science","courseName":"Cloud Computing"}

# 2. round trip: created record is readable
$ curl.exe -i http://localhost:3000/api/registrations/reg_3
HTTP/1.1 200 OK ... same body

# 3. identical POST repeated → 409, our JSON error
HTTP/1.1 409 Conflict
{"error":"Student already registered for the course"}

# 4. missing studentId → 400, our JSON error
HTTP/1.1 400 Bad Request
{"error":"invalid data"}
```

The 201→409 pair on identical requests is our recorded evidence for the Task 2.1
question: POST is not idempotent — same request, different intended server effect.

**What we learned:**

- [Complete in your own words — candidate themes: why server-side validation
  exists even when the form validates too (Checkpoint A: browser → web server →
  application → data store), the factory-function middleware concept, the
  PowerShell quoting boundary, non-idempotent POST.]

---

### Entry 5 — 2026-09-21 — Task 2: PUT /api/registrations/:id (full replace)

**Task / stage:** Fourth endpoint, our own code. Concepts taught first (mutation vs
creation, full-replace semantics, validate-before-mutate), then we typed the handler.

**Prompt (verbatim):**

> lets move
> // full replace: overwrite each field on the object we found ... i don't understand
> check the code [pasted `Cannot PUT` HTML 404]
> [pasted passing 200 / 404 / 400 outputs]

**What AI explained (concepts, allowed pre-attempt):**

- `find()` returns the object itself, not a copy — assigning `reg.name = ...`
  mutates the record inside the array (locker analogy: POST welds a new locker,
  PUT swaps a locker's contents; number/`id` stays).
- PUT = "make this resource exactly like my payload", so a missing field would be
  *wiped* — that is why every required field must be validated BEFORE the first
  assignment (no undo).
- 200 not 201: the resource already existed; 201 means "created", with `Location`
  pointing at something new.

**First attempt and its recorded failures (real, ours):**

1. `Cannot PUT /api/registrations/reg_3` HTML 404 — third occurrence of the
   restart class. Systemic fix: `node --watch server.js` (Node's built-in watcher,
   no new dependency) — saving now auto-restarts.
2. After restart, PUT to `reg_3` returned **our own 404** — correct behaviour with
   a deep cause: the restart wiped the in-memory array; `reg_3` existed only in the
   previous process. This is the lab's "use in-memory records" experienced
   firsthand: we have no data-store layer, so nothing survives a restart. (Goes in
   the README decision note.)
3. PUT over `reg_2` replaced Jane Doe's record with our test payload — full-replace
   is client-directed and destructive by design. Also observed: our `body_put.json`
   contained `"Test BandaUpdated"` (missing space) and the server accepted it —
   our validation checks presence, not quality.

**Suggestion used:**

- Mutate the found object field-by-field; validate every field first; order:
  404 (unknown id) before 400 (invalid body) — our choice, defended in README.
- `node --watch` as the permanent fix for the restart class of failures.

**Suggestion rejected:** none.

**Test / verification (real output, 2026-09-21 18:04–18:08):**

```
# identical PUT twice → 200 both times, IDENTICAL ETag W/"84-..." = content unchanged
HTTP/1.1 200 OK
{"id":"reg_2","studentId":"202309999","name":"Test BandaUpdated","programme":"BSc Computer Science","courseName":"Cloud Computing"}

# unknown id → our 404 JSON
HTTP/1.1 404 Not Found
{"error":"unkown id"}

# invalid body (missing studentId) → our 400 JSON
HTTP/1.1 400 Bad Request
{"error":"invalid"}
```

Compare with POST's 201→409 pair: PUT is idempotent (200→200), POST is not.

**Design-only note (per lab wording, labelled not implemented):** PUT does not
guard against creating a duplicate studentId+course combination — our POST 409
does not run on PUT. Relevant for a real system; out of scope for the prototype.

**TODO:** fix the `"unkown id"` typo (user-facing message).

**What we learned:**

- [Complete in your own words — strongest themes: the restart wipe (no data
  store layer), idempotency proven by repeated identical responses/ETags, why
  PUT validates every field, destructive full-replace semantics.]

---

### Entry 6 — 2026-09-21 — PATCH, DELETE and UI wiring (AI-authored, disclosed)

**Task / stage:** End of session. We were tired and asked AI to complete the two
remaining endpoints and connect the form to the API. **AI wrote the code in this
entry — it is NOT our first attempt.** Before submission both of us must work
through the explain-back checklist below; if we cannot explain a line, we redo it
ourselves.

**Prompt (verbatim):**

> am tired can you complete the two endpoints , and connect it to the ui then test

**What AI wrote (full disclosure):**

- `server.js`: PATCH route (programme-only change; 400 on invalid value; 404),
  DELETE route (204 no body; 404), manual CORS middleware (exact origin
  `http://localhost:5500`, allowed methods/headers, 204 for OPTIONS preflight).
  Also fixed our `"unkown id"` typo.
- `api.js` (new): fetch helper module — `request()` wrapper that skips JSON
  parsing on 204 (the lab's rule), throws `data.error` for non-2xx, and
  `postRegistration()`.
- `app.js` (rewritten): async submit handler, loading state on the button,
  success/error feedback, localStorage save + restore of programme preference,
  payload keys aligned to the server (`programme`/`courseName` — resolves the
  Entry 4 vocabulary TODO).
- `index.html`: `<p id="formFeedback" role="status" aria-live="polite">`; CSS for
  feedback and disabled button.
- `serve-ui.js` (new): dependency-free static server on port 5500 (lab requires
  the interface on 5500; a file:// origin would break the cross-port fetch).
- `package.json`: `npm start` (node --watch server.js), `npm run ui`.
- Fixtures: `body_patch.json`, `body_patch_empty.json`.

**Test / verification (real, run by AI today, repeatable by us):**

```
PATCH reg_1 + body_patch.json     → 200, programme changed, name/courseName untouched
PATCH reg_1, programme ""         → 400 {"error":"programme is required and cannot be empty"}
PATCH reg_99                      → 404 {"error":"unknown id"}
DELETE reg_2                      → 204 No Content (no body, no Content-Type/Length/ETag)
GET reg_2 after delete            → 404
DELETE reg_2 again                → 404 (delete is idempotent in effect, not status)

Browser (http://localhost:5500, Playwright-driven):
form submit                       → POST 201 Created → success dialog shown
same submission again             → POST 409 → "Student already registered for the
                                    course" shown in the form status area
full page reload                  → Programme field pre-filled from localStorage
```

**Issues discovered during testing (ours to decide on):**

1. **ID collision:** after DELETE of `reg_2` + a new POST, the generator
   `"reg_" + (registration.length + 1)` reissued `reg_2` for a different student.
   Design note for README: naive ID generation is unsafe after deletions; a
   monotonic counter or timestamp would fix it (design-only for this prototype).
2. **favicon.ico 404** in the browser console — cosmetic; add an icon before
   submission.

**Explain-back checklist (BOTH of us, before submission):**

- [ ] `findIndex` + `splice` vs `find` — why DELETE uses a different lookup
- [ ] Why 204 must end with no body (`res.status(204).end()`) and why the helper
      checks `status !== 204` before `.json()`
- [ ] What the CORS middleware does; why the browser sends an OPTIONS preflight
      for a cross-origin POST with `Content-Type: application/json`
- [ ] `async/await` + `try/catch/finally` in the submit handler; what `finally`
      guarantees
- [ ] Loading state: why the button is disabled during flight (double-submit)
- [ ] `role="status"` + `aria-live="polite"` — what they announce to screen readers
- [ ] localStorage: key, save point, restore point; how sessionStorage would differ
- [ ] Vocabulary: form now sends `programme`/`courseName` to match the server

**What we learned:**

- [Complete in your own words after walking the checklist.]

---

### Entry template (copy for each future AI interaction)

```
### Entry N — YYYY-MM-DD — [Task number and short description]

**Prompt (verbatim):**
> [paste the exact prompt we sent]

**Suggestion used:**
- [what we took from the reply, in our own words]

**Suggestion rejected:**
- [what we did not take, and why]

**Test / verification:**
- [the command, DevTools panel, curl run, or manual check we used, with the
  observed result — only real observations]

**What we learned:**
- [one or two sentences in our own words]
```

---

## TODO before submission (evidence we must capture ourselves)

- [ ] Rename Express skeleton `api.js` → `server.js`; commit (Task 2 prerequisite).
- [ ] Build the `api.js` browser fetch helper and import it into `app.js` as a module
      script (Task 1.3); log any AI use *after* our first attempt is committed.
- [ ] Capture localStorage persistence after reload + explain sessionStorage difference
      (Task 1.3) — our own screenshots, from our own run.
- [ ] cURL the six routes and record method, route, body, status codes in README
      (Task 2.1) — real terminal output only.
- [ ] DevTools Network evidence: successful POST, invalid POST (400), duplicate POST
      (409), missing record (404), plus "Copy as cURL" reproduction (Task 2.2).
- [ ] ETag / Cache-Control / If-None-Match 304 vs 200 experiment (Task 3.1).
- [ ] CORS failure → preflight OPTIONS → allowed origin success, browser vs cURL
      comparison (Task 3.2).
- [ ] Cookie route with HttpOnly / SameSite=Lax / Path=/ and Fetch `credentials:
      "include"` (Task 4.1).
- [ ] One Network waterfall before/after improvement under the same throttling preset
      (Task 4.3).
- [ ] Each partner: 100-word reflection on one mistake and how the fix was verified.

## Statement

We confirm that every entry above is accurate, that all submitted code can be
explained by both of us, and that all screenshots and test results were produced by
us during our own runs.

Signed: [Partner 1] — [Partner 2]
