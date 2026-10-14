package com.example.service

import android.content.Context
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import android.graphics.pdf.PdfDocument
import android.net.Uri
import androidx.core.content.FileProvider
import com.example.data.model.AcademySettings
import com.example.data.model.Course
import com.example.data.model.Expense
import com.example.data.model.FeePayment
import com.example.data.model.Student
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class PdfReportGenerator(private val context: Context) {

    fun generateFinancialReportPdf(
        settings: AcademySettings,
        totalCollected: Double,
        totalPending: Double,
        totalExpense: Double,
        totalSalary: Double,
        studentCount: Int,
        activeStudentCount: Int,
        recentPayments: List<FeePayment>,
        recentExpenses: List<Expense>
    ): File {
        val pdfDocument = PdfDocument()
        val pageInfo = PdfDocument.PageInfo.Builder(595, 842, 1).create()
        val page = pdfDocument.startPage(pageInfo)
        val canvas = page.canvas

        val paint = Paint().apply { isAntiAlias = true }

        // Background
        paint.color = Color.rgb(250, 252, 255)
        canvas.drawRect(0f, 0f, 595f, 842f, paint)

        // Navy Header Banner
        paint.color = Color.rgb(6, 18, 36)
        canvas.drawRect(20f, 20f, 575f, 100f, paint)

        // Header Title
        paint.color = Color.rgb(255, 215, 0)
        paint.textSize = 20f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        paint.textAlign = Paint.Align.CENTER
        canvas.drawText(settings.academyName, 297.5f, 55f, paint)

        // Tagline & Subtitle
        paint.color = Color.WHITE
        paint.textSize = 10f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
        canvas.drawText("${settings.tagline}  •  FINANCIAL & ACADEMIC AUDIT REPORT", 297.5f, 75f, paint)

        val dateStr = SimpleDateFormat("dd MMMM yyyy, hh:mm a", Locale.getDefault()).format(Date())
        paint.color = Color.rgb(200, 215, 235)
        paint.textSize = 8.5f
        canvas.drawText("Generated on: $dateStr", 297.5f, 90f, paint)

        val netBalance = totalCollected - totalExpense
        val kpiY = 120f
        val kpiWidth = 125f
        val kpiHeight = 55f

        fun drawKpiCard(x: Float, label: String, amountStr: String, accentColor: Int) {
            paint.color = Color.WHITE
            canvas.drawRect(x, kpiY, x + kpiWidth, kpiY + kpiHeight, paint)
            paint.color = accentColor
            paint.strokeWidth = 3f
            canvas.drawLine(x, kpiY, x + kpiWidth, kpiY, paint)

            paint.color = Color.rgb(100, 116, 139)
            paint.textSize = 8.5f
            paint.textAlign = Paint.Align.LEFT
            paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            canvas.drawText(label, x + 8f, kpiY + 18f, paint)

            paint.color = Color.rgb(15, 23, 42)
            paint.textSize = 11f
            canvas.drawText(amountStr, x + 8f, kpiY + 40f, paint)
        }

        drawKpiCard(30f, "TOTAL COLLECTED", "Rs. ${String.format(Locale.US, "%,.0f", totalCollected)}", Color.rgb(16, 185, 129))
        drawKpiCard(165f, "PENDING FEES", "Rs. ${String.format(Locale.US, "%,.0f", totalPending)}", Color.rgb(239, 68, 68))
        drawKpiCard(300f, "TOTAL EXPENSES", "Rs. ${String.format(Locale.US, "%,.0f", totalExpense)}", Color.rgb(245, 158, 11))
        drawKpiCard(435f, "NET BALANCE", "Rs. ${String.format(Locale.US, "%,.0f", netBalance)}", Color.rgb(59, 130, 246))

        val enrY = 195f
        paint.color = Color.rgb(241, 245, 249)
        canvas.drawRect(30f, enrY, 565f, enrY + 28f, paint)
        paint.color = Color.rgb(30, 41, 59)
        paint.textSize = 9.5f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        canvas.drawText("Enrollment Metrics:  Total Students: $studentCount   |   Active Students: $activeStudentCount   |   Salaries Disbursed: Rs. ${String.format(Locale.US, "%,.0f", totalSalary)}", 40f, enrY + 18f, paint)

        var curY = 250f
        paint.color = Color.rgb(6, 18, 36)
        paint.textSize = 12f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        canvas.drawText("RECENT FEE COLLECTIONS (AUDIT TRAIL)", 30f, curY, paint)

        curY += 10f
        paint.color = Color.rgb(19, 42, 74)
        canvas.drawRect(30f, curY, 565f, curY + 20f, paint)
        paint.color = Color.rgb(255, 215, 0)
        paint.textSize = 8.5f
        paint.textAlign = Paint.Align.LEFT
        canvas.drawText("RECEIPT NO", 38f, curY + 14f, paint)
        canvas.drawText("STUDENT NAME", 130f, curY + 14f, paint)
        canvas.drawText("COURSE", 270f, curY + 14f, paint)
        canvas.drawText("METHOD", 420f, curY + 14f, paint)
        paint.textAlign = Paint.Align.RIGHT
        canvas.drawText("AMOUNT", 555f, curY + 14f, paint)

        curY += 20f
        paint.color = Color.rgb(51, 65, 85)
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
        val pList = recentPayments.take(8)
        if (pList.isEmpty()) {
            curY += 18f
            paint.textAlign = Paint.Align.LEFT
            canvas.drawText("No fee payments recorded yet.", 38f, curY, paint)
        } else {
            pList.forEach { p ->
                curY += 18f
                paint.textAlign = Paint.Align.LEFT
                canvas.drawText(p.receiptNo, 38f, curY, paint)
                canvas.drawText(p.studentName.take(18), 130f, curY, paint)
                canvas.drawText(p.courseName.take(18), 270f, curY, paint)
                canvas.drawText(p.paymentMethod, 420f, curY, paint)
                paint.textAlign = Paint.Align.RIGHT
                canvas.drawText("Rs. ${String.format(Locale.US, "%,.0f", p.paidAmount)}", 555f, curY, paint)

                paint.color = Color.rgb(226, 232, 240)
                paint.strokeWidth = 0.5f
                canvas.drawLine(30f, curY + 4f, 565f, curY + 4f, paint)
                paint.color = Color.rgb(51, 65, 85)
            }
        }

        curY += 30f
        paint.color = Color.rgb(6, 18, 36)
        paint.textSize = 12f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        paint.textAlign = Paint.Align.LEFT
        canvas.drawText("RECENT OPERATING EXPENSES", 30f, curY, paint)

        curY += 10f
        paint.color = Color.rgb(19, 42, 74)
        canvas.drawRect(30f, curY, 565f, curY + 20f, paint)
        paint.color = Color.rgb(255, 215, 0)
        paint.textSize = 8.5f
        paint.textAlign = Paint.Align.LEFT
        canvas.drawText("EXPENSE NO", 38f, curY + 14f, paint)
        canvas.drawText("TITLE / DESCRIPTION", 130f, curY + 14f, paint)
        canvas.drawText("CATEGORY", 330f, curY + 14f, paint)
        canvas.drawText("PAID TO", 440f, curY + 14f, paint)
        paint.textAlign = Paint.Align.RIGHT
        canvas.drawText("AMOUNT", 555f, curY + 14f, paint)

        curY += 20f
        paint.color = Color.rgb(51, 65, 85)
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
        val eList = recentExpenses.take(8)
        if (eList.isEmpty()) {
            curY += 18f
            paint.textAlign = Paint.Align.LEFT
            canvas.drawText("No expenses recorded yet.", 38f, curY, paint)
        } else {
            eList.forEach { e ->
                curY += 18f
                paint.textAlign = Paint.Align.LEFT
                canvas.drawText(e.expenseNo, 38f, curY, paint)
                canvas.drawText(e.title.take(22), 130f, curY, paint)
                canvas.drawText(e.category.take(16), 330f, curY, paint)
                canvas.drawText(e.paidTo.take(14), 440f, curY, paint)
                paint.textAlign = Paint.Align.RIGHT
                canvas.drawText("Rs. ${String.format(Locale.US, "%,.0f", e.amount)}", 555f, curY, paint)

                paint.color = Color.rgb(226, 232, 240)
                paint.strokeWidth = 0.5f
                canvas.drawLine(30f, curY + 4f, 565f, curY + 4f, paint)
                paint.color = Color.rgb(51, 65, 85)
            }
        }

        val sigY = 760f
        paint.strokeWidth = 1f
        paint.color = Color.rgb(100, 116, 139)
        canvas.drawLine(50f, sigY, 200f, sigY, paint)
        canvas.drawLine(395f, sigY, 545f, sigY, paint)

        paint.textAlign = Paint.Align.CENTER
        paint.textSize = 8.5f
        canvas.drawText("Accountant / Bursar", 125f, sigY + 14f, paint)
        canvas.drawText("Director / Auditor Stamp", 470f, sigY + 14f, paint)

        paint.color = Color.rgb(100, 116, 139)
        paint.textSize = 7.5f
        canvas.drawText("Generated by ${settings.academyName} Management System  •  ${settings.website}", 297.5f, 810f, paint)

        pdfDocument.finishPage(page)

        val outputDir = File(context.cacheDir, "reports").apply { mkdirs() }
        val outputFile = File(outputDir, "Report_${System.currentTimeMillis()}.pdf")
        val outputStream = FileOutputStream(outputFile)
        pdfDocument.writeTo(outputStream)
        outputStream.flush()
        outputStream.close()
        pdfDocument.close()

        return outputFile
    }

    fun getShareUri(file: File): Uri {
        return FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file)
    }

    fun generateComprehensiveReport(
        settings: AcademySettings,
        totalRevenue: Double,
        totalExpenses: Double,
        totalSalaries: Double,
        pendingFees: Double,
        studentCount: Int,
        activeStudents: Int,
        courses: List<Course>,
        students: List<Student>
    ): Uri {
        val file = generateFinancialReportPdf(
            settings = settings,
            totalCollected = totalRevenue,
            totalPending = pendingFees,
            totalExpense = totalExpenses,
            totalSalary = totalSalaries,
            studentCount = studentCount,
            activeStudentCount = activeStudents,
            recentPayments = emptyList(),
            recentExpenses = emptyList()
        )
        return getShareUri(file)
    }
}
