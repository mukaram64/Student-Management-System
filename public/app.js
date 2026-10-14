const API_URL = "/api/students";

const tableBody = document.getElementById("studentTableBody");
const totalStudents = document.getElementById("totalStudents");
const totalCourses = document.getElementById("totalCourses");
const systemStatus = document.getElementById("systemStatus");
const recordCount = document.getElementById("recordCount");
const searchInput = document.getElementById("searchInput");
const notice = document.getElementById("notice");
const dialog = document.getElementById("studentDialog");
const form = document.getElementById("studentForm");
const studentIdInput = document.getElementById("studentId");
const dialogTitle = document.getElementById("dialogTitle");
const saveButton = document.getElementById("saveStudent");

let searchTimer;

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

function showNotice(message, type = "success") {
  notice.textContent = message;
  notice.className = `notice ${type}`;
  notice.hidden = false;
  window.clearTimeout(showNotice.timer);
  showNotice.timer = window.setTimeout(() => { notice.hidden = true; }, 4500);
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Request failed. Please try again.");
  return payload;
}

async function checkHealth() {
  try {
    const health = await apiRequest("/api/health");
    systemStatus.textContent = health.database === "connected" ? "Connected" : "Offline";
    systemStatus.style.color = health.database === "connected" ? "#1b9a6a" : "#d44747";
  } catch {
    systemStatus.textContent = "Offline";
    systemStatus.style.color = "#d44747";
  }
}

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0] || "").join("").toUpperCase();
}

function renderStudents(students) {
  totalStudents.textContent = students.length;
  totalCourses.textContent = new Set(students.map(s => s.course.trim().toLowerCase())).size;
  recordCount.textContent = `${students.length} record${students.length === 1 ? "" : "s"} found`;

  if (!students.length) {
    tableBody.innerHTML = `<tr><td colspan="5" class="empty-cell">No students found. Select “Add Student” to create your first record.</td></tr>`;
    return;
  }

  tableBody.innerHTML = students.map(student => `
    <tr>
      <td><div class="student-cell"><span class="avatar">${escapeHtml(initials(student.name))}</span><span>${escapeHtml(student.name)}</span></div></td>
      <td><span class="roll-pill">${escapeHtml(student.rollNumber)}</span></td>
      <td>${escapeHtml(student.email)}</td>
      <td>${escapeHtml(student.course)}</td>
      <td><div class="actions">
        <button class="action-button" type="button" data-action="edit" data-id="${escapeHtml(student._id)}">Edit</button>
        <button class="action-button delete" type="button" data-action="delete" data-id="${escapeHtml(student._id)}">Delete</button>
      </div></td>
    </tr>
  `).join("");
}

async function loadStudents(search = "") {
  tableBody.innerHTML = `<tr><td colspan="5" class="empty-cell">Loading student records…</td></tr>`;
  try {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const students = await apiRequest(`${API_URL}${query}`);
    renderStudents(students);
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="5" class="empty-cell">Could not load records. Check that the server and MongoDB are running.</td></tr>`;
    totalStudents.textContent = "—";
    totalCourses.textContent = "—";
    showNotice(error.message, "error");
  }
}

function openAddDialog() {
  form.reset();
  studentIdInput.value = "";
  dialogTitle.textContent = "Add Student";
  saveButton.textContent = "Save Student";
  dialog.showModal();
  document.getElementById("name").focus();
}

async function openEditDialog(id) {
  try {
    const student = await apiRequest(`${API_URL}/${encodeURIComponent(id)}`);
    studentIdInput.value = student._id;
    document.getElementById("name").value = student.name;
    document.getElementById("rollNumber").value = student.rollNumber;
    document.getElementById("email").value = student.email;
    document.getElementById("course").value = student.course;
    dialogTitle.textContent = "Update Student";
    saveButton.textContent = "Save Changes";
    dialog.showModal();
  } catch (error) {
    showNotice(error.message, "error");
  }
}

document.getElementById("addStudentTop").addEventListener("click", openAddDialog);
document.getElementById("closeDialog").addEventListener("click", () => dialog.close());
document.getElementById("cancelDialog").addEventListener("click", () => dialog.close());

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const id = studentIdInput.value;
  const student = {
    name: document.getElementById("name").value.trim(),
    rollNumber: document.getElementById("rollNumber").value.trim(),
    email: document.getElementById("email").value.trim(),
    course: document.getElementById("course").value.trim()
  };

  if (Object.values(student).some(value => !value)) {
    showNotice("Please fill in every field.", "error");
    return;
  }

  saveButton.disabled = true;
  saveButton.textContent = "Saving…";
  try {
    await apiRequest(id ? `${API_URL}/${encodeURIComponent(id)}` : API_URL, {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(student)
    });
    dialog.close();
    form.reset();
    studentIdInput.value = "";
    showNotice(id ? "Student record updated successfully." : "Student added successfully.");
    await loadStudents(searchInput.value.trim());
    await checkHealth();
  } catch (error) {
    showNotice(error.message, "error");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = studentIdInput.value ? "Save Changes" : "Save Student";
  }
});

tableBody.addEventListener("click", async event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;

  if (action === "edit") {
    await openEditDialog(id);
    return;
  }

  if (action === "delete") {
    const confirmed = window.confirm("Delete this student record? This action cannot be undone.");
    if (!confirmed) return;
    try {
      await apiRequest(`${API_URL}/${encodeURIComponent(id)}`, { method: "DELETE" });
      showNotice("Student deleted successfully.");
      await loadStudents(searchInput.value.trim());
    } catch (error) {
      showNotice(error.message, "error");
    }
  }
});

searchInput.addEventListener("input", () => {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => loadStudents(searchInput.value.trim()), 250);
});

checkHealth();
loadStudents();
