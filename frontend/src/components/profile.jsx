import React, { useState, useEffect } from 'react';
import { profile } from "../api/api";
import { useParams } from 'react-router-dom';
import { CreditCard, FileText, User, AlertCircle, ArrowUpRight, Copy } from 'lucide-react';

const ProfilesBoard = () => {
    const [profileData, setProfileData] = useState(null);
    const [activeSection, setActiveSection] = useState('basic');
    const [copied, setCopied] = useState(false);
    const profileId = useParams();

    const fetchProfile = async () => {
        const response = await profile(profileId.id);
        setProfileData(response.data);
    }

    const handleClick = (item) => {
        navigator.clipboard.writeText(item.value)
        .then(() => {
            setCopied(true)
            setTimeout(()=>setCopied(false), 3000);
        })
        .catch(err => console.error("Failed to copy:", err));
    }

    useEffect(() => {
        fetchProfile();
    }, [profileId]);

    if (!profileData) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-pulse flex items-center space-x-2">
                <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce delay-200"></div>
            </div>
        </div>
    );

    const renderBasicDetails = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {[
                    { label: "Name", value: profileData.name, icon: <User size={20} className="text-blue-500" /> },
                    { label: "Mobile Phone", value: profileData.mobilePhone, icon: <CreditCard size={20} className="text-green-500" /> },
                    { label: "PAN", value: profileData.pan, icon: <FileText size={20} className="text-purple-500" /> },
                    { label: "Credit Score", value: profileData.creditScore, icon: <AlertCircle size={20} className="text-orange-500" /> }
                ].map((item, index) => (
                    <button 
                    key={index} 
                    onClick={() => handleClick(item)} 
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md focus:outline-none w-full text-left"
                >
                    <div className='flex item-senter justify-between'>
                    <div className="flex items-center space-x-3">
                        {item.icon}
                        <div className="flex flex-col">
                            <p className="text-sm font-medium text-gray-500">{item.label}</p>
                            <p className="text-lg font-semibold text-gray-900 capitalize">{item.value}</p>
                        </div>
                    </div>
                    <Copy className="w-6 h-6 text-gray-400 ml-auto" />
                    </div>
                </button>
                ))}
            </div>
        </div>
    );

    const renderReportSummary = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Report Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Accounts", value: profileData.reportSummary.totalAccounts },
                    { label: "Active Accounts", value: profileData.reportSummary.activeAccounts },
                    { label: "Closed Accounts", value: profileData.reportSummary.closedAccounts },
                    { label: "Current Balance", value: `₹${profileData.reportSummary.currentBalance.toLocaleString()}` },
                    { label: "Secured Balance", value: `₹${profileData.reportSummary.securedBalance.toLocaleString()}` },
                    { label: "Unsecured Balance", value: `₹${profileData.reportSummary.unsecuredBalance.toLocaleString()}` },
                    { label: "Recent Credit Enquiries", value: profileData.reportSummary.last7DaysEnquiries }
                ].map((item, index) => (
                    <button key={index}
                    onClick={() => handleClick(item)}
                    >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
                        <p className="text-sm font-medium text-gray-500">{item.label}</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{item.value}</p>
                    </div>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderCreditAccounts = () => (
        <div className="space-y-6">
            
            <h2 className="text-2xl font-semibold text-gray-900">Credit Accounts</h2>
            <div className="space-y-6">
                {profileData.creditAccounts.map((account) => (
                    <div key={account._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="col-span-3">
                                <div className="flex items-center space-x-3">
                                    <h3 className="text-lg font-semibold text-gray-900 capitalize">{account.bankName}</h3>
                                    <span className="px-2 py-1 text-sm font-medium rounded-full bg-blue-50 text-slate-700">
                                        Type- {account.accountType}
                                    </span>
                                </div>
                            </div>
                            {[
                                { label: "Account Number", value: account.accountNumber },
                                { label: "Current Balance", value: `₹${account.currentBalance.toLocaleString()}` },
                                { label: "Amount Overdue", value: `₹${account.amountOverdue.toLocaleString()}` },
                                { label: "Credit Limit", value: `₹${account.creditLimit.toLocaleString()}` }
                            ].map((item, index) => (
                                <div key={index}>
                                    <p className="text-sm font-medium text-gray-500">{item.label}</p>
                                    <p className="text-base font-semibold text-gray-900 mt-1">{item.value}</p>
                                </div>
                            ))}
                            <div className="col-span-3">
                                <p className="text-sm font-medium text-gray-500">Address</p>
                                <p className="text-base text-gray-900 mt-1">
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
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-white">Profile Details</h1>
                </div>
            </div>

            {copied && (
                <div 
                    className="flex fixed top-5 left-1/2 items-center py-2 px-4 text-white bg-green-500 rounded-lg shadow-lg transition-transform duration-300 transform -translate-x-1/2 animate-slideIn"
                >
                    <span>Copied to clipboard</span>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <nav className="space-y-1 p-2">
                                {[
                                    { id: 'basic', label: 'Basic Details', icon: User },
                                    { id: 'summary', label: 'Report Summary', icon: FileText },
                                    { id: 'accounts', label: 'Credit Accounts', icon: CreditCard }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                                            activeSection === item.id
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <item.icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
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