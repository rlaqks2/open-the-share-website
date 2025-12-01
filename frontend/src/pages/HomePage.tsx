import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import ImpactSection from '../components/sections/ImpactSection';
import ProcessSection from '../components/sections/ProcessSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import PartnersSection from '../components/sections/PartnersSection';
import CTASection from '../components/sections/CTASection';

interface HomePageProps {
    content: any;
    onInquiryClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ content, onInquiryClick }) => {
    if (!content) return null;
    return (
        <>
            <HeroSection onInquiryClick={onInquiryClick} />
            <ImpactSection data={content.impactStats} />
            <ProcessSection data={content.processSteps} />
            <TestimonialsSection data={content.testimonials} />
            <PartnersSection data={content.partners} />
            <CTASection onInquiryClick={onInquiryClick} />
        </>
    );
};

export default HomePage;
