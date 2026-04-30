/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star, Utensils, MessageSquare, Eye, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Review {
  stars: number;
  note: string;
  timestamp: string;
}

export default function App() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [note, setNote] = useState('');
  const [visitCount, setVisitCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Check for Arabic direction
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    
    // Increment visit count on load
    fetch('/api/increment-visit', { method: 'POST' })
      .then(res => res.json())
      .then(data => setVisitCount(data.count))
      .catch(err => console.error('Failed to increment visit', err));

    // Fetch initial reviews
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => setRecentReviews(data))
      .catch(err => console.error('Failed to fetch reviews', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('الرجاء اختيار تقييم بالنجوم');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stars: rating, note }),
      });
      
      if (response.ok) {
        setSubmitted(true);
        // Refresh reviews
        const reviewsRes = await fetch('/api/reviews');
        const reviewsData = await reviewsRes.json();
        setRecentReviews(reviewsData);
        
        // Reset form
        setTimeout(() => {
          setSubmitted(false);
          setRating(0);
          setNote('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting review', error);
      alert('حدث خطأ أثناء إرسال التقييم');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#FFD700] selection:text-[#0a0a0a] relative overflow-x-hidden">
      {/* Decorative Octopus Background Pattern */}
      <div className="absolute top-[-10%] left-[-10%] opacity-[0.03] pointer-events-none">
        <svg width="600" height="600" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C9.5 2 7.5 4 7.5 6.5C7.5 7.6 7.9 8.6 8.5 9.4C6.2 10.3 4.5 12.4 4.5 15C4.5 15.3 4.5 15.6 4.6 15.9C3.1 16.3 2 17.7 2 19.5C2 21.4 3.6 23 5.5 23C7.4 23 9 21.4 9 19.5C9 18.6 8.7 17.8 8.1 17.2C8.4 17.1 8.7 17 9 17H15C15.3 17 15.6 17.1 15.9 17.2C15.3 17.8 15 18.6 15 19.5C15 21.4 16.6 23 18.5 23C20.4 23 22 21.4 22 19.5C22 17.7 20.9 16.3 19.4 15.9C19.5 15.6 19.5 15.3 19.5 15C19.5 12.4 17.8 10.3 15.5 9.4C16.1 8.6 16.5 7.6 16.5 6.5C16.5 4 14.5 2 12 2M12 4C13.4 4 14.5 5.1 14.5 6.5C14.5 7.9 13.4 9 12 9C10.6 9 9.5 7.9 9.5 6.5C9.5 5.1 10.6 4 12 4M5.5 21C4.7 21 4 20.3 4 19.5C4 18.7 4.7 18 5.5 18C6.3 18 7 18.7 7 19.5C7 20.3 6.3 21 5.5 21M18.5 21C17.7 21 17 20.3 17 19.5C17 18.7 17.7 18 18.5 18C19.3 18 20 18.7 20 19.5C20 20.3 19.3 21 18.5 21Z"/>
        </svg>
      </div>

      {/* Top Navigation */}
      <nav className="px-12 py-8 flex justify-between items-center z-10 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center text-[#0a0a0a] font-bold text-xl">
            A
          </div>
          <span className="text-xl md:text-2xl font-serif tracking-wide">الشاذلي للأسماك 🐙</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-white/50">
          <span className="text-[#FFD700]">الرئيسية</span>
          <span>قائمة الطعام</span>
          <span>عن المطعم</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Hero & Info Section */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="inline-block px-4 py-1 border border-[#FFD700]/30 rounded-full text-[10px] text-[#FFD700] uppercase tracking-[0.2em]">
            تجربة تذوق فريدة
          </div>
          <h1 className="text-6xl md:text-8xl font-serif leading-[1.1] text-white">
            الشاذلي للأسماك <br/>
            <span className="text-[#FFD700]">مزاج الأخطبوط 🐙</span>
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-md">
            نحن نؤمن بأن الطعام ليس مجرد وجبة، بل هو رحلة في عالم الحواس. شاركنا تجربتك وساهم في تحسين مزاج الأخطبوط.
          </p>
          
          <div className="flex gap-12 pt-12 border-t border-white/10">
            <div>
              <div className="text-4xl font-light text-white">{visitCount.toLocaleString()}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">إجمالي الزيارات</div>
            </div>
            <div>
              <div className="text-4xl font-light text-white">4.9</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">متوسط التقييم</div>
            </div>
          </div>
        </motion.section>

        {/* Interaction Column */}
        <div className="space-y-12">
          {/* Review Form Card */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#161616] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group"
          >
            <h2 className="text-2xl font-serif mb-8 text-center">اترك انطباعك</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Star Rating */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="transition-transform active:scale-90"
                    >
                      <Star
                        size={32}
                        className={`transition-colors duration-200 ${
                          star <= (hover || rating) 
                            ? "fill-[#FFD700] text-[#FFD700]" 
                            : "text-white/10"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest">اختر عدد النجوم</span>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label htmlFor="note" className="text-[11px] text-white/50 uppercase tracking-widest px-1 block">ملاحظاتك</label>
                <textarea
                  id="note"
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="كيف كانت تجربتك مع أطباقنا؟..."
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#FFD700]/50 transition-all resize-none text-right placeholder:text-white/20"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || submitted}
                className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
                  submitted 
                    ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                    : "bg-[#FFD700] text-[#0a0a0a] hover:bg-[#ffed4a] shadow-xl shadow-[#FFD700]/10"
                }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                ) : submitted ? (
                  <>
                    تم الإرسال بنجاح
                    <CheckCircle2 size={18} />
                  </>
                ) : (
                  <>
                    إرسال التقييم
                    <Send size={18} className="rotate-180" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse" />
                <p className="text-[10px] text-white/40 tracking-tight">
                  سيتم إرسال تقييمك وملاحظاتك مباشرة إلى الإدارة
                </p>
              </div>
            </form>
          </motion.section>

          {/* Recent Reviews List */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-serif">آخر التقييمات</h3>
              <div className="h-px bg-white/10 flex-grow mx-4"></div>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {recentReviews.length === 0 ? (
                  <div className="text-center py-10 opacity-20 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-xs uppercase tracking-widest">لا توجد تقييمات بعد</p>
                  </div>
                ) : (
                  recentReviews.slice().reverse().map((rev, idx) => (
                    <motion.div
                      key={rev.timestamp}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 bg-[#161616]/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < rev.stars ? "fill-[#FFD700] text-[#FFD700]" : "text-white/10"}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] opacity-30 font-mono">
                          {new Date(rev.timestamp).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                      <p className="text-right text-sm leading-relaxed text-white/70 whitespace-pre-wrap">{rev.note}</p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center text-white/20 text-[10px] uppercase tracking-[0.4em]">
        الشاذلي &copy; {new Date().getFullYear()} &mdash; كل الحقوق محفوظة لمزاج الأخطبوط
      </footer>
    </div>
  );
}
