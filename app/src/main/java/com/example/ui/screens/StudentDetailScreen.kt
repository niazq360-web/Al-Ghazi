package com.example.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Payment
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material3.AlertDialog
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
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.ui.components.EmptyStateView
import com.example.ui.components.SectionHeader
import com.example.ui.components.StatusBadge
import com.example.ui.localization.Strings
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.GoldLight
import com.example.ui.theme.NavyCard
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavySurface
import com.example.ui.viewmodel.AcademyViewModel
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StudentDetailScreen(
    studentId: Long,
    viewModel: AcademyViewModel,
    onNavigateBack: () -> Unit,
    onNavigateToEdit: (Long) -> Unit,
    onNavigateToCollectFee: (Long) -> Unit,
    onNavigateToReceiptAction: (Long) -> Unit
) {
    val context = LocalContext.current
    val lang by viewModel.currentLanguage.collectAsState()
    val students by viewModel.students.collectAsState()
    val student = students.firstOrNull { it.id == studentId }
    val allPayments by viewModel.payments.collectAsState()
    val studentPayments = allPayments.filter { it.studentId == studentId }

    var showDeleteDialog by remember { mutableStateOf(false) }

    if (student == null) {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = { Text("Student Detail") },
                    navigationIcon = {
                        IconButton(onClick = onNavigateBack) {
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = GoldAccent)
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = NavyDark)
                )
            },
            containerColor = NavyDark
        ) { padding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentAlignment = Alignment.Center
            ) {
                Text("Student not found", color = Color.White)
            }
        }
        return
    }

    val currencyFormat = NumberFormat.getNumberInstance(Locale.US)

    if (showDeleteDialog) {
        AlertDialog(
            onDismissRequest = { showDeleteDialog = false },
            title = { Text("Delete Student Record", color = GoldLight) },
            text = { Text("Are you sure you want to delete ${student.name} (${student.studentId})? This action cannot be undone.", color = Color.White) },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.deleteStudent(student)
                        showDeleteDialog = false
                        onNavigateBack()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFB71C1C))
                ) {
                    Text("Delete", color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteDialog = false }) {
                    Text("Cancel", color = Color.White.copy(alpha = 0.7f))
                }
            },
            containerColor = NavyCard
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(student.studentId, style = MaterialTheme.typography.titleMedium.copy(color = GoldLight, fontWeight = FontWeight.Bold)) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = GoldAccent)
                    }
                },
                actions = {
                    IconButton(onClick = { onNavigateToEdit(student.id) }) {
                        Icon(Icons.Default.Edit, contentDescription = "Edit", tint = GoldAccent)
                    }
                    IconButton(onClick = { showDeleteDialog = true }) {
                        Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Color(0xFFE57373))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = NavyDark)
            )
        },
        containerColor = NavyDark
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                // Profile Header Card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = NavyCard)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            if (student.photoUri.isNotBlank()) {
                                AsyncImage(
                                    model = student.photoUri,
                                    contentDescription = student.name,
                                    modifier = Modifier
                                        .size(72.dp)
                                        .clip(CircleShape)
                                        .border(2.dp, GoldAccent, CircleShape)
                                )
                            } else {
                                Box(
                                    modifier = Modifier
                                        .size(72.dp)
                                        .clip(CircleShape)
                                        .background(NavySurface)
                                        .border(2.dp, GoldAccent, CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        Icons.Default.Person,
                                        contentDescription = null,
                                        tint = GoldAccent,
                                        modifier = Modifier.size(40.dp)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.width(16.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = student.name,
                                    style = MaterialTheme.typography.titleLarge.copy(
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                )
                                Text(
                                    text = "S/O ${student.fatherName}",
                                    style = MaterialTheme.typography.bodyMedium.copy(
                                        color = Color.White.copy(alpha = 0.7f)
                                    )
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                StatusBadge(status = student.status)
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        InfoRow(label = "Course", value = student.courseName)
                        InfoRow(label = "Batch", value = student.batchName)
                        InfoRow(label = "Class Timing", value = student.timing)
                        InfoRow(label = "Admission Date", value = student.admissionDate)
                        InfoRow(label = "Student Mobile", value = student.studentMobile.ifBlank { "N/A" })
                        InfoRow(label = "Parent Mobile", value = student.parentMobile.ifBlank { "N/A" })
                        InfoRow(label = "CNIC / B-Form", value = student.cnicOrBForm.ifBlank { "N/A" })
                        InfoRow(label = "Address", value = student.address.ifBlank { "N/A" })

                        Spacer(modifier = Modifier.height(12.dp))

                        // Quick Call Buttons
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            if (student.studentMobile.isNotBlank()) {
                                Button(
                                    onClick = {
                                        val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${student.studentMobile}"))
                                        context.startActivity(intent)
                                    },
                                    modifier = Modifier.weight(1f),
                                    colors = ButtonDefaults.buttonColors(containerColor = NavySurface),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Icon(Icons.Default.Call, contentDescription = null, tint = GoldAccent, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Call Student", color = Color.White, fontSize = 12.sp)
                                }
                            }
                            if (student.parentMobile.isNotBlank()) {
                                Button(
                                    onClick = {
                                        val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${student.parentMobile}"))
                                        context.startActivity(intent)
                                    },
                                    modifier = Modifier.weight(1f),
                                    colors = ButtonDefaults.buttonColors(containerColor = NavySurface),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Icon(Icons.Default.Call, contentDescription = null, tint = GoldAccent, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Call Parent", color = Color.White, fontSize = 12.sp)
                                }
                            }
                        }
                    }
                }
            }

            // Financial Summary Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = NavyCard)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)
                    ) {
                        Text(
                            text = "Fee Summary",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = GoldLight
                            )
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text("Total Course Fee", style = MaterialTheme.typography.labelSmall.copy(color = Color.White.copy(alpha = 0.6f)))
                                Text("PKR ${currencyFormat.format(student.finalFee)}", style = MaterialTheme.typography.bodyLarge.copy(color = Color.White, fontWeight = FontWeight.Bold))
                            }
                            Column {
                                Text("Paid Fee", style = MaterialTheme.typography.labelSmall.copy(color = Color.White.copy(alpha = 0.6f)))
                                Text("PKR ${currencyFormat.format(student.paidFee)}", style = MaterialTheme.typography.bodyLarge.copy(color = Color(0xFF81C784), fontWeight = FontWeight.Bold))
                            }
                            Column {
                                Text("Remaining", style = MaterialTheme.typography.labelSmall.copy(color = Color.White.copy(alpha = 0.6f)))
                                Text("PKR ${currencyFormat.format(student.remainingFee)}", style = MaterialTheme.typography.bodyLarge.copy(color = Color(0xFFFFB74D), fontWeight = FontWeight.Bold))
                            }
                        }

                        if (student.remainingFee > 0) {
                            Spacer(modifier = Modifier.height(14.dp))
                            Button(
                                onClick = { onNavigateToCollectFee(student.id) },
                                modifier = Modifier.fillMaxWidth(),
                                colors = ButtonDefaults.buttonColors(containerColor = GoldAccent, contentColor = NavyDark),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Icon(Icons.Default.Payment, contentDescription = null)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Collect Fee Now", fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            // Payment History
            item {
                SectionHeader(title = "Payment History (${studentPayments.size})")
            }

            if (studentPayments.isEmpty()) {
                item {
                    EmptyStateView(
                        message = "No payments recorded for this student yet.",
                        icon = Icons.Default.Receipt
                    )
                }
            } else {
                items(studentPayments) { payment ->
                    PaymentReceiptRow(
                        payment = payment,
                        onClick = { onNavigateToReceiptAction(payment.id) }
                    )
                }
            }

            item {
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

@Composable
fun InfoRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 3.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall.copy(color = Color.White.copy(alpha = 0.5f))
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodySmall.copy(color = Color.White, fontWeight = FontWeight.Medium)
        )
    }
}
