import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <AlertCircle size={48} className="text-[#5465FF] mb-4" />
      <h1 className="text-4xl font-bold text-[#1C1C1C] mb-2">404</h1>
      <p className="text-[#66666E] mb-6 text-center">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="bg-[#5465FF] border-t-4 border-b-4 border-t-[#7684FF] border-b-[#4351CC] text-white py-2 px-6 font-medium cursor-pointer transition duration-200 hover:opacity-95 "
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
