const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/MySpace");

const appSchema = mongoose.Schema({
    profileURL: String,     // URL of the app's profile (image or icon)
    redirectURL: String,    // URL to redirect when the app is selected
});

const spaceSchema = mongoose.Schema({
    name: String,           // Name of the created space
    apps: [appSchema],      // Array of apps selected for this space
});

const userSchema = mongoose.Schema({
    image: String,          // User profile image
    email: String,          // User email
    name: String,           // User name
    spaces: [spaceSchema],  // Array of spaces created by the user
});

module.exports = mongoose.model('User', userSchema);
