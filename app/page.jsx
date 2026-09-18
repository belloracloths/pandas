import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Extras from '../components/Extras';
import Popup from '../components/Popup';
import { MenuCategory } from '../components/MenuSections';
import { sectionsData } from '../lib/constants';
import SpecialOffer from '../components/SpecialOffer';
import About from '../components/About';
import Promotions from '../components/Promotions';
import Feedback from '../components/Feedback';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import OptionsSection from '../components/OptionsSection';

const Home = () => {
    const getSectionData = (id) => sectionsData.find(s => s.id === id);

    return (
        <div className="home-page">
            <Popup />
            <Navbar />
            <Hero />

            {/* Extras Section */}
            <div className="bg-white">
                <Extras
                    id="extras"
                    title="Extras"
                    categories={['Extras']}
                    showFilterButtons={false}
                    showTitle={true}
                />
            </div>

            {/* Beverages Section */}
            <div className="bg-yellow">
                <Extras
                    id="beverages"
                    title="Beverages"
                    categories={['Beverages']}
                    showFilterButtons={false}
                    showTitle={true}
                />
            </div>

            {/* Picked For You */}
            <div className="bg-white">
                <MenuCategory data={getSectionData('picked-for-you')} titleClass="title-black" />
            </div>

            {/* Breakfast Burgers */}
            <div className="bg-yellow">
                <MenuCategory data={getSectionData('breakfast-burgers')} titleClass="title-black" />
            </div>

            {/* Regular Burgers */}
            <div className="bg-white">
                <MenuCategory data={getSectionData('regular-burgers')} titleClass="title-black" />
            </div>

            {/* Ultra Max Burgers */}
            <div className="bg-yellow">
                <MenuCategory data={getSectionData('ultra-max-burgers')} titleClass="title-black" />
            </div>

            {/* Options */}
            <div className="bg-white">
                <OptionsSection />
            </div>

            {/* Limited Time Offer */}
            <div className="bg-yellow">
                <SpecialOffer />
            </div>

            {/* Happy Customers */}
            <div className="bg-white">
                <Feedback />
            </div>

            {/* Our Story */}
            <div className="bg-yellow">
                <About />
            </div>

            {/* Special Offers */}
            <div className="bg-white">
                <Promotions />
            </div>

            {/* Contact */}
            <div className="bg-yellow">
                <Contact />
            </div>

            <Footer />
        </div>
    );
};

export default Home;