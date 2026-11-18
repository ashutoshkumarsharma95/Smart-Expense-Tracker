
const { cloudant, DATABASE_NAME } = require("../config/database");
const { randomUUID } = require("crypto");

// GET ALL TRANSACTIONS
async function getAllTransactions() {
    const response = await cloudant.postAllDocs({
        db: DATABASE_NAME,
        includeDocs: true
    });

    return response.result.rows
        .filter(row => row.doc && !row.doc._id.startsWith("_design/"))
        .map(row => ({
            ...row.doc,
            id: row.doc.id || row.doc._id
        }));
}

// GET TRANSACTION BY ID
async function getTransactionById(id) {
    try {
        const response = await cloudant.getDocument({
            db: DATABASE_NAME,
            docId: id
        });

        return {
            ...response.result,
            id: response.result.id || response.result._id
        };
    } catch (error) {
        if (error.status === 404) {
            return null;
        }
        throw error;
    }
}

// ADD TRANSACTION
async function addTransaction(data) {
    const id = randomUUID();

    const transaction = {
        ...data,
        id: id,
        _id: id
    };

    const response = await cloudant.postDocument({
        db: DATABASE_NAME,
        document: transaction
    });

    return {
        ...transaction,
        _rev: response.result.rev
    };
}

// UPDATE TRANSACTION
async function updateTransaction(id, data) {
    const existingTransaction = await getTransactionById(id);

    if (!existingTransaction) {
        return null;
    }

    const updatedTransaction = {
        ...existingTransaction,
        ...data,
        id: id,
        _id: existingTransaction._id,
        _rev: existingTransaction._rev
    };

    const response = await cloudant.putDocument({
        db: DATABASE_NAME,
        docId: id,
        document: updatedTransaction
    });

    return {
        ...updatedTransaction,
        _rev: response.result.rev
    };
}

// DELETE TRANSACTION
async function deleteTransaction(id) {
    const existingTransaction = await getTransactionById(id);

    if (!existingTransaction) {
        return false;
    }

    await cloudant.deleteDocument({
        db: DATABASE_NAME,
        docId: id,
        rev: existingTransaction._rev
    });

    return true;
}

module.exports = {
    getAllTransactions,
    getTransactionById,
    addTransaction,
    updateTransaction,
    deleteTransaction
};
