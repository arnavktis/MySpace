const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  profileURL: {
    type: String,
    required: true, // URL for the app icon or profile
  },
  redirectURL: {
    type: String,
    required: true, // URL for redirecting the user when they click the app
  },
});

module.exports = mongoose.model('App', appSchema);
