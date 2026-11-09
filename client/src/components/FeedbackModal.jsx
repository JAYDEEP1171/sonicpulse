import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Send, X, CheckCircle, Sparkles, Heart } from 'lucide-react';
import { submitFeedback } from '../services/supabase';

const CATEGORIES = [
  { id: 'artist_request', label: '🎤 Add an Artist' },
  { id: 'ui_suggestion', label: '🎨 UI / Animation' },
  { id: 'bug', label: '🐛 Report a Bug' },
  { id: 'general', label: '💡 General Thought' },
];

export default function FeedbackModal({ isOpen, onClose, user, defaultCategory = 'general' }) {
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState(defaultCategory);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    await submitFeedback({
      userId: user?.id || null,
      username: user?.username || user?.name || 'Superfan',
      rating,
      category,
      message: message.trim(),
    });

    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      onClose();
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="w-full sm:max-w-md bg-[#13141B] border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <MessageSquare size={16} />
              </div>
              <h3 className="font-display font-black text-lg text-white">
                Help Us Improve
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-10 flex flex-col items-center justify-center text-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center shadow-[0_0_30px_rgba(114,254,143,0.4)]">
                <CheckCircle size={32} />
              </div>
              <h4 className="font-display font-black text-xl text-white">Thank You!</h4>
              <p className="text-xs text-white/60 max-w-xs">
                Your feedback helps us shape the next drops, artists, and features.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating */}
              <div className="flex flex-col items-center space-y-1.5 pt-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                  Rate Your Experience
                </span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform active:scale-90 hover:scale-110"
                    >
                      <Star
                        size={26}
                        className={
                          star <= rating
                            ? 'text-[#FBBF24] fill-[#FBBF24] drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                            : 'text-white/20'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Pills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">
                  Category
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-left truncate ${
                        category === cat.id
                          ? 'bg-primary text-black border-primary font-bold shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/5'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">
                  Your Suggestions / Thoughts
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Please add Talwiinder and Karan Aujla, or make swipe gestures even faster..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40 resize-none font-medium"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="w-full py-3 px-5 rounded-2xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(114,254,143,0.3)] transition-all active:scale-95 cursor-pointer"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send Feedback</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
