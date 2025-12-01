import React from 'react';
import AboutSection from '../components/sections/AboutSection';
import ImpactCalculator from '../components/sections/ImpactCalculator';

interface AboutPageProps {
    data: any;
}

const AboutPage: React.FC<AboutPageProps> = ({ data }) => {
    return (
        <>
            <AboutSection data={data} />
            <ImpactCalculator />
        </>
    );
};

export default AboutPage;
