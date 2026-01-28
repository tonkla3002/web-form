"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Leaf,
  Heart,
  Shield,
  Activity,
  Plus,
  ChevronLeft,
  Check,
  Info,
  Droplets,
  Sun,
  Eye,
  Bone,
  History,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  X,
} from "lucide-react";

// --- Database ข้อมูลผัก (Vegetable Data) ---
const VEGETABLE_DATA = [
  {
    id: 1,
    name: "คะน้า (Kale)",
    icon: "🥬",
    vitamins: ["วิตามิน A", "วิตามิน C", "วิตามิน K", "แคลเซียม"],
    benefits: "บำรุงกระดูกและฟัน, ช่วยเรื่องการแข็งตัวของเลือด",
    prevention: "โรคกระดูกพรุน, โรคมะเร็ง",
    color: "bg-green-600",
  },
  {
    id: 2,
    name: "แครอท (Carrot)",
    icon: "🥕",
    vitamins: ["เบต้าแคโรทีน", "วิตามิน A", "วิตามิน B6"],
    benefits: "บำรุงสายตา, ผิวพรรณเปล่งปลั่ง, ชะลอวัย",
    prevention: "โรคตาฟาง, มะเร็งปอด",
    color: "bg-orange-500",
  },
  {
    id: 3,
    name: "บล็อคโคลี (Broccoli)",
    icon: "🥦",
    vitamins: ["วิตามิน C", "วิตามิน K", "โฟเลต", "ไฟเบอร์"],
    benefits: "กระตุ้นการขับถ่าย, เสริมภูมิคุ้มกัน",
    prevention: "โรคมะเร็งลำไส้, โรคหัวใจ",
    color: "bg-green-500",
  },
  {
    id: 4,
    name: "มะเขือเทศ (Tomato)",
    icon: "🍅",
    vitamins: ["ไลโคปีน", "วิตามิน C", "วิตามิน A"],
    benefits: "ผิวพรรณดี, ลดรอยเหี่ยวย่น, บำรุงหัวใจ",
    prevention: "มะเร็งต่อมลูกหมาก, โรคหลอดเลือดสมอง",
    color: "bg-red-500",
  },
  {
    id: 5,
    name: "ถั่วแดง (Red Bean)",
    icon: "🫘",
    vitamins: ["โปรตีน", "ธาตุเหล็ก", "วิตามิน B"],
    benefits: "ให้พลังงาน, บำรุงเลือด, ช่วยระบบประสาท",
    prevention: "โรคโลหิตจาง, โรคเหน็บชา",
    color: "bg-red-800",
  },
  {
    id: 6,
    name: "ถั่วลิสง (Peanut)",
    icon: "🥜",
    vitamins: ["ไขมันดี", "วิตามิน E", "แมกนีเซียม"],
    benefits: "บำรุงสมอง, ให้พลังงานสูง, ลดคอเลสเตอรอล",
    prevention: "โรคอัลไซเมอร์, โรคหัวใจ",
    color: "bg-amber-600",
  },
  {
    id: 7,
    name: "ผักสลัด/ผักกาดหอม",
    icon: "🥗",
    vitamins: ["ไฟเบอร์", "วิตามิน A", "โฟเลต"],
    benefits: "ช่วยให้นอนหลับง่าย, ขับถ่ายสะดวก, แคลอรี่ต่ำ",
    prevention: "โรคท้องผูก, โรคอ้วน",
    color: "bg-green-400",
  },
  {
    id: 8,
    name: "ผักบุ้ง (Morning Glory)",
    icon: "🌿",
    vitamins: ["วิตามิน A", "วิตามิน C", "ธาตุเหล็ก"],
    benefits: "บำรุงสายตาให้แจ่มใส, ลดอาการตาแห้ง",
    prevention: "โรคสายตาสั้น, โรคต้อกระจก",
    color: "bg-green-700",
  },
  {
    id: 9,
    name: "ฟักทอง (Pumpkin)",
    icon: "🎃",
    vitamins: ["เบต้าแคโรทีน", "วิตามิน A", "คอลลาเจน"],
    benefits: "บำรุงผิวพรรณ, เสริมสร้างระบบภูมิคุ้มกัน",
    prevention: "โรคมะเร็ง, โรคเบาหวาน (ช่วยคุมน้ำตาล)",
    color: "bg-yellow-500",
  },
  {
    id: 10,
    name: "กะหล่ำปลี (Cabbage)",
    icon: "🥬",
    vitamins: ["วิตามิน C", "กลูตามีน"],
    benefits: "รักษาแผลในกระเพาะอาหาร, ช่วยย่อยอาหาร",
    prevention: "โรคกระเพาะอาหาร, มะเร็งลำไส้",
    color: "bg-green-300",
  },
  {
    id: 11,
    name: "แตงกวา (Cucumber)",
    icon: "🥒",
    vitamins: ["น้ำ", "วิตามิน K", "โพแทสเซียม"],
    benefits: "เพิ่มความชุ่มชื้น, ขับปัสสาวะ, ลดความร้อน",
    prevention: "ภาวะขาดน้ำ, ลดความดันโลหิต",
    color: "bg-emerald-400",
  },
  {
    id: 12,
    name: "ข้าวโพด (Corn)",
    icon: "🌽",
    vitamins: ["คาร์โบไฮเดรต", "วิตามิน B1", "ลูทีน"],
    benefits: "ให้พลังงาน, บำรุงสายตา (จอประสาทตา)",
    prevention: "โรคจอประสาทตาเสื่อม",
    color: "bg-yellow-400",
  },
  {
    id: 13,
    name: "ตำลึง (Ivy Gourd)",
    icon: "🌿",
    vitamins: ["วิตามิน A", "แคลเซียม", "ฟอสฟอรัส"],
    benefits: "ดับพิษร้อน, บำรุงสายตา, แก้แพ้",
    prevention: "โรคเบาหวาน, โรคตา",
    color: "bg-green-500",
  },
  {
    id: 14,
    name: "ใบโหระพา (Sweet Basil)",
    icon: "🍃",
    vitamins: ["เบต้าแคโรทีน", "แคลเซียม"],
    benefits: "แก้ท้องอืด, ช่วยย่อยอาหาร, ขับลม",
    prevention: "โรคหวัด, ยับยั้งเชื้อโรค",
    color: "bg-green-700",
  },
  {
    id: 15,
    name: "ใบกะเพรา (Holy Basil)",
    icon: "🌿",
    vitamins: ["วิตามิน C", "ฟอสฟอรัส", "แคลเซียม"],
    benefits: "ขับลม, แก้ปวดท้อง, บำรุงธาตุไฟ",
    prevention: "โรคกระเพาะ, ไข้หวัด",
    color: "bg-emerald-800",
  },
  {
    id: 16,
    name: "ผักชี (Coriander)",
    icon: "☘️",
    vitamins: ["วิตามิน A", "วิตามิน C"],
    benefits: "ขับลม, บำรุงสายตา, แก้วิงเวียน",
    prevention: "อาการคลื่นไส้",
    color: "bg-green-400",
  },
  {
    id: 17,
    name: "ต้นหอม (Spring Onion)",
    icon: "🥬",
    vitamins: ["วิตามิน C", "แคลเซียม", "ฟอสฟอรัส"],
    benefits: "ป้องกันหวัด, ลดคอเลสเตอรอล",
    prevention: "โรคหัวใจ, ไข้หวัด",
    color: "bg-green-500",
  },
  {
    id: 18,
    name: "หอมหัวใหญ่ (Onion)",
    icon: "🧅",
    vitamins: ["วิตามิน C", "เคอร์ซีติน"],
    benefits: "ช่วยให้หลับง่าย, บำรุงหัวใจ",
    prevention: "โรคภูมิแพ้, โรคหอบหืด",
    color: "bg-orange-200",
  },
  {
    id: 19,
    name: "กระเทียม (Garlic)",
    icon: "🧄",
    vitamins: ["อัลลิซิน", "ซีลีเนียม", "กำมะถัน"],
    benefits: "ลดไขมันในเลือด, เสริมภูมิต้านทาน",
    prevention: "โรคหัวใจ, ความดันโลหิตสูง",
    color: "bg-amber-100",
  },
  {
    id: 20,
    name: "มันฝรั่ง (Potato)",
    icon: "🥔",
    vitamins: ["คาร์โบไฮเดรต", "วิตามิน B6"],
    benefits: "ให้พลังงาน, บำรุงสมองและประสาท",
    prevention: "โรคโลหิตจาง",
    color: "bg-yellow-600",
  },
  {
    id: 21,
    name: "มะเขือยาว (Long Eggplant)",
    icon: "🍆",
    vitamins: ["วิตามิน C", "ไฟเบอร์"],
    benefits: "ลดคอเลสเตอรอล, ช่วยระบบขับถ่าย",
    prevention: "โรคหลอดเลือด",
    color: "bg-purple-500",
  },
  {
    id: 22,
    name: "มะเขือพวง (Pea Eggplant)",
    icon: "🟢",
    vitamins: ["เพกติน", "ธาตุเหล็ก", "ไฟเบอร์"],
    benefits: "ดูดซับไขมัน, บำรุงเลือด, แก้ไอ",
    prevention: "โรคเบาหวาน, โรคโลหิตจาง",
    color: "bg-green-600",
  },
  {
    id: 23,
    name: "พริกขี้หนู (Bird's Eye Chili)",
    icon: "🌶️",
    vitamins: ["แคปไซซิน", "วิตามิน C"],
    benefits: "ช่วยเผาผลาญ, เจริญอาหาร, ขับเหงื่อ",
    prevention: "หวัดคัดจมูก, โรคอ้วน",
    color: "bg-red-600",
  },
  {
    id: 24,
    name: "พริกชี้ฟ้า (Chili Pepper)",
    icon: "🌶️",
    vitamins: ["วิตามิน A", "วิตามิน C"],
    benefits: "บำรุงสายตา, กระตุ้นเลือดไหลเวียน",
    prevention: "โรคภูมิแพ้",
    color: "bg-red-500",
  },
  {
    id: 25,
    name: "ข่า (Galangal)",
    icon: "🫚",
    vitamins: ["ฟอสฟอรัส", "แคลเซียม"],
    benefits: "ขับลม, แก้ท้องอืด, ฆ่าเชื้อรา",
    prevention: "กลากเกลื้อน, อาหารไม่ย่อย",
    color: "bg-stone-300",
  },
  {
    id: 26,
    name: "ตะไคร้ (Lemongrass)",
    icon: "🎋",
    vitamins: ["วิตามิน A", "แคลเซียม"],
    benefits: "ขับปัสสาวะ, ลดความดันโลหิต, ผ่อนคลาย",
    prevention: "นิ่ว, โรคความดัน",
    color: "bg-lime-400",
  },
  {
    id: 27,
    name: "ใบมะกรูด (Kaffir Lime Leaves)",
    icon: "🍃",
    vitamins: ["เบต้าแคโรทีน", "วิตามิน C"],
    benefits: "แก้ไอ, ฟอกโลหิต, ช่วยให้ผ่อนคลาย",
    prevention: "มะเร็ง, ชะลอวัย",
    color: "bg-green-800",
  },
  {
    id: 28,
    name: "ขิง (Ginger)",
    icon: "🫚",
    vitamins: ["จิงเจอรอล", "วิตามิน B"],
    benefits: "ลดอาการคลื่นไส้, เผาผลาญไขมัน",
    prevention: "ไมเกรน, ท้องอืด",
    color: "bg-amber-300",
  },
  {
    id: 29,
    name: "ถั่วฝักยาว (Long Bean)",
    icon: "🥒",
    vitamins: ["วิตามิน A", "วิตามิน C", "แคลเซียม"],
    benefits: "บำรุงกระดูก, ผิวพรรณชุ่มชื้น",
    prevention: "โรคกระดูกพรุน",
    color: "bg-green-500",
  },
  {
    id: 30,
    name: "ถั่วงอก (Bean Sprouts)",
    icon: "🌱",
    vitamins: ["วิตามิน C", "เลซิทิน", "วิตามิน B12"],
    benefits: "ช่วยย่อย, บำรุงประสาทและสมอง",
    prevention: "โรคหวัด, ความเสื่อมของร่างกาย",
    color: "bg-slate-100",
  },
  {
    id: 31,
    name: "ผักกาดขาว (Chinese Cabbage)",
    icon: "🥬",
    vitamins: ["โฟเลต", "แคลเซียม", "วิตามิน C"],
    benefits: "ย่อยง่าย, แก้ร้อนใน, ขับปัสสาวะ",
    prevention: "มะเร็งลำไส้",
    color: "bg-green-100",
  },
  {
    id: 32,
    name: "ข้าวโพดอ่อน (Baby Corn)",
    icon: "🌽",
    vitamins: ["วิตามิน B", "เบต้าแคโรทีน"],
    benefits: "บำรุงหัวใจ, ย่อยง่าย",
    prevention: "โรคหัวใจ, คอเลสเตอรอลสูง",
    color: "bg-yellow-200",
  },
];

