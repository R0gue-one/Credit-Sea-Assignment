import React from 'react';
import { Link } from 'react-router-dom';
import { FileUp, Search } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
      <Link to="/" className="text-white text-4xl font-bold">
        <span className="font-extrabold">Credit</span>
        <span className="font-light">Sea</span>
    </Link>
        <div className="space-x-4">
          <Link 
            to="/upload" 
            className="bg-white text-green-700 px-4 py-2 rounded-full hover:bg-green-100 transition duration-300 inline-flex items-center gap-2"
          >
            <FileUp size={20} />
            Upload File
          </Link>
          <Link 
            to="/credit-profiles" 
            className="bg-white text-green-700 px-4 py-2 rounded-full hover:bg-green-100 transition duration-300 inline-flex items-center gap-2"
          >
            <Search size={20} />
            Search Profiles
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;