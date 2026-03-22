const express = require('express');
const router = express.Router();
const Farmer = require('../models/farmer');

// --- SETTINGS ---
const SALES_TEAM = ["Sales_1", "Sales_2", "Sales_3"]; 
const LEAD_LIMIT = 500; 

// 1. Check Farmer Existence
router.get('/check/:phone', async (req, res) => {
    try {
        const lead = await Farmer.findOne({ phone: req.params.phone });
        res.json({ exists: !!lead, lead });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. New Lead (Receptionist) - VOICE SAVING LOGIC
router.post('/new', async (req, res) => {
    try {
        const newFarmer = new Farmer({
            ...req.body,
            name: req.body.farmerName,
            phone: req.body.whatsappNumber,
            // voiceNote yahan req.body se direct String (URL) format mein save hoga
            status: 'Pending' 
        });
        await newFarmer.save();
        res.status(201).json({ message: "Lead Created with Voice Note! ✅" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Update & Auto-Assign (Counsellor) - COUNSELLOR VOICE LOGIC
router.put('/update/:id', async (req, res) => {
    try {
        let updateData = { ...req.body };

        // Assignment logic jab status 'Consulted' ho
        if (req.body.status === 'Consulted') {
            updateData.consultedAt = new Date();
            let assignedSalesUser = null;

            for (let person of SALES_TEAM) {
                const count = await Farmer.countDocuments({ 
                    assignedSalesPerson: person, 
                    status: 'Consulted' 
                });
                if (count < LEAD_LIMIT) {
                    assignedSalesUser = person;
                    break;
                }
            }

            if (!assignedSalesUser) {
                return res.status(400).json({ error: "Sales Limit Reached (500)!" });
            }
            updateData.assignedSalesPerson = assignedSalesUser;
        }

        const updatedLead = await Farmer.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData }, 
            { new: true }
        );

        res.json({ message: "Updated Successfully", updatedLead });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Get Leads by Status
router.get('/status/:status', async (req, res) => {
    try {
        // Voice notes retrieval ke liye pure data fetch karna zaroori hai
        const leads = await Farmer.find({ status: req.params.status }).sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Sales Person Specific Leads
router.get('/my-leads/:username', async (req, res) => {
    try {
        const leads = await Farmer.find({ 
            assignedSalesPerson: req.params.username,
            status: 'Consulted' 
        }).sort({ consultedAt: -1 });
        res.json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;