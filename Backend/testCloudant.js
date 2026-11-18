
require("dotenv").config();

const cloudant = require("./config/cloudant");

async function testConnection() {
    try {
        const response = await cloudant.getServerInformation();

        console.log("Cloudant connected successfully!");

        console.log(
            "Cloudant version:",
            response.result.version
        );

    } catch (error) {
        console.error("Cloudant connection failed!");
        console.error("Error:", error.message);
    }
}

testConnection();
