// DEPENDENCIES
require("dotenv").config();
const { PORT = 4000, MONGODB_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

// DATABASE CONNECTION
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

// Connection Events
mongoose.connection
    .on("open", () => console.log("You are connected to mongoose"))
    .on("close", () => console.log("You are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

// MODELS
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String,
});

const Cheese = mongoose.model("Cheese", CheeseSchema);

// MiddleWare
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies


// ROUTES
// create a test route
app.get("/", (req, res) => {
    res.send("Cheesy");
});

//  INDEX ROUTE
app.get("/cheese", async (req, res) => {
    try {
      res.json(await Cheese.find({}));
    } catch (error) {
      res.status(400).json(error);
    }
  });
  
  // CREATE ROUTE
  app.post("/cheese", async (req, res) => {
    try {
      res.json(await Cheese.create(req.body));
    } catch (error) {
      res.status(400).json(error);
    }
  });
  
  // DELETE ROUTE
  app.delete("/cheese/:id", async (req, res) => {
    try {
      res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
  });
  
  // UPDATE ROUTE
  app.put("/cheese/:id", async (req, res) => {
    try {
      res.json(
        await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      res.status(400).json(error);
    }
  });


// LISTENER
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
