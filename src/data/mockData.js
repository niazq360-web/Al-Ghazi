export const initialSettings = {
  academyName: "Al Ghazi Digital Institute",
  tagline: "LEARN • PRACTICE • GROW",
  ownerName: "Prof. Al Ghazi",
  phoneNumber: "+92 300 1234567",
  whatsappNumber: "+92 300 1234567",
  email: "info@alghazi.edu.pk",
  address: "Main Campus, Al Ghazi Complex, Pakistan",
  website: "https://niazq360-web.github.io/Al-Ghazi/",
  currency: "PKR",
  currencySymbol: "Rs.",
  receiptPrefix: "REC-2026-",
  nextReceiptSeq: 104,
  certificatePrefix: "AG-CERT-2026-",
  nextCertSeq: 101,
  receiptFooterText: "Thank you for choosing Al Ghazi Digital Institute. Valid computer generated receipt."
};

export const initialCourses = [
  {
    id: 1,
    name: "Full Stack Web Development",
    code: "WD-101",
    duration: "6 Months",
    totalFee: 30000,
    monthlyFee: 5000,
    instructor: "Engr. Hamza Khan",
    timings: "10:00 AM - 12:00 PM",
    batch: "Batch-2026-A",
    studentsCount: 24,
    status: "Active"
  },
  {
    id: 2,
    name: "Graphic Design & UI/UX Masterclass",
    code: "GD-102",
    duration: "3 Months",
    totalFee: 18000,
    monthlyFee: 6000,
    instructor: "Ayesha Tariq",
    timings: "02:00 PM - 04:00 PM",
    batch: "Batch-2026-B",
    studentsCount: 18,
    status: "Active"
  },
  {
    id: 3,
    name: "Python Programming & AI Fundamentals",
    code: "PY-103",
    duration: "4 Months",
    totalFee: 24000,
    monthlyFee: 6000,
    instructor: "Dr. Zeeshan Ali",
    timings: "04:00 PM - 06:00 PM",
    batch: "Batch-2026-A",
    studentsCount: 15,
    status: "Active"
  },
  {
    id: 4,
    name: "Digital Marketing & Social Media Strategy",
    code: "DM-104",
    duration: "3 Months",
    totalFee: 15000,
    monthlyFee: 5000,
    instructor: "Bilal Rehman",
    timings: "06:00 PM - 08:00 PM",
    batch: "Batch-2026-C",
    studentsCount: 20,
    status: "Active"
  },
  {
    id: 5,
    name: "Office Automation & Computer Applications",
    code: "OA-105",
    duration: "2 Months",
    totalFee: 10000,
    monthlyFee: 5000,
    instructor: "Naveed Raza",
    timings: "09:00 AM - 10:30 AM",
    batch: "Batch-2026-D",
    studentsCount: 30,
    status: "Active"
  }
];

export const initialStudents = [
  {
    id: 1,
    rollNo: "AG-2026-0001",
    name: "Muhammad Ali",
    fatherName: "Tariq Mahmood",
    phone: "+92 301 2345678",
    parentPhone: "+92 300 9876543",
    email: "ali.tariq@gmail.com",
    courseId: 1,
    courseName: "Full Stack Web Development",
    batch: "Batch-2026-A",
    admissionDate: "2026-01-15",
    totalFee: 30000,
    paidFee: 20000,
    remainingFee: 10000,
    status: "Active",
    gender: "Male",
    city: "Karachi"
  },
  {
    id: 2,
    rollNo: "AG-2026-0002",
    name: "Fatima Noor",
    fatherName: "Noor Muhammad",
    phone: "+92 312 3456789",
    parentPhone: "+92 311 8765432",
    email: "fatima.noor@outlook.com",
    courseId: 2,
    courseName: "Graphic Design & UI/UX Masterclass",
    batch: "Batch-2026-B",
    admissionDate: "2026-01-20",
    totalFee: 18000,
    paidFee: 18000,
    remainingFee: 0,
    status: "Active",
    gender: "Female",
    city: "Lahore"
  },
  {
    id: 3,
    rollNo: "AG-2026-0003",
    name: "Usman Ghani",
    fatherName: "Abdul Ghani",
    phone: "+92 333 4567890",
    parentPhone: "+92 334 7654321",
    email: "usman.ghani@yahoo.com",
    courseId: 3,
    courseName: "Python Programming & AI Fundamentals",
    batch: "Batch-2026-A",
    admissionDate: "2026-02-01",
    totalFee: 24000,
    paidFee: 12000,
    remainingFee: 12000,
    status: "Active",
    gender: "Male",
    city: "Islamabad"
  },
  {
    id: 4,
    rollNo: "AG-2026-0004",
    name: "Zainab Bibi",
    fatherName: "Rashid Minhas",
    phone: "+92 345 5678901",
    parentPhone: "+92 346 6543210",
    email: "zainab.rashid@gmail.com",
    courseId: 4,
    courseName: "Digital Marketing & Social Media Strategy",
    batch: "Batch-2026-C",
    admissionDate: "2026-02-10",
    totalFee: 15000,
    paidFee: 15000,
    remainingFee: 0,
    status: "Active",
    gender: "Female",
    city: "Rawalpindi"
  },
  {
    id: 5,
    rollNo: "AG-2026-0005",
    name: "Ahmed Hassan",
    fatherName: "Hassan Raza",
    phone: "+92 302 6789012",
    parentPhone: "+92 303 5432109",
    email: "ahmed.hassan@gmail.com",
    courseId: 5,
    courseName: "Office Automation & Computer Applications",
    batch: "Batch-2026-D",
    admissionDate: "2026-02-15",
    totalFee: 10000,
    paidFee: 5000,
    remainingFee: 5000,
    status: "Active",
    gender: "Male",
    city: "Faisalabad"
  }
];

