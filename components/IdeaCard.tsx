'use client';

import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface Idea {
  id: string;
  text: string;
  votes: number;
  createdAt: string;
}

interface IdeaCardProps {
  idea: Idea;
  onUpvote: (id: string) => Promise<void>;
  hasUpvoted?: boolean;
}

export default function IdeaCard({ idea, onUpvote, hasUpvoted = false }: IdeaCardProps) {
  const handleUpvote = async () => {
    if (!hasUpvoted) {
      await onUpvote(idea.id);
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <p className="text-gray-800 dark:text-gray-200 text-lg mb-4 leading-relaxed">{idea.text}</p>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
        </span>

        <motion.button
          onClick={handleUpvote}
          disabled={hasUpvoted}
          className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-all shadow-sm ${
            hasUpvoted
              ? 'bg-gray-400 dark:bg-gray-600 text-gray-100 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600'
          }`}
          whileHover={{ scale: hasUpvoted ? 1 : 1.05 }}
          whileTap={{ scale: hasUpvoted ? 1 : 0.95 }}
          title={hasUpvoted ? 'You already upvoted this idea' : 'Upvote this idea'}
        >
          <span className="text-xl">{hasUpvoted ? '✓' : '👍'}</span>
          <span>{idea.votes}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

