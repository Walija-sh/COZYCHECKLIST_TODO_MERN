
import {  ArrowUpRight, CircleUserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { todoAppContext } from '../context/Context';

const Navbar = () => {

  const {handleLogout}=useContext(todoAppContext)



  return (
    <nav className="bg-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-16 flex-wrap">
          {/* Logo */}
          <Link to='/'>
          
          <h2 className="flex items-center text-2xl lg:text-[32px] font-bold text-[#1C1C1C]">
            
            COZY
            <span className="  text-[#5465FF]">
              CHECKLIST
            </span>
          </h2>
          </Link>

         

          {/* Desktop CTA Button */}
          <div className="flex items-center space-x-4">
             <button onClick={handleLogout} className="bg-[#5465FF] border-t-4 border-b-4 border-t-[#7684FF] border-b-[#4351CC] text-white py-2 px-6 font-medium cursor-pointer transition duration-200 hover:opacity-95 hidden sm:flex items-center gap-2 ">
              Log Out <ArrowUpRight size={24} />
            </button>
          
           <Link to="/profile">
           <CircleUserRound className="text-[#1c1c1c]" />
           </Link>
          </div>

          
        </div>
      </div>

     
    </nav>
  );
};

export default Navbar;