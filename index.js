// 1. Get DOM elements


//Check login status on page load
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
 
//  bqck button ;(gb2v } ababr )

// 2. Declare global variables
let seatSelected = false; // Track if a seat is selected
let userOccupiedSeat = false; // Track the user's occupied seat
const adminPassword = "admin123"; // Admin password for login
const ownerPassword = "owner1234"; // Owner password for login

// back button logic is being emplemented  owner ands admuin login credential 
// Your back button logic
backBtn.addEventListener('click', function() {
    // Check if the user is logged in and what type of login they have
    const adminLoggedIn = sessionStorage.getItem("adminLoggedIn");
    const ownerLoggedIn = sessionStorage.getItem("ownerLoggedIn");

    // If the owner is logged in, redirect to the owner dashboard
    if (ownerLoggedIn) {
        window.location.href = "l2.html"; // Replace with your actual home page for the owner
    } else if (adminLoggedIn) {
        window.location.href = "l2.html"; // Replace with your actual home page for the admin
    } else {
        // If no one is logged in, redirect to the login page
        window.location.href = "l2.html"; // Replace with your actual login page URL
    } // back button logic and git hun pasyurb  
});

// Global students array to hold student data
let students = [];

// Show splash screen, then hide after 2 seconds
setTimeout(() => {
    splashScreen.style.display = 'none'; // Hide splash screen
    loginSection.style.display = 'block'; // Show login section
}, 2000);

// Admin login modal functionality
adminDots.addEventListener("click", function () {
    adminModal.style.display = " block"; // Show admin login modal
});

closeModal.addEventListener("click", function () {
    adminModal.style.display = "none"; // Close admin login modal
    adminNotification.textContent = ""; // Clear admin notification
});

// Admin login form handling
adminLoginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    const adminPasswordInput = document.getElementById("adminPassword").value;

    // Check for admin or owner login
    if (adminPasswordInput === adminPassword) {
        sessionStorage.setItem("adminLoggedIn", true); // Set admin login status
        adminModal.style.display = "none"; // Hide admin modal
        adminSeatManagement.style.display = "block"; // Show admin seat management
        seatSelectionSection.style.display = "block"; // Show seat selection
        // back button logic
        // admincrfediebgy.org.in 
        

        loginSection.style.display = "none"; // Hide login section
        createSeats(); // Create seat layout
    } else if (adminPasswordInput === ownerPassword) {
        sessionStorage.setItem("ownerLoggedIn", true); // Set owner login status
        loginSection.style.display = "none"; // Hide login section
        ownerDashboard.style.display = "block"; // Show owner dashboard
        adminSeatManagement.style.display = "none"; // Hide admin seat management
        fetchStudents(); // Fetch student data
    } else {
        adminNotification.textContent = "Invalid credentials."; // Show error message
    }

});
 
function heckLoginStatus() {
    const adminLoggedIn = sessionStorage.getItem("adminLoggedIn");
    const ownerLoggedIn = sessionStorage.getItem("ownerLoggedIn");

    // Redirect based on login status
    if (adminLoggedIn) {
        loginSection.style.display = "none"; // Hide login section
        seatSelectionSection.style.display = "block"; // Show seat selection
        createSeats(); // Create seats
    } else if (ownerLoggedIn) {
        loginSection.style.display = "none"; // Hide login section
        ownerDashboard.style.display = "block"; // Show owner dashboard
        fetchStudents(); // Fetch students
    } else {
        sessionStorage.clear(); // Clear session data if not logged in
    }
}

 


// Check login status after splash screen
setTimeout(() => {
    checkLoginStatus(); // Call checkLoginStatus function
}, 2000);

// Student login functionality
loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    const studentNameValue = studentNameInput.value.trim(); // Get student name
    const libraryIdValue = libraryIdInput.value.trim(); // Get library ID

    // Check library ID for login
    if (libraryIdValue === "5511") {
        if (studentNameValue) {
            // Store student details in session storage
            sessionStorage.setItem("studentName", studentNameValue);
            sessionStorage.setItem("libraryId", libraryIdValue);

            loginSection.style.display = "none"; // Hide login section
            seatSelectionSection.style.display = "block"; // Show seat selection
            createSeats(); // Create seats
            notification.textContent = ""; // Clear notification
        } else {
            notification.textContent = "Please enter your name and library ID."; // Show error
            notification.style.color = "red"; // Set error color
        }
    } else {
        notification.textContent = "Invalid library ID."; // Show error
        notification.style.color = "red"; // Set error color
        libraryIdInput.value = ""; // Clear input
    }
}); 

// Fetch and display students in the table
function fetchStudents() {
    studentList.innerHTML = ''; // Clear current student list
    students.forEach(student => {
        const tr = document.createElement('tr'); // Create a new table row
        tr.innerHTML = 
            `<td>${student.name}</td>
             <td>${student.id}</td>
             <td>${student.shift}</td>
             <td><button class="${student.feeStatus === 'Due' ? 'fee-due' : 'fee-paid'}" onclick="toggleFeeStatus(this, '${student.id}')">${student.feeStatus}</button></td>
             <td><button onclick="removeStudent('${student.id}')">Delete</button></td>`; // Set student data
        studentList.appendChild(tr); // Append to student list
    });
}

// Toggle fee status and update color
function toggleFeeStatus(button, id) {
    const student = students.find(s => s.id === id); // Find student by ID
    if (button.textContent === 'Due') {
        button.textContent = 'Paid'; // Change status to paid
        button.className = 'fee-paid'; // Update button class
        student.feeStatus = 'Paid'; // Update student status
        student.lastPaid = new Date(); // Record last paid date
    } else {
        button.textContent = 'Due'; // Change status to due
        button.className = 'fee-due'; // Update button class
        student.feeStatus = 'Due'; // Update student status
    }
}

