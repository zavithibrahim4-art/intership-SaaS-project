let customers = [
  {
    id: "CUS-01",
    name: "James Smith",
    email: "james@example.com",
    company: "TechCorp",
    status: "Active",
  },
  {
    id: "CUS-02",
    name: "Mary Johnson",
    email: "mary@example.com",
    company: "Innovate LLC",
    status: "Inactive",
  },
  {
    id: "CUS-03",
    name: "John Williams",
    email: "john@example.com",
    company: "Global Solutions",
    status: "Active",
  },
  {
    id: "CUS-04",
    name: "Patricia Brown",
    email: "patricia@example.com",
    company: "Alpha Systems",
    status: "Active",
  },
  {
    id: "CUS-05",
    name: "Robert Jones",
    email: "robert@example.com",
    company: "Beta Inc",
    status: "Inactive",
  },
  {
    id: "CUS-06",
    name: "Jennifer Garcia",
    email: "jennifer@example.com",
    company: "Omega Group",
    status: "Active",
  },
  {
    id: "CUS-07",
    name: "Michael Miller",
    email: "michael@example.com",
    company: "NextGen",
    status: "Active",
  },
  {
    id: "CUS-08",
    name: "Linda Davis",
    email: "linda@example.com",
    company: "CloudSync",
    status: "Inactive",
  },
  {
    id: "CUS-09",
    name: "William Rodriguez",
    email: "william@example.com",
    company: "DataWorks",
    status: "Active",
  },
  {
    id: "CUS-10",
    name: "Elizabeth Martinez",
    email: "elizabeth@example.com",
    company: "Peak Performance",
    status: "Active",
  },
];

let orders = [
  {
    id: "ORD-01",
    customer: "James Smith",
    date: "2023-10-01",
    amount: "150.00",
    status: "Completed",
  },
  {
    id: "ORD-02",
    customer: "Mary Johnson",
    date: "2023-10-02",
    amount: "200.50",
    status: "Pending",
  },
  {
    id: "ORD-03",
    customer: "John Williams",
    date: "2023-10-03",
    amount: "99.99",
    status: "Processing",
  },
  {
    id: "ORD-04",
    customer: "Patricia Brown",
    date: "2023-10-04",
    amount: "450.00",
    status: "Completed",
  },
  {
    id: "ORD-05",
    customer: "Robert Jones",
    date: "2023-10-05",
    amount: "120.00",
    status: "Cancelled",
  },
  {
    id: "ORD-06",
    customer: "Jennifer Garcia",
    date: "2023-10-06",
    amount: "310.25",
    status: "Processing",
  },
  {
    id: "ORD-07",
    customer: "Michael Miller",
    date: "2023-10-07",
    amount: "85.00",
    status: "Pending",
  },
  {
    id: "ORD-08",
    customer: "Linda Davis",
    date: "2023-10-08",
    amount: "500.00",
    status: "Completed",
  },
  {
    id: "ORD-09",
    customer: "William Rodriguez",
    date: "2023-10-09",
    amount: "75.50",
    status: "Completed",
  },
  {
    id: "ORD-10",
    customer: "Elizabeth Martinez",
    date: "2023-10-10",
    amount: "1050.00",
    status: "Processing",
  },
];

// 2. GLOBAL VARIABLES
let currentUser = {
  name: "Admin User",
  email: "admin@example.com",
  company: "CloudCRM Inc",
};
let revenueChartInstance = null;
let statusChartInstance = null;

// 3. INITIALIZATION
window.onload = function () {
  // Check if user is already logged in
  if (localStorage.getItem("crm_auth") === "true") {
    showApp();
  } else {
    showLogin();
  }
  bindEvents();
};

// 4. NAVIGATION & AUTHENTICATION
function showLogin() {
  document.getElementById("login-view").classList.remove("hidden");
  document.getElementById("app-layout").classList.add("hidden");
}

function showApp() {
  document.getElementById("login-view").classList.add("hidden");
  document.getElementById("app-layout").classList.remove("hidden");
  navigate("dashboard");
}

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  emailError.classList.add("hidden");
  passwordError.classList.add("hidden");

  let valid = true;

  // Email validation
  if (email === "") {
    emailError.textContent = "Email is required.";
    emailError.classList.remove("hidden");
    valid = false;
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      emailError.textContent = "Enter a valid email.";
      emailError.classList.remove("hidden");
      valid = false;
    }
  }

  // Password validation
  if (password.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters.";
    passwordError.classList.remove("hidden");
    valid = false;
  }

  if (!valid) {
    return;
  }

  localStorage.setItem("crm_auth", "true");
  showToast("Login successful!");
  showApp();
}

