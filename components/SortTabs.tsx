'use client';

import { motion } from 'framer-motion';

interface SortTabsProps {
  activeSort: 'top' | 'new';
  onSortChange: (sort: 'top' | 'new') => void;
}

export default function SortTabs({ activeSort, onSortChange }: SortTabsProps) {
  return (
    <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit mx-auto">
      {(['top', 'new'] as const).map((sort) => (
        <button
          key={sort}
          onClick={() => onSortChange(sort)}
          className="relative px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {activeSort === sort && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white dark:bg-gray-700 rounded-lg shadow-md"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10 text-gray-700 dark:text-gray-200">
            {sort === 'top' ? '🔥 Top' : '✨ New'}
          </span>
        </button>
      ))}
    </div>
  );
}

