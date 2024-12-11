const express = require('express');
const Listing = require('../models/Listing'); // Ensure this points to the correct schema
const router = express.Router();

// Get All Listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().populate('agent', 'name email');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a Single Listing by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id).populate('agent', 'name email');
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a Listing
router.post('/', async (req, res) => {
  const { propertyName, description, price, location, agent } = req.body;

  if (!propertyName || !description || !price || !location) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newListing = new Listing({
      title: propertyName, // Map propertyName to title
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
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { propertyName, description, price, location, agent } = req.body;

  if (!propertyName || !description || !price || !location) {
    return res.status(400).json({ error: 'All fields are required.' });
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
    if (!updatedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(updatedListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Listing
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
