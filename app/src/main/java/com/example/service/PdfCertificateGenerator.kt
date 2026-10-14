package com.example.service

import android.content.Context
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import android.graphics.pdf.PdfDocument
import android.net.Uri
import androidx.core.content.FileProvider
import com.example.data.model.AcademySettings
import com.example.data.model.Certificate
import java.io.File
import java.io.FileOutputStream

class PdfCertificateGenerator(private val context: Context) {

    fun generateCertificatePdf(
        certificate: Certificate,
        settings: AcademySettings
    ): File {
        val pdfDocument = PdfDocument()
        val pageInfo = PdfDocument.PageInfo.Builder(842, 595, 1).create()
        val page = pdfDocument.startPage(pageInfo)
        val canvas = page.canvas

        val paint = Paint().apply { isAntiAlias = true }

        // Background
        paint.color = Color.rgb(253, 252, 248)
        canvas.drawRect(0f, 0f, 842f, 595f, paint)

        // Outer Dark Navy Border
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 12f
        paint.color = Color.rgb(6, 18, 36)
        canvas.drawRect(20f, 20f, 822f, 575f, paint)

        // Gold Accent Border
        paint.strokeWidth = 3f
        paint.color = Color.rgb(212, 175, 55)
        canvas.drawRect(28f, 28f, 814f, 567f, paint)

        paint.strokeWidth = 1f
        paint.color = Color.rgb(19, 42, 74)
        canvas.drawRect(33f, 33f, 809f, 562f, paint)

        paint.style = Paint.Style.FILL
        paint.color = Color.rgb(212, 175, 55)
        fun drawCornerFlourish(cx: Float, cy: Float) {
            canvas.drawCircle(cx, cy, 6f, paint)
        }
        drawCornerFlourish(40f, 40f)
        drawCornerFlourish(802f, 40f)
        drawCornerFlourish(40f, 555f)
        drawCornerFlourish(802f, 555f)

        paint.color = Color.argb(10, 6, 18, 36)
        paint.textSize = 72f
        paint.typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
        paint.textAlign = Paint.Align.CENTER
        canvas.drawText("AL GHAZI", 421f, 320f, paint)

        paint.color = Color.rgb(6, 18, 36)
        paint.textSize = 26f
        paint.typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
        canvas.drawText(settings.academyName.uppercase(), 421f, 85f, paint)

        paint.color = Color.rgb(212, 175, 55)
        paint.textSize = 11f
        paint.letterSpacing = 0.15f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        canvas.drawText(settings.tagline, 421f, 108f, paint)
        paint.letterSpacing = 0f

        paint.strokeWidth = 1.5f
        paint.color = Color.rgb(212, 175, 55)
        canvas.drawLine(250f, 120f, 592f, 120f, paint)

        paint.color = Color.rgb(19, 42, 74)
        paint.textSize = 28f
        paint.typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
        canvas.drawText("CERTIFICATE OF COMPLETION", 421f, 162f, paint)

        paint.color = Color.rgb(100, 116, 139)
        paint.textSize = 12f
        paint.typeface = Typeface.create(Typeface.SERIF, Typeface.ITALIC)
        canvas.drawText("This is proudly presented to", 421f, 196f, paint)

        paint.color = Color.rgb(6, 18, 36)
        paint.textSize = 30f
        paint.typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
        canvas.drawText(certificate.studentName, 421f, 240f, paint)

        paint.color = Color.rgb(212, 175, 55)
        paint.strokeWidth = 2f
        canvas.drawLine(240f, 248f, 602f, 248f, paint)

        paint.color = Color.rgb(71, 85, 105)
        paint.textSize = 12f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
        val fatherText = if (certificate.fatherName.isNotBlank()) "S/D of ${certificate.fatherName}  •  " else ""
        canvas.drawText("${fatherText}Registration No: ${certificate.studentRollNo}", 421f, 272f, paint)

        paint.color = Color.rgb(51, 65, 85)
        paint.textSize = 12.5f
        canvas.drawText("for successfully completing the specialized professional certification in", 421f, 305f, paint)

        paint.color = Color.rgb(212, 175, 55)
        paint.textSize = 22f
        paint.typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
        canvas.drawText(certificate.courseName, 421f, 342f, paint)

        paint.color = Color.rgb(30, 41, 59)
        paint.textSize = 11.5f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
        canvas.drawText(
            "Duration: ${certificate.duration}   |   Grade: ${certificate.grade}   |   Session: ${certificate.startDate} to ${certificate.completionDate}",
            421f,
            372f,
            paint
        )

        paint.color = Color.rgb(71, 85, 105)
        paint.textSize = 10f
        paint.typeface = Typeface.create(Typeface.SERIF, Typeface.ITALIC)
        canvas.drawText(certificate.customDescription, 421f, 400f, paint)

        val sealX = 421f
        val sealY = 475f
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 2.5f
        paint.color = Color.rgb(212, 175, 55)
        canvas.drawCircle(sealX, sealY, 26f, paint)
        paint.strokeWidth = 1f
        canvas.drawCircle(sealX, sealY, 22f, paint)
        paint.style = Paint.Style.FILL
        paint.textSize = 7f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        canvas.drawText("OFFICIAL", sealX, sealY - 4f, paint)
        canvas.drawText("SEAL", sealX, sealY + 6f, paint)

        val sigLineY = 480f
        paint.strokeWidth = 1.2f
        paint.color = Color.rgb(100, 116, 139)
        canvas.drawLine(100f, sigLineY, 260f, sigLineY, paint)

        paint.color = Color.rgb(15, 23, 42)
        paint.textSize = 10.5f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        canvas.drawText(certificate.teacherName, 180f, sigLineY + 16f, paint)
        paint.textSize = 9f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
        paint.color = Color.rgb(100, 116, 139)
        canvas.drawText("Course Instructor / Faculty", 180f, sigLineY + 30f, paint)

        canvas.drawLine(582f, sigLineY, 742f, sigLineY, paint)

        paint.color = Color.rgb(15, 23, 42)
        paint.textSize = 10.5f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        canvas.drawText(certificate.directorName, 662f, sigLineY + 16f, paint)
        paint.textSize = 9f
        paint.typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
        paint.color = Color.rgb(100, 116, 139)
        canvas.drawText("Director / Chairman", 662f, sigLineY + 30f, paint)

        paint.color = Color.rgb(148, 163, 184)
        paint.textSize = 8.5f
        paint.textAlign = Paint.Align.LEFT
        canvas.drawText("Certificate ID: ${certificate.certificateNo}", 42f, 546f, paint)
        paint.textAlign = Paint.Align.RIGHT
        canvas.drawText("Issue Date: ${certificate.issueDate}  |  ${settings.website}", 800f, 546f, paint)

        pdfDocument.finishPage(page)

        val outputDir = File(context.cacheDir, "certificates").apply { mkdirs() }
        val outputFile = File(outputDir, "Certificate_${certificate.certificateNo}.pdf")
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
