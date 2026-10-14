package com.example.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Payment
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Student
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.GoldLight
import com.example.ui.theme.NavyCard
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavySurface
import com.example.ui.viewmodel.AcademyViewModel
import java.text.NumberFormat
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CollectFeeScreen(
    initialStudentId: Long?,
    viewModel: AcademyViewModel,
    onNavigateBack: () -> Unit,
    onPaymentSuccess: (Long) -> Unit
) {
    val allStudents by viewModel.students.collectAsState()
    var selectedStudent by remember { mutableStateOf<Student?>(null) }
    var studentDropdownExpanded by remember { mutableStateOf(false) }

    var amount by remember { mutableDoubleStateOf(0.0) }
    var paymentMethod by remember { mutableStateOf("Cash") }
    val paymentMethods = listOf("Cash", "EasyPaisa", "JazzCash", "Bank Transfer", "Online")
    var remarks by remember { mutableStateOf("Monthly Fee Installment") }
    var sendSms by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val currencyFormat = NumberFormat.getNumberInstance(Locale.US)

    LaunchedEffect(initialStudentId, allStudents) {
        if (initialStudentId != null) {
            selectedStudent = allStudents.firstOrNull { it.id == initialStudentId }
        } else if (selectedStudent == null && allStudents.isNotEmpty()) {
            selectedStudent = allStudents.firstOrNull { it.remainingFee > 0 } ?: allStudents.first()
        }
        selectedStudent?.let {
            if (amount == 0.0) {
                amount = if (it.remainingFee > 0) it.remainingFee.coerceAtMost(5000.0) else 0.0
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "Collect Student Fee",
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
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Student Selector Dropdown
            ExposedDropdownMenuBox(
                expanded = studentDropdownExpanded,
                onExpandedChange = { studentDropdownExpanded = it }
            ) {
                OutlinedTextField(
                    value = if (selectedStudent != null) "${selectedStudent!!.name} (${selectedStudent!!.studentId})" else "Select Student",
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Select Student *") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = studentDropdownExpanded) },
                    colors = outlinedFieldColors(),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .menuAnchor()
                )
                ExposedDropdownMenu(
                    expanded = studentDropdownExpanded,
                    onDismissRequest = { studentDropdownExpanded = false }
                ) {
                    allStudents.forEach { student ->
                        DropdownMenuItem(
                            text = {
                                Column {
                                    Text("${student.name} • ${student.studentId}", fontWeight = FontWeight.Bold)
                                    Text("${student.courseName} | Due: PKR ${student.remainingFee.toInt()}", fontSize = 11.sp, color = Color.Gray)
                                }
                            },
                            onClick = {
                                selectedStudent = student
                                amount = if (student.remainingFee > 0) student.remainingFee.coerceAtMost(5000.0) else 0.0
                                studentDropdownExpanded = false
                            }
                        )
                    }
                }
            }

            // Student Status Card
            selectedStudent?.let { s ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = NavyCard)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp)
                    ) {
                        Text(
                            text = "${s.courseName} (${s.batchName})",
                            style = MaterialTheme.typography.titleSmall.copy(color = GoldLight, fontWeight = FontWeight.Bold)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Parent Mobile: ${s.parentMobile.ifBlank { "N/A" }}",
                            style = MaterialTheme.typography.bodySmall.copy(color = Color.White.copy(alpha = 0.7f))
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text("Total Course Fee", style = MaterialTheme.typography.labelSmall.copy(color = Color.White.copy(alpha = 0.6f)))
                                Text("PKR ${currencyFormat.format(s.finalFee)}", style = MaterialTheme.typography.bodyMedium.copy(color = Color.White, fontWeight = FontWeight.SemiBold))
                            }
                            Column {
                                Text("Already Paid", style = MaterialTheme.typography.labelSmall.copy(color = Color.White.copy(alpha = 0.6f)))
                                Text("PKR ${currencyFormat.format(s.paidFee)}", style = MaterialTheme.typography.bodyMedium.copy(color = Color(0xFF81C784), fontWeight = FontWeight.SemiBold))
                            }
                            Column {
                                Text("Remaining", style = MaterialTheme.typography.labelSmall.copy(color = Color.White.copy(alpha = 0.6f)))
                                Text("PKR ${currencyFormat.format(s.remainingFee)}", style = MaterialTheme.typography.bodyMedium.copy(color = Color(0xFFFFB74D), fontWeight = FontWeight.SemiBold))
                            }
                        }
                    }
                }
            }

            // Amount Input
            OutlinedTextField(
                value = if (amount > 0) amount.toString() else "",
                onValueChange = {
                    amount = it.toDoubleOrNull() ?: 0.0
                    errorMessage = null
                },
                label = { Text("Payment Amount (PKR) *") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                colors = outlinedFieldColors(),
                shape = RoundedCornerShape(10.dp)
            )

            // Quick amount buttons
            selectedStudent?.let { s ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (s.remainingFee > 0) {
                        Button(
                            onClick = { amount = s.remainingFee },
                            colors = ButtonDefaults.buttonColors(containerColor = NavyCard),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Full Due (${s.remainingFee.toInt()})", fontSize = 11.sp, color = GoldLight)
                        }
                    }
                    Button(
                        onClick = { amount = 5000.0 },
                        colors = ButtonDefaults.buttonColors(containerColor = NavyCard),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("5,000", fontSize = 11.sp, color = Color.White)
                    }
                    Button(
                        onClick = { amount = 3000.0 },
                        colors = ButtonDefaults.buttonColors(containerColor = NavyCard),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("3,000", fontSize = 11.sp, color = Color.White)
                    }
                }
            }

            // Payment Method Chips
            Text("Payment Method", style = MaterialTheme.typography.bodySmall.copy(color = Color.White.copy(alpha = 0.7f)))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(paymentMethods) { method ->
                    FilterChip(
                        selected = paymentMethod == method,
                        onClick = { paymentMethod = method },
                        label = { Text(method) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = GoldAccent,
                            selectedLabelColor = NavyDark,
                            containerColor = NavyCard,
                            labelColor = Color.White.copy(alpha = 0.7f)
                        )
                    )
                }
            }

            // Remarks
            OutlinedTextField(
                value = remarks,
                onValueChange = { remarks = it },
                label = { Text("Remarks / Description") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                colors = outlinedFieldColors(),
                shape = RoundedCornerShape(10.dp)
            )

            // Checkbox: Send SMS
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { sendSms = !sendSms },
                verticalAlignment = Alignment.CenterVertically
            ) {
                Checkbox(
                    checked = sendSms,
                    onCheckedChange = { sendSms = it },
                    colors = CheckboxDefaults.colors(checkedColor = GoldAccent)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text("Send SMS to Parent", color = Color.White, fontWeight = FontWeight.Medium)
                    Text("Instant computerized receipt delivered to parent mobile", color = Color.White.copy(alpha = 0.5f), fontSize = 11.sp)
                }
            }

            if (errorMessage != null) {
                Text(
                    text = errorMessage ?: "",
                    color = Color(0xFFEF5350),
                    style = MaterialTheme.typography.bodySmall
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Submit Button
            Button(
                onClick = {
                    val s = selectedStudent
                    if (s == null) {
                        errorMessage = "Please select a student."
                        return@Button
                    }
                    if (amount <= 0.0) {
                        errorMessage = "Please enter an amount greater than 0."
                        return@Button
                    }

                    viewModel.collectFee(
                        student = s,
                        amount = amount,
                        method = paymentMethod,
                        remarks = remarks,
                        sendSms = sendSms,
                        onComplete = { paymentId ->
                            onPaymentSuccess(paymentId)
                        }
                    )
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = GoldAccent,
                    contentColor = NavyDark
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Payment, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Process Fee & Generate Receipt", fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
