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
import androidx.compose.material.icons.filled.School
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
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Course
import com.example.ui.components.EmptyStateView
import com.example.ui.components.StatusBadge
import com.example.ui.localization.Strings
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
fun CoursesScreen(
    viewModel: AcademyViewModel,
    onNavigateBack: () -> Unit
) {
    val lang by viewModel.currentLanguage.collectAsState()
    val courses by viewModel.courses.collectAsState()
    var showDialog by remember { mutableStateOf(false) }
    var editingCourse by remember { mutableStateOf<Course?>(null) }
    var deletingCourse by remember { mutableStateOf<Course?>(null) }

    val currencyFormat = NumberFormat.getNumberInstance(Locale.US)

    if (showDialog) {
        CourseDialog(
            course = editingCourse,
            onDismiss = {
                showDialog = false
                editingCourse = null
            },
            onSave = { course ->
                if (editingCourse == null) {
                    viewModel.insertCourse(course)
                } else {
                    viewModel.updateCourse(course)
                }
                showDialog = false
                editingCourse = null
            }
        )
    }

    if (deletingCourse != null) {
        AlertDialog(
            onDismissRequest = { deletingCourse = null },
            title = { Text("Delete Course", color = GoldLight) },
            text = { Text("Are you sure you want to delete ${deletingCourse?.name}? Existing students in this course will not be deleted.", color = Color.White) },
            confirmButton = {
                Button(
                    onClick = {
                        deletingCourse?.let { viewModel.deleteCourse(it) }
                        deletingCourse = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFB71C1C))
                ) {
                    Text("Delete", color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = { deletingCourse = null }) {
                    Text("Cancel", color = Color.White.copy(alpha = 0.7f))
                }
            },
            containerColor = NavyCard
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        Strings.get("courses", lang),
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
                onClick = {
                    editingCourse = null
                    showDialog = true
                },
                containerColor = GoldAccent,
                contentColor = NavyDark
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Course")
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
            if (courses.isEmpty()) {
                EmptyStateView(
                    message = "No courses added yet. Click '+' to add a course.",
                    icon = Icons.Default.School
                )
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(courses) { course ->
                        CourseCard(
                            course = course,
                            currencyFormat = currencyFormat,
                            onEdit = {
                                editingCourse = course
                                showDialog = true
                            },
                            onDelete = {
                                deletingCourse = course
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
fun CourseCard(
    course: Course,
    currencyFormat: NumberFormat,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = NavyCard)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = course.name,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    ),
                    modifier = Modifier.weight(1f),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                StatusBadge(status = if (course.isActive) "Active" else "Inactive")
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "${course.duration} • Batch: ${course.batchName} • Timing: ${course.classTiming}",
                style = MaterialTheme.typography.bodySmall.copy(
                    color = Color(0xFF64B5F6),
                    fontSize = 12.sp
                )
            )

            if (course.instructor.isNotBlank()) {
                Text(
                    text = "Instructor: ${course.instructor}",
                    style = MaterialTheme.typography.bodySmall.copy(
                        color = Color.White.copy(alpha = 0.6f),
                        fontSize = 12.sp
                    )
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Total Fee: PKR ${currencyFormat.format(course.totalFee)}", style = MaterialTheme.typography.bodyMedium.copy(color = GoldAccent, fontWeight = FontWeight.Bold))
                    Text("Monthly: PKR ${currencyFormat.format(course.monthlyFee)}", style = MaterialTheme.typography.labelSmall.copy(color = Color.White.copy(alpha = 0.6f)))
                }
                Row {
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
fun CourseDialog(
    course: Course?,
    onDismiss: () -> Unit,
    onSave: (Course) -> Unit
) {
    var name by remember { mutableStateOf(course?.name ?: "") }
    var duration by remember { mutableStateOf(course?.duration ?: "3 Months") }
    var totalFee by remember { mutableDoubleStateOf(course?.totalFee ?: 15000.0) }
    var monthlyFee by remember { mutableDoubleStateOf(course?.monthlyFee ?: 5000.0) }
    var instructor by remember { mutableStateOf(course?.instructor ?: "Al Ghazi Faculty") }
    var batchName by remember { mutableStateOf(course?.batchName ?: "Batch-2026-A") }
    var timing by remember { mutableStateOf(course?.classTiming ?: "10:00 AM - 12:00 PM") }
    var isActive by remember { mutableStateOf(course?.isActive ?: true) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(if (course == null) "Add Course" else "Edit Course", color = GoldLight) },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Course Name") },
                    colors = outlinedFieldColors(),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = duration,
                    onValueChange = { duration = it },
                    label = { Text("Duration (e.g. 3 Months)") },
                    colors = outlinedFieldColors(),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth()
                )
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = totalFee.toString(),
                        onValueChange = { totalFee = it.toDoubleOrNull() ?: 0.0 },
                        label = { Text("Total Fee") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        colors = outlinedFieldColors(),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = monthlyFee.toString(),
                        onValueChange = { monthlyFee = it.toDoubleOrNull() ?: 0.0 },
                        label = { Text("Monthly Fee") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        colors = outlinedFieldColors(),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.weight(1f)
                    )
                }
                OutlinedTextField(
                    value = instructor,
                    onValueChange = { instructor = it },
                    label = { Text("Instructor Name") },
                    colors = outlinedFieldColors(),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = batchName,
                    onValueChange = { batchName = it },
                    label = { Text("Batch Code") },
                    colors = outlinedFieldColors(),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = timing,
                    onValueChange = { timing = it },
                    label = { Text("Class Timing") },
                    colors = outlinedFieldColors(),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth()
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Course Active:", color = Color.White)
                    Switch(
                        checked = isActive,
                        onCheckedChange = { isActive = it },
                        colors = SwitchDefaults.colors(checkedThumbColor = GoldAccent)
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isNotBlank()) {
                        val newOrUpdated = course?.copy(
                            name = name.trim(),
                            duration = duration.trim(),
                            totalFee = totalFee,
                            monthlyFee = monthlyFee,
                            instructor = instructor.trim(),
                            batchName = batchName.trim(),
                            classTiming = timing.trim(),
                            isActive = isActive
                        ) ?: Course(
                            name = name.trim(),
                            duration = duration.trim(),
                            totalFee = totalFee,
                            monthlyFee = monthlyFee,
                            instructor = instructor.trim(),
                            batchName = batchName.trim(),
                            classTiming = timing.trim(),
                            isActive = isActive
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
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = Color.White.copy(alpha = 0.7f))
            }
        },
        containerColor = NavyCard
    )
}
