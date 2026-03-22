import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Path check karein: Agar file pages folder mein hi hai to './VoiceNoteRecorder' rahega
import VoiceNoteRecorder from './VoiceNoteRecorder'; 

const API_URL = 'http://localhost:5000/api/leads';

const ReceptionDash = () => {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [customerData, setCustomerData] = useState(null);

    // Form Details - Initial State
    const [newCustomerDetails, setNewCustomerDetails] = useState({
        farmerName: '', 
        whatsappNumber: '', 
        state: '', 
        district: '', 
        postOffice: '',
        pincode: '', 
        lang: '', 
        experience: '', 
        farmSize: '', 
        feedUsed: '', 
        initialQuery: '',
        voiceNote: null // Isme Cloudinary ka URL store hoga
    });

    // 1. Customer Verification Logic
    const checkCustomer = async () => {
        if (!phoneNumber) return alert("Phone number zaroori hai");
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/check/${phoneNumber}`);
            if (res.data.exists) {
                setCustomerData(res.data.lead);
                setIsNewCustomer(false);
                alert("Farmer already registered!");
            } else {
                setIsNewCustomer(true);
                setCustomerData(null);
                // Whatsapp number ko phone number se auto-fill karna
                setNewCustomerDetails(prev => ({ ...prev, whatsappNumber: phoneNumber }));
            }
        } catch (err) { 
            console.error(err);
            setMessage("Server Error. Make sure backend is running."); 
        }
        setLoading(false);
    };

    // 2. Form Submission Logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Zaroori Check: Voice note ke bina submit nahi hone dena
        if (!newCustomerDetails.voiceNote) {
            return alert("Kripya farmer ka voice note record karein aur 'Stop & Save' dabayein!");
        }

        setLoading(true);
        try {
            // Backend ko pura details bhejna
            const response = await axios.post(`${API_URL}/new`, newCustomerDetails);
            if(response.status === 201) {
                alert("✅ Farmer Registered Successfully and sent to Counsellor!");
                window.location.reload(); // Form reset karne ke liye
            }
        } catch (err) {
            console.error(err);
            alert("❌ Submission Failed: " + (err.response?.data?.error || "Server error"));
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2 style={{margin:0}}>🌾 Agri-CRM Receptionist</h2>
                <button onClick={() => navigate('/')} style={styles.logoutBtn}>Logout</button>
            </header>
            
            <main style={styles.main}>
                {/* Search Section */}
                <section style={styles.card}>
                    <h3 style={styles.cardTitle}>🔍 Farmer Verification</h3>
                    <div style={styles.searchBox}>
                        <input 
                            type="number" 
                            placeholder="Phone Number..." 
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)} 
                            style={styles.input} 
                        />
                        <button onClick={checkCustomer} style={styles.btnBlue} disabled={loading}>
                            {loading ? "Checking..." : "Verify"}
                        </button>
                    </div>
                </section>

                {/* Registration Form - Sirf tab dikhega jab customer naya ho */}
                {isNewCustomer && (
                    <form onSubmit={handleSubmit} style={{...styles.card, borderLeft: '10px solid #2e7d32'}}>
                        <h3 style={{color: '#2e7d32', marginBottom: '20px'}}>Register New Farmer</h3>
                        
                        <div style={styles.formGrid}>
                            <input type="text" placeholder="Farmer Name*" required 
                                onChange={(e)=>setNewCustomerDetails({...newCustomerDetails, farmerName: e.target.value})} 
                                style={styles.input} />
                            
                            <input type="text" placeholder="State*" required 
                                onChange={(e)=>setNewCustomerDetails({...newCustomerDetails, state: e.target.value})} 
                                style={styles.input} />
                            
                            <input type="text" placeholder="District*" required 
                                onChange={(e)=>setNewCustomerDetails({...newCustomerDetails, district: e.target.value})} 
                                style={styles.input} />
                            
                            <input type="number" placeholder="Pincode*" required 
                                onChange={(e)=>setNewCustomerDetails({...newCustomerDetails, pincode: e.target.value})} 
                                style={styles.input} />
                            
                            <input type="text" placeholder="Language*" 
                                onChange={(e)=>setNewCustomerDetails({...newCustomerDetails, lang: e.target.value})} 
                                style={styles.input} />
                            
                            <input type="text" placeholder="Farm Size" 
                                onChange={(e)=>setNewCustomerDetails({...newCustomerDetails, farmSize: e.target.value})} 
                                style={styles.input} />
                            
                            <textarea 
                                placeholder="Initial Query / Problem*" 
                                required 
                                onChange={(e)=>setNewCustomerDetails({...newCustomerDetails, initialQuery: e.target.value})} 
                                style={{gridColumn: '1/3', ...styles.input, height: '80px'}}
                            ></textarea>
                            
                            {/* --- Voice Note Section --- */}
                            <div style={{gridColumn: '1/3', marginTop: '10px'}}>
                                <VoiceNoteRecorder 
                                    onRecordingComplete={(cloudinaryUrl) => {
                                        // Component se milne wala URL state mein save karna
                                        setNewCustomerDetails(prev => ({ ...prev, voiceNote: cloudinaryUrl }));
                                        console.log("Voice Note URL Received:", cloudinaryUrl);
                                    }} 
                                />
                            </div>

                            <button type="submit" disabled={loading} style={styles.btnGreen}>
                                {loading ? "Processing..." : "🚀 Submit & Send to Counsellor"}
                            </button>
                        </div>
                    </form>
                )}
                
                {message && <p style={{textAlign: 'center', color: 'red'}}>{message}</p>}
            </main>
        </div>
    );
};

// --- CSS Styles (No changes as requested) ---
const styles = {
    container: { backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'Arial' },
    header: { backgroundColor: '#166534', color: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logoutBtn: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' },
    main: { maxWidth: '900px', margin: '30px auto', padding: '0 20px' },
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '25px' },
    cardTitle: { marginTop: 0, color: '#334155' },
    searchBox: { display: 'flex', gap: '15px' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', fontSize: '16px', outline: 'none' },
    btnBlue: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    btnGreen: { gridColumn: '1/3', backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px', fontSize: '16px' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }
};

export default ReceptionDash;