export const initialSettings = {
  academyName: "Al Ghazi Digital Institute",
  tagline: "LEARN • PRACTICE • GROW",
  principalName: "Prof. Al Ghazi",
  directorName: "Engr. Niaz Qasim",
  registrationNumber: "REG-2024-AGDI-8921",
  academicSession: "2026-2027",
  phoneNumber: "+92 300 1234567",
  whatsappNumber: "+92 300 1234567",
  email: "info@alghazi.edu.pk",
  website: "http://alghazidigital.site.je/",
  address: "Main Campus, Al Ghazi Complex, Education Corridor",
  city: "Lahore, Pakistan",
  currency: "PKR",
  currencySymbol: "Rs.",
  receiptPrefix: "REC-2026-",
  nextReceiptSeq: 1,
  certificatePrefix: "AG-CERT-2026-",
  nextCertSeq: 1,
  smsSenderName: "AL-GHAZI",
  primaryColor: "#2563eb",
  secondaryColor: "#f59e0b",
  dualReceipt: true, // Print Institute Copy + Student Copy
  receiptFooterText: "Thank you for choosing Al Ghazi Digital Institute. Valid computer generated receipt. Fees once paid are non-refundable.",
  logoUrl: "", // base64 or URL
  officialSealUrl: "", // base64 or custom seal URL
  isConfigured: true
};

export const initialCourses = [
  {
    id: 1,
    name: "Full Stack Web Development (MERN)",
    code: "WD-101",
    duration: "6 Months",
    totalFee: 30000,
    monthlyFee: 5000,
    admissionFee: 2000,
    instructor: "Head of Computing",
    timings: "10:00 AM - 12:00 PM",
    batch: "Morning Shift (A)",
    studentsCount: 0,
    status: "Active",
    syllabus: "HTML5, CSS3, Tailwind, JavaScript ES6+, React, Node.js, Express, MongoDB, Git, Deployment"
  },
  {
    id: 2,
    name: "Graphic Design & UI/UX Masterclass",
    code: "GD-102",
    duration: "3 Months",
    totalFee: 18000,
    monthlyFee: 6000,
    admissionFee: 1500,
    instructor: "Faculty of Design",
    timings: "02:00 PM - 04:00 PM",
    batch: "Afternoon Shift (B)",
    studentsCount: 0,
    status: "Active",
    syllabus: "Adobe Photoshop, Illustrator, Figma, UI/UX Wireframing, Branding, Portfolio Design"
  },
  {
    id: 3,
    name: "Python Programming & AI Fundamentals",
    code: "PY-103",
    duration: "4 Months",
    totalFee: 24000,
    monthlyFee: 6000,
    admissionFee: 2000,
    instructor: "Faculty of AI",
    timings: "04:00 PM - 06:00 PM",
    batch: "Evening Shift (A)",
    studentsCount: 0,
    status: "Active",
    syllabus: "Python Syntax, OOP, Data Structures, Pandas, NumPy, Machine Learning Intro, OpenCV"
  },
  {
    id: 4,
    name: "Digital Marketing & Social Media Strategy",
    code: "DM-104",
    duration: "3 Months",
    totalFee: 15000,
    monthlyFee: 5000,
    admissionFee: 1500,
    instructor: "Faculty of Marketing",
    timings: "11:00 AM - 01:00 PM",
    batch: "Morning Shift (B)",
    studentsCount: 0,
    status: "Active",
    syllabus: "SEO, Google Ads, Meta Ads, Content Creation, Analytics, Email Marketing, Freelancing"
  },
  {
    id: 5,
    name: "Office Automation & IT Applications",
    code: "OA-105",
    duration: "2 Months",
    totalFee: 10000,
    monthlyFee: 5000,
    admissionFee: 1000,
    instructor: "Faculty of IT",
    timings: "09:00 AM - 10:30 AM",
    batch: "Morning Shift (C)",
    studentsCount: 0,
    status: "Active",
    syllabus: "MS Word, MS Excel Advanced, MS PowerPoint, InPage Urdu, Internet Research, Typing Speed"
  }
];

// Clean initial states: students, teachers, fees/payments, expenses, exam results, certificates are 100% empty
export const initialStudents = [];
export const initialTeachers = [];
export const initialPayments = [];
export const initialExpenses = [];
export const initialExams = [];
export const initialExamResults = [];
export const initialCertificates = [];
export const initialInquiries = [];
