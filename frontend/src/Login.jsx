import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from './logo1.jpg'; // Path wahi rakhein jo signup mein hai

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            // Token aur Role save karna
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);

            // Success Alert
            alert("Login Successful! 🚀");

            // Role based navigation
            const role = res.data.user.role;
            if (role === 'receptionist') navigate('/reception-dash');
            else if (role === 'counsellor') navigate('/counsellor-dash');
            else if (role === 'sales') navigate('/sales-dash');
            else if (role === 'owner') navigate('/owner-dash');
            else navigate('/'); 

        } catch (err) {
            alert(err.response?.data?.error || "Login Failed! Email ya Password check karein.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageWrapper}>
            {/* Background Overlay */}
            <div style={styles.bgOverlay}></div>
            
            <div style={styles.card}>
                <div style={styles.header}>
                    <img src={logo} alt="Logo" style={styles.formLogo} />
                    <h2 style={styles.title}>Staff Login</h2>
                    <p style={styles.subtitle}>Welcome back! Please enter your details</p>
                </div>

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="name@company.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={styles.input} 
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            style={styles.input} 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            ...styles.button, 
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                    
                    <p style={styles.footerText}>
                        Don't have an account? <Link to="/" style={styles.link}>Register here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

// Styles object (Exactly Same as SignUp for Consistency)
const styles = {
    pageWrapper: {
        position: 'relative',
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f7f6',
        overflow: 'hidden',
    },
    bgOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${logo})`,
        backgroundSize: '400px',
        backgroundPosition: 'center',
        opacity: 0.05,
        zIndex: 1,
    },
    card: {
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
        boxSizing: 'border-box'
    },
    button: {
        marginTop: '10px',
        padding: '14px',
        background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)', // Login ke liye Blue shade (Optional)
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '600',
        boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
        transition: 'transform 0.2s ease',
    },
    footerText: {
        marginTop: '20px',
        fontSize: '14px',
        color: '#666',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: 'bold',
    }
};

export default Login;