function logout() {
  localStorage.removeItem("crm_auth");
  showLogin();
}

function navigate(viewName) {
  // Hide all pages first
  document.getElementById("view-dashboard").classList.add("hidden");
  document.getElementById("view-customers").classList.add("hidden");
  document.getElementById("view-orders").classList.add("hidden");
  document.getElementById("view-settings").classList.add("hidden");

  // Remove active class from all sidebar links
  let links = document.querySelectorAll(".sidebar-menu li");
  for (let i = 0; i < links.length; i++) {
    links[i].classList.remove("active");
  }

  // Show selected page and highlight the correct sidebar link
  document.getElementById("view-" + viewName).classList.remove("hidden");
  document.getElementById("nav-" + viewName).classList.add("active");

  // Run specific code for the page we just opened
  if (viewName === "dashboard") renderDashboard();
  if (viewName === "customers") renderCustomers();
  if (viewName === "orders") renderOrders();
  if (viewName === "settings") renderSettings();
}

// 5. DASHBOARD FUNCTIONS
function renderDashboard() {
  // Calculate totals using simple math
  let totalRevenue = 0;
  let activeCustomers = 0;

  for (let i = 0; i < orders.length; i++) {
    if (orders[i].status !== "Cancelled") {
      totalRevenue += parseFloat(orders[i].amount);
    }
  }

  for (let i = 0; i < customers.length; i++) {
    if (customers[i].status === "Active") {
      activeCustomers++;
    }
  }

  // Update HTML text
  document.getElementById("kpi-revenue").textContent =
    "$" + totalRevenue.toFixed(2);
  document.getElementById("kpi-customers").textContent = activeCustomers;
  document.getElementById("kpi-orders").textContent = orders.length;

  renderCharts();
}

function renderCharts() {
  // Destroy old charts
  if (revenueChartInstance) revenueChartInstance.destroy();
  if (statusChartInstance) statusChartInstance.destroy();

  // Setup Line Chart
  const ctxRev = document.getElementById("revenueChart").getContext("2d");
  revenueChartInstance = new Chart(ctxRev, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Revenue",
          data: [1200, 1900, 1500, 2200, 1800, 2800, 2400],
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.1)",
          fill: true,
        },
      ],
    },
  });

  // Count order  for Chart
  let counts = { Pending: 0, Processing: 0, Completed: 0, Cancelled: 0 };
  for (let i = 0; i < orders.length; i++) {
    let status = orders[i].status;
    counts[status] = counts[status] + 1;
  }

  const ctxStat = document.getElementById("statusChart").getContext("2d");
  statusChartInstance = new Chart(ctxStat, {
    type: "doughnut",
    data: {
      labels: ["Pending", "Processing", "Completed", "Cancelled"],
      datasets: [
        {
          data: [
            counts.Pending,
            counts.Processing,
            counts.Completed,
            counts.Cancelled,
          ],
          backgroundColor: ["#f57c00", "#1976d2", "#388e3c", "#d32f2f"],
        },
      ],
    },
  });
}

// 6. CUSTOMERS FUNCTIONS
function renderCustomers() {
  let tbody = document.getElementById("customers-body");
  tbody.innerHTML = ""; // Clear existing rows

  let searchValue = document
    .getElementById("search-customers")
    .value.toLowerCase();
  let filterValue = document.getElementById("filter-customer-status").value;

  // Loop through all 10 customers
  for (let i = 0; i < customers.length; i++) {
    let c = customers[i];

    // Check if it matches search and filter
    let matchesSearch =
      c.name.toLowerCase().includes(searchValue) ||
      c.email.toLowerCase().includes(searchValue);
    let matchesFilter = filterValue === "All" || c.status === filterValue;

    // If it matches, add it to the HTML table
    if (matchesSearch && matchesFilter) {
      let badgeClass = "badge badge-" + c.status.toLowerCase();
      tbody.innerHTML += `
                        <tr>
                            <td>${c.id}</td>
                            <td>${c.name}</td>
                            <td>${c.email}</td>
                            <td>${c.company}</td>
                            <td><span class="${badgeClass}">${c.status}</span></td>
                            <td><button class="btn btn-outline" onclick="viewCustomer('${c.id}')">View</button></td>
                        </tr>
                    `;
    }
  }
}

