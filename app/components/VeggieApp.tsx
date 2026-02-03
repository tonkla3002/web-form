"use client";

import React, { useState, useEffect, useMemo } from "react";
import { handleSignOut } from "@/app/lib/actions";
import {
  LogOut,
  ChevronLeft,
  Check,
  Leaf,
  Sun,
  TreeDeciduous,
  Sprout,
  Bean,
  History,
} from "lucide-react";

// --- Database ข้อมูลผัก (Vegetable Data) ---
// Restoring full data from original
const VEGETABLE_DATA = [
  {
    id: 1,
    name: "คะน้า (Kale)",
    icon: "🥬",
    vitamins: ["วิตามิน A", "วิตามิน C", "วิตามิน K", "แคลเซียม"],
    benefits: "บำรุงกระดูกและฟัน, ช่วยเรื่องการแข็งตัวของเลือด",
    bg: "bg-green-600",
  },
  {
    id: 2,
    name: "แครอท (Carrot)",
    icon: "🥕",
    vitamins: ["เบต้าแคโรทีน", "วิตามิน A", "วิตามิน B6"],
    benefits: "บำรุงสายตา, ผิวพรรณเปล่งปลั่ง, ชะลอวัย",
    bg: "bg-orange-500",
  },
  {
    id: 3,
    name: "บล็อคโคลี (Broccoli)",
    icon: "🥦",
    vitamins: ["วิตามิน C", "วิตามิน K", "โฟเลต", "ไฟเบอร์"],
    benefits: "กระตุ้นการขับถ่าย, เสริมภูมิคุ้มกัน",
    bg: "bg-green-500",
  },
  {
    id: 4,
    name: "มะเขือเทศ (Tomato)",
    icon: "🍅",
    vitamins: ["ไลโคปีน", "วิตามิน C", "วิตามิน A"],
    benefits: "ผิวพรรณดี, ลดรอยเหี่ยวย่น, บำรุงหัวใจ",
    bg: "bg-red-500",
  },
  {
    id: 5,
    name: "ถั่วแดง (Red Bean)",
    icon: "🫘",
    vitamins: ["โปรตีน", "ธาตุเหล็ก", "วิตามิน B"],
    benefits: "ให้พลังงาน, บำรุงเลือด, ช่วยระบบประสาท",
    bg: "bg-red-800",
  },
  {
    id: 6,
    name: "ถั่วลิสง (Peanut)",
    icon: "🥜",
    vitamins: ["ไขมันดี", "วิตามิน E", "แมกนีเซียม"],
    benefits: "บำรุงสมอง, ให้พลังงานสูง, ลดคอเลสเตอรอล",
    bg: "bg-amber-600",
  },
  {
    id: 7,
    name: "ผักสลัด",
    icon: "🥗",
    vitamins: ["ไฟเบอร์", "วิตามิน A", "โฟเลต"],
    benefits: "ช่วยให้นอนหลับง่าย, ขับถ่ายสะดวก, แคลอรี่ต่ำ",
    bg: "bg-green-400",
  },
  {
    id: 8,
    name: "ผักบุ้ง (Morning Glory)",
    icon: "🌿",
    vitamins: ["วิตามิน A", "วิตามิน C", "ธาตุเหล็ก"],
    benefits: "บำรุงสายตาให้แจ่มใส, ลดอาการตาแห้ง",
    bg: "bg-green-700",
  },
  {
    id: 9,
    name: "ฟักทอง (Pumpkin)",
    icon: "🎃",
    vitamins: ["เบต้าแคโรทีน", "วิตามิน A", "คอลลาเจน"],
    benefits: "บำรุงผิวพรรณ, เสริมสร้างระบบภูมิคุ้มกัน",
    bg: "bg-yellow-500",
  },
  {
    id: 10,
    name: "กะหล่ำปลี (Cabbage)",
    icon: "🥬",
    vitamins: ["วิตามิน C", "กลูตามีน"],
    benefits: "รักษาแผลในกระเพาะอาหาร, ช่วยย่อยอาหาร",
    bg: "bg-green-300",
  },
  {
    id: 11,
    name: "แตงกวา (Cucumber)",
    icon: "🥒",
    vitamins: ["น้ำ", "วิตามิน K", "โพแทสเซียม"],
    benefits: "เพิ่มความชุ่มชื้น, ขับปัสสาวะ, ลดความร้อน",
    bg: "bg-emerald-400",
  },
  {
    id: 12,
    name: "ข้าวโพด (Corn)",
    icon: "🌽",
    vitamins: ["คาร์โบไฮเดรต", "วิตามิน B1", "ลูทีน"],
    benefits: "ให้พลังงาน, บำรุงสายตา (จอประสาทตา)",
    bg: "bg-yellow-400",
  },
  {
    id: 13,
    name: "ตำลึง (Ivy Gourd)",
    icon: "🌿",
    vitamins: ["วิตามิน A", "แคลเซียม", "ฟอสฟอรัส"],
    benefits: "ดับพิษร้อน, บำรุงสายตา, แก้แพ้",
    bg: "bg-green-500",
  },
  {
    id: 14,
    name: "ใบโหระพา (Sweet Basil)",
    icon: "🍃",
    vitamins: ["เบต้าแคโรทีน", "แคลเซียม"],
    benefits: "แก้ท้องอืด, ช่วยย่อยอาหาร, ขับลม",
    bg: "bg-green-700",
  },
  {
    id: 15,
    name: "ใบกะเพรา (Holy Basil)",
    icon: "🌿",
    vitamins: ["วิตามิน C", "ฟอสฟอรัส", "แคลเซียม"],
    benefits: "ขับลม, แก้ปวดท้อง, บำรุงธาตุไฟ",
    bg: "bg-emerald-800",
  },
  {
    id: 16,
    name: "ผักชี (Coriander)",
    icon: "☘️",
    vitamins: ["วิตามิน A", "วิตามิน C"],
    benefits: "ขับลม, บำรุงสายตา, แก้วิงเวียน",
    bg: "bg-green-400",
  },
  {
    id: 17,
    name: "ต้นหอม (Spring Onion)",
    icon: "🥬",
    vitamins: ["วิตามิน C", "แคลเซียม", "ฟอสฟอรัส"],
    benefits: "ป้องกันหวัด, ลดคอเลสเตอรอล",
    bg: "bg-green-500",
  },
  {
    id: 18,
    name: "หอมหัวใหญ่ (Onion)",
    icon: "🧅",
    vitamins: ["วิตามิน C", "เคอร์ซีติน"],
    benefits: "ช่วยให้หลับง่าย, บำรุงหัวใจ",
    bg: "bg-orange-200",
  },
  {
    id: 19,
    name: "กระเทียม (Garlic)",
    icon: "🧄",
    vitamins: ["อัลลิซิน", "ซีลีเนียม", "กำมะถัน"],
    benefits: "ลดไขมันในเลือด, เสริมภูมิต้านทาน",
    bg: "bg-amber-100",
  },
  {
    id: 20,
    name: "มันฝรั่ง (Potato)",
    icon: "🥔",
    vitamins: ["คาร์โบไฮเดรต", "วิตามิน B6"],
    benefits: "ให้พลังงาน, บำรุงสมองและประสาท",
    bg: "bg-yellow-600",
  },
  {
    id: 21,
    name: "มะเขือยาว (Long Eggplant)",
    icon: "🍆",
    vitamins: ["วิตามิน C", "ไฟเบอร์"],
    benefits: "ลดคอเลสเตอรอล, ช่วยระบบขับถ่าย",
    bg: "bg-purple-500",
  },
  {
    id: 22,
    name: "มะเขือพวง (Pea Eggplant)",
    icon: "🟢",
    vitamins: ["เพกติน", "ธาตุเหล็ก", "ไฟเบอร์"],
    benefits: "ดูดซับไขมัน, บำรุงเลือด, แก้ไอ",
    bg: "bg-green-600",
  },
  {
    id: 23,
    name: "พริกขี้หนู (Bird's Eye Chili)",
    icon: "🌶️",
    vitamins: ["แคปไซซิน", "วิตามิน C"],
    benefits: "ช่วยเผาผลาญ, เจริญอาหาร, ขับเหงื่อ",
    bg: "bg-red-600",
  },
  {
    id: 24,
    name: "พริกชี้ฟ้า (Chili Pepper)",
    icon: "🌶️",
    vitamins: ["วิตามิน A", "วิตามิน C"],
    benefits: "บำรุงสายตา, กระตุ้นเลือดไหลเวียน",
    bg: "bg-red-500",
  },
  {
    id: 25,
    name: "ข่า (Galangal)",
    icon: "🫚",
    vitamins: ["ฟอสฟอรัส", "แคลเซียม"],
    benefits: "ขับลม, แก้ท้องอืด, ฆ่าเชื้อรา",
    bg: "bg-stone-300",
  },
  {
    id: 26,
    name: "ตะไคร้ (Lemongrass)",
    icon: "🎋",
    vitamins: ["วิตามิน A", "แคลเซียม"],
    benefits: "ขับปัสสาวะ, ลดความดันโลหิต, ผ่อนคลาย",
    bg: "bg-lime-400",
  },
  {
    id: 27,
    name: "ใบมะกรูด (Kaffir Lime Leaves)",
    icon: "🍃",
    vitamins: ["เบต้าแคโรทีน", "วิตามิน C"],
    benefits: "แก้ไอ, ฟอกโลหิต, ช่วยให้ผ่อนคลาย",
    bg: "bg-green-800",
  },
  {
    id: 28,
    name: "ขิง (Ginger)",
    icon: "🫚",
    vitamins: ["จิงเจอรอล", "วิตามิน B"],
    benefits: "ลดอาการคลื่นไส้, เผาผลาญไขมัน",
    bg: "bg-amber-300",
  },
  {
    id: 29,
    name: "ถั่วฝักยาว (Long Bean)",
    icon: "🥒",
    vitamins: ["วิตามิน A", "วิตามิน C", "แคลเซียม"],
    benefits: "บำรุงกระดูก, ผิวพรรณชุ่มชื้น",
    bg: "bg-green-500",
  },
  {
    id: 30,
    name: "ถั่วงอก (Bean Sprouts)",
    icon: "🌱",
    vitamins: ["วิตามิน C", "เลซิทิน", "วิตามิน B12"],
    benefits: "ช่วยย่อย, บำรุงประสาทและสมอง",
    bg: "bg-slate-100",
  },
  {
    id: 31,
    name: "ผักกาดขาว (Chinese Cabbage)",
    icon: "🥬",
    vitamins: ["โฟเลต", "แคลเซียม", "วิตามิน C"],
    benefits: "ย่อยง่าย, แก้ร้อนใน, ขับปัสสาวะ",
    bg: "bg-green-100",
  },
  {
    id: 32,
    name: "ข้าวโพดอ่อน (Baby Corn)",
    icon: "🌽",
    vitamins: ["วิตามิน B", "เบต้าแคโรทีน"],
    benefits: "บำรุงหัวใจ, ย่อยง่าย",
    bg: "bg-yellow-200",
  },
];

