
const express = require("express");

const router = express.Router();

const transactionController =
    require("../controllers/transactionController");

// GET all transactions
router.get("/", transactionController.getTransactions);

// GET one transaction
router.get("/:id", transactionController.getTransaction);

// POST transaction
router.post("/", transactionController.createTransaction);

// PUT transaction
router.put("/:id", transactionController.updateTransaction);

// DELETE transaction
router.delete("/:id", transactionController.removeTransaction);

module.exports = router;
