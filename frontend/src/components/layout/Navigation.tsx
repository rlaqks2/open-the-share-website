import React from 'react';
import { Link } from 'react-router-dom';

interface NavLink {
    name: string;
    href: string;
}

interface NavigationProps {
    links: NavLink[];
    onLinkClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ links, onLinkClick }) => {
    return (
        <nav className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-8">
            {links.map(link => (
                <Link
                    key={link.name}
                    to={link.href}
                    className="block px-4 py-2 lg:px-0 lg:py-0 rounded-md font-semibold text-slate-700 hover:bg-slate-100 lg:hover:bg-transparent hover:text-emerald-600 transition-colors"
                    onClick={onLinkClick}
                >
                    {link.name}
                </Link>
            ))}
        </nav>
    );
};

export default Navigation;

