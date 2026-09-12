"use strict";
const form = document.getElementById("regForm");
const msg = document.getElementById("message");
form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop page reload
    const reg = {
        name: document.getElementById("name").value,
        studentId: document.getElementById("StudentId").value,
        program: document.getElementById("program").value,
        course: document.getElementById("course").value,
    };
    msg.textContent = `Course ${reg.course} added for ${reg.name}!`;
    form.reset();
});
