import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from "lucide-react";

const CreditProfilesDashboard = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    pan: '',
    minScore: '',
    maxScore: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters
      }).toString();
      
      const response = await fetch(`http://localhost:5000/retrieve?${queryParams}`);
      const data = await response.json();
      
      setProfiles(data.profiles);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/retrieve/stats/credit-score');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchStats();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleProfileClick = (profile) => {
    
    // Navigate using PAN
    // navigate(`/profile/pan/${profile.pan}`);
    
    //  Navigate using MongoDB ID
    navigate(`/profile/${profile._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      {/* Header */}
      <div className="bg-blue-500 p-8">
        <h1 className="text-3xl font-bold text-white text-left mx-64">Search Profiles</h1>
      </div>
  
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row justify-center gap-8">
          {/* Left Column - Search Filters */}
          <div className="lg:w-1/4">
            <div className="bg-indigo-100 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-6">Search Filters</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Search by name"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN</label>
                  <input
                    type="text"
                    placeholder="Search by PAN"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.pan}
                    onChange={(e) => handleFilterChange('pan', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Score</label>
                    <input
                      type="number"
                      placeholder="Min Score"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={filters.minScore}
                      onChange={(e) => handleFilterChange('minScore', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
                    <input
                      type="number"
                      placeholder="Max Score"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={filters.maxScore}
                      onChange={(e) => handleFilterChange('maxScore', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <option value="createdAt">Sort by Date</option>
                    <option value="creditScore">Sort by Credit Score</option>
                    <option value="name">Sort by Name</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <select
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
  
          {/* Center Column - Profiles Table */}
          <div className="lg:w-1/2">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-center">Credit Profiles</h2>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">PAN</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Credit Score</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Created At</th>
                          <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {profiles.map((profile) => (
                          <tr key={profile._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">{profile.name}</td>
                            <td className="px-6 py-4">{profile.pan}</td>
                            <td className="px-6 py-4">{profile.creditScore}</td>
                            <td className="px-6 py-4">
                              {new Date(profile.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleProfileClick(profile)}
                                className="inline-flex items-center gap-1 px-4 py-2 bg-lime-500 text-navy rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Details
                                <ArrowRight size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
  
                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-gray-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
  
          {/* Right Column - Stats */}
          <div className="lg:w-1/6">
            <div className="grid grid-cols-1 gap-4">
              {stats && (
                <>
                  <div className="bg-sky-500 p-4 rounded-lg shadow-md w-28 h-28 flex flex-col items-start justify-start">
                    <div className="text-gray-800 text-sm">Avg Score</div>
                    <div className="text-xl font-bold text-gray-800">{stats.averageScore}</div>
                  </div>
                  <div className="bg-emerald-500 p-4 rounded-lg shadow-md w-28 h-28 flex flex-col items-start justify-start">
                    <div className="text-gray-800 text-sm">High Score</div>
                    <div className="text-xl font-bold text-gray-800">{stats.maxScore}</div>
                  </div>
                  <div className="bg-red-400 p-4 rounded-lg shadow-md w-28 h-28 flex flex-col items-start justify-start">
                    <div className="text-gray-800 text-sm">Low Score</div>
                    <div className="text-xl font-bold text-gray-800">{stats.minScore}</div>
                  </div>
                  <div className="bg-fuchsia-400 p-4 rounded-lg shadow-md w-28 h-28 flex flex-col items-start justify-start">
                    <div className="text-gray-800 text-sm">Total Profiles</div>
                    <div className="text-xl font-bold text-gray-800">{stats.totalProfiles}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditProfilesDashboard;