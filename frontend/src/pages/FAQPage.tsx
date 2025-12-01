import React from 'react';
import FAQSection from '../components/sections/FAQSection';
import ResourceLibrary from '../components/sections/ResourceLibrary';

interface FAQPageProps {
    faqs: any[];
}

const FAQPage: React.FC<FAQPageProps> = ({ faqs }) => {
    return (
        <>
            <FAQSection data={faqs} />
            <ResourceLibrary />
        </>
    );
};

export default FAQPage;
