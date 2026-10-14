package com.example.service

import android.content.Context
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import android.graphics.pdf.PdfDocument
import android.net.Uri
import androidx.core.content.FileProvider
import com.example.data.model.AcademySettings
import com.example.data.model.FeePayment
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class PdfReceiptGenerator(private val context: Context) {

    fun generateReceiptPdf(
        payment: FeePayment,
        settings: AcademySettings
    ): File {
        val pdfDocument = PdfDocument()
        val pageInfo = PdfDocument.PageInfo.Builder(420, 595, 1).create()
        val page = pdfDocument.startPage(pageInfo)
        val canvas = page.canvas

        val paint = Paint().apply { isAntiAlias = true }

        // Background
        paint.color = Color.rgb(250, 252, 255)
        canvas.drawRect(0f, 0f, 420f, 595f, paint)

        // Navy Header Banner
        paint.color = Color.rgb(6, 18, 36)
        canvas.drawRect(15f, 15f, 405f, 100f, paint)

        // Gold Trim inside Banner
        paint.color = Color.rgb(212, 175, 55)
        paint.strokeWidth = 2f
        paint.style = Paint.Style.STROKE
        canvas.drawRect(18f, 18f, 402f, 97f, paint)
        paint.style = Paint.Style.FILL

        // Header Title
        paint.color = Color.rgb(255, 215, 0)
        paint.textSize = 18f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        paint.textAlign = Paint.Align.CENTER
        canvas.drawText(settings.academyName, 210f, 48f, paint)

        // Tagline
        paint.color = Color.WHITE
        paint.textSize = 10f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
        canvas.drawText(settings.tagline, 210f, 66f, paint)

        // Contact info
        paint.color = Color.rgb(200, 210, 225)
        paint.textSize = 8.5f
        canvas.drawText("${settings.phoneNumber} | ${settings.email}", 210f, 84f, paint)

        // Watermark in center
        paint.color = Color.argb(12, 6, 18, 36)
        paint.textSize = 42f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        canvas.drawText("AL GHAZI", 210f, 320f, paint)

        // Receipt Title
        paint.color = Color.rgb(6, 18, 36)
        paint.textSize = 14f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        canvas.drawText("FEE PAYMENT RECEIPT", 210f, 126f, paint)

        paint.textAlign = Paint.Align.LEFT
        paint.textSize = 9.5f
        paint.color = Color.rgb(50, 60, 75)
        val dateFormat = SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault())
        val dateStr = dateFormat.format(Date(payment.paymentDate))

        canvas.drawText("Receipt No: ${payment.receiptNo}", 25f, 150f, paint)
        paint.textAlign = Paint.Align.RIGHT
        canvas.drawText("Date: $dateStr", 395f, 150f, paint)

        paint.color = Color.rgb(212, 175, 55)
        paint.strokeWidth = 1.5f
        canvas.drawLine(25f, 158f, 395f, 158f, paint)

        paint.color = Color.rgb(240, 244, 250)
        canvas.drawRect(25f, 168f, 395f, 230f, paint)

        paint.color = Color.rgb(15, 23, 42)
        paint.textAlign = Paint.Align.LEFT
        paint.textSize = 10f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        canvas.drawText("Student Name: ${payment.studentName}", 35f, 188f, paint)
        canvas.drawText("Course: ${payment.courseName}", 35f, 214f, paint)

        paint.textAlign = Paint.Align.RIGHT
        canvas.drawText("Roll No: ${payment.studentRollNo}", 385f, 188f, paint)
        canvas.drawText("Father Name: ${payment.fatherName}", 385f, 214f, paint)

        paint.color = Color.rgb(6, 18, 36)
        canvas.drawRect(25f, 245f, 395f, 270f, paint)
        paint.color = Color.rgb(255, 215, 0)
        paint.textAlign = Paint.Align.LEFT
        paint.textSize = 10f
        canvas.drawText("FEE PARTICULARS", 35f, 262f, paint)
        paint.textAlign = Paint.Align.RIGHT
        canvas.drawText("AMOUNT (PKR)", 385f, 262f, paint)

        var currentY = 290f
        paint.color = Color.rgb(30, 41, 59)
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)

        fun drawTableRow(label: String, value: String, isBold: Boolean = false, isHighlight: Boolean = false) {
            if (isHighlight) {
                val bgPaint = Paint().apply { color = Color.rgb(238, 242, 255) }
                canvas.drawRect(25f, currentY - 14f, 395f, currentY + 6f, bgPaint)
            }
            paint.typeface = if (isBold) Typeface.create(Typeface.DEFAULT, Typeface.BOLD) else Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
            paint.textAlign = Paint.Align.LEFT
            canvas.drawText(label, 35f, currentY, paint)
            paint.textAlign = Paint.Align.RIGHT
            canvas.drawText(value, 385f, currentY, paint)

            paint.color = Color.rgb(226, 232, 240)
            paint.strokeWidth = 0.8f
            canvas.drawLine(25f, currentY + 7f, 395f, currentY + 7f, paint)
            paint.color = Color.rgb(30, 41, 59)
            currentY += 24f
        }

        drawTableRow("Total Course Fee", "Rs. ${String.format(Locale.US, "%,.2f", payment.totalFee)}")
        drawTableRow("Previously Paid", "Rs. ${String.format(Locale.US, "%,.2f", payment.previousPaid)}")
        drawTableRow("Paid Amount (Current)", "Rs. ${String.format(Locale.US, "%,.2f", payment.paidAmount)}", isBold = true, isHighlight = true)
        drawTableRow("Total Paid to Date", "Rs. ${String.format(Locale.US, "%,.2f", payment.newTotalPaid)}")
        drawTableRow("Remaining Balance", "Rs. ${String.format(Locale.US, "%,.2f", payment.remainingFee)}", isBold = true)

        currentY += 10f
        paint.textAlign = Paint.Align.LEFT
        paint.textSize = 9f
        paint.color = Color.rgb(71, 85, 105)
        canvas.drawText("Payment Method: ${payment.paymentMethod}  |  Remarks: ${payment.remarks}", 25f, currentY, paint)
        currentY += 16f
        canvas.drawText("Received By: ${payment.receivedBy}", 25f, currentY, paint)

        val sigY = 510f
        paint.strokeWidth = 1f
        paint.color = Color.rgb(100, 116, 139)
        canvas.drawLine(40f, sigY, 150f, sigY, paint)
        canvas.drawLine(270f, sigY, 380f, sigY, paint)

        paint.textAlign = Paint.Align.CENTER
        paint.textSize = 8.5f
        canvas.drawText("Student / Depositor", 95f, sigY + 14f, paint)
        canvas.drawText("Authorized Cashier Stamp", 325f, sigY + 14f, paint)

        paint.color = Color.rgb(100, 116, 139)
        paint.textSize = 8f
        canvas.drawText(settings.receiptFooterText, 210f, 560f, paint)
        canvas.drawText(settings.address, 210f, 574f, paint)

        pdfDocument.finishPage(page)

        val outputDir = File(context.cacheDir, "receipts").apply { mkdirs() }
        val outputFile = File(outputDir, "Receipt_${payment.receiptNo}.pdf")
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
}
