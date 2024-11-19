const userForm = document.getElementById("userForm");
const formHeader = document.getElementById("formHeader");
const cancelEditButton = document.getElementById("cancelEdit");

let isEditMode = false;
let editUserId = null;

// Handle form submission
userForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    age: parseInt(document.getElementById("age").value),
    weight: parseFloat(document.getElementById("weight").value),
    height: parseFloat(document.getElementById("height").value),
    healthGoals: document.getElementById("healthGoals").value,
  };

  if (isEditMode) {
    // Update user
    await fetch(`http://localhost:3000/users/${editUserId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    isEditMode = false;
    editUserId = null;
  } else {
    // Create user
    await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
  }

  resetForm();
  loadUsers();
});

// Handle cancel edit
cancelEditButton.addEventListener("click", () => {
  isEditMode = false;
  editUserId = null;
  resetForm();
});

// Reset the form to "Add User" mode
function resetForm() {
  userForm.reset();
  formHeader.innerHTML = "<h4>Add User</h4>";
  userForm.classList.remove("edit-mode");
  cancelEditButton.classList.add("d-none");
}

// Load users into the table
async function loadUsers() {
  const response = await fetch("http://localhost:3000/users");
  const users = await response.json();
  const userTableBody = document.getElementById("userTableBody");
  console.log(users);
  userTableBody.innerHTML = users
    .map(
      (user) => `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.age}</td>
          <td>${user.weight}</td>
          <td>${user.height}</td>
          <td>${user.healthGoals}</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="editUser('${user.id}', '${user.name}', '${user.email}', ${user.age}, ${user.weight}, ${user.height}, '${user.healthGoals}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">Delete</button>
          </td>
        </tr>`
    )
    .join("");
}

// Edit user
function editUser(id, name, email, age, weight, height, healthGoals) {
  isEditMode = true;
  editUserId = id;

  document.getElementById("name").value = name;
  document.getElementById("email").value = email;
  document.getElementById("age").value = age;
  document.getElementById("weight").value = weight;
  document.getElementById("height").value = height;
  document.getElementById("healthGoals").value = healthGoals;

  formHeader.innerHTML = "<h4>Edit User</h4>";
  userForm.classList.add("edit-mode");
  cancelEditButton.classList.remove("d-none");
}

// Delete user
async function deleteUser(id) {
  await fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" });
  loadUsers();
}

// Initial load
loadUsers();
