/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ToolItem, ToolCategory, CategoryInfo } from "../types";

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "text",
    name: "Text Tools",
    description: "Format, analyze, sanitize, and manipulate text strings and prose",
    iconName: "FileText",
    count: 19,
  },
  {
    id: "image",
    name: "Image Tools",
    description: "Crop, compress, convert, and generate graphics offline in browser",
    iconName: "Image",
    count: 21,
  },
  {
    id: "pdf",
    name: "PDF Tools",
    description: "Merge, split, compress, sign, and convert PDF documents locally",
    iconName: "FileSpreadsheet",
    count: 10,
  },
  {
    id: "developer",
    name: "Developer Tools",
    description: "Format, validate, encode, hash, and format code languages instantly",
    iconName: "Binary",
    count: 20,
  },
  {
    id: "student",
    name: "Student Tools",
    description: "Math calculators, solvers, study timers, periodic table, and GPA templates",
    iconName: "GraduationCap",
    count: 15,
  },
  {
    id: "business",
    name: "Business Tools",
    description: "Generate professional invoices, receipts, tax, and margin calculations",
    iconName: "Briefcase",
    count: 10,
  },
  {
    id: "security",
    name: "Security Tools",
    description: "Enrypted text vault, metadata removers, file cryptors, and strong tokens",
    iconName: "ShieldAlert",
    count: 8,
  },
  {
    id: "daily",
    name: "Daily Life Tools",
    description: "BMI calculators, trackers, alarms, calendars, and focus timers",
    iconName: "Calendar",
    count: 11,
  },
  {
    id: "generator",
    name: "Generator Tools",
    description: "Generate names, user handles, random picking wheels, flipping, and banners",
    iconName: "Sparkles",
    count: 11,
  },
];

