import React from 'react';
import ProgramsSection from '../components/sections/ProgramsSection';
import ProgramFilterSection from '../components/sections/ProgramFilterSection';

interface ProgramsPageProps {
    data: any;
    onProgramClick?: (program: any) => void;
    onQuoteClick?: (program: any) => void;
}

const ProgramsPage: React.FC<ProgramsPageProps> = ({ data, onProgramClick, onQuoteClick }) => {
    return (
        <>
            <ProgramsSection
                data={data}
                onProgramClick={onProgramClick}
                onQuoteClick={onQuoteClick}
            />
            <ProgramFilterSection />
        </>
    );
};

export default ProgramsPage;