// 7. ORDERS FUNCTIONS
function renderOrders() {
  let tbody = document.getElementById("orders-body");
  tbody.innerHTML = "";

  let searchValue = document
    .getElementById("search-orders")
    .value.toLowerCase();
  let filterValue = document.getElementById("filter-order-status").value;

  for (let i = 0; i < orders.length; i++) {
    let o = orders[i];

    let matchesSearch =
      o.id.toLowerCase().includes(searchValue) ||
      o.customer.toLowerCase().includes(searchValue);
    let matchesFilter = filterValue === "All" || o.status === filterValue;

    if (matchesSearch && matchesFilter) {
      let badgeClass = "badge badge-" + o.status.toLowerCase();
      tbody.innerHTML += `
                        <tr>
                            <td><strong>${o.id}</strong></td>
                            <td>${o.customer}</td>
                            <td>${o.date}</td>
                            <td>$${parseFloat(o.amount).toFixed(2)}</td>
                            <td><span class="${badgeClass}">${o.status}</span></td>
                            <td>
                                <button class="btn btn-danger" onclick="deleteOrder('${o.id}')">Delete</button>
                            </td>
                        </tr>
                    `;
    }
  }
}

function deleteOrder(id) {
  // Ask user for confirmation
  if (confirm("Are you sure you want to delete order " + id + "?")) {
    // Keep all orders EXCEPT the one with this ID
    orders = orders.filter(function (order) {
      return order.id !== id;
    });
    showToast("Order " + id + " deleted!");
    renderOrders(); // redraw the table so the order disappears
  }
}

// 8. SETTINGS FUNCTIONS
function renderSettings() {
  document.getElementById("set-name").value = currentUser.name;
  document.getElementById("set-email").value = currentUser.email;
  document.getElementById("set-company").value = currentUser.company;
}

function saveSettings(event) {
  event.preventDefault();

  // Save new values
  currentUser.name = document.getElementById("set-name").value;
  currentUser.email = document.getElementById("set-email").value;
  currentUser.company = document.getElementById("set-company").value;

  // Handle Dark mode toggle
  let isDark = document.getElementById("theme-toggle").checked;
  if (isDark) {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }

  // Update name in top right corner
  document.getElementById("user-name-display").textContent = currentUser.name;
  showToast("Settings saved successfully!");
}

// 9. UTILITY FUNCTIONS
function showToast(message) {
  let container = document.getElementById("toast-container");

  // Create a new div element for the popup message
  let toast = document.createElement("div");
  toast.className = "toast success";
  toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;

  container.appendChild(toast);

  // Remove the popup automatically after 3 seconds
  setTimeout(function () {
    toast.remove();
  }, 3000);
}

function viewCustomer(id) {
  const customer = customers.find(function (c) {
    return c.id === id;
  });

  document.getElementById("modal-id").textContent = customer.id;
  document.getElementById("modal-name").textContent = customer.name;
  document.getElementById("modal-email").textContent = customer.email;
  document.getElementById("modal-company").textContent = customer.company;
  document.getElementById("modal-status").textContent = customer.status;

  document.getElementById("customer-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("customer-modal").classList.add("hidden");
}
function bindEvents() {
  // Login Form
  document.getElementById("login-form").addEventListener("submit", handleLogin);

  // Show/Hide Password
  document
    .getElementById("toggle-password")
    .addEventListener("click", function () {
      let input = document.getElementById("password");
      if (input.type === "password") {
        input.type = "text";
      } else {
        input.type = "password";
      }
    });

  //toast function

  // Search and Filter Events - Run render function whenever user types or selects
  document
    .getElementById("search-customers")
    .addEventListener("input", renderCustomers);
  document
    .getElementById("filter-customer-status")
    .addEventListener("change", renderCustomers);

  document
    .getElementById("search-orders")
    .addEventListener("input", renderOrders);
  document
    .getElementById("filter-order-status")
    .addEventListener("change", renderOrders);

  // Settings Form
  document
    .getElementById("settings-form")
    .addEventListener("submit", saveSettings);

  // Sidebar Mobile Toggle
  document
    .getElementById("open-sidebar")
    .addEventListener("click", function () {
      document.getElementById("sidebar").classList.add("show");
    });
  document
    .getElementById("close-sidebar")
    .addEventListener("click", function () {
      document.getElementById("sidebar").classList.remove("show");
    });
}
