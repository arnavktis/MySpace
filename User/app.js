// const express = require("express");
// const app = express();
// const path = require("path");
// const userModel = require("./models/user");

// app.set("view engine", "ejs");
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));

// app.get("/", (req, res) => {
//   res.render("index");
// });

// app.get("/read", async (req, res) => {
//   let allusers = await userModel.find();
//   res.render("read", { users: allusers });
// });

// app.get("/delete/:id", async (req, res) => {
//   let users = await userModel.findOneAndDelete({ _id: req.params.id });
//   res.redirect("/read");
// });

// app.get("/edit/:userid", async (req, res) => {
//   let user = await userModel.findOne({ _id: req.params.userid });
//   res.render("edit", { user });
// });

// app.post("/update/:userid", async (req, res) => {
//   let { name, email, Myspacename, image } = req.body;
//   let user = await userModel.findOneAndUpdate(
//     { _id: req.params.userid },
//     { name, email, image, Myspacename },
//     { new: true }
//   );
//   res.redirect("/read");
// });

// app.post("/create", async (req, res) => {
//   let { name, email, image, Myspacename } = req.body;
//   let createdUser = await userModel.create({
//     name,
//     email,
//     image,
//   });
//   console.log("User created:", createdUser);
//   res.send(createdUser);
// });

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });


const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/user"); // Your Mongoose user model
const appModel = require("./models/app")
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
  let allusers = await userModel.find();
  res.render("read", { users: allusers });
});

// Delete a user by ID
app.get("/delete/:id", async (req, res) => {
  await userModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/read");
});

// Edit a user by ID
app.get("/edit/:userid", async (req, res) => {
  let user = await userModel.findOne({ _id: req.params.userid });
  res.render("edit", { user });
});

// Update a user
app.post("/update/:userid", async (req, res) => {
  let { name, email, Myspacename, image } = req.body;
  await userModel.findOneAndUpdate(
    { _id: req.params.userid },
    { name, email, image },
    { new: true }
  );
  res.redirect("/read");
});

// Create a user and optionally a space
app.post("/create", async (req, res) => {
  let { name, email, image, Myspacename } = req.body;

  // Create a new user
  let createdUser = await userModel.create({
    name,
    email,
    image,
    spaces: Myspacename ? [{ name: Myspacename, apps: [] }] : []
  });

  console.log("User created:", createdUser);
  res.send(createdUser);
});

// Route to create a new space for a user
app.post("/create-space/:userid", async (req, res) => {
  let { Myspacename } = req.body;

  let user = await userModel.findById(req.params.userid);
  if (user) {
    // Add the new space to the user's spaces array
    user.spaces.push({ name: Myspacename, apps: [] });
    await user.save();
    console.log("Space created:", user);
    res.redirect("/read");
  } else {
    res.status(404).send("User not found");
  }
});

// Route to add apps to a space
// app.post("/add-app/:userid/:spaceid", async (req, res) => {
//   let { profileURL, redirectURL } = req.body;

//   let user = await userModel.findById(req.params.userid);
//   if (user) {
//     // Find the specific space
//     let space = user.spaces.id(req.params.spaceid);
//     if (space) {
//       // Add the app to the space
//       space.apps.push({ profileURL, redirectURL });
//       await user.save();
//       console.log("App added to space:", space);
//       res.redirect("/read");
//     } else {
//       res.status(404).send("Space not found");
//     }
//   } else {
//     res.status(404).send("User not found");
//   }
// });

app.get("/select-apps/:userid/:spaceid", async (req, res) => {
  try {
    let apps = await appModel.find(); // Fetch available apps
    res.render("selectApps", { apps, userid: req.params.userid, spaceid: req.params.spaceid });
  } catch (error) {
    res.status(500).send("Error fetching apps");
  }
});

// Route to handle adding selected apps to the user's space
app.post("/add-selected-apps/:userid/:spaceid", async (req, res) => {
  const { selectedApps } = req.body; // Expecting an array of selected app IDs

  let user = await userModel.findById(req.params.userid);
  if (user) {
    // Find the specific space
    let space = user.spaces.id(req.params.spaceid);
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
});
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
