import { postRegistration, startDemoSession, readDemoSession } from "./api.js";

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

function saveProgrammePreference(programme) {
    try {
        localStorage.setItem(PROGRAMME_KEY, programme);
    } catch {
        return;
    }
}

function restoreProgrammePreference() {
    try {
        const saved = localStorage.getItem(PROGRAMME_KEY);
        if (saved) {
            document.getElementById("program").value = saved;
        }
    } catch {
        return;
    }
}


restoreProgrammePreference();

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
        saveProgrammePreference(reg.programme);
        dialogText.textContent = `Course ${saved.courseName} added for ${saved.name}!`;
        dialog.showModal();
        form.reset();
        restoreProgrammePreference();
        showFeedback(`Registration saved as ${saved.id}.`, false);
    } catch (err) {
        showFeedback(err.message, true);
    } finally {
        setBusy(false);
    }
});

dialogClose.addEventListener("click", () => dialog.close());

const cookieSetButton = document.getElementById("cookieSet");
const cookieReadButton = document.getElementById("cookieRead");
const cookieOutput = document.getElementById("cookieOutput");

async function runCookieStep(button, action) {
    button.disabled = true;
    cookieOutput.textContent = "Working...";

    try {
        const result = await action();
        cookieOutput.textContent = JSON.stringify(result, null, 2);
    } catch (err) {
        cookieOutput.textContent = err.message;
    } finally {
        button.disabled = false;
    }
}

cookieSetButton.addEventListener("click", () => runCookieStep(cookieSetButton, startDemoSession));
cookieReadButton.addEventListener("click", () => runCookieStep(cookieReadButton, readDemoSession));
