const dropboxV2Api = require("dropbox-v2-api");

// Dropbox API Initialization
const dropbox = dropboxV2Api.authenticate({
  token: "", // Replace with your Dropbox token
});

module.exports = dropbox;
