interface Registration {
    name: string;
    studentId: string;
    program: string;
    course: string;
}

const form = document.getElementById("regForm") as HTMLFormElement;
const msg = document.getElementById("message") as HTMLParagraphElement;

form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop page reload
    const reg: Registration = {
        name: (document.getElementById("name") as HTMLInputElement).value,
        studentId: (document.getElementById("StudentId") as HTMLInputElement).value,
        program: (document.getElementById("program") as HTMLInputElement).value,
        course: (document.getElementById("course") as HTMLInputElement).value,
    };

    msg.textContent =  `Course ${reg.course} added for ${reg.name}!`
    form.reset()
})