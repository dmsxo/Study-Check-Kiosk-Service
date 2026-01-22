import SideBar from '../components/SideBar';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex-1 bg-gray-50 py-10 overflow-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
