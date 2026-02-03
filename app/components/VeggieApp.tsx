"use client";

import { useState, useEffect, useMemo } from "react";
import { Check } from "lucide-react";

// --- Data Configuration (from JS) ---
const VEGETABLES = [
  {
    id: "lettuce",
    name: "ผักกาดหอม",
    icon: "🥬",
    nutrients: "ไฟเบอร์, วิตามิน A",
    benefit: "ช่วยการขับถ่ายและบำรุงสายตา",
  },
  {
    id: "cabbage",
    name: "กะหล่ำปลี",
    icon: "🥬",
    nutrients: "วิตามิน C, กลูตามีน",
    benefit: "เสริมภูมิคุ้มกัน ลดการระคายเคืองกระเพาะ",
  },
  {
    id: "carrot",
    name: "แคร์รอต",
    icon: "🥕",
    nutrients: "เบต้าแคโรทีน",
    benefit: "บำรุงผิวพรรณและดวงตา ชะลอวัย",
  },
  {
    id: "broccoli",
    name: "บล็อคโคลี่",
    icon: "🥦",
    nutrients: "ซัลโฟราเฟน, แคลเซียม",
    benefit: "ต้านอนุมูลอิสระ ลดความเสี่ยงมะเร็ง",
  },
  {
    id: "corn",
    name: "ข้าวโพด",
    icon: "🌽",
    nutrients: "คาร์โบไฮเดรต, วิตามิน B",
    benefit: "ให้พลังงาน บำรุงระบบประสาท",
  },
  {
    id: "tomato",
    name: "มะเขือเทศ",
    icon: "🍅",
    nutrients: "ไลโคปีน",
    benefit: "ผิวพรรณสดใส ลดความเสี่ยงมะเร็งต่อมลูกหมาก",
  },
  {
    id: "eggplant",
    name: "มะเขือม่วง",
    icon: "🍆",
    nutrients: "นาซูนิน",
    benefit: "บำรุงสมอง ปกป้องผนังเซลล์",
  },
  {
    id: "cucumber",
    name: "แตงกวา",
    icon: "🥒",
    nutrients: "น้ำ, ซิลิก้า",
    benefit: "เพิ่มความชุ่มชื้น ขับปัสสาวะ",
  },
  {
    id: "pepper",
    name: "พริกหยวก",
    icon: "🫑",
    nutrients: "วิตามิน C สูง",
    benefit: "ป้องกันหวัด กระตุ้นการไหลเวียนเลือด",
  },
];

const LEVELS = [
  {
    name: "เมล็ดปริศนา",
    icon: "🫘",
    req: 0,
    text: "เมล็ดต้องการน้ำและอาหาร...",
  },
  {
    name: "ต้นอ่อนแข็งแรง",
    icon: "🌱",
    req: 1,
    text: "ต้นอ่อนกำลังต้องการสารอาหารเพื่อยืดตัว!",
  },
  {
    name: "ต้นไม้เจริญวัย",
    icon: "🪴",
    req: 2,
    text: "ใกล้จะโตเต็มที่แล้ว! ขออีกมื้อนะ",
  },
  { name: "ต้นไม้สมบูรณ์", icon: "🌳", req: 3, text: "โตเต็มวัยสวยงาม!" },
];

