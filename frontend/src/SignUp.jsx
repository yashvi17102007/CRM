import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from './logo1.jpg'; // Make sure path is correct

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'receptionist'
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
            alert("Registration Successful! 🎉");
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.error || "Signup Failed!");
        }
    };

    return (
        <div style={styles.pageWrapper}>
            {/* Background Logo with Opacity */}
            <div style={styles.bgOverlay}></div>
            
            <div style={styles.card}>
                <div style={styles.header}>
                    <img src={logo} alt="Logo" style={styles.formLogo} />
                    <h2 style={styles.title}>Staff Registration</h2>
                    <p style={styles.subtitle}>Create an account to manage your workflow</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input type="text" name="name" placeholder="John Doe" onChange={handleChange} required style={styles.input} />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input type="email" name="email" placeholder="name@company.com" onChange={handleChange} required style={styles.input} />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required style={styles.input} />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Assign Role</label>
                        <select name="role" onChange={handleChange} value={formData.role} style={styles.select}>
                            <option value="receptionist">Receptionist</option>
                            <option value="counsellor">Counsellor</option>
                            <option value="sales">Sales</option>
                            <option value="owner">Owner</option>
                        </select>
                    </div>

                    <button type="submit" style={styles.button}>Create Account</button>
                    
                    <p style={styles.footerText}>
                        Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: {
        position: 'relative',
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f7f6', // Light base color
        overflow: 'hidden',
    },
    bgOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${logo})`,
        backgroundSize: '400px', // Adjust size of repeated logo
        backgroundPosition: 'center',
        opacity: 0.05, // Low opacity for background
        zIndex: 1,
    },
    card: {
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Glass effect
        backdropFilter: 'blur(10px)',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    },
    formLogo: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        marginBottom: '15px',
        objectFit: 'cover'
    },
    title: {
        margin: '0 0 5px 0',
        color: '#333',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    subtitle: {
        margin: '0 0 25px 0',
        color: '#777',
        fontSize: '14px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        textAlign: 'left',
        marginBottom: '18px',
    },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        color: '#555',
        marginBottom: '6px',
        marginLeft: '4px'
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '10px',
        border: '1px solid #e1e1e1',
        fontSize: '14px',
        outline: 'none',
        transition: 'border 0.3s ease',
        boxSizing: 'border-box'
    },
    select: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '10px',
        border: '1px solid #e1e1e1',
        fontSize: '14px',
        backgroundColor: '#fff',
        cursor: 'pointer',
        boxSizing: 'border-box'
    },
    button: {
        marginTop: '10px',
        padding: '14px',
        background: 'linear-gradient(135deg, #28a745 0%, #218838 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
        transition: 'transform 0.2s ease',
    },
    footerText: {
        marginTop: '20px',
        fontSize: '14px',
        color: '#666',
    },
    link: {
        color: '#28a745',
        textDecoration: 'none',
        fontWeight: 'bold',
    }
};

export default SignUp;