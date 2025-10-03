'use client';

import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import IdeaForm from '@/components/IdeaForm';
import IdeaCard from '@/components/IdeaCard';
import SortTabs from '@/components/SortTabs';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Idea {
  id: string;
  text: string;
  votes: number;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function IdeaBoardApp() {
  const [sort, setSort] = useState<'top' | 'new'>('new');
  const [optimisticIdeas, setOptimisticIdeas] = useState<Idea[]>([]);
  const [upvotedIdeas, setUpvotedIdeas] = useState<Set<string>>(new Set());

  // Load upvoted ideas from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('upvotedIdeas');
    if (stored) {
      setUpvotedIdeas(new Set(JSON.parse(stored)));
    }
  }, []);

  const { data, error, isLoading } = useSWR(`/api/ideas?sort=${sort}`, fetcher, {
    refreshInterval: 10000, // Poll every 10 seconds for new ideas
    revalidateOnFocus: true,
  });

  const ideas: Idea[] = data?.ideas || [];
  const displayIdeas = [...optimisticIdeas, ...ideas].filter(
    (idea, index, self) => index === self.findIndex((i) => i.id === idea.id)
  );

  const handleSubmitIdea = async (text: string) => {
    const optimisticIdea: Idea = {
      id: `temp-${Date.now()}`,
      text,
      votes: 0,
      createdAt: new Date().toISOString(),
    };

    setOptimisticIdeas((prev) => [optimisticIdea, ...prev]);

    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create idea');
      }

      // Remove optimistic idea and revalidate
      setOptimisticIdeas((prev) => prev.filter((i) => i.id !== optimisticIdea.id));
      mutate(`/api/ideas?sort=${sort}`);
    } catch (error: unknown) {
      setOptimisticIdeas((prev) => prev.filter((i) => i.id !== optimisticIdea.id));
      throw error;
    }
  };

  const handleUpvote = async (id: string) => {
    // Check if already upvoted
    if (upvotedIdeas.has(id)) {
      return; // Already upvoted, do nothing
    }

    // Optimistic update
    const updatedIdeas = displayIdeas.map((idea) =>
      idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
    );
    setOptimisticIdeas(updatedIdeas.filter((i) => i.id.startsWith('temp-')));

    // Mark as upvoted
    const newUpvoted = new Set(upvotedIdeas);
    newUpvoted.add(id);
    setUpvotedIdeas(newUpvoted);
    localStorage.setItem('upvotedIdeas', JSON.stringify(Array.from(newUpvoted)));

    try {
      const response = await fetch(`/api/ideas/${id}/upvote`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to upvote');
      }

      mutate(`/api/ideas?sort=${sort}`);
    } catch (error) {
      console.error('Error upvoting:', error);
      // Revert upvote on error
      const revertedUpvoted = new Set(upvotedIdeas);
      revertedUpvoted.delete(id);
      setUpvotedIdeas(revertedUpvoted);
      localStorage.setItem('upvotedIdeas', JSON.stringify(Array.from(revertedUpvoted)));
      mutate(`/api/ideas?sort=${sort}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ThemeToggle />

      {/* Header */}
      <header className="px-6 py-6 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition">
            ← The Idea Board
          </Link>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {displayIdeas.length} {displayIdeas.length === 1 ? 'idea' : 'ideas'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-gray-800 dark:text-white">
              Share Your Ideas 💡
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-10 text-lg">
              Post anonymously, upvote what you love, and watch creativity flow
            </p>
          </motion.div>

          <IdeaForm onSubmit={handleSubmitIdea} />

          <SortTabs activeSort={sort} onSortChange={setSort} />

          {/* Ideas Grid */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md animate-pulse"
                >
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">Failed to load ideas. Please try again.</p>
            </div>
          )}

          {!isLoading && !error && displayIdeas.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-4">🤔</div>
              <p className="text-2xl text-gray-600 dark:text-gray-300 mb-2">No ideas yet!</p>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Be the first to share your brilliant thought.
              </p>
            </motion.div>
          )}

          {!isLoading && !error && displayIdeas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayIdeas.map((idea) => (
                <IdeaCard 
                  key={idea.id} 
                  idea={idea} 
                  onUpvote={handleUpvote}
                  hasUpvoted={upvotedIdeas.has(idea.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

