
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection
const mongoUrl = process.env.MONGO_URL || 'mongodb://<username>:<password>@localhost:27017/mydatabase'; // Replace with your actual connection string
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
    process.exit(1); // Exit the application if the database connection fails
  });

// Define a Mongoose schema and model with validation
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
});

const Item = mongoose.model('Item', itemSchema);

// CRUD routes

// Create an item
app.post('/items', async (req, res) => {
  const item = new Item(req.body);
  try {
    await item.save();
    res.status(201).send(item);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get all items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.send(items);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get an item by ID
app.get('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).send('Item not found');
    res.send(item);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Update an item by ID
app.put('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).send('Item not found');
    res.send(item);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Delete an item by ID
app.delete('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).send('Item not found');
    res.send(item);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
