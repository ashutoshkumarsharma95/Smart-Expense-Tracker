
// =====================================
// 1. GLOBAL VARIABLES
// =====================================

let transactions = [];
let editingId = null;
let currencySymbol = localStorage.getItem("currency") || "₹";

let selectedMonth = "";

let monthlyChart = null;
let categoryChart = null;


const form = document.getElementById("transactionForm");


// =====================================
// 2. NAVIGATION
// =====================================

const navLinks = document.querySelectorAll(".nav-link");

function showPage(pageName) {

    document.querySelectorAll(".page-section").forEach(function(page) {
        page.hidden = true;
    });

    const selectedPage = document.getElementById(pageName + "Page");

    if (selectedPage) {
        selectedPage.hidden = false;
    }

    navLinks.forEach(function(link) {
        link.classList.remove("active");

        if (link.dataset.page === pageName) {
            link.classList.add("active");
        }
    });
}

navLinks.forEach(function(link) {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        showPage(link.dataset.page);
    });
});


// =====================================
// 3. LOAD TRANSACTIONS FROM BACKEND
// =====================================

async function loadTransactions() {

    try {
        transactions = await getTransactions();
        updateDashboard();

    } catch (error) {
        console.error("Error loading transactions:", error);
        alert("Unable to load transactions from backend.");
    }
}


// =====================================
// 4. ADD AND UPDATE TRANSACTIONS
// =====================================

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const data = {
        title: document.getElementById("title").value.trim(),
        amount: Number(document.getElementById("amount").value),
        type: document.getElementById("type").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value
    };

    if (!data.title || !Number.isFinite(data.amount) || data.amount <= 0) {
        alert("Please enter valid transaction details.");
        return;
    }

    try {

        if (editingId !== null) {

            await updateTransactionAPI(editingId, data);
            alert("Transaction updated successfully!");

        } else {

            await addTransaction(data);
            alert("Transaction added successfully!");

        }

        editingId = null;
        form.reset();

        document.querySelector("#transactionForm button[type='submit']")
            .textContent = "Add Transaction";

        await loadTransactions();

    } catch (error) {

        console.error("Error saving transaction:", error);
        alert("Unable to save transaction.");

    }

});


// =====================================
// 5. UPDATE DASHBOARD
// =====================================


function updateDashboard() {
    // Filter transactions by selected month
    const filteredTransactions = selectedMonth
        ? transactions.filter(function(transaction) {
            return String(transaction.date).slice(0, 7) === selectedMonth;
        })
        : [...transactions];

    let totalIncome = 0;
    let totalExpense = 0;

    filteredTransactions.forEach(function(transaction) {
        if (transaction.type === "income") {
            totalIncome += Number(transaction.amount);
        } else {
            totalExpense += Number(transaction.amount);
        }
    });

    const balance = totalIncome - totalExpense;

    document.getElementById("totalIncome").textContent =
        currencySymbol + totalIncome.toFixed(2);

    document.getElementById("totalExpense").textContent =
        currencySymbol + totalExpense.toFixed(2);

    document.getElementById("totalBalance").textContent =
        currencySymbol + balance.toFixed(2);

    displayTransactions(filteredTransactions);
    updateCharts(filteredTransactions);
}



// =====================================
// CHARTS
// =====================================

