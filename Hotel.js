// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define MongoDB collections for room types and rooms respectively
let roomTypesCollection = [];
let roomsCollection = [];

// POST endpoint/API for storing room types
app.post('/api/v1/rooms-types', (req, res) => {
    const { name } = req.body; // Extract 'name' from request body
    const _id = new ObjectId(); // Generate new ObjectId
    const roomType = { _id, name }; // Create room type object
    roomTypesCollection.push(roomType); // Push room type object to collection
    res.status(201).json(roomType); // Respond with created room type
});

// GET endpoint for fetching all room types
app.get('/api/v1/rooms-types', (req, res) => {
    res.json(roomTypesCollection); // Respond with all room types
});

// POST endpoint for storing rooms
app.post('/api/v1/rooms', (req, res) => {
    const { name, roomType, price } = req.body; // Extract data from request body
    const _id = new ObjectId(); // Generate new ObjectId
    const room = { _id, name, roomType, price }; // Create room object
    roomsCollection.push(room); // Push room object to collection
    res.status(201).json(room); // Respond with created room
});

// GET endpoint for fetching rooms with optional filtering
app.get('/api/v1/rooms', (req, res) => {
    let filteredRooms = roomsCollection;

    // Apply optional filters if provided in query parameters
    if (req.query.search) {
        filteredRooms = filteredRooms.filter(room => room.name.includes(req.query.search));
    }
    if (req.query.roomType) {
        filteredRooms = filteredRooms.filter(room => room.roomType === req.query.roomType);
    }
    if (req.query.minPrice && req.query.maxPrice) {
        filteredRooms = filteredRooms.filter(room => room.price >= req.query.minPrice && room.price <= req.query.maxPrice);
    } else if (req.query.maxPrice) {
        filteredRooms = filteredRooms.filter(room => room.price <= req.query.maxPrice);
    }

    res.json(filteredRooms); // Respond with filtered rooms
});

// PATCH endpoint for editing a room by its id
app.patch('/api/v1/rooms/:roomId', (req, res) => {
    const roomId = req.params.roomId; // Extract roomId from URL parameter
    // Find room by id and update its properties
    const roomIndex = roomsCollection.findIndex(room => room._id === roomId);
    if (roomIndex !== -1) {
        roomsCollection[roomIndex] = { ...roomsCollection[roomIndex], ...req.body };
        res.sendStatus(204); // Respond with no content if successful
    } else {
        res.sendStatus(404); // Respond with not found if room not found
    }
});

// DELETE endpoint for deleting a room by its id
app.delete('/api/v1/rooms/:roomId', (req, res) => {
    const roomId = req.params.roomId; // Extract roomId from URL parameter
    const roomIndex = roomsCollection.findIndex(room => room._id === roomId);
    if (roomIndex !== -1) {
        roomsCollection.splice(roomIndex, 1); // Remove room from collection
        res.sendStatus(204); // Respond with no content if successful
    } else {
        res.sendStatus(404); // Respond with not found if room not found
    }
});

// GET endpoint for fetching a room by its id
app.get('/api/v1/rooms/:roomId', (req, res) => {
    const roomId = req.params.roomId; // Extract roomId from URL parameter
    const room = roomsCollection.find(room => room._id === roomId);
    if (room) {
        res.json(room); // Respond with found room
    } else {
        res.sendStatus(404); // Respond with not found if room not found
    }
});

// Start server on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
