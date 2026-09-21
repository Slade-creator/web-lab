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
