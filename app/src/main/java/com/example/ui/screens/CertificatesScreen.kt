package com.example.ui.screens

import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CardMembership
import androidx.compose.material.icons.filled.PictureAsPdf
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Certificate
import com.example.data.model.Student
import com.example.ui.components.EmptyStateView
import com.example.ui.localization.Strings
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.GoldLight
import com.example.ui.theme.NavyCard
import com.example.ui.theme.NavyDark
import com.example.ui.viewmodel.AcademyViewModel
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CertificatesScreen(
    viewModel: AcademyViewModel,
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val lang by viewModel.currentLanguage.collectAsState()
    val certificates by viewModel.certificates.collectAsState()
    val students by viewModel.students.collectAsState()
    val settings by viewModel.settings.collectAsState()

    var showIssueDialog by remember { mutableStateOf(false) }

    if (showIssueDialog) {
        IssueCertificateDialog(
            students = students,
            onDismiss = { showIssueDialog = false },
            onIssue = { student, duration, startDate, completionDate, grade, desc ->
                viewModel.issueCertificate(student, duration, startDate, completionDate, grade, desc)
                showIssueDialog = false
                Toast.makeText(context, "Certificate issued successfully!", Toast.LENGTH_SHORT).show()
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        Strings.get("certificates", lang),
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
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showIssueDialog = true },
                containerColor = GoldAccent,
                contentColor = NavyDark
            ) {
                Icon(Icons.Default.Add, contentDescription = "Issue Certificate")
            }
        },
        containerColor = NavyDark
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp)
        ) {
            Spacer(modifier = Modifier.height(8.dp))
            if (certificates.isEmpty()) {
                EmptyStateView(
                    message = "No certificates issued yet. Click '+' to issue a luxury certificate.",
                    icon = Icons.Default.CardMembership
                )
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(certificates) { cert ->
                        CertificateCard(
                            cert = cert,
                            onExportPdf = {
                                scope.launch {
                                    val uri = viewModel.pdfCertificateGenerator.generateCertificatePdf(cert, settings)
                                    if (uri != null) {
                                        val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                            type = "application/pdf"
                                            putExtra(Intent.EXTRA_STREAM, uri)
                                            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                                        }
                                        context.startActivity(Intent.createChooser(shareIntent, "Share Certificate PDF"))
                                    } else {
                                        Toast.makeText(context, "Error generating certificate PDF", Toast.LENGTH_SHORT).show()
                                    }
                                }
                            }
                        )
                    }
                    item {
                        Spacer(modifier = Modifier.height(72.dp))
                    }
                }
            }
        }
    }
}

@Composable
fun CertificateCard(
    cert: Certificate,
    onExportPdf: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onExportPdf() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = NavyCard)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "${cert.certificateNo} • Grade ${cert.grade}",
                    style = MaterialTheme.typography.labelSmall.copy(color = GoldAccent, fontWeight = FontWeight.Bold)
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = cert.studentName,
                    style = MaterialTheme.typography.bodyLarge.copy(color = Color.White, fontWeight = FontWeight.Bold)
                )
                Text(
                    text = "${cert.courseName} (${cert.duration})",
                    style = MaterialTheme.typography.bodySmall.copy(color = Color(0xFF64B5F6), fontSize = 12.sp)
                )
                Text(
                    text = "Issued on ${cert.issueDate}",
                    style = MaterialTheme.typography.labelSmall.copy(color = Color.White.copy(alpha = 0.5f))
                )
            }

            IconButton(onClick = onExportPdf) {
                Icon(Icons.Default.Share, contentDescription = "Share PDF", tint = GoldAccent)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun IssueCertificateDialog(
    students: List<Student>,
    onDismiss: () -> Unit,
    onIssue: (student: Student, duration: String, startDate: String, completionDate: String, grade: String, desc: String) -> Unit
) {
    var selectedStudent by remember { mutableStateOf(students.firstOrNull()) }
    var studentExpanded by remember { mutableStateOf(false) }
    var duration by remember { mutableStateOf("3 Months") }
    var startDate by remember { mutableStateOf("2026-01-15") }
    var completionDate by remember { mutableStateOf(SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())) }
    var grade by remember { mutableStateOf("A+") }
    var desc by remember {
        mutableStateOf("has successfully completed the comprehensive professional training with exemplary dedication and outstanding performance.")
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Issue Luxury Certificate", color = GoldLight) },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                ExposedDropdownMenuBox(
                    expanded = studentExpanded,
                    onExpandedChange = { studentExpanded = it }
                ) {
                    OutlinedTextField(
                        value = if (selectedStudent != null) "${selectedStudent!!.name} (${selectedStudent!!.studentId})" else "Select Student",
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Student *") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = studentExpanded) },
                        colors = outlinedFieldColors(),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .menuAnchor()
                    )
                    ExposedDropdownMenu(
                        expanded = studentExpanded,
                        onDismissRequest = { studentExpanded = false }
                    ) {
                        students.forEach { s ->
                            DropdownMenuItem(text = { Text("${s.name} (${s.courseName})") }, onClick = { selectedStudent = s; studentExpanded = false })
                        }
                    }
                }

                OutlinedTextField(value = duration, onValueChange = { duration = it }, label = { Text("Duration") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(value = startDate, onValueChange = { startDate = it }, label = { Text("Start Date") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.weight(1f))
                    OutlinedTextField(value = completionDate, onValueChange = { completionDate = it }, label = { Text("Completion Date") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.weight(1f))
                }
                OutlinedTextField(value = grade, onValueChange = { grade = it }, label = { Text("Grade (A+, A, B, etc)") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = desc, onValueChange = { desc = it }, label = { Text("Certificate Text") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    selectedStudent?.let { s ->
                        onIssue(s, duration, startDate, completionDate, grade, desc)
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = GoldAccent, contentColor = NavyDark)
            ) {
                Text("Generate Certificate", fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel", color = Color.White.copy(alpha = 0.7f)) }
        },
        containerColor = NavyCard
    )
}
