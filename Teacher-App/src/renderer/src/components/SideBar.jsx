import React, { useState } from 'react'
import {
  Home,
  Users,
  Settings,
  FileText,
  BarChart3,
  Mail,
  Calendar,
  FolderOpen,
  Menu
} from 'lucide-react'

function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('dashboard')

  const menuItems = [
    { id: 'dashboard', icon: Home, label: '대시보드' },
    { id: 'projects', icon: FolderOpen, label: '프로젝트' },
    { id: 'team', icon: Users, label: '팀' },
    { id: 'documents', icon: FileText, label: '문서' },
    { id: 'analytics', icon: BarChart3, label: '분석' },
    { id: 'calendar', icon: Calendar, label: '캘린더' },
    { id: 'messages', icon: Mail, label: '메시지' },
    { id: 'settings', icon: Settings, label: '설정' }
  ]

  return (
    <div
      className={`${
        isCollapsed ? 'w-16' : 'w-60'
      } bg-white transition-all duration-300 ease-in-out flex flex-col overflow-hidden border-r border-gray-200`}
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        {!isCollapsed && (
          <div className="ml-3 flex items-center space-x-2 opacity-100 transition-opacity duration-200">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-gray-900 whitespace-nowrap">AppName</span>
          </div>
        )}
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
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
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
        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xs">홍</span>
          </div>
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0 opacity-100 transition-opacity duration-200">
            <p className="text-sm font-semibold text-gray-900 truncate">홍길동</p>
            <p className="text-xs text-gray-500 truncate">hong@example.com</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SideBar
