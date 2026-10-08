const API_URL = "/api/students";

// Get HTML elements
const studentForm = document.getElementById("student-form");
const studentId = document.getElementById("student-id");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const courseInput = document.getElementById("course");
const yearInput = document.getElementById("year");

const studentList = document.getElementById("student-list");
const noStudents = document.getElementById("no-students");

const searchInput = document.getElementById("search");

const formTitle = document.getElementById("form-title");
const submitButton = document.getElementById("submit-button");
const cancelButton = document.getElementById("cancel-button");


// Store students in memory
let students = [];


// ==========================================
// LOAD STUDENTS
// ==========================================

async function loadStudents() {

    try {

        const response = await fetch(API_URL);

        students = await response.json();

        displayStudents(students);

    } catch (error) {

        console.error("Error loading students:", error);

        alert("Unable to load students.");

    }
}


// ==========================================
// DISPLAY STUDENTS
// ==========================================

function displayStudents(studentData) {

    studentList.innerHTML = "";

    if (studentData.length === 0) {

        noStudents.style.display = "block";

        return;
    }

    noStudents.style.display = "none";


    studentData.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>

            <td>${student.name}</td>

            <td>${student.email}</td>

            <td>${student.phone || "-"}</td>

            <td>${student.course}</td>

            <td>${student.year}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editStudent(${student.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})"
                >
                    Delete
                </button>

            </td>
        `;

        studentList.appendChild(row);

    });
}


// ==========================================
// ADD / UPDATE STUDENT
// ==========================================

studentForm.addEventListener("submit", async function(event) {

    event.preventDefault();


    const student = {

        name: nameInput.value.trim(),

        email: emailInput.value.trim(),

        phone: phoneInput.value.trim(),

        course: courseInput.value.trim(),

        year: yearInput.value

    };


    try {

        let response;


        // UPDATE existing student
        if (studentId.value) {

            response = await fetch(
                `${API_URL}/${studentId.value}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(student)
                }
            );

        }

        // ADD new student
        else {

            response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(student)
                }
            );

        }


        const result = await response.json();


        if (!response.ok) {

            alert(result.error || "Something went wrong.");

            return;
        }


        alert(result.message);


        // Reset form
        resetForm();


        // Reload students
        loadStudents();


    } catch (error) {

        console.error("Error saving student:", error);

        alert("Unable to save student.");

    }

});


// ==========================================
// EDIT STUDENT
// ==========================================

async function editStudent(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`);

        const student = await response.json();


        if (!response.ok) {

            alert(student.error);

            return;
        }


        studentId.value = student.id;

        nameInput.value = student.name;

        emailInput.value = student.email;

        phoneInput.value = student.phone || "";

        courseInput.value = student.course;

        yearInput.value = student.year;


        formTitle.textContent = "Edit Student";

        submitButton.textContent = "Update Student";

        cancelButton.style.display = "inline-block";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error("Error getting student:", error);

        alert("Unable to get student.");

    }

}


// ==========================================
// DELETE STUDENT
// ==========================================

async function deleteStudent(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );


    if (!confirmDelete) {

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        const result = await response.json();


        if (!response.ok) {

            alert(result.error);

            return;
        }


        alert(result.message);


        loadStudents();


    } catch (error) {

        console.error("Error deleting student:", error);

        alert("Unable to delete student.");

    }

}


// ==========================================
// SEARCH STUDENTS
// ==========================================

searchInput.addEventListener("input", function() {

    const searchText = searchInput.value.toLowerCase();


    const filteredStudents = students.filter(student => {

        return (

            student.name.toLowerCase().includes(searchText) ||

            student.email.toLowerCase().includes(searchText) ||

            student.course.toLowerCase().includes(searchText) ||

            (student.phone || "").toLowerCase().includes(searchText)

        );

    });


    displayStudents(filteredStudents);

});


// ==========================================
// CANCEL EDIT
// ==========================================

cancelButton.addEventListener("click", function() {

    resetForm();

});


// ==========================================
// RESET FORM
// ==========================================

function resetForm() {

    studentForm.reset();

    studentId.value = "";

    formTitle.textContent = "Add New Student";

    submitButton.textContent = "Add Student";

    cancelButton.style.display = "none";

}


// ==========================================
// INITIAL LOAD
// ==========================================

loadStudents();