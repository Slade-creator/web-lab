interface Registration {
    name: string;
    studentId: string;
    program: string;
    course: string;
}

const form = document.getElementById("regForm") as HTMLFormElement;
const dialog = document.getElementById("successDialog") as HTMLDialogElement;
const dialogText = document.getElementById("dialogText") as HTMLElement;
const dialogClose = document.getElementById("dialogClose") as HTMLButtonElement;

function getInputValue(id: string): string {
    return (document.getElementById(id) as HTMLInputElement).value.trim();
}

form.addEventListener("submit", (e: Event) => {
    e.preventDefault(); // this stops the default form submision action

    const reg: Registration = {
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
