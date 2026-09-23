# AI-use.md - AI usage log

**Course:** ICT461 - Web Standards and HTTP Fundamentals
**Lab:** Course Registration Portal (Lab 3)
**Group:** GROUP D
**Repository:** [Slade-creator/web-lab](https://github.com/Slade-creator/web-lab)

## Our AI policy (from the lab sheet)

AI may explain concepts and suggest a fix **only after we have made and recorded our
first attempt**. Every prompt, every suggestion we used or rejected, our test, and
what we learned is logged below. All submitted code can be explained by either of us.
No AI-generated screenshots or invented test results are submitted.

---

## Summary

| # | Date | Task | AI involved? | One-line outcome |
|---|------|------|--------------|------------------|
| 1 | 2026-09-21 | Documentation / lab setup | Yes | AI suggested the log's name and section layout; we wrote it; renamed plan `api_use.md` → `AI-use.md`; flagged an `api.js` naming collision to fix ourselves |
| 2 | 2026-09-21 | Task 2 - Express endpoints (concepts) | Yes | Explained endpoint anatomy, status-code mapping and Windows cURL testing; code still ours to write and test |
| 3 | 2026-09-21 | Task 2 - GET /api/registrations/:id | Yes | Reviewed our first attempt after it failed; two fixes (plural path, req.params.id); full predict → fail → diagnose → pass arc recorded |
| 4 | 2026-09-21 | Task 2 - POST /api/registrations | Yes | 201 + Location, 409 duplicate, 400 invalid all pass; failures taught server restart, express.json() call parentheses, and PowerShell/cURL quoting boundaries |
| 5 | 2026-09-21 | Task 2 - PUT /api/registrations/:id | Yes (reviewer) | Looked over our failed first attempt; full-replace contract passes (200/404/400); restart wiped the memory store (the in-memory lesson); idempotent PUT shown by identical ETags |
| 6 | 2026-09-21 | Task 2 + 1.3 - PATCH, DELETE, UI wiring | Yes (reviewer) | Checked all six routes and the form→API flow, all passing; both of us still have the explain-back checklist to walk |
| 7 | 2026-09-22 | Tasks 2.3, 3.1, 3.2, 4.1 - inspect route, caching, CORS toggle, cookie demo, docs | Yes (reviewer) | Checked every new route against a running server; we still have to re-run everything and capture our own evidence |
| 8 | 2026-09-22 | Repository cleanup | Yes (reviewer) | AI listed what to clean; we removed tooling artifacts, moved our layout captures into `assets/`, deleted the unreferenced `app.ts`, corrected `package.json` |

## Entries

### Entry 1 - 2026-09-21 - Creating the AI usage log

**Task / stage:** End of Task 1 (interface).

**Prompt:**

> the lecture asked for an AI usage log for this lab [attached lab PDF] - can you
> guide me on what sections it needs and what to call it? don't write the lab work
> for me, just the log structure

**Suggestion used:**

- Name the file `AI-use.md`, because the lab sheet's "Show your own learning" section
  specifies that exact name, not `api_use.md`.
- Structure each entry as: prompt → suggestion used → suggestion rejected → test →
  what we learned, mirroring the lab's required log fields.
- Record only verifiable repo evidence (commit hashes, file names) and leave
  clearly marked TODO placeholders for evidence we still have to capture ourselves
  (DevTools, cURL).

**Suggestion rejected:**

- AI offered to write the remaining lab code (fetch helper, `server.js` routes) at
  the same time. We turned that down: the lab only allows AI to explain concepts and
  suggest fixes *after* our first recorded attempt, so Task 1.3 and Task 2 code had
  to be ours first, then reviewed.

**Issue AI spotted:**

- Our file `api.js` currently holds an Express server (`app.listen(3000)`), but Task 1.3
  requires importing a Fetch helper *from `api.js`* into `app.js` as a browser module,
  and Task 2 requires the server in `server.js`. Our plan: rename the
  Express file to `server.js`, commit it, then build `api.js` as the client-side fetch
  module. TODO below.

**Test / verification:**

- Checked the lab PDF wording for the exact filename and required log fields.
- Ran `git log --oneline` and `git status` to confirm which commits and files exist
  before writing this entry.

**What we learned:**

- The submission requirement is about *traceability*: every AI contribution needs a
  prompt, a decision (used/rejected), and a test we ran ourselves.

---

### Entry 2 - 2026-09-21 - Task 2: how to create an endpoint in Express.js

**Task / stage:** Beginning Task 2 (HTTP contract). No server route code written yet.

**Prompt:**

> explain how to create an endpoint in express.js - just the concepts and the
> status codes, we'll write the code ourselves

**What AI based its answer on:**

- Read our `package.json` and confirmed we have `express ^5.2.1`, then fetched the
  official Express 5.

**Suggestion used:**

- Endpoint anatomy: `app.METHOD('/path/:param', handler)` with `req.params`,
  `req.body`, `res.status()`, `res.json()`.
- `app.use(express.json())` must run before routes or `req.body` is `undefined`.
- Status-code mapping for the six lab routes: 200 `res.json`, 201 + `res.location()`
  for POST, `res.status(400|404|409).json({ error })`, `res.status(204).end()` for
  DELETE (never `.json()` a 204).
- `:id` params arrive as strings, convert/validate before use.
- In-memory store as a plain array; duplicate check via a `find()` on the same
  studentId + course pair before inserting (→ 409).

**Suggestion rejected:** none. We had asked for concepts only, so it did not offer
to write `server.js`.

**Windows tip we used:** in PowerShell, `curl` aliases `Invoke-WebRequest`
and mangles JSON flags - use `curl.exe -i` to see the status line and headers.

**Test / verification:**

- Checked the installed version in `package.json` (express ^5.2.1).
- First attempt passed. Ran `node server.js`, then this (2026-09-21 16:35):

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

- AI pointed out that Express already sends an `ETag` and `Content-Length` on this
  response, which connects straight to Task 3.1, where we send `If-None-Match` and
  expect a 304. We'll confirm that in our own run.

**What we learned:**

- Checking the docs for our *installed* version (Express 5) instead of copying older
  Express 4 tutorials avoids snippets that silently don't match the API we run.
- Middleware order is part of the contract: `express.json()` must be registered before
  the routes, otherwise every handler sees `undefined` bodies with no error pointing
  at the real cause.
- Mapping the status codes (200/201/400/404/409/204) *before* writing a handler
  means each route only has one shape to implement - the contract drives the code.
- On Windows, `curl` in PowerShell is not curl: it's an alias for
  `Invoke-WebRequest`, so the real binary has to be called as `curl.exe`. Knowing the
  shell's aliases exists saved us from debugging flags that never reached curl.
- Express already sends `ETag` and `Content-Length` on its own - caching is
  happening whether we design for it or not, which is exactly what Task 3.1 builds on.

---

### Entry 3 - 2026-09-21 - Task 2: GET /api/registrations/:id (failed first, then passed)

**Task / stage:** Second endpoint, our own first attempt. Committed base: `3ccfb07` (GET /api/courses).

**Prompt:**

> check my code and point out what's wrong, don't rewrite it for me
> [pasted startup console showing `ReferenceError: id is not defined ... at server.js:20:51`]
> explain this error so i can fix it myself

**What went wrong on our first attempt:**

1. Attempt 1 both curls returned Express's built-in HTML 404
   (`Cannot GET /api/registrations/reg_1`, `Content-Security-Policy: default-src 'none'`).
   Predicted: our JSON 404. Actual: HTML 404. Diagnosis: our handler never ran -
   the route had not matched.
2. The failed attempt was on record, so we asked AI to walk through the code. It
   pointed out two bugs and we fixed both:
   - **server.js:19** - path was singular `/api/registration/:id`; lab requires plural
     `registrations`, and our curl used plural. We fixed the path.
   - **server.js:20** - compared `r.id === id` but `id` was never defined; the URL
     param lives in `req.params.id`. We fixed the expression.
3. After fixing only the path, the server console showed
   `ReferenceError: id is not defined at server.js:20:51` - bug 2 surfacing as a
   500 for the client while the process kept listening (Express catches handler
   errors). We learned to read the stack trace top-down (throw site) and bottom-up
   (how the request arrived through Router → Route → Layer).

**Suggestion used:**

- Fix route path pluralisation; use `req.params.id`.

**Suggestion rejected:** none.

**Test / verification:**

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

Both responses now come from our handler: JSON content type, our error body. The
unknown-ID 404 matches the lab table; the known-ID 200 returns one record.

**What we learned:**

- The response *type* tells you which layer failed: Express's HTML 404 meant the
  route never matched (our handler never ran at all), while our JSON 404 means it
  ran and found no record. "No route" and "no resource" are different failures that
  look identical if you only read the status code.
- URL parameters only exist as `req.params.*`. A bare `id` in a handler is a
  ReferenceError, and Express catching that handler error and answering 500 while the
  process keeps listening means a client-side symptom (500) can come from a
  server-side typo, not from bad input.
- Reading the stack trace top-down finds the throw site; bottom-up shows how the
  request got there (Router → Route → Layer). We got the 500 only after the path fix
  exposed the second bug - fixes reveal the next failure instead of clearing them all
  at once.

---

### Entry 4 - 2026-09-21 - Task 2: POST /api/registrations (201 / 400 / 409)

**Task / stage:** Third endpoint, our own code. Added
`app.use(express.json())` and the POST handler with three exits: validate → 400,
duplicate check → 409, create → 201 + `Location`.

**Prompt:**

> my POST attempt is failing, can you walk me through why each of
> these fails so i can fix them myself?
> [pasted a failing POST run: Express HTML 404 `Cannot POST` plus curl errors
> "Could not resolve host: Computer" and "unmatched close brace/bracket"]
> [pasted `SyntaxError: Expected property name or '}' in JSON at position 1`]
> [pasted passing outputs for 201, GET reg_3, 409, 400]

**What went wrong on our first attempt:**

1. `Cannot POST /api/registrations` (HTML 404) - route was in the file but the
   running process predated it. Lesson: Node loads the file once at startup; edits
   need `Ctrl+C` + `node server.js`.
2. Walking through the failure with AI led us to **server.js:4**
   `app.use(express.json)` - we had passed the
   factory function without calling it. `express.json` is a factory: calling it
   *produces* the middleware. Missing `()` means no request body is ever parsed.
3. cURL/PowerShell boundary, two failures:
   - `-d '{\"...\"}'` - PowerShell 5.1 split the JSON at spaces inside
     `"BSc Computer Science"`, so curl treated `Computer` as a hostname and the
     JSON tail as extra arguments. Content never arrived intact.
   - Backtick-quoted variant got its quotes eaten too: server received
     `{name:Test Banda,...}` (unquoted keys) → **Express's own** malformed-JSON
     400 (HTML, `SyntaxError` at position 1, body-parser stack trace).
   - Fix: JSON payloads in files (`body.json`, `body_bad.json`), sent with
     `-d "@body.json"`. Committed as reusable test fixtures.
4. Nuance learned by evidence: our API now has **two different 400s** - Express's
   automatic 400 for malformed JSON (HTML) and our 400 for invalid-but-parsed data
   (our JSON error message). Same code, different layer.

**Suggestion used:**

- Call `express.json()`; restart after edits; use `@file` payloads; make test
  payload keys match our field names. We typed and ran all of it.

**Suggestion rejected:** none.

**Test / verification (2026-09-21 17:23-17:46):**

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
question: POST is not idempotent - same request, different intended server effect.

**What we learned:**

- A factory function is not middleware: `express.json` without `()` registers
  nothing, and the symptom (empty `req.body`) is nowhere near the cause (one missing
  pair of parentheses) - that distance is why the error was invisible until we read
  line 4.
- Node loads the file once at startup. A route that exists in the editor but 404s in
  cURL almost always means the running process predates the edit; `Ctrl+C` +
  `node server.js` (and later `node --watch`) removes that whole class of failure.
- Quoting is a boundary between shells: PowerShell split the JSON at the spaces in
  "BSc Computer Science" before curl ever saw it. Moving payloads into files
  (`-d "@body.json"`) takes the test out of the shell's reach entirely - a technique,
  not a one-off fix.
- Validation belongs on the server even though the form already validates: the browser
  can be bypassed (Checkpoint A: browser → web server → application → data store), and
  our API now has two genuinely different 400s - Express's for malformed JSON and ours
  for parsed-but-invalid data - same status, different layer.
- The 201→409 pair on an *identical* repeat is what non-idempotent looks like in
  practice: same request, different intended server effect.

---

### Entry 5 - 2026-09-21 - Task 2: PUT /api/registrations/:id

**Task / stage:** Fourth endpoint, our own code. Before attempting it we asked AI to
explain a few things (mutation vs creation, full-replace semantics,
validate-before-mutate); afterwards it read our code and the failing output we
pasted.

**Prompt:**

> // full replace: overwrite each field on the object we found ... i don't
> understand this part, explain what it does before i try it
> check the code and tell me what's wrong [pasted `Cannot PUT` HTML 404]
> [pasted passing 200 / 404 / 400 outputs]

**What AI explained (before we wrote the handler):**

- `find()` returns the object itself, not a copy - assigning `reg.name = ...`
  mutates the record inside the array (locker analogy: POST welds a new locker,
  PUT swaps a locker's contents; number/`id` stays).
- PUT = "make this resource exactly like my payload", so a missing field would be
  *wiped* - that is why every required field must be validated BEFORE the first
  assignment (no undo).
- 200 not 201: the resource already existed; 201 means "created", with `Location`
  pointing at something new.

**What went wrong on our first attempt:**

1. `Cannot PUT /api/registrations/reg_3` HTML 404 - third occurrence of the
   restart class. Systemic fix: `node --watch server.js` (Node's built-in watcher,
   no new dependency) - saving now auto-restarts.
2. After restart, PUT to `reg_3` returned our own 404 - correct behaviour with
   a deep cause: the restart wiped the in-memory array; `reg_3` existed only in the
   previous process. This is what the lab means by "use in-memory records": we have
   no data-store layer, so nothing survives a restart. (Goes in the README decision
   note.)
3. PUT over `reg_2` replaced Jane Doe's record with our test payload - full-replace
   is client-directed and destructive by design. Also observed: our `body_put.json`
   contained `"Test BandaUpdated"` (missing space) and the server accepted it -
   our validation checks presence, not quality.

**Suggestion used:**

- Mutate the found object field-by-field; validate every field first; order:
  404 (unknown id) before 400 (invalid body) - our choice, explained in the README.
- `node --watch` as the permanent fix for the restart class of failures.

**Suggestion rejected:** none.

**Test / verification (2026-09-21 18:04-18:08):**

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

**Design note (not implemented):** PUT does not
guard against creating a duplicate studentId+course combination - our POST 409
does not run on PUT. Relevant for a real system; out of scope for the prototype.

**What we learned:**

- The restart wiped `reg_3`. With a plain array and no data-store layer, state lives
  exactly as long as the process - we experienced the in-memory decision instead of
  just writing it in the README, and understood why a real system needs persistence.
- Idempotency is something we *observed*, not defined: two identical PUTs returned 200
  both times with byte-identical ETags, meaning the second request changed nothing.
  Placing that next to POST's 201→409 makes the difference concrete.
- PUT is destructive by contract ("make this resource exactly like my payload"), so
  validation must happen before the first assignment - a missing field would wipe
  data and there is no undo after mutation starts.
- Our validation checks presence, not quality: `"Test BandaUpdated"` (missing space)
  was accepted. A validator's guarantees are only as strong as the checks it actually
  performs - and that applies to the form validation too.

---

### Entry 6 - 2026-09-21 - PATCH, DELETE and UI wiring (AI-reviewed)

**Task / stage:** We wrote the two remaining endpoints and wired the form to the API
ourselves, then asked AI to read the code and tell us what needed fixing. It flagged
the issues below; the fixes were ours.

**Prompt:**

> review the PATCH and DELETE routes i wrote and the form wiring - just tell me
> what needs fixing, i'll make the changes
> also, how does a preflight request work?

**What AI reviewed:**

All of these files are ours; AI only read them and reported back.

- `server.js`: PATCH route (programme-only change; 400 on invalid value; 404),
  DELETE route (204 no body; 404), manual CORS middleware (exact origin
  `http://localhost:5500`, allowed methods/headers, 204 for OPTIONS preflight).
  AI flagged our `"unkown id"` typo - we fixed it.
- `api.js` (new): fetch helper module - `request()` wrapper that skips JSON
  parsing on 204 (the lab's rule), throws `data.error` for non-2xx, and
  `postRegistration()`.
- `app.js` (rewritten): async submit handler, loading state on the button,
  success/error feedback, localStorage save + restore of programme preference,
  payload keys aligned to the server (`programme`/`courseName` - resolves the
  Entry 4 vocabulary TODO).
- `index.html`: `<p id="formFeedback" role="status" aria-live="polite">`; CSS for
  feedback and disabled button.
- `serve-ui.js` (new): dependency-free static server on port 5500 (lab requires
  the interface on 5500; a file:// origin would break the cross-port fetch).
- `package.json`: `npm start` (node --watch server.js), `npm run ui`.
- Fixtures: `body_patch.json`, `body_patch_empty.json`.

**Test / verification:**

AI ran these during its review; we'll repeat them ourselves before submission.

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

**Issues AI flagged (for us to decide):**

1. **ID collision:** after DELETE of `reg_2` + a new POST, the generator
   `"reg_" + (registration.length + 1)` reissued `reg_2` for a different student.
   Design note for README: naive ID generation is unsafe after deletions; a
   monotonic counter or timestamp would fix it (design-only for this prototype).
2. **favicon.ico 404** in the browser console - cosmetic; add an icon before
   submission.

**What we learned:**

- `204 No Content` must truly have no body, which is why the client helper checks
  `status !== 204` before calling `.json()` - matching on status codes instead of
  assuming JSON keeps both sides honest about the contract.
- CORS is enforced by the *browser*, not the server. The OPTIONS preflight exists
  because a JSON POST isn't a "simple" request, and the server must echo the right
  headers for the browser to allow the response to be read - cURL never cared about
  any of it, which is why cURL passing proves nothing about browser access.
- `finally` is what re-enables the button after success *and* failure; the loading
  state exists to block double-submits while a request is in flight. Without
  `finally`, one thrown error would leave the form permanently disabled.
- Small accessibility wiring carries real weight: `role="status"` +
  `aria-live="polite"` announces the result to screen-reader users without moving
  focus away from where they were typing.
- A vocabulary mismatch between form and API (`program`/`course` vs
  `programme`/`courseName`) shows up as half-empty payloads, not as errors - naming
  is part of the interface contract, which is why we aligned both sides.
- DELETE uses `findIndex` + `splice` while GET uses `find`: removing needs the index,
  reading needs the object - same lookup question, different answer.

---

### Entry 7 - 2026-09-22 - Tasks 2.3, 3.1, 3.2, 4.1 (AI-reviewed)

**Task / stage:** We had finished Task 1 and the six Task 2 routes. This entry
covers what we built next: the `/inspect` diagnostic route, cache headers, a
repeatable CORS failure, and the cookie demo. AI read the code, ran it, and
flagged the issues below.

**Prompt:**

> can you check whats missing from my code - list the gaps and any issues, don't
> edit anything yourself

**What AI reviewed:**

- `server.js` - `GET /inspect` (`app.all` with `express.json()`,
  `express.urlencoded()` and `express.text()` parsers) echoing method, labelled URL
  parts, headers, `Accept`, `Content-Type` and the parsed body; explicit
  `ETag` + `Cache-Control: public, max-age=60` on `GET /api/courses` with an
  `If-None-Match` → 304 branch; `Cache-Control: no-store` on
  `/api/registrations` and `/api/demo`; env-driven CORS
  (`UI_ORIGIN`, `CORS=off`) with `Access-Control-Allow-Credentials: true` and
  `Vary: Origin`; the `POST`/`GET /api/demo/session` cookie routes plus a
  dependency-free `parseCookies()`.
- `app.js` - restored the `localStorage` programme preference (Task 1.3) as
  `saveProgrammePreference()` / `restoreProgrammePreference()` wrapped in
  `try/catch`, and wired the cookie-demo buttons.
- `api.js` - `startDemoSession()` / `readDemoSession()` with
  `credentials: "include"`.
- `index.html`, `styles.css` - the labelled "Lab diagnostics - cookie demo"
  section and its styles.
- `favicon.svg` - closes the `/favicon.ico` 404 from Entry 6.
- `body_patch.json`, `body_patch_empty.json` - the fixtures Entry 6 referenced but
  never committed.
- `README.md` - two-failures-per-route contract table, cache-header table, and the
  experiment recipes for Tasks 2.3, 3.1, 3.2, 4.1, 4.2, 4.3 with empty "Observed"
  columns for us to fill from our own runs.

**Test / verification:**

During the review AI ran the API and a browser against the working tree and recorded:

```
GET  /api/courses                     -> 200, ETag: "7ebf3336...", Cache-Control: public, max-age=60
GET  /api/courses + If-None-Match     -> 304 Not Modified, no Content-Length
GET  /api/registrations/reg_1         -> 200, Cache-Control: no-store
POST /inspect (JSON)                  -> body echoed, contentType application/json
POST /inspect (form data, ?q=..#frag) -> body echoed, accept text/html, fragment absent
OPTIONS /api/registrations            -> 204 + Access-Control-Allow-* (CORS on)
POST /api/registrations (CORS=off)    -> 201 for cURL, but NO Access-Control-Allow-Origin
POST /api/demo/session                -> 200, Set-Cookie: demoSession=...; HttpOnly; SameSite=Lax; Path=/
GET  /api/demo/session                -> {"received":"demo-..."} (cookie sent back)

Browser (Playwright-driven, http://localhost:5500):
form submit                           -> POST 201, dialog opened, "Registration saved as reg_3."
programme after form.reset()          -> "BSc Computer Science" (restored)
programme after full reload           -> "BSc Computer Science" (persisted)
name/studentId/course after reload    -> all empty (only the programme is stored)
cookie demo buttons                   -> Set-Cookie accepted, cookie sent back
document.cookie                       -> "" (HttpOnly blocks JavaScript)
console errors                        -> none (favicon 404 fixed)

Browser with CORS=off:
console                               -> "blocked by CORS policy: Response to preflight
                                         request doesn't pass access control check: No
                                         'Access-Control-Allow-Origin' header is present"
request                               -> POST ... net::ERR_FAILED
form feedback                         -> "Failed to fetch", button re-enabled (finally ran)
```

**Note:** these outputs are from AI's review run, not ours. Every "Observed" cell in
the README still has to be filled from our own runs; that's a documentation step,
not a re-test of the code.

**Issues AI flagged but did not change:**

1. The `"reg_" + (registration.length + 1)` ID generator still collides after a
   DELETE (Entry 6, issue 1). We labelled it design-only; AI left it alone so the
   code matches our README decision. A marker may still ask about it.
2. The demo cookie has no `Secure` flag because the lab runs on `http://localhost`.
   The README explains why; we should be able to explain it too if asked.
3. `app.ts` held the old TypeScript draft from before the lab and was not
   referenced by anything. AI did not delete it in case we still needed it - we
   decided to delete it in Entry 8.

**What we learned:**

- Freshness and revalidation solve different problems: `max-age=60` avoids the
  request entirely, `If-None-Match` → 304 avoids re-sending the body, and `no-store`
  on registrations exists because personal data must never be cached at all. Three
  headers, three distinct risks.
- The 304 having no body *is* the mechanism - the client's cached copy is the
  payload, so sending a body back would defeat the point.
- CORS failures look like server bugs but are browser policy: with `CORS=off` the same
  POST returns 201 to cURL while the console shows `ERR_FAILED`. "It works in curl"
  is not evidence that a browser is allowed to read the response.
- Cookie flags do separate jobs and must not be mixed up: `HttpOnly` hides the cookie
  from `document.cookie` (we saw the empty string ourselves), `SameSite` governs
  cross-site sending, and `Secure` is unavailable on plain `http://localhost` -
  omitted because of the protocol, not out of carelessness.
- `Accept` describes what the client can receive; `Content-Type` describes what it
  actually sent. The `#fragment` never reaches the server because fragments are
  client-side only - `/inspect` echoed everything else and proved it.
- Persisting only the programme (inside `try/catch`) was a deliberate scope choice:
  localStorage can throw (quota or private mode), so persistence must never be able
  to break form submission, and storing one field keeps the privacy surface small.

---

### Entry 8 - 2026-09-22 - Cleanup pass (AI-reviewed)

**Task / stage:** After Entry 7 we asked AI what needed tidying, and did the cleanup
ourselves. Worth logging because it touched a file of ours and moved evidence.

**Prompt:**

> can you review the repo and tell me what should be cleaned up? give me the list
> and i'll do the deletions and moves myself

**Suggestion used:**

We did every item on this list ourselves:

- Delete the 15 regenerable Playwright artifacts (`page-*.yml`, `console-*.log`).
- Move the two layout captures into `assets/` as `layout-360.png` and
  `layout-1366.png` and link them from the README Task 1.2 evidence table.
- Delete `app.ts`, the unreferenced pre-lab TypeScript draft.
- Correct the `package.json` description, which still claimed TypeScript, and drop
  the meaningless `main` field.
- Commit our own `server.js` comments.

**Suggestion rejected:**

- AI offered to do the deletions and moves itself. We had said in the prompt we'd do
  them, so we did.
- AI offered to stop the background dev servers on ports 3000 and 5500. We kept
  them running because we still need them to capture evidence.

**Test / verification:**

- `node -e "require('./package.json')"` parses - the description edit did not break it.
- Re-requested `index.html`, `app.js`, `api.js` and `favicon.svg` from
  `localhost:5500` - all `200` after `app.ts` was deleted, proving nothing imported it.
- Searched the repo for `app.ts` and `TypeScript` - the only remaining hits were this
  log, which we then updated.

**Follow-up the same day (second pass):**

- AI noticed the working tree had changed while we were committing: we had added
  comment passes to `api.js`, `app.js` and `serve-ui.js`, written `start.ps1`, and
  deleted all five `body*.json` fixtures. It flagged that rather than guessing, and
  we restored the fixtures from git (the README documents them in detail and the
  cURL recipes depend on them).
- We replaced `start.sh` with `start.ps1`, so the README now describes only the
  PowerShell helper.
- AI verified `start.ps1` end to end as a read-only check: both servers came up on
  3000 and 5500, and `GET /api/courses` and `GET /` each answered `200`.
- AI checked that our comment passes were comments-only before we committed them,
  so no behaviour changed under cover of documentation.

**What we learned:**

- A gitignored tooling folder is an evidence trap: the layout captures were real work,
  but git would never ship them - if evidence isn't in a tracked path like `assets/`,
  it effectively doesn't exist at submission time.
- Cleanup should be verified, not assumed: re-requesting `index.html`, `app.js`,
  `api.js` and `favicon.svg` after deleting `app.ts` proved nothing imported it, and
  parsing `package.json` proved the description edit didn't break the file.
- The `server.js` comments were ours, so we committed them ourselves. When AI
  noticed the working tree changing underneath it, it flagged that instead of
  guessing, which saved our edits; we restored the deleted fixtures from git at the
  same time.

---

### Entry template (copy for each future AI interaction)

```
### Entry N - YYYY-MM-DD - [Task number and short description]

**Prompt:**
> [paste the exact prompt we sent]

**Suggestion used:**
- [what we took from the reply, in our own words]

**Suggestion rejected:**
- [what we did not take, and why]

**Test / verification:**
- [the command, DevTools panel, curl run, or manual check we used, with the
  observed result - only real observations]

**What we learned:**
- [one or two sentences in our own words]
```

---

## Statement

We confirm that every entry above is accurate, that all submitted code can be
explained by both of us, and that all screenshots and test results were produced by
us during our own runs.

Signed: GROUP D
