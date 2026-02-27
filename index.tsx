import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Calendar, 
  ChevronLeft, 
  Sparkles,
  Target,
  Zap,
  Coffee,
  ShoppingBag,
  Car,
  Home,
  Gamepad2,
  Gift,
  MoreHorizontal,
  X,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Search,
  Filter,
  CreditCard
} from 'lucide-react';
import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

// --- Types ---
interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

interface UserProfile {
  name: string;
  budget: number;
  onboarded: boolean;
  currency: string;
}

// --- Constants ---
const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: Coffee, color: '#FF6B6B', gradient: 'from-rose-400 to-red-500' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#4ECDC4', gradient: 'from-teal-400 to-cyan-500' },
  { id: 'transport', label: 'Transport', icon: Car, color: '#45B7D1', gradient: 'from-sky-400 to-blue-500' },
  { id: 'housing', label: 'Housing', icon: Home, color: '#96CEB4', gradient: 'from-emerald-400 to-green-500' },
  { id: 'entertainment', label: 'Fun', icon: Gamepad2, color: '#DDA0DD', gradient: 'from-purple-400 to-violet-500' },
  { id: 'gifts', label: 'Gifts', icon: Gift, color: '#FFD93D', gradient: 'from-amber-400 to-yellow-500' },
  { id: 'other', label: 'Other', icon: MoreHorizontal, color: '#6C757D', gradient: 'from-gray-400 to-slate-500' },
];