// Definition of 125 tools across categories
const toolsRawList: {
  id: string;
  name: string;
  category: ToolCategory;
  iconName: string;
  description: string;
  tags: string[];
  trending?: boolean;
}[] = [
  // === TEXT TOOLS (19) ===
  { id: "word-counter", name: "Word Counter", category: "text", iconName: "Hash", description: "Count precise words, characters, sentences, paragraphs and read times of any article instantly.", tags: ["words", "metrics", "prose"], trending: true },
  { id: "character-counter", name: "Character Counter", category: "text", iconName: "LetterText", description: "Instantly analyze characters, with or without spaces, to meet strict writing limits.", tags: ["letters", "prose", "text"] },
  { id: "sentence-counter", name: "Sentence Counter", category: "text", iconName: "FileLines", description: "Calculate sentence frequency and syntactic composition of your written assets.", tags: ["english", "prose", "editor"] },
  { id: "paragraph-counter", name: "Paragraph Counter", category: "text", iconName: "AlignLeft", description: "Identify physical paragraphs, breaks, and section pacing under professional guidelines.", tags: ["format", "spacing", "margins"] },
  { id: "remove-duplicate-lines", name: "Remove Duplicate Lines", category: "text", iconName: "Trash2", description: "Sanitize massive text strings by identifying and scrubbing identical lines locally.", tags: ["clean", "duplicates", "filter"], trending: true },
  { id: "text-sorter", name: "Text Sorter", category: "text", iconName: "ListStart", description: "Sort lists alphabetically, reverse list orders, or randomize prose elements intuitively.", tags: ["sort", "alphabetical", "order"] },
  { id: "case-converter", name: "Case Converter", category: "text", iconName: "CaseUpper", description: "Convert paragraphs into UPPERCASE, lowercase, sentence case, title case, or camelCase.", tags: ["camelcase", "format", "capitalize"], trending: true },
  { id: "reverse-text", name: "Reverse Text", category: "text", iconName: "Undo2", description: "Flip letters, lines, words, or full strings. Ideal for coding challenges, testing, and encryption.", tags: ["backwards", "transform", "fun"] },
  { id: "random-text-generator", name: "Random Text Generator", category: "text", iconName: "Shuffle", description: "Produce randomized strings with alpha-numeric and special criteria for sandbox systems.", tags: ["sandbox", "generate", "entropy"] },
  { id: "lorem-ipsum-generator", name: "Lorem Ipsum Generator", category: "text", iconName: "AlignJustify", description: "Generate premium dummy prose, sentences, paragraphs, or lists for designers and engineers.", tags: ["layout", "dummy", "copy"], trending: true },
  { id: "fancy-font-generator", name: "Fancy Font Generator", category: "text", iconName: "Sparkles", description: "Generate beautifully unicode-stylized text presets for bios, social handles, or titles.", tags: ["unicode", "fonts", "styled"] },
  { id: "text-diff-checker", name: "Text Diff Checker", category: "text", iconName: "GitCompare", description: "Visually compare two text versions side-by-side to track manual drafts or code edits.", tags: ["compare", "diff", "tracking"] },
  { id: "read-time-estimator", name: "Read Time Estimator", category: "text", iconName: "Clock", description: "Estimate duration, pacing, and visual delivery rates based on standard human speeds.", tags: ["estimate", "speaking", "blog"] },
  { id: "markdown-previewer", name: "Markdown Previewer", category: "text", iconName: "Eye", description: "Type or drag standard Markdown files and view them instantly as pixel-perfect HTML layouts.", tags: ["preview", "markdown", "editor"] },
  { id: "html-cleaner", name: "HTML Cleaner", category: "text", iconName: "Code", description: "Strip unwanted inline styling, tag debris, and format messy HTML into pure semantics.", tags: ["sanitize", "tags", "html"] },
  { id: "emoji-picker", name: "Emoji Picker", category: "text", iconName: "Smile", description: "Instantly search, select, copy, and categorize trending emoji characters globally.", tags: ["icons", "social", "lookup"] },
  { id: "hashtag-generator", name: "Hashtag Generator", category: "text", iconName: "Instagram", description: "Extract key subject vectors and generate optimized social hashtags for visibility.", tags: ["social", "tags", "analytics"] },
  { id: "text-to-speech", name: "Text to Speech", category: "text", iconName: "Volume2", description: "Play synthetic speech using native browser voices on text segments locally.", tags: ["audio", "synthesizer", "tts"] },
  { id: "speech-to-text", name: "Speech to Text", category: "text", iconName: "Mic", description: "Use Chrome and Edge WebSpeech API to translate dictation into written words offline.", tags: ["dictate", "microphone", "stt"] },

  // === IMAGE TOOLS (21) ===
  { id: "image-compressor", name: "Image Compressor", category: "image", iconName: "Shrink", description: "Losslessly compress PNG and JPEG images to reduce payload size safely in memory.", tags: ["optimize", "size", "kb"] },
  { id: "resize-image", name: "Resize Image", category: "image", iconName: "Maximize", description: "Resample image dimensions in height and width. Retain aspect or force custom bounds.", tags: ["canvas", "resolution", "scale"] },
  { id: "crop-image", name: "Crop Image", category: "image", iconName: "Crop", description: "Select aspect ratios, adjust borders, and crop unnecessary parts from photos.", tags: ["frame", "focus", "edit"] },
  { id: "rotate-image", name: "Rotate Image", category: "image", iconName: "RotateCw", description: "Spin images, flip horizontal or vertical mirrors inside local canvas panels.", tags: ["degrees", "align", "flip"] },
  { id: "png-to-jpg-converter", name: "PNG to JPG Converter", category: "image", iconName: "FileOutput", description: "Quickly convert transparent PNG frames into high-speed, standard JPG formats.", tags: ["convert", "png", "jpg"] },
  { id: "jpg-to-webp-converter", name: "JPG to WEBP Converter", category: "image", iconName: "HardDriveUpload", description: "Streamline web assets by converting heavy JPG files into next-gen space-saving WebP files.", tags: ["webp", "next-gen", "convert"] },
  { id: "background-remover", name: "Background Remover", category: "image", iconName: "Eraser", description: "Use HTML canvas delta filters to composite solid backdrops out of user drawings or images.", tags: ["erase", "matte", "mask"] },
  { id: "blur-image", name: "Blur Image", category: "image", iconName: "Layers", description: "Apply Gaussian blur filters at custom pixel radiuses for wallpapers and privacy layers.", tags: ["blur", "gaussian", "filter"] },
  { id: "meme-generator", name: "Meme Generator", category: "image", iconName: "Flame", description: "Upload backgrounds or choose presets to design custom memes with caption overlays.", tags: ["meme", "creative", "social"], trending: true },
  { id: "qr-code-generator", name: "QR Code Generator", category: "image", iconName: "QrCode", description: "Generate highly customizable vector QR Codes for URLs, phone, wifi, or texts.", tags: ["share", "vector", "scan"], trending: true },
  { id: "barcode-generator", name: "Barcode Generator", category: "image", iconName: "Barcode", description: "Convert custom codes into standard Code128, EAN-13, and generic UPC printable symbols.", tags: ["retail", "inventory", "print"] },
  { id: "watermark-tool", name: "Watermark Tool", category: "image", iconName: "Stamp", description: "Overlay textured credentials, titles, copyright stamps, or logs over proprietary graphics.", tags: ["stamp", "secure", "copyright"] },
  { id: "color-picker", name: "Color Picker", category: "image", iconName: "Pipette", description: "An interactive HTML Eye-Dropper and coordinate analyzer from screens or canvas loads.", tags: ["eyedropper", "rgb", "hex"] },
  { id: "palette-generator", name: "Palette Generator", category: "image", iconName: "Palette", description: "Create harmonious futuristic 5-color palettes based on complementary color theory.", tags: ["design", "complementary", "colors"], trending: true },
  { id: "image-to-ascii", name: "Image to ASCII", category: "image", iconName: "Terminal", description: "Remap pixels into dark-text console density indicators for classic retro text layouts.", tags: ["terminal", "ascii", "art"] },
  { id: "pixel-art-converter", name: "Pixel Art Converter", category: "image", iconName: "Square", description: "Pixelate photos into stylized 8-bit visual masterpieces with grid controls.", tags: ["8-bit", "retro", "pixelate"] },
  { id: "screenshot-beautifier", name: "Screenshot Beautifier", category: "image", iconName: "Tv", description: "Frame screenshots in rounded layouts over deep rich emerald radial-glow gradient backdrops.", tags: ["mock", "dribbble", "frame"] },
  { id: "favicon-generator", name: "Favicon Generator", category: "image", iconName: "FileImage", description: "Bundle files into multi-resolution .ico folders or simple icons with a click.", tags: ["ico", "tab", "web"] },
  { id: "gradient-generator", name: "Gradient Generator", category: "image", iconName: "Paintbrush", description: "Generate fully customizable and CSS exportable multi-stop glow emerald patterns.", tags: ["css", "background", "pattern"], trending: true },
  { id: "svg-optimizer", name: "SVG Optimizer", category: "image", iconName: "CodeXml", description: "Strip metadata, descriptions, empty nodes, and float digits from complex vector SVGs.", tags: ["clean-xml", "optimize", "vector"] },
  { id: "image-metadata-viewer", name: "Image Metadata Viewer", category: "image", iconName: "Info", description: "Render internal EXIF data, timestamps, dimensions, GPS points, and camera sensors.", tags: ["exif", "privacy", "camera"], trending: true },

  // === PDF TOOLS (10) ===
  { id: "merge-pdfs", name: "Merge PDFs", category: "pdf", iconName: "Merge", description: "Concatenate multiple PDF files into one clean sequenced document locally.", tags: ["combine", "pdf", "order"] },
  { id: "split-pdf", name: "Split PDF", category: "pdf", iconName: "Split", description: "Extract individual pages or range sequences from a compiled PDF book.", tags: ["extract", "pages", "split"] },
  { id: "compress-pdf", name: "Compress PDF", category: "pdf", iconName: "Minimize2", description: "Adjust compression densities to scale down heavy PDF files quickly without servers.", tags: ["shrink", "document", "compression"] },
  { id: "pdf-to-image", name: "PDF to Image", category: "pdf", iconName: "FileImage", description: "Rasterize individual pages inside any PDF into crystal clear JPG or PNG assets.", tags: ["convert", "render", "pages"] },
  { id: "image-to-pdf", name: "Image to PDF", category: "pdf", iconName: "FileUp", description: "Batch convert photography streams, invoices or screenshots into a clean compiled PDF file.", tags: ["generate", "images", "scanner"] },
  { id: "rotate-pdf", name: "Rotate PDF", category: "pdf", iconName: "RefreshCcw", description: "Adjust alignment coordinates of upside-down scans inside multi-page PDF records.", tags: ["align", "scans", "pages"] },
  { id: "pdf-page-remover", name: "PDF Page Remover", category: "pdf", iconName: "Trash", description: "Scrub out individual pages, blank layouts or outdated slides from your documents.", tags: ["delete", "clean-pdf", "editor"] },
  { id: "add-watermark-to-pdf", name: "Add Watermark to PDF", category: "pdf", iconName: "FileCheck", description: "Stitch transparent text logos or copyright indicators over physical PDF coordinates.", tags: ["stamp", "copyright", "pdf"] },
  { id: "sign-pdf", name: "Sign PDF", category: "pdf", iconName: "PenTool", description: "Draw, type, or upload high-resolution hand signatures onto document sheets natively.", tags: ["signature", "esign", "legal"] },
  { id: "extract-text-from-pdf", name: "Extract Text from PDF", category: "pdf", iconName: "FileSearch", description: "Perform deep text parsing on searchable PDF documents to grab text segments immediately.", tags: ["ocr", "extractor", "text"] },

  // === DEVELOPER TOOLS (20) ===
  { id: "json-formatter", name: "JSON Formatter", category: "developer", iconName: "Braces", description: "Beautify, parse, and structure raw JSON strings into organized indented trees.", tags: ["json", "format", "beautified"], trending: true },
  { id: "json-validator", name: "JSON Validator", category: "developer", iconName: "ShieldCheck", description: "Surgical parser identifying precise error coordinates and syntax typos in JSON files.", tags: ["debug", "error", "valid"] },
  { id: "base64-encoder-decoder", name: "Base64 Encoder/Decoder", category: "developer", iconName: "Binary", description: "Encode raw text, characters, or hex strings into standard Base64 files, and decode back.", tags: ["encoding", "b64", "network"], trending: true },
  { id: "url-encoder-decoder", name: "URL Encoder/Decoder", category: "developer", iconName: "Link2", description: "Translate reserved URI query parameters, escape strings, or reverse to readable text.", tags: ["url", "percent", "escape"] },
  { id: "regex-tester", name: "Regex Tester", category: "developer", iconName: "GitMerge", description: "Validate regular expressions against sample words with highlighting and capture groups.", tags: ["regex", "find", "parse"] },
  { id: "jwt-decoder", name: "JWT Decoder", category: "developer", iconName: "Key", description: "Decode payload headers, JSON bodies, issue stamps, and check secret claims of JSON Web Tokens.", tags: ["jwt", "tokens", "claims"], trending: true },
  { id: "timestamp-converter", name: "Timestamp Converter", category: "developer", iconName: "CalendarDays", description: "Translate Unix epoch digits (seconds, ms) into standard human date timelines.", tags: ["time", "epoch", "conversion"] },
  { id: "unix-time-generator", name: "Unix Time Generator", category: "developer", iconName: "Timer", description: "Instantly capture current Unix time indicators, with custom offsets and manual copying.", tags: ["seconds", "epochs", "current"] },
  { id: "color-converter", name: "Color Converter", category: "developer", iconName: "Palette", description: "Convert RGB, HEX, HSL, CMYK, and HSV color representations with visual preview nodes.", tags: ["hsl", "hex", "css"] },
  { id: "css-minifier", name: "CSS Minifier", category: "developer", iconName: "Maximize2", description: "Squeeze styling documents by scrubbing white spaces, line breaks, and duplicate comments.", tags: ["speed", "assets", "minify"] },
  { id: "js-minifier", name: "JS Minifier", category: "developer", iconName: "Code2", description: "Compress client javascript assets, collapse local variables, and reduce weight.", tags: ["script", "obfuscate", "minify"] },
  { id: "html-minifier", name: "HTML Minifier", category: "developer", iconName: "CodeXml", description: "Optimize web layouts by removing tab markers, spaces, and formatting structures.", tags: ["markup", "dom", "speed"] },
  { id: "sql-formatter", name: "SQL Formatter", category: "developer", iconName: "Database", description: "Pristinely indent messy SELECT queries, JOINs, and conditional columns.", tags: ["query", "database", "sql"] },
  { id: "code-diff-checker", name: "Code Diff Checker", category: "developer", iconName: "FileCode", description: "Run logical line checks between scripts to view code additions and deletions.", tags: ["git", "diff", "checker"] },
  { id: "uuid-generator", name: "UUID Generator", category: "developer", iconName: "Ticket", description: "Generate RFC4122 compliant random, cryptographically secure UUID version 4 tokens.", tags: ["id", "random", "uuid"], trending: true },
  { id: "hash-generator", name: "Hash Generator", category: "developer", iconName: "Fingerprint", description: "Hash text strings using MD5, SHA-1, or SHA-512 algorithms in sandboxed browser setups.", tags: ["md5", "sha", "digest"] },
  { id: "sha-encryptor", name: "SHA Encryptor", category: "developer", iconName: "Lock", description: "Generate pristine SHA-256 and SHA-384 fingerprints for passwords, files, or packages.", tags: ["sha-256", "cryptography", "secure"], trending: true },
  { id: "password-generator", name: "Password Generator", category: "developer", iconName: "Shield", description: "Design ultra-secure passwords with dynamic symbols, numbers, upper/lowercase constraints.", tags: ["generate", "entropy", "credentials"], trending: true },
  { id: "password-strength-checker", name: "Password Strength Checker", category: "developer", iconName: "Activity", description: "Analyze password quality, entropy score, vulnerability indexes, and cracking estimations.", tags: ["strength", "vulnerable", "zxcvbn"] },
  { id: "api-mock-data-generator", name: "API Mock Data Generator", category: "developer", iconName: "FileJson", description: "Instantly create dynamic custom mock mock-JSON arrays full of users, emails, and names.", tags: ["mock-api", "seed", "json"] },

  // === STUDENT TOOLS (15) ===
  { id: "scientific-calculator", name: "Scientific Calculator", category: "student", iconName: "Calculator", description: "Advanced desktop mathematical processing with trigonometry, logarithms, power, brackets.", tags: ["math", "numbers", "equations"], trending: true },
  { id: "gpa-calculator", name: "GPA Calculator", category: "student", iconName: "Percent", description: "Formulate your dynamic term and cumulative GPA score with custom grade weights.", tags: ["grades", "marks", "gpa"] },
  { id: "percentage-calculator", name: "Percentage Calculator", category: "student", iconName: "TrendingUp", description: "Run complex markup, discount rates, margins, percentage increases, and shares.", tags: ["math", "interest", "ratios"] },
  { id: "equation-solver", name: "Equation Solver", category: "student", iconName: "PlusMinus", description: "Solve algebraic quadratic, linear, and system formulas with step logs.", tags: ["algebra", "roots", "solve"] },
  { id: "unit-converter", name: "Unit Converter", category: "student", iconName: "IterationCw", description: "Translate physical magnitudes: mass, length, temperature, energy, area, and speed.", tags: ["metrics", "units", "imperial"], trending: true },
  { id: "currency-converter", name: "Currency Converter", category: "student", iconName: "Coins", description: "Convert major global assets: USD, EUR, GBP, JPY with offline base ratios.", tags: ["money", "rates", "forex"] },
  { id: "periodic-table", name: "Periodic Table", category: "student", iconName: "Grid", description: "Interactive cyber-element navigator of atomic weights, categories, and properties.", tags: ["chemistry", "atoms", "elements"], trending: true },
  { id: "graph-plotter", name: "Graph Plotter", category: "student", iconName: "AreaChart", description: "Visualize coordinates and functions (sin, cos, quadratic) dynamically on charts.", tags: ["graph", "plot", "math"] },
  { id: "math-formula-sheet", name: "Math Formula Sheet", category: "student", iconName: "ClipboardList", description: "A comprehensive high-tech sheet mapping derivatives, geometry, integrals, and constants.", tags: ["physics", "cheat-sheet", "math"] },
  { id: "notes-saver", name: "Notes Saver", category: "student", iconName: "FileEdit", description: "Jot down insights, lecture slides, draft lists, and retrieve them with browser cache.", tags: ["notes", "scratchpad", "draft"] },
  { id: "pomodoro-timer", name: "Pomodoro Timer", category: "student", iconName: "Hourglass", description: "Improve focus with customizable cyber-styled study sprints and audio loop buzzes.", tags: ["work", "focus", "sprint"], trending: true },
  { id: "flashcard-tool", name: "Flashcard Tool", category: "student", iconName: "Layers3", description: "Flip custom-labeled study decks to self-test formulas, vocabulary, or concepts.", tags: ["study", "memorize", "cards"] },
  { id: "citation-generator", name: "Citation Generator", category: "student", iconName: "BookOpen", description: "Format precise references in APA, MLA, Chicago, and Harvard standards with copy button.", tags: ["academic", "citation", "bibliography"] },
  { id: "homework-planner", name: "Homework Planner", category: "student", iconName: "CalendarRange", description: "Track term deadlines, homework assignments, courses, and exam dates.", tags: ["planning", "deadlines", "board"] },
  { id: "study-timer", name: "Study Timer", category: "student", iconName: "Clock7", description: "A simple stopwatch and chronometer panel to keep logs of study session meters.", tags: ["duration", "logs", "metrics"] },

  // === BUSINESS TOOLS (10) ===
  { id: "invoice-generator", name: "Invoice Generator", category: "business", iconName: "Briefcase", description: "Fully draft, calculate, preview, and print highly compliant, elegant business invoices.", tags: ["invoice", "pdf", "billing"], trending: true },
  { id: "receipt-generator", name: "Receipt Generator", category: "business", iconName: "Receipt", description: "Design dynamic sales receipts with item quantities, store details, and tax breakdowns.", tags: ["receipt", "sales", "margins"] },
  { id: "profit-margin-calculator", name: "Profit Margin Calculator", category: "business", iconName: "TrendingUp", description: "Calculate markup rates, gross profit, margin weights, and optimized retail pricing tiers.", tags: ["retail", "gross-profit", "markup"] },
  { id: "tax-calculator", name: "Tax Calculator", category: "business", iconName: "Percent", description: "Run local tax rates, sales bracket calculations, net vs gross amounts.", tags: ["tax", "brackets", "finance"] },
  { id: "salary-calculator", name: "Salary Calculator", category: "business", iconName: "Wallet", description: "Formulaic net salary, hourly to annual earnings, tax deductions, and take-home ranges.", tags: ["wages", "earnings", "payroll"] },
  { id: "emi-calculator", name: "EMI Calculator", category: "business", iconName: "CreditCard", description: "Formulate Equated Monthly Installments for motor, retail, or major home loans.", tags: ["loans", "payments", "amortization"], trending: true },
  { id: "loan-calculator", name: "Loan Calculator", category: "business", iconName: "BadgeDollarSign", description: "Full principal amortizations, cumulative interest payouts, and payoff period sheets.", tags: ["mortgages", "amortization", "payouts"] },
  { id: "expense-tracker", name: "Expense Tracker", category: "business", iconName: "ShoppingBag", description: "Track expenditures, business dinners, travel tickets, and retrieve historical sums.", tags: ["expenses", "budget", "tracker"] },
  { id: "business-name-generator", name: "Business Name Generator", category: "business", iconName: "Sparkle", description: "Merge theme vectors to generate modern tech-forward startup or storefront titles.", tags: ["branding", "name-gen", "startup"] },
  { id: "resume-builder", name: "Resume Builder", category: "business", iconName: "Contact", description: "A cyber-styled markdown resume framer supporting PDF layout compilation.", tags: ["resume", "cv", "career"] },

  // === SECURITY TOOLS (8) ===
  { id: "password-vault", name: "Password Vault", category: "security", iconName: "FolderLock", description: "A secure, fully offline browser-keypair storage using AES encryption formulas.", tags: ["credentials", "aes", "offline-vault"], trending: true },
  { id: "file-encryptor", name: "File Encryptor", category: "security", iconName: "LockKeyhole", description: "Encrypt binary structures, strings, or logs in your browser with AES passwords.", tags: ["encrypt", "obfuscation", "protection"] },
  { id: "file-decryptor", name: "File Decryptor", category: "security", iconName: "UnlockKeyhole", description: "Unlock AES-encrypted browser structures using the corresponding security passwords.", tags: ["decrypt", "restore", "keys"] },
  { id: "metadata-remover", name: "Metadata Remover", category: "security", iconName: "ScanEye", description: "Scrub EXIF tags, GPS coordinate anchors, and device IDs from PNG/JPG assets BEFORE uploading.", tags: ["exif-clean", "privacy", "scrub"] },
  { id: "secure-notes", name: "Secure Notes", category: "security", iconName: "EyeOff", description: "Write private journal logs that auto-encrypt inside the local browser localStorage.", tags: ["notes", "vault", "privacy"], trending: true },
  { id: "fake-identity-generator", name: "Fake Identity Generator", category: "security", iconName: "UserSquare", description: "Generate completely randomized pseudonyms, sample addresses, and proxy data for signups.", tags: ["privacy", "mock-identity", "proxy"] },
  { id: "random-token-generator", name: "Random Token Generator", category: "security", iconName: "RefreshCcw", description: "Produce raw cryptographic crypt-hashed HEX and base-64 keys at desired entropy.", tags: ["entropy", "tokens", "preshared"] },
  { id: "privacy-checker", name: "Privacy Checker", category: "security", iconName: "ShieldAlert", description: "Assess tracking indicators, check viewport variables, and block diagnostic leaks.", tags: ["diagnostic", "audits", "leaks"] },

  // === DAILY LIFE TOOLS (11) ===
  { id: "bmi-calculator", name: "BMI Calculator", category: "daily", iconName: "HeartPulse", description: "Calculate body mass index, weight brackets, and calorie guides based on standard indexes.", tags: ["health", "weight", "bmi"] },
  { id: "habit-tracker", name: "Habit Tracker", category: "daily", iconName: "Flame", description: "Log daily habits, maintain weekly streaks, and store progress offline.", tags: ["habits", "daily", "streaks"], trending: true },
  { id: "water-intake-tracker", name: "Water Intake Tracker", category: "daily", iconName: "Droplet", description: "Graph and log water cups, monitor your ideal hydration metrics index daily.", tags: ["hydration", "healthy", "logs"] },
  { id: "age-calculator", name: "Age Calculator", category: "daily", iconName: "Clock", description: "Track your age down to years, months, days, minutes, and count down to birthdays.", tags: ["birthday", "time", "date"] },
  { id: "countdown-timer", name: "Countdown Timer", category: "daily", iconName: "Timer", description: "Set digital countdowns, receive visual neon flash indicators upon completion.", tags: ["timer", "visual-alert", "countdown"] },
  { id: "alarm-tool", name: "Alarm Tool", category: "daily", iconName: "AlarmClock", description: "Keep standard alarms, receive customizable synth melody cues on time.", tags: ["clock", "melody", "sound"] },
  { id: "calendar-planner", name: "Calendar Planner", category: "daily", iconName: "Calendar", description: "Manage active schedules, draft recurring tasks, map study and daily rosters.", tags: ["agenda", "planner", "tasks"] },
  { id: "mood-tracker", name: "Mood Tracker", category: "daily", iconName: "SmilePlus", description: "Track, log, and chart daily mental state indexes to view emotional frequency over weeks.", tags: ["health", "logs", "metrics"] },
  { id: "budget-planner", name: "Budget Planner", category: "daily", iconName: "PiggyBank", description: "Track relative balances, categorize dynamic monthly allocations, and store sums.", tags: ["wealth", "expenses", "saving"] },
  { id: "grocery-list", name: "Grocery List", category: "daily", iconName: "ShoppingBag", description: "Plan, cross off, and categorize groceries dynamically before shopping runs.", tags: ["shopping", "list", "grocery"] },
  { id: "daily-journal", name: "Daily Journal", category: "daily", iconName: "BookMarked", description: "Type, store, and manage custom daily logs with timestamps in browser localStorage.", tags: ["journal", "diary", "text"] },

  // === GENERATOR TOOLS (11) ===
  { id: "username-generator", name: "Username Generator", category: "generator", iconName: "Sparkles", description: "Generate stylish, catchy, and available cyber-themed username strings.", tags: ["social", "names", "handles"] },
  { id: "domain-name-generator", name: "Domain Name Generator", category: "generator", iconName: "Globe", description: "Combine theme vectors, suffixes, and keywords to brainstorm premium available domains.", tags: ["domains", "brand", "web"] },
  { id: "color-theme-generator", name: "Color Theme Generator", category: "generator", iconName: "Palette", description: "Instant generation of professional dark, light, and sci-fi aesthetic theme palettes.", tags: ["themes", "design", "css"] },
  { id: "random-picker-wheel", name: "Random Picker Wheel", category: "generator", iconName: "Compass", description: "Enter decision options and spin a beautiful, high-performance cyber picking wheel.", tags: ["game", "options", "picker"], trending: true },
  { id: "dice-roller", name: "Dice Roller", category: "generator", iconName: "Milestone", description: "Roll multi-sided gaming dice (D4, D6, D8, D10, D12, D20) with accurate entropy.", tags: ["dice", "gaming", "roller"] },
  { id: "coin-flip", name: "Coin Flip", category: "generator", iconName: "Coins", description: "Flip dual-sided cyber coins for instant, unbiased micro-decisions.", tags: ["coin", "unbiased", "heads"] },
  { id: "nickname-generator", name: "Nickname Generator", category: "generator", iconName: "PartyPopper", description: "Produce catchy, humorous, or powerful handles with custom filters.", tags: ["gaming", "fun", "avatar"] },
  { id: "bio-generator", name: "Bio Generator", category: "generator", iconName: "Sparkle", description: "Generate short, professional, creative, or cool bios for portfolios and profiles.", tags: ["bio", "author", "writing"] },
  { id: "fake-chat-generator", name: "Fake Chat Generator", category: "generator", iconName: "MessageSquare", description: "Customizable visual chat dialogue generator for tutorials or mock mock-ups.", tags: ["mock-up", "design", "assets"] },
  { id: "signature-generator", name: "Signature Generator", category: "generator", iconName: "Signature", description: "Type your initials and generate premium, customizable cursive signature styles.", tags: ["design", "sign", "cursive"] },
  { id: "ascii-banner-generator", name: "ASCII Banner Generator", category: "generator", iconName: "Terminal", description: "Convert phrases into huge, impressive ASCII letter matrices for terminal files.", tags: ["banner", "ascii", "art"], trending: true }
];

export const TOOLS: ToolItem[] = toolsRawList.map((t) => {
  return {
    ...t,
    seoDescription: t.description,
    howToUse: `To utilize the "${t.name}" tool, paste or upload your asset into the input workspace. Phorge Engine processes all variables instantly and cryptographically in your local browser sandbox. No bytes are sent to external hosting layers. Use the download or clipboard icons to extract output files.`,
    faqs: [
      {
        question: `Is data from ${t.name} processed on server nodes?`,
        answer: `No. Under our privacy-first declaration, all processing for public "${t.name}" routines is fully client-side inside standard browser memory sandboxes. This tool requires zero internet connectivity and is completely safe from diagnostics monitoring.`
      },
      {
        question: `Can I run ${t.name} while offline on cell networks or flights?`,
        answer: `Yes. PHORGE TOOLS utilizes local Service Worker specifications which cache core script files. You can save the PWA to your mobile deck or laptop dock and launch it anywhere, regardless of server online states.`
      },
      {
        question: `How do I export the hasil variables?`,
        answer: `Use the copy icon to transfer text lines into your system clipboard, or the download icon to stream output assets directly into your downloads file system as native extensions.`
      }
    ]
  };
});
