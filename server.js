const express = require('express')
const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "http://localhost:5500");
    res.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

const course = [
    { code: "ICT 461", name: "Web Application Development" },
    { code: "ICT 411", name: "Cloud Computing" }
];

const registration = [
    { id: "reg_1", studentId: "202308647", name: "Elton chiwala", programme: "BSc Computer Science", courseName: "Web developmeny" },
    { id: "reg_2", studentId: "202308648", name: "Jane Doe", programme: "BSc Computer Science", courseName: "Cloud computing" }
];

app.get("/api/courses", (req, res) => {
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

    const newReg = { id: "reg_" + (registration.length + 1), name, studentId, programme, courseName};
    registration.push(newReg);
    res.status(201).location("/api/registrations/"+ newReg.id).json(newReg)
})

app.put("/api/registrations/:id", (req, res) => {
    const reg = registration.find((r) => r.id === req.params.id);

    if (!reg) {
        return res.status(404).json({ error: "unknown id"})
    }

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

    const { programme } = req.body;

    if (!programme) {
        return res.status(400).json({ error: "programme is required and cannot be empty" });
    }

    reg.programme = programme;

    res.status(200).json(reg);
});

app.delete("/api/registrations/:id", (req, res) => {
    const index = registration.findIndex((r) => r.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: "unknown id" });
    }

    registration.splice(index, 1);

    res.status(204).end();
});

app.get('/', (req, res) => {
    res.send('Hello world')
});

app.listen(3000, () => {
    console.log("API running on http://localhost:3000");
});