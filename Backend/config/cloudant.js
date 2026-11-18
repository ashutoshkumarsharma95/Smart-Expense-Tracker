
const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");

// Create Cloudant connection
const cloudant = CloudantV1.newInstance({
    authenticator: new IamAuthenticator({
        apikey: process.env.CLOUDANT_APIKEY
    })
});

// Set Cloudant service URL
cloudant.setServiceUrl(process.env.CLOUDANT_URL);

module.exports = cloudant;