function updateCharts(filteredTransactions) {

    if (typeof Chart === "undefined") {
        console.error("Chart.js is not loaded.");
        return;
    }

    // 1. MONTHLY INCOME VS EXPENSES

    const monthlyData = {};

    filteredTransactions.forEach(function(transaction) {

        const month = String(transaction.date).slice(0, 7);

        if (!/^\d{4}-\d{2}$/.test(month)) return;

        if (!monthlyData[month]) {
            monthlyData[month] = {
                income: 0,
                expense: 0
            };
        }

        if (transaction.type === "income") {
            monthlyData[month].income += Number(transaction.amount);
        } else {
            monthlyData[month].expense += Number(transaction.amount);
        }
    });

    const sortedMonths = Object.keys(monthlyData).sort();

    const monthLabels = sortedMonths.map(function(month) {
        const parts = month.split("-");
        return new Date(
            Number(parts[0]),
            Number(parts[1]) - 1
        ).toLocaleString("en-IN", {
            month: "short",
            year: "numeric"
        });
    });

    const incomeValues = sortedMonths.map(
        month => monthlyData[month].income
    );

    const expenseValues = sortedMonths.map(
        month => monthlyData[month].expense
    );

    if (monthlyChart === null) {

        monthlyChart = new Chart(
            document.getElementById("monthlyChart"),
            {
                type: "bar",

                data: {
                    labels: monthLabels,

                   
                    
                    
datasets: [
    {
        label: "Income",
        data: incomeValues,
        backgroundColor: "#22c55e",
        borderRadius: 6,
        barPercentage: 0.55,
        categoryPercentage: 0.65
    },
    {
        label: "Expenses",
        data: expenseValues,
        backgroundColor: "#ef4444",
        borderRadius: 6,
        barPercentage: 0.55,
        categoryPercentage: 0.65
    }
]



                },

                options: {
                    responsive: true,

                    scales: {
                          x: {
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }
        );

    } else {

        monthlyChart.data.labels = monthLabels;
        monthlyChart.data.datasets[0].data = incomeValues;
        monthlyChart.data.datasets[1].data = expenseValues;

        monthlyChart.update();
    }


    // 2. EXPENSE BY CATEGORY

    const categoryData = {};

    filteredTransactions.forEach(function(transaction) {

        if (transaction.type === "expense") {

            const category = transaction.category;

            if (!categoryData[category]) {
                categoryData[category] = 0;
            }

            categoryData[category] += Number(transaction.amount);
        }
    });

    const categoryLabels = Object.keys(categoryData);
    const categoryValues = Object.values(categoryData);

    document.getElementById("categoryChartMessage").textContent =
        categoryLabels.length === 0
            ? "No expense data available yet."
            : "";

    const categoryColors = [
        "#4f46e5",
        "#06b6d4",
        "#f59e0b",
        "#ef4444",
        "#22c55e",
        "#a855f7",
        "#ec4899"
    ];

    if (categoryChart === null) {

        categoryChart = new Chart(
            document.getElementById("categoryChart"),
            {
                type: "doughnut",

                data: {
                    labels: categoryLabels,

                    datasets: [
                        {
                            data: categoryValues,
                            backgroundColor: categoryColors
                        }
                    ]
                },

                options: {
                    responsive: true,

                    plugins: {
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            }
        );

    } else {

        categoryChart.data.labels = categoryLabels;
        categoryChart.data.datasets[0].data = categoryValues;

        categoryChart.update();
    }
}



// =====================================
// 6. DISPLAY TRANSACTIONS
// =====================================

function renderTransactionTable(tableId, transactionData) {

    const transactionList = document.getElementById(tableId);

    transactionList.innerHTML = "";

    if (transactionData.length === 0) {

        transactionList.innerHTML =
            '<tr><td colspan="5">No transactions yet.</td></tr>';

        return;
    }

    transactionData.forEach(function(transaction) {

        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = transaction.title;

        const categoryCell = document.createElement("td");
        categoryCell.textContent = transaction.category;

        const dateCell = document.createElement("td");
        dateCell.textContent = transaction.date;

        const amountCell = document.createElement("td");

        amountCell.textContent =
            (transaction.type === "income" ? "+" : "-") +
            currencySymbol +
            Number(transaction.amount).toFixed(2);

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function() {
            editTransaction(transaction.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteTransaction(transaction.id);
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(titleCell);
        row.appendChild(categoryCell);
        row.appendChild(dateCell);
        row.appendChild(amountCell);
        row.appendChild(actionCell);

        transactionList.appendChild(row);

    });
}



function displayTransactions(filteredTransactions) {
    // Show latest 5 filtered transactions on Dashboard
    const recentTransactions = [...filteredTransactions]
        .reverse()
        .slice(0, 5);

    renderTransactionTable("transactionList", recentTransactions);

    // Show all filtered transactions on Transactions page
    const allTransactions = [...filteredTransactions].reverse();

    renderTransactionTable("allTransactionList", allTransactions);
}



// =====================================
// 7. EDIT TRANSACTION
// =====================================

function editTransaction(id) {

    const transaction = transactions.find(function(item) {
        return String(item.id) === String(id);
    });

    if (!transaction) return;

    editingId = transaction.id;

    document.getElementById("title").value = transaction.title;
    document.getElementById("amount").value = transaction.amount;
    document.getElementById("type").value = transaction.type;
    document.getElementById("category").value = transaction.category;
    document.getElementById("date").value = transaction.date;

    document.querySelector("#transactionForm button[type='submit']")
        .textContent = "Update Transaction";

    // Open Dashboard because the form is there
    showPage("dashboard");

    document.getElementById("title").focus();
}


// =====================================
// 8. DELETE TRANSACTION
// =====================================

async function deleteTransaction(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    try {

        await deleteTransactionAPI(id);

        if (String(editingId) === String(id)) {

            editingId = null;
            form.reset();

            document.querySelector("#transactionForm button[type='submit']")
                .textContent = "Add Transaction";
        }

        await loadTransactions();

        alert("Transaction deleted successfully!");

    } catch (error) {

        console.error("Error deleting transaction:", error);
        alert("Unable to delete transaction.");

    }
}


// =====================================
// 9. SETTINGS - CURRENCY
// =====================================

document.getElementById("saveSettings").addEventListener("click", function() {

    currencySymbol = document.getElementById("currency").value;

    const selectedTheme = document.getElementById("theme").value;

    localStorage.setItem("currency", currencySymbol);
    localStorage.setItem("theme", selectedTheme);

    applyTheme(selectedTheme);

    updateDashboard();

    document.getElementById("settingsMessage").textContent =
        "Settings saved successfully!";

});


// =====================================
// 10. APPLY THEME
// =====================================

function applyTheme(theme) {

    if (theme === "dark") {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }
}

// Monthly Filter

document.getElementById("monthFilter").addEventListener("change", function() {
    selectedMonth = this.value;
    updateDashboard();
});

document.getElementById("clearFilter").addEventListener("click", function() {
    selectedMonth = "";
    document.getElementById("monthFilter").value = "";
    updateDashboard();
});


// Load saved settings
function loadSettings() {

    const savedCurrency = localStorage.getItem("currency") || "₹";
    const savedTheme = localStorage.getItem("theme") || "light";

    currencySymbol = savedCurrency;

    document.getElementById("currency").value = savedCurrency;
    document.getElementById("theme").value = savedTheme;

    applyTheme(savedTheme);
}


// =====================================
// 11. START APPLICATION
// =====================================

loadSettings();
loadTransactions();
