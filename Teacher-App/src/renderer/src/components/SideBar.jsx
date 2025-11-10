import { useState } from 'react'
import {
  Home,
  Users,
  Settings,
  FileText,
  BarChart3,
  Mail,
  Calendar,
  FolderOpen,
  Menu,
  RotateCcw,
  Megaphone
} from 'lucide-react'

function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('dashboard')

  const menuItems = [
    { id: 'dashboard', icon: Home, label: '오늘의 출석' },
    { id: 'analytics', icon: BarChart3, label: '출석 현황' },
    { id: 'calendar', icon: Calendar, label: '학사 일정' },
    { id: 'projects', icon: FolderOpen, label: '과제 내기' },
    { id: 'thacher', icon: Users, label: '선생님 관리' },
    { id: 'reset', icon: RotateCcw, label: '재설정' },
    { id: 'advertisement', icon: Megaphone, label: '홍보물 올리기' },
    { id: 'settings', icon: Settings, label: '설정' }
  ]

  return (
    <div
      className={`${
        isCollapsed ? 'w-14.5' : 'w-64'
      } bg-white transition-all duration-300 ease-in-out flex flex-col overflow-hidden border-r border-gray-200`}
    >
      {/* Header */}
      <div className="h-16 flex items-center px-2 border-b border-gray-200">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transition-opacity duration-200 ${
              isCollapsed ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span
            className={`font-semibold text-gray-900 whitespace-nowrap transition-opacity duration-200 ${
              isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}
          >
            대인고 출석 시스템
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full h-10 flex items-center rounded-lg transition-colors ${
                    isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <span
                    className={`text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${
                      isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="h-16 flex items-center px-2 border-t border-gray-200">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xs">A</span>
          </div>
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0 opacity-100 transition-opacity duration-200">
            <p className="text-sm font-semibold text-gray-900 truncate">이수미</p>
            <p className="text-xs text-gray-500 truncate">sumi@gmail.com</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SideBar