// Create seats dynamically
const reservedSeats = [12, 19, 35, 8, 17, 47, 41, 31, 39, 27]; // Array of reserved seat numbers
let occupiedSeats = JSON.parse(localStorage.getItem("occupiedSeats")) || []; // Get occupied seats from local storage

function createSeats() {
    seatsContainer.innerHTML = ""; // Clear current seats
    for (let i = 1; i <= 200; i++) {
        const seat = document.createElement("div"); // Create a new seat element
        seat.className = `seat ${reservedSeats.includes(i) ? 'reserved' : occupiedSeats.includes(i) ? 'occupied' : 'available'}`; // Set class based on status
        seat.dataset.seat = i; // Set seat number as data attribute
        seat.textContent = `Seat ${i} (${seat.classList.contains('reserved') ? 'Reserved' : seat.classList.contains('occupied') ? 'Occupied' : 'Available'})`; // Set seat text
        seatsContainer.appendChild(seat); // Append seat to container
    }

    attachSeatEventListeners(); // Attach event listeners to seats
}

// Attach click event listeners to seats
function attachSeatEventListeners() {
    const seats = document.querySelectorAll(".seat"); // Select all seat elements

    seats.forEach(seat => {
        seat.addEventListener("click", function () {
            // Check if admin is logged in
            if (sessionStorage.getItem("adminLoggedIn")) {
                const newStatus = prompt("Enter new seat status (available, reserved, occupied):", seat.classList.contains('reserved') ? 'reserved' : seat.classList.contains('occupied') ? 'occupied' : 'available');
                if (newStatus === "available" || newStatus === "reserved" || newStatus === "occupied") {
                    seat.classList.remove("available", "reserved", "occupied"); // Remove old status classes
                    seat.classList.add(newStatus); // Add new status class
                    notification.textContent = `Seat ${seat.dataset.seat} updated to ${newStatus}.`; // Show notification
                    updateOccupiedSeats(); // Update local storage
                } else {
                    alert("Invalid status. Please enter available, reserved, or occupied."); // Show error
                }
            } else {
                // Regular user flow
                if (seat.classList.contains("available")) {
                    if (!seatSelected) {
                        seat.classList.add("occupied"); // Mark as occupied
                        seatSelected = true; // Update seat selected status
                        occupiedSeats.push(parseInt(seat.dataset.seat)); // Update occupied seats array
                        localStorage.setItem("occupiedSeats", JSON.stringify(occupiedSeats)); // Save to local storage
                        notification.textContent = `You have selected Seat ${seat.dataset.seat}.`; // Show notification
                    } else {
                        alert("You have already selected a seat. Please logout to select a new seat."); // Show alert
                    }
                } else {
                    alert("This seat is not available."); // Show alert for non-available seats
                }
            }
        });
    });
}

// // Remove student from the list
// function removeStudent(id) {
//     students = students.filter(s => s.id !== id); // Remove student from array
//     fetchStudents(); // Refresh student list
// }
function removeStudent(id) {
    const row = [...studentList.getElementsByTagName('tr')].find(row => row.cells[1].textContent === id);
    if (row) row.remove();
}

// Add student functionality
addStudentButton.addEventListener("click", function () {
    const name = newStudentNameInput.value.trim(); // Get new student name
    const id = newStudentIdInput.value.trim(); // Get new student ID
    const shift = studentShiftInput.value; // Get student shift

    // Check if the inputs are valid
    if (name && id && shift) {
        const student = { name, id, shift, feeStatus: 'Due' }; // Create new student object
        students.push(student); // Add to students array
        fetchStudents();          // Refresh students list
        newStudentNameInput.value = ""; // Clear input  data 
        newStudentIdInput.value = ""; // Clear input
        studentShiftInput.value = ""; // Clear input
    } else {
        adminNotification.textContent = "All fields must be filled."; // Show error message
    }
});
// Search functionality  it will manage all case later like you can inser annything related to input data 
const searchBars = document.getElementById("search-bar");
searchBars.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    const rows = studentList.getElementsByTagName("tr");

    for (let row of rows) {
        const [nameCell, idCell, shiftCell] = row.cells;
        const isVisible = [nameCell, idCell, shiftCell].some(cell => cell.textContent.toLowerCase().includes(value));
        row.style.display = isVisible ? "" : "none";
    }
});

// Logout functionality
logoutBtn.addEventListener("click", function () {
    sessionStorage.clear(); // Clear session storage
    loginSection.style.display = "block"; // Show login section
    seatSelectionSection.style.display = "none"; // Hide seat selection
    ownerDashboard.style.display = "none"; // Hide owner dashboard
    adminSeatManagement.style.display = "none"; // Hide admin seat management
    notification.textContent = ""; // Clear notification
});

// Update occupied seats in local storage
function updateOccupiedSeats() {
    localStorage.setItem("occupiedSeats", JSON.stringify(occupiedSeats)); // Save occupied seats to local storage
}
  
         
document.getElementById('back-btn').addEventListener('click', function() {
    // Check if the user is logged in and what type of login they have
    const adminLoggedIn = sessionStorage.getItem("adminLoggedIn");
    const ownerLoggedIn = sessionStorage.getItem("ownerLoggedIn");

    // If the owner is logged in, redirect to the owner dashboard
    if (ownerLoggedIn) {
        window.location.href = "l2.html"; // Replace with your actual home page for the owner
    } else if (adminLoggedIn) {
        window.location.href = " l2.html"; // Replace with your actual home page for the admin
    } else {
        // If no one is logged in, redirect to the login page
        window.location.href = " l2.html"; // Replace with your actual login page URL
    }
});