const DIALOGUE_LINES = [
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

export default function VeggieApp() {
  // --- View State ---
  const [view, setView] = useState<"intro" | "dialogue" | "game" | "summary">(
    "intro",
  );
  const [showReadyModal, setShowReadyModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  // --- Game State ---
  const [currentLevel, setCurrentLevel] = useState(0);
  const [totalLogs, setTotalLogs] = useState<typeof VEGETABLES>([]); // Stores all selected veggies history

  // --- Dialogue State ---
  const [dialogueIndex, setDialogueIndex] = useState(0);

  // --- Selection State ---
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [analysisData, setAnalysisData] = useState<{
    nutrients: string[];
    benefits: string[];
    veggies: typeof VEGETABLES;
  } | null>(null);

  // Init check
  useEffect(() => {
    // Reset or load state if we wanted persistence, but user said "no database" so local state is fine.
    // Maybe we keep localStorage for "has seen intro" if we want, but let's stick to the script logic.
    // The script logic is purely session-based.
  }, []);

  // --- Handlers ---

  const handleStart = () => {
    setView("dialogue");
    setDialogueIndex(0);
  };

  const handleNextDialogue = () => {
    if (dialogueIndex < DIALOGUE_LINES.length - 1) {
      setDialogueIndex((prev) => prev + 1);
    } else {
      setView("game");
      setCurrentLevel(0); // Ensure start at 0
    }
  };

  // Toggle Selection
  const toggleVeggie = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  // Analyze (Click Record Meal)
  const handleAnalyze = () => {
    if (selectedIds.length === 0) {
      alert("กรุณาเลือกผักอย่างน้อย 1 อย่างครับ");
      return;
    }

    const selectedVeggies = VEGETABLES.filter((v) =>
      selectedIds.includes(v.id),
    );

    // Calculate Analysis
    const nutrients = new Set<string>();
    const benefits = new Set<string>();

    selectedVeggies.forEach((v) => {
      v.nutrients.split(", ").forEach((n) => nutrients.add(n));
      benefits.add(v.benefit);
    });

    setAnalysisData({
      veggies: selectedVeggies,
      nutrients: Array.from(nutrients),
      benefits: Array.from(benefits),
    });

    setShowAnalysisModal(true);
  };

  // Confirm Growth (After Analysis)
  const handleConfirmGrowth = () => {
    if (!analysisData) return;

    // Add to logs
    setTotalLogs((prev) => [...prev, ...analysisData.veggies]);

    // Clear selection
    setSelectedIds([]);
    setShowAnalysisModal(false);

    // Level Logic
    if (currentLevel < LEVELS.length - 1) {
      const nextLevel = currentLevel + 1;
      setCurrentLevel(nextLevel);

      // If max level reached
      if (nextLevel === LEVELS.length - 1) {
        setTimeout(() => {
          setShowReadyModal(true);
        }, 1000);
      }
    }
  };

  // Trigger Summary (From Ready Modal)
  const handleTriggerSummary = () => {
    setShowReadyModal(false);
    setView("summary");
  };

  // Reset Game
  const handleReset = () => {
    setCurrentLevel(0);
    setTotalLogs([]);
    setView("intro");
  };

  // --- Sub-Components / Render Helpers ---

  const renderIntro = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center p-8 z-20 text-center overflow-hidden">
      {/* Background Elements */}
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
          onClick={handleStart}
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
        <div
          onClick={handleNextDialogue}
          className="relative bg-white border-4 border-green-200 rounded-[2rem] p-6 shadow-xl mb-6 w-full cursor-pointer transform transition hover:scale-105 active:scale-95"
        >
          <p className="text-xl text-green-800 font-medium leading-relaxed text-center min-h-[3rem] flex items-center justify-center">
            {DIALOGUE_LINES[dialogueIndex]}
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

  const renderGame = () => {
    const levelData = LEVELS[currentLevel];
    const progress = (currentLevel / (LEVELS.length - 1)) * 100;
    const isGrowAnim = true; // Use key or logic to trigger animation? React handles diffs.

    return (
      <div className="p-6 flex flex-col items-center flex-grow h-full w-full">
        {/* Header / Branding */}
        <div className="absolute top-2 right-2 z-50 flex items-center gap-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-green-100 max-w-[220px]">
          <div className="flex flex-col items-end leading-tight">
            <span className="text-[10px] font-bold text-green-800 uppercase tracking-wide">
              Plant-based Made Easy
            </span>
            <span className="text-[8px] text-green-600 whitespace-nowrap font-medium">
              แพลนท์เบสง่ายๆ แค่จานเดิมเพิ่มผัก
            </span>
          </div>
          <img
            src="https://i.postimg.cc/pXVN3PVk/Untitled-Artwork.png"
            alt="Logo"
            className="w-8 h-8 rounded-full border border-green-200 shadow-sm"
          />
        </div>

        <div className="w-full bg-green-600 p-4 text-center rounded-xl mb-4 mt-8">
          <h1 className="text-2xl font-bold text-white">
            Plant your meals! 🌱
          </h1>
        </div>

        {/* Level Progress */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Plant Display */}
        <div className="h-48 flex items-center justify-center mb-4 plant-container relative w-full">
          <div className="text-9xl bounce-anim filter drop-shadow-lg select-none">
            {levelData.icon}
          </div>
          <div className="absolute bottom-0 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold shadow-md">
            ระดับ: {levelData.name}
          </div>
        </div>

        {/* Instruction Text */}
        <div className="text-center mb-6">
          <p className="text-gray-600">{levelData.text}</p>
        </div>

        {/* Selection Area */}
        <div className="w-full flex-1 overflow-y-auto pb-20">
          <div className="grid grid-cols-3 gap-3 mb-6">
            {VEGETABLES.map((v) => (
              <label key={v.id} className="cursor-pointer relative group">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedIds.includes(v.id)}
                  onChange={() => toggleVeggie(v.id)}
                />
                <div
                  className={`border-2 rounded-xl p-2 text-center transition-all h-full flex flex-col items-center justify-center ${selectedIds.includes(v.id) ? "border-green-500 bg-green-100 transform scale-105" : "border-green-100 hover:bg-green-50"}`}
                >
                  <span className="text-3xl mb-1">{v.icon}</span>
                  <span className="text-xs font-medium text-gray-700 leading-tight">
                    {v.name}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 bg-white border-t border-green-100">
          <button
            onClick={handleAnalyze}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>📝</span> บันทึกมื้ออาหาร
          </button>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    const uniqueIcons = [...new Set(totalLogs.map((v) => v.name))];
    const allBenefits = Array.from(new Set(totalLogs.map((v) => v.benefit)));

    // Tree visuals
    const displayFruits = [...totalLogs]
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
    const radius = 50;

    return (
      <div className="social-card p-8 text-center h-full flex flex-col items-center justify-center pt-16 relative overflow-hidden">
        {/* Sparkles BG */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-xl sparkle text-white">
            ✨
          </div>
          <div
            className="absolute bottom-20 right-10 text-2xl sparkle text-white"
            style={{ animationDelay: "1s" }}
          >
            ✨
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl w-full flex flex-col items-center z-10">
          {/* Final Tree */}
          <div className="relative w-48 h-48 flex items-center justify-center mb-6 mt-2">
            <div className="text-9xl relative z-10 filter drop-shadow-xl">
              🌳
            </div>

            {/* Fruits */}
            {displayFruits.map((v, i) => {
              const angle =
                (i / displayFruits.length) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <div
                  key={i}
                  className="absolute z-20 flex items-center justify-center w-0 h-0"
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  <div
                    className="text-2xl animate-bounce drop-shadow-md"
                    style={{
                      animationDuration: "3s",
                      animationDelay: `${Math.random()}s`,
                    }}
                  >
                    {v.icon}
                  </div>
                </div>
              );
            })}

            {/* Sparkles Ring */}
            {[...Array(8)].map((_, i) => {
              const sRadius = 80;
              const angle = (i / 8) * Math.PI * 2 - Math.PI / 2 + Math.PI / 8;
              const x = Math.cos(angle) * sRadius;
              const y = Math.sin(angle) * sRadius;
              return (
                <div
                  key={i}
                  className="absolute z-0 flex items-center justify-center w-0 h-0"
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  <div
                    className="text-2xl text-yellow-300 sparkle"
                    style={{ animationDelay: `${Math.random() * 1.5}s` }}
                  >
                    ✨
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="text-2xl font-bold text-green-800 mb-2">
            สุดยอดนักกินผัก!
          </h2>
          <p className="text-green-700 mb-4">ต้นไม้ของคุณเติบโตสมบูรณ์แล้ว!</p>

          <div className="border-t border-b border-green-200 py-4 my-4 text-left w-full">
            <h3 className="font-bold text-gray-700 mb-2 text-sm">
              สรุปสิ่งที่ที่ได้รับ:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✅</span>{" "}
                <span>
                  กินผักไปทั้งหมด <b>{totalLogs.length}</b> รายการ
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">🥗</span>{" "}
                <span>ความหลากหลาย: {uniqueIcons.join(", ")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">💪</span>{" "}
                <span>
                  <b>ลดความเสี่ยง:</b> {allBenefits.slice(0, 3).join(", ")}{" "}
                  และอื่นๆ
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-green-100 rounded-lg p-3 text-xs text-green-800 font-medium w-full text-center leading-relaxed">
            การกินผักหลากหลายช่วยลดความเสี่ยงของการเกิดโรค
            <br />
            แถมยังเสริมสร้างภูมิคุ้มกันให้แข็งแรงอีกด้วย
            <br />
            <span className="font-bold text-green-700 mt-2 block">
              #แพลนท์เบสง่ายๆแค่จานเดิมเพิ่มผัก
            </span>
            <span className="font-bold text-green-700">
              #PlantBasedMadeEasy
            </span>
          </div>
        </div>

        <p className="mt-6 text-green-900 font-medium opacity-75 text-sm z-10">
          แคปหน้าจอนี้เพื่อชวนเพื่อนมาปลูกต้นไม้ด้วยกัน! 📸
        </p>

        <button
          onClick={handleReset}
          className="mt-4 bg-white text-green-600 font-bold py-2 px-6 rounded-full shadow hover:bg-gray-50 transition z-10"
        >
          ปลูกต้นใหม่ 🔄
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-['Kanit'] bg-[#f0fdf4]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-green-100 min-h-[600px] flex flex-col relative h-[800px]">
        {view === "intro" && renderIntro()}
        {view === "dialogue" && renderDialogue()}
        {view === "game" && renderGame()}
        {view === "summary" && renderSummary()}

        {/* Analysis Modal */}
        {showAnalysisModal && analysisData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl transform scale-100 transition-transform">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ✨ สารอาหารที่ได้รับ
              </h3>
              <div className="text-gray-600 text-sm mb-4 space-y-2">
                <div className="mb-2">
                  <strong className="text-green-600 block">คุณเลือก:</strong>
                  {analysisData.veggies
                    .map((v) => v.icon + " " + v.name)
                    .join(", ")}
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <p className="mb-1">
                    <strong>💊 สารอาหารที่ได้:</strong>{" "}
                    {analysisData.nutrients.join(", ")}
                  </p>
                  <p>
                    <strong>🛡️ ประโยชน์:</strong>{" "}
                    {analysisData.benefits.join(". ")}
                  </p>
                </div>
              </div>
              <button
                onClick={handleConfirmGrowth}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-xl shadow-md hover:from-green-600 hover:to-green-700"
              >
                แปรรูปเป็นปุ๋ยให้ต้นไม้โต! 💧
              </button>
            </div>
          </div>
        )}

        {/* Ready Modal */}
        {showReadyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center transform scale-100 transition-transform border-4 border-yellow-200">
              <div className="text-6xl mb-4 animate-bounce">🎁</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                ต้นไม้โตเต็มที่แล้ว!
              </h3>
              <p className="text-gray-600 mb-6">
                พร้อมที่จะดูผลผลิตต้นไม้ของคุณหรือยัง?
              </p>
              <button
                onClick={handleTriggerSummary}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-bold py-3 rounded-xl shadow-lg hover:from-yellow-500 hover:to-yellow-600 transform transition hover:scale-105"
              >
                เปิดดูผลผลิตเลย! ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
