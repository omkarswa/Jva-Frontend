const API_URL = "http://localhost:8080/employee";

// Load employees
function loadEmployees() {
  axios.get(`${API_URL}/Listing`)
    .then(res => {
      const tbody = document.querySelector("#empTable tbody");
      tbody.innerHTML = "";

      res.data.forEach(emp => {
        let row = document.createElement("tr");
        row.innerHTML = `
          <td>${emp.id}</td>
          <td>${emp.name}</td>
          <td>${emp.department}</td>
          <td>${emp.salary}</td>    
          <td>
            <button onclick="viewEmployee(${emp.id})">View</button>
            <button onclick="editEmployee(${emp.id}, '${emp.name}', '${emp.department}', ${emp.salary})">Edit</button>
            <button onclick="deleteEmployee(${emp.id})">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => console.error("Error loading employees:", err));
}

// Add or Update employee
document.getElementById("empForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const id = document.getElementById("empId").value;
  const name = document.getElementById("name").value;
  const department = document.getElementById("department").value;
  const salary = document.getElementById("salary").value;

  const empData = { id, name, department, salary };

  if (id) {
    axios.put(`${API_URL}/edit`, empData).then(() => {
      resetForm();
      loadEmployees();
    });
  } else {
    axios.post(`${API_URL}/add`, empData).then(() => {
      resetForm();
      loadEmployees();
    });
  }
});

// Edit employee
function editEmployee(id, name, department, salary) {
  document.getElementById("empId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("department").value = department;
  document.getElementById("salary").value = salary;
  window.location.hash = "#addEmployee"; // jump to form
}

// Delete employee
function deleteEmployee(id) {
  if (confirm("Are you sure you want to delete this employee?")) {
    axios.delete(`${API_URL}/delete/${id}`).then(() => {
      loadEmployees();
    });
  }
}

// View employee
function viewEmployee(id) {
  axios.get(`${API_URL}/get/${id}`).then(res => {
    const emp = res.data;

    if (emp) {
      document.getElementById("detailId").innerText = emp.id;
      document.getElementById("detailName").innerText = emp.name;
      document.getElementById("detailDept").innerText = emp.department;
      document.getElementById("detailSalary").innerText = emp.salary;

      document.getElementById("empTable").style.display = "none";
      document.getElementById("empDetails").style.display = "block";
    }
  });
}

// Back button
function backToListing() {
  document.getElementById("empDetails").style.display = "none";
  document.getElementById("empTable").style.display = "table";
}

// Reset form
function resetForm() {
  document.getElementById("empId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("department").value = "";
  document.getElementById("salary").value = "";
}

// Initial load
loadEmployees();