const FLOATING_ANIMATION = {
  y: [0, -10, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const FLOATING_ANIMATION_DELAYED = {
  y: [0, -15, 0],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
    delay: 1
  }
};

// --- Components ---

// 1. Onboarding Component with Physics Feel
const Onboarding: React.FC<{ onComplete: (profile: UserProfile) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onComplete({
        name,
        budget: parseFloat(budget) || 5000,
        onboarded: true,
        currency: '$'
      });
    }, 800);
  };

  const steps = [
    {
      title: "Welcome to ZeroGravity",
      subtitle: "Where your finances float into place",
      content: (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-32 h-32"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl blur-xl opacity-50" />
            <div className="relative w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Wallet className="w-16 h-16 text-white" />
            </div>
            <motion.div 
              className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-yellow-900" />
            </motion.div>
          </motion.div>
          <p className="text-center text-gray-400 text-sm max-w-xs">
            Experience weightless money management with physics-based interactions
          </p>
        </motion.div>
      )
    },
    {
      title: "What's your name?",
      subtitle: "Let's personalize your experience",
      content: (
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full max-w-xs"
        >
          <div className="relative group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-all text-lg text-center"
              autoFocus
            />
            <motion.div 
              className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-xl -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity"
            />
          </div>
        </motion.div>
      )
    },
    {
      title: "Monthly Budget",
      subtitle: "Set your spending limit",
      content: (
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full max-w-xs"
        >
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="5000"
              className="w-full pl-10 pr-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-all text-lg text-center"
            />
          </div>
          <div className="flex gap-2 mt-4 justify-center">
            {[1000, 3000, 5000, 10000].map((amt) => (
              <motion.button
                key={amt}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBudget(amt.toString())}
                className="px-4 py-2 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10 hover:bg-violet-500/20 hover:border-violet-500/50 transition-colors"
              >
                ${amt}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Progress */}
        <div className="flex gap-2 mb-12 justify-center">
          {steps.map((_, idx) => (
            <motion.div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx <= step ? 'w-8 bg-violet-500' : 'w-2 bg-white/20'
              }`}
              initial={false}
              animate={{ 
                backgroundColor: idx <= step ? '#8b5cf6' : 'rgba(255,255,255,0.2)',
                width: idx <= step ? 32 : 8
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, rotateX: 15 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="flex flex-col items-center gap-8"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">{steps[step].title}</h1>
              <p className="text-gray-400">{steps[step].subtitle}</p>
            </div>

            {steps[step].content}

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (step < steps.length - 1) setStep(step + 1);
                else handleSubmit();
              }}
              disabled={step === 1 && !name.trim()}
              className="mt-8 w-full max-w-xs py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl text-white font-semibold shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              <span>{step === steps.length - 1 ? 'Launch App' : 'Continue'}</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// 2. Floating Card Component with Physics
const FloatingCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  intensity?: 'low' | 'medium' | 'high';
}> = ({ children, className = '', delay = 0, intensity = 'medium' }) => {
  const intensityMap = {
    low: { y: [0, -5, 0], rotate: [-1, 1, -1] },
    medium: { y: [0, -10, 0], rotate: [-2, 2, -2] },
    high: { y: [0, -15, 0], rotate: [-3, 3, -3] }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: intensityMap[intensity].y,
        rotate: intensityMap[intensity].rotate
      }}
      transition={{
        y: {
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay
        },
        rotate: {
          duration: 6 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay
        },
        opacity: { duration: 0.5 }
      }}
      whileHover={{ 
        scale: 1.02, 
        rotate: 0,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 3. Expense Item with Swipe Actions
const ExpenseItem: React.FC<{
  expense: Expense;
  onDelete: (id: string) => void;
  currency: string;
}> = ({ expense, onDelete, currency }) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0], [0.5, 1]);
  const background = useTransform(
    x,
    [-150, 0],
    ["rgba(239, 68, 68, 0.2)", "rgba(255, 255, 255, 0.05)"]
  );

  const category = CATEGORIES.find(c => c.id === expense.category) || CATEGORIES[6];
  const Icon = category.icon;

  return (
    <motion.div
      style={{ x, opacity, background }}
      drag="x"
      dragConstraints={{ left: -100, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, info) => {
        if (info.offset.x < -80) {
          onDelete(expense.id);
        }
      }}
      className="relative mb-3 rounded-2xl overflow-hidden touch-pan-y"
    >
      <div className="absolute inset-0 bg-red-500/20 flex items-center justify-end pr-6">
        <Trash2 className="w-6 h-6 text-red-400" />
      </div>
      
      <motion.div 
        className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4"
        whileTap={{ scale: 0.98 }}
      >
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate">{expense.description || category.label}</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
        
        <div className={`text-right ${expense.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
          <span className="text-lg font-bold">
            {expense.type === 'income' ? '+' : '-'}{currency}{expense.amount.toFixed(2)}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// 4. Add Expense Modal with Physics
const AddExpenseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: Omit<Expense, 'id'>) => void;
  currency: string;
}> = ({ isOpen, onClose, onAdd, currency }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('food');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription('');
      setCategory('food');
      setType('expense');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      onAdd({
        amount: parseFloat(amount),
        description,
        category,
        type,
        date: new Date().toISOString()
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-white/10 rounded-t-3xl z-50 max-h-[90vh] overflow-auto"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Add Transaction</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 bg-white/5 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              {/* Type Toggle */}
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setType('expense')}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    type === 'expense' 
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg' 
                      : 'text-gray-400'
                  }`}
                >
                  Expense
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setType('income')}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    type === 'income' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                      : 'text-gray-400'
                  }`}
                >
                  Income
                </motion.button>
              </div>

              {/* Amount Input */}
              <div className="relative">
                <motion.div 
                  animate={{ 
                    boxShadow: ['0 0 0px rgba(139, 92, 246, 0)', '0 0 30px rgba(139, 92, 246, 0.3)', '0 0 0px rgba(139, 92, 246, 0)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl"
                />
                <div className="relative flex items-center justify-center py-8 bg-white/5 rounded-2xl border-2 border-white/10 focus-within:border-violet-500 transition-colors">
                  <span className="text-3xl text-gray-400 mr-2">{currency}</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-transparent text-5xl font-bold text-white text-center w-48 focus:outline-none placeholder-gray-600"
                    autoFocus
                  />
                </div>
              </div>

              {/* Category Grid */}
              <div>
                <label className="text-sm text-gray-400 mb-3 block">Category</label>
                <div className="grid grid-cols-4 gap-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <motion.button
                        key={cat.id}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCategory(cat.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                          isSelected 
                            ? 'bg-white/10 border-2 border-violet-500 shadow-lg shadow-violet-500/20' 
                            : 'bg-white/5 border-2 border-transparent'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${cat.gradient} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[10px] text-gray-300">{cat.label.split(' ')[0]}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-gray-400 mb-3 block">Description (Optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this for?"
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!amount || isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-semibold shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Transaction
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// 5. Main Dashboard
const Dashboard: React.FC<{ profile: UserProfile; onReset: () => void }> = ({ profile, onReset }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'profile'>('home');
  const [showNotification, setShowNotification] = useState(true);

  // Load sample data
  useEffect(() => {
    const sampleExpenses: Expense[] = [
      { id: '1', amount: 45.50, category: 'food', description: 'Lunch with team', date: new Date(Date.now() - 86400000).toISOString(), type: 'expense' },
      { id: '2', amount: 1200, category: 'housing', description: 'Monthly rent', date: new Date(Date.now() - 172800000).toISOString(), type: 'expense' },
      { id: '3', amount: 85, category: 'shopping', description: 'New sneakers', date: new Date(Date.now() - 259200000).toISOString(), type: 'expense' },
      { id: '4', amount: 2500, category: 'other', description: 'Freelance payment', date: new Date(Date.now() - 345600000).toISOString(), type: 'income' },
    ];
    setExpenses(sampleExpenses);
  }, []);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    setExpenses([newExpense, ...expenses]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const totalExpenses = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpenses;
  const budgetProgress = (totalExpenses / profile.budget) * 100;

  const chartData = CATEGORIES.map(cat => ({
    name: cat.label,
    value: expenses.filter(e => e.category === cat.id && e.type === 'expense').reduce((sum, e) => sum + e.amount, 0),
    color: cat.color
  })).filter(d => d.value > 0);

  const recentExpenses = expenses.slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 -left-20 w-60 h-60 bg-fuchsia-600/10 rounded-full blur-3xl"
        />
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-4 right-4 z-40 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Welcome back, {profile.name}!</p>
              <p className="text-xs text-gray-400">You've spent {profile.currency}{totalExpenses.toFixed(2)} this month</p>
            </div>
            <button onClick={() => setShowNotification(false)} className="p-1 hover:bg-white/10 rounded-full">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-md mx-auto px-4 pt-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-gray-400 text-sm"
            >
              Good morning,
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold"
            >
              {profile.name} 👋
            </motion.h1>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center relative"
          >
            <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full" />
            <Target className="w-5 h-5 text-gray-300" />
          </motion.button>
        </div>

        {/* Balance Card */}
        <FloatingCard className="mb-6" intensity="high">
          <div className="relative bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 rounded-3xl p-6 shadow-2xl shadow-violet-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative z-10">
              <p className="text-violet-100 text-sm mb-1">Total Balance</p>
              <h2 className="text-4xl font-bold text-white mb-6">{profile.currency}{balance.toFixed(2)}</h2>
              
              <div className="flex gap-4">
                <div className="flex-1 bg-white/20 backdrop-blur-xl rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-emerald-400/20 rounded-full flex items-center justify-center">
                      <ArrowUpRight className="w-3 h-3 text-emerald-300" />
                    </div>
                    <span className="text-xs text-violet-100">Income</span>
                  </div>
                  <p className="text-lg font-semibold text-white">{profile.currency}{totalIncome.toFixed(0)}</p>
                </div>
                
                <div className="flex-1 bg-white/20 backdrop-blur-xl rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-rose-400/20 rounded-full flex items-center justify-center">
                      <ArrowDownRight className="w-3 h-3 text-rose-300" />
                    </div>
                    <span className="text-xs text-violet-100">Expense</span>
                  </div>
                  <p className="text-lg font-semibold text-white">{profile.currency}{totalExpenses.toFixed(0)}</p>
                </div>
              </div>
            </div>
          </div>
        </FloatingCard>

        {/* Budget Progress */}
        <FloatingCard delay={0.2} className="mb-6" intensity="low">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Monthly Budget</p>
                  <p className="text-xs text-gray-400">{profile.currency}{totalExpenses.toFixed(0)} of {profile.currency}{profile.budget}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-white">{Math.min(budgetProgress, 100).toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(budgetProgress, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${budgetProgress > 90 ? 'bg-gradient-to-r from-red-500 to-rose-500' : 'bg-gradient-to-r from-violet-500 to-fuchsia-500'}`}
              />
            </div>
          </div>
        </FloatingCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { icon: Plus, label: 'Add', color: 'from-violet-500 to-fuchsia-500', onClick: () => setIsAddModalOpen(true) },
            { icon: PieChart, label: 'Stats', color: 'from-blue-500 to-cyan-500', onClick: () => setActiveTab('stats') },
            { icon: CreditCard, label: 'Cards', color: 'from-emerald-500 to-teal-500', onClick: () => {} },
            { icon: MoreHorizontal, label: 'More', color: 'from-gray-500 to-slate-500', onClick: () => {} },
          ].map((action, idx) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              onClick={action.onClick}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gray-400">{action.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Recent</h3>
          <motion.button 
            whileHover={{ x: 5 }}
            className="text-sm text-violet-400 flex items-center gap-1"
          >
            See all <ChevronLeft className="w-4 h-4 rotate-180" />
          </motion.button>
        </div>

        <div className="space-y-3 pb-20">
          <AnimatePresence mode="popLayout">
            {recentExpenses.map((expense) => (
              <ExpenseItem 
                key={expense.id} 
                expense={expense} 
                onDelete={deleteExpense}
                currency={profile.currency}
              />
            ))}
          </AnimatePresence>
          
          {recentExpenses.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-600" />
              </div>
              <p>No transactions yet</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full shadow-lg shadow-violet-500/40 flex items-center justify-center z-30"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 px-6 py-4 z-40">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {[
            { id: 'home', icon: Wallet, label: 'Home' },
            { id: 'stats', icon: PieChart, label: 'Stats' },
            { id: 'search', icon: Search, label: 'Search' },
            { id: 'profile', icon: Target, label: 'Profile' },
          ].map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => item.id === 'home' || item.id === 'stats' ? setActiveTab(item.id as any) : null}
              className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-violet-400' : 'text-gray-500'}`}
            >
              <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'fill-current' : ''}`} />
              <span className="text-[10px]">{item.label}</span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="navIndicator"
                  className="absolute -bottom-4 w-1 h-1 bg-violet-400 rounded-full"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats View */}
      <AnimatePresence>
        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 bg-slate-950 z-50 overflow-auto pb-24"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveTab('home')}
                  className="p-2 bg-white/5 rounded-xl"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </motion.button>
                <h1 className="text-2xl font-bold text-white">Statistics</h1>
              </div>

              {/* Chart */}
              <div className="bg-white/5 rounded-3xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Spending by Category</h3>
                {chartData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ReTooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value: number) => [`${profile.currency}${value}`, 'Amount']}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {chartData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-300 truncate">{item.name}</span>
                      <span className="text-sm text-white ml-auto">{profile.currency}{item.value.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Trend */}
              <div className="bg-white/5 rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Weekly Trend</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { day: 'Mon', amount: 45 },
                      { day: 'Tue', amount: 120 },
                      { day: 'Wed', amount: 85 },
                      { day: 'Thu', amount: 0 },
                      { day: 'Fri', amount: 200 },
                      { day: 'Sat', amount: 150 },
                      { day: 'Sun', amount: 65 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis hide />
                      <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AddExpenseModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={addExpense}
        currency={profile.currency}
      />
    </div>
  );
};

// 6. Main App Component
const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved profile
    const saved = localStorage.getItem('expenseProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  const handleSetProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('expenseProfile', JSON.stringify(newProfile));
  };

  const handleReset = () => {
    setProfile(null);
    localStorage.removeItem('expenseProfile');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!profile?.onboarded) {
    return <Onboarding onComplete={handleSetProfile} />;
  }

  return <Dashboard profile={profile} onReset={handleReset} />;
};

export default App;
