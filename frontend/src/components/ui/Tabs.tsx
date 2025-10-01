import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({ tabs, activeTab, onTabChange, children, className }: TabsProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex items-center whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {tab.icon && (
                  <tab.icon className={cn(
                    'h-4 w-4 mr-2',
                    isActive ? 'text-primary-500' : 'text-gray-400'
                  )} />
                )}
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {children}
      </div>
    </div>
  )
}

interface TabPanelProps {
  tabId: string
  activeTab: string
  children: React.ReactNode
  className?: string
}

export function TabPanel({ tabId, activeTab, children, className }: TabPanelProps) {
  if (tabId !== activeTab) return null
  
  return (
    <div className={cn('w-full', className)}>
      {children}
    </div>
  )
}