import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
    return (
        <Link to="/" className="text-2xl font-black text-emerald-600">
            OpenTheShare
        </Link>
    );
};

export default Logo;
