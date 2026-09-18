"use client";
import React, { useState, useEffect } from 'react';
import './Navbar.css';
const pandaLogo = '/assets/panda.jpeg';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        const handleClickOutside = (event) => {
            if (!event.target.closest('.options-dropdown')) {
                document.getElementById('options-menu')?.classList.remove('show');
            }
        };
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const sections = ['extras', 'beverages', 'picked-for-you', 'breakfast-burgers', 'regular-burgers', 'ultra-max-burgers', 'options-section'];
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
            { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 }
        );
        sections.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id) => {
        setIsMobileMenuOpen(false);
        if (['sandwiches', 'submarines', 'combo-deals'].includes(id)) {
            window.dispatchEvent(new CustomEvent('switchOption', { detail: id }));
            return;
        }
        const element = document.getElementById(id);
        if (element) {
            const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    const searchMap = [
        { keywords: ['burger', 'regular', 'classic', 'beef', 'chicken'], title: 'Regular Burgers', id: 'regular-burgers' },
        { keywords: ['breakfast', 'morning', 'egg', 'cheese'], title: 'Breakfast Burgers', id: 'breakfast-burgers' },
        { keywords: ['ultra', 'max', 'titan', 'double', 'big'], title: 'Ultra Max Burgers', id: 'ultra-max-burgers' },
        { keywords: ['picked', 'special', 'chef', 'recommend'], title: 'Picked for You', id: 'picked-for-you' },
        { keywords: ['extra', 'side', 'fries', 'dip', 'sauce'], title: 'Extras', id: 'extras' },
        { keywords: ['beverage', 'drink', 'juice', 'water', 'soda', 'coffee'], title: 'Beverages', id: 'beverages' },
        { keywords: ['sandwich', 'toast', 'club'], title: 'Sandwiches', id: 'options-section', tab: 'sandwiches' },
        { keywords: ['submarine', 'sub', 'hoagie'], title: 'Submarines', id: 'options-section', tab: 'submarines' },
        { keywords: ['combo', 'deal', 'family', 'feast'], title: 'Combo Deals', id: 'options-section', tab: 'combo-deals' },
        { keywords: ['contact', 'location', 'phone', 'email'], title: 'Contact Us', id: 'contact' },
        { keywords: ['feedback', 'review', 'rating'], title: 'Customer Feedback', id: 'feedback' }
    ];

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim().length > 0) {
            const results = searchMap.filter(item =>
                item.title.toLowerCase().includes(value.toLowerCase()) ||
                item.keywords.some(k => k.toLowerCase().includes(value.toLowerCase()))
            );
            setSearchResults(results);
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const handleSearchSelect = (item) => {
        setSearchTerm(''); setShowResults(false); setIsSearchOpen(false);
        if (item.tab) window.dispatchEvent(new CustomEvent('switchOption', { detail: item.tab }));
        const element = document.getElementById(item.id);
        if (element) {
            const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchResults.length > 0) handleSearchSelect(searchResults[0]);
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <div className="navbar-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <img src={pandaLogo} alt="Panda's Kitchen" />
                    <span className="navbar-brand-name">Panda's Kitchen</span>
                </div>

                <div className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                        </svg>
                    )}
                </div>

                <div className={`navbar-right ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
                    <div className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </div>

                    <ul className="nav-menu">
                        <li className={`nav-item ${activeSection === 'extras' ? 'active' : ''}`} onClick={() => scrollToSection('extras')}>Extras</li>
                        <li className={`nav-item ${activeSection === 'beverages' ? 'active' : ''}`} onClick={() => scrollToSection('beverages')}>Beverages</li>
                        <li className={`nav-item ${activeSection === 'picked-for-you' ? 'active' : ''}`} onClick={() => scrollToSection('picked-for-you')}>Picked for You</li>
                        <li className={`nav-item ${activeSection === 'breakfast-burgers' ? 'active' : ''}`} onClick={() => scrollToSection('breakfast-burgers')}>Breakfast Burgers</li>
                        <li className={`nav-item ${activeSection === 'regular-burgers' ? 'active' : ''}`} onClick={() => scrollToSection('regular-burgers')}>Regular Burgers</li>
                        <li className={`nav-item ${activeSection === 'ultra-max-burgers' ? 'active' : ''}`} onClick={() => scrollToSection('ultra-max-burgers')}>Ultra Max Burgers</li>
                        <li className={`nav-item options-dropdown ${activeSection === 'options-section' ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); document.getElementById('options-menu').classList.toggle('show'); }}>
                            Options
                            <ul id="options-menu" className="dropdown-menu">
                                <li onClick={(e) => { e.stopPropagation(); scrollToSection('options-section'); window.dispatchEvent(new CustomEvent('switchOption', { detail: 'sandwiches' })); document.getElementById('options-menu').classList.remove('show'); }}>Sandwiches</li>
                                <li onClick={(e) => { e.stopPropagation(); scrollToSection('options-section'); window.dispatchEvent(new CustomEvent('switchOption', { detail: 'submarines' })); document.getElementById('options-menu').classList.remove('show'); }}>Submarines</li>
                                <li onClick={(e) => { e.stopPropagation(); scrollToSection('options-section'); window.dispatchEvent(new CustomEvent('switchOption', { detail: 'combo-deals' })); document.getElementById('options-menu').classList.remove('show'); }}>Combo Deals</li>
                            </ul>
                        </li>
                    </ul>

                    <div className={`search-bar ${isSearchOpen ? 'active' : ''}`}>
                        <input type="text" placeholder="Search..." value={searchTerm}
                            onChange={handleSearchChange} onKeyDown={handleKeyDown}
                            onFocus={() => setIsSearchOpen(true)} />
                        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                        {showResults && (
                            <div className="search-dropdown">
                                {searchResults.length > 0 ? searchResults.map((result, index) => (
                                    <div key={index} className="search-result-item" onClick={() => handleSearchSelect(result)}>
                                        <span style={{ fontWeight: 'bold' }}>{result.title}</span>
                                    </div>
                                )) : <div className="search-result-item">No results found</div>}
                            </div>
                        )}
                    </div>
                </div>

                {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
            </div>
        </nav>
    );
};

export default Navbar;