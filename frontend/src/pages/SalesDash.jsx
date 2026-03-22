import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VoiceNoteRecorder from './VoiceNoteRecorder'; // Naya component import
import '../App.css'; 

const API_URL = 'http://localhost:5000/api/leads';

function SalesDash() {
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [editableLead, setEditableLead] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- 1. Leads Fetching (Consulted Status) ---
    useEffect(() => {
        fetchConsultedLeads();
    }, []);

    const fetchConsultedLeads = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/status/Consulted`);
            setLeads(res.data);
        } catch (err) { console.error("Error fetching leads"); }
        setLoading(false);
    };

    const selectLead = (lead) => {
        setSelectedLead(lead);
        setEditableLead({ ...lead });
    };

    // --- 2. Update Logic ---
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditableLead(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateLead = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`${API_URL}/update/${editableLead._id}`, editableLead);
            alert("✅ Lead Updated Successfully!");
            fetchConsultedLeads();
            setSelectedLead(null);
        } catch (err) { alert("❌ Update Failed"); }
        setLoading(false);
    };

    // --- 3. Close Lead ---
    const handleCloseLead = async () => {
        if (window.confirm(`Mark ${selectedLead.name} as Closed/Completed?`)) {
            try {
                await axios.put(`${API_URL}/update/${selectedLead._id}`, { status: 'Closed' });
                alert("🎉 Lead Closed Successfully!");
                fetchConsultedLeads();
                setSelectedLead(null);
            } catch (err) { alert("Error closing lead"); }
        }
    };

    return (
        <div style={s.dashboardContainer}>
            {/* Sidebar */}
            <div style={s.sidebar}>
                <div style={s.sidebarHeader}>
                    <h3 style={{color: '#fff', margin: 0}}>💰 Sales Panel</h3>
                    <p style={{color: '#818cf8', fontSize: '12px'}}>Consulted Leads: {leads.length}</p>
                </div>
                <div style={s.listContainer}>
                    {leads.map(lead => (
                        <div key={lead._id} onClick={() => selectLead(lead)} 
                             style={{...s.leadItem, borderLeft: selectedLead?._id === lead._id ? '6px solid #fbbf24' : '6px solid #4ade80'}}>
                            <div style={{fontWeight: 'bold'}}>{lead.name}</div>
                            <div style={{fontSize: '11px', opacity: 0.7}}>{lead.phone} | {lead.district}</div>
                        </div>
                    ))}
                    {leads.length === 0 && <p style={s.emptyMsg}>No leads to show.</p>}
                </div>
            </div>

            {/* Main Content */}
            <div style={s.mainContent}>
                {selectedLead && editableLead ? (
                    <div style={s.card}>
                        <div style={s.cardHeader}>
                            <h2>Update Lead: {selectedLead.name}</h2>
                            <span style={s.statusBadge}>{editableLead.status}</span>
                        </div>

                        <form onSubmit={handleUpdateLead} style={s.formGrid}>
                            <div style={s.inputWrapper}>
                                <label>Farmer Name</label>
                                <input name="name" value={editableLead.name} onChange={handleEditChange} style={s.input}/>
                            </div>
                            <div style={s.inputWrapper}>
                                <label>Status</label>
                                <select name="status" value={editableLead.status} onChange={handleEditChange} style={s.input}>
                                    <option value="Consulted">Consulted (Ready for Sale)</option>
                                    <option value="Follow-up">In Follow-up</option>
                                    <option value="Closed">Closed / Completed</option>
                                </select>
                            </div>
                            <div style={s.inputWrapper}>
                                <label>WhatsApp Number</label>
                                <input name="phone" value={editableLead.phone} onChange={handleEditChange} style={s.input}/>
                            </div>
                            <div style={s.inputWrapper}>
                                <label>Pincode</label>
                                <input name="pincode" value={editableLead.pincode} onChange={handleEditChange} style={s.input}/>
                            </div>

                            <div style={{...s.inputWrapper, gridColumn: '1/3'}}>
                                <label>Sales Consultation Notes</label>
                                <textarea name="salesNotes" value={editableLead.salesNotes || ''} 
                                          onChange={handleEditChange} style={s.textarea} 
                                          placeholder="Enter price discussion, payment details..."/>
                            </div>

                            {/* Communication History (Voice Logic) */}
                            <div style={s.voiceSection}>
                                <h4>🎙️ Communication History (Audio)</h4>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                                    {/* 1. Receptionist Voice */}
                                    <div style={s.voiceBox}>
                                        <p style={s.label}>Farmer Original Problem:</p>
                                        <VoiceNoteRecorder existingNoteUrl={selectedLead.voiceNote} />
                                    </div>
                                    {/* 2. Counsellor Advice Voice */}
                                    <div style={s.voiceBox}>
                                        <p style={s.label}>Counsellor Advice Recording:</p>
                                        <VoiceNoteRecorder existingNoteUrl={selectedLead.counsellorVoiceNote} />
                                    </div>
                                </div>
                                <div style={{marginTop: '15px', padding: '10px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd'}}>
                                    <p><strong>Counsellor Notes:</strong> {selectedLead.counsellorNotes || 'No text notes provided'}</p>
                                    <p><strong>Interest:</strong> {selectedLead.farmingInterest?.join(', ') || 'N/A'}</p>
                                </div>
                            </div>

                            <div style={s.btnGroup}>
                                <button type="submit" style={s.btnPrimary}>💾 Save Lead Progress</button>
                                <button type="button" onClick={handleCloseLead} style={s.btnSuccess}>🏁 Mark as Deal Closed</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div style={s.placeholder}>
                        <h3>Select a lead to finalize the deal</h3>
                    </div>
                )}
            </div>
        </div>
    );
}

const s = {
    // ... wahi purana style object jo aapne diya tha ...
    dashboardContainer: { display: 'flex', height: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'Segoe UI' },
    sidebar: { width: '320px', backgroundColor: '#1e1b4b', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 10px rgba(0,0,0,0.1)' },
    sidebarHeader: { padding: '25px', borderBottom: '1px solid #312e81' },
    listContainer: { flex: 1, overflowY: 'auto', padding: '10px' },
    leadItem: { padding: '15px', backgroundColor: '#312e81', color: '#fff', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer', transition: '0.3s' },
    mainContent: { flex: 1, padding: '40px', overflowY: 'auto' },
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' },
    statusBadge: { backgroundColor: '#dcfce7', color: '#166534', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    inputWrapper: { display: 'flex', flexDirection: 'column', gap: '5px' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' },
    textarea: { padding: '12px', borderRadius: '8px', border: '1px solid #6366f1', outline: 'none', fontSize: '14px', minHeight: '100px' },
    voiceSection: { gridColumn: '1/3', marginTop: '20px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px' },
    voiceBox: { backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' },
    btnGroup: { gridColumn: '1/3', display: 'flex', gap: '15px', marginTop: '20px' },
    btnPrimary: { flex: 1, padding: '15px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
    btnSuccess: { flex: 1, padding: '15px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
    placeholder: { height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.5 },
    emptyMsg: { textAlign: 'center', color: '#94a3b8', marginTop: '40px' },
    label: { fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '5px' }
};

export default SalesDash;