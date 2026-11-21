"use client";

import React, { useState } from 'react';
import { ProductReview } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { Star, MessageSquarePlus, CheckCircle2, User } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
  reviews?: ProductReview[];
}

export function ProductReviews({ productId, reviews = [] }: ProductReviewsProps) {
  const { addReview } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;

    addReview(productId, {
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
    });

    setSubmitted(true);
    setComment('');
    setUserName('');
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
    }, 1500);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Verified Customer Reviews ({reviews.length})
          </h4>
          <p className="text-[11px] text-slate-500">Real feedback from verified home cleaner buyers</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 transition-colors flex items-center gap-1.5"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-fadeIn">
          {submitted ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your verified review has been published.</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Roy"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Rating</label>
                  <div className="flex items-center gap-1 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 text-slate-300 hover:text-amber-400"
                      >
                        <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">{rating} / 5</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Review & Cleaning Experience</label>
                <textarea
                  required
                  rows={2}
                  placeholder="How well did it clean your floors/tiles? How is the fragrance?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                Submit Review
              </button>
            </>
          )}
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-2.5">
        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="p-3 bg-white border border-slate-100 rounded-2xl space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                    <User className="w-3 h-3" />
                  </span>
                  <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                  {rev.verifiedBuyer && (
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded-full border border-emerald-200 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Verified Buyer
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">{rev.date}</span>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
