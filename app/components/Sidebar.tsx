import { useState } from 'react'
import Link from 'next/link'
import { HomeIcon, BeakerIcon, DocumentTextIcon, CodeBracketIcon, DocumentIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import TavilyLogo from './TavilyLogo'
import InvoiceIcon from './icons/InvoiceIcon'
import DocumentationIcon from './icons/DocumentationIcon'

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  return (
    <>
      {/* Hamburger button with animation */}
      <button
        onClick={toggleSidebar}
        className={`
          fixed top-4 z-50 p-2 rounded-md bg-white shadow-md
          transition-all duration-300 ease-in-out
          ${isOpen ? 'left-[256px]' : 'left-4'}
        `}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out
        w-64 h-screen bg-white border-r p-4 flex flex-col
      `}>
        {/* Logo and Title */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-0">
            <TavilyLogo />
            <h1 className="text-xl font-semibold">Tavily AI</h1>
          </Link>
        </div>

        {/* Account Selector */}
        <div className="mb-6">
          <select className="w-full p-2 border rounded-md">
            <option>Personal</option>
          </select>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-2">
          <Link href="/overview" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <HomeIcon className="h-5 w-5 mr-3" />
            <span>Overview</span>
          </Link>

          <Link href="/research-assistant" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <BeakerIcon className="h-5 w-5 mr-3" />
            <span>Research Assistant</span>
          </Link>

          <Link href="/research-reports" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <DocumentTextIcon className="h-5 w-5 mr-3" />
            <span>Research Reports</span>
          </Link>

          <Link href="/api-playground" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <CodeBracketIcon className="h-5 w-5 mr-3" />
            <span>API Playground</span>
          </Link>

          <Link href="/invoices" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <InvoiceIcon className="h-5 w-5 mr-3" />
            <span>Invoices</span>
          </Link>

          <Link href="/documentation" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <DocumentationIcon className="h-5 w-5 mr-3" />
            <span>Documentation</span>
          </Link>
        </nav>

        {/* User Info at Bottom */}
        <div className="mt-auto p-2 flex items-center">
          <span className="text-sm text-gray-600">user@example.com</span>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}

export default Sidebar 