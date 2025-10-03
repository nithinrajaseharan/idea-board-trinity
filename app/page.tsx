'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const features = [
    {
      icon: '💡',
      title: 'Share Your Ideas',
      description: 'Post your brilliant thoughts and creative concepts anonymously for the world to see.',
    },
    {
      icon: '👍',
      title: 'Vote & Support',
      description: 'Upvote ideas you love and help the best concepts rise to the top.',
    },
    {
      icon: '🚀',
      title: 'Real-Time Updates',
      description: 'Watch ideas flow in live and see the community react instantly.',
    },
    {
      icon: '🌍',
      title: 'Global Community',
      description: 'Connect with creative minds from around the world, completely anonymously.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ThemeToggle />

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-32 sm:pt-32 sm:pb-40">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              The Idea Board
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
              A vibrant space where creativity meets community. Share your ideas, vote on what resonates, and discover
              brilliant thoughts from minds around the world.
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-12">
              No sign-up. No tracking. Just pure, anonymous creativity.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/app"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all"
              >
                Start Sharing Ideas 🚀
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute inset-0 -z-10 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1.5 }}
          >
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-800 dark:text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why The Idea Board?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
              Ready to Share Your Genius?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
              Join thousands of creative thinkers sharing their ideas every day.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/app"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all"
              >
                Launch The Board 💫
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>Built with ❤️ for creative minds everywhere</p>
      </footer>
    </div>
  );
}
