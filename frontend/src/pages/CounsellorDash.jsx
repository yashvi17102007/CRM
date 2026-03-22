import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Path check karein: Agar file pages folder mein hi hai to './VoiceNoteRecorder' rahega
import VoiceNoteRecorder from './VoiceNoteRecorder'; 

const API_URL = 'http://localhost:5000/api/leads';
const FARMING_OPTIONS = ['Pig Farming', 'Goat Farming', 'Rabbit Farming', 'Dairy Farming', 'Poultry Farming', 'Fish Farming'];

const CounsellorDash = () => {
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [loading, setLoading] = useState(false);
    const [counsellorNotes, setCounsellorNotes] = useState('');
    const [selectedFarmings, setSelectedFarmings] = useState([]);
    const [specializedForm, setSpecializedForm] = useState({ currentAnimalCount: '', investmentRange: '' });
    // Ab hum base64 ki jagah Cloudinary URL save karenge
    const [counsellorVoiceURL, setCounsellorVoiceURL] = useState(null);

    useEffect(() => { fetchLeads(); }, []);

    const fetchLeads = async () => {
        try {
            const res = await axios.get(`${API_URL}/status/Pending`);
            setLeads(res.data);
        } catch (err) { console.error("Error fetching leads"); }
    };

    const selectLead = (lead) => {
        setSelectedLead(lead);
        setCounsellorNotes(lead.counsellorNotes || '');
        setSelectedFarmings(lead.farmingInterest || []);
        setSpecializedForm(lead.specializedInfo || { currentAnimalCount: '', investmentRange: '' });
        setCounsellorVoiceURL(null); // Naye lead ke liye reset karein
    };

    const handleAction = async (actionType) => {
        if (!selectedLead) return;
        
        // Validation: Approve karne se pehle notes ya voice zaroori hai
        if (actionType === 'APPROVE' && !counsellorNotes && !counsellorVoiceURL) {
            return alert("Kripya advice likhein ya record karein!");
        }

        setLoading(true);
        try {
            const updateData = {
                status: actionType === 'APPROVE' ? 'Consulted' : 'Closed',
                specializedInfo: specializedForm,
                counsellorNotes: counsellorNotes,
                farmingInterest: selectedFarmings,
                counsellorVoiceNote: counsellorVoiceURL // Cloudinary URL bhej rahe hain
            };

            const response = await axios.put(`${API_URL}/update/${selectedLead._id}`, updateData);
            alert(response.data.message);
            
            // UI Update
            fetchLeads();
            setSelectedLead(null);
        } catch (err) {
            alert("❌ Action Failed: " + (err.response?.data?.error || "Server error"));
        }
        setLoading(false);
    };

    return (
        <div style={{display: 'flex', height: '100vh', backgroundColor: '#f4f7fa', fontFamily: 'Arial'}}>
            {/* Sidebar: Pending Leads List */}
            <div style={{width: '320px', backgroundColor: '#1a237e', color: 'white', padding: '20px', overflowY: 'auto'}}>
                <h3 style={{borderBottom: '1px solid #ffffff33', paddingBottom: '10px'}}>📋 Pending Leads</h3>
                {leads.length === 0 ? <p style={{opacity: 0.6}}>No pending leads</p> : leads.map(lead => (
                    <div key={lead._id} onClick={() => selectLead(lead)} 
                         style={{
                             padding: '15px', 
                             backgroundColor: selectedLead?._id === lead._id ? '#3949ab' : 'rgba(255,255,255,0.1)', 
                             borderRadius: '8px', 
                             marginBottom: '10px', 
                             cursor: 'pointer',
                             transition: '0.3s'
                         }}>
                        <strong>{lead.name}</strong> <br/> 
                        <small>{lead.phone} | {lead.district}</small>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div style={{flex: 1, padding: '30px', overflowY: 'auto'}}>
                {selectedLead ? (
                    <div style={{backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px'}}>
                            <h2>Farmer Profile: {selectedLead.name}</h2>
                            <span style={{backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold'}}>{selectedLead.status}</span>
                        </div>

                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px'}}>
                            
                            {/* Left Column: Farmer History & Receptionist Recording */}
                            <div style={{backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
                                <h4 style={{color: '#1a237e', borderLeft: '4px solid #1a237e', paddingLeft: '10px', marginBottom: '15px'}}>📍 Farmer History</h4>
                                <p style={{fontSize: '14px', lineHeight: '1.6'}}><strong>Initial Query:</strong> <br/> {selectedLead.initialQuery}</p>
                                
                                {/* Receptionist Voice Playback Mode */}
                                <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #cbd5e1'}}>
                                    <label style={{fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '10px'}}>RECEPTIONIST'S RECORDING</label>
                                    {selectedLead.voiceNote ? (
                                        <VoiceNoteRecorder existingNoteUrl={selectedLead.voiceNote} />
                                    ) : <p style={{color: '#ef4444', fontSize: '13px'}}>No Recording Found</p>}
                                </div>

                                <div style={{marginTop: '15px', fontSize: '14px'}}>
                                    <p><strong>Location:</strong> {selectedLead.district}, {selectedLead.state}</p>
                                    <p><strong>Language:</strong> {selectedLead.lang}</p>
                                </div>
                            </div>

                            {/* Right Column: Advice & Action Desk */}
                            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                                <h4 style={{color: '#1a237e', borderLeft: '4px solid #1a237e', paddingLeft: '10px'}}>✍️ Consultation Desk</h4>
                                
                                <label style={{fontSize: '14px', fontWeight: 'bold'}}>Assign Farming Interests:</label>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', backgroundColor: '#fdfdfd', padding: '10px', borderRadius: '8px', border: '1px solid #eee'}}>
                                    {FARMING_OPTIONS.map(opt => (
                                        <label key={opt} style={{fontSize: '13px', cursor: 'pointer'}}>
                                            <input type="checkbox" checked={selectedFarmings.includes(opt)} onChange={() => {
                                                const newSel = selectedFarmings.includes(opt) ? selectedFarmings.filter(i => i !== opt) : [...selectedFarmings, opt];
                                                setSelectedFarmings(newSel);
                                            }} /> {opt}
                                        </label>
                                    ))}
                                </div>

                                <textarea 
                                    placeholder="Write your professional advice here..." 
                                    value={counsellorNotes} 
                                    onChange={(e)=>setCounsellorNotes(e.target.value)} 
                                    style={{height: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px'}}
                                ></textarea>
                                
                                {/* Counsellor Voice Recording (Record Mode) */}
                                <div style={{marginTop: '5px'}}>
                                    <label style={{fontSize: '14px', fontWeight: 'bold', color: '#1a237e'}}>🎙️ RECORD VOICE ADVICE (OPTIONAL)</label>
                                    <VoiceNoteRecorder 
                                        onRecordingComplete={(cloudinaryUrl) => setCounsellorVoiceURL(cloudinaryUrl)} 
                                    />
                                </div>

                                <div style={{display: 'flex', gap: '15px', marginTop: '10px'}}>
                                    <button 
                                        onClick={() => handleAction('APPROVE')} 
                                        disabled={loading} 
                                        style={{flex: 2, padding: '15px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px'}}
                                    >
                                        {loading ? "Processing..." : "🚀 Forward to Sales"}
                                    </button>
                                    <button 
                                        onClick={() => handleAction('INVALID')} 
                                        style={{flex: 1, padding: '15px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer'}}
                                    >
                                        Invalid
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: '#94a3b8'}}>
                        <div style={{textAlign: 'center'}}>
                            <h1 style={{fontSize: '50px', marginBottom: '10px'}}>🌾</h1>
                            <h3>Select a farmer from the sidebar to begin consultation.</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CounsellorDash;