import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Heart,
  Sun,
  Moon,
  Gift,
  VolumeX,
  Info
} from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { MouseSpotlight } from "@/components/ui/mouse-spotlight";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// --- Custom Customized Timeline Data (All about Rumana's Birthday Journey) ---
const CUSTOM_TIMELINE_DATA = [
  {
    id: 1,
    title: "Cosmic Entrance",
    date: "June 19, 2007",
    content: "The stars aligned as Rumana entered the world, bringing a rare kind of warmth and beautiful energy.",
    category: "Milestone",
    icon: Calendar,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Wonder Years",
    date: "Childhood Days",
    content: "Years filled with laughter, cute smiles, and spreading joy to everyone around.",
    category: "Growth",
    icon: User,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 3,
    title: "Creative Passions",
    date: "Teenage Growth",
    content: "Refining unique talents, discovering passions, and cultivating a kind, sparkling spirit.",
    category: "Discovery",
    icon: Sparkles,
    relatedIds: [2, 4],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 4,
    title: "The 19th Birthday",
    date: "June 19, 2026",
    content: "Turning 19! Stepping into a beautiful new chapter of young adulthood with grace.",
    category: "Present",
    icon: Clock,
    relatedIds: [3, 5],
    status: "in-progress" as const,
    energy: 90,
  },
  {
    id: 5,
    title: "Brighter Horizons",
    date: "Endless Future",
    content: "A sparkling road ahead. Ready to fulfill big dreams, create stories, and shine bright.",
    category: "Future",
    icon: ArrowRight,
    relatedIds: [4],
    status: "pending" as const,
    energy: 100,
  },
];