const calculatePlantStats = (history: any[]) => {
  if (!history || history.length === 0)
    return { daysCompleted: 0, todayMeals: 0 };

  // TEST MODE: Use TOTAL MEALS directly as the score (daysCompleted)
  const totalLogs = history.length;

  const todayDate = new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
  });
  const todayMeals = history.filter((log) =>
    log.date.startsWith(todayDate),
  ).length;

  return { daysCompleted: totalLogs, todayMeals: totalLogs }; // Using totalLogs for growth
};

// --- Plant Pot Component with New Animations ---
const PlantPot = ({
  daysCompleted,
  todayMeals,
  history,
}: {
  daysCompleted: number;
  todayMeals: number;
  history: any[];
}) => {
  let plantIcon = "🫘"; // Default: Bean
  let stageName = "เมล็ดปริศนา";
  let description = "เมล็ดต้องการน้ำและอาหาร...";
  let isFullGrown = false;

  // Match HTML Stages: 0, 1, 2, 3+
  if (daysCompleted >= 3) {
    plantIcon = "🌳";
    stageName = "ต้นไม้สมบูรณ์";
    description = "โตเต็มวัยสวยงาม! (TEST MODE)";
    isFullGrown = true;
  } else if (daysCompleted === 2) {
    plantIcon = "🪴";
    stageName = "ต้นไม้เจริญวัย";
    description = "ใกล้จะโตเต็มที่แล้ว! (TEST MODE)";
  } else if (daysCompleted === 1) {
    plantIcon = "🌱";
    stageName = "ต้นอ่อนแข็งแรง";
    description = "ต้นอ่อนกำลังต้องการสารอาหารเพื่อยืดตัว! (TEST MODE)";
  }

  // Animation logic
  const isBounce = todayMeals > 0;

  // Calculate stats for full grown tree
  const allVeggies = history.flatMap((log) => log.veggies || []);

  // 1. Get Top 3 Eaten
  const veggieCounts: Record<string, number> = {};
  allVeggies.forEach((v: any) => {
    veggieCounts[v.name] = (veggieCounts[v.name] || 0) + 1;
  });
  const sortedVeggies = Object.entries(veggieCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // 2. Circular Arrangement Logic
  const treeVisuals = useMemo(() => {
    if (!isFullGrown) return { fruits: [], sparkles: [] };

    // Fruits (Inner Circle)
    const uniqueIcons = [...allVeggies].reverse().slice(0, 8); // Latest 8 veggies
    const fruitRadius = 50;
    const fruits = uniqueIcons.map((v: any, i) => {
      const angle = (i / uniqueIcons.length) * Math.PI * 2 - Math.PI / 2;
      return {
        ...v,
        x: Math.cos(angle) * fruitRadius,
        y: Math.sin(angle) * fruitRadius,
        delay: Math.random() * 2,
      };
    });

    // Sparkles (Outer Circle)
    const sparkleCount = 8;
    const sparkleRadius = 80;
    const sparkles = Array.from({ length: sparkleCount }).map((_, i) => {
      const angle =
        (i / sparkleCount) * Math.PI * 2 - Math.PI / 2 + Math.PI / sparkleCount;
      return {
        id: i,
        x: Math.cos(angle) * sparkleRadius,
        y: Math.sin(angle) * sparkleRadius,
        delay: Math.random() * 1.5,
      };
    });

    return { fruits, sparkles };
  }, [allVeggies.length, isFullGrown]);

  return (
    <div className="flex flex-col items-center mb-8 w-full">
      <div className="h-48 flex items-center justify-center mb-4 plant-container relative w-full">
        {/* Main Tree Container centered */}
        <div
          className={`filter drop-shadow-xl select-none transition-all duration-500 relative flex items-center justify-center ${
            isBounce && !isFullGrown ? "bounce-anim" : ""
          }`}
        >
          {/* Main Plant EMOJI */}
          <div className="text-9xl filter drop-shadow-lg leading-none">
            {plantIcon}
          </div>

          {/* Full Grown Decorations */}
          {isFullGrown && (
            <>
              {/* Inner Circle: Fruits */}
              {treeVisuals.fruits.map((fruit: any, i: number) => (
                <div
                  key={`fruit-${i}`}
                  className="absolute z-20 flex items-center justify-center w-0 h-0"
                  style={{
                    transform: `translate(${fruit.x}px, ${fruit.y}px)`,
                  }}
                >
                  <div
                    className="text-2xl animate-bounce drop-shadow-md"
                    style={{
                      animationDuration: "3s",
                      animationDelay: `${fruit.delay}s`,
                    }}
                    title={fruit.name}
                  >
                    {fruit.icon}
                  </div>
                </div>
              ))}

              {/* Outer Circle: Sparkles */}
              {treeVisuals.sparkles.map((sparkle: any) => (
                <div
                  key={`sparkle-${sparkle.id}`}
                  className="absolute z-0 flex items-center justify-center w-0 h-0"
                  style={{
                    transform: `translate(${sparkle.x}px, ${sparkle.y}px)`,
                  }}
                >
                  <div
                    className="text-2xl text-yellow-300 sparkle"
                    style={{ animationDelay: `${sparkle.delay}s` }}
                  >
                    ✨
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="absolute bottom-0 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold shadow-md transform translate-y-2 z-30">
          ระดับ: {stageName}
        </div>
      </div>

      <div className="text-center bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-green-100 shadow-sm max-w-sm mb-4 w-full">
        <p className="text-gray-600 text-sm whitespace-pre-line font-medium mb-2">
          {description}
        </p>

        {/* Ranking Section */}
        {isFullGrown && sortedVeggies.length > 0 && (
          <div className="mt-3 pt-3 border-t border-green-200">
            <p className="text-xs font-bold text-green-800 mb-2 uppercase tracking-wide">
              🏆 ผักที่คุณกินบ่อยที่สุด
            </p>
            <div className="flex justify-center gap-3">
              {sortedVeggies.map(([name, count], idx) => {
                const v = allVeggies.find((av: any) => av.name === name);
                return (
                  <div key={name} className="flex flex-col items-center">
                    <span className="text-xl filter drop-shadow-sm mb-1">
                      {v?.icon || "🥗"}
                    </span>
                    <span className="text-[10px] text-gray-600 font-medium leading-none">
                      {name.split(" ")[0]}
                    </span>
                    <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full mt-1 font-bold">
                      x{count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isFullGrown && (
          <p className="text-xs text-green-600 mt-2 font-bold">
            (เติบโตมาแล้ว {daysCompleted} มื้อ)
          </p>
        )}
      </div>

      {/* Progress Circles for Today */}
      {!isFullGrown && (
        <div className="flex items-center gap-2 justify-center mt-2 bg-white/60 px-4 py-2 rounded-full shadow-sm">
          <span className="text-xs font-bold text-gray-500 mr-1">
            ระดับพลัง:
          </span>
          {[...Array(Math.min(todayMeals + 1, 5))].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${todayMeals > i ? "bg-green-500 scale-110" : "bg-gray-200"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function VeggieApp({ user }: { user: any }) {
  // State
  const [view, setView] = useState<
    "intro" | "dialogue" | "home" | "select" | "summary" | "history"
  >("intro");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialogue State
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const dialogueLines = [
    "สวัสดี",
    "ฉันชื่อ แคร์รอตตี้ 🥕",
    "นี่ฉันให้เมล็ดพืชปริศนากับเธอ...",
    "เธอต้องดูแลมันจนกว่ามันจะโตเต็มที่",
    "เธอต้องให้น้ำและอาหารกับมัน",
    "โดยการกินเมนู Plant-based! 🥗",
    "จากนั้นบันทึกผักที่เธอกินเข้าไป",
    "เพื่อแปรรูปเป็นปุ๋ยให้ต้นไม้ ✨",
    "ขอให้เธอโชคดี!",
  ];

  // Form State
  const [mealName, setMealName] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [justSavedLog, setJustSavedLog] = useState<any>(null);

  // Fetch History
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/logs");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    // Fix: Key by User ID so new accounts see it
    const storageKey = `veggie_intro_seen_${user?.id}`;
    const hasSeenIntro = localStorage.getItem(storageKey);

    if (hasSeenIntro) {
      setView("home");
    } else {
      setView("dialogue");
    }
  };

  const handleNextDialogue = () => {
    if (dialogueIndex < dialogueLines.length - 1) {
      setDialogueIndex((prev) => prev + 1);
    } else {
      // Fix: Save by User ID
      const storageKey = `veggie_intro_seen_${user?.id}`;
      localStorage.setItem(storageKey, "true");
      setView("home");
    }
  };

  const handleToggleVeggie = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    if (selectedIds.length === 0) return;
    if (!mealName.trim()) {
      alert("กรุณาใส่ชื่อเมนูด้วยนะครับ");
      return;
    }

    const selectedVeggies = VEGETABLE_DATA.filter((v) =>
      selectedIds.includes(v.id),
    );
    // Extract vitamins
    const allVitamins = new Set<string>();
    selectedVeggies.forEach((v) => {
      v.vitamins.forEach((vit) => allVitamins.add(vit));
    });

    const body = {
      date: new Date().toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      mealName,
      veggies: selectedVeggies,
      vitamins: Array.from(allVitamins),
    };

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        setJustSavedLog({
          ...data.log,
          analysis: {
            veggies: selectedVeggies,
            vitamins: Array.from(allVitamins),
          },
        });
        await fetchLogs(); // Refresh
        setMealName("");
        setSelectedIds([]);
        setView("summary"); // Show success
      }
    } catch (err) {
      console.error("Error saving", err);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  const { daysCompleted, todayMeals } = useMemo(
    () => calculatePlantStats(history),
    [history],
  );

  // --- Views ---

  const renderIntro = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center p-8 z-20 text-center overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div
          className="absolute top-10 left-[-20px] text-7xl opacity-30 float-anim blur-[3px]"
          style={{ animationDelay: "0.2s" }}
        >
          🥦
        </div>
        <div
          className="absolute top-24 right-[-20px] text-6xl opacity-30 float-anim blur-[3px]"
          style={{ animationDelay: "1.5s" }}
        >
          🍅
        </div>
        <div
          className="absolute bottom-16 left-[-10px] text-7xl opacity-30 float-anim blur-[3px]"
          style={{ animationDelay: "0.8s" }}
        >
          🥕
        </div>
        <div
          className="absolute bottom-8 right-[-10px] text-6xl opacity-30 float-anim blur-[3px]"
          style={{ animationDelay: "2.2s" }}
        >
          🍆
        </div>

        <div
          className="absolute top-1/3 left-[-30px] text-5xl opacity-20 rotate-12 float-anim blur-[2px]"
          style={{ animationDelay: "1.0s" }}
        >
          🥬
        </div>
        <div
          className="absolute top-[45%] right-[-20px] text-5xl opacity-20 -rotate-12 float-anim blur-[2px]"
          style={{ animationDelay: "2.8s" }}
        >
          🌽
        </div>

        <div
          className="absolute top-20 left-20 text-3xl sparkle text-yellow-400 opacity-60"
          style={{ animationDelay: "0.1s" }}
        >
          ✨
        </div>
        <div
          className="absolute bottom-32 left-10 text-2xl sparkle text-yellow-400 opacity-50"
          style={{ animationDelay: "1.3s" }}
        >
          ✨
        </div>
        <div
          className="absolute top-40 right-16 text-4xl sparkle text-yellow-400 opacity-50"
          style={{ animationDelay: "0.7s" }}
        >
          ✨
        </div>
      </div>

      <div className="relative z-10 mb-6 mt-12 float-anim">
        <span className="text-9xl filter drop-shadow-xl">🌱</span>
      </div>

      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-green-800 mb-2 leading-tight">
          PLANT YOUR MEALS!
        </h1>
        <p className="text-green-600 mb-8 font-light tracking-wider opacity-80">
          ปลูกพืชด้วยมื้อของคุณ!
        </p>

        <div className="bg-white/60 p-4 rounded-xl mb-8 backdrop-blur-sm border border-green-200 shadow-sm">
          <p className="text-gray-600 text-sm">
            "แปรรูปมื้ออาหารของคุณ
            <br />
            ให้กลายเป็นต้นไม้ในแบบของคุณ!"
          </p>
        </div>

        <button
          onClick={handleStartGame}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-full shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3 text-lg"
        >
          <span>🎮</span> เริ่มปลูกต้นไม้
        </button>
      </div>
    </div>
  );

  const renderDialogue = () => (
    <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-green-50 opacity-50 z-0"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6">
        {/* Speech Bubble */}
        <div
          onClick={handleNextDialogue}
          className="relative bg-white border-4 border-green-200 rounded-[2rem] p-6 shadow-xl mb-6 w-full cursor-pointer transform transition hover:scale-105 active:scale-95"
        >
          <p className="text-xl text-green-800 font-medium leading-relaxed text-center min-h-[3rem] flex items-center justify-center">
            {dialogueLines[dialogueIndex]}
            <span className="cursor-blink ml-1">|</span>
          </p>

          <div className="text-center mt-2">
            <span className="text-xs text-green-400 font-bold animate-pulse">
              แตะเพื่อไปต่อ ▶
            </span>
          </div>

          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[24px] border-t-green-200"></div>
          <div className="absolute -bottom-[20px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[20px] border-t-white"></div>
        </div>

        {/* Mascot */}
        <div className="relative float-anim mt-2">
          <img
            src="https://i.postimg.cc/vBsxg7nG/Plant-based.png"
            alt="Carroty Mascot"
            className="w-48 h-48 object-contain drop-shadow-2xl rounded-full border-4 border-white bg-orange-100"
          />
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
            แคร์รอตตี้ (Carroty) 🥕
          </div>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center p-6 h-full relative overflow-y-auto">
      {/* Branding Top Right */}
      <div
        id="top-branding"
        className="absolute top-4 right-4 z-20 flex items-center gap-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-green-100 max-w-[200px]"
      >
        <div className="flex flex-col items-end leading-tight">
          <span className="text-[10px] font-bold text-green-800 uppercase">
            Veggie Grow
          </span>
          <span className="text-[8px] text-green-600">
            สวัสดี, {user?.name || "นักปลูกผัก"}
          </span>
        </div>
        <img
          src="https://i.postimg.cc/pXVN3PVk/Untitled-Artwork.png"
          alt="Logo"
          className="w-8 h-8 rounded-full border border-green-200"
        />
      </div>

      {/* Logout (Top Left) */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <form action={handleSignOut}>
          <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 shadow-sm border border-green-50 transition-colors">
            <LogOut size={18} />
          </button>
        </form>
        {/* Undo/Reset Intro for Testing */}
        <button
          onClick={() => {
            const storageKey = `veggie_intro_seen_${user?.id}`;
            localStorage.removeItem(storageKey);
            setView("intro");
          }}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-blue-500 shadow-sm border border-green-50 transition-colors"
          title="เล่น Intro ใหม่"
        >
          <History size={18} />
        </button>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 text-4xl opacity-20 float-anim">
          🥦
        </div>
        <div
          className="absolute bottom-32 right-10 text-4xl opacity-20 float-anim"
          style={{ animationDelay: "1s" }}
        >
          🥕
        </div>
        <div className="absolute top-1/2 left-1/4 text-2xl sparkle text-yellow-300 opacity-50">
          ✨
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center mt-10">
        <h1 className="text-3xl font-bold text-green-800 mb-1 drop-shadow-sm">
          พร้อมปลูกมื้อนี้?
        </h1>
        <p className="text-green-600 mb-8 font-light text-sm">
          เปลี่ยนผักในจานให้เป็นต้นไม้ที่แข็งแรง
        </p>

        <PlantPot
          daysCompleted={daysCompleted}
          todayMeals={todayMeals}
          history={history}
        />

        <button
          onClick={() => setView("select")}
          className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3 text-lg"
        >
          <span>🎮</span> บันทึกมื้ออาหาร
        </button>

        {/* History Link */}
        <button
          onClick={() => setView("history")}
          className="mt-4 text-green-600 text-sm font-medium hover:underline flex items-center gap-1 opacity-80"
        >
          <History size={14} /> ดูประวัติการปลูก
        </button>
      </div>

      {/* Mascot (Hidden in Home now as per new flows, or optional) */}
    </div>
  );

  const renderSelect = () => (
    <div className="h-full flex flex-col bg-[#f0fdf4]">
      <div className="px-6 py-4 pb-2 z-10 bg-white/50 backdrop-blur-sm sticky top-0">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setView("home")}
            className="p-2 -ml-2 text-gray-500 hover:bg-white/50 rounded-full"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-green-800">เลือกผักในมื้อนี้</span>
          <div className="w-8"></div>
        </div>
        <input
          type="text"
          placeholder="ชื่อเมนู (เช่น ผัดผักรวม)"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          className="w-full bg-white border border-green-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm transition-all"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24 pt-4">
        <div className="grid grid-cols-3 gap-3">
          {VEGETABLE_DATA.map((v) => (
            <label key={v.id} className="cursor-pointer relative group">
              <input
                type="checkbox"
                className="hidden"
                checked={selectedIds.includes(v.id)}
                onChange={() => handleToggleVeggie(v.id)}
              />
              <div
                className={`
                            border-2 rounded-xl p-2 text-center transition-all h-full flex flex-col items-center justify-center gap-1 aspect-square
                            ${
                              selectedIds.includes(v.id)
                                ? "border-green-500 bg-green-100 transform scale-105 shadow-md"
                                : "border-white bg-white hover:border-green-200 shadow-sm"
                            }
                        `}
              >
                <span className="text-3xl filter drop-shadow-sm">{v.icon}</span>
                <span className="text-[10px] font-bold text-gray-700 leading-tight">
                  {v.name}
                </span>
              </div>
              {selectedIds.includes(v.id) && (
                <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-0.5 shadow-sm">
                  <Check size={10} />
                </div>
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#f0fdf4] via-[#f0fdf4] to-transparent z-20">
        <button
          onClick={handleSave}
          disabled={selectedIds.length === 0}
          className={`
                    w-full py-4 rounded-xl font-bold shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2
                    ${selectedIds.length > 0 ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}
                `}
        >
          <span>📝</span> บันทึกและปลูก ({selectedIds.length})
        </button>
      </div>
    </div>
  );

  const renderSummary = () => {
    if (!justSavedLog) return null;
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-300 via-emerald-200 to-green-100 z-0"></div>

        <div className="relative z-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl w-full max-w-sm border-4 border-green-50 animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 shadow-inner">
            <Sun size={32} />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">สุดยอดมาก!</h2>
          <p className="text-gray-600 mb-6 text-sm">
            มื้อ "{justSavedLog.mealName}" ได้ถูกเปลี่ยนเป็นปุ๋ยแล้ว
          </p>

          <div className="bg-green-50 rounded-xl p-4 text-left border border-green-100 mb-6">
            <h3 className="font-bold text-green-700 mb-2 text-xs uppercase tracking-wider">
              สารอาหารที่ได้รับ
            </h3>
            <div className="flex flex-wrap gap-2">
              {justSavedLog.analysis.vitamins.map((v: string, i: number) => (
                <span
                  key={i}
                  className="bg-white text-green-600 px-2 py-1 rounded-md text-xs font-bold border border-green-200 shadow-sm"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setView("home")}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-700 transition"
          >
            กลับไปดูต้นไม้โต 🌳
          </button>
        </div>

        {/* Sparkles */}
        <div className="absolute top-1/4 left-10 text-2xl sparkle text-white opacity-80">
          ✨
        </div>
        <div
          className="absolute bottom-1/4 right-10 text-3xl sparkle text-white opacity-80"
          style={{ animationDelay: "0.5s" }}
        >
          ✨
        </div>
      </div>
    );
  };

  const renderHistory = () => (
    <div className="h-full flex flex-col bg-[#f0fdf4]">
      <div className="px-6 py-4 bg-white/50 backdrop-blur-sm flex items-center gap-2 sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => setView("home")}
          className="p-2 -ml-2 text-gray-500 hover:bg-white rounded-full"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="font-bold text-green-800 text-lg">ประวัติการกินผัก</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            ยังไม่มีบันทึกครับ
          </div>
        ) : (
          history.map((log) => (
            <div
              key={log.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-green-50 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="font-bold text-gray-700">{log.mealName}</span>
                <span className="text-xs text-gray-400">{log.date}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {log.veggies && log.veggies.length > 0 ? (
                  log.veggies.map((v: any, i: number) => (
                    <span key={i} className="text-xl" title={v.name}>
                      {v.icon}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">ไม่พบข้อมูลผัก</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-green-50 font-['Kanit']">
      <div className="w-full max-w-md bg-white/40 rounded-3xl shadow-2xl overflow-hidden border-4 border-white/50 min-h-[600px] h-[600px] relative backdrop-blur-xl">
        {view === "intro" && renderIntro()}
        {view === "dialogue" && renderDialogue()}
        {view === "home" && renderHome()}
        {view === "select" && renderSelect()}
        {view === "summary" && renderSummary()}
        {view === "history" && renderHistory()}
      </div>
    </div>
  );
}
