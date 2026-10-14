package com.example.ui.screens

import android.widget.Toast
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AssignmentTurnedIn
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
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
import com.example.data.model.Attendance
import com.example.data.model.Course
import com.example.ui.components.EmptyStateView
import com.example.ui.localization.Strings
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.GoldLight
import com.example.ui.theme.NavyCard
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavySurface
import com.example.ui.viewmodel.AcademyViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AttendanceScreen(
    viewModel: AcademyViewModel,
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    val lang by viewModel.currentLanguage.collectAsState()
    val courses by viewModel.activeCourses.collectAsState()
    val selectedDate by viewModel.selectedAttendanceDate.collectAsState()
    val attendanceRecords by viewModel.attendanceRecords.collectAsState()

    var selectedCourse by remember { mutableStateOf<Course?>(null) }
    var courseMenuExpanded by remember { mutableStateOf(false) }

    LaunchedEffect(courses) {
        if (selectedCourse == null && courses.isNotEmpty()) {
            selectedCourse = courses.first()
            viewModel.loadAttendance(courses.first().id, selectedDate)
        }
    }

    val presentCount = attendanceRecords.count { it.status == "Present" }
    val absentCount = attendanceRecords.count { it.status == "Absent" }
    val leaveCount = attendanceRecords.count { it.status == "Leave" }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        Strings.get("attendance", lang),
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
                actions = {
                    if (attendanceRecords.isNotEmpty()) {
                        Button(
                            onClick = {
                                viewModel.saveAttendance()
                                Toast.makeText(context, "Attendance saved successfully!", Toast.LENGTH_SHORT).show()
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = GoldAccent, contentColor = NavyDark),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.padding(end = 8.dp)
                        ) {
                            Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Save", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
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
                .padding(horizontal = 16.dp)
        ) {
            // Course selection & Date
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                ExposedDropdownMenuBox(
                    expanded = courseMenuExpanded,
                    onExpandedChange = { courseMenuExpanded = it },
                    modifier = Modifier.weight(1f)
                ) {
                    OutlinedTextField(
                        value = selectedCourse?.name ?: "Select Course",
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Course") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = courseMenuExpanded) },
                        colors = outlinedFieldColors(),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .menuAnchor()
                    )
                    ExposedDropdownMenu(
                        expanded = courseMenuExpanded,
                        onDismissRequest = { courseMenuExpanded = false }
                    ) {
                        courses.forEach { course ->
                            DropdownMenuItem(
                                text = { Text(course.name) },
                                onClick = {
                                    selectedCourse = course
                                    courseMenuExpanded = false
                                    viewModel.loadAttendance(course.id, selectedDate)
                                }
                            )
                        }
                    }
                }

                OutlinedTextField(
                    value = selectedDate,
                    onValueChange = {
                        viewModel.selectedAttendanceDate.value = it
                        selectedCourse?.let { c -> viewModel.loadAttendance(c.id, it) }
                    },
                    label = { Text("Date (yyyy-MM-dd)") },
                    colors = outlinedFieldColors(),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.weight(1f),
                    singleLine = true
                )
            }

            // Stats row
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = NavyCard)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        Text("Present: $presentCount", color = Color(0xFF81C784), fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        Text("Absent: $absentCount", color = Color(0xFFE57373), fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        Text("Leave: $leaveCount", color = Color(0xFFFFB74D), fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }

                    Text(
                        text = "Mark All Present",
                        color = GoldAccent,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 12.sp,
                        modifier = Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .clickable {
                                attendanceRecords.forEach {
                                    viewModel.updateAttendanceStatus(it.studentId, "Present")
                                }
                            }
                            .padding(4.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            if (attendanceRecords.isEmpty()) {
                EmptyStateView(
                    message = "No active students found in this course.",
                    icon = Icons.Default.AssignmentTurnedIn
                )
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(attendanceRecords) { record ->
                        AttendanceItemRow(
                            record = record,
                            onStatusChange = { newStatus ->
                                viewModel.updateAttendanceStatus(record.studentId, newStatus)
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
fun AttendanceItemRow(
    record: Attendance,
    onStatusChange: (String) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.cardColors(containerColor = NavyCard)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = record.studentName,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                )
                Text(
                    text = "${record.studentRollNo} • ${record.batchName}",
                    style = MaterialTheme.typography.bodySmall.copy(
                        color = Color.White.copy(alpha = 0.5f),
                        fontSize = 11.sp
                    )
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                AttendanceStatusButton(
                    text = "P",
                    isSelected = record.status == "Present",
                    activeColor = Color(0xFF1B5E20),
                    textColor = Color(0xFF81C784),
                    onClick = { onStatusChange("Present") }
                )
                AttendanceStatusButton(
                    text = "A",
                    isSelected = record.status == "Absent",
                    activeColor = Color(0xFFB71C1C),
                    textColor = Color(0xFFE57373),
                    onClick = { onStatusChange("Absent") }
                )
                AttendanceStatusButton(
                    text = "L",
                    isSelected = record.status == "Leave",
                    activeColor = Color(0xFFE65100),
                    textColor = Color(0xFFFFB74D),
                    onClick = { onStatusChange("Leave") }
                )
            }
        }
    }
}

@Composable
fun AttendanceStatusButton(
    text: String,
    isSelected: Boolean,
    activeColor: Color,
    textColor: Color,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .size(36.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(if (isSelected) activeColor else NavySurface)
            .border(
                1.dp,
                if (isSelected) textColor else Color.White.copy(alpha = 0.15f),
                RoundedCornerShape(8.dp)
            )
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            color = if (isSelected) Color.White else Color.White.copy(alpha = 0.6f),
            fontWeight = FontWeight.Bold,
            fontSize = 14.sp
        )
    }
}
