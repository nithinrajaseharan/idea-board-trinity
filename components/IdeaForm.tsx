'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface IdeaFormProps {
  onSubmit: (text: string) => Promise<void>;
}

export default function IdeaForm({ onSubmit }: IdeaFormProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (text.trim().length === 0) {
      setError('Please enter an idea');
      return;
    }

    if (text.length > 280) {
      setError('Idea must be 280 characters or less');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(text);
      setText('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit idea';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const charsLeft = 280 - text.length;
  const isValid = text.trim().length > 0 && text.length <= 280;

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your brilliant idea..."
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none transition-colors"
          rows={3}
          maxLength={280}
        />
        <div className="flex justify-between items-center mt-2">
          <span
            className={`text-sm font-medium ${
              charsLeft < 20
                ? 'text-red-500'
                : charsLeft < 50
                ? 'text-yellow-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {charsLeft} characters left
          </span>
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
        whileHover={{ scale: isValid && !isSubmitting ? 1.02 : 1 }}
        whileTap={{ scale: isValid && !isSubmitting ? 0.98 : 1 }}
      >
        {isSubmitting ? 'Submitting...' : 'Share Idea 💡'}
      </motion.button>
    </motion.form>
  );
}

