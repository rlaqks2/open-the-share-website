import React from 'react';
import ProgramsSection from '../components/sections/ProgramsSection';
import ProgramFilterSection from '../components/sections/ProgramFilterSection';

interface ProgramsPageProps {
    data: any;
}

const ProgramsPage: React.FC<ProgramsPageProps> = ({ data }) => {
    return (
        <>
            <ProgramsSection data={data} />
            <ProgramFilterSection />
        </>
    );
};

export default ProgramsPage;
