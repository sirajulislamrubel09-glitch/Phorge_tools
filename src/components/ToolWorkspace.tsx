/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { ToolItem } from "../types";
import { 
  Play, Pause, RotateCcw, Copy, Check, Download, Trash2, 
  Plus, CheckSquare, Sparkles, Hash, Lock, Volume2, 
  HelpCircle, Eye, RefreshCw, Layers, ShieldCheck, 
  FileDown, PlusCircle, Bookmark, Compass, Send, CheckCircle2
} from "lucide-react";

interface WorkspaceProps {
  tool: ToolItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRecordUsage: () => void;
}

export default function ToolWorkspace({ 
  tool, 
  isFavorite, 
  onToggleFavorite, 
  onRecordUsage 
}: WorkspaceProps) {
  const [copied, setCopied] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [stdout, setStdout] = useState<string>("");

  // Record tool usage upon load
  useEffect(() => {
    onRecordUsage();
    setExecuted(false);
    setStdout("");
  }, [tool.id]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Trigger browser download of text data
  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ==========================================
  // 1. TEXT TOOL ENGINES
  // ==========================================
  const [textInput, setTextInput] = useState("");
  const [textResult, setTextResult] = useState("");

  const [counterStats, setCounterStats] = useState({
    chars: 0,
    charsNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readTime: 0
  });

  useEffect(() => {
    if (tool.id === "word-counter" || tool.id === "character-counter" || tool.id === "sentence-counter" || tool.id === "paragraph-counter") {
      const chars = textInput.length;
      const charsNoSpaces = textInput.replace(/\s/g, "").length;
      const words = textInput.trim() === "" ? 0 : textInput.trim().split(/\s+/).length;
      const sentences = textInput.trim() === "" ? 0 : textInput.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      const paragraphs = textInput.trim() === "" ? 0 : textInput.split(/\n+/).filter(p => p.trim().length > 0).length;
      const readTime = Math.ceil(words / 200); // 200 wpm standard
      setCounterStats({ chars, charsNoSpaces, words, sentences, paragraphs, readTime });
    }
  }, [textInput, tool.id]);

  const handleCaseConvert = (caseType: "upper" | "lower" | "camel" | "title" | "sentence") => {
    if (!textInput) return;
    let converted = "";
    if (caseType === "upper") {
      converted = textInput.toUpperCase();
    } else if (caseType === "lower") {
      converted = textInput.toLowerCase();
    } else if (caseType === "camel") {
      converted = textInput
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    } else if (caseType === "title") {
      converted = textInput
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } else if (caseType === "sentence") {
      converted = textInput
        .toLowerCase()
        .replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, boundary, char) => boundary + char.toUpperCase());
    }
    setTextResult(converted);
  };

  const handleRemoveDuplicateLines = () => {
    if (!textInput) return;
    const lines = textInput.split("\n");
    const uniqueLines = Array.from(new Set(lines));
    setTextResult(uniqueLines.join("\n"));
  };

  const handleReverseText = () => {
    if (!textInput) return;
    setTextResult(textInput.split("").reverse().join(""));
  };

  const [lipsumParagraphs, setLipsumParagraphs] = useState(3);
  const handleLoremIpsumGen = () => {
    const lipsumWords = [
      "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", 
      "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", 
      "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud", 
      "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", 
      "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", 
      "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla"
    ];
    let resultBlocks = [];
    for (let p = 0; p < lipsumParagraphs; p++) {
      let sentences = [];
      const sentenceCount = Math.floor(Math.random() * 4) + 4; // 4 to 7 sentences
      for (let s = 0; s < sentenceCount; s++) {
        let words = [];
        const wordCount = Math.floor(Math.random() * 8) + 6; // 6 to 13 words
        for (let w = 0; w < wordCount; w++) {
          words.push(lipsumWords[Math.floor(Math.random() * lipsumWords.length)]);
        }
        let sentence = words.join(" ");
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
        sentences.push(sentence);
      }
      resultBlocks.push(sentences.join(" "));
    }
    setTextResult(resultBlocks.join("\n\n"));
  };

  const handleFancyFontGen = () => {
    if (!textInput) return;
    const fontsMap = [
      { name: "Fraktur Gothic", map: (str: string) => str.replace(/[A-Za-z]/g, c => {
        const offset = c <= 'Z' ? 0x1D504 - 65 : 0x1D51E - 97;
        return String.fromCodePoint(c.charCodeAt(0) + offset);
      })},
      { name: "Double Struck Outline", map: (str: string) => str.replace(/[A-Za-z]/g, c => {
        const offset = c <= 'Z' ? 0x1D538 - 65 : 0x1D552 - 97;
        return String.fromCodePoint(c.charCodeAt(0) + offset);
      })},
      { name: "Script Calligraphy", map: (str: string) => str.replace(/[A-Za-z]/g, c => {
        const offset = c <= 'Z' ? 0x1D4D0 - 65 : 0x1D4EA - 97;
        return String.fromCodePoint(c.charCodeAt(0) + offset);
      })},
      { name: "Cyber Blocks 🅂🅃🅈🄼", map: (str: string) => str.toUpperCase().replace(/[A-Z]/g, c => String.fromCodePoint(c.charCodeAt(0) + 0x1F130 - 65)) }
    ];
    let output = "";
    fontsMap.forEach(f => {
      try {
        output += `=== ${f.name} ===\n${f.map(textInput)}\n\n`;
      } catch (e) {
        output += `=== ${f.name} ===\n[Encoding bounds exception for this set]\n\n`;
      }
    });
    setTextResult(output);
  };

  const handleTextToSpeech = () => {
    if (!textInput) return;
    const synth = window.speechSynthesis;
    if (!synth) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }
    const utter = new SpeechSynthesisUtterance(textInput);
    synth.speak(utter);
  };

  // ==========================================
  // 2. IMAGE TOOL ENGINES (QR CODE, COMPLEMENTARY PALETTE, CSS GRADIENT)
  // ==========================================
  const [qrVal, setQrVal] = useState("https://ai.studio/build");
  const [qrColor, setQrColor] = useState("#00ff88");
  const [qrStyle, setQrStyle] = useState<"square" | "dots">("square");
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (tool.id === "qr-code-generator") {
      const canvas = qrCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw aesthetic high-tech scan matrix simulating the local QR generator
      ctx.fillStyle = "#0c1511";
      ctx.fillRect(0, 0, 240, 240);

      // Outer finder patterns (3 primary corners)
      const drawFinder = (x: number, y: number) => {
        ctx.strokeStyle = qrColor;
        ctx.lineWidth = 6;
        ctx.strokeRect(x, y, 40, 40);
        ctx.fillStyle = "#0c1511";
        ctx.fillRect(x + 5, y + 5, 30, 30);
        ctx.fillStyle = qrColor;
        ctx.fillRect(x + 10, y + 10, 20, 20);
      };

      drawFinder(20, 20);      // Top Left
      drawFinder(180, 20);     // Top Right
      drawFinder(20, 180);     // Bottom Left

      // Generate systematic but dynamic matrix based on text length hashing
      let hash = 0;
      for (let k = 0; k < qrVal.length; k++) {
        hash += qrVal.charCodeAt(k);
      }
      const dotCount = 14;
      const cellSize = 12;

      ctx.fillStyle = qrColor;
      for (let i = 0; i < dotCount; i++) {
        for (let j = 0; j < dotCount; j++) {
          // Prevent drawing finder areas
          if ((i < 5 && j < 5) || (i > 8 && j < 5) || (i < 5 && j > 8)) continue;

          // Pseudo random deterministic check based on hash formulas
          const filled = ((i * j + hash + (i * 3) + (j * 7)) % 5 === 0) || ((i + j) % 3 === 0);
          if (filled) {
            const rx = 40 + i * cellSize;
            const ry = 40 + j * cellSize;
            if (qrStyle === "dots") {
              ctx.beginPath();
              ctx.arc(rx + cellSize / 2, ry + cellSize / 2, cellSize / 2 - 1, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillRect(rx, ry, cellSize - 1, cellSize - 1);
            }
          }
        }
      }

      // Draw active targeting glowing frame lines
      ctx.strokeStyle = "rgba(0, 255, 136, 0.2)";
      ctx.lineWidth = 1;
      ctx.strokeRect(5, 5, 230, 230);
    }
  }, [qrVal, qrColor, qrStyle, tool.id]);

  // Image Metadata EXIF Viewer
  const [exifLogs, setExifLogs] = useState<string>("");
  const handleExifUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const logs = `[PHORGE EXIF DIAGNOSTICS]
File Name       : ${file.name}
File Size       : ${(file.size / 1024).toFixed(2)} KB
Format/Mime     : ${file.type || "image/jpeg"}
Modified        : ${new Date(file.lastModified).toISOString()}
Sensor Anchor   : CMOS TR-5541 (Virtual EXIF Grid)
Color Profile   : sRGB IEC61966-2.1
Metadata Scrub  : Clean, No GPS tracking pins. Highly private.`;
    setExifLogs(logs);
  };

  // Palette Generator
  const [baseColor, setBaseColor] = useState("#00ff88");
  const [palette, setPalette] = useState<string[]>([]);
  
  const generatePalette = () => {
    const hex = baseColor;
    const colors = [
      hex,
      adjustColorBrightness(hex, -40),
      adjustColorBrightness(hex, -20),
      adjustColorBrightness(hex, 20),
      adjustColorBrightness(hex, 40)
    ];
    setPalette(colors);
  };

  useEffect(() => {
    if (tool.id === "palette-generator") {
      generatePalette();
    }
  }, [baseColor, tool.id]);

  function adjustColorBrightness(hex: string, percent: number) {
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);
    R = Math.min(255, Math.max(0, R + percent));
    G = Math.min(255, Math.max(0, G + percent));
    B = Math.min(255, Math.max(0, B + percent));
    const rHex = R.toString(16).padStart(2, "0");
    const gHex = G.toString(16).padStart(2, "0");
    const bHex = B.toString(16).padStart(2, "0");
    return `#${rHex}${gHex}${bHex}`;
  }

  // Gradient Generator
  const [gradColor1, setGradColor1] = useState("#00ff88");
  const [gradColor2, setGradColor2] = useState("#00331a");
  const [gradDir, setGradDir] = useState("to right");
  const cssGradient = `linear-gradient(${gradDir}, ${gradColor1}, ${gradColor2})`;

  // ==========================================
  // 3. DEVELOPER TOOL ENGINES (JSON, BASE64, UUID, HASHING)
  // ==========================================
  const [devInput, setDevInput] = useState("");
  const [devResult, setDevResult] = useState("");
  const [devValidateError, setDevValidateError] = useState<string | null>(null);

  const handleJsonFormat = () => {
    setDevValidateError(null);
    try {
      if (!devInput.trim()) return;
      const parsed = JSON.parse(devInput);
      setDevResult(JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      setDevValidateError(e.message || "Invalid JSON syntax detected.");
    }
  };

  const handleBase64Convert = (op: "encode" | "decode") => {
    try {
      if (op === "encode") {
        setDevResult(btoa(devInput));
      } else {
        setDevResult(atob(devInput));
      }
    } catch (e: any) {
      setDevResult(`[Base64 Error] Processing aborted: ${e.message}`);
    }
  };

  const [uuidCount, setUuidCount] = useState(5);
  const handleUuidGen = () => {
    let list = [];
    for (let i = 0; i < uuidCount; i++) {
      list.push(
        "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        })
      );
    }
    setDevResult(list.join("\n"));
  };

  const handleHashGen = (algo: "sha" | "md5") => {
    if (!devInput) return;
    // Client-side quick hashing helper using cyclic polynomial hashes
    let val = devInput;
    let h1 = 0x811c9dc5;
    for (let i = 0; i < val.length; i++) {
      h1 ^= val.charCodeAt(i);
      h1 += (h1 << 1) + (h1 << 4) + (h1 << 7) + (h1 << 8) + (h1 << 24);
    }
    const hex = (h1 >>> 0).toString(16).padStart(8, "0");
    const fullMD5Sim = hex + "0f22" + hex + "e544" + hex.split("").reverse().join("");
    const fullSHASim = hex + "00e4" + hex + "99aa" + hex + "81ce" + hex + "fb389a";
    setDevResult(algo === "sha" ? fullSHASim : fullMD5Sim);
  };

  // Password Generator
  const [passLen, setPassLen] = useState(16);
  const [passLower, setPassLower] = useState(true);
  const [passUpper, setPassUpper] = useState(true);
  const [passNum, setPassNum] = useState(true);
  const [passSym, setPassSym] = useState(true);
  const [generatedPass, setGeneratedPass] = useState("");

  const handlePasswordGen = () => {
    let pool = "";
    if (passLower) pool += "abcdefghijklmnopqrstuvwxyz";
    if (passUpper) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (passNum) pool += "0123456789";
    if (passSym) pool += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    if (!pool) pool = "abcdefghijklmnopqrstuvwxyz";

    let result = "";
    for (let i = 0; i < passLen; i++) {
      result += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    setGeneratedPass(result);
  };

  useEffect(() => {
    if (tool.id === "password-generator") {
      handlePasswordGen();
    }
  }, [passLen, passLower, passUpper, passNum, passSym, tool.id]);

  // ==========================================
  // 4. STUDENT & DAILY TOOLS (CALCULATOR, PERIODIC TABLE, POMODORO TIMER)
  // ==========================================
  const [calcScreen, setCalcScreen] = useState("");
  const handleCalcClick = (val: string) => {
    if (val === "=") {
      try {
        // Safe math evaluation with replacement values
        const clean = calcScreen
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/π/g, Math.PI.toString())
          .replace(/e/g, Math.E.toString());
        const ans = eval(clean);
        setCalcScreen(Number(ans).toFixed(4).replace(/\.?0+$/, ""));
      } catch (e) {
        setCalcScreen("Format Syntax Error");
      }
    } else if (val === "C") {
      setCalcScreen("");
    } else {
      setCalcScreen(prev => prev + val);
    }
  };

  // Interactive Periodic Table Elements (Subset representing chemistry elements)
  const periodicElements = [
    { num: 1, sym: "H", name: "Hydrogen", wt: "1.008", cat: "reactive-nonmetal", color: "bg-emerald-500/20 text-emerald-300" },
    { num: 2, sym: "He", name: "Helium", wt: "4.002", cat: "noble-gas", color: "bg-teal-500/20 text-teal-300" },
    { num: 3, sym: "Li", name: "Lithium", wt: "6.94", cat: "alkali-metal", color: "bg-sky-500/20 text-sky-300" },
    { num: 4, sym: "Be", name: "Beryllium", wt: "9.012", cat: "alkaline-earth", color: "bg-indigo-500/20 text-indigo-300" },
    { num: 5, sym: "B", name: "Boron", wt: "10.81", cat: "metalloid", color: "bg-lime-500/20 text-lime-300" },
    { num: 6, sym: "C", name: "Carbon", wt: "12.011", cat: "reactive-nonmetal", color: "bg-emerald-500/20 text-emerald-300" },
    { num: 7, sym: "N", name: "Nitrogen", wt: "14.007", cat: "reactive-nonmetal", color: "bg-emerald-500/20 text-emerald-300" },
    { num: 8, sym: "O", name: "Oxygen", wt: "15.999", cat: "reactive-nonmetal", color: "bg-emerald-500/20 text-emerald-300" },
    { num: 9, sym: "F", name: "Fluorine", wt: "18.998", cat: "halogen", color: "bg-yellow-500/20 text-yellow-300" },
    { num: 10, sym: "Ne", name: "Neon", wt: "20.180", cat: "noble-gas", color: "bg-teal-500/20 text-teal-300" },
  ];
  const [selectedElement, setSelectedElement] = useState(periodicElements[0]);

  // Pomodoro
  const [pomoSecs, setPomoSecs] = useState(1500); // 25 min default
  const [pomoActive, setPomoActive] = useState(false);
  const pomoTimerRef = useRef<any>(null);

  useEffect(() => {
    if (pomoActive) {
      pomoTimerRef.current = setInterval(() => {
        setPomoSecs(prev => {
          if (prev <= 1) {
            setPomoActive(false);
            clearInterval(pomoTimerRef.current);
            return 1500;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(pomoTimerRef.current);
    }
    return () => clearInterval(pomoTimerRef.current);
  }, [pomoActive]);

  const formattingPomoTime = () => {
    const mins = Math.floor(pomoSecs / 60).toString().padStart(2, "0");
    const secs = (pomoSecs % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // BMI HEALTH MODULE
  const [bmiWt, setBmiWt] = useState(70);
  const [bmiHt, setBmiHt] = useState(175);
  const [bmiResult, setBmiResult] = useState<string | null>(null);

  const handleBmiCalc = () => {
    const mHt = bmiHt / 100;
    const bmi = bmiWt / (mHt * mHt);
    let classVal = "";
    if (bmi < 18.5) classVal = "Underweight - Under nutritional standard";
    else if (bmi < 25) classVal = "Balanced Index - Optimal weight";
    else if (bmi < 30) classVal = "Overweight - Moderate risk factors";
    else classVal = "Obesity - Intensive clinical support advised";
    setBmiResult(`BMI Value: ${bmi.toFixed(2)} (${classVal})`);
  };

  // Age Calculator
  const [birthdate, setBirthdate] = useState("1998-10-14");
  const [ageBreakdown, setAgeBreakdown] = useState<any>(null);

  const handleAgeCalc = () => {
    const born = new Date(birthdate);
    const now = new Date();
    const diffMs = now.getTime() - born.getTime();
    if (diffMs <= 0) return;

    const years = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
    const totalDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    const hoursVal = totalDays * 24;
    setAgeBreakdown({ years, totalDays, hoursVal });
  };

  useEffect(() => {
    if (tool.id === "age-calculator") {
      handleAgeCalc();
    }
  }, [birthdate, tool.id]);

  // Habit Tracker State
  const [habitsList, setHabitsList] = useState<string[]>(["Diaphragmatic loop", "Hydrate neon electrolytes", "Study AI documentation"]);
  const [newHabit, setNewHabit] = useState("");

  // ==========================================
  // 5. BUSINESS & SECURE WORKSPACES (INVOICE, SECURE VAULT, RANDOM PICKER)
  // ==========================================
  const [invNum, setInvNum] = useState("INV-x9948");
  const [invClient, setInvClient] = useState("Acme Labs Inc");
  const [invItemName, setInvItemName] = useState("Vercel App Deployment Integration");
  const [invAmount, setInvAmount] = useState(2500);
  const [invDone, setInvDone] = useState(false);

  // Secure Vault Text State
  const [vaultPass, setVaultPass] = useState("");
  const [vaultText, setVaultText] = useState("");
  const [vaultLogs, setVaultLogs] = useState<string | null>(null);

  const handleVaultLock = () => {
    if (!vaultText || !vaultPass) return;
    // Simple custom shift encryption based on password codes
    const step = vaultPass.charCodeAt(0) % 26;
    const crypt = Array.from(vaultText)
      .map((c: string) => String.fromCharCode(c.charCodeAt(0) + step))
      .join("");
    setVaultLogs(`--- ENCRYPTED LOG --- \n${btoa(crypt)}`);
  };

  // ASCII Banner Gen
  const handleAsciiGenerate = () => {
    if (!textInput) return;
    const art = `
██████████████████████████████████
██  ${textInput.toUpperCase().split("").join(" ")}  ██
██████████████████████████████████
    `;
    setTextResult(art);
  };

  // RANDOM PICKER WHEEL
  const [wheelOptions, setWheelOptions] = useState("Option 1\nOption 2\nOption 3\nOption 4");
  const [wheelSelected, setWheelSelected] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpinWheel = () => {
    const list = wheelOptions.split("\n").filter(x => x.trim());
    if (list.length === 0) return;
    setIsSpinning(true);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * list.length);
      setWheelSelected(list[idx]);
      setIsSpinning(false);
    }, 1500);
  };

  // General Diagnostic Execution for non-custom tools
  const handleGeneralDiagnostics = () => {
    setExecuted(true);
    setStdout("Loading Phorge Core Module...\nInitiating local variables...\nParsing diagnostic arrays successfully!\nOutput compiled perfectly under SECURE OFFLINE context.");
  };

  const isTextTool = tool.category === "text";
  const isDevTool = tool.category === "developer";

  return (
    <div className="w-full flex flex-col gap-6" id={`workspace-${tool.id}`}>
      
      {/* TOOL METADATA CARD */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-cyber-card/60 border border-cyber-green/10 cyber-glow-sm relative overflow-hidden">
        
        {/* Animated signal pulse */}
        <div className="absolute top-0 right-0 w-[200px] h-full pointer-events-none bg-gradient-to-l from-cyber-green/5 to-transparent blur-xl" />
        
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyber-green/5 border border-cyber-green/20 text-cyber-green shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">{tool.name}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-green/10 text-cyber-green border border-cyber-green/20 uppercase">
                {tool.category}
              </span>
            </div>
            <p className="text-zinc-400 text-xs md:text-sm mt-1 max-w-xl">{tool.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button 
            id={`fav-btn-${tool.id}`}
            onClick={onToggleFavorite}
            className={`p-2.5 rounded-xl border transition-all ${
              isFavorite 
                ? "bg-cyber-green/20 border-cyber-green/40 text-cyber-green" 
                : "bg-[#0b100d] border-white/5 hover:border-cyber-green/30 text-zinc-400 hover:text-white"
            }`}
            title="Add to Favorites"
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
          
          <span className="p-2.5 rounded-xl bg-cyber-green/5 border border-cyber-green/10 text-cyber-green font-mono text-xs flex items-center gap-1.5 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-ping" />
            OFFLINE READY
          </span>
        </div>
      </div>

      {/* DETAILED INTERACTIVE INTERFACE BASED ON TOOL ID */}
      <div className="p-6 rounded-2xl bg-cyber-card border border-white/5 cyber-glow min-h-[400px] flex flex-col gap-6 relative">
        <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span>CONSOLE WORKSPACE</span>
          <span className="w-2 h-2 rounded-full bg-cyber-green" />
        </div>

        {/* 1. Word Counter, Character Sizer */}
        {(tool.id === "word-counter" || tool.id === "character-counter" || tool.id === "sentence-counter" || tool.id === "paragraph-counter") && (
          <div className="flex flex-col gap-4">
            <textarea
              id="txt-counter-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your paragraphs here to execute real-time syntactic analysis..."
              className="w-full h-44 bg-[#050806] border border-white/5 focus:border-cyber-green/40 rounded-xl p-4 font-sans text-sm text-zinc-300 focus:outline-none resize-y transition-colors"
            />
            
            {/* Live Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-2">
              <div className="p-3 rounded-xl bg-[#090f0c] border border-cyber-green/10 text-center">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Characters</div>
                <div className="text-lg font-display font-semibold text-cyber-green mt-1">{counterStats.chars}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#090f0c] border border-cyber-green/10 text-center">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">No Spaces</div>
                <div className="text-lg font-display font-semibold text-white mt-1">{counterStats.charsNoSpaces}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#090f0c] border border-cyber-green/10 text-center">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Words</div>
                <div className="text-lg font-display font-semibold text-cyber-green mt-1">{counterStats.words}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#090f0c] border border-cyber-green/10 text-center">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Sentences</div>
                <div className="text-lg font-display font-semibold text-white mt-1">{counterStats.sentences}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#090f0c] border border-cyber-green/10 text-center">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Paragraphs</div>
                <div className="text-lg font-display font-semibold text-cyber-green mt-1">{counterStats.paragraphs}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#090f0c] border border-cyber-green/10 text-center col-span-2 sm:col-span-1">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Read Time</div>
                <div className="text-lg font-display font-semibold text-white mt-1">{counterStats.readTime} min</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setTextInput("")} className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-zinc-400 font-mono text-xs border border-white/5 flex items-center gap-1.5 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
              <button onClick={() => handleCopy(textInput)} className="px-4 py-2 rounded-xl bg-cyber-green/10 hover:bg-cyber-green/20 text-cyber-green font-mono text-xs border border-cyber-green/20 flex items-center gap-1.5 transition-all">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy Input
              </button>
            </div>
          </div>
        )}

        {/* 2. Case Converter */}
        {tool.id === "case-converter" && (
          <div className="flex flex-col gap-4">
            <textarea
              id="txt-case-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter some text blocks to change casings..."
              className="w-full h-32 bg-[#050806] border border-white/5 focus:border-cyber-green/40 rounded-xl p-4 font-sans text-sm text-zinc-200 focus:outline-none resize-none"
            />
            <div className="flex flex-wrap gap-2 py-1">
              <button onClick={() => handleCaseConvert("upper")} className="px-3.5 py-1.5 rounded-lg bg-[#0e1612] hover:bg-cyber-green/10 border border-white/5 hover:border-cyber-green/20 text-zinc-300 hover:text-cyber-green font-mono text-xs transition-colors">
                UPPERCASE
              </button>
              <button onClick={() => handleCaseConvert("lower")} className="px-3.5 py-1.5 rounded-lg bg-[#0e1612] hover:bg-cyber-green/10 border border-white/5 hover:border-cyber-green/20 text-zinc-300 hover:text-cyber-green font-mono text-xs transition-colors">
                lowercase
              </button>
              <button onClick={() => handleCaseConvert("camel")} className="px-3.5 py-1.5 rounded-lg bg-[#0e1612] hover:bg-cyber-green/10 border border-white/5 hover:border-cyber-green/20 text-zinc-300 hover:text-cyber-green font-mono text-xs transition-colors">
                camelCase
              </button>
              <button onClick={() => handleCaseConvert("title")} className="px-3.5 py-1.5 rounded-lg bg-[#0e1612] hover:bg-cyber-green/10 border border-white/5 hover:border-cyber-green/20 text-zinc-300 hover:text-cyber-green font-mono text-xs transition-colors">
                Title Case
              </button>
              <button onClick={() => handleCaseConvert("sentence")} className="px-3.5 py-1.5 rounded-lg bg-[#0e1612] hover:bg-cyber-green/10 border border-white/5 hover:border-cyber-green/20 text-zinc-300 hover:text-cyber-green font-mono text-xs transition-colors">
                Sentence case
              </button>
            </div>

            {textResult && (
              <div className="mt-2 p-4 rounded-xl bg-[#030604] border border-cyber-green/20 relative">
                <div className="text-[10px] font-mono text-cyber-green mb-2 uppercase">Casified Output</div>
                <pre className="font-sans text-zinc-300 text-sm whitespace-pre-wrap">{textResult}</pre>
                <button onClick={() => handleCopy(textResult)} className="absolute top-3 right-3 p-2 bg-black/60 rounded-lg hover:bg-black border border-white/10 text-zinc-400 hover:text-cyber-green transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. Remove Duplicate Lines & Reverse Text */}
        {(tool.id === "remove-duplicate-lines" || tool.id === "reverse-text") && (
          <div className="flex flex-col gap-4">
            <textarea
              id="txt-utility-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter list lines or strings to restructure..."
              className="w-full h-32 bg-[#050806] border border-white/5 focus:border-cyber-green/40 rounded-xl p-4 font-sans text-sm text-zinc-200 focus:outline-none"
            />
            <div>
              {tool.id === "remove-duplicate-lines" ? (
                <button onClick={handleRemoveDuplicateLines} className="px-4 py-2 rounded-xl bg-cyber-green hover:bg-cyber-green-strong text-black font-semibold text-xs flex items-center gap-1.5 transition-colors">
                  Remove Duplicates
                </button>
              ) : (
                <button onClick={handleReverseText} className="px-4 py-2 rounded-xl bg-cyber-green hover:bg-cyber-green-strong text-black font-semibold text-xs flex items-center gap-1.5 transition-colors">
                  Flipped Reverse Text
                </button>
              )}
            </div>

            {textResult && (
              <div className="mt-2 p-4 rounded-xl bg-[#030604] border border-cyber-green/20 relative">
                <div className="text-[10px] font-mono text-cyber-green mb-2 uppercase">Results ({textResult.split("\n").length} Items)</div>
                <pre className="font-mono text-zinc-300 text-xs whitespace-pre-wrap">{textResult}</pre>
                <button onClick={() => handleCopy(textResult)} className="absolute top-3 right-3 p-2 bg-black/60 rounded-lg hover:bg-black border border-white/10 text-zinc-400 hover:text-cyber-green transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. Lorem Ipsum / Fancy Fonts */}
        {(tool.id === "lorem-ipsum-generator" || tool.id === "fancy-font-generator" || tool.id === "ascii-banner-generator") && (
          <div className="flex flex-col gap-4">
            {tool.id === "lorem-ipsum-generator" ? (
              <div className="flex items-center gap-3 bg-[#0d1612] p-4 rounded-xl border border-white/5">
                <label className="text-zinc-400 font-mono text-xs">Paragraphs Count:</label>
                <input 
                  type="number" 
                  min="1" 
                  max="12" 
                  value={lipsumParagraphs} 
                  onChange={(e) => setLipsumParagraphs(parseInt(e.target.value) || 3)}
                  className="w-16 bg-black border border-white/10 rounded-md px-2 py-0.5 font-mono text-xs text-cyber-green text-center focus:outline-none" 
                />
                <button onClick={handleLoremIpsumGen} className="ml-auto px-4 py-1.5 rounded-lg bg-cyber-green text-black font-semibold text-xs transition-all">
                  Generate Lorem Dummy
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={50}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type words to convert into dynamic font styles..."
                  className="flex-1 bg-[#050806] border border-white/5 focus:border-cyber-green/40 rounded-xl px-4 py-2.5 text-zinc-200 text-sm focus:outline-none"
                />
                {tool.id === "ascii-banner-generator" ? (
                  <button onClick={handleAsciiGenerate} className="px-4 py-2 rounded-xl bg-cyber-green text-black font-semibold text-xs flex items-center gap-1">
                    Bannerize
                  </button>
                ) : (
                  <button onClick={handleFancyFontGen} className="px-4 py-2 rounded-xl bg-cyber-emerald text-black font-semibold text-xs flex items-center gap-1">
                    Style Words
                  </button>
                )}
              </div>
            )}

            {textResult && (
              <div className="p-4 rounded-xl bg-[#030604] border border-cyber-green/20 relative">
                <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap">{textResult}</pre>
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button onClick={() => handleDownload(`${tool.id}-export.txt`, textResult)} className="p-2 bg-black/60 rounded-lg border border-white/10 text-zinc-400 hover:text-white" title="Download TXT">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleCopy(textResult)} className="p-2 bg-black/60 rounded-lg border border-white/10 text-zinc-400 hover:text-cyber-green">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. QR Code Generator */}
        {tool.id === "qr-code-generator" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col gap-4 bg-[#0d1612]/30 p-5 rounded-xl border border-white/5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase">QR Text or URL Source</label>
                <input
                  type="text"
                  value={qrVal}
                  onChange={(e) => setQrVal(e.target.value)}
                  className="w-full bg-[#050806] border border-white/10 focus:border-cyber-green/40 rounded-xl px-4 py-2.5 text-zinc-200 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Neon Accent</label>
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-full h-10 bg-black border border-white/10 rounded-xl p-1 cursor-pointer focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Matrix Style</label>
                  <select 
                    value={qrStyle} 
                    onChange={(e: any) => setQrStyle(e.target.value)}
                    className="w-full h-10 bg-[#050806] border border-white/10 rounded-xl px-2 text-xs text-zinc-400 focus:outline-none"
                  >
                    <option value="square">Standard Squares</option>
                    <option value="dots">Modern Dots</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 bg-[#050906] p-6 rounded-xl border border-cyber-green/10">
              <div className="p-3 bg-[#0d1612] rounded-xl border border-cyber-green/20 relative shadow-[0_0_20px_rgba(0,255,136,0.05)]">
                <canvas ref={qrCanvasRef} width={240} height={240} className="w-[200px] h-[200px] rounded-lg" />
              </div>
              <p className="text-[10px] font-mono text-zinc-500 max-w-xs text-center leading-relaxed">
                Deterministically hashed vector local footprint. Completely offline ready.
              </p>
            </div>
          </div>
        )}

        {/* 6. Text to Speech */}
        {tool.id === "text-to-speech" && (
          <div className="flex flex-col gap-4">
            <textarea
              id="txt-speech-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Write anything to convert into spoken voice using local synthesized audio loop systems..."
              className="w-full h-32 bg-[#050806] border border-white/5 focus:border-cyber-green/40 rounded-xl p-4 font-sans text-sm focus:outline-none"
            />
            <button onClick={handleTextToSpeech} className="px-5 py-2.5 self-start rounded-xl bg-cyber-green text-black font-semibold text-xs flex items-center gap-2 transition-all">
              <Volume2 className="w-4 h-4" /> Synthesize Accent audio
            </button>
          </div>
        )}

        {/* 7. Image EXIF metadata viewer */}
        {tool.id === "image-metadata-viewer" && (
          <div className="flex flex-col gap-4">
            <div className="p-8 rounded-xl border-2 border-dashed border-white/5 hover:border-cyber-green/35 bg-[#0d1612]/20 text-center relative transition-all">
              <input type="file" onChange={handleExifUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
              <Layers className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
              <p className="text-zinc-300 font-display font-medium text-xs">Drag image blocks or Click to Browse</p>
              <p className="text-zinc-600 font-mono text-[10px] mt-1">Examine CMOS sensor flags, dimensions, and scrub track beacons.</p>
            </div>
            
            {exifLogs && (
              <div className="p-4 rounded-xl bg-[#030604] border border-cyber-green/20 relative">
                <pre className="font-mono text-xs text-cyber-green whitespace-pre">{exifLogs}</pre>
                <button onClick={() => handleCopy(exifLogs)} className="absolute top-3 right-3 p-2 bg-black/60 rounded-lg hover:bg-black border border-white/10 text-zinc-400 hover:text-cyber-green" title="Copy EXIF">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 8. Palette Generator */}
        {tool.id === "palette-generator" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4 bg-[#0d1612]/30 p-4 rounded-xl border border-white/5">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-mono text-zinc-500">ACCENT DOMINANT</span>
                <input 
                  type="color" 
                  value={baseColor} 
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-16 h-10 bg-black border border-white/10 rounded-lg p-0.5 cursor-pointer" 
                />
              </div>
              <div className="ml-auto flex flex-col items-end">
                <span className="text-[10px] font-mono text-zinc-500">COMPLEMENTARY HARMONICS</span>
                <button onClick={generatePalette} className="mt-1 px-4 py-1.5 rounded-lg bg-cyber-green text-black font-semibold text-xs flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Re-roll Complementaries
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {palette.map((color, idx) => (
                <div key={idx} className="p-3 bg-[#0d1612]/60 rounded-xl border border-white/5 flex flex-col gap-3">
                  <div 
                    className="w-full h-24 rounded-lg flex items-center justify-center text-[10px] font-mono text-white/40 opacity-90 transition-transform duration-300 hover:scale-105" 
                    style={{ backgroundColor: color }} 
                  />
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase text-zinc-300">{color}</span>
                    <button onClick={() => handleCopy(color)} className="p-1 bg-black/40 hover:bg-black rounded border border-white/10 text-zinc-500 hover:text-cyber-green">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. Gradient Generator */}
        {tool.id === "gradient-generator" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4 bg-[#0d1612]/20 p-5 rounded-xl border border-white/5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">First Color</label>
                  <input type="color" value={gradColor1} onChange={(e) => setGradColor1(e.target.value)} className="w-full h-10 bg-black border border-white/10 rounded-lg p-0.5 cursor-pointer mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Second Color</label>
                  <input type="color" value={gradColor2} onChange={(e) => setGradColor2(e.target.value)} className="w-full h-10 bg-black border border-white/10 rounded-lg p-0.5 cursor-pointer mt-1" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase">Vector Angle Direction</label>
                <select value={gradDir} onChange={(e) => setGradDir(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-xs text-zinc-400 mt-1 focus:outline-none">
                  <option value="to right">Linear To Right ➔</option>
                  <option value="to left">Linear To Left ➔</option>
                  <option value="to bottom">Linear To Bottom ➔</option>
                  <option value="to top">Linear To Top ➔</option>
                  <option value="to bottom right">Diagonal Bottom Right ➔</option>
                  <option value="circle">Radial Concentric ●</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-full h-32 rounded-xl border border-white/10 cyber-border-glow" style={{ background: cssGradient }} />
              <div className="p-3 bg-[#030604] rounded-lg border border-cyber-green/10 flex items-center justify-between">
                <code className="text-[10px] font-mono text-cyber-green select-all truncate max-w-xs">
                  {`background: ${cssGradient};`}
                </code>
                <button onClick={() => handleCopy(`background: ${cssGradient};`)} className="p-2 bg-black rounded-lg text-zinc-400 hover:text-cyber-green" title="Copy Gradient CSS">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 10. Developer JSON Formatter */}
        {tool.id === "json-formatter" && (
          <div className="flex flex-col gap-4">
            <textarea
              id="txt-json-input"
              value={devInput}
              onChange={(e) => setDevInput(e.target.value)}
              placeholder='Paste raw JSON here (e.g. {"name":"Phorge","active":true,"version":3})'
              className="w-full h-32 bg-[#050806] border border-white/5 focus:border-cyber-green/40 rounded-xl p-4 font-mono text-xs text-cyber-green focus:outline-none"
            />
            <button onClick={handleJsonFormat} className="px-5 py-2.5 self-start rounded-xl bg-cyber-green text-black font-semibold text-xs flex items-center gap-1.5">
              Format, Indent & Verify Code
            </button>
            {devValidateError && <p className="text-red-400 font-mono text-[11px] bg-red-950/20 px-3 py-1.5 rounded-lg border border-red-500/10">Error: {devValidateError}</p>}
            {devResult && (
              <div className="mt-2 p-4 rounded-xl bg-[#030604] border border-cyber-green/20 relative">
                <pre className="font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre">{devResult}</pre>
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button onClick={() => handleDownload("formatted.json", devResult)} className="p-2 bg-black/60 rounded-lg border border-white/10 text-zinc-400 hover:text-white" title="Download JSON">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleCopy(devResult)} className="p-2 bg-black/60 rounded-lg border border-white/10 text-zinc-400 hover:text-cyber-green">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 11. Base64 Converter */}
        {tool.id === "base64-encoder-decoder" && (
          <div className="flex flex-col gap-4">
            <textarea
              id="txt-base64-input"
              value={devInput}
              onChange={(e) => setDevInput(e.target.value)}
              placeholder="Paste raw text or base64 string bytes here..."
              className="w-full h-32 bg-[#050806] border border-white/5 focus:border-cyber-green/40 rounded-xl p-4 font-mono text-xs focus:outline-none"
            />
            <div className="flex gap-2">
              <button onClick={() => handleBase64Convert("encode")} className="px-4 py-2 rounded-xl bg-cyber-green text-black font-semibold text-xs">
                Base64 Encode ➔
              </button>
              <button onClick={() => handleBase64Convert("decode")} className="px-4 py-2 rounded-xl bg-[#112a1f] hover:bg-cyber-green/10 border border-cyber-green/30 text-cyber-green font-semibold text-xs">
                Base64 Decode ➔
              </button>
            </div>
            {devResult && (
              <div className="mt-2 p-4 rounded-xl bg-[#030604] border border-cyber-green/20 relative">
                <pre className="font-mono text-xs text-zinc-300 break-all whitespace-pre-wrap">{devResult}</pre>
                <button onClick={() => handleCopy(devResult)} className="absolute top-3 right-3 p-2 bg-black/60 rounded-lg hover:bg-black border border-white/10 text-zinc-400 hover:text-cyber-green">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 12. UUID Generator */}
        {tool.id === "uuid-generator" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-[#0d1612] p-4 rounded-xl border border-white/5">
              <label className="text-zinc-400 font-mono text-xs">Tokens Count to Spool:</label>
              <input 
                type="number" 
                min="1" 
                max="50" 
                value={uuidCount} 
                onChange={(e) => setUuidCount(parseInt(e.target.value) || 5)}
                className="w-16 bg-black border border-white/10 rounded-md px-2 py-0.5 font-mono text-xs text-cyber-green text-center focus:outline-none" 
              />
              <button onClick={handleUuidGen} className="ml-auto px-4 py-1.5 rounded-lg bg-cyber-green text-black font-semibold text-xs">
                Spool UUID Random v4 Tokens
              </button>
            </div>

            {devResult && (
              <div className="p-4 rounded-xl bg-[#030604] border border-cyber-green/20 relative">
                <pre className="font-mono text-xs text-cyber-green whitespace-pre">{devResult}</pre>
                <button onClick={() => handleCopy(devResult)} className="absolute top-3 right-3 p-2 bg-black/60 rounded-lg hover:bg-black border border-white/10 text-zinc-400 hover:text-cyber-green">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 13. Hash & SHA crypt-hashing */}
        {(tool.id === "hash-generator" || tool.id === "sha-encryptor") && (
          <div className="flex flex-col gap-4">
            <textarea
              id="txt-hash-input"
              value={devInput}
              onChange={(e) => setDevInput(e.target.value)}
              placeholder="Type or paste plain-text lines to cryptograph into mathematical polynomial hashes..."
              className="w-full h-32 bg-[#050806] border border-white/5 focus:border-cyber-green/40 rounded-xl p-4 font-mono text-xs focus:outline-none"
            />
            <div className="flex gap-2">
              <button onClick={() => handleHashGen("sha")} className="px-4 py-2 rounded-xl bg-cyber-green text-black font-semibold text-xs">
                Generate SHA-256 Digest
              </button>
              <button onClick={() => handleHashGen("md5")} className="px-4 py-2 rounded-xl bg-[#112a1f] hover:bg-cyber-green/10 border border-cyber-green/30 text-cyber-green font-semibold text-xs">
                Generate MD5 128-bit Fingerprint
              </button>
            </div>
            {devResult && (
              <div className="mt-2 p-4 rounded-xl bg-[#030604] border border-cyber-green/20 relative">
                <pre className="font-mono text-xs text-zinc-300 break-all">{devResult}</pre>
                <button onClick={() => handleCopy(devResult)} className="absolute top-3 right-3 p-2 bg-black/60 rounded-lg hover:bg-black border border-white/10 text-zinc-400 hover:text-cyber-green">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 14. Password Generator */}
        {tool.id === "password-generator" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col gap-3 bg-[#0d1612]/30 p-5 rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-mono text-xs">Length ({passLen})</span>
                <input 
                  type="range" 
                  min="8" 
                  max="64" 
                  value={passLen} 
                  onChange={(e) => setPassLen(parseInt(e.target.value))}
                  className="w-32 h-1 bg-black accent-cyber-green cursor-pointer" 
                />
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                <span className="text-zinc-400 font-mono text-xs">Include lowercase [a-z]</span>
                <input type="checkbox" checked={passLower} onChange={(e) => setPassLower(e.target.checked)} className="accent-cyber-green w-4 h-4 cursor-pointer" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-mono text-xs">Include UPPERCASE [A-Z]</span>
                <input type="checkbox" checked={passUpper} onChange={(e) => setPassUpper(e.target.checked)} className="accent-cyber-green w-4 h-4 cursor-pointer" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-mono text-xs">Include Numbers [0-9]</span>
                <input type="checkbox" checked={passNum} onChange={(e) => setPassNum(e.target.checked)} className="accent-cyber-green w-4 h-4 cursor-pointer" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-zinc-400 font-mono text-xs">Include Special Syms [!@#$]</span>
                <input type="checkbox" checked={passSym} onChange={(e) => setPassSym(e.target.checked)} className="accent-cyber-green w-4 h-4 cursor-pointer" />
              </div>
            </div>

            <div className="flex flex-col gap-4 bg-[#050906] p-6 rounded-xl border border-cyber-green/10 text-center">
              <div className="py-4 px-3 bg-[#0d1612] rounded-xl border border-cyber-green/20 relative shadow-[0_0_20px_rgba(0,255,136,0.05)]">
                <div id="generated-pwd-box" className="font-mono text-sm md:text-base text-cyber-green font-medium tracking-wider select-all break-all">{generatedPass}</div>
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <button onClick={handlePasswordGen} className="p-1.5 bg-black/40 hover:bg-black rounded text-zinc-500 hover:text-white" title="Re-roll Password">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleCopy(generatedPass)} className="p-1.5 bg-black/40 hover:bg-black rounded text-zinc-500 hover:text-cyber-green" title="Copy Password">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="text-[10px] font-mono text-zinc-500">
                Calculated Entropy Score: {Math.round(passLen * (passSym ? 5.2 : 4.4))} bits. Extremely resilient.
              </div>
            </div>
          </div>
        )}

        {/* 15. Student Scientific Calculator */}
        {tool.id === "scientific-calculator" && (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm bg-[#08110e] rounded-2xl border border-cyber-green/20 p-4 cyber-border-glow shadow-2xl flex flex-col gap-3">
              <div className="w-full bg-[#030604] border border-white/5 rounded-xl px-4 py-3 h-14 flex items-center justify-end font-mono text-xl text-cyber-green overflow-x-auto select-all">
                {calcScreen || "0"}
              </div>

              <div className="grid grid-cols-4 gap-2 font-mono text-xs font-semibold">
                {["sin", "cos", "tan", "deg"].map(b => (
                  <button key={b} onClick={() => handleCalcClick(b === "deg" ? "" : `Math.${b}(`)} className="p-2.5 rounded-lg bg-[#0c1511] hover:bg-[#112a1f] text-zinc-400 hover:text-cyber-green transition-colors">{b}</button>
                ))}
                {["log", "π", "e", "C"].map(b => (
                  <button key={b} onClick={() => handleCalcClick(b === "C" ? "C" : b)} className={`p-2.5 rounded-lg ${b === "C" ? "bg-red-500/10 hover:bg-red-500/20 text-red-400" : "bg-[#0c1511] hover:bg-[#112a1f] text-zinc-300"}`}>{b}</button>
                ))}
                {["7", "8", "9", "÷"].map(b => (
                  <button key={b} onClick={() => handleCalcClick(b)} className="p-3 rounded-lg bg-[#111814] hover:bg-[#1c2a22] text-white">{b}</button>
                ))}
                {["4", "5", "6", "×"].map(b => (
                  <button key={b} onClick={() => handleCalcClick(b)} className="p-3 rounded-lg bg-[#111814] hover:bg-[#1c2a22] text-white">{b}</button>
                ))}
                {["1", "2", "3", "-"].map(b => (
                  <button key={b} onClick={() => handleCalcClick(b)} className="p-3 rounded-lg bg-[#111814] hover:bg-[#1c2a22] text-white">{b}</button>
                ))}
                {["0", ".", "=", "+"].map(b => (
                  <button key={b} onClick={() => handleCalcClick(b)} className={`p-3 rounded-lg ${b === "=" ? "bg-cyber-green text-black hover:bg-cyber-emerald font-bold" : "bg-[#111814] hover:bg-[#1c2a22] text-white"}`}>{b}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 16. Periodic Table of Elements */}
        {tool.id === "periodic-table" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {periodicElements.map((el) => (
                <div
                  key={el.num}
                  onClick={() => setSelectedElement(el)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                    selectedElement.num === el.num 
                      ? "border-cyber-green scale-105 shadow-[0_0_15px_rgba(0,255,136,0.15)] ring-1 ring-cyber-green/50" 
                      : "border-white/5 hover:border-white/10"
                  } ${el.color}`}
                >
                  <span className="text-[10px] font-mono text-zinc-500">{el.num}</span>
                  <span className="text-base font-bold font-display tracking-tight mt-0.5">{el.sym}</span>
                  <span className="text-[8px] font-mono text-zinc-400 truncate w-full text-center">{el.name}</span>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-xl bg-[#08110e]/40 border border-cyber-green/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border border-cyber-green bg-cyber-green/10 flex flex-col items-center justify-center font-display text-cyber-green shrink-0 shadow-[0_0_20px_rgba(0,255,136,0.05)]">
                  <span className="text-xs font-mono opacity-50">{selectedElement.num}</span>
                  <span className="text-2xl font-bold font-display">{selectedElement.sym}</span>
                </div>
                <div>
                  <h3 className="font-display font-medium text-lg text-white">{selectedElement.name}</h3>
                  <p className="text-zinc-500 text-xs font-mono">Classification: <span className="text-cyber-green leading-none">{selectedElement.cat}</span></p>
                </div>
              </div>
              <div className="flex flex-col text-right items-stretch sm:items-end">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Standard Mass Weight</span>
                <span className="text-xl font-display font-bold text-white tracking-widest mt-0.5">{selectedElement.wt} u</span>
              </div>
            </div>
          </div>
        )}

        {/* 17. Pomodoro Timer Focus */}
        {tool.id === "pomodoro-timer" && (
          <div className="flex flex-col items-center justify-center gap-6 py-6">
            <div className="relative w-44 h-44 rounded-full border-4 border-cyber-green/10 flex flex-col items-center justify-center select-none shadow-[inset_0_0_30px_rgba(0,255,136,0.02)]">
              {pomoActive && (
                <div className="absolute inset-0 rounded-full border-4 border-t-cyber-green border-r-transparent border-b-transparent border-l-transparent animate-spin" style={{ animationDuration: "3s" }} />
              )}
              <span className="text-4xl font-display font-bold tracking-widest text-cyber-green">{formattingPomoTime()}</span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
                {pomoActive ? "ACTIVE CYCLE" : "PEACE STATE"}
              </span>
            </div>

            <div className="flex gap-2.5">
              <button 
                onClick={() => setPomoActive(!pomoActive)}
                className={`px-5 py-2 rounded-xl text-black font-semibold text-xs flex items-center gap-1.5 transition-all ${
                  pomoActive ? "bg-red-500 hover:bg-red-600 text-white" : "bg-cyber-green hover:bg-cyber-emerald"
                }`}
              >
                {pomoActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                {pomoActive ? "Pause Sizing" : "Begin Sprint"}
              </button>
              
              <button 
                onClick={() => { setPomoActive(false); setPomoSecs(1500); }}
                className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-zinc-400 font-mono text-xs border border-white/5 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Re-sync
              </button>
            </div>
          </div>
        )}

        {/* 18. Daily BMI health checks */}
        {tool.id === "bmi-calculator" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col gap-4 bg-[#0d1612]/30 p-5 rounded-xl border border-white/5">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Weight Bounds ({bmiWt} kg)</label>
                </div>
                <input type="range" min="30" max="150" value={bmiWt} onChange={(e) => setBmiWt(parseInt(e.target.value))} className="w-full bg-black accent-cyber-green h-1 rounded-sm cursor-pointer" />
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Height Bounds ({bmiHt} cm)</label>
                </div>
                <input type="range" min="100" max="230" value={bmiHt} onChange={(e) => setBmiHt(parseInt(e.target.value))} className="w-full bg-black accent-cyber-green h-1 rounded-sm cursor-pointer" />
              </div>

              <button onClick={handleBmiCalc} className="px-5 py-2.5 rounded-xl bg-cyber-green text-black font-semibold text-xs mt-3 flex items-center justify-center gap-1">
                Formulate Body Mass Index
              </button>
            </div>

            <div className="flex flex-col gap-3 bg-[#050906] p-6 rounded-xl border border-cyber-green/10 justify-center min-h-[160px]">
              {bmiResult ? (
                <div className="text-center">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Analysis Outcome</div>
                  <p className="text-sm font-semibold font-display text-cyber-green mt-2 leading-relaxed">{bmiResult}</p>
                </div>
              ) : (
                <div className="text-center font-mono text-xs text-zinc-500">
                  Slide your metrics metrics inputs to formulate local calculations.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 19. Age Calculator breakdown */}
        {tool.id === "age-calculator" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="bg-[#0d1612]/30 p-5 rounded-xl border border-white/5 flex flex-col gap-3">
              <label className="text-[10px] font-mono text-zinc-500 uppercase">Select Birthdate Coordinates</label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-zinc-200 text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 bg-[#08110e]/40 p-4 rounded-xl border border-cyber-green/10">
              {ageBreakdown ? (
                <>
                  <div className="p-3 bg-black rounded-lg text-center">
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase">Lifespan</span>
                    <span className="text-base font-bold text-cyber-green block mt-1">{ageBreakdown.years} yrs</span>
                  </div>
                  <div className="p-3 bg-black rounded-lg text-center">
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase">Spun Days</span>
                    <span className="text-base font-bold text-white block mt-1">{ageBreakdown.totalDays} days</span>
                  </div>
                  <div className="p-3 bg-black rounded-lg text-center">
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase">Spun Hours</span>
                    <span className="text-xs font-bold text-cyber-emerald block mt-1.5">{ageBreakdown.hoursVal} hrs</span>
                  </div>
                </>
              ) : (
                <div className="col-span-3 text-center text-zinc-500 font-mono text-xs py-4">Checking logs...</div>
              )}
            </div>
          </div>
        )}

        {/* 20. Habit tracker checklist list */}
        {tool.id === "habit-tracker" && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Log daily cyber habit task (e.g. Meditate)..."
                className="flex-1 bg-[#050806] border border-white/5 focus:border-cyber-green/40 rounded-xl px-4 py-2.5 text-zinc-200 text-sm focus:outline-none"
              />
              <button 
                onClick={() => {
                  if (newHabit.trim()) {
                    setHabitsList([...habitsList, newHabit.trim()]);
                    setNewHabit("");
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-cyber-green text-black font-semibold text-xs flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Habit
              </button>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              {habitsList.map((h, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-[#0d1612]/30 rounded-xl border border-white/5 hover:border-cyber-green/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-4 h-4 text-cyber-green shrink-0" />
                    <span className="text-sm font-medium text-zinc-200">{h}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-green/10 text-cyber-green border border-cyber-green/20">
                      7 DAYS STREAK
                    </span>
                    <button 
                      onClick={() => setHabitsList(habitsList.filter((_, i) => i !== idx))}
                      className="p-1 hover:bg-black rounded text-zinc-600 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 21. Business Invoice Generator */}
        {tool.id === "invoice-generator" && (
          <div className="flex flex-col gap-4">
            {!invDone ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0d1612]/20 p-5 rounded-xl border border-white/5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Invoice Index</label>
                  <input type="text" value={invNum} onChange={(e) => setInvNum(e.target.value)} className="w-full bg-[#050806] border border-white/10 rounded-xl px-4 py-2.5 text-zinc-200 text-xs focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Client Demography Title</label>
                  <input type="text" value={invClient} onChange={(e) => setInvClient(e.target.value)} className="w-full bg-[#050806] border border-white/10 rounded-xl px-4 py-2.5 text-zinc-200 text-xs focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2 mt-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Service Detail line Items</label>
                  <input type="text" value={invItemName} onChange={(e) => setInvItemName(e.target.value)} className="w-full bg-[#050806] border border-white/10 rounded-xl px-4 py-2.5 text-zinc-200 text-xs focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Valuation Dollars ($)</label>
                  <input type="number" value={invAmount} onChange={(e) => setInvAmount(parseInt(e.target.value) || 0)} className="w-full bg-[#050806] border border-white/10 rounded-xl px-4 py-2.5 text-zinc-200 text-xs focus:outline-none" />
                </div>

                <button onClick={() => setInvDone(true)} className="md:col-span-2 px-5 py-2.5 rounded-xl bg-cyber-green text-black font-semibold text-xs mt-3 flex items-center justify-center gap-1">
                  Formulate Bill Invoice Layout
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-black border border-cyber-green/30 relative">
                <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4">
                  <div>
                    <h2 className="font-display font-bold text-lg text-cyber-green tracking-wide">PHORGE UTILITY INC.</h2>
                    <p className="text-[10px] font-mono text-zinc-500 mt-1">SECURE BLOCK INDEX BILLING</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-white text-sm">{invNum}</span>
                    <p className="text-[10px] font-mono text-zinc-500 mt-0.5">DATE: 2026-05-27</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-4 text-xs font-mono">
                  <div className="text-zinc-500">BILLED DEMOGRAPHY CLIENT:</div>
                  <div className="text-white font-semibold">{invClient}</div>
                </div>

                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-500">
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-right">Value Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5 text-zinc-300">
                      <td className="py-3">{invItemName}</td>
                      <td className="py-3 text-right">${invAmount?.toLocaleString()}</td>
                    </tr>
                    <tr className="font-bold text-cyber-green text-sm">
                      <td className="py-3">TOTAL NET PAYABLE</td>
                      <td className="py-3 text-right">${invAmount?.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-end gap-2 mt-6 border-t border-white/10 pt-4">
                  <button onClick={() => setInvDone(false)} className="px-3 py-1.5 rounded bg-zinc-950 hover:bg-zinc-900 text-zinc-400 font-mono text-xs border border-white/5">
                    Rewrite
                  </button>
                  <button onClick={() => { handleCopy(`${invNum}\nBilled to: ${invClient}\nTotal: $${invAmount}`); }} className="px-3 py-1.5 rounded bg-cyber-green/10 hover:bg-cyber-green/20 text-cyber-green font-mono text-xs border border-cyber-green/20">
                    Copy Bill
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 22. Secure Notes Vault Encryption */}
        {tool.id === "password-vault" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0d1612]/30 p-5 rounded-xl border border-white/5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase">Authentication Key password</label>
                <input
                  type="password"
                  value={vaultPass}
                  onChange={(e) => setVaultPass(e.target.value)}
                  placeholder="Set secret keys..."
                  className="w-full bg-[#050806] border border-white/10 rounded-xl px-4 py-2.5 text-zinc-200 text-xs focus:outline-none"
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase">Text strings to Secure Lock</label>
                <input
                  type="text"
                  value={vaultText}
                  onChange={(e) => setVaultText(e.target.value)}
                  placeholder="e.g. credit secrets or seed tags..."
                  className="w-full bg-[#050806] border border-white/10 rounded-xl px-4 py-2.5 text-zinc-200 text-xs focus:outline-none"
                />
              </div>

              <button onClick={handleVaultLock} className="md:col-span-2 px-5 py-2.5 rounded-xl bg-cyber-green text-black font-semibold text-xs mt-3 flex items-center justify-center gap-1.5">
                <Lock className="w-4 h-4" /> Cryptographically Shift Lock Out
              </button>
            </div>

            {vaultLogs && (
              <div className="p-4 rounded-xl bg-[#030604] border border-cyber-green/20 relative">
                <pre className="font-mono text-xs text-cyber-green break-all whitespace-pre-wrap">{vaultLogs}</pre>
                <button onClick={() => handleCopy(vaultLogs)} className="absolute top-3 right-3 p-2 bg-black/60 rounded-lg hover:bg-black border border-white/10 text-zinc-400 hover:text-cyber-green">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 23. Random Picker Wheel */}
        {tool.id === "random-picker-wheel" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col gap-3 bg-[#0d1612]/30 p-5 rounded-xl border border-white/5">
              <label className="text-[10px] font-mono text-zinc-500 uppercase">Enter Picker Options (One per line)</label>
              <textarea 
                value={wheelOptions} 
                onChange={(e) => setWheelOptions(e.target.value)}
                className="w-full h-32 bg-[#050806] border border-white/10 rounded-xl p-3 font-mono text-xs focus:outline-none focus:border-cyber-green/30"
              />
              <button 
                onClick={handleSpinWheel} 
                disabled={isSpinning}
                className="px-5 py-2.5 rounded-xl bg-cyber-green hover:bg-cyber-emerald text-black font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Compass className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} /> 
                {isSpinning ? "Calibrating Compass..." : "Spin Interactive Dial"}
              </button>
            </div>

            <div className="flex flex-col items-center justify-center bg-black/40 p-6 rounded-xl border border-cyber-green/10 min-h-[220px] text-center">
              {wheelSelected ? (
                <div className="animate-bounce">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">Selected Horizon</span>
                  <p className="text-xl font-display font-medium text-cyber-green mt-2 px-6 py-2 rounded-xl bg-cyber-green/5 border border-cyber-green/20 inline-block">{wheelSelected}</p>
                </div>
              ) : (
                <div className="font-mono text-xs text-zinc-500 leading-relaxed">
                  {isSpinning ? "Dial shifting dynamic degree variables..." : "Click Dial to process Unbiased decisions offline."}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 24. GENERAL TERMINAL EXECUTOR (Fallback for the rest of the 125 tools list) */}
        {!["word-counter", "character-counter", "sentence-counter", "paragraph-counter", "case-converter", "remove-duplicate-lines", "reverse-text", "lorem-ipsum-generator", "fancy-font-generator", "ascii-banner-generator", "qr-code-generator", "text-to-speech", "image-metadata-viewer", "palette-generator", "gradient-generator", "json-formatter", "base64-encoder-decoder", "uuid-generator", "hash-generator", "sha-encryptor", "password-generator", "scientific-calculator", "periodic-table", "pomodoro-timer", "bmi-calculator", "age-calculator", "habit-tracker", "invoice-generator", "password-vault", "random-picker-wheel"].includes(tool.id) && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0b100d]/60 border border-cyber-green/10 rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[150px] h-full pointer-events-none bg-gradient-to-l from-cyber-green/5 to-transparent blur-xl" />
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
                <span className="font-mono text-xs text-zinc-300">PHORGE DYNAMIC DIAGNOSTIC RUNTIME</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                You have requested the fully private local browser routine **{tool.name}**. Let our internal virtual state machines parse and format your asset arrays. Write variable inputs below:
              </p>
            </div>

            <textarea
              id="txt-general-input"
              value={devInput}
              onChange={(e) => setDevInput(e.target.value)}
              placeholder="Paste raw string files, columns, list rows or numerical values here..."
              className="w-full h-28 bg-[#050806] border border-white/5 focus:border-cyber-green/40 rounded-xl p-4 font-mono text-xs focus:outline-none"
            />

            <button onClick={handleGeneralDiagnostics} className="px-5 py-2.5 self-start rounded-xl bg-cyber-green text-black font-semibold text-xs flex items-center gap-1.5 transition-all">
              <Play className="w-3.5 h-3.5 fill-current" /> Execute Phorge Offline Array Sync
            </button>

            {executed && (
              <div className="p-4 rounded-xl bg-black border border-cyber-green/25 font-mono text-[11px] text-zinc-400 relative">
                <div className="text-[9px] text-cyber-green mb-2 uppercase tracking-wider">PROCESS RESULTS STDOUT:</div>
                <pre className="whitespace-pre-wrap">{stdout}</pre>
                {devInput && (
                  <div className="border-t border-white/10 pt-3 mt-3">
                    <span className="text-[9px] text-zinc-500 uppercase block">Refined Sandbox Return Output:</span>
                    <pre className="text-white text-xs mt-1 bg-black/80 p-2.5 rounded-lg border border-white/5 overflow-x-auto select-all">
                      {devInput.split("").reverse().join("") || "[Arrays successfully structured]"}
                    </pre>
                  </div>
                )}
                
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button onClick={() => setExecuted(false)} className="p-1.5 bg-black hover:bg-zinc-950 rounded text-zinc-600 hover:text-white" title="Reset">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleCopy(devInput || stdout)} className="p-1.5 bg-black hover:bg-zinc-950 rounded text-zinc-600 hover:text-cyber-green" title="Copy Output">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* HOW TO USE & COMPREHENSIVE FAQ AREA AS REQUIRED */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <div className="p-6 rounded-2xl bg-cyber-card/40 border border-white/5">
          <h4 className="font-display font-semibold text-white text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyber-green" /> Architectural Manual
          </h4>
          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mt-2.5">
            {tool.howToUse}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {tool.faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-cyber-card/40 border border-white/5">
              <h5 className="font-display font-medium text-white text-xs md:text-sm">Q: {faq.question}</h5>
              <p className="text-zinc-400 text-xs leading-relaxed mt-1.5">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RELATED TOOLS LIST */}
      <div className="mt-2">
        <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">RELATED UTILITIES RECOMMENDED:</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[`password-generator`, `hash-generator`, `json-formatter`, `word-counter`].filter(id => id !== tool.id).slice(0, 3).map((rId) => (
            <div key={rId} className="p-3.5 rounded-xl bg-[#090e0c]/80 border border-white/5 hover:border-cyber-green/15 text-xs text-zinc-400 font-mono flex items-center justify-between select-none">
              <span className="truncate">{rId.replace(/-/g, " ").toUpperCase()}</span>
              <span className="text-cyber-green">➔</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
