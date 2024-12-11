const express = require("express");
const Listing = require("../models/Listing");
const router = express.Router();

// Get All Listings
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().populate("agent", "name email");
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a Listing
router.post("/", async (req, res) => {
  const { propertyName, description, price, location, agent } = req.body;

  // Backend validation
  if (!propertyName || !description || !price || !location) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newListing = new Listing({
      title: propertyName,
      description,
      price,
      location,
      agent,
    });
    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Listing
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { propertyName, description, price, location, agent } = req.body;

  // Backend validation
  if (!propertyName || !description || !price || !location) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      {
        title: propertyName,
        description,
        price,
        location,
        agent,
      },
      { new: true }
    );
    res.json(updatedListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Listing
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Listing.findByIdAndDelete(id);
    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
