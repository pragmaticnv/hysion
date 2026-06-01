import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Clock,
  Activity,
  ArrowRight,
  Sparkles,
  Settings,
  Play,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Target,
  Zap,
  Mic,
  Layers,
  ChevronRight,
  Search,
  Bell,
  Brain,
  TrendingUp,
  Award,
  Trophy,
  Hexagon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStore } from "../store/useStore";
import { Topic } from "../types";
import calculusImg from "../assets/images/calculus_lab_3d_1779249782864.png";
import solarSystemImg from "../assets/images/solar_system_3d_1779249804369.png";

const chartData = [
  { name: "Mon", usage: 45, retention: 30 },
  { name: "Tue", usage: 52, retention: 45 },
  { name: "Wed", usage: 38, retention: 50 },
  { name: "Thu", usage: 65, retention: 55 },
  { name: "Fri", usage: 48, retention: 65 },
  { name: "Sat", usage: 70, retention: 75 },
  { name: "Sun", usage: 85, retention: 80 },
];

export function MainDashboard() {
  const { user, userRole, progress, setActiveTopic, theme } = useStore();

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      label: "Modules Completed",
      value:
        Object.values(progress?.modules || {}).filter((m) => m.isCompleted)
          .length || 0,
      icon: CheckCircle2,
      color: "text-emerald-500",
    },
    {
      label: "Learning Hours",
      value: Math.round((progress?.totalTimeSpent || 0) / 3600),
      icon: Clock,
      color: "text-indigo-500",
    },
    {
      label: "Retention Rate",
      value: "84%",
      icon: Brain,
      color: "text-amber-500",
    },
    {
      label: "Daily Streak",
      value: `${progress?.streak || 0} days`,
      icon: Zap,
      color: "text-rose-500",
    },
  ];

  const featuredModules = [
    {
      id: "Relativity",
      title: "Special Relativity",
      category: "Physics",
      intensity: "Advanced",
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: "Calculus",
      title: "Calculus Lab",
      category: "Mathematics",
      intensity: "Ultra Advanced",
      image: calculusImg,
    },
    {
      id: "SolarSystem",
      title: "Solar System",
      category: "Astronomy",
      intensity: "Core",
      image: solarSystemImg,
    },
    {
      id: "Atom",
      title: "Atomic Structure",
      category: "Chemistry",
      intensity: "Core",
      image:
        "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=600",
    },
  ];

  const greeting =
    date.getHours() < 12
      ? "Good Morning"
      : date.getHours() < 18
        ? "Good Afternoon"
        : "Good Evening";

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar relative font-sans">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover opacity-[0.05] dark:opacity-[0.02] mix-blend-multiply dark:mix-blend-normal grayscale dark:grayscale-0" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8 lg:px-12 lg:py-12 space-y-12 pb-32 relative z-10">
        {/* Navigation & Intelligence Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 crystal-glass p-4 rounded-[28px]"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.2)] dark:shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <Hexagon size={20} fill="currentColor" className="opacity-90" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">
                HyperVision OS
              </h2>
              <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mt-0.5">
                System Status: Nominal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search
                  size={16}
                  className="text-zinc-500 dark:text-zinc-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="Search database..."
                className="w-full sm:w-64 pl-11 pr-4 py-3 bg-white/50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/10 rounded-2xl text-sm focus:border-indigo-500/50 focus:ring-1 ring-indigo-500/50 transition-all outline-none text-zinc-900 dark:text-white placeholder:text-zinc-500 font-medium"
              />
            </div>
            <button className="relative w-12 h-12 rounded-2xl bg-white/50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/10 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-all">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] dark:shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse" />
            </button>
            <div className="h-10 w-px bg-zinc-200/60 dark:bg-white/10" />
            <div className="flex items-center gap-3 pr-2">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-zinc-900 dark:text-white leading-none">
                  {user?.displayName || "Scholar"}
                </p>
                <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mt-1">
                  {userRole || "Student"}
                </p>
              </div>
              <button className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-300 dark:border-white/10 shadow-sm overflow-hidden p-0.5 hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">
                    {user?.displayName?.charAt(0) || "S"}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Hero Welcome */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-8 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass border border-indigo-500/20 dark:border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.05)] dark:shadow-[0_0_20px_rgba(99,102,241,0.15)] w-fit mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)] dark:shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
                Intelligence Briefing
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-display font-medium text-zinc-900 dark:text-white tracking-tight leading-tight">
              <span className="text-zinc-500 font-normal">{greeting},</span>
              <br />
              {user?.displayName?.split(" ")[0] || "Scholar"}
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mt-6 max-w-2xl font-medium leading-relaxed">
              Your cognitive interface is synchronized. You have pending
              visualizations in Advanced Calculus and Special Relativity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4"
          >
            <div className="bg-gradient-to-br from-indigo-500/10 dark:from-indigo-500/50 to-purple-600/10 dark:to-purple-600/50 p-[1px] rounded-[32px] shadow-[0_20px_40px_rgba(99,102,241,0.05)] dark:shadow-[0_0_40px_rgba(99,102,241,0.2)]">
              <div className="bg-white/90 dark:bg-zinc-950/80 backdrop-blur-2xl p-8 rounded-[31px] h-full flex flex-col justify-between overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 dark:from-indigo-500/10 to-purple-500/5 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/5 dark:bg-indigo-500/20 border border-indigo-500/10 dark:border-indigo-500/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 shadow-[0_8px_16px_rgba(99,102,241,0.08)] dark:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight dark:text-glow">
                      Active Protocol
                    </h3>
                    <p className="text-sm text-indigo-500/60 dark:text-indigo-200/60 mt-1 font-medium">
                      Mastery of Fluid Dynamics
                    </p>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                      <span className="text-zinc-400 dark:text-zinc-500">
                        Completion
                      </span>
                      <span className="text-indigo-500 dark:text-indigo-400">
                        88%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "88%" }}
                        transition={{
                          duration: 1,
                          delay: 0.5,
                          ease: "easeOut",
                        }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)] dark:shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTopic("AircraftAerodynamics")}
                    className="w-full py-3 mt-4 bg-indigo-600 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(79,70,229,0.15)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    Resume Simulation
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Telemetry Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="px-6 py-8 rounded-[28px] crystal-glass border border-zinc-200/50 dark:border-white/5 flex flex-col gap-5 hover:border-zinc-300 dark:hover:border-white/20 transition-all group cursor-default"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} bg-white/50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5 group-hover:scale-110 transition-transform shadow-inner`}
              >
                <stat.icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-3xl font-display font-medium text-zinc-900 dark:text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-1.5">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Knowledge Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-12 liquid-glass rounded-[32px] p-8 flex flex-col gap-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 tracking-tight dark:text-glow">
                  <TrendingUp
                    size={20}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                  Neural Retention Matrix
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">
                  Analysis of long-term concept synthesis vs engagement
                </p>
              </div>
              <div className="bg-white/50 dark:bg-black/40 p-1 rounded-xl flex items-center backdrop-blur-xl border border-zinc-200/60 dark:border-white/10 shadow-inner">
                {["7D", "30D", "90D"].map((range, i) => (
                  <button
                    key={range}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${i === 0 ? "bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm border border-zinc-200/50 dark:border-white/10" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorRetention"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke={
                      theme.id === "white" || theme.id === "ios-light"
                        ? "#f1f5f9"
                        : "#ffffff10"
                    }
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
                    dy={16}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        theme.id === "white" || theme.id === "ios-light"
                          ? "#ffffff"
                          : "#0a0a0cc0",
                      backdropFilter: "blur(12px)",
                      borderRadius: "16px",
                      border:
                        theme.id === "white" || theme.id === "ios-light"
                          ? "1px solid #e2e8f0"
                          : "1px solid #ffffff10",
                      boxShadow: "0 10px 40px -10px rgb(0 0 0 / 0.2)",
                      padding: "12px",
                    }}
                    itemStyle={{
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "4px 0",
                    }}
                    labelStyle={{
                      fontWeight: "700",
                      marginBottom: "8px",
                      fontSize: "10px",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                    cursor={{
                      stroke: "#6366f1",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    }}
                  />
                  <Area
                    type="natural"
                    dataKey="usage"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorUsage)"
                    animationDuration={2000}
                  />
                  <Area
                    type="natural"
                    dataKey="retention"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRetention)"
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Tactical Modules Stack */}
        <div className="space-y-8 pt-8">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
                <Layers className="text-indigo-600 dark:text-indigo-500" />
                Featured Simulations
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium">
                High-fidelity 3D environments curated for deep learning.
              </p>
            </div>
            <button
              onClick={() => useStore.getState().setIsLibraryOpen(true)}
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-zinc-200/50 dark:border-white/5 text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors"
            >
              Explore Archive
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredModules.map((module, i) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-[32px] overflow-hidden cursor-pointer"
                onClick={() => setActiveTopic(module.id as Topic)}
              >
                <div className="absolute inset-0 bg-zinc-900" />
                <img
                  src={module.image}
                  alt={module.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent" />

                <div className="relative p-8 h-80 flex flex-col justify-end border border-white/20 dark:border-white/10 rounded-[32px] group-hover:border-indigo-500/50 transition-colors">
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/40 dark:bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white uppercase tracking-widest w-fit">
                      {module.category}
                    </span>
                    {module.intensity === "Ultra Advanced" && (
                      <span className="px-3 py-1 rounded-full bg-rose-500/40 dark:bg-rose-500/20 backdrop-blur-md border border-rose-500/20 text-[9px] font-bold text-white dark:text-rose-300 uppercase tracking-widest w-fit animate-pulse">
                        High Intensity
                      </span>
                    )}
                  </div>

                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="w-12 h-12 rounded-full bg-black/40 dark:bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 scale-50 group-hover:scale-100">
                      <Play size={20} fill="currentColor" className="ml-1" />
                    </div>
                    <h4 className="text-2xl font-bold text-white tracking-tight mb-2">
                      {module.title}
                    </h4>
                    <p className="text-[10px] font-bold text-zinc-300 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Zap
                        size={12}
                        className="text-amber-400 dark:text-amber-500"
                      />
                      {module.intensity} Compute
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Operations Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pt-12 border-t border-zinc-200/50 dark:border-white/5">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden crystal-glass p-10 rounded-[40px] group hover:border-indigo-500/30 transition-all border border-zinc-200/50 dark:border-white/5"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-indigo-500/10 transition-colors duration-1000" />

            <div className="relative z-10 flex flex-col h-full justify-between gap-12">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/50 dark:bg-white/5 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-zinc-200/60 dark:border-white/10 mb-8 overflow-hidden relative shadow-inner">
                  <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/20 blur-xl animate-pulse" />
                  <Mic size={24} className="relative z-10" />
                </div>
                <h3 className="text-3xl font-display font-medium text-zinc-900 dark:text-white tracking-tight mb-4">
                  Live Transcription Protocol
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-sm text-lg leading-relaxed">
                  Engage acoustic sensors to capture and synthesize real-time
                  lecture data into holographic substrates.
                </p>
              </div>
              <button
                onClick={() => useStore.getState().setIsTranscriptionOpen(true)}
                className="flex items-center gap-3 w-fit px-8 py-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                Initialize Sensors
              </button>
            </div>
          </motion.div>

          {/* Builder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden liquid-glass p-10 rounded-[40px] group hover:border-purple-500/30 transition-all"
          >
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover opacity-[0.03] grayscale -z-10 group-hover:opacity-[0.08] transition-opacity duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-black/80 via-white/40 dark:via-black/40 to-transparent" />

            <div className="relative z-10 flex flex-col h-full justify-between gap-12">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/50 dark:bg-white/5 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-zinc-200/60 dark:border-white/10 mb-8 overflow-hidden relative shadow-inner">
                  <div className="absolute inset-0 bg-purple-500/10 dark:bg-purple-500/20 blur-xl group-hover:rotate-180 transition-transform duration-1000" />
                  <Settings
                    size={28}
                    className="relative z-10 group-hover:rotate-90 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-3xl font-display font-medium text-zinc-900 dark:text-white tracking-tight mb-4">
                  Neural Architecture Builder
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-sm text-lg leading-relaxed">
                  Construct complex physical and chemical interactive spaces
                  using node-based reasoning.
                </p>
              </div>
              <button
                onClick={() => useStore.getState().setIsLessonCreatorOpen(true)}
                className="flex items-center justify-between gap-4 w-full sm:w-fit px-8 py-4 rounded-2xl bg-white/50 dark:bg-white/5 text-zinc-900 dark:text-white border border-zinc-200/60 dark:border-white/10 font-bold text-sm tracking-wide hover:bg-white dark:hover:bg-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-all shadow-sm dark:shadow-none"
              >
                Launch Platform
                <ChevronRight
                  size={18}
                  className="text-zinc-500 dark:text-zinc-400"
                />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
