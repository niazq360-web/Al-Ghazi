package com.example.ui.screens

import android.widget.Toast
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
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Payment
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.TabRowDefaults
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.SalaryPayment
import com.example.data.model.Teacher
import com.example.ui.components.EmptyStateView
import com.example.ui.components.StatusBadge
import com.example.ui.localization.Strings
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.GoldLight
import com.example.ui.theme.NavyCard
import com.example.ui.theme.NavyDark
import com.example.ui.viewmodel.AcademyViewModel
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TeachersScreen(
    viewModel: AcademyViewModel,
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    val lang by viewModel.currentLanguage.collectAsState()
    val teachers by viewModel.teachers.collectAsState()
    val salaries by viewModel.salaries.collectAsState()

    var selectedTab by remember { mutableIntStateOf(0) }
    var showAddTeacherDialog by remember { mutableStateOf(false) }
    var editingTeacher by remember { mutableStateOf<Teacher?>(null) }
    var salaryTeacher by remember { mutableStateOf<Teacher?>(null) }

    val currencyFormat = NumberFormat.getNumberInstance(Locale.US)

    if (showAddTeacherDialog || editingTeacher != null) {
        TeacherDialog(
            teacher = editingTeacher,
            onDismiss = {
                showAddTeacherDialog = false
                editingTeacher = null
            },
            onSave = { teacher ->
                if (editingTeacher == null) {
                    viewModel.insertTeacher(teacher)
                } else {
                    viewModel.updateTeacher(teacher)
                }
                showAddTeacherDialog = false
                editingTeacher = null
            }
        )
    }

    if (salaryTeacher != null) {
        PaySalaryDialog(
            teacher = salaryTeacher!!,
            onDismiss = { salaryTeacher = null },
            onPay = { salary, bonus, deduction, monthYear, method, remarks ->
                viewModel.paySalary(
                    teacher = salaryTeacher!!,
                    salaryAmount = salary,
                    bonus = bonus,
                    deduction = deduction,
                    monthYear = monthYear,
                    method = method,
                    remarks = remarks
                )
                Toast.makeText(context, "Salary paid & booked under Staff Salary expense!", Toast.LENGTH_LONG).show()
                salaryTeacher = null
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        Strings.get("teachers", lang),
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
            if (selectedTab == 0) {
                FloatingActionButton(
                    onClick = {
                        editingTeacher = null
                        showAddTeacherDialog = true
                    },
                    containerColor = GoldAccent,
                    contentColor = NavyDark
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Add Teacher")
                }
            }
        },
        containerColor = NavyDark
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = NavyDark,
                contentColor = GoldAccent,
                indicator = { tabPositions ->
                    TabRowDefaults.SecondaryIndicator(
                        Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                        color = GoldAccent
                    )
                }
            ) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = { Text("Faculty (${teachers.size})", fontWeight = FontWeight.SemiBold) }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text("Salary Vouchers (${salaries.size})", fontWeight = FontWeight.SemiBold) }
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            if (selectedTab == 0) {
                if (teachers.isEmpty()) {
                    EmptyStateView(
                        message = "No faculty instructors registered yet.",
                        icon = Icons.Default.Group
                    )
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(teachers) { teacher ->
                            TeacherCard(
                                teacher = teacher,
                                currencyFormat = currencyFormat,
                                onEdit = { editingTeacher = teacher },
                                onDelete = { viewModel.deleteTeacher(teacher) },
                                onPaySalary = { salaryTeacher = teacher }
                            )
                        }
                        item {
                            Spacer(modifier = Modifier.height(72.dp))
                        }
                    }
                }
            } else {
                if (salaries.isEmpty()) {
                    EmptyStateView(
                        message = "No salary payment vouchers recorded yet.",
                        icon = Icons.Default.Payment
                    )
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(salaries) { salary ->
                            SalaryPaymentRow(salary = salary, currencyFormat = currencyFormat)
                        }
                        item {
                            Spacer(modifier = Modifier.height(72.dp))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TeacherCard(
    teacher: Teacher,
    currencyFormat: NumberFormat,
    onEdit: () -> Unit,
    onDelete: () -> Unit,
    onPaySalary: () -> Unit
) {
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
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = teacher.name,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                )
                StatusBadge(status = teacher.status)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "${teacher.subjectOrCourse} • ${teacher.qualification}",
                style = MaterialTheme.typography.bodySmall.copy(color = Color(0xFF64B5F6), fontSize = 12.sp)
            )
            Text(
                text = "Phone: ${teacher.phone}",
                style = MaterialTheme.typography.bodySmall.copy(color = Color.White.copy(alpha = 0.6f), fontSize = 12.sp)
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Salary: PKR ${currencyFormat.format(teacher.monthlySalary)}/mo",
                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = GoldAccent)
                )
                Row {
                    Button(
                        onClick = onPaySalary,
                        colors = ButtonDefaults.buttonColors(containerColor = GoldAccent, contentColor = NavyDark),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("Pay Salary", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                    IconButton(onClick = onEdit) {
                        Icon(Icons.Default.Edit, contentDescription = "Edit", tint = GoldAccent, modifier = Modifier.size(20.dp))
                    }
                    IconButton(onClick = onDelete) {
                        Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Color(0xFFE57373), modifier = Modifier.size(20.dp))
                    }
                }
            }
        }
    }
}

