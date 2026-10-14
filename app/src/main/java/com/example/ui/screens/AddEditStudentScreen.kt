package com.example.ui.screens

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AddAPhoto
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.model.Course
import com.example.data.model.Student
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.GoldLight
import com.example.ui.theme.NavyCard
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavySurface
import com.example.ui.viewmodel.AcademyViewModel
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditStudentScreen(
    studentId: Long?,
    viewModel: AcademyViewModel,
    onNavigateBack: () -> Unit
) {
    val courses by viewModel.activeCourses.collectAsState()
    val allStudents by viewModel.students.collectAsState()
    val existingStudent = remember(studentId, allStudents) {
        if (studentId != null) allStudents.firstOrNull { it.id == studentId } else null
    }

    var name by remember { mutableStateOf("") }
    var fatherName by remember { mutableStateOf("") }
    var gender by remember { mutableStateOf("Male") }
    var cnic by remember { mutableStateOf("") }
    var studentMobile by remember { mutableStateOf("") }
    var parentMobile by remember { mutableStateOf("") }
    var address by remember { mutableStateOf("") }
    var photoUri by remember { mutableStateOf("") }
    var selectedCourse by remember { mutableStateOf<Course?>(null) }
    var courseDropdownExpanded by remember { mutableStateOf(false) }
    var batchName by remember { mutableStateOf("Batch A") }
    var timing by remember { mutableStateOf("10:00 AM - 12:00 PM") }
    var admissionDate by remember {
        mutableStateOf(SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date()))
    }
    var courseFee by remember { mutableDoubleStateOf(15000.0) }
    var discount by remember { mutableDoubleStateOf(0.0) }
    var initialPaid by remember { mutableDoubleStateOf(0.0) }
    var status by remember { mutableStateOf("Active") }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia()
    ) { uri: Uri? ->
        if (uri != null) {
            photoUri = uri.toString()
        }
    }

    LaunchedEffect(existingStudent, courses) {
        if (existingStudent != null) {
            name = existingStudent.name
            fatherName = existingStudent.fatherName
            gender = existingStudent.gender
            cnic = existingStudent.cnicOrBForm
            studentMobile = existingStudent.studentMobile
            parentMobile = existingStudent.parentMobile
            address = existingStudent.address
            photoUri = existingStudent.photoUri
            selectedCourse = courses.firstOrNull { it.id == existingStudent.courseId }
                ?: Course(name = existingStudent.courseName, duration = "")
            batchName = existingStudent.batchName
            timing = existingStudent.timing
            admissionDate = existingStudent.admissionDate
            courseFee = existingStudent.courseFee
            discount = existingStudent.discount
            initialPaid = existingStudent.paidFee
            status = existingStudent.status
        } else if (selectedCourse == null && courses.isNotEmpty()) {
            selectedCourse = courses.first()
            courseFee = courses.first().totalFee
            batchName = courses.first().batchName
            timing = courses.first().classTiming
        }
    }

    val finalFee = (courseFee - discount).coerceAtLeast(0.0)

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        if (existingStudent == null) "New Student Admission" else "Edit Student Profile",
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
            // Photo Selector
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(90.dp)
                        .clip(CircleShape)
                        .background(NavyCard)
                        .border(2.dp, GoldAccent, CircleShape)
                        .clickable {
                            photoPickerLauncher.launch(
                                PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                            )
                        },
                    contentAlignment = Alignment.Center
                ) {
                    if (photoUri.isNotBlank()) {
                        AsyncImage(
                            model = photoUri,
                            contentDescription = "Student Photo",
                            modifier = Modifier.fillMaxSize()
                        )
                    } else {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Default.AddAPhoto, contentDescription = null, tint = GoldAccent, modifier = Modifier.size(28.dp))
                            Text("Photo", color = Color.White.copy(alpha = 0.6f), fontSize = 10.sp)
                        }
                    }
                }
            }

            // Student Name
            OutlinedTextField(
                value = name,
                onValueChange = { name = it; errorMessage = null },
                label = { Text("Full Name *") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                colors = outlinedFieldColors(),
                shape = RoundedCornerShape(10.dp)
            )

            // Father Name
            OutlinedTextField(
                value = fatherName,
                onValueChange = { fatherName = it; errorMessage = null },
                label = { Text("Father's Name *") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                colors = outlinedFieldColors(),
                shape = RoundedCornerShape(10.dp)
            )

            // Gender
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Gender:", color = Color.White.copy(alpha = 0.8f), modifier = Modifier.width(80.dp))
                RadioButton(
                    selected = gender == "Male",
                    onClick = { gender = "Male" },
                    colors = RadioButtonDefaults.colors(selectedColor = GoldAccent)
                )
                Text("Male", color = Color.White)
                Spacer(modifier = Modifier.width(16.dp))
                RadioButton(
                    selected = gender == "Female",
                    onClick = { gender = "Female" },
                    colors = RadioButtonDefaults.colors(selectedColor = GoldAccent)
                )
                Text("Female", color = Color.White)
            }

            // Mobile Contacts
            OutlinedTextField(
                value = parentMobile,
                onValueChange = { parentMobile = it; errorMessage = null },
                label = { Text("Parent Mobile (for SMS receipts) *") },
                placeholder = { Text("03001234567") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                colors = outlinedFieldColors(),
                shape = RoundedCornerShape(10.dp)
            )

            OutlinedTextField(
                value = studentMobile,
                onValueChange = { studentMobile = it },
                label = { Text("Student Mobile (Optional)") },
                placeholder = { Text("03001234567") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                colors = outlinedFieldColors(),
                shape = RoundedCornerShape(10.dp)
            )

            // CNIC or B-Form
            OutlinedTextField(
                value = cnic,
                onValueChange = { cnic = it },
                label = { Text("CNIC or B-Form No (Optional)") },
                placeholder = { Text("45201-1234567-1") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                colors = outlinedFieldColors(),
                shape = RoundedCornerShape(10.dp)
            )

            // Course Dropdown
            ExposedDropdownMenuBox(
                expanded = courseDropdownExpanded,
                onExpandedChange = { courseDropdownExpanded = it }
            ) {
                OutlinedTextField(
                    value = selectedCourse?.name ?: "Select Course",
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Selected Course *") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = courseDropdownExpanded) },
                    colors = outlinedFieldColors(),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .menuAnchor()
                )
                ExposedDropdownMenu(
                    expanded = courseDropdownExpanded,
                    onDismissRequest = { courseDropdownExpanded = false }
                ) {
                    courses.forEach { course ->
                        DropdownMenuItem(
                            text = { Text("${course.name} (PKR ${course.totalFee.toInt()})") },
                            onClick = {
                                selectedCourse = course
                                courseFee = course.totalFee
                                batchName = course.batchName
                                timing = course.classTiming
                                courseDropdownExpanded = false
                            }
                        )
                    }
                }
            }

            // Batch and Timing
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = batchName,
                    onValueChange = { batchName = it },
                    label = { Text("Batch") },
                    modifier = Modifier.weight(1f),
                    singleLine = true,
                    colors = outlinedFieldColors(),
                    shape = RoundedCornerShape(10.dp)
                )
                OutlinedTextField(
                    value = timing,
                    onValueChange = { timing = it },
                    label = { Text("Timing") },
                    modifier = Modifier.weight(1f),
                    singleLine = true,
                    colors = outlinedFieldColors(),
                    shape = RoundedCornerShape(10.dp)
                )
            }

            // Financials (Course Fee, Discount, Final Fee)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = courseFee.toString(),
                    onValueChange = { courseFee = it.toDoubleOrNull() ?: 0.0 },
                    label = { Text("Course Fee") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.weight(1f),
                    singleLine = true,
                    colors = outlinedFieldColors(),
                    shape = RoundedCornerShape(10.dp)
                )
                OutlinedTextField(
                    value = discount.toString(),
                    onValueChange = { discount = it.toDoubleOrNull() ?: 0.0 },
                    label = { Text("Discount") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.weight(1f),
                    singleLine = true,
                    colors = outlinedFieldColors(),
                    shape = RoundedCornerShape(10.dp)
                )
            }

            Text(
                text = "Final Total Fee: PKR ${finalFee.toInt()}",
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontWeight = FontWeight.Bold,
                    color = GoldAccent
                )
            )

            // Address
            OutlinedTextField(
                value = address,
                onValueChange = { address = it },
                label = { Text("Residential Address") },
                modifier = Modifier.fillMaxWidth(),
                colors = outlinedFieldColors(),
                shape = RoundedCornerShape(10.dp)
            )

            if (errorMessage != null) {
                Text(
                    text = errorMessage ?: "",
                    color = Color(0xFFEF5350),
                    style = MaterialTheme.typography.bodySmall
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Save Button
            Button(
                onClick = {
                    if (name.isBlank() || fatherName.isBlank()) {
                        errorMessage = "Please enter student name and father's name."
                        return@Button
                    }
                    if (selectedCourse == null) {
                        errorMessage = "Please select a valid course."
                        return@Button
                    }

                    if (existingStudent == null) {
                        // New student
                        val newStudent = Student(
                            studentId = "",
                            name = name.trim(),
                            fatherName = fatherName.trim(),
                            gender = gender,
                            cnicOrBForm = cnic.trim(),
                            studentMobile = studentMobile.trim(),
                            parentMobile = parentMobile.trim(),
                            address = address.trim(),
                            photoUri = photoUri,
                            courseId = selectedCourse!!.id,
                            courseName = selectedCourse!!.name,
                            batchName = batchName,
                            timing = timing,
                            admissionDate = admissionDate,
                            courseFee = courseFee,
                            discount = discount,
                            finalFee = finalFee,
                            paidFee = 0.0,
                            remainingFee = finalFee,
                            status = status
                        )
                        viewModel.registerStudent(newStudent) {
                            onNavigateBack()
                        }
                    } else {
                        // Update student
                        val updated = existingStudent.copy(
                            name = name.trim(),
                            fatherName = fatherName.trim(),
                            gender = gender,
                            cnicOrBForm = cnic.trim(),
                            studentMobile = studentMobile.trim(),
                            parentMobile = parentMobile.trim(),
                            address = address.trim(),
                            photoUri = photoUri,
                            courseId = selectedCourse!!.id,
                            courseName = selectedCourse!!.name,
                            batchName = batchName,
                            timing = timing,
                            admissionDate = admissionDate,
                            courseFee = courseFee,
                            discount = discount,
                            finalFee = finalFee,
                            remainingFee = (finalFee - existingStudent.paidFee).coerceAtLeast(0.0),
                            status = status
                        )
                        viewModel.updateStudent(updated)
                        onNavigateBack()
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = GoldAccent,
                    contentColor = NavyDark
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Check, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (existingStudent == null) "Complete Admission" else "Save Changes",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
fun outlinedFieldColors() = OutlinedTextFieldDefaults.colors(
    focusedBorderColor = GoldAccent,
    unfocusedBorderColor = Color.White.copy(alpha = 0.2f),
    focusedLabelColor = GoldLight,
    unfocusedLabelColor = Color.White.copy(alpha = 0.6f),
    focusedTextColor = Color.White,
    unfocusedTextColor = Color.White,
    cursorColor = GoldAccent
)
