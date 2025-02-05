import React, { useState, useEffect } from 'react';
import {profile} from "../api/api";
import { useParams } from 'react-router-dom';
import { CreditCard, FileText, User } from 'lucide-react';

const ProfilesBoard = () => {
    const [profileData, setProfileData] = useState(null);
    const [activeSection, setActiveSection] = useState('basic');
    const profileId = useParams();

    const fetchProfile = async () => {
        console.log(profileId);
        const response = await profile(profileId.id);

        const data = response.data;
        console.log("Profile: ",data["name"]); 

        setProfileData(data);
    }
    

    useEffect(()=>{
        fetchProfile();
    },[profileId])

    if (!profileData) return <div className="p-6">Loading...</div>;

    const renderBasicDetails = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{profileData.name}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600">Mobile Phone</p>
                    <p className="font-medium">{profileData.mobilePhone}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600">PAN</p>
                    <p className="font-medium">{profileData.pan}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600">Credit Score</p>
                    <p className="font-medium">{profileData.creditScore}</p>
                </div>
            </div>
        </div>
    );

    const renderReportSummary = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Report Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600">Total Accounts</p>
                    <p className="font-medium">{profileData.reportSummary.totalAccounts}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600">Active Accounts</p>
                    <p className="font-medium">{profileData.reportSummary.activeAccounts}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600">Closed Accounts</p>
                    <p className="font-medium">{profileData.reportSummary.closedAccounts}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600">Current Balance</p>
                    <p className="font-medium">₹{profileData.reportSummary.currentBalance.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600">Secured Balance</p>
                    <p className="font-medium">₹{profileData.reportSummary.securedBalance.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600">Unsecured Balance</p>
                    <p className="font-medium">₹{profileData.reportSummary.unsecuredBalance.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600">Recent Credit Enquiries</p>
                    <p className="font-medium">{profileData.reportSummary.last7DaysEnquiries}</p>
                </div>
            </div>
        </div>
    );

    const renderCreditAccounts = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Credit Accounts Information</h2>
            <div className="space-y-4">
                {profileData.creditAccounts.map((account) => (
                    <div key={account._id} className="bg-white p-4 rounded-lg shadow">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-gray-600">Account Number</p>
                                <p className="font-medium">{account.accountNumber}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Bank Name</p>
                                <p className="font-medium capitalize">{account.bankName}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Account Type</p>
                                <p className="font-medium">{account.accountType}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Current Balance</p>
                                <p className="font-medium">₹{account.currentBalance.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Amount Overdue</p>
                                <p className="font-medium">₹{account.amountOverdue.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Credit Limit</p>
                                <p className="font-medium">₹{account.creditLimit.toLocaleString()}</p>
                            </div>
                            <div className="col-span-2 md:col-span-3">
                                <p className="text-gray-600">Address</p>
                                <p className="font-medium">
                                    {[
                                        account.address.firstLine,
                                        account.address.secondLine,
                                        account.address.thirdLine,
                                        account.address.city,
                                        account.address.state,
                                        account.address.pincode
                                    ].filter(Boolean).join(', ')}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Name */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Navigation Menu */}
                    <div className="md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow p-4">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveSection('basic')}
                                    className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                                        activeSection === 'basic' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <User size={20} />
                                    <span>Basic Details</span>
                                </button>
                                <button
                                    onClick={() => setActiveSection('summary')}
                                    className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                                        activeSection === 'summary' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <FileText size={20} />
                                    <span>Report Summary</span>
                                </button>
                                <button
                                    onClick={() => setActiveSection('accounts')}
                                    className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                                        activeSection === 'accounts' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <CreditCard size={20} />
                                    <span>Credit Accounts</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow p-6">
                            {activeSection === 'basic' && renderBasicDetails()}
                            {activeSection === 'summary' && renderReportSummary()}
                            {activeSection === 'accounts' && renderCreditAccounts()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


};

export default ProfilesBoard;