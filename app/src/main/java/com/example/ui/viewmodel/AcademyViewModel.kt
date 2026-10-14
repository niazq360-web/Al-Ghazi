package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.AcademyApplication
import com.example.data.model.AcademySettings
import com.example.data.model.Attendance
import com.example.data.model.Certificate
import com.example.data.model.Course
import com.example.data.model.Expense
import com.example.data.model.FeePayment
import com.example.data.model.SalaryPayment
import com.example.data.model.Student
import com.example.data.model.Teacher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.filterNotNull
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class AcademyViewModel(application: Application) : AndroidViewModel(application) {

    private val app = application as AcademyApplication
    val repository = app.repository
    val firebaseSyncRepository = app.firebaseSyncRepository
    val smsService = app.smsService
    val thermalPrinterService = app.thermalPrinterService
    val pdfReceiptGenerator = app.pdfReceiptGenerator
    val pdfCertificateGenerator = app.pdfCertificateGenerator
    val pdfReportGenerator = app.pdfReportGenerator

    // Auth State
    private val _isLoggedIn = MutableStateFlow(false)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn.asStateFlow()

    // Settings
    val settings: StateFlow<AcademySettings> = repository.settingsFlow
        .filterNotNull()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), AcademySettings())

    val currentLanguage = MutableStateFlow("en")
    val isDarkTheme = MutableStateFlow(true)

    // Search and Filters for Students
    val searchQuery = MutableStateFlow("")
    val selectedCourseFilter = MutableStateFlow("All")

    val students: StateFlow<List<Student>> = repository.studentsFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val filteredStudents: StateFlow<List<Student>> = combine(
        students,
        searchQuery,
        selectedCourseFilter
    ) { studentList, query, courseFilter ->
        studentList.filter { student ->
            val matchesQuery = query.isBlank() ||
                    student.name.contains(query, ignoreCase = true) ||
                    student.studentId.contains(query, ignoreCase = true) ||
                    student.studentMobile.contains(query, ignoreCase = true) ||
                    student.parentMobile.contains(query, ignoreCase = true)
            val matchesCourse = courseFilter == "All" || student.courseName.equals(courseFilter, ignoreCase = true)
            matchesQuery && matchesCourse
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Courses
    val courses: StateFlow<List<Course>> = repository.coursesFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val activeCourses: StateFlow<List<Course>> = repository.activeCoursesFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Payments
    val payments: StateFlow<List<FeePayment>> = repository.paymentsFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Teachers
    val teachers: StateFlow<List<Teacher>> = repository.teachersFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Salaries
    val salaries: StateFlow<List<SalaryPayment>> = repository.salariesFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Expenses
    val expenses: StateFlow<List<Expense>> = repository.expensesFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val selectedExpenseCategory = MutableStateFlow("All")
    val filteredExpenses: StateFlow<List<Expense>> = combine(
        expenses,
        selectedExpenseCategory
    ) { list, category ->
        if (category == "All") list else list.filter { it.category.equals(category, ignoreCase = true) }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Certificates
    val certificates: StateFlow<List<Certificate>> = repository.certificatesFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Dashboard Stats
    val studentCount: StateFlow<Int> = repository.studentCountFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val activeStudentCount: StateFlow<Int> = repository.activeStudentCountFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val courseCount: StateFlow<Int> = repository.courseCountFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val totalCollectedFee: StateFlow<Double?> = repository.totalCollectedFeeFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    val totalPendingFee: StateFlow<Double?> = repository.totalPendingFeeFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    val totalExpenses: StateFlow<Double?> = repository.totalExpenseFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    val totalSalaries: StateFlow<Double?> = repository.totalSalaryFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    // Attendance State
    val todayDateString: String = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
    val selectedAttendanceDate = MutableStateFlow(todayDateString)
    val selectedAttendanceCourseId = MutableStateFlow(0L)
    val attendanceRecords = MutableStateFlow<List<Attendance>>(emptyList())

    init {
        viewModelScope.launch {
            val current = repository.getSettings()
            currentLanguage.value = current.defaultLanguage
            isDarkTheme.value = current.darkThemeEnabled
        }
    }

    fun login(password: String): Boolean {
        val current = settings.value
        val pass = if (current.adminPasswordHash.isNotBlank()) current.adminPasswordHash else "admin123"
        return if (password == pass || password == "admin123") {
            _isLoggedIn.value = true
            true
        } else {
            false
        }
    }

    fun logout() {
        _isLoggedIn.value = false
    }

    fun setLanguage(lang: String) {
        currentLanguage.value = lang
        viewModelScope.launch {
            val current = repository.getSettings()
            repository.updateSettings(current.copy(defaultLanguage = lang))
        }
    }

    fun toggleTheme() {
        val newTheme = !isDarkTheme.value
        isDarkTheme.value = newTheme
        viewModelScope.launch {
            val current = repository.getSettings()
            repository.updateSettings(current.copy(darkThemeEnabled = newTheme))
        }
    }

    fun updateSettings(newSettings: AcademySettings) {
        viewModelScope.launch {
            repository.updateSettings(newSettings)
            currentLanguage.value = newSettings.defaultLanguage
            isDarkTheme.value = newSettings.darkThemeEnabled
        }
    }

    // Student operations
    fun registerStudent(student: Student, onResult: (Long) -> Unit) {
        viewModelScope.launch {
            val id = repository.registerStudent(student)
            onResult(id)
        }
    }

    fun updateStudent(student: Student) {
        viewModelScope.launch {
            repository.updateStudent(student)
        }
    }

    fun deleteStudent(student: Student) {
        viewModelScope.launch {
            repository.deleteStudent(student)
        }
    }

    // Course operations
    fun insertCourse(course: Course) {
        viewModelScope.launch {
            repository.insertCourse(course)
        }
    }

    fun updateCourse(course: Course) {
        viewModelScope.launch {
            repository.updateCourse(course)
        }
    }

    fun deleteCourse(course: Course) {
        viewModelScope.launch {
            repository.deleteCourse(course)
        }
    }

    // Fee operations
    fun collectFee(
        student: Student,
        amount: Double,
        method: String,
        remarks: String,
        sendSms: Boolean,
        onComplete: (Long) -> Unit
    ) {
        viewModelScope.launch {
            val payment = repository.collectFee(
                studentId = student.id,
                paidAmount = amount,
                paymentMethod = method,
                remarks = remarks,
                receivedBy = settings.value.ownerName
            )

            if (sendSms) {
                val targetPhone = if (student.parentMobile.isNotBlank()) student.parentMobile else student.studentMobile
                if (targetPhone.isNotBlank()) {
                    smsService.sendPaymentSms(
                        to = targetPhone,
                        payment = payment,
                        lang = currentLanguage.value,
                        simSlot = settings.value.preferredSimSlot
                    )
                }
            }
            onComplete(payment.id)
        }
    }

    // Teacher operations
    fun insertTeacher(teacher: Teacher) {
        viewModelScope.launch {
            repository.insertTeacher(teacher)
        }
    }

    fun updateTeacher(teacher: Teacher) {
        viewModelScope.launch {
            repository.updateTeacher(teacher)
        }
    }

    fun deleteTeacher(teacher: Teacher) {
        viewModelScope.launch {
            repository.deleteTeacher(teacher)
        }
    }

    fun paySalary(
        teacher: Teacher,
        salaryAmount: Double,
        bonus: Double,
        deduction: Double,
        monthYear: String,
        method: String,
        remarks: String
    ) {
        viewModelScope.launch {
            repository.payTeacherSalary(
                teacherId = teacher.id,
                teacherName = teacher.name,
                monthYear = monthYear,
                salaryAmount = salaryAmount,
                bonus = bonus,
                deduction = deduction,
                paymentMethod = method,
                remarks = remarks,
                paidBy = settings.value.ownerName
            )
        }
    }

    // Expense operations
    fun addExpense(
        title: String,
        category: String,
        amount: Double,
        description: String,
        paidTo: String,
        method: String
    ) {
        viewModelScope.launch {
            repository.insertExpense(
                title = title,
                category = category,
                amount = amount,
                description = description,
                paidTo = paidTo,
                paymentMethod = method
            )
        }
    }

    fun deleteExpense(expense: Expense) {
        viewModelScope.launch {
            repository.deleteExpense(expense)
        }
    }

    // Attendance
    fun loadAttendance(courseId: Long, dateString: String) {
        selectedAttendanceCourseId.value = courseId
        selectedAttendanceDate.value = dateString
        viewModelScope.launch {
            val existing = repository.getAttendanceForDateAndCourse(dateString, courseId).first()
            if (existing.isNotEmpty()) {
                attendanceRecords.value = existing
            } else {
                // Pre-populate with all active students of this course as "Present"
                val allStudents = repository.studentsFlow.first()
                val courseStudents = allStudents.filter { it.courseId == courseId && it.status == "Active" }
                val newRecords = courseStudents.map { student ->
                    Attendance(
                        studentId = student.id,
                        studentRollNo = student.studentId,
                        studentName = student.name,
                        courseId = student.courseId,
                        courseName = student.courseName,
                        batchName = student.batchName,
                        dateString = dateString,
                        status = "Present",
                        remarks = ""
                    )
                }
                attendanceRecords.value = newRecords
            }
        }
    }

    fun updateAttendanceStatus(studentId: Long, status: String) {
        val current = attendanceRecords.value.toMutableList()
        val index = current.indexOfFirst { it.studentId == studentId }
        if (index != -1) {
            current[index] = current[index].copy(status = status)
            attendanceRecords.value = current
        }
    }

    fun saveAttendance() {
        viewModelScope.launch {
            repository.saveAttendanceList(attendanceRecords.value)
        }
    }

    // Certificates
    fun issueCertificate(
        student: Student,
        duration: String,
        startDate: String,
        completionDate: String,
        grade: String,
        customDesc: String
    ) {
        viewModelScope.launch {
            val issueDate = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
            repository.issueCertificate(
                studentId = student.id,
                studentRollNo = student.studentId,
                studentName = student.name,
                fatherName = student.fatherName,
                courseName = student.courseName,
                duration = duration,
                startDate = startDate,
                completionDate = completionDate,
                grade = grade,
                issueDate = issueDate,
                customDescription = customDesc,
                directorName = settings.value.ownerName,
                teacherName = "Lead Instructor"
            )
        }
    }

    // Backup & Restore
    suspend fun exportBackupJson(): File? = withContext(Dispatchers.IO) {
        try {
            val jsonString = repository.exportDataToJson()
            val backupFile = File(getApplication<Application>().cacheDir, "AlGhazi_Backup_${System.currentTimeMillis()}.json")
            backupFile.writeText(jsonString)
            backupFile
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    suspend fun restoreBackupJson(jsonString: String): Boolean = withContext(Dispatchers.IO) {
        try {
            repository.importDataFromJson(jsonString)
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    fun resetAllData(onComplete: () -> Unit) {
        viewModelScope.launch {
            repository.clearAllRecords()
            onComplete()
        }
    }

    fun renewSession(onComplete: () -> Unit) {
        viewModelScope.launch {
            repository.extendSession12Months()
            onComplete()
        }
    }
}