export const initialPayments = [
  {
    id: 1,
    receiptNo: "REC-2026-00101",
    studentId: 1,
    studentRollNo: "AG-2026-0001",
    studentName: "Muhammad Ali",
    courseName: "Full Stack Web Development",
    paidAmount: 10000,
    paymentDate: "2026-01-15",
    paymentMethod: "Cash",
    remarks: "1st Installment at admission",
    receivedBy: "Admin"
  },
  {
    id: 2,
    receiptNo: "REC-2026-00102",
    studentId: 2,
    studentRollNo: "AG-2026-0002",
    studentName: "Fatima Noor",
    courseName: "Graphic Design & UI/UX Masterclass",
    paidAmount: 18000,
    paymentDate: "2026-01-20",
    paymentMethod: "EasyPaisa",
    remarks: "Full fee paid with discount",
    receivedBy: "Admin"
  },
  {
    id: 3,
    receiptNo: "REC-2026-00103",
    studentId: 3,
    studentRollNo: "AG-2026-0003",
    studentName: "Usman Ghani",
    courseName: "Python Programming & AI Fundamentals",
    paidAmount: 12000,
    paymentDate: "2026-02-01",
    paymentMethod: "JazzCash",
    remarks: "Half fee installment",
    receivedBy: "Admin"
  }
];

export const initialExpenses = [
  {
    id: 1,
    title: "Campus Electric Bill",
    category: "Utilities",
    amount: 18500,
    date: "2026-02-05",
    paymentMethod: "Bank Transfer",
    paidTo: "K-Electric / WAPDA"
  },
  {
    id: 2,
    title: "Fiber Internet 100Mbps Bill",
    category: "Internet",
    amount: 6500,
    date: "2026-02-07",
    paymentMethod: "Online",
    paidTo: "StormFiber"
  },
  {
    id: 3,
    title: "Faculty Salaries - Jan",
    category: "Salaries",
    amount: 95000,
    date: "2026-02-01",
    paymentMethod: "Cash",
    paidTo: "Teachers Pool"
  },
  {
    id: 4,
    title: "Classroom Supplies & Thermal Paper",
    category: "Supplies",
    amount: 4500,
    date: "2026-02-12",
    paymentMethod: "Cash",
    paidTo: "Stationery Mart"
  }
];

export const initialTeachers = [
  {
    id: 1,
    name: "Engr. Hamza Khan",
    qualification: "MS Software Engineering",
    subject: "Full Stack Web Development",
    phone: "+92 300 7654321",
    salary: 50000,
    joiningDate: "2025-08-01"
  },
  {
    id: 2,
    name: "Ayesha Tariq",
    qualification: "BFA Visual Communication",
    subject: "Graphic Design & UI/UX",
    phone: "+92 321 8765432",
    salary: 45000,
    joiningDate: "2025-09-15"
  },
  {
    id: 3,
    name: "Dr. Zeeshan Ali",
    qualification: "Ph.D Computer Science",
    subject: "Python & Machine Learning",
    phone: "+92 345 9876543",
    salary: 60000,
    joiningDate: "2025-10-01"
  }
];
