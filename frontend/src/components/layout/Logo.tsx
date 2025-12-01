import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
    return (
        <Link 
            to="/" 
            className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300"
        >
            OpenTheShare
        </Link>
    );
};

export default Logo;
