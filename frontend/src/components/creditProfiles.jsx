import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-sm">Average Score</div>
              <div className="text-2xl font-bold">{stats.averageScore}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-sm">Highest Score</div>
              <div className="text-2xl font-bold">{stats.maxScore}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-red-600 text-sm">Lowest Score</div>
              <div className="text-2xl font-bold">{stats.minScore}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-purple-600 text-sm">Total Profiles</div>
              <div className="text-2xl font-bold">{stats.totalProfiles}</div>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Search Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by PAN"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.pan}
            onChange={(e) => handleFilterChange('pan', e.target.value)}
          />
          <input
            type="number"
            placeholder="Min Score"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.minScore}
            onChange={(e) => handleFilterChange('minScore', e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Score"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.maxScore}
            onChange={(e) => handleFilterChange('maxScore', e.target.value)}
          />
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="createdAt">Sort by Date</option>
            <option value="creditScore">Sort by Credit Score</option>
            <option value="name">Sort by Name</option>
          </select>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Profiles Table */}
      {/* Modified Profiles Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Credit Profiles</h2>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">PAN</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Credit Score</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {profiles.map((profile) => (
                    <tr 
                      key={profile._id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleProfileClick(profile)}
                    >
                      <td className="px-6 py-4">{profile.name}</td>
                      <td className="px-6 py-4">{profile.pan}</td>
                      <td className="px-6 py-4">{profile.creditScore}</td>
                      <td className="px-6 py-4">
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span>
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
  );
};

export default CreditProfilesDashboard;