const express = require('express')
const app = express()


const course = [
    { code: "ICT 461", name: "Web Application Development" },
    { code: "ICT 411", name: "Cloud Computing" }
];

const registration = [
    { id: "reg_1", studentId: "202308647", name: "Elton chiwala", programme: "BSc Computer Science", courseCode: "ICT 461" },
    { id: "reg_2", studentId: "202308648", name: "Jane Doe", programme: "BSc Computer Science", courseCode: "ICT 411" }
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

app.get('/', (req, res) => {
    res.send('Hello world')
});

app.listen(3000, () => {
    console.log("API running on http://localhost:3000");
});