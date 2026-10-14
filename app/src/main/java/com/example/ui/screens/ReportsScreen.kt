package com.example.ui.screens

import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.PictureAsPdf
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.components.SectionHeader
import com.example.ui.localization.Strings
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.GoldLight
import com.example.ui.theme.NavyCard
import com.example.ui.theme.NavyDark
import com.example.ui.viewmodel.AcademyViewModel
import kotlinx.coroutines.launch
import java.text.NumberFormat
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportsScreen(
    viewModel: AcademyViewModel,
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val lang by viewModel.currentLanguage.collectAsState()
    val settings by viewModel.settings.collectAsState()

    val totalCollected by viewModel.totalCollectedFee.collectAsState()
    val totalPending by viewModel.totalPendingFee.collectAsState()
    val totalExpenses by viewModel.totalExpenses.collectAsState()
    val totalSalaries by viewModel.totalSalaries.collectAsState()
    val studentCount by viewModel.studentCount.collectAsState()
    val activeStudentCount by viewModel.activeStudentCount.collectAsState()
    val courses by viewModel.courses.collectAsState()
    val students by viewModel.students.collectAsState()

    val totalOutflow = (totalExpenses ?: 0.0) + (totalSalaries ?: 0.0)
    val netBalance = (totalCollected ?: 0.0) - totalOutflow
    val currencyFormat = NumberFormat.getNumberInstance(Locale.US)

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        Strings.get("reports", lang),
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Bold,
                            color = GoldLight
                        )
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
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Main Action: Generate PDF
            Button(
                onClick = {
                    scope.launch {
                        try {
                            val uri = viewModel.pdfReportGenerator.generateComprehensiveReport(
                                settings = settings,
                                totalRevenue = totalCollected ?: 0.0,
                                totalExpenses = totalExpenses ?: 0.0,
                                totalSalaries = totalSalaries ?: 0.0,
                                pendingFees = totalPending ?: 0.0,
                                studentCount = studentCount,
                                activeStudents = activeStudentCount,
                                courses = courses,
                                students = students
                            )
                            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                type = "application/pdf"
                                putExtra(Intent.EXTRA_STREAM, uri)
                                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                            }
                            context.startActivity(Intent.createChooser(shareIntent, "Share Institute Financial Report"))
                        } catch (e: Exception) {
                            Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = GoldAccent, contentColor = NavyDark),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.PictureAsPdf, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Export Official Financial Audit PDF", fontWeight = FontWeight.Bold)
            }

            // Financial Performance Overview Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = NavyCard)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text("Executive Financial Balance", style = MaterialTheme.typography.titleMedium.copy(color = GoldLight, fontWeight = FontWeight.Bold))

                    ReportMetricRow("Total Fee Revenue Collected", "PKR ${currencyFormat.format(totalCollected ?: 0.0)}", Color(0xFF81C784))
                    ReportMetricRow("General Operating Expenses", "PKR ${currencyFormat.format(totalExpenses ?: 0.0)}", Color(0xFFE57373))
                    ReportMetricRow("Faculty & Staff Salaries", "PKR ${currencyFormat.format(totalSalaries ?: 0.0)}", Color(0xFFE57373))
                    ReportMetricRow("Total Outflow", "PKR ${currencyFormat.format(totalOutflow)}", Color(0xFFE57373))

                    Spacer(modifier = Modifier.height(4.dp))
                    ReportMetricRow(
                        "Net Surplus / Balance",
                        "PKR ${currencyFormat.format(netBalance)}",
                        if (netBalance >= 0) GoldAccent else Color(0xFFEF5350),
                        isBold = true
                    )
                    ReportMetricRow("Outstanding Pending Receivables", "PKR ${currencyFormat.format(totalPending ?: 0.0)}", Color(0xFFFFB74D))
                }
            }

            // Enrollment Summary
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = NavyCard)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text("Academic Enrollment Statistics", style = MaterialTheme.typography.titleMedium.copy(color = GoldLight, fontWeight = FontWeight.Bold))

                    ReportMetricRow("Total Registered Admissions", studentCount.toString(), Color.White)
                    ReportMetricRow("Active Enrolled Students", activeStudentCount.toString(), Color(0xFF81C784))
                    ReportMetricRow("Active Courses Running", courses.size.toString(), Color(0xFF64B5F6))
                }
            }

            // Course-wise Breakdown
            SectionHeader(title = "Course Enrollment Breakdown")
            courses.forEach { course ->
                val courseStudents = students.filter { it.courseId == course.id }
                val collected = courseStudents.sumOf { it.paidFee }
                val remaining = courseStudents.sumOf { it.remainingFee }

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = NavyCard)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(course.name, style = MaterialTheme.typography.bodyMedium.copy(color = Color.White, fontWeight = FontWeight.Bold))
                            Text("${courseStudents.size} Students", style = MaterialTheme.typography.bodySmall.copy(color = GoldLight))
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Collected: PKR ${currencyFormat.format(collected)}", style = MaterialTheme.typography.labelSmall.copy(color = Color(0xFF81C784)))
                            Text("Pending: PKR ${currencyFormat.format(remaining)}", style = MaterialTheme.typography.labelSmall.copy(color = Color(0xFFFFB74D)))
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
fun ReportMetricRow(label: String, value: String, valueColor: Color, isBold: Boolean = false) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 2.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall.copy(color = Color.White.copy(alpha = 0.7f), fontWeight = if (isBold) FontWeight.Bold else FontWeight.Normal)
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium.copy(color = valueColor, fontWeight = if (isBold) FontWeight.Bold else FontWeight.SemiBold)
        )
    }
}
