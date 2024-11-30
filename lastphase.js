// DOM Elements
const seatsContainer = document.getElementById("seats-container");
const notification = document.getElementById("notification");
const loginSection = document.getElementById("login-section");
const seatSelectionSection = document.getElementById("seat-selection");
const splashScreen = document.getElementById("splash-screen");
const logoutBtn = document.getElementById("logout-btn");
const adminDots = document.getElementById("admin-dots");
const adminModal = document.getElementById("admin-modal");
const adminLoginForm = document.getElementById("admin-login-form");
const adminNotification = document.getElementById("admin-notification");
const closeModal = document.getElementById("close-modal");
const adminSeatManagement = document.getElementById("admin-seat-management");
const ownerDashboard = document.getElementById("owner-dashboard");
const loginForm = document.getElementById("loginForm");
const studentNameInput = document.getElementById("studentName");
const libraryIdInput = document.getElementById("libraryId");
const studentList = document.getElementById("student-list");
const searchBar = document.querySelector("#search-bar");
const addStudentButton = document.querySelector("#add-student");
const newStudentNameInput = document.querySelector("#new-student-name");
const newStudentIdInput = document.querySelector("#new-student-id");
const studentShiftInput = document.querySelector("#student-shift");
const backBtn = document.getElementById("back-btn");
const searchInput = document.querySelector("#seat-input");
const searchButton = document.querySelector("#search-seat");

// Global Variables
let seatSelected = false;
let userOccupiedSeat = false;
const adminPassword = "admin123";
const ownerPassword = "owner1234";
let students = [];

// // Back Button Logic globsl declaration for the all page this might be work in theb logic gate 
// backBtn.addEventListener('click', function () {
//     const adminLoggedIn = sessionStorage.getItem("adminLoggedIn");
//     const ownerLoggedIn = sessionStorage.getItem("ownerLoggedIn");

//     if (ownerLoggedIn) {
//         window.location.href = "index.html"; // Replace with owner home page URL
//     } else if (adminLoggedIn) {
//         window.location.href = "index.html"; // Replace with admin home page URL
//     } else {
//         window.location.href = "index.html"; // Replace with login page URL
//     }
// });

// Splash Screen
setTimeout(() => {
    splashScreen.style.display = 'none';
    loginSection.style.display = 'block';
}, 2000);

// Admin Dots Click Event
adminDots.addEventListener("click", () => {
    adminModal.style.display = adminModal.style.display === "block" ? "none" : "block";
    loginSection.style.display = adminModal.style.display === "block" ? "none" : "block";
});

// Close Admin Modal
closeModal.addEventListener("click", () => {
    adminModal.style.display = "none";
    loginSection.style.display = "block";
});

// Admin Login Form Submission
adminLoginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const adminPasswordInput = document.getElementById("adminPassword").value;

    if (adminPasswordInput === adminPassword) {
        sessionStorage.setItem("adminLoggedIn", true);
        adminModal.style.display = "none";
        loginSection.style.display = "none";
        adminSeatManagement.style.display = "block";
        seatSelectionSection.style.display = "block";
        createSeats();
    } else if (adminPasswordInput === ownerPassword) {
        sessionStorage.setItem("ownerLoggedIn", true);
        adminModal.style.display = "none";
        loginSection.style.display = "none";
        ownerDashboard.style.display = "block";
        adminSeatManagement.style.display = "none";
        fetchStudents();
    } else {
        adminNotification.textContent = "Invalid credentials.";
    }
});

// Check Login Status
function checkLoginStatus() {
    const adminLoggedIn = sessionStorage.getItem("adminLoggedIn");
    const ownerLoggedIn = sessionStorage.getItem("ownerLoggedIn");

    if (adminLoggedIn) {
        loginSection.style.display = "none";
        seatSelectionSection.style.display = "block";
        createSeats();
    } else if (ownerLoggedIn) {
        loginSection.style.display = "none";
        ownerDashboard.style.display = "block";
        fetchStudents();
    } else {
        sessionStorage.clear();
    }
}

// Check Login Status on Page Load
setTimeout(() => {
    checkLoginStatus();
}, 2000);

// Student Login Form Submission
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const studentNameValue = studentNameInput.value.trim();
    const libraryIdValue = libraryIdInput.value.trim();

    if (libraryIdValue === "5511") {
        if (studentNameValue) {
            sessionStorage.setItem("studentName", studentNameValue);
            sessionStorage.setItem("libraryId", libraryIdValue);

            loginSection.style.display = "none";
            seatSelectionSection.style.display = "block";
            createSeats();
            notification.textContent = "";
        } else {
            notification.textContent = "Please enter your name and library ID.";
            notification.style.color = "red";
        }
    } else {
        notification.textContent = "Invalid library ID.";
        notification.style.color = "red";
        libraryIdInput.value = "";
    }
});

// Fetch Students
function fetchStudents() {
    studentList.innerHTML = '';
    students.forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = 
            `<td>${student.name}</td>
             <td>${student.id}</td>
             <td>${student.shift}</td>
             <td><button class="${student.feeStatus === 'Due' ? 'fee-due' : 'fee-paid'}" onclick="toggleFeeStatus(this, '${student.id}')">${student.feeStatus}</button></td>
             <td><button onclick="removeStudent('${student.id}')">Delete</button></td>`;
        studentList.appendChild(tr);
    });
}

// Toggle Fee Status
function toggleFeeStatus(button, id) {
    const student = students.find(s => s.id === id);
    if (button.textContent === 'Due') {
        button.textContent = 'Paid';
        button.className = 'fee-paid';
        student.feeStatus = 'Paid';
        student.lastPaid = new Date();
    } else {
        button.textContent = 'Due';
        button.className = 'fee-due';
        student.feeStatus = 'Due';
    }
}

