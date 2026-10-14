package com.example.ui.screens

import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.PictureAsPdf
import androidx.compose.material.icons.filled.Print
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Sms
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.GoldLight
import com.example.ui.theme.NavyCard
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavySurface
import com.example.ui.viewmodel.AcademyViewModel
import kotlinx.coroutines.launch
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReceiptActionScreen(
    paymentId: Long,
    viewModel: AcademyViewModel,
    onNavigateBack: () -> Unit,
    onNavigateToDashboard: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val allPayments by viewModel.payments.collectAsState()
    val payment = allPayments.firstOrNull { it.id == paymentId }
    val settings by viewModel.settings.collectAsState()
    val allStudents by viewModel.students.collectAsState()
    val student = allStudents.firstOrNull { it.id == payment?.studentId }
    val currentLang by viewModel.currentLanguage.collectAsState()

    val currencyFormat = NumberFormat.getNumberInstance(Locale.US)

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "Receipt ${payment?.receiptNo ?: ""}",
                        style = MaterialTheme.typography.titleMedium.copy(color = GoldLight, fontWeight = FontWeight.Bold)
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = GoldAccent)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = NavyDark)
            )
        },
        containerColor = NavyDark
    ) { paddingValues ->
        if (payment == null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                Text("Receipt not found", color = Color.White)
            }
            return@Scaffold
        }

        val dateStr = SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.US).format(Date(payment.paymentDate))

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Success header icon
            Box(
                modifier = Modifier.fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = Color(0xFF81C784),
                        modifier = Modifier.size(54.dp)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        "Payment Successfully Recorded!",
                        style = MaterialTheme.typography.titleMedium.copy(color = Color.White, fontWeight = FontWeight.Bold)
                    )
                }
            }

            // Paper Receipt Style Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Text(
                        text = settings.academyName,
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF0A192F),
                            textAlign = TextAlign.Center
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                    Text(
                        text = settings.tagline,
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = Color.DarkGray,
                            textAlign = TextAlign.Center
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                    Text(
                        text = settings.address,
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = Color.Gray,
                            textAlign = TextAlign.Center,
                            fontSize = 10.sp
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(8.dp))
                    Divider(color = Color.LightGray, thickness = 1.dp)
                    Spacer(modifier = Modifier.height(8.dp))

                    ReceiptRowDark("Receipt No:", payment.receiptNo)
                    ReceiptRowDark("Date & Time:", dateStr)
                    ReceiptRowDark("Roll No:", payment.studentRollNo)
                    ReceiptRowDark("Student Name:", payment.studentName)
                    ReceiptRowDark("Father's Name:", payment.fatherName)
                    ReceiptRowDark("Course:", payment.courseName)
                    ReceiptRowDark("Batch:", payment.batchName)

                    Spacer(modifier = Modifier.height(6.dp))
                    Divider(color = Color.LightGray, thickness = 1.dp)
                    Spacer(modifier = Modifier.height(6.dp))

                    ReceiptRowDark("Total Course Fee:", "PKR ${currencyFormat.format(payment.totalFee)}")
                    ReceiptRowDark("Previous Paid:", "PKR ${currencyFormat.format(payment.previousPaid)}")
                    ReceiptRowDark("Amount Paid Now:", "PKR ${currencyFormat.format(payment.paidAmount)}", isHighlight = true)
                    ReceiptRowDark("Remaining Balance:", "PKR ${currencyFormat.format(payment.remainingFee)}")
                    ReceiptRowDark("Payment Method:", payment.paymentMethod)
                    ReceiptRowDark("Received By:", payment.receivedBy)

                    Spacer(modifier = Modifier.height(8.dp))
                    Divider(color = Color.LightGray, thickness = 1.dp)
                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = settings.receiptFooterText,
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = Color.DarkGray,
                            textAlign = TextAlign.Center,
                            fontStyle = androidx.compose.ui.text.font.FontStyle.Italic
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }

            // Action Buttons
            // 1. Share / View PDF
            Button(
                onClick = {
                    scope.launch {
                        try {
                            val uri = viewModel.pdfReceiptGenerator.generateReceiptPdf(payment, settings)
                            if (uri != null) {
                                val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                    type = "application/pdf"
                                    putExtra(Intent.EXTRA_STREAM, uri)
                                    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                                }
                                context.startActivity(Intent.createChooser(shareIntent, "Share Receipt PDF"))
                            } else {
                                Toast.makeText(context, "Could not generate PDF", Toast.LENGTH_SHORT).show()
                            }
                        } catch (e: Exception) {
                            Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                colors = ButtonDefaults.buttonColors(containerColor = GoldAccent, contentColor = NavyDark),
                shape = RoundedCornerShape(10.dp)
            ) {
                Icon(Icons.Default.PictureAsPdf, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Share / Export Official PDF", fontWeight = FontWeight.Bold)
            }

            // 2. Bluetooth Thermal Print
            Button(
                onClick = {
                    scope.launch {
                        val result = viewModel.thermalPrinterService.printReceipt(payment, settings)
                        Toast.makeText(context, result, Toast.LENGTH_LONG).show()
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                colors = ButtonDefaults.buttonColors(containerColor = NavyCard, contentColor = GoldLight),
                shape = RoundedCornerShape(10.dp)
            ) {
                Icon(Icons.Default.Print, contentDescription = null, tint = GoldAccent)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Print Bluetooth Thermal Receipt (${settings.printerPaperWidth})", fontWeight = FontWeight.Bold)
            }

            // 3. Resend SMS
            OutlinedButton(
                onClick = {
                    val targetPhone = if (student != null && student.parentMobile.isNotBlank()) {
                        student.parentMobile
                    } else if (student != null && student.studentMobile.isNotBlank()) {
                        student.studentMobile
                    } else {
                        ""
                    }
                    if (targetPhone.isNotBlank()) {
                        viewModel.smsService.sendPaymentSms(
                            to = targetPhone,
                            payment = payment,
                            lang = currentLang,
                            simSlot = settings.preferredSimSlot
                        )
                        Toast.makeText(context, "SMS sent to $targetPhone", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(context, "No parent phone number on file", Toast.LENGTH_SHORT).show()
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, GoldAccent),
                shape = RoundedCornerShape(10.dp)
            ) {
                Icon(Icons.Default.Sms, contentDescription = null, tint = GoldAccent)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Resend SMS to Parent", color = GoldLight, fontWeight = FontWeight.SemiBold)
            }

            // 4. Return to Dashboard
            Button(
                onClick = onNavigateToDashboard,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                colors = ButtonDefaults.buttonColors(containerColor = NavySurface, contentColor = Color.White),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text("Back to Dashboard")
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
fun ReceiptRowDark(label: String, value: String, isHighlight: Boolean = false) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 2.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall.copy(
                color = Color.DarkGray,
                fontWeight = if (isHighlight) FontWeight.Bold else FontWeight.Normal,
                fontSize = if (isHighlight) 13.sp else 12.sp
            )
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodySmall.copy(
                color = if (isHighlight) Color(0xFF1B5E20) else Color.Black,
                fontWeight = if (isHighlight) FontWeight.Bold else FontWeight.SemiBold,
                fontSize = if (isHighlight) 14.sp else 12.sp,
                fontFamily = FontFamily.Monospace
            )
        )
    }
}
