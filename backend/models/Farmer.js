const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    // Basic Details
    name: { type: String, required: true },
    phone: { type: String, required: true },
    whatsappNumber: { type: String },
    state: { type: String },
    district: { type: String },
    postOffice: { type: String },
    pincode: { type: String },
    lang: { type: String },

    // Farming Info
    experience: { type: String },
    farmSize: { type: String },
    feedUsed: { type: String },
    initialQuery: { type: String },

    // --- VOICE NOTES ---
    voiceNote: { type: String }, // Receptionist ki voice (Base64)
    counsellorVoiceNote: { type: String }, // Counsellor ki voice (Base64)
    
    // Consultation Info
    counsellorNotes: { type: String },
    farmingInterest: [String], 
    specializedInfo: {
        currentAnimalCount: String,
        investmentRange: String
    },

    // Sales Info
    salesNotes: { type: String },

    // --- SYSTEM LOGIC ---
    status: { 
        type: String, 
        enum: ['Pending', 'Consulted', 'Closed'], 
        default: 'Pending' 
    },
    assignedSalesPerson: { type: String, default: null }, // 500 limit assignment ke liye

    // Timestamps
    consultedAt: { type: Date }, 
    closedAt: { type: Date }     
}, { timestamps: true });

module.exports = mongoose.model('Farmer', farmerSchema);