// --- Birthday Wishes Copy ---
const WISHES = [
  { text: "May every single one of your dreams know your name, and find its way to you this year, Rumana.", from: "✦ A heartfelt wish" },
  { text: "You hold a rare kind of light — the kind that makes rooms feel warmer and moments feel softer. Never lose it.", from: "✦ With admiration" },
  { text: "On this day, something beautiful was added to the world. And all these years later, it still is.", from: "✦ Always true" },
  { text: "Like fine gold, you only grow more precious with time. Happy Birthday to someone truly extraordinary.", from: "✦ Forever yours" },
  { text: "Some people arrive and immediately make the whole world feel like a better place. You are one of them.", from: "✦ Sincerely" },
  { text: "May this birthday be the beginning of the most luminous chapter your story has ever held.", from: "✦ With love" },
];

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [celebrate, setCelebrate] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dobDay, setDobDay] = useState("");
  const [countdown, setCountdown] = useState({ d: "--", h: "--", m: "--", s: "--" });
  const [countdownOffsets, setCountdownOffsets] = useState({ d: 276.5, h: 276.5, m: 276.5, s: 276.5 });
  const [numbersData, setNumbersData] = useState<any[]>([]);
  const [floatingElements, setFloatingElements] = useState<any[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorGlowRef = useRef<HTMLDivElement | null>(null);

  const C = 276.5; // Circular perimeter for progress ring

  // --- Initialize Audio and calculations ---
  useEffect(() => {
    // Reset view to top on mount
    window.scrollTo(0, 0);

    // Determine the day of the week Rumana was born (June 19, 2007)
    const dob = new Date(2007, 5, 19);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    setDobDay(days[dob.getDay()]);

    // Setup Audio
    audioRef.current = new Audio("/song.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    // Track scroll
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Track cursor for glow effect
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = `${e.clientX}px`;
        cursorGlowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Dynamic floating elements generator
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const icons = ["🎈", "✨", "⭐", "🎉", "💖", "🎂"];
        const element = {
          id: Date.now() + Math.random(),
          icon: icons[Math.floor(Math.random() * icons.length)],
          x: Math.random() * 90 + 5,
          size: Math.random() * 20 + 15,
          duration: Math.random() * 6 + 6,
          delay: Math.random() * 2,
        };
        setFloatingElements((prev) => [...prev.slice(-30), element]);
      }
    }, 1200);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  // --- Dynamic Document Title Updates ---
  useEffect(() => {
    if (!hasEntered) {
      document.title = "Rumana ✦ A Celebration Awaits";
    } else {
      if (countdown.d !== "--" && countdown.d !== "00") {
        document.title = `✨ ${countdown.d}d ${countdown.h}h until Rumana's 19th!`;
      } else {
        document.title = "Happy 19th Birthday, Rumana! ✦";
      }
    }
  }, [hasEntered, countdown]);

  // --- Particles system on background (optimized for day/night theme) ---
  useEffect(() => {
    const canvas = document.getElementById("particles-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    const palette = isDarkMode
      ? ["167,139,250", "244,114,182", "103,232,249", "255,255,255"]
      : ["139,92,246", "236,72,153", "6,182,212", "39,39,42"]; // Dark theme highlights vs light theme deep colors
      
    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.5,
      col: palette[Math.floor(Math.random() * palette.length)],
    }));

    let animationId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Connecting lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = isDarkMode
              ? `rgba(167,139,250,${0.1 * (1 - dist / 130)})`
              : `rgba(139,92,246,${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Line to cursor
        const mdx = dots[i].x - mouse.x;
        const mdy = dots[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 160) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = isDarkMode
            ? `rgba(244,114,182,${0.2 * (1 - mdist / 160)})`
            : `rgba(236,72,153,${0.22 * (1 - mdist / 160)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // Draw dots
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = window.innerWidth;
        if (d.x > window.innerWidth) d.x = 0;
        if (d.y < 0) d.y = window.innerHeight;
        if (d.y > window.innerHeight) d.y = 0;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.col}, 0.08)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.col}, 0.65)`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [isDarkMode]);

  // --- Countdown tick logic ---
  useEffect(() => {
    const nextBd = () => {
      const n = new Date();
      const y = n.getFullYear();
      let bd = new Date(y, 5, 19); // June 19
      if (bd <= n) bd = new Date(y + 1, 5, 19);
      return bd;
    };

    const p2 = (n: number) => String(n).padStart(2, "0");

    const tick = () => {
      const now = new Date();
      const bd = nextBd();
      const diff = bd.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ d: "00", h: "00", m: "00", s: "00" });
        setCelebrate(true);
        return;
      }

      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff % 864e5) / 36e5);
      const m = Math.floor((diff % 36e5) / 6e4);
      const s = Math.floor((diff % 6e4) / 1e3);

      setCountdown({ d: p2(d), h: p2(h), m: p2(m), s: p2(s) });
      setCountdownOffsets({
        d: C - (d / 365) * C,
        h: C - (h / 24) * C,
        m: C - (m / 60) * C,
        s: C - (s / 60) * C,
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Calculate Live Numbers ---
  useEffect(() => {
    const dob = new Date(2007, 5, 19);
    const now = new Date();
    const ms = now.getTime() - dob.getTime();
    const totalDays = Math.floor(ms / 864e5);
    const age = now.getFullYear() - 2007 - (now < new Date(now.getFullYear(), 5, 19) ? 1 : 0);

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    setNumbersData([
      { icon: "🎂", val: age, lbl: "Years Young", sub: "Turning 19 on June 19!" },
      { icon: "💝", val: totalDays.toLocaleString(), lbl: "Days of Radiance", sub: "Rumana shining in the world" },
      { icon: "✨", val: Math.floor(ms / 36e5).toLocaleString(), lbl: "Hours of Joy", sub: "Your beautiful presence" },
      { icon: "🌟", val: Math.floor(totalDays / 7).toLocaleString(), lbl: "Weeks of Smile", sub: "Each one a blessing" },
      { icon: "♊", val: "Gemini", lbl: "Zodiac Sign", sub: "Expressive · Brilliant · Free" },
      { icon: "📅", val: days[dob.getDay()], lbl: "Day Born", sub: "Born on a lovely " + days[dob.getDay()] },
    ]);
  }, []);

  // --- Confetti particle engine (Cannon physics) ---
  const launchConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = "block";

    const particles: any[] = [];
    const count = 180;

    for (let i = 0; i < count; i++) {
      const isLeft = i % 2 === 0;
      particles.push({
        x: isLeft ? 0 : canvas.width,
        y: canvas.height,
        vx: isLeft ? (Math.random() * 12 + 6) : -(Math.random() * 12 + 6),
        vy: -(Math.random() * 16 + 10),
        w: Math.random() * 10 + 6,
        h: Math.random() * 6 + 3,
        rot: Math.random() * 360,
        rv: (Math.random() - 0.5) * 15,
        col: ["#a78bfa", "#f472b6", "#67e8f9", "#ffffff", "#e9d5ff", "#f59e0b"][Math.floor(Math.random() * 6)],
        alpha: 1,
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // gravity
        p.vx *= 0.985; // drag
        p.rot += p.rv;

        if (frame > 90) p.alpha = Math.max(0, p.alpha - 0.008);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.col;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      frame++;
      if (frame < 260) {
        requestAnimationFrame(animate);
      } else {
        canvas.style.display = "none";
      }
    };
    animate();
  };

  const handleEnter = () => {
    setHasEntered(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn("Audio autoplay blocked or failed:", e);
      });
    }
    setTimeout(() => {
      launchConfetti();
    }, 800);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((e) => console.error(e));
      }
    }
  };

  const handleSurpriseReveal = () => {
    setShowSurprise(true);
    setShowFlash(true);
    launchConfetti();
    setTimeout(() => {
      launchConfetti();
    }, 350);
    setTimeout(() => {
      setShowFlash(false);
    }, 1200);
  };

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.remove("light-theme");
    } else {
      document.documentElement.classList.add("light-theme");
    }
  };

  return (
    <div className={`relative min-h-screen ${isDarkMode ? "bg-black text-white" : "bg-zinc-50 text-zinc-900"} overflow-x-hidden selection:bg-purple-500/30 selection:text-white transition-colors duration-500`}>
      {/* Scroll indicator bar */}
      <div id="scroll-bar" style={{ width: `${scrollProgress}%` }} />

      {/* Interactive Cursor Ambient Glow */}
      <div ref={cursorGlowRef} id="cursor-glow" className="opacity-60 pointer-events-none" />

      {/* Constellation background particles */}
      <canvas id="particles-canvas" />

      {/* Surprise Confetti Canvas layer */}
      <canvas ref={confettiCanvasRef} className="fixed inset-0 pointer-events-none z-[8000] hidden" />

      {/* Full screen expanding shockwave flash overlay */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0.9, scale: 0.1 }}
            animate={{ opacity: 0, scale: 2.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="fixed inset-0 z-[7000] pointer-events-none rounded-full border-[120px] border-purple-500/35 bg-gradient-to-tr from-purple-500/20 via-pink-500/10 to-cyan-500/10"
            style={{ transformOrigin: "center center" }}
          />
        )}
      </AnimatePresence>

      {/* Video Background wrapper (Cleaned visual blend layers) */}
      <div 
        id="bg-video-wrap" 
        className={`pointer-events-none z-0 transition-all duration-500 ${
          isDarkMode ? "opacity-65" : "opacity-80"
        }`}
      >
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/bg_video.mp4" type="video/mp4" />
        </video>
        {/* Soft blend overlay directly inside video wrapper, so it only blends the background video */}
        {!isDarkMode && (
          <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px] transition-all duration-500" />
        )}
      </div>

      {/* Floating Decorative Elements layer */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {floatingElements.map((el) => (
          <span
            key={el.id}
            className="absolute bottom-[-50px] inline-block select-none animate-float-up"
            style={{
              left: `${el.x}%`,
              fontSize: `${el.size}px`,
              animationDuration: `${el.duration}s`,
              animationDelay: `${el.delay}s`,
              opacity: 0.15,
            }}
          >
            {el.icon}
          </span>
        ))}
      </div>

      {/* Custom float keyframes styled programmatically */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-110vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation-name: floatUp;
          animation-timing-function: ease-in;
          animation-fill-mode: forwards;
        }
      `}</style>

      {/* --- ENTRY VEIL SCREEN --- */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative animate-pulse"
            >
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 blur-2xl opacity-40 animate-pulse" />
              <h1 className="font-heading italic text-white text-6xl md:text-8xl tracking-tighter text-glow select-none">
                Rumana
              </h1>
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mt-8"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mt-6 text-[10px] md:text-xs tracking-[0.6em] uppercase text-white/40 font-body select-none"
            >
              A celebration awaits
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.9, type: "spring" }}
              className="mt-12"
            >
              <motion.button
                onClick={handleEnter}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="liquid-glass-strong glow-ring sheen text-white font-heading italic text-lg px-8 py-4 rounded-full flex items-center gap-3 transition-all hover:bg-white/5 cursor-pointer shadow-lg"
              >
                <span>✦ Enter Experience</span>
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Music Controls & Dark Mode buttons */}
      {hasEntered && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3 z-50">
          {/* Light/Dark mode toggler */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.15, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center border backdrop-blur-md transition-all duration-300 cursor-pointer shadow-lg ${
              isDarkMode
                ? "bg-black/60 border-white/20 text-yellow-400 hover:border-white/40"
                : "bg-white/60 border-zinc-300 text-purple-600 hover:border-zinc-500"
            }`}
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          {/* Music playback toggle */}
          <motion.button
            onClick={toggleMusic}
            whileHover={{ scale: 1.15, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center border backdrop-blur-md transition-all duration-300 cursor-pointer shadow-lg ${
              isDarkMode
                ? "bg-black/60 border-white/20 text-white hover:border-white/40"
                : "bg-white/60 border-zinc-300 text-zinc-950 hover:border-zinc-500"
            }`}
            title="Toggle background song"
          >
            {isPlaying ? (
              <div className="flex items-end gap-[3px] h-3.5 w-4 justify-center">
                <span className="w-[2.5px] bg-purple-400 rounded-full animate-bar-1 h-full" />
                <span className="w-[2.5px] bg-pink-400 rounded-full animate-bar-2 h-full" />
                <span className="w-[2.5px] bg-cyan-400 rounded-full animate-bar-3 h-full" />
              </div>
            ) : (
              <VolumeX size={18} />
            )}
          </motion.button>
        </div>
      )}

      {/* --- HEADER NAVBAR --- */}
      <nav className="fixed top-4 left-0 right-0 z-40 px-8 lg:px-16 flex items-center justify-between pointer-events-none">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 6 }} 
          className="liquid-glass hover-rotate w-12 h-12 rounded-full flex items-center justify-center pointer-events-auto shadow-md cursor-pointer"
        >
          <span className={`font-heading italic text-xl glow-pulse select-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>r</span>
        </motion.div>
        <div className={`liquid-glass rounded-full px-6 py-2 text-[10px] tracking-[0.35em] uppercase font-body hidden sm:block shadow-md ${
          isDarkMode ? "text-white/80" : "text-zinc-700 bg-white/70"
        }`}>
          19 · June · 2007
        </div>
        <div className="w-12 h-12" />
      </nav>

      {/* --- HERO SECTION (With Spline 3D Scene in the Background) --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 z-10">
        
        {/* Interactive Spline 3D Scene acting as the background behind text */}
        <div className="absolute inset-0 w-full h-full opacity-60 z-0 flex items-center justify-center pointer-events-auto">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full max-w-4xl max-h-[85vh]"
          />
        </div>

        {/* Ambient drift colors */}
        <div className="orb float-y" style={{ width: 320, height: 320, top: "12%", left: "-5%", background: "radial-gradient(circle, rgba(var(--violet), 0.16), transparent 70%)" }} />
        <div className="orb float-y" style={{ width: 280, height: 280, bottom: "12%", right: "-3%", background: "radial-gradient(circle, rgba(var(--pink), 0.12), transparent 70%)", animationDelay: "1.5s" }} />

        {/* Text overlay positioned on top, set pointer-events-none so click events pass to spline canvas below */}
        <div className="relative z-10 pointer-events-none flex flex-col items-center justify-center">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`text-[10px] tracking-[0.65em] uppercase font-body font-bold mb-6 ${isDarkMode ? "text-white/60" : "text-zinc-500"}`}
          >
            A Cosmic Birthday Celebration
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={hasEntered ? { opacity: 1, scale: 1 } : {}}
            whileHover={{ scale: 1.02, textShadow: "0 0 25px rgba(167,139,250,0.8)" }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`font-heading italic font-bold leading-[0.85] tracking-tight text-glow select-none shimmer-text ${
              isDarkMode ? "text-white" : "text-black"
            }`}
            style={{ fontSize: "clamp(4.2rem, 15vw, 10.5rem)", pointerEvents: "auto" }}
          >
            Rumana
          </motion.h1>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={hasEntered ? { height: 50, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className={`w-px my-6 ${isDarkMode ? "bg-gradient-to-b from-white/60 to-transparent" : "bg-gradient-to-b from-black/40 to-transparent"}`}
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : {}}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className={`font-heading italic text-xl md:text-3xl max-w-xl leading-relaxed ${isDarkMode ? "text-white/80" : "text-zinc-950 font-medium"} pointer-events-auto`}
          >
            "Every star in the sky paused — just for a moment — on the day you arrived."
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : {}}
            className={`mt-6 text-[10px] tracking-[0.45em] uppercase font-body font-bold ${isDarkMode ? "text-white/50" : "text-zinc-400"}`}
          >
            19 · 06 · 2007
          </motion.p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-10 bg-gradient-to-b from-purple-500 via-pink-400 to-transparent animate-pulse" />
          <span className={`text-[9px] tracking-[0.35em] uppercase font-body ${isDarkMode ? "text-white/30" : "text-zinc-400"}`}>scroll</span>
        </div>
      </section>

      {/* --- INTERACTIVE 3D SPLINE SCENE CARD (Personalized Birthday centerpiece) --- */}
      <section className="px-6 md:px-16 py-20 z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.55em] uppercase text-purple-400 font-bold block mb-2">digital centerpiece</span>
          <h2 className={`font-heading italic text-4xl md:text-5xl ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Interactive Birthday Orb</h2>
        </div>

        <Card className={`w-full min-h-[500px] md:h-[520px] relative overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row border transition-all duration-500 ${
          isDarkMode ? "bg-black/80 border-white/10" : "bg-white/95 border-zinc-200 shadow-zinc-300"
        }`}>
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill={isDarkMode ? "rgba(167, 139, 250, 0.4)" : "rgba(139, 92, 246, 0.22)"} />
          <MouseSpotlight size={350} />

          {/* Left panel text - Wishes Oriented */}
          <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center text-left order-2 md:order-1">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} className="w-fit">
              <Badge className={`mb-4 text-[10px] tracking-wider border rounded-full ${
                isDarkMode ? "bg-white/10 border-white/20 text-white" : "bg-black/5 border-black/10 text-zinc-800"
              }`}>
                HAPPY 19TH BIRTHDAY
              </Badge>
            </motion.div>
            <h3 className={`text-3xl md:text-4xl font-heading italic leading-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
              A Wish in 3D for Rumana
            </h3>
            <p className={`mt-4 text-sm md:text-base leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-zinc-900 font-medium"}`}>
              Just like this cosmic floating sculpture, your path is layered, organic, and vibrantly colorful. 
              As you turn 19, may your days be shaped by endless opportunities, kind words, and bright magic. 
              Drag, rotate, and interact with the canvas on the right — it was crafted to celebrate you.
            </p>
            <div className={`mt-8 flex items-center gap-2 text-xs ${isDarkMode ? "text-white/50" : "text-zinc-600"}`}>
              <Info size={14} className={isDarkMode ? "text-purple-400" : "text-purple-600"} />
              <span>Swipe or click-drag to spin the centerpiece.</span>
            </div>
          </div>

          {/* Right panel 3D view */}
          <div className="flex-1 min-h-[300px] md:h-full relative order-1 md:order-2">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full min-h-[300px]"
            />
          </div>
        </Card>
      </section>

      {/* --- COUNTDOWN SECTION --- */}
      <section className="relative py-24 px-6 text-center z-10 max-w-5xl mx-auto">
        <span className={`inline-block text-[10px] tracking-[0.5em] uppercase font-body mb-3 ${isDarkMode ? "text-white/60" : "text-zinc-500"}`}>
          Until your day
        </span>
        <h2 className={`font-heading italic text-4xl md:text-5xl text-glow ${isDarkMode ? "text-white" : "text-zinc-950"}`}>The Countdown</h2>

        <div className="flex justify-center gap-5 md:gap-8 flex-wrap mt-12">
          {[
            { key: "d" as const, label: "Days", val: countdown.d, offset: countdownOffsets.d },
            { key: "h" as const, label: "Hours", val: countdown.h, offset: countdownOffsets.h },
            { key: "m" as const, label: "Minutes", val: countdown.m, offset: countdownOffsets.m },
            { key: "s" as const, label: "Seconds", val: countdown.s, offset: countdownOffsets.s },
          ].map((u) => (
            <motion.div
              key={u.key}
              whileHover={{ scale: 1.08 }}
              className="flex flex-col items-center gap-3 tilt-card relative cursor-pointer"
            >
              <div
                className={`liquid-glass glow-ring relative rounded-full flex items-center justify-center shadow-md ${
                  isDarkMode ? "bg-black/35" : "bg-white/80"
                }`}
                style={{ width: "clamp(90px, 16vw, 120px)", height: "clamp(90px, 16vw, 120px)" }}
              >
                {/* SVG Progress Circle */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    strokeWidth="1.5"
                    stroke={isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    strokeWidth="2.5"
                    stroke="url(#gradient-accent)"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={u.offset}
                    className="transition-all duration-1000"
                    style={{ filter: "drop-shadow(0 0 5px rgba(167,139,250,0.6))" }}
                  />
                  <defs>
                    <linearGradient id="gradient-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#f472b6" />
                    </linearGradient>
                  </defs>
                </svg>

                <div
                  key={u.val}
                  className={`num-pop absolute inset-0 flex items-center justify-center font-heading italic font-bold ${
                    isDarkMode ? "text-white" : "text-zinc-900"
                  }`}
                  style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", textShadow: isDarkMode ? "0 0 8px rgba(167,139,250,0.5)" : "none" }}
                >
                  {u.val}
                </div>
              </div>
              <span className={`text-[9px] tracking-[0.4em] uppercase font-body ${isDarkMode ? "text-white/50" : "text-zinc-700"}`}>
                {u.label}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className={`liquid-glass inline-flex items-center gap-3 px-8 py-4 rounded-full text-[10px] tracking-[0.25em] uppercase font-body shadow-sm ${
              isDarkMode ? "text-white/70 bg-black/20" : "text-zinc-700 bg-white/80"
            }`}
          >
            Born on a beautiful <b className="text-purple-500 font-bold tracking-[0.15em]">{dobDay}</b> in <b className="text-pink-500 font-bold tracking-[0.15em]">June</b>
          </motion.div>
        </div>

        {celebrate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-heading italic text-2xl md:text-4xl mt-10 text-purple-500 font-bold text-glow select-none"
          >
            ✦ Happy Birthday, Rumana! ✦
          </motion.div>
        )}
      </section>

      {/* --- Divider --- */}
      <div className="flex items-center gap-8 max-w-sm mx-auto px-6 py-8">
        <div className={`flex-1 h-px ${isDarkMode ? "bg-gradient-to-r from-transparent via-white/10 to-transparent" : "bg-gradient-to-r from-transparent via-black/10 to-transparent"}`} />
        <span className="text-purple-500/60 font-body select-none font-bold text-[10px] tracking-widest spin-slow">◇</span>
        <div className={`flex-1 h-px ${isDarkMode ? "bg-gradient-to-r from-transparent via-white/10 to-transparent" : "bg-gradient-to-r from-transparent via-black/10 to-transparent"}`} />
      </div>

      {/* --- NUMBERS SECTION (Personalized metrics grid) --- */}
      <section className="px-6 md:px-16 py-20 z-10 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[10px] tracking-[0.65em] uppercase text-purple-400 font-bold block mb-2">the magic of your years</span>
          <h2 className={`font-heading italic text-4xl md:text-5xl ${isDarkMode ? "text-white" : "text-zinc-950"}`}>Rumana in Numbers</h2>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 rounded-3xl border overflow-hidden backdrop-blur-md transition-all duration-500 ${
          isDarkMode ? "bg-black/40 border-white/10" : "bg-white/92 border-zinc-200 shadow-xl shadow-zinc-200/40"
        }`}>
          {numbersData.map((it, i) => (
            <motion.div
              key={it.lbl}
              whileHover={{ scale: 1.04, y: -4 }}
              className={`p-8 sheen relative overflow-hidden tilt-card group cursor-pointer border-white/5`}
              style={{
                borderRight: i % 3 !== 2 ? (isDarkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(9,9,11,0.05)") : "none",
                borderBottom: i < 3 ? (isDarkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(9,9,11,0.05)") : "none",
              }}
            >
              <MouseSpotlight size={180} />
              <div className={`text-xl text-purple-500 font-bold mb-4 font-body group-hover:opacity-100 group-hover:scale-110 transition-all ${isDarkMode ? "opacity-50" : "opacity-80"}`}>{it.icon}</div>
              <div className={`font-heading italic text-3xl md:text-4xl leading-none font-bold group-hover:text-glow transition-all ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}>{it.val}</div>
              <div className={`text-[10px] tracking-[0.3em] uppercase font-body mt-3 font-semibold ${
                isDarkMode ? "text-white/50" : "text-zinc-800"
              }`}>{it.lbl}</div>
              <div className={`text-xs italic font-heading mt-1 ${
                isDarkMode ? "text-white/30" : "text-zinc-600"
              }`}>{it.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- RADIAL ORBITAL TIMELINE SECTION (Theme Integrated) --- */}
      <section className="px-6 md:px-16 py-20 z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.65em] uppercase text-purple-400 font-bold block mb-2">chronicles of you</span>
          <h2 className={`font-heading italic text-4xl md:text-5xl ${isDarkMode ? "text-white" : "text-zinc-950"}`}>The Orbital Journey</h2>
        </div>

        {/* Orbit timeline rendering synchronized with isDarkMode state */}
        <RadialOrbitalTimeline timelineData={CUSTOM_TIMELINE_DATA} isDarkMode={isDarkMode} />
      </section>

      {/* --- Divider --- */}
      <div className="flex items-center gap-8 max-w-sm mx-auto px-6 py-8">
        <div className={`flex-1 h-px ${isDarkMode ? "bg-gradient-to-r from-transparent via-white/10 to-transparent" : "bg-gradient-to-r from-transparent via-black/10 to-transparent"}`} />
        <span className="text-pink-400/60 font-body select-none font-bold text-[10px] tracking-widest spin-slow">✦</span>
        <div className={`flex-1 h-px ${isDarkMode ? "bg-gradient-to-r from-transparent via-white/10 to-transparent" : "bg-gradient-to-r from-transparent via-black/10 to-transparent"}`} />
      </div>

      {/* --- WISHES SECTION (Interactive grids optimized for Day/Night) --- */}
      <section className="px-6 md:px-16 py-20 z-10 max-w-6xl mx-auto text-center">
        <span className="text-[10px] tracking-[0.65em] uppercase text-purple-400 font-bold block mb-2">from the heart</span>
        <h2 className={`font-heading italic text-4xl md:text-5xl mb-14 ${isDarkMode ? "text-white" : "text-zinc-950"}`}>Birthday Wishes for Rumana</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WISHES.map((w, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04, y: -5, boxShadow: "0 10px 30px rgba(167,139,250,0.12)" }}
              className={`liquid-glass sheen tilt-card rounded-3xl p-8 text-left relative group transition-all border min-h-[220px] flex flex-col justify-between cursor-pointer ${
                isDarkMode 
                  ? "bg-black/20 border-white/5 hover:border-white/20" 
                  : "bg-white/92 border-zinc-200/85 hover:border-zinc-400/80 shadow-md shadow-zinc-200/50 backdrop-blur-md"
              }`}
            >
              <MouseSpotlight size={160} />
              <div>
                <div className={`font-heading italic text-5xl leading-none select-none mb-3 ${isDarkMode ? "text-purple-400/30" : "text-purple-600/25"}`}>"</div>
                <p className={`font-heading italic text-lg leading-relaxed transition-colors duration-300 ${
                  isDarkMode ? "text-white/80 group-hover:text-white" : "text-zinc-900 group-hover:text-black font-medium"
                }`}>
                  {w.text}
                </p>
              </div>
              <div className={`mt-6 text-[10px] tracking-[0.25em] uppercase font-body font-semibold pl-1 ${
                isDarkMode ? "text-purple-300" : "text-purple-700"
              }`}>
                {w.from}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Divider --- */}
      <div className="flex items-center gap-8 max-w-sm mx-auto px-6 py-8">
        <div className={`flex-1 h-px ${isDarkMode ? "bg-gradient-to-r from-transparent via-white/10 to-transparent" : "bg-gradient-to-r from-transparent via-black/10 to-transparent"}`} />
        <span className="text-purple-400/60 font-body select-none font-bold text-[10px] tracking-widest spin-slow">✦</span>
        <div className={`flex-1 h-px ${isDarkMode ? "bg-gradient-to-r from-transparent via-white/10 to-transparent" : "bg-gradient-to-r from-transparent via-black/10 to-transparent"}`} />
      </div>

      {/* --- SURPRISE REVEAL SECTION --- */}
      <section className="px-6 py-20 text-center relative z-10 max-w-2xl mx-auto">
        <div className="relative">
          <span className="text-[10px] tracking-[0.65em] uppercase text-pink-400 font-bold block mb-2">birthday blessings</span>
          <h2 className={`font-heading italic text-4xl md:text-5xl mb-4 text-glow ${isDarkMode ? "text-white" : "text-zinc-950"}`}>A Surprise for You</h2>
          <p className={`font-heading italic text-sm md:text-base mb-10 ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>One tap away from a moment made just for you.</p>

          <AnimatePresence mode="wait">
            {!showSurprise ? (
              <motion.button
                key="reveal-button"
                onClick={handleSurpriseReveal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="liquid-glass-strong glow-ring sheen rounded-full px-8 py-5 inline-flex items-center gap-3 text-white font-heading italic text-lg hover:bg-white/5 cursor-pointer float-y shadow-xl"
              >
                <Gift size={18} className="text-pink-400 glow-pulse" />
                <span>Reveal Surprise</span>
              </motion.button>
            ) : (
              <motion.div
                key="surprise-content"
                initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className={`liquid-glass p-10 rounded-3xl relative border shadow-2xl transition-colors duration-300 ${
                  isDarkMode 
                    ? "border-purple-500/20 bg-black/60 backdrop-blur-xl text-white" 
                    : "border-purple-300/40 bg-white/95 backdrop-blur-xl text-zinc-900"
                }`}
              >
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 blur-xl opacity-20 pointer-events-none" />
                <h3 className={`font-heading italic text-4xl md:text-5xl leading-tight mb-6 text-glow select-none ${
                  isDarkMode ? "text-purple-400" : "text-purple-700"
                }`}>
                  Happy Birthday,<br />Rumana.
                </h3>
                <p className={`font-heading italic text-base md:text-lg leading-relaxed max-w-md mx-auto ${
                  isDarkMode ? "text-zinc-300" : "text-zinc-900 font-medium"
                }`}>
                  "The world is richer, warmer, and more full of wonder because you exist in it. On your special day and every day — you are seen, you are loved, you are everything."
                </p>
                <div className={`mt-8 text-[9px] tracking-[0.45em] uppercase font-body font-bold ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-600"
                }`}>
                  June 19, 2007 — Forever celebrated
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className={`relative px-6 py-20 text-center overflow-hidden border-t mt-16 transition-colors duration-500 ${
        isDarkMode ? "border-white/10" : "border-zinc-200"
      }`}>
        <div
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center font-heading italic leading-none pointer-events-none select-none transition-all ${
            isDarkMode ? "text-white opacity-[0.03]" : "text-black opacity-[0.04]"
          }`}
          style={{ fontSize: "clamp(3.5rem, 12vw, 8rem)" }}
        >
          Rumana
        </div>
        <div className="relative z-10 max-w-xl mx-auto">
          <p className={`font-heading italic text-lg md:text-xl mb-3 ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
            To the one who makes the world more beautiful simply by being in it.
          </p>
          <p className={`text-[10px] tracking-[0.45em] uppercase font-body mt-4 font-bold ${
            isDarkMode ? "text-zinc-500" : "text-zinc-400"
          }`}>
            19 · June · 2007
          </p>
          <p className={`mt-10 text-[9px] tracking-[0.3em] uppercase font-body flex items-center justify-center gap-1 select-none ${
            isDarkMode ? "text-zinc-600" : "text-zinc-500"
          }`}>
            Made with quiet admiration <Heart size={8} className="text-pink-400 animate-pulse fill-pink-400" />
          </p>
        </div>
      </footer>
    </div>
  );
}
