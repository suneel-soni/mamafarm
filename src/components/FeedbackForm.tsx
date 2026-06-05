"use client";

import React, { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { submitFeedback } from "../services/api";
import { FeedbackData } from "../types";

const FeedbackForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<string, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+$/i.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (!formData.feedback.trim()) newErrors.feedback = "Feedback is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setMessage(null);
    try {
      await submitFeedback({ ...formData, rating });
      setMessage({ type: "success", text: "Thank you for your valuable feedback!" });
      setFormData({
        name: "",
        email: "",
        feedback: "",
      });
      setRating(5);
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-brand-green/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-brand-green mb-4">Customer Feedback</h2>
          <p className="text-gray-600 mb-12">Your feedback helps us grow and serve you better.</p>
          
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg text-left">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-brand-green mb-2">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green"
                    placeholder="Your Name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-green mb-2">Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green"
                    placeholder="Your Email"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-green mb-2 text-center">Your Rating</label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        size={40}
                        className={star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-green mb-2">Your Feedback</label>
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="Tell us what you think..."
                ></textarea>
                {errors.feedback && <p className="text-red-500 text-xs mt-1">{errors.feedback}</p>}
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message.text}
                </div>
              )}

              <button
                disabled={isSubmitting}
                type="submit"
                className="btn-primary w-full py-4 flex items-center justify-center"
              >
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackForm;
