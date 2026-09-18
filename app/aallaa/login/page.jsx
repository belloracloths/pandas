"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const pandaLogo = '/assets/panda.jpeg';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const res = await axios.post('/api/auth/login', { username, password });
            localStorage.setItem('adminToken', res.data.token);
            navigate.push('/aallaa');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: 'var(--a-bg)'
        }}>
            <div className="admin-card" style={{ width: '400px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={pandaLogo} alt="Panda Logo" style={{ width: '80px', borderRadius: '20px', marginBottom: '20px' }} />
                <h2 style={{ marginBottom: '10px', color: 'var(--a-text)', fontWeight: 800 }}>Admin Login</h2>
                <p style={{ color: 'var(--a-text-muted)', marginBottom: '30px', fontSize: '0.9rem' }}>Welcome back to Panda's Kitchen</p>

                {error && <div style={{ color: 'white', backgroundColor: 'var(--a-danger)', padding: '10px', borderRadius: '8px', width: '100%', marginBottom: '20px', textAlign: 'center', fontSize: '0.85rem' }}>{error}</div>}

                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                    <div className="admin-form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="admin-btn admin-btn-primary" 
                        style={{ width: '100%', padding: '14px', marginTop: '10px', display: 'flex', justifyContent: 'center' }}
                        disabled={loading}
                    >
                        {loading ? <div className="spinner"></div> : 'Login to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
