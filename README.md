# ICT 461 Labs


## Labs

| Lab | Topic | Source |
|---|---|---|
| [LAB 1](LAB%201/README.md) | DevTools inspection of a live page | [`LAB 1/`](LAB%201/) |
| [LAB 2](LAB%202/README.md) | Course registration form (HTML, CSS, TypeScript) | [`LAB 2/`](LAB%202/) |
| [LAB 3](LAB%203/README.md) | Course registration portal wired to an Express JSON API (Fetch, caching, CORS, cookies) | [`LAB 3/`](LAB%203/) |

## Structure

```
.
├── LAB 1/
│   ├── README.md
│   └── assets/
├── LAB 2/
│   ├── registration.html
│   ├── styles.css
│   ├── script.ts
│   ├── script.js
│   └── assets/
└── LAB 3/
    ├── README.md
    ├── AI-use.md
    ├── index.html
    ├── styles.css
    ├── app.js
    ├── api.js
    ├── server.js
    ├── serve-ui.js
    ├── start.ps1
    ├── package.json
    ├── package-lock.json
    ├── body*.json
    ├── favicon.svg
    └── assets/
```

Each lab folder is self-contained. LAB 1 is a written DevTools report and LAB 2 opens
directly in a browser; LAB 3 runs its own API and static server (`npm install`, then
`.\start.ps1` — API on port 3000, UI on port 5500).
