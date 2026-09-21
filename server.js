const express = require('express')
const app = express()

app.use(express.json())

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

app.get('/', (req, res) => {
    res.send('Hello world')
});

app.listen(3000, () => {
    console.log("API running on http://localhost:3000");
});