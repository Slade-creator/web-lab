"use strict";
const form = document.getElementById("regForm");
const dialog = document.getElementById("successDialog");
const dialogText = document.getElementById("dialogText");
const dialogClose = document.getElementById("dialogClose");
function getInputValue(id) {
    return document.getElementById(id).value.trim();
}
form.addEventListener("submit", (e) => {
    e.preventDefault(); // this handler only runs after native validation passes
    const reg = {
        name: getInputValue("name"),
        studentId: getInputValue("StudentId"),
        program: getInputValue("program"),
        course: getInputValue("course"),
    };
    dialogText.textContent = `Course ${reg.course} added for ${reg.name}!`;
    dialog.showModal();
    form.reset();
});
dialogClose.addEventListener("click", () => dialog.close());
