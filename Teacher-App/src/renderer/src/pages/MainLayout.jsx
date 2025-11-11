import SideBar from '../components/SideBar';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex-1 bg-gray-50 px-20 py-10 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
