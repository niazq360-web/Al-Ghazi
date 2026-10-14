package com.example.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.components.EmptyStateView
import com.example.ui.localization.Strings
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.GoldLight
import com.example.ui.theme.NavyCard
import com.example.ui.theme.NavyDark
import com.example.ui.viewmodel.AcademyViewModel
import java.text.NumberFormat
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FeeManagementScreen(
    viewModel: AcademyViewModel,
    onNavigateBack: () -> Unit,
    onNavigateToCollectFee: () -> Unit,
    onNavigateToReceiptAction: (Long) -> Unit
) {
    val lang by viewModel.currentLanguage.collectAsState()
    val allPayments by viewModel.payments.collectAsState()
    val totalCollected by viewModel.totalCollectedFee.collectAsState()
    val totalPending by viewModel.totalPendingFee.collectAsState()
    var searchFeeQuery by remember { mutableStateOf("") }

    val filteredPayments = remember(allPayments, searchFeeQuery) {
        if (searchFeeQuery.isBlank()) {
            allPayments
        } else {
            allPayments.filter {
                it.studentName.contains(searchFeeQuery, ignoreCase = true) ||
                        it.studentRollNo.contains(searchFeeQuery, ignoreCase = true) ||
                        it.receiptNo.contains(searchFeeQuery, ignoreCase = true) ||
                        it.courseName.contains(searchFeeQuery, ignoreCase = true)
            }
        }
    }

    val currencyFormat = NumberFormat.getNumberInstance(Locale.US)

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        Strings.get("fee_management", lang),
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
                onClick = onNavigateToCollectFee,
                containerColor = GoldAccent,
                contentColor = NavyDark
            ) {
                Icon(Icons.Default.Add, contentDescription = "Collect Fee")
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
            // Summary Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = NavyCard)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("Total Collected", style = MaterialTheme.typography.labelSmall.copy(color = Color.White.copy(alpha = 0.6f)))
                        Text("PKR ${currencyFormat.format(totalCollected ?: 0.0)}", style = MaterialTheme.typography.titleMedium.copy(color = Color(0xFF81C784), fontWeight = FontWeight.Bold))
                    }
                    Column {
                        Text("Total Pending", style = MaterialTheme.typography.labelSmall.copy(color = Color.White.copy(alpha = 0.6f)))
                        Text("PKR ${currencyFormat.format(totalPending ?: 0.0)}", style = MaterialTheme.typography.titleMedium.copy(color = Color(0xFFFFB74D), fontWeight = FontWeight.Bold))
                    }
                }
            }

            // Search
            OutlinedTextField(
                value = searchFeeQuery,
                onValueChange = { searchFeeQuery = it },
                placeholder = { Text("Search by receipt #, student name, roll #...", fontSize = 13.sp) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = GoldAccent) },
                trailingIcon = {
                    if (searchFeeQuery.isNotBlank()) {
                        IconButton(onClick = { searchFeeQuery = "" }) {
                            Icon(Icons.Default.Clear, contentDescription = "Clear", tint = Color.White.copy(alpha = 0.6f))
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp),
                singleLine = true,
                colors = outlinedFieldColors(),
                shape = RoundedCornerShape(12.dp)
            )

            if (filteredPayments.isEmpty()) {
                EmptyStateView(
                    message = "No fee payments recorded.",
                    icon = Icons.Default.Receipt
                )
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(filteredPayments) { payment ->
                        PaymentReceiptRow(
                            payment = payment,
                            onClick = { onNavigateToReceiptAction(payment.id) }
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
