const express = require("express");
const crypto = require("crypto");

const app = express();

const UI_ORIGIN = process.env.UI_ORIGIN || "http://localhost:5500";
const CORS_ENABLED = process.env.CORS !== "off";

app.use(express.json());

app.use((req, res, next) => {
    if (CORS_ENABLED) {
        res.set("Access-Control-Allow-Origin", UI_ORIGIN);
        res.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        res.set("Access-Control-Allow-Headers", "Content-Type");
        res.set("Access-Control-Allow-Credentials", "true");
        res.set("Vary", "Origin"); // reply depends on the origin, so caches must key on it
    }

    if (req.method === "OPTIONS") {
        // Preflight. Answered even when CORS is off so the blocked request
        // still shows up in DevTools (README, Task 3.2).
        return res.sendStatus(204);
    }

    next();
});

// Registrations and cookie replies hold per-student state — never let a cache store them.
app.use(["/api/registrations", "/api/demo"], (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});

// In-memory store — a restart wipes every registration (no database in this lab).
const course = [
    { code: "ICT 461", name: "Web Application Development" },
    { code: "ICT 411", name: "Cloud Computing" }
];

const registration = [
    { id: "reg_1", studentId: "202308647", name: "Elton chiwala", programme: "BSc Computer Science", courseName: "Web developmeny" },
    { id: "reg_2", studentId: "202308648", name: "Jane Doe", programme: "BSc Computer Science", courseName: "Cloud computing" }
];


// Hash the data itself, not a timestamp: unchanged data keeps the same tag (so a
// 304 is honest) and any edit produces a new one.
function jsonETag(value) {
    return '"' + crypto.createHash("sha1").update(JSON.stringify(value)).digest("hex") + '"';
}


// True when the client already holds this exact version. Browsers may send a
// comma-separated list, the * wildcard, or the weak W/ form.
function ifNoneMatch(req, etag) {
    const header = req.headers["if-none-match"];
    if (!header) {
        return false;
    }
    return header.split(",").some((candidate) => {
        const tag = candidate.trim();
        return tag === etag || tag === "*" || tag === "W/" + etag;
    });
}

// Express 5 ships no cookie parser, and the demo only needs one value.
function parseCookies(header) {
    const jar = {};
    if (!header) {
        return jar;
    }
    for (const pair of header.split(";")) {
        const index = pair.indexOf("=");
        if (index === -1) {
            continue;
        }
        jar[pair.slice(0, index).trim()] = decodeURIComponent(pair.slice(index + 1).trim());
    }
    return jar;
}

// One parser per body type /inspect should echo: JSON, form data, plain text.
const inspectBodyParsers = [
    express.json(),
    express.urlencoded({ extended: false }),
    express.text({ type: "text/plain" })
];

app.all("/inspect", ...inspectBodyParsers, (req, res) => {
    // req.originalUrl is only path + query, so the Host header supplies the base.
    const url = new URL(req.originalUrl, `http://${req.headers.host}`);
    const [host, port] = (req.headers.host || "").split(":");

    res.status(200).json({
        method: req.method,
        urlParts: {
            scheme: url.protocol.replace(":", ""),
            host,
            port: port || "(default 80)",
            path: url.pathname,
            query: Object.fromEntries(url.searchParams),
            fragment: url.hash || "(absent — a browser never sends the #fragment)"
        },
        accept: req.headers.accept || null,
        contentType: req.headers["content-type"] || null,
        headers: req.headers,
        body: req.body === undefined ? null : req.body,
        bodyType: Array.isArray(req.body) ? "array" : typeof req.body
    });
});

app.get("/api/courses", (req, res) => {
    const etag = jsonETag(course);

    res.set("ETag", etag);
    res.set("Cache-Control", "public, max-age=60"); // fresh for 60s, then revalidate with the ETag

    if (ifNoneMatch(req, etag)) {
        return res.status(304).end(); // 304 carries no body
    }

    res.status(200).json(course);
});

app.get("/api/registrations/:id", (req, res) => {
    const reg = registration.find((r) => r.id === req.params.id)

    if(!reg) {
        return res.status(404).json({ error: "Student not found"});
    }
    res.json(reg);
});

app.post("/api/registrations", (req, res) => {
    const { name, studentId, programme, courseName} = req.body;

    if (!name || !studentId || !programme || !courseName) {
        return res.status(400).json({ error: "invalid data"})
    }

    const duplicate = registration.find((r) => r.studentId === req.body.studentId && r.courseName === req.body.courseName);

    if (duplicate) {
        return res.status(409).json({ error: "Student already registered for the course"});
    }

    // Count-based id: collides after a deletion, accepted for the prototype.
    const newReg = { id: "reg_" + (registration.length + 1), name, studentId, programme, courseName};
    registration.push(newReg);

    // 201 Created should point the client at the new record.
    res.status(201).location("/api/registrations/"+ newReg.id).json(newReg)
})

app.put("/api/registrations/:id", (req, res) => {
    const reg = registration.find((r) => r.id === req.params.id);

    if (!reg) {
        return res.status(404).json({ error: "unknown id"})
    }

    // PUT is a full replace, so a partial body is a 400 rather than an update.
    const { name, studentId, programme, courseName } = req.body;

    if (!name || !studentId || !programme || !courseName) {
        return res.status(400).json({ error: "invalid"})
    }

    reg.name = req.body.name;
    reg.studentId = req.body.studentId;
    reg.programme = req.body.programme;
    reg.courseName = req.body.courseName;

    res.status(200).json(reg);
})

app.patch("/api/registrations/:id", (req, res) => {
    const reg = registration.find((r) => r.id === req.params.id);

    if (!reg) {
        return res.status(404).json({ error: "unknown id" });
    }

    // Only the programme changes; the other fields keep their current values.
    const { programme } = req.body;

    if (!programme) {
        return res.status(400).json({ error: "programme is required and cannot be empty" });
    }

    reg.programme = programme;

    res.status(200).json(reg);
});

app.delete("/api/registrations/:id", (req, res) => {
    // findIndex + splice: removing needs the position, not just the object.
    const index = registration.findIndex((r) => r.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: "unknown id" });
    }

    registration.splice(index, 1);

    res.status(204).end();
});

const DEMO_COOKIE = "demoSession";

app.post("/api/demo/session", (req, res) => {
    const value = "demo-" + Date.now();

    res.cookie(DEMO_COOKIE, value, {
        httpOnly: true,      // JavaScript cannot read it via document.cookie
        sameSite: "lax",     // not sent on cross-site POSTs
        path: "/",
        maxAge: 5 * 60 * 1000
    });

    res.status(200).json({ set: value, note: "non-sensitive demo cookie" });
});

app.get("/api/demo/session", (req, res) => {
    const cookies = parseCookies(req.headers.cookie);

    res.status(200).json({
        received: cookies[DEMO_COOKIE] || null,
        cookieHeaderSeen: req.headers.cookie || null,
        allCookies: cookies
    });
});

app.get('/', (req, res) => {
    res.send('Hello world') // smoke test: confirms the API process is up
});

app.listen(3000, () => {
    console.log("API running on http://localhost:3000");
    console.log(CORS_ENABLED
        ? `CORS: allowing ${UI_ORIGIN} (credentials included)`
        : "CORS: DISABLED — expect a blocked request in the browser (Task 3.2 failure demo)");
});
