import React, { useContext, useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import assets from '../assets/assets';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { todoAppContext } from '../context/Context';
import { toast } from 'react-toastify';


const AuthComponent = ({type}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {handleAuthentication}=useContext(todoAppContext)
  


  const checklistItems = [
    {
      id: 1,
      text: 'Gentle task management',
      description: 'A calm system that keeps your mind clear and focused.',
      checked: false
    },
    {
      id: 2,
      text: 'Priorities that make sense',
      description: 'Know what matters most and calmly work through your day.',
      checked: true
    },
    {
      id: 3,
      text: 'Celebrate tiny wins',
      description: 'Every completed task gives you a small moment of satisfaction.',
      checked: true
    }
  ];

  const handleSubmit = async (e) => {
  e.preventDefault();
  await handleAuthentication(email,password,type);
  // clear fields
    setEmail("");
    setPassword("");

 

};

  return (
    <div className="min-h-screen  bg-white flex flex-col lg:flex-row max-w-7xl mx-auto">
      
      {/* Left Side - Checklist */}
      <div className="lg:w-1/2  p-6 lg:p-12 flex flex-col justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-1">
        <img src={assets.AuthBg} className='object-cover w-full h-full' alt="" />
      </div>
        <div className="max-w-md mx-auto lg:mx-0 w-full relative z-50">
          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-[#F4F4F6] mb-2">
            COZYCHECKLIST
          </h1>
          
          {/* Tagline */}
          <p className="text-[#E6E6E9] text-lg lg:text-[20px] mb-10 lg:mb-12">
            Stay organized without pressure. CozyChecklist helps you handle your day in a calmer, lighter way.
          </p>

          {/* Checklist Items */}
          <div className="space-y-8">
            {checklistItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-4">
                <div className="mt-1">
                  <Check  size={24} color='white' className='text-[#F4F4F6]'  />
                </div>
                <div>
                  <p className={`text-lg lg:text-[20px] font-medium ${item.checked ? 'text-[#F4F4F6]' : 'text-[#F4F4F6]'}`}>
                    {item.text}
                  </p>
                  <p className="text-[#E6E6E9] lg:text-[20px] mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="lg:w-1/2 bg-white text-[#1C1C1C] p-6 lg:p-12 flex flex-col justify-center relative h-auto items-center ">
        <div className="max-w-md mx-auto lg:mx-0 w-full ">
          <h2 className="text-3xl mt-20 lg:text-[32px] font-bold  mb-8 lg:mb-12">
           {type==="signup"?"Create your account":"Welcome Back"} 
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm lg:text-[16px] font-semibold  mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border focus:border-2 border-[#1c1c1c] focus:border-[#5465FF] placeholder:text-[#66666E]  outline-none transition"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm lg:text-[16px] font-semibold  mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border focus:border-2 border-[#1c1c1c] focus:border-[#5465FF] placeholder:text-[#66666E]  outline-none transition"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#5465FF] border-t-4 border-b-4 border-t-[#7684FF] border-b-[#4351CC] text-white py-3 px-12 font-medium cursor-pointer  transition duration-200 mt-8"
            >
              {type==="signup"?"SIGN UP":"SIGN IN"}
            </button>
          </form>

          {/* Bottom Text */}
          <div className=" absolute top-[20px] right-[5%]">
            <p className="text-[#1c1c1c] text-sm">
              
              {type==='signup'?(
               <>
                Already have an account?{' '}
                <Link to="/signin" className="font-semibold hover:text-[#5465FF] transition">
                Sign in
              </Link>
               </>

              ):(
              
              <>
               Create new account?{' '}
               <Link to="/" className="font-semibold hover:text-[#5465FF] transition">
                Sign up
              </Link>
              </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;