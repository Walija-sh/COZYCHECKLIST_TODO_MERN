
import { Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import Layout from './pages/Layout'
import Profile from './pages/Profile'
import Home from './pages/Home'
import { useContext } from 'react'
import { todoAppContext } from './context/Context'
import {ToastContainer} from 'react-toastify'
import NotFound from './pages/NotFound'

const App = () => {
  const { isLoggedIn } = useContext(todoAppContext);

  return isLoggedIn ? (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Home />} />
          <Route path="profile" element={<Profile />} />
          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  ) : (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Auth type={'signup'} />} />
        <Route path="/signin" element={<Auth type={'signin'} />} />
        {/* 404 fallback for unauthenticated */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App