
const API_URL = "http://localhost:5000/api/transactions";

// Get all transactions
async function getTransactions() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch transactions");
    }

    return await response.json();
}

// Add a transaction
async function addTransaction(data) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to add transaction");
    }

    return await response.json();
}

// Update a transaction
async function updateTransactionAPI(id, data) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to update transaction");
    }

    return await response.json();
}

// Delete a transaction
async function deleteTransactionAPI(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete transaction");
    }

    return await response.json();
}
