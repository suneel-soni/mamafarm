'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { authAPI } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState('8130188878');
  const [password, setPassword] = useState('suraj7264');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authAPI.login(mobile, password);
      if (res.success && res.data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('mamafarm_token', res.data.token || 'jwt_token_8130188878');
        }
        router.push('/dashboard/sales');
      } else {
        setError(res.message || 'Invalid mobile number or password');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#11180d] text-[#FEFEFE] flex items-center justify-center p-4 relative antialiased">
      {/* Ambient Brand Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] h-[320px] bg-[#283C06]/30 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-sm bg-[#162111]/95 border border-[#283C06]/60 rounded-3xl p-6 shadow-2xl relative z-10 backdrop-blur-xl space-y-5">
        {/* App Header & Brand Logo */}
        <div className="text-center space-y-2.5">
          <div className="w-20 h-20 rounded-2xl bg-[#FEFEFE] p-1 mx-auto flex items-center justify-center shadow-2xl shadow-[#283C06]/40 border border-[#8B7E2A]/40">
            <img src="/logo.png" alt="MamaFarm Origin Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-1">
              <span className="font-black text-xl text-[#283C06] bg-[#F4EDD6] px-2 py-0.5 rounded-lg tracking-tight">Mama</span>
              <span className="font-black text-xl text-[#8B7E2A] tracking-tight">Farm</span>
            </div>
            <p className="text-[10px] text-[#8B7E2A] font-semibold italic mt-0.5">Pure Ingredients. True Goodness.</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs p-3 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Mobile Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#8B7E2A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full bg-[#1e2a16] border border-[#283C06]/60 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#FEFEFE] placeholder:text-slate-500 focus:outline-none focus:border-[#8B7E2A] transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8B7E2A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#1e2a16] border border-[#283C06]/60 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#FEFEFE] focus:outline-none focus:border-[#8B7E2A] transition-all"
                required
              />
            </div>
          </div>

          {/* User Info Badge */}
          <div className="bg-[#1e2a16]/80 border border-[#283C06]/60 rounded-xl p-3 text-[11px] text-emerald-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#8B7E2A]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Owner Credential Active</span>
            </div>
            <p className="text-[10px] text-slate-400 pl-5">
              Mobile: <span className="font-mono text-[#8B7E2A] font-bold">8130188878</span>
            </p>
          </div>

          {/* CTA Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#283C06] to-[#8B7E2A] hover:opacity-95 text-[#FEFEFE] font-extrabold text-xs rounded-xl shadow-lg shadow-[#283C06]/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50 border border-[#8B7E2A]/40"
          >
            {loading ? 'Logging in...' : 'Login to Tracker'}
            <ArrowRight className="w-4 h-4 text-[#8B7E2A]" />
          </button>
        </form>

        <div className="text-center text-[10px] text-slate-500 pt-1">
          MamaFarm Organic Sprouts Operational Tracker
        </div>
      </div>
    </div>
  );
}
