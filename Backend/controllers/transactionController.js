
const transactionService = require("../services/transactionService");

// Validate transaction data
function validateTransaction(data) {
    if (!data.title || !data.title.trim()) {
        return "Title is required.";
    }

    if (!Number.isFinite(Number(data.amount)) || Number(data.amount) <= 0) {
        return "Amount must be a positive number.";
    }

    if (!["income", "expense"].includes(data.type)) {
        return "Type must be income or expense.";
    }

    if (!data.category) {
        return "Category is required.";
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
        return "A valid date is required (YYYY-MM-DD).";
    }

    return null;
}

// GET ALL TRANSACTIONS
async function getTransactions(req, res) {
    try {
        const transactions = await transactionService.getAllTransactions();
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Get transactions error:", error.message);
        res.status(500).json({ message: "Unable to fetch transactions." });
    }
}

// GET TRANSACTION BY ID
async function getTransaction(req, res) {
    try {
        const transaction = await transactionService.getTransactionById(
            req.params.id
        );

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found."
            });
        }

        res.status(200).json(transaction);
    } catch (error) {
        console.error("Get transaction error:", error.message);
        res.status(500).json({ message: "Unable to fetch transaction." });
    }
}

// CREATE TRANSACTION
async function createTransaction(req, res) {
    try {
        const data = {
            title: String(req.body.title || "").trim(),
            amount: Number(req.body.amount),
            type: req.body.type,
            category: req.body.category,
            date: req.body.date,
            notes: req.body.notes || "",
            userId: "demo_user"
        };

        const validationError = validateTransaction(data);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const transaction = await transactionService.addTransaction(data);

        res.status(201).json(transaction);
    } catch (error) {
        console.error("Create transaction error:", error.message);
        res.status(500).json({ message: "Unable to create transaction." });
    }
}

// UPDATE TRANSACTION
async function updateTransaction(req, res) {
    try {
        const data = {
            title: String(req.body.title || "").trim(),
            amount: Number(req.body.amount),
            type: req.body.type,
            category: req.body.category,
            date: req.body.date,
            notes: req.body.notes || ""
        };

        const validationError = validateTransaction(data);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const transaction = await transactionService.updateTransaction(
            req.params.id,
            data
        );

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found."
            });
        }

        res.status(200).json(transaction);
    } catch (error) {
        console.error("Update transaction error:", error.message);
        res.status(500).json({ message: "Unable to update transaction." });
    }
}

// DELETE TRANSACTION
async function removeTransaction(req, res) {
    try {
        const deleted = await transactionService.deleteTransaction(
            req.params.id
        );

        if (!deleted) {
            return res.status(404).json({
                message: "Transaction not found."
            });
        }

        res.status(200).json({
            message: "Transaction deleted successfully."
        });
    } catch (error) {
        console.error("Delete transaction error:", error.message);
        res.status(500).json({ message: "Unable to delete transaction." });
    }
}

module.exports = {
    getTransactions,
    getTransaction,
    createTransaction,
    updateTransaction,
    removeTransaction
};
