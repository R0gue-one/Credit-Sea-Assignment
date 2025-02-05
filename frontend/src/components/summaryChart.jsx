import React from 'react';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FileText } from 'lucide-react';

const ReportSummaryCharts = ({ reportSummary }) => {
  // Data preparation for account status pie chart
  const accountStatusData = [
    { name: 'Active Accounts', value: reportSummary.activeAccounts },
    { name: 'Closed Accounts', value: reportSummary.closedAccounts }
  ];

  // Data preparation for balance distribution
  const balanceData = [
    { name: "Secured", value: reportSummary.securedBalance, fill: "#3b82f6" },  // Blue
    { name: "Unsecured", value: reportSummary.unsecuredBalance, fill: "#facc15" } // Yellow
  ];

  // Colors for charts
  const COLORS = ['#3b82f6', '#64748b', '#22c55e', '#f97316'];

  // Format large numbers to K/M/B
  const formatValue = (value) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
  };

  return (
    <div className="w-full space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Account Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Account Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={accountStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {accountStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} Accounts`, '']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Balance Distribution */}
        
        {/* Balance Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Balance Distribution</h3>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={balanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatValue} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                
                <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]} 
                fill={({ name }) => (name === "Secured" ? "#3b82f6" : "#facc15")} 
                />
            </BarChart>
            </ResponsiveContainer>
        </div>
        </div>

      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Total Accounts",
            value: reportSummary.totalAccounts,
            color: "text-blue-600"
          },
          {
            title: "Current Balance",
            value: `₹${reportSummary.currentBalance.toLocaleString()}`,
            color: "text-green-600"
          },
          {
            title: "Recent Enquiries",
            value: reportSummary.last7DaysEnquiries,
            color: "text-orange-600"
          }
        ].map((stat, index) => (
          <div 
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            <p className={`text-2xl font-semibold mt-2 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportSummaryCharts;