// This Week - Stable Utility First Version
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from "framer-motion";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface Goal {
  title: string;
  target: number;
  deadline: string;
  saved: number;
}

type Page = "onboarding" | "home" | "goal" | "analytics";

/* ---------------- Helpers ---------------- */

const getMonday = () => {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const autoCategory = (title: string) => {
  const t = title.toLowerCase();
  if (["canteen", "coffee", "zomato"].some(k => t.includes(k))) return "Food";
  if (["metro", "auto"].some(k => t.includes(k))) return "Travel";
  if (["notes"].some(k => t.includes(k))) return "Academics";
  if (["gym", "netflix", "sutta"].some(k => t.includes(k))) return "Lifestyle";
  if (t.includes("friends")) return "Friends";
  return "Lifestyle";
};

export default function App() {
  // 1. Lazy Initialization: Load directly from localStorage on the very first render.
  // This prevents the "flash of 0" glitch and stops the app from accidentally overwriting data.
  const [name, setName] = useState(() => localStorage.getItem("tw-name") || "");
  const [pocketMoney, setPocketMoney] = useState(() => Number(localStorage.getItem("tw-pocket")) || 0);
  const [page, setPage] = useState<Page>(() => localStorage.getItem("tw-name") ? "home" : "onboarding");
  
  const [weeklyIncome, setWeeklyIncome] = useState(() => Number(localStorage.getItem("tw-weekly-income")) || 0);
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("tw-expenses");
    return saved ? JSON.parse(saved) : [];
  });
  const [goal, setGoal] = useState<Goal | null>(() => {
    const saved = localStorage.getItem("tw-goal");
    return saved ? JSON.parse(saved) : null;
  });

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");

  const [showIncomeInput, setShowIncomeInput] = useState(false);
  const [incomeInput, setIncomeInput] = useState("");

  /* ---------------- Load & Reset ---------------- */

  useEffect(() => {
    // Weekly reset (safe + deterministic)
    const lastReset = localStorage.getItem("tw-reset");
    const monday = getMonday();
    
    // Only runs if a new Monday has passed since last reset
    if (!lastReset || new Date(lastReset) < monday) {
      const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
      const leftover = pocketMoney + weeklyIncome - totalSpent;

      if (goal && leftover > 0) {
        setGoal({ ...goal, saved: goal.saved + leftover });
      }

      setExpenses([]);
      setWeeklyIncome(0);
      localStorage.setItem("tw-reset", new Date().toISOString());
    }
  }, []); // Empty dependency array -> Only runs once on app open

  // Auto-save effects (Now 100% safe because the state starts with the correct data)
  useEffect(() => {
    localStorage.setItem("tw-expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    if (goal) localStorage.setItem("tw-goal", JSON.stringify(goal));
    else localStorage.removeItem("tw-goal");
  }, [goal]);

  useEffect(() => {
    localStorage.setItem("tw-weekly-income", weeklyIncome.toString());
  }, [weeklyIncome]);

  /* ---------------- Calculations ---------------- */

  const totalSpent = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses]
  );

  const remaining = Math.max(pocketMoney + weeklyIncome - totalSpent, 0);

  const motionValue = useMotionValue(remaining);
  const spring = useSpring(motionValue, { stiffness: 140, damping: 25 });
  
  // Create a live-updating display value that tracks the spring
  const displayRemaining = useTransform(spring, (val) => `₹${Math.round(val)}`);

  useEffect(() => {
    motionValue.set(remaining);
  }, [remaining]);

  /* ---------------- Actions ---------------- */

  const addExpense = () => {
    if (!title || !amount) return;

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      title,
      amount: Number(amount),
      category: autoCategory(title),
      date: new Date().toISOString(),
    };

    setExpenses(prev => [newExpense, ...prev]);
    setTitle("");
    setAmount("");
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const createGoal = () => {
    if (!goalTitle || !goalTarget || !goalDeadline) return;
    setGoal({
      title: goalTitle,
      target: Number(goalTarget),
      deadline: goalDeadline,
      saved: 0,
    });
    setGoalTitle("");
    setGoalTarget("");
    setGoalDeadline("");
  };

  const clearGoal = () => {
    setGoal(null);
    localStorage.removeItem("tw-goal");
  };

  /* ---------------- Pages ---------------- */

  if (page === "onboarding") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-sm space-y-6">
          <h1 className="text-3xl font-semibold text-center">This Week</h1>
          <input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />
          <input
            type="number"
            placeholder="Weekly Pocket Money (₹)"
            value={pocketMoney || ""}
            onChange={(e) => setPocketMoney(Number(e.target.value))}
            className="w-full px-4 py-3 border rounded-xl"
          />
          <button
            onClick={() => {
              if (!name || !pocketMoney) return;
              localStorage.setItem("tw-name", name);
              localStorage.setItem("tw-pocket", pocketMoney.toString());
              setPage("home");
            }}
            className="w-full py-3 rounded-xl bg-black text-white"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  if (page === "analytics") {
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    return (
      <div className="min-h-screen bg-white px-6 py-8 max-w-md mx-auto space-y-6 pb-24">
        <h2 className="text-xl font-semibold">Analytics</h2>
        {Object.entries(categoryTotals).map(([cat, amt]) => (
          <div key={cat} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{cat}</span>
              <span>₹{amt}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${(amt / totalSpent) * 100}%` }}
                className="h-full bg-black"
              />
            </div>
          </div>
        ))}
        <BottomNav page={page} setPage={setPage} />
      </div>
    );
  }

  if (page === "goal") {
    const weeksLeft = goal 
      ? Math.max(1, Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 7)))
      : 0;
    const amountLeft = goal ? Math.max(0, goal.target - goal.saved) : 0;
    const savePerWeek = goal ? amountLeft / weeksLeft : 0;
    const progress = goal ? Math.min(100, (goal.saved / goal.target) * 100) : 0;

    return (
      <div className="min-h-screen bg-white px-6 py-8 max-w-md mx-auto space-y-6 pb-24">
        <h2 className="text-xl font-semibold">Savings Goal</h2>
        
        {!goal ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Set a saving target. Unspent pocket money automatically gets added here every Monday!
            </p>
            <input
              placeholder="What are you saving for? (e.g. Kanye Tix)"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl"
            />
            <input
              type="number"
              placeholder="Target Amount (₹)"
              value={goalTarget}
              onChange={(e) => setGoalTarget(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl"
            />
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-gray-500 pl-1">Target Date</label>
              <input
                type="date"
                value={goalDeadline}
                onChange={(e) => setGoalDeadline(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <button
              onClick={createGoal}
              className="w-full py-3 rounded-xl bg-black text-white"
            >
              Start Goal
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-5 border rounded-2xl bg-gray-50 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{goal.title}</h3>
                  <p className="text-sm text-gray-500">Target: ₹{goal.target}</p>
                </div>
                <button onClick={clearGoal} className="text-xs text-red-500 underline">
                  Delete
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Saved: ₹{goal.saved.toFixed(0)}</span>
                  <span className="font-medium">{progress.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-green-500"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-xl border flex flex-col justify-center items-center text-center">
                  <p className="text-xs text-gray-500">Weeks Left</p>
                  <p className="text-xl font-bold">{weeksLeft}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border flex flex-col justify-center items-center text-center">
                  <p className="text-xs text-gray-500">Save per week</p>
                  <p className="text-xl font-bold text-green-600">₹{savePerWeek.toFixed(0)}</p>
                </div>
              </div>
            </div>
            {amountLeft === 0 && (
              <div className="p-4 bg-green-100 text-green-800 rounded-xl text-center text-sm font-medium">
                🎉 Congratulations! You have reached your goal!
              </div>
            )}
          </div>
        )}

        <BottomNav page={page} setPage={setPage} />
      </div>
    );
  }

  /* ---------------- Home ---------------- */

  const presets = [
    "Metro",
    "Auto",
    "Canteen",
    "Coffee",
    "Zomato",
    "Sutta",
    "Notes Print",
    "Gym",
    "Netflix",
    "Friends Outing",
  ];

  return (
    <div className="min-h-screen bg-white px-6 py-8 max-w-md mx-auto space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Hi, {name}</h1>
        <button
          onClick={() => setPage("onboarding")}
          className="text-xs underline"
        >
          Edit Budget
        </button>
      </div>

      <div className="p-5 rounded-2xl border bg-gray-50">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm text-gray-500">Remaining This Week</p>
          <button
            onClick={() => setShowIncomeInput(!showIncomeInput)}
            className="p-1 bg-white hover:bg-gray-100 rounded-full border shadow-sm transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
        <motion.h2 className="text-3xl font-bold">
          {displayRemaining}
        </motion.h2>

        <AnimatePresence>
          {showIncomeInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 flex gap-2 overflow-hidden"
            >
              <input
                type="number"
                placeholder="Extra income (₹)"
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
              <button
                onClick={() => {
                  if (incomeInput) {
                    setWeeklyIncome(prev => prev + Number(incomeInput));
                    setIncomeInput("");
                    setShowIncomeInput(false);
                  }
                }}
                className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium whitespace-nowrap"
              >
                Add
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Common Expenses */}
      <div>
        <p className="text-sm font-medium mb-2">Common Expenses</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {presets.map(p => (
            <button
              key={p}
              onClick={() => setTitle(p)}
              className="px-4 py-2 border rounded-full text-sm whitespace-nowrap active:scale-95 transition"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <input
        placeholder="Expense"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-3 border rounded-xl"
      />
      <input
        type="number"
        placeholder="Amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-3 border rounded-xl"
      />
      <button
        onClick={addExpense}
        className="w-full py-3 rounded-xl bg-black text-white"
      >
        Add Expense
      </button>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {expenses.map(e => (
            <motion.div
              layout
              key={e.id}
              initial={{ opacity: 0, height: 0, scale: 0.9 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative bg-red-500 rounded-xl overflow-hidden"
            >
              {/* iOS Delete Background */}
              <div className="absolute top-0 right-0 bottom-0 w-24 flex items-center justify-end pr-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>

              {/* Draggable Card */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ left: 0.7, right: 0 }}
                onDragEnd={(event, info) => {
                  if (info.offset.x < -80) deleteExpense(e.id);
                }}
                className="p-4 border rounded-xl flex justify-between bg-white relative z-10 w-full"
              >
                <div>
                  <p className="font-medium">{e.title}</p>
                  <p className="text-xs text-gray-500">{e.category}</p>
                </div>
                <p className="font-semibold">₹{e.amount}</p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <BottomNav page={page} setPage={setPage} />
    </div>
  );
}

function BottomNav({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white border rounded-2xl flex justify-around py-3 shadow">
      {["home", "goal", "analytics"].map(p => (
        <button
          key={p}
          onClick={() => setPage(p as Page)}
          className={`text-sm ${page === p ? "font-semibold" : "opacity-60"}`}
        >
          {p.charAt(0).toUpperCase() + p.slice(1)}
        </button>
      ))}
    </div>
  );
}
