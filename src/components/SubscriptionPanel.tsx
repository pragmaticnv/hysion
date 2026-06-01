import React from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { useStore } from '../store/useStore';

const PLANS = [
  {
    name: 'Individual',
    price: '₹199',
    duration: '/month',
    features: ['Access to all 3D Holograms', 'Personalized AI Tutor', 'Unlimited 3D Analysis', 'NCERT Book Integration'],
    buttonText: 'Subscribe Now',
  },
  {
    name: 'Institution',
    price: '₹24,999',
    duration: '/year',
    features: ['Unlimited Student Licenses', 'Advanced Admin Control', 'Custom Curriculum Builder', '24/7 Priority Support', 'Institution Branding'],
    buttonText: 'Contact Sales',
    popular: true,
  },
  {
    name: 'Coaching Centre',
    price: '₹19,999',
    duration: '/year',
    features: ['Batch Management', 'Student Performance Tracking', 'Classroom Air-Draw Tool', 'Batchwise Saved Holograms'],
    buttonText: 'Contact Sales',
  },
];

export function SubscriptionPanel() {
  const { setIsSubscriptionOpen, theme } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className={`w-full max-w-6xl ${theme.uiBg} border ${theme.border} rounded-3xl p-8 shadow-2xl relative`}>
        <button 
          onClick={() => setIsSubscriptionOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-zinc-400"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-4xl font-display font-bold text-white text-center mb-12">Choose Your Learning Plan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`flex flex-col p-6 rounded-2xl border ${plan.popular ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5'}`}>
              {plan.popular && <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Most Popular</span>}
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-white mb-1">{plan.price}</div>
              <div className="text-sm text-zinc-400 mb-6">{plan.duration}</div>
              
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check size={16} className="text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
