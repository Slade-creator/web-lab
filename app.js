import { postRegistration } from "./api.js";

const form = document.getElementById("regForm");
const dialog = document.getElementById("successDialog");
const dialogText = document.getElementById("dialogText");
const dialogClose = document.getElementById("dialogClose");
const feedback = document.getElementById("formFeedback");
const submitButton = form.querySelector("button[type='submit']");

const PROGRAMME_KEY = "preferredProgramme";

function getInputValue(id) {
    return document.getElementById(id).value.trim();
}

function showFeedback(message, isError) {
    feedback.textContent = message;
    feedback.classList.toggle("error", isError);
}

function setBusy(busy) {
    submitButton.disabled = busy;
    submitButton.textContent = busy ? "Registering..." : "Submit";
}

const savedProgramme = localStorage.getItem(PROGRAMME_KEY);
if (savedProgramme) {
    document.getElementById("program").value = savedProgramme;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const reg = {
        name: getInputValue("name"),
        studentId: getInputValue("StudentId"),
        programme: getInputValue("program"),
        courseName: getInputValue("course"),
    };

    showFeedback("");
    setBusy(true);

    try {
        const saved = await postRegistration(reg);
        localStorage.setItem(PROGRAMME_KEY, reg.programme);
        dialogText.textContent = `Course ${saved.courseName} added for ${saved.name}!`;
        dialog.showModal();
        form.reset();
        document.getElementById("program").value = reg.programme;
        showFeedback(`Registration saved as ${saved.id}.`, false);
    } catch (err) {
        showFeedback(err.message, true);
    } finally {
        setBusy(false);
    }
});

dialogClose.addEventListener("click", () => dialog.close());