@Composable
fun SalaryPaymentRow(
    salary: SalaryPayment,
    currencyFormat: NumberFormat
) {
    val dateStr = SimpleDateFormat("dd MMM yyyy", Locale.US).format(Date(salary.paymentDate))
    Card(
        modifier = Modifier.fillMaxWidth(),
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
                    text = "${salary.voucherNo} • $dateStr",
                    style = MaterialTheme.typography.labelSmall.copy(color = GoldAccent, fontWeight = FontWeight.Bold)
                )
                Text(
                    text = salary.teacherName,
                    style = MaterialTheme.typography.bodyMedium.copy(color = Color.White, fontWeight = FontWeight.SemiBold)
                )
                Text(
                    text = "Month: ${salary.monthYear} (${salary.paymentMethod})",
                    style = MaterialTheme.typography.bodySmall.copy(color = Color.White.copy(alpha = 0.6f), fontSize = 12.sp)
                )
            }
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = "PKR ${currencyFormat.format(salary.netPaid)}",
                    style = MaterialTheme.typography.titleMedium.copy(color = Color(0xFF81C784), fontWeight = FontWeight.Bold)
                )
                Text("Salary Paid", style = MaterialTheme.typography.labelSmall.copy(color = Color.White.copy(alpha = 0.5f)))
            }
        }
    }
}

@Composable
fun TeacherDialog(
    teacher: Teacher?,
    onDismiss: () -> Unit,
    onSave: (Teacher) -> Unit
) {
    var name by remember { mutableStateOf(teacher?.name ?: "") }
    var phone by remember { mutableStateOf(teacher?.phone ?: "") }
    var qualification by remember { mutableStateOf(teacher?.qualification ?: "BS Computer Science") }
    var subject by remember { mutableStateOf(teacher?.subjectOrCourse ?: "Computer Faculty") }
    var salary by remember { mutableDoubleStateOf(teacher?.monthlySalary ?: 45000.0) }
    var address by remember { mutableStateOf(teacher?.address ?: "") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(if (teacher == null) "Add Teacher" else "Edit Teacher", color = GoldLight) },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Teacher Name") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = phone, onValueChange = { phone = it }, label = { Text("Phone Number") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone), colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = qualification, onValueChange = { qualification = it }, label = { Text("Qualification") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = subject, onValueChange = { subject = it }, label = { Text("Subject / Course") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = salary.toString(), onValueChange = { salary = it.toDoubleOrNull() ?: 0.0 }, label = { Text("Monthly Salary (PKR)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = address, onValueChange = { address = it }, label = { Text("Address") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isNotBlank()) {
                        val newOrUpdated = teacher?.copy(
                            name = name.trim(),
                            phone = phone.trim(),
                            qualification = qualification.trim(),
                            subjectOrCourse = subject.trim(),
                            monthlySalary = salary,
                            address = address.trim()
                        ) ?: Teacher(
                            name = name.trim(),
                            phone = phone.trim(),
                            qualification = qualification.trim(),
                            subjectOrCourse = subject.trim(),
                            monthlySalary = salary,
                            address = address.trim()
                        )
                        onSave(newOrUpdated)
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = GoldAccent, contentColor = NavyDark)
            ) {
                Text("Save", fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel", color = Color.White.copy(alpha = 0.7f)) }
        },
        containerColor = NavyCard
    )
}

@Composable
fun PaySalaryDialog(
    teacher: Teacher,
    onDismiss: () -> Unit,
    onPay: (salary: Double, bonus: Double, deduction: Double, monthYear: String, method: String, remarks: String) -> Unit
) {
    var salary by remember { mutableDoubleStateOf(teacher.monthlySalary) }
    var bonus by remember { mutableDoubleStateOf(0.0) }
    var deduction by remember { mutableDoubleStateOf(0.0) }
    var monthYear by remember { mutableStateOf(SimpleDateFormat("MMMM yyyy", Locale.US).format(Date())) }
    var method by remember { mutableStateOf("Cash") }
    var remarks by remember { mutableStateOf("Monthly Salary Payment") }

    val netPay = (salary + bonus - deduction).coerceAtLeast(0.0)

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Pay Salary: ${teacher.name}", color = GoldLight) },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(value = monthYear, onValueChange = { monthYear = it }, label = { Text("Salary Month (e.g. October 2026)") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = salary.toString(), onValueChange = { salary = it.toDoubleOrNull() ?: 0.0 }, label = { Text("Base Salary (PKR)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(value = bonus.toString(), onValueChange = { bonus = it.toDoubleOrNull() ?: 0.0 }, label = { Text("Bonus") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.weight(1f))
                    OutlinedTextField(value = deduction.toString(), onValueChange = { deduction = it.toDoubleOrNull() ?: 0.0 }, label = { Text("Deduction") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.weight(1f))
                }
                Text("Net Amount: PKR ${netPay.toInt()}", style = MaterialTheme.typography.bodyLarge.copy(color = GoldAccent, fontWeight = FontWeight.Bold))
                OutlinedTextField(value = method, onValueChange = { method = it }, label = { Text("Payment Method (Cash, Bank)") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = remarks, onValueChange = { remarks = it }, label = { Text("Remarks") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    onPay(salary, bonus, deduction, monthYear, method, remarks)
                },
                colors = ButtonDefaults.buttonColors(containerColor = GoldAccent, contentColor = NavyDark)
            ) {
                Text("Confirm & Disburse", fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel", color = Color.White.copy(alpha = 0.7f)) }
        },
        containerColor = NavyCard
    )
}
