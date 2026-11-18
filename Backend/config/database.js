
const cloudant = require("./cloudant");

const DATABASE_NAME = "expense_tracker";

async function createDatabase() {
    try {
        const response = await cloudant.putDatabase({
            db: DATABASE_NAME
        });

        console.log("Database created successfully!");
        console.log("Database name:", DATABASE_NAME);

    } catch (error) {
        if (error.status === 412) {
            console.log("Database already exists!");
        } else {
            console.error("Database creation failed:", error.message);
        }
    }
}

module.exports = {
    cloudant,
    DATABASE_NAME,
    createDatabase
};
