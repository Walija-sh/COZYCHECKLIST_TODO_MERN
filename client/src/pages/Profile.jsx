// Profile.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Lock, Mail, Eye, EyeOff, LogOut, Save, Check } from 'lucide-react';
import { todoAppContext } from '../context/Context';
import {toast} from 'react-toastify'
import axios from 'axios';

const Profile = () => {
  const {handleLogout,getCurrentUser}=useContext(todoAppContext)
  const [userEmail,setUserEmail]=useState('')
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const {user}=useContext(todoAppContext);


useEffect(()=>{
  setUserEmail(user.email);
},[user])
  


  const validateForm = () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsUpdating(true);
    try {
          const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/updatePassword`,{oldPassword:currentPassword,newPassword},
            { withCredentials: true }
          );
    
          if (res.data.success) {
            setIsUpdating(false)
            toast.success('Password Updated successfully');
            setConfirmPassword('')
            setCurrentPassword('')
            setNewPassword('')
            setUpdateSuccess(true)
            getCurrentUser()
            
            
          }
        } catch (error) {
          console.log(error);
          
           setIsUpdating(false)
          toast.error("Password update failed");
        }
    
    
  };



  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1C1C1C] mb-2">
            Profile
          </h1>
          <p className="text-[#66666E]">
            Manage your account settings
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E6E6E9] mb-8" />

        {/* Email Section - Display Only */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-[#1C1C1C] mb-4">Email</h2>
          <div className="flex items-center gap-3 p-4 bg-[#F4F4F6] rounded-lg border border-[#E6E6E9]">
            <Mail size={20} className="text-[#66666E]" />
            <span className="text-[#1C1C1C] font-medium">{userEmail}</span>
          </div>
          <p className="text-sm text-[#66666E] mt-2">
            Email address cannot be changed
          </p>
        </div>

        {/* Password Update Form */}
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold text-[#1C1C1C] mb-4">Password</h2>
          
          {/* Current Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1C1C1C] mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setErrors(prev => ({ ...prev, currentPassword: '' }));
                }}
                placeholder="Enter current password"
                className={`w-full px-4 py-3 border ${
                  errors.currentPassword ? 'border-red-500' : 'border-[#1C1C1C]'
                } placeholder:text-[#66666E] focus:border-[#5465FF] focus:outline-none pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#66666E] hover:text-[#1C1C1C]"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1C1C1C] mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrors(prev => ({ ...prev, newPassword: '' }));
                }}
                placeholder="Enter new password"
                className={`w-full px-4 py-3 border ${
                  errors.newPassword ? 'border-red-500' : 'border-[#1C1C1C]'
                } placeholder:text-[#66666E] focus:border-[#5465FF] focus:outline-none pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#66666E] hover:text-[#1C1C1C]"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-[#1C1C1C] mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                placeholder="Confirm new password"
                className={`w-full px-4 py-3 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-[#1C1C1C]'
                } placeholder:text-[#66666E] focus:border-[#5465FF] focus:outline-none pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#66666E] hover:text-[#1C1C1C]"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Success Message */}
          {updateSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <Check size={20} className="text-green-600" />
              <p className="text-green-700 font-medium">Password updated successfully!</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              type="submit"
              disabled={isUpdating}
              className="bg-[#5465FF] border-t-4 border-b-4 border-t-[#7684FF] border-b-[#4351CC] text-white px-8 py-3 font-medium cursor-pointer hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[200px] w-full sm:w-fit"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save size={20} />
                  SAVE
                </>
              )}
            </button>

            {/* Mobile Logout Button (visible only on small screens) */}
            <button
              type="button"
              onClick={handleLogout}
              className="sm:hidden flex items-center gap-2 px-6 py-3 border-2 border-red-500 text-red-500 hover:bg-red-50 font-medium transition w-full justify-center"
            >
              <LogOut size={20} />
              Logout
            </button>

            
          </div>
        </form>

        {/* Password Requirements */}
        <div className="mt-12 p-6 bg-[#F4F4F6] rounded-lg border border-[#E6E6E9]">
          <h3 className="font-semibold text-[#1C1C1C] mb-3">Password Requirements</h3>
          <ul className="space-y-2 text-sm text-[#66666E]">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#5465FF] rounded-full mt-1.5"></div>
              Minimum 6 characters
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#5465FF] rounded-full mt-1.5"></div>
              Include at least one number
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#5465FF] rounded-full mt-1.5"></div>
              Use a mix of uppercase and lowercase letters
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#5465FF] rounded-full mt-1.5"></div>
              Include special characters for better security
            </li>
          </ul>
        </div>

       
      </div>
    </div>
  );
};

export default Profile;