// Reserved Seats
const reservedSeats = [12, 19, 35, 8, 17, 47, 41, 31, 39, 27];
let occupiedSeats = JSON.parse(localStorage.getItem("occupiedSeats")) || [];

// Create Seats
function createSeats() {
    seatsContainer.innerHTML = "";
    for (let i = 1; i <= 200; i++) {
        const seat = document.createElement("div");
        seat.className = `seat ${reservedSeats.includes(i) ? 'reserved' : occupiedSeats.includes(i) ? 'occupied' : 'available'}`;
        seat.dataset.seat = i;
        seat.textContent = `Seat ${i}`;
        seatsContainer.appendChild(seat);
    }
    attachSeatEventListeners();
}

// Attach Seat Event Listeners
function attachSeatEventListeners() {
    const seats = document.querySelectorAll(".seat");
    seats.forEach(seat => {
        seat.addEventListener("click", function () {
            if (sessionStorage.getItem("adminLoggedIn")) {
                const newStatus = prompt("Enter new seat status (available, reserved, occupied):", seat.classList.contains('reserved') ? 'reserved' : seat.classList.contains('occupied') ? 'occupied' : 'available');
                if (["available", "reserved", "occupied"].includes(newStatus)) {
                    seat.classList.remove("available", "reserved", "occupied");
                    seat.classList.add(newStatus);
                    notification.textContent = `Seat ${seat.dataset.seat} updated to ${newStatus}.`;
                    updateOccupiedSeats();
                } else {
                    alert("Invalid status.");
                }
            } else {
                if (seat.classList.contains("available")) {
                    if (!seatSelected) {
                        seat.classList.add("occupied");
                        seatSelected = true;
                        occupiedSeats.push(parseInt(seat.dataset.seat));
                        localStorage.setItem("occupiedSeats", JSON.stringify(occupiedSeats));
                        notification.textContent = `You have selected Seat ${seat.dataset.seat}.`;
                    } else {
                        alert("You have already selected a seat.");
                    }
                } else {
                    alert("This seat is not available.");
                }
            }
        });
    });
}

// Search Seats
function searchSeats(query) {
    const seats = document.querySelectorAll(".seat");
    let found = false;
    const queryNumber = parseInt(query, 10);
    seats.forEach(seat => {
        if (parseInt(seat.dataset.seat) === queryNumber) {
            seat.classList.add("highlight");
            found = true;
            seat.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            seat.classList.remove("highlight");
        }
    });
    if (!found) {
        alert(`No seats found matching number: ${queryNumber}`);
    }
}

searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() !== "") {
        searchSeats(searchInput.value);
    }
});

searchButton.addEventListener("click", () => {
    if (searchInput.value.trim() !== "") {
        searchSeats(searchInput.value);
    }
});
 // add the student functionality 

// Add Student
addStudentButton.addEventListener("click", () => {
    const newStudentName = newStudentNameInput.value.trim();
    const newStudentId = newStudentIdInput.value.trim();
    const newStudentShift = studentShiftInput.value.trim();

    if (newStudentName && newStudentId && newStudentShift) {
        const newStudent = {
            name: newStudentName,
            id: newStudentId,
            shift: newStudentShift,
            feeStatus: "Due", // Default fee status
            lastPaid: null, // For tracking fee due dates
        };

        students.push(newStudent);
        fetchStudents(); // Update the table
        newStudentNameInput.value = "";
        newStudentIdInput.value = "";
        studentShiftInput.value = "";
    } else {
        alert("Please fill all fields to add a student.");
    }
});
// Remove Student ---. like remove the given data  dynamically
function removeStudent(id) {
    students = students.filter(student => student.id !== id);
    fetchStudents();
}
// fee update automatically 
// Automatic Fee Status Update After 28 Days
function updateFeeStatus() {
    const now = new Date();
    students.forEach(student => {
        if (student.feeStatus === "Paid" && student.lastPaid) {
            const daysSincePaid = Math.floor((now - new Date(student.lastPaid)) / (1000 * 60 * 60 * 24));
            if (daysSincePaid >= 28) {
                student.feeStatus = "Due";
            }
        }
    });
    fetchStudents();
}

// Check Fee Status Every Hour
setInterval(updateFeeStatus, 3600000); // Run every 1 hour


// Clear Notification on Input
[studentNameInput, libraryIdInput, newStudentNameInput, newStudentIdInput, studentShiftInput].forEach(input => {
    input.addEventListener("input", () => {
        notification.textContent = "";
        adminNotification.textContent = "";
    });
});
// this can be set as the clear the input data 
document.getElementById('back-btn').addEventListener('click', function() {
    // Check the browsing history length
    if (window.history.length > 1) {
        // Go back one step in the history
        window.history.back();
    } else {
        // If there is no history, handle redirection based on login status
        const adminLoggedIn = sessionStorage.getItem("adminLoggedIn");
        const ownerLoggedIn = sessionStorage.getItem("ownerLoggedIn");

        if (ownerLoggedIn) {
            // Redirect to the owner dashboard
            window.location.href = "index.html"; // Replace with your actual home page for the owner
        } else if (adminLoggedIn) {
            // Redirect to the admin dashboard
            window.location.href = "index.html"; // Replace with your actual home page for the admin
        } else {
            // Redirect to the login page if no one is logged in
            window.location.href = "index.html"; // Replace with your login page path
        }
    }
});
