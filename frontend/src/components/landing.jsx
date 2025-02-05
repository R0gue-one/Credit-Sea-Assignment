import React from 'react';
import { Upload, Search, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <>
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Background Wave Pattern */}
      <div className="absolute inset-0 z-0">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 400" xmlns="http://www.w3.org/2000/svg">
          <path 
            fill="#BFDBFE" 
            fillOpacity="0.7"
            d="M0,128L48,144C96,160,192,192,288,192C384,192,480,160,576,165.3C672,171,768,213,864,224C960,235,1056,213,1152,186.7C1248,160,1344,128,1392,112L1440,96L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z"
          />
          <path 
            fill="#93C5FD" 
            fillOpacity="0.8"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,245.3C960,224,1056,160,1152,138.7C1248,117,1344,139,1392,149.3L1440,160L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z"
          />
        </svg>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-48 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-6xl font-bold text-gray-900 leading-tight">
                By Your Side for Every
                <span className="text-blue-500"> Financial Need</span>
              </h1>
              
              <p className="text-xl text-sky-950 leading-relaxed">
                Always with you for the best loan deals and the right financial decisions
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-12">
            <Link 
            to="/upload" >
              <button className="flex items-center px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-200">
                <Upload className="w-5 h-5 mr-2" />
                Upload File
              </button>
              </Link>
              <Link 
                to="/credit-profiles" >
              <button className="flex items-center px-6 py-3.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-green-200">
                <Search className="w-5 h-5 mr-2" />
                Search Profiles
              </button>
                </Link>
                <a href='https://github.com/R0gue-one/Credit-Sea-Assignment' target='_blank'>
              <button className="flex items-center px-6 py-3.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all transform hover:scale-105 shadow-lg hover:shadow-gray-200">
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </button>
              </a>
            </div>
          </div>

          {/* Right Placeholder Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden ">
              <img 
                src="/src/assets/approved.png" 
                alt="Credit Sea Services" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </main>

      
    </div>

    <footer className="absolute bottom--5 w-full bg-[#8bc0fc] bg-opacity-80 py-4 text-center text-sky-800">
    © 2025 Credit Sea
    </footer>
    </>
  );
};

export default LandingPage;