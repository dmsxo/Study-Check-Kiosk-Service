import SideBar from '../components/SideBar'

function MainLayout() {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex-1 bg-gray-50">hahaha</div>
    </div>
  )
}

export default MainLayout
