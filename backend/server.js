const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const farmerRoutes = require('./routes/farmerRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
// Body limit badhayi gayi hai Voice Note ke Base64 data ke liye
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// DB Connection
mongoose.connect('mongodb://127.0.0.1:27017/crm_database')
    .then(() => console.log("MongoDB Connected Successfully... ✅"))
    .catch(err => console.log("DB Connection Error: ", err));

// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/leads', farmerRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));