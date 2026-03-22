import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/leads';

const OwnerDash = () => {
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [filterDate, setFilterDate] = useState(""); // Calendar Filter
    const [showStatsDetail, setShowStatsDetail] = useState(false);

    useEffect(() => { fetchAllData(); }, []);

    const fetchAllData = async () => {
        try {
            const res = await axios.get(`${API_URL}/all`);
            setLeads(res.data);
            setFilteredLeads(res.data);
        } catch (err) { console.error("Data fetch error", err); }
    };

    // --- Filter Logic ---
    const handleDateFilter = (e) => {
        const date = e.target.value;
        setFilterDate(date);
        if (date === "") {
            setFilteredLeads(leads);
        } else {
            const filtered = leads.filter(l => 
                new Date(l.createdAt).toISOString().split('T')[0] === date
            );
            setFilteredLeads(filtered);
        }
    };

    // --- Calculations ---
    const stats = {
        total: leads.length,
        pending: leads.filter(l => l.status === 'Pending').length,
        toSales: leads.filter(l => l.status === 'Consulted' || l.status === 'Closed').length,
        closed: leads.filter(l => l.status === 'Closed').length,
        conversionRate: leads.length > 0 ? ((leads.filter(l => l.status === 'Closed').length / leads.length) * 100).toFixed(1) : 0
    };

    return (
        <div style={s.container}>
            {/* Header & Main Stats Buttons */}
            <header style={s.header}>
                <h1>👑 Business Command Center</h1>
                <div style={s.topActions}>
                    <button onClick={() => setShowStatsDetail(!showStatsDetail)} style={s.reportBtn}>
                        {showStatsDetail ? "Hide Reports" : "View Full Business Report"}
                    </button>
                    <button onClick={() => window.location.href='/'} style={s.logoutBtn}>Logout</button>
                </div>
            </header>

            {/* Hidden Detailed Stats Panel */}
            {showStatsDetail && (
                <div style={s.statsPanel}>
                    <div style={s.statBox}><h3>{stats.total}</h3><p>Total Leads Received</p></div>
                    <div style={s.statBox}><h3>{stats.toSales}</h3><p>Forwarded to Sales</p></div>
                    <div style={s.statBox}><h3>{stats.closed}</h3><p>Successful Deals</p></div>
                    <div style={s.statBox}><h3>{stats.conversionRate}%</h3><p>Overall Conversion</p></div>
                </div>
            )}

            {/* Calendar & Filters Section */}
            <div style={s.filterBar}>
                <div style={s.filterGroup}>
                    <label>📅 Filter by Date: </label>
                    <input type="date" value={filterDate} onChange={handleDateFilter} style={s.dateInput} />
                    {filterDate && <button onClick={() => {setFilterDate(""); setFilteredLeads(leads);}} style={s.clearBtn}>Clear</button>}
                </div>
                <div style={s.infoText}>
                    Showing <b>{filteredLeads.length}</b> leads for {filterDate || "All Time"}
                </div>
            </div>

            {/* Lead Table */}
            <div style={s.tableCard}>
                <table style={s.table}>
                    <thead>
                        <tr style={s.theadTr}>
                            <th>Reg. Date</th>
                            <th>Farmer</th>
                            <th>Location</th>
                            <th>Current Status</th>
                            <th>Forwarded to Sales On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeads.map(lead => (
                            <tr key={lead._id} style={s.tbodyTr}>
                                <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                                <td><b>{lead.name}</b></td>
                                <td>{lead.district}</td>
                                <td>
                                    <span style={{...s.badge, backgroundColor: lead.status === 'Closed' ? '#dcfce7' : '#fee2e2'}}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td>
                                    {/* Agar counsellor ne check kar liya hai to date dikhao */}
                                    {lead.consultedAt ? new Date(lead.consultedAt).toLocaleString() : "Not yet forwarded"}
                                </td>
                                <td>
                                    <button onClick={() => setSelectedLead(lead)} style={s.viewBtn}>Full Analysis</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Full Data */}
            {selectedLead && (
                <div style={s.modalOverlay}>
                    <div style={s.modalContent}>
                        <div style={s.modalHeader}>
                            <h2>Farmer Case Audit: {selectedLead.name}</h2>
                            <button onClick={() => setSelectedLead(null)} style={s.closeIcon}>&times;</button>
                        </div>
                        <div style={s.modalBody}>
                            <div style={s.grid2}>
                                <div style={s.infoCard}>
                                    <h4>📍 Contact & Farm Details</h4>
                                    <p><b>Phone:</b> {selectedLead.phone}</p>
                                    <p><b>Address:</b> {selectedLead.district}, {selectedLead.state}</p>
                                    <p><b>Experience:</b> {selectedLead.experience} Yrs</p>
                                    <p><b>Crops/Animals:</b> {selectedLead.farmingInterest?.join(", ")}</p>
                                </div>
                                <div style={s.infoCard}>
                                    <h4>⏱️ Process Timeline</h4>
                                    <p><b>Created:</b> {new Date(selectedLead.createdAt).toLocaleString()}</p>
                                    <p><b>Counsellor Action:</b> {selectedLead.consultedAt ? new Date(selectedLead.consultedAt).toLocaleString() : "Pending"}</p>
                                    <p><b>Sales Status:</b> {selectedLead.status === 'Closed' ? "Deal Finalized" : "In Progress"}</p>
                                </div>
                            </div>
                            <div style={{marginTop:'20px', padding:'15px', background:'#f1f5f9', borderRadius:'10px'}}>
                                <h4>🎙️ Receptionist Query & Voice</h4>
                                <p>{selectedLead.initialQuery}</p>
                                {selectedLead.voiceNote && <audio src={selectedLead.voiceNote} controls />}
                            </div>
                            <div style={{marginTop:'20px'}}>
                                <h4>📝 Internal Remarks</h4>
                                <p><b>Counsellor:</b> {selectedLead.counsellorNotes || "No notes yet"}</p>
                                <p><b>Sales Team:</b> {selectedLead.salesNotes || "No follow-up yet"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const s = {
    container: { padding: '30px', backgroundColor: '#f4f7fa', minHeight: '100vh', fontFamily: 'sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    topActions: { display: 'flex', gap: '10px' },
    reportBtn: { padding: '12px 20px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    logoutBtn: { padding: '12px 20px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    statsPanel: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px', animation: 'slideDown 0.3s ease' },
    statBox: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
    filterBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px 25px', borderRadius: '12px', marginBottom: '20px' },
    dateInput: { padding: '8px', borderRadius: '5px', border: '1px solid #cbd5e1', marginLeft: '10px' },
    tableCard: { backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    theadTr: { backgroundColor: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #edf2f7' },
    tbodyTr: { borderBottom: '1px solid #f1f5f9' },
    badge: { padding: '4px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' },
    viewBtn: { padding: '6px 15px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', width: '800px', padding: '30px', borderRadius: '15px', maxHeight: '90vh', overflowY: 'auto' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    infoCard: { padding: '15px', border: '1px solid #eee', borderRadius: '10px' },
    clearBtn: { marginLeft: '10px', background: 'none', border: 'none', color: 'red', cursor: 'pointer', textDecoration: 'underline' }
};

export default OwnerDash;