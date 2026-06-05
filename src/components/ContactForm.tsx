"use client";

import React, { useState } from "react";
import { Send, Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { submitContact } from "../services/api";
import { ContactData } from "../types";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState<ContactData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof ContactData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+$/i.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof ContactData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ContactData];
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
      await submitContact(formData);
      setMessage({ type: "success", text: "Thank you for your message. We'll get back to you soon!" });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto bg-brand-cream rounded-3xl overflow-hidden shadow-xl flex flex-col lg:flex-row">
          {/* Contact Info */}
          <div className="lg:w-1/3 bg-brand-green p-12 text-white">
            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
            <p className="text-gray-200 mb-12">
              Have questions about our products or want to know more about our farm? We'd love to hear from you!
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Call Us</p>
                  <p className="font-bold">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Email Us</p>
                  <p className="font-bold">info@mamafarm.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Visit Us</p>
                  <p className="font-bold">Organic Valley, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:w-2/3 p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-brand-green mb-2">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-brand-green`}
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
                    className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-brand-green`}
                    placeholder="Your Email"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-brand-green mb-2">Phone</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-brand-green`}
                    placeholder="Your Phone Number"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-brand-green mb-2">Subject</label>
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.subject ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-brand-green`}
                    placeholder="Subject"
                  />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-green mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-brand-green`}
                  placeholder="Your Message"
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message.text}
                </div>
              )}

              <button
                disabled={isSubmitting}
                type="submit"
                className="btn-primary w-full py-4 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
