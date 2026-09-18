"use client";
import React, { useState, useEffect } from 'react';
import Extras from './Extras';
import Promotions from './Promotions';
import './Extras.css';

const OptionsSection = () => {
    const [activeTab, setActiveTab] = useState('sandwiches');

    useEffect(() => {
        const handleSwitch = (e) => {
            if (e.detail && ['sandwiches', 'submarines', 'combo-deals'].includes(e.detail)) {
                setActiveTab(e.detail);
                document.getElementById('options-section')?.scrollIntoView({ behavior: 'smooth' });
            }
        };
        window.addEventListener('switchOption', handleSwitch);
        return () => window.removeEventListener('switchOption', handleSwitch);
    }, []);

    const tabs = [
        { id: 'sandwiches',  label: 'Sandwiches' },
        { id: 'submarines',  label: 'Submarines' },
        { id: 'combo-deals', label: 'Combo Deals' }
    ];

    return (
        <section id="options-section" className="extras-section">
            <div className="container">
                <h2 className="extras-title">More To Explore</h2>

                <div className="extras-buttons-container">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`extras-category-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: activeTab === 'sandwiches' ? 'block' : 'none' }}>
                        <Extras categories={['Sandwiches']} showFilterButtons={false} title='' />
                    </div>
                    <div style={{ display: activeTab === 'submarines' ? 'block' : 'none' }}>
                        <Extras categories={['Submarines']} showFilterButtons={false} title='' />
                    </div>
                    <div style={{ display: activeTab === 'combo-deals' ? 'block' : 'none' }}>
                        <Promotions isSimple={true} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OptionsSection;