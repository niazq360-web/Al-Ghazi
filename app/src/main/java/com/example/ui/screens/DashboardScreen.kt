package com.example.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AssignmentTurnedIn
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.CardMembership
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.MoneyOff
import androidx.compose.material.icons.filled.Payment
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.TrendingUp
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.FeePayment
import com.example.ui.components.AcademyHeaderLogo
import com.example.ui.components.EmptyStateView
import com.example.ui.components.SectionHeader
import com.example.ui.components.StatCard
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
fun DashboardScreen(
    viewModel: AcademyViewModel,
    onNavigateToStudents: () -> Unit,
    onNavigateToAddStudent: () -> Unit,
    onNavigateToCourses: () -> Unit,
    onNavigateToFeeManagement: () -> Unit,
    onNavigateToCollectFee: (Long?) -> Unit,
    onNavigateToReceiptAction: (Long) -> Unit,
    onNavigateToAttendance: () -> Unit,
    onNavigateToTeachers: () -> Unit,
    onNavigateToExpenses: () -> Unit,
    onNavigateToCertificates: () -> Unit,
    onNavigateToReports: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onLogout: () -> Unit
) {
    val lang by viewModel.currentLanguage.collectAsState()
    val settings by viewModel.settings.collectAsState()

    val studentCount by viewModel.studentCount.collectAsState()
    val activeStudentCount by viewModel.activeStudentCount.collectAsState()
    val courseCount by viewModel.courseCount.collectAsState()
    val totalCollected by viewModel.totalCollectedFee.collectAsState()
    val totalPending by viewModel.totalPendingFee.collectAsState()
    val totalExpenses by viewModel.totalExpenses.collectAsState()
    val totalSalaries by viewModel.totalSalaries.collectAsState()
    val recentPayments by viewModel.payments.collectAsState()

    val totalOutflow = (totalExpenses ?: 0.0) + (totalSalaries ?: 0.0)
    val netBalance = (totalCollected ?: 0.0) - totalOutflow

    val currencyFormat = NumberFormat.getNumberInstance(Locale.US)

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = settings.academyName,
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = GoldLight
                            ),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Text(
                            text = settings.tagline,
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = Color.White.copy(alpha = 0.6f),
                                fontSize = 10.sp
                            )
                        )
                    }
                },
                actions = {
                    IconButton(onClick = onNavigateToSettings) {
                        Icon(Icons.Default.Settings, contentDescription = "Settings", tint = GoldAccent)
                    }
                    IconButton(onClick = onLogout) {
                        Icon(Icons.AutoMirrored.Filled.Logout, contentDescription = "Logout", tint = Color.White.copy(alpha = 0.7f))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = NavyDark
                )
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
                Spacer(modifier = Modifier.height(4.dp))
                // Financial High-Level Banner
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
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = Strings.get("net_balance", lang),
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    color = Color.White.copy(alpha = 0.75f)
                                )
                            )
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (netBalance >= 0) Color(0xFF1B5E20) else Color(0xFFB71C1C))
                                    .padding(horizontal = 8.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = if (netBalance >= 0) "Surplus" else "Deficit",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = Color.White,
                                        fontWeight = FontWeight.Bold
                                    )
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "PKR ${currencyFormat.format(netBalance)}",
                            style = MaterialTheme.typography.headlineMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = GoldAccent
                            )
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text(
                                    text = Strings.get("fee_collected", lang),
                                    style = MaterialTheme.typography.labelSmall.copy(color = Color.White.copy(alpha = 0.6f))
                                )
                                Text(
                                    text = "PKR ${currencyFormat.format(totalCollected ?: 0.0)}",
                                    style = MaterialTheme.typography.bodyMedium.copy(color = Color(0xFF81C784), fontWeight = FontWeight.SemiBold)
                                )
                            }
                            Column {
                                Text(
                                    text = "Expenses + Salary",
                                    style = MaterialTheme.typography.labelSmall.copy(color = Color.White.copy(alpha = 0.6f))
                                )
                                Text(
                                    text = "PKR ${currencyFormat.format(totalOutflow)}",
                                    style = MaterialTheme.typography.bodyMedium.copy(color = Color(0xFFE57373), fontWeight = FontWeight.SemiBold)
                                )
                            }
                            Column {
                                Text(
                                    text = Strings.get("fee_pending", lang),
                                    style = MaterialTheme.typography.labelSmall.copy(color = Color.White.copy(alpha = 0.6f))
                                )
                                Text(
                                    text = "PKR ${currencyFormat.format(totalPending ?: 0.0)}",
                                    style = MaterialTheme.typography.bodyMedium.copy(color = Color(0xFFFFB74D), fontWeight = FontWeight.SemiBold)
                                )
                            }
                        }
                    }
                }
            }

            // Stat Cards Grid
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatCard(
                        title = Strings.get("active_students", lang),
                        value = "$activeStudentCount / $studentCount",
                        icon = Icons.Default.People,
                        accentColor = GoldAccent,
                        modifier = Modifier.weight(1f),
                        onClick = onNavigateToStudents
                    )
                    StatCard(
                        title = Strings.get("total_courses", lang),
                        value = "$courseCount Courses",
                        icon = Icons.Default.School,
                        accentColor = Color(0xFF64B5F6),
                        modifier = Modifier.weight(1f),
                        onClick = onNavigateToCourses
                    )
                }
            }

            // Quick Actions
            item {
                SectionHeader(title = Strings.get("quick_actions", lang))
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    item {
                        QuickActionButton(
                            icon = Icons.Default.Add,
                            label = Strings.get("new_admission", lang),
                            onClick = onNavigateToAddStudent
                        )
                    }
                    item {
                        QuickActionButton(
                            icon = Icons.Default.Payment,
                            label = Strings.get("collect_fee", lang),
                            onClick = { onNavigateToCollectFee(null) }
                        )
                    }
                    item {
                        QuickActionButton(
                            icon = Icons.Default.AssignmentTurnedIn,
                            label = Strings.get("mark_attendance", lang),
                            onClick = onNavigateToAttendance
                        )
                    }
                    item {
                        QuickActionButton(
                            icon = Icons.Default.MoneyOff,
                            label = Strings.get("add_expense", lang),
                            onClick = onNavigateToExpenses
                        )
                    }
                    item {
                        QuickActionButton(
                            icon = Icons.Default.Group,
                            label = Strings.get("teachers", lang),
                            onClick = onNavigateToTeachers
                        )
                    }
                    item {
                        QuickActionButton(
                            icon = Icons.Default.TrendingUp,
                            label = Strings.get("reports", lang),
                            onClick = onNavigateToReports
                        )
                    }
                    item {
                        QuickActionButton(
                            icon = Icons.Default.CardMembership,
                            label = Strings.get("certificates", lang),
                            onClick = onNavigateToCertificates
                        )
                    }
                }
            }

            // Recent Receipts
            item {
                SectionHeader(
                    title = Strings.get("recent_receipts", lang),
                    actionText = "View All Fees",
                    onActionClick = onNavigateToFeeManagement
                )
            }

            val recentList = recentPayments.take(6)
            if (recentList.isEmpty()) {
                item {
                    EmptyStateView(
                        message = "No fee payments recorded yet. Collect student fees to generate receipts.",
                        icon = Icons.Default.Receipt
                    )
                }
            } else {
                items(recentList) { payment ->
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
fun QuickActionButton(
    icon: ImageVector,
    label: String,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(105.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = NavyCard),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(GoldAccent.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = label,
                    tint = GoldAccent,
                    modifier = Modifier.size(22.dp)
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.bodySmall.copy(
                    fontWeight = FontWeight.Medium,
                    color = Color.White,
                    fontSize = 11.sp
                ),
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
        }
    }
}

@Composable
fun PaymentReceiptRow(
    payment: FeePayment,
    onClick: () -> Unit
) {
    val dateFormat = SimpleDateFormat("dd MMM yyyy", Locale.US)
    val dateStr = dateFormat.format(Date(payment.paymentDate))

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
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
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = payment.receiptNo,
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = GoldAccent,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "•  $dateStr",
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = Color.White.copy(alpha = 0.5f)
                        )
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = payment.studentName,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = FontWeight.SemiBold,
                        color = Color.White
                    ),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = "${payment.courseName} (${payment.paymentMethod})",
                    style = MaterialTheme.typography.bodySmall.copy(
                        color = Color.White.copy(alpha = 0.6f),
                        fontSize = 12.sp
                    ),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = "PKR ${payment.paidAmount.toInt()}",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF81C784)
                    )
                )
                if (payment.remainingFee > 0) {
                    Text(
                        text = "Rem: ${payment.remainingFee.toInt()}",
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = Color(0xFFFFB74D)
                        )
                    )
                } else {
                    StatusBadge(status = "Cleared")
                }
            }
        }
    }
}
