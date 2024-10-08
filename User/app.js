const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/user"); // Your Mongoose user model
const appModel = require("./models/app"); // Your Mongoose app model

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Home page route
app.get("/", (req, res) => {
  res.render("index");
});

// Read all users
app.get("/read", async (req, res) => {
  try {
    const allUsers = await userModel.find();
    res.render("read", { users: allUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

// Delete a user by ID
app.get("/delete/:id", async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.redirect("/read");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
});

// Edit a user by ID
app.get("/edit/:userid", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userid);
    res.render("edit", { user });
  } catch (error) {
    console.error("Error fetching user for edit:", error);
    res.status(500).send("Error fetching user for edit");
  }
});

// Update a user
app.post("/update/:userid", async (req, res) => {
  const { name, email, image } = req.body; // Adjusted to remove Myspacename since it is not updated here.
  try {
    await userModel.findByIdAndUpdate(
      req.params.userid,
      { name, email, image },
      { new: true }
    );
    res.redirect("/read");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});

// Create a user and optionally a space
app.post("/create", async (req, res) => {
  const { name, email, image, Myspacename } = req.body;

  try {
    const createdUser = await userModel.create({
      name,
      email,
      image,
      spaces: Myspacename ? [{ name: Myspacename, apps: [] }] : []
    });
    console.log("User created:", createdUser);
    res.redirect("/read"); // Redirect to a page after user creation
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
});

app.get("/spaces/:userid", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userid);
    if (user) {
      // Render the EJS template and pass user spaces and user ID to the view
      res.render("spaces", { userid: req.params.userid, spaces: user.spaces });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error retrieving spaces:", error);
    res.status(500).send("Error retrieving spaces");
  }
});

// Route to create a new space for a user
app.post("/create-space/:userid", async (req, res) => {
  const { Myspacename } = req.body;

  try {
    const user = await userModel.findById(req.params.userid);
    if (user) {
      // Add the new space to the user's spaces array
      user.spaces.push({ name: Myspacename, apps: [] });
      await user.save();
      console.log("Space created:", user);
      // Redirect back to the spaces page after creation
      res.redirect(`/spaces/${req.params.userid}`);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error creating space:", error);
    res.status(500).send("Error creating space");
  }
});




app.get("/view-spaces/:userid", async (req, res) => {
  try {
    // Find the user by ID
    const user = await userModel.findById(req.params.userid);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Extract app IDs from the user's spaces
    const appIds = user.spaces.reduce((acc, space) => {
      return acc.concat(space.apps.map(app => app._id)); // Assuming app has an _id field
    }, []);

    // Fetch the apps using the extracted IDs
    const apps = await appModel.find({ _id: { $in: appIds } });

    // Create a mapping of app ID to app details for easier access in EJS
    const appMap = {};
    apps.forEach(app => {
      appMap[app._id] = app; // Store app details using app ID as key
    });

    // Render the userSpaces page with user and app data
    res.render("viewSpaces", { user, appMap });
    
  } catch (error) {
    console.error("Error fetching spaces:", error);
    res.status(500).send("Error fetching spaces");
  }
});

// Route to select apps for a user
app.get("/select-apps/:userid/:spaceid", async (req, res) => {
  try {
    const apps = await appModel.find(); // Fetch available apps
    res.render("selectApps", { apps, userid: req.params.userid, spaceid: req.params.spaceid });
  } catch (error) {
    console.error("Error fetching apps:", error);
    res.status(500).send("Error fetching apps");
  }
});

app.post("/add-selected-apps/:userid/:spaceid", async (req, res) => {
  const { selectedApps } = req.body; // selectedApps should be an array now

  if (!Array.isArray(selectedApps)) {
    return res.status(400).send("No apps selected");
  }

  try {
    const user = await userModel.findById(req.params.userid);
    if (user) {
      const space = user.spaces.id(req.params.spaceid);
      if (space) {
        // Add the selected apps to the space
        space.apps.push(...selectedApps);
        await user.save();
        console.log("Selected apps added to space:", space);
        res.redirect("/read");
      } else {
        res.status(404).send("Space not found");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error adding selected apps:", error);
    res.status(500).send("Error adding selected apps");
  }
});

// Add app form
app.get("/add-app", (req, res) => {
  res.render("addApps");
});

// Route to handle the form submission for adding a new app
app.post("/add-app", async (req, res) => {
  const { name, profileURL, redirectURL } = req.body;

  try {
    const newApp = await appModel.create({ name, profileURL, redirectURL });
    console.log("New app added:", newApp);
    res.redirect("/apps"); // Redirect to the page showing all apps
  } catch (error) {
    console.error("Error adding app:", error);
    res.status(500).send("Error adding app");
  }
});

// Get all apps
app.get("/apps", async (req, res) => {
  try {
    const allApps = await appModel.find(); // Fetch all apps from the database
    res.render("apps", { apps: allApps }); // Render the apps view
  } catch (error) {
    console.error("Error fetching apps:", error);
    res.status(500).send("Error fetching apps");
  }
});

// Server listener
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
