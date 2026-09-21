const express = require('express')
const app = express()


const course = [
    { code: "ICT 461", name: "Web Application Development" },
    { code: "ICT 411", name: "Cloud Computing" }
]

app.get("/api/courses", (req, res) => {
    res.status(200).json(course)
})

app.get('/', (req, res) => {
    res.send('Hello world')
});

app.listen(3000, () => {
    console.log("API running on http://localhost:3000");
});