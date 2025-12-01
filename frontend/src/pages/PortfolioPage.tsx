import React from 'react';
import PortfolioSection from '../components/sections/PortfolioSection';
import { PortfolioItem } from '../types';

interface PortfolioPageProps {
    data: any[];
    onItemClick: (item: PortfolioItem) => void;
}

const PortfolioPage: React.FC<PortfolioPageProps> = ({ data, onItemClick }) => {
    return (
        <PortfolioSection data={data} onPortfolioItemClick={onItemClick} />
    );
};

export default PortfolioPage;
