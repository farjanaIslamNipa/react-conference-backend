const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId  } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db('reactConference');
        const collection = db.collection('conferences');




        // ==============================================================
        // Add new conference
        app.post('/api/v1/create-conference', async (req,res) => {

            await collection.insertOne(req.body)

            res.status(200).json({
                success: true,
                message: 'New conference added successfully'
            })
        })

        // Get all conferences
        app.get('/api/v1/conferences', async (req, res) => {

            const result = await collection.find().toArray()

            res.status(200).json({
                success: true,
                message: 'conferences retrieved successfully',
                data: result
            })

        })

        // Get single conference
        app.get('/api/v1/conferences/:id', async(req, res) => {
            const {id} = req.params;

            const result = await collection.findOne({_id: new ObjectId(id)})
            res.status(200).json({
                success: true,
                message: 'conference retrieved successfully',
                data: result
            })
        })
        // ==============================================================


        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } finally {
    }
}

run().catch(console.dir);

// Test route
app.get('/', (req, res) => {
    const serverStatus = {
        message: 'Server is running smoothly',
        timestamp: new Date()
    };
    res.json(serverStatus);
});