const express = require("express");
const Listing = require("../models/Listing");
const router = express.Router();

// Get All Listings
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().populate("agent", "name email");
    res.json(listings);
  } catch (err) {
    console.error("Error fetching all listings:", err.message);
    res.status(500).json({ error: "An error occurred while fetching listings." });
  }
});

// Get a Single Listing by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id).populate("agent", "name email");
    if (!listing) {
      return res.status(404).json({ error: "Listing not found." });
    }
    res.json(listing);
  } catch (err) {
    console.error(`Error fetching listing with ID ${id}:`, err.message);
    res.status(500).json({ error: "An error occurred while fetching the listing." });
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
    console.error("Error creating a new listing:", err.message);
    res.status(500).json({ error: "An error occurred while creating the listing." });
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
      { new: true, runValidators: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ error: "Listing not found." });
    }

    res.json(updatedListing);
  } catch (err) {
    console.error(`Error updating listing with ID ${id}:`, err.message);
    res.status(500).json({ error: "An error occurred while updating the listing." });
  }
});

// Delete a Listing
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).json({ error: "Listing not found." });
    }
    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error(`Error deleting listing with ID ${id}:`, err.message);
    res.status(500).json({ error: "An error occurred while deleting the listing." });
  }
});

module.exports = router;
