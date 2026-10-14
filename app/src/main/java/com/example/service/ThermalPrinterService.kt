package com.example.service

import android.Manifest
import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothSocket
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat
import com.example.data.model.AcademySettings
import com.example.data.model.FeePayment
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream
import java.io.OutputStream
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

class ThermalPrinterService(private val context: Context) {

    private val sppUuid: UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB")

    fun hasBluetoothPermission(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            ContextCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT) == PackageManager.PERMISSION_GRANTED
        } else {
            ContextCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH) == PackageManager.PERMISSION_GRANTED
        }
    }

    @SuppressLint("MissingPermission")
    fun getPairedDevices(): List<BluetoothDevice> {
        if (!hasBluetoothPermission()) return emptyList()
        val adapter = BluetoothAdapter.getDefaultAdapter() ?: return emptyList()
        return try {
            adapter.bondedDevices?.toList() ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }

    @SuppressLint("MissingPermission")
    suspend fun printReceipt(
        device: BluetoothDevice,
        payment: FeePayment,
        settings: AcademySettings
    ): Boolean = withContext(Dispatchers.IO) {
        if (!hasBluetoothPermission()) return@withContext false

        var socket: BluetoothSocket? = null
        var outputStream: OutputStream? = null
        try {
            socket = device.createRfcommSocketToServiceRecord(sppUuid)
            socket.connect()
            outputStream = socket.outputStream

            val data = buildEscPosReceipt(payment, settings)
            outputStream.write(data)
            outputStream.flush()
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        } finally {
            try { outputStream?.close() } catch (ignored: Exception) {}
            try { socket?.close() } catch (ignored: Exception) {}
        }
    }

    private fun buildEscPosReceipt(payment: FeePayment, settings: AcademySettings): ByteArray {
        val stream = ByteArrayOutputStream()
        val is80mm = settings.printerPaperWidth == "80mm"
        val lineCharCount = if (is80mm) 48 else 32

        fun write(bytes: ByteArray) = stream.write(bytes)
        fun writeText(text: String) = stream.write(text.toByteArray(Charsets.UTF_8))
        fun line(text: String) = writeText("$text\n")

        val escInit = byteArrayOf(0x1B, 0x40)
        val escAlignLeft = byteArrayOf(0x1B, 0x61, 0x00)
        val escAlignCenter = byteArrayOf(0x1B, 0x61, 0x01)
        val escBoldOn = byteArrayOf(0x1B, 0x45, 0x01)
        val escBoldOff = byteArrayOf(0x1B, 0x45, 0x00)
        val escDoubleHeight = byteArrayOf(0x1D, 0x21, 0x01)
        val escNormal = byteArrayOf(0x1D, 0x21, 0x00)
        val escFeedCut = byteArrayOf(0x1D, 0x56, 0x41, 0x10)

        write(escInit)

        write(escAlignCenter)
        write(escBoldOn)
        write(escDoubleHeight)
        line(settings.academyName)
        write(escNormal)
        write(escBoldOff)
        line(settings.tagline)
        line(settings.phoneNumber)
        line("-".repeat(lineCharCount))

        write(escBoldOn)
        line("FEE RECEIPT")
        write(escBoldOff)
        line("-".repeat(lineCharCount))

        write(escAlignLeft)
        val dateStr = SimpleDateFormat("dd-MM-yyyy hh:mm a", Locale.getDefault()).format(Date(payment.paymentDate))
        line("Receipt #: ${payment.receiptNo}")
        line("Date:      $dateStr")
        line("Roll #:    ${payment.studentRollNo}")
        line("Student:   ${payment.studentName}")
        if (payment.fatherName.isNotBlank()) {
            line("Father:    ${payment.fatherName}")
        }
        line("Course:    ${payment.courseName}")
        line("-".repeat(lineCharCount))

        fun printRow(left: String, right: String) {
            val spaceNeeded = lineCharCount - left.length - right.length
            if (spaceNeeded > 0) {
                line(left + " ".repeat(spaceNeeded) + right)
            } else {
                line("$left: $right")
            }
        }

        printRow("Course Total:", "Rs. ${String.format(Locale.US, "%,.0f", payment.totalFee)}")
        printRow("Previous Paid:", "Rs. ${String.format(Locale.US, "%,.0f", payment.previousPaid)}")
        write(escBoldOn)
        printRow("NOW PAID:", "Rs. ${String.format(Locale.US, "%,.0f", payment.paidAmount)}")
        printRow("Total Paid:", "Rs. ${String.format(Locale.US, "%,.0f", payment.newTotalPaid)}")
        printRow("Remaining:", "Rs. ${String.format(Locale.US, "%,.0f", payment.remainingFee)}")
        write(escBoldOff)
        line("-".repeat(lineCharCount))

        line("Method:   ${payment.paymentMethod}")
        line("Cashier:  ${payment.receivedBy}")
        if (payment.remarks.isNotBlank()) {
            line("Remarks:  ${payment.remarks}")
        }
        line("=".repeat(lineCharCount))

        write(escAlignCenter)
        line(settings.receiptFooterText)
        line(settings.website)
        line("\n\n")

        write(escFeedCut)

        return stream.toByteArray()
    }

    suspend fun printReceipt(payment: FeePayment, settings: AcademySettings): String {
        if (!hasBluetoothPermission()) return "Bluetooth permission required for thermal printing"
        val paired = getPairedDevices()
        if (paired.isEmpty()) return "No paired Bluetooth printer found. Please pair in Android Settings."
        val success = printReceipt(paired.first(), payment, settings)
        return if (success) "Receipt printed on ${paired.first().name ?: "Thermal Printer"}" else "Failed to send ESC/POS data to printer"
    }
}