// สารอาหารหลักที่ควรได้รับให้ครบถ้วน
const ESSENTIAL_NUTRIENTS = [
  "วิตามิน A",
  "วิตามิน C",
  "ไฟเบอร์",
  "ธาตุเหล็ก",
  "แคลเซียม",
];

// --- Components defined OUTSIDE to fix mobile keyboard dismissal ---

const InsightModal = ({ showModal, setShowModal, setView }: any) => {
  if (!showModal) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center relative">
        <button
          onClick={() => {
            setShowModal(false);
            setView("home");
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
          <TrendingUp size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          บันทึกครบ 3 มื้อแล้ว!
        </h3>
        <p className="text-gray-500 mb-6 text-sm">
          ระบบได้วิเคราะห์โภชนาการจาก 3 มื้อล่าสุดของคุณเรียบร้อยแล้ว
          ต้องการดูสรุปเลยหรือไม่?
        </p>
        <div className="space-y-3">
          <button
            onClick={() => {
              setShowModal(false);
              setView("history");
            }}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 shadow-md transition-colors"
          >
            ดูผลวิเคราะห์
          </button>
          <button
            onClick={() => {
              setShowModal(false);
              setView("home");
            }}
            className="w-full bg-gray-50 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
};

const HomeScreen = ({ setView, history, setMealName }: any) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6 animate-fade-in relative">
    {/* History Button (Top Right) */}
    <button
      onClick={() => setView("history")}
      className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
    >
      <History size={24} />
    </button>
    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
      <Leaf size={48} className="text-green-600" />
    </div>
    <h1 className="text-3xl font-bold text-gray-800 mb-2">Veggie Log</h1>
    <p className="text-gray-500 mb-10 max-w-xs">
      บันทึกมื้ออาหารเพื่อสุขภาพที่ดีของคุณ
      <br />
      วันนี้คุณทานผักอะไรไปบ้าง?
    </p>
    <button
      onClick={() => {
        setMealName(""); // เคลียร์ชื่อเมนูเก่าเมื่อกดเริ่มใหม่
        setView("select");
      }}
      className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white font-medium py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
    >
      <Plus size={20} />
      บันทึกมื้ออาหาร
    </button>
    {history.length > 0 && (
      <p className="mt-4 text-xs text-gray-400">
        บันทึกไปแล้ว {history.length} มื้อ
      </p>
    )}
  </div>
);

const SelectionScreen = ({
  setView,
  mealName,
  setMealName,
  selectedIds,
  toggleVeggie,
}: any) => (
  <div className="h-full flex flex-col">
    <div className="px-6 py-6 pb-2">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setView("home")}
          className="p-2 -ml-2 text-gray-400 hover:text-gray-600"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-gray-700">เลือกผักในมื้อนี้</span>
        <div className="w-8"></div>
      </div>
      <p className="text-2xl font-bold text-gray-800">คุณทานอะไรไปบ้าง?</p>
      {/* เพิ่มช่องกรอกชื่อเมนู */}
      <div className="mt-3 mb-2">
        <input
          type="text"
          placeholder="ชื่อเมนู (เช่น ผัดกะเพรา)"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-lg"
        />
      </div>
      <p className="text-sm text-gray-500 mt-1">
        เลือกรายการผักที่คุณรับประทาน
      </p>
    </div>
    <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide">
      <div className="grid grid-cols-2 gap-3 mt-4">
        {VEGETABLE_DATA.map((veg) => {
          const isSelected = selectedIds.includes(veg.id);
          return (
            <button
              key={veg.id}
              onClick={() => toggleVeggie(veg.id)}
              className={`
                    relative p-4 rounded-2xl text-left transition-all duration-200 border-2
                    flex flex-col items-center justify-center gap-2 aspect-square
                    ${
                      isSelected
                        ? "border-green-500 bg-green-50 shadow-md transform scale-[1.02]"
                        : "border-gray-100 bg-white hover:border-green-200 hover:bg-gray-50"
                    }
                `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-0.5">
                  <Check size={12} />
                </div>
              )}
              <span className="text-4xl filter drop-shadow-sm">{veg.icon}</span>
              <span
                className={`text-sm font-medium ${isSelected ? "text-green-800" : "text-gray-600"}`}
              >
                {veg.name.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent">
      <button
        onClick={() => {
          if (selectedIds.length > 0) setView("result");
        }}
        disabled={selectedIds.length === 0}
        className={`
                w-full py-4 rounded-2xl font-semibold shadow-lg transition-all
                ${
                  selectedIds.length > 0
                    ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-green-200"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
            `}
      >
        วิเคราะห์ ({selectedIds.length})
      </button>
    </div>
  </div>
);

const ResultScreen = ({ setView, analysis, saveLog, loading }: any) => (
  <div className="h-full flex flex-col bg-slate-50">
    <div className="bg-white px-6 py-6 pb-8 rounded-b-3xl shadow-sm z-10">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setView("select")}
          className="p-2 -ml-2 text-gray-400 hover:text-gray-600"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-gray-700">สรุปข้อมูลโภชนาการ</span>
        <div className="w-8"></div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
          <Activity size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">ยอดเยี่ยมมาก!</h2>
          <p className="text-gray-500 text-sm">มื้อนี้คุณได้รับประโยชน์เพียบ</p>
        </div>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Sun size={18} className="text-orange-500" />{" "}
          วิตามินและแร่ธาตุที่ได้รับ
        </h3>
        <div className="flex flex-wrap gap-2">
          {analysis.vitamins.map((v: string, idx: number) => (
            <span
              key={idx}
              className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-medium border border-orange-100"
            >
              {v}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Heart size={18} className="text-rose-500" /> ดีต่อสุขภาพอย่างไร
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          การทานผักในมื้อนี้ช่วย
          <span className="font-medium text-gray-800">ลดความเสี่ยง</span>ของ
          {analysis.diseases.map((d: string, i: number) => (
            <span key={i} className="text-rose-600">
              {" "}
              {d}
              {i < analysis.diseases.length - 1 ? ", " : ""}
            </span>
          ))}
          และยังช่วยเสริมสร้างภูมิคุ้มกันร่างกายให้แข็งแรง
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-3 ml-1">
          รายละเอียดผักแต่ละชนิด
        </h3>
        <div className="space-y-3">
          {analysis.veggies.map((veg: any) => (
            <div
              key={veg.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4"
            >
              <div className="text-3xl bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                {veg.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">{veg.name}</h4>
                <p className="text-xs text-green-600 mt-1 font-medium">
                  {veg.benefits}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  มี: {veg.vitamins.join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="p-6 bg-white border-t border-gray-100">
      <button
        onClick={saveLog}
        disabled={loading}
        className="w-full bg-gray-800 text-white py-4 rounded-2xl font-medium shadow-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400"
      >
        {loading ? "กำลังบันทึก..." : "บันทึกเสร็จสิ้น"}
      </button>
    </div>
  </div>
);

const HistoryScreen = ({ setView, insightData, history }: any) => (
  <div className="h-full flex flex-col bg-slate-50">
    {/* Header */}
    <div className="bg-white px-6 py-6 pb-4 shadow-sm z-10">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setView("home")}
          className="p-2 -ml-2 text-gray-400 hover:text-gray-600"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-gray-700">ประวัติการกิน</span>
        <div className="w-8"></div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800">10 มื้อล่าสุดของคุณ</h2>
    </div>
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
      {/* Special Insight (Every 3 meals logic) */}
      {insightData && history.length >= 3 && (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-white/20 rounded-full">
              <TrendingUp size={20} className="text-white" />
            </div>
            <h3 className="font-bold text-lg">สรุป 3 มื้อล่าสุด</h3>
          </div>
          <div className="bg-white/10 rounded-xl p-3 mb-3 backdrop-blur-sm">
            <p className="text-indigo-100 text-xs mb-1">
              สิ่งที่คุณได้รับเต็มที่
            </p>
            <p className="text-sm font-medium">
              {insightData.received.slice(0, 5).join(", ")}
              {insightData.received.length > 5 ? "และอื่นๆ" : ""}
            </p>
          </div>
          {insightData.missing.length > 0 ? (
            <div>
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle size={16} className="text-yellow-300 mt-0.5" />
                <p className="text-sm">
                  คุณอาจขาด{" "}
                  <span className="font-bold text-yellow-300">
                    {insightData.missing.slice(0, 3).join(", ")}
                  </span>{" "}
                  ไปบ้าง
                </p>
              </div>
              {insightData.suggestions.length > 0 && (
                <div className="text-xs bg-white/10 rounded-lg p-3">
                  <p className="mb-2 text-indigo-100">ครั้งหน้าลองเติม:</p>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {insightData.suggestions.map((s: any) => (
                      <div
                        key={s.id}
                        className="flex flex-col items-center bg-white text-gray-800 p-2 rounded-lg min-w-[60px]"
                      >
                        <span className="text-xl">{s.icon}</span>
                        <span className="text-[10px] truncate w-full text-center mt-1">
                          {s.name.split(" ")[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-300 bg-white/10 p-3 rounded-lg">
              <Check size={18} />
              <p className="text-sm">
                สุดยอด! คุณทานผักหลากหลายครบถ้วนใน 3 มื้อนี้
              </p>
            </div>
          )}
        </div>
      )}
      {/* List of Meals */}
      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <p>ยังไม่มีข้อมูลบันทึก</p>
            <button
              onClick={() => setView("select")}
              className="text-green-600 text-sm mt-2 underline"
            >
              เริ่มบันทึกมื้อแรก
            </button>
          </div>
        ) : (
          history.map((log: any) => (
            <div
              key={log.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-xl">
                  {/* Show first veggie icon or default */}
                  {log.veggies && log.veggies.length > 0
                    ? log.veggies[0].icon
                    : "🍽️"}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">
                    {log.mealName}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {log.date} • {log.veggies.length} อย่าง
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

export default function DailyVeggieLog() {
  const [view, setView] = useState("home"); // home, select, result, history
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [history, setHistory] = useState<any[]>([]); // เก็บข้อมูลย้อนหลัง
  const [showModal, setShowModal] = useState(false); // ควบคุมการแสดง Popup
  const [mealName, setMealName] = useState(""); // เพิ่ม state เก็บชื่อเมนู
  const [loading, setLoading] = useState(false);

  // Initial Load
  useEffect(() => {
    fetch("/api/logs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setHistory(data);
      })
      .catch((err) => console.error("Error fetching logs:", err));
  }, []);

  // ฟังก์ชันเลือก/ยกเลิกเลือกผัก
  const toggleVeggie = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // คำนวณผลลัพธ์มื้อปัจจุบัน
  const analysis = useMemo(() => {
    const selectedVeggies = VEGETABLE_DATA.filter((v) =>
      selectedIds.includes(v.id),
    );
    const allVitamins = Array.from(
      new Set(selectedVeggies.flatMap((v) => v.vitamins)),
    );
    const allDiseases = Array.from(
      new Set(
        selectedVeggies.flatMap((v) =>
          v.prevention.split(", ").map((s) => s.trim()),
        ),
      ),
    );

    return {
      veggies: selectedVeggies,
      vitamins: allVitamins,
      diseases: allDiseases,
      count: selectedVeggies.length,
    };
  }, [selectedIds]);

  // บันทึกข้อมูลลง History
  const saveLog = async () => {
    setLoading(true);
    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      mealName: mealName.trim() || "มื้ออาหารทั่วไป",
      veggies: analysis.veggies,
      vitamins: analysis.vitamins,
    };

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLog),
      });
      const data = await res.json();

      if (data.success) {
        setHistory((prev) => {
          const updated = [data.log, ...prev];
          return updated.slice(0, 10);
        });

        // ถ้าบันทึกครบ 3, 6, 9... ให้แสดง Modal ถาม
        const currentLen = history.length + 1;
        if (currentLen % 3 === 0) {
          setShowModal(true);
        } else {
          setView("home");
        }
      }
    } catch (error) {
      console.error("Failed to save log", error);
    } finally {
      setLoading(false);
      setSelectedIds([]);
      setMealName("");
    }
  };

  // วิเคราะห์ 3 มื้อล่าสุด (Special Insight)
  const getInsight = () => {
    if (history.length < 3) return null;
    const lastThreeMeals = history.slice(0, 3);
    const allVitsReceived = Array.from(
      new Set(lastThreeMeals.flatMap((h) => h.vitamins)),
    );

    // หาว่าขาดอะไรไปบ้าง
    const missing = ESSENTIAL_NUTRIENTS.filter(
      (n) => !allVitsReceived.includes(n),
    );

    // แนะนำผักที่มีสารอาหารที่ขาด
    const suggestions =
      missing.length > 0
        ? VEGETABLE_DATA.filter((v) =>
            v.vitamins.some((vit) => missing.includes(vit)),
          ).slice(0, 3)
        : [];

    return {
      received: allVitsReceived,
      missing,
      suggestions,
    };
  };

  const insightData = useMemo(() => getInsight(), [history]);

  return (
    <div className="h-screen bg-slate-50 font-sans mx-auto max-w-md w-full shadow-2xl overflow-hidden relative">
      <InsightModal
        showModal={showModal}
        setShowModal={setShowModal}
        setView={setView}
      />

      {view === "home" && (
        <HomeScreen
          setView={setView}
          history={history}
          setMealName={setMealName}
        />
      )}

      {view === "select" && (
        <SelectionScreen
          setView={setView}
          mealName={mealName}
          setMealName={setMealName}
          selectedIds={selectedIds}
          toggleVeggie={toggleVeggie}
        />
      )}

      {view === "result" && (
        <ResultScreen
          setView={setView}
          analysis={analysis}
          saveLog={saveLog}
          loading={loading}
        />
      )}

      {view === "history" && (
        <HistoryScreen
          setView={setView}
          insightData={insightData}
          history={history}
        />
      )}
    </div>
  );
}
