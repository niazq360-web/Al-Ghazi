package com.example.ui.screens

import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.CloudSync
import androidx.compose.material.icons.filled.DeleteForever
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Print
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Sms
import androidx.compose.material.icons.filled.Upload
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
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
import com.example.ui.components.SectionHeader
import com.example.ui.localization.Strings
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.GoldLight
import com.example.ui.theme.NavyCard
import com.example.ui.theme.NavyDark
import com.example.ui.viewmodel.AcademyViewModel
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    viewModel: AcademyViewModel,
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val lang by viewModel.currentLanguage.collectAsState()
    val settings by viewModel.settings.collectAsState()

    var academyName by remember(settings) { mutableStateOf(settings.academyName) }
    var tagline by remember(settings) { mutableStateOf(settings.tagline) }
    var phone by remember(settings) { mutableStateOf(settings.phoneNumber) }
    var email by remember(settings) { mutableStateOf(settings.email) }
    var address by remember(settings) { mutableStateOf(settings.address) }
    var ownerName by remember(settings) { mutableStateOf(settings.ownerName) }
    var receiptPrefix by remember(settings) { mutableStateOf(settings.receiptPrefix) }
    var footerText by remember(settings) { mutableStateOf(settings.receiptFooterText) }
    var printerWidth by remember(settings) { mutableStateOf(settings.printerPaperWidth) }
    var preferredSim by remember(settings) { mutableStateOf(settings.preferredSimSlot) }
    var adminPassword by remember(settings) { mutableStateOf(settings.adminPasswordHash) }

    var showClearDataDialog by remember { mutableStateOf(false) }
    var showRenewSessionDialog by remember { mutableStateOf(false) }
    var isSyncing by remember { mutableStateOf(false) }

    // File Picker for restoring JSON
    val restoreFileLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (uri != null) {
            scope.launch {
                try {
                    val inputStream = context.contentResolver.openInputStream(uri)
                    val content = inputStream?.bufferedReader()?.use { it.readText() }
                    if (content != null) {
                        val success = viewModel.restoreBackupJson(content)
                        if (success) {
                            Toast.makeText(context, "Data successfully restored from backup!", Toast.LENGTH_LONG).show()
                        } else {
                            Toast.makeText(context, "Failed to restore backup data.", Toast.LENGTH_SHORT).show()
                        }
                    }
                } catch (e: Exception) {
                    Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    if (showClearDataDialog) {
        AlertDialog(
            onDismissRequest = { showClearDataDialog = false },
            title = { Text("Reset All Academy Data", color = Color(0xFFEF5350)) },
            text = { Text("Are you sure? This will delete all student records, payments, expenses, attendance, and certificates. This cannot be undone.", color = Color.White) },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.resetAllData {
                            showClearDataDialog = false
                            Toast.makeText(context, "Data reset complete.", Toast.LENGTH_SHORT).show()
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFB71C1C))
                ) {
                    Text("Confirm Reset", color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = { showClearDataDialog = false }) { Text("Cancel", color = Color.White.copy(alpha = 0.7f)) }
            },
            containerColor = NavyCard
        )
    }

    if (showRenewSessionDialog) {
        AlertDialog(
            onDismissRequest = { showRenewSessionDialog = false },
            title = { Text("12-Month Session Renewal", color = GoldLight) },
            text = { Text("Renewing session resets the session retention guarantee date while keeping all academic historical records intact.", color = Color.White) },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.renewSession {
                            showRenewSessionDialog = false
                            Toast.makeText(context, "Session renewed for 12 months!", Toast.LENGTH_SHORT).show()
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = GoldAccent, contentColor = NavyDark)
                ) {
                    Text("Renew Now", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showRenewSessionDialog = false }) { Text("Cancel", color = Color.White.copy(alpha = 0.7f)) }
            },
            containerColor = NavyCard
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        Strings.get("settings", lang),
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
            // 1. Language Selection
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
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Language, contentDescription = null, tint = GoldAccent)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(Strings.get("select_language", lang), style = MaterialTheme.typography.titleSmall.copy(color = GoldLight, fontWeight = FontWeight.Bold))
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        listOf(
                            Triple("en", "English", "English"),
                            Triple("ur", "اردو", "Urdu"),
                            Triple("sd", "سنڌي", "Sindhi")
                        ).forEach { (code, label, _) ->
                            FilterChip(
                                selected = lang == code,
                                onClick = { viewModel.setLanguage(code) },
                                label = { Text(label) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = GoldAccent,
                                    selectedLabelColor = NavyDark,
                                    containerColor = NavyDark,
                                    labelColor = Color.White.copy(alpha = 0.7f)
                                )
                            )
                        }
                    }
                }
            }

            // 2. Academy Profile Info
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = NavyCard)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text("Institute Branding & Information", style = MaterialTheme.typography.titleSmall.copy(color = GoldLight, fontWeight = FontWeight.Bold))
                    OutlinedTextField(value = academyName, onValueChange = { academyName = it }, label = { Text("Academy Name") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = tagline, onValueChange = { tagline = it }, label = { Text("Tagline / Motto") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = ownerName, onValueChange = { ownerName = it }, label = { Text("Director / Authorized Signatory") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = phone, onValueChange = { phone = it }, label = { Text("Official Phone / WhatsApp") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = email, onValueChange = { email = it }, label = { Text("Email") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = address, onValueChange = { address = it }, label = { Text("Campus Address") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = receiptPrefix, onValueChange = { receiptPrefix = it }, label = { Text("Receipt Prefix (e.g. REC-2026-)") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = footerText, onValueChange = { footerText = it }, label = { Text("Receipt Footer Notice") }, colors = outlinedFieldColors(), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth())

                    Button(
                        onClick = {
                            viewModel.updateSettings(
                                settings.copy(
                                    academyName = academyName.trim(),
                                    tagline = tagline.trim(),
                                    ownerName = ownerName.trim(),
                                    phoneNumber = phone.trim(),
                                    email = email.trim(),
                                    address = address.trim(),
                                    receiptPrefix = receiptPrefix.trim(),
                                    receiptFooterText = footerText.trim(),
                                    printerPaperWidth = printerWidth,
                                    preferredSimSlot = preferredSim,
                                    adminPasswordHash = adminPassword.trim()
                                )
                            )
                            Toast.makeText(context, "Academy settings saved!", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = GoldAccent, contentColor = NavyDark),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.Save, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Save Academy Profile", fontWeight = FontWeight.Bold)
                    }
                }
            }

            // 3. Thermal Printer Setup
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = NavyCard)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Print, contentDescription = null, tint = GoldAccent)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(Strings.get("printer_setup", lang), style = MaterialTheme.typography.titleSmall.copy(color = GoldLight, fontWeight = FontWeight.Bold))
                    }
                    Text("Paper Roll Width:", style = MaterialTheme.typography.bodySmall.copy(color = Color.White.copy(alpha = 0.7f)))
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        FilterChip(
                            selected = printerWidth == "58mm",
                            onClick = {
                                printerWidth = "58mm"
                                viewModel.updateSettings(settings.copy(printerPaperWidth = "58mm"))
                            },
                            label = { Text("58mm (2-inch standard portable)") },
                            colors = FilterChipDefaults.filterChipColors(selectedContainerColor = GoldAccent, selectedLabelColor = NavyDark)
                        )
                        FilterChip(
                            selected = printerWidth == "80mm",
                            onClick = {
                                printerWidth = "80mm"
                                viewModel.updateSettings(settings.copy(printerPaperWidth = "80mm"))
                            },
                            label = { Text("80mm (3-inch POS)") },
                            colors = FilterChipDefaults.filterChipColors(selectedContainerColor = GoldAccent, selectedLabelColor = NavyDark)
                        )
                    }
                }
            }

            // 4. SMS & Dual-SIM configuration
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = NavyCard)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Sms, contentDescription = null, tint = GoldAccent)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(Strings.get("sms_settings", lang), style = MaterialTheme.typography.titleSmall.copy(color = GoldLight, fontWeight = FontWeight.Bold))
                    }
                    Text("Select SIM Card for sending automated receipts:", style = MaterialTheme.typography.bodySmall.copy(color = Color.White.copy(alpha = 0.7f)))
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        FilterChip(
                            selected = preferredSim == -1,
                            onClick = {
                                preferredSim = -1
                                viewModel.updateSettings(settings.copy(preferredSimSlot = -1))
                            },
                            label = { Text("System Default") },
                            colors = FilterChipDefaults.filterChipColors(selectedContainerColor = GoldAccent, selectedLabelColor = NavyDark)
                        )
                        FilterChip(
                            selected = preferredSim == 0,
                            onClick = {
                                preferredSim = 0
                                viewModel.updateSettings(settings.copy(preferredSimSlot = 0))
                            },
                            label = { Text("SIM 1") },
                            colors = FilterChipDefaults.filterChipColors(selectedContainerColor = GoldAccent, selectedLabelColor = NavyDark)
                        )
                        FilterChip(
                            selected = preferredSim == 1,
                            onClick = {
                                preferredSim = 1
                                viewModel.updateSettings(settings.copy(preferredSimSlot = 1))
                            },
                            label = { Text("SIM 2") },
                            colors = FilterChipDefaults.filterChipColors(selectedContainerColor = GoldAccent, selectedLabelColor = NavyDark)
                        )
                    }
                }
            }

            // 5. Admin Password
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = NavyCard)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Security, contentDescription = null, tint = GoldAccent)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Admin Security Password", style = MaterialTheme.typography.titleSmall.copy(color = GoldLight, fontWeight = FontWeight.Bold))
                    }
                    OutlinedTextField(
                        value = adminPassword,
                        onValueChange = { adminPassword = it },
                        label = { Text("Admin Master Password") },
                        colors = outlinedFieldColors(),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    )
                    Button(
                        onClick = {
                            viewModel.updateSettings(settings.copy(adminPasswordHash = adminPassword.trim()))
                            Toast.makeText(context, "Password updated successfully!", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = GoldAccent, contentColor = NavyDark),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Update Password", fontWeight = FontWeight.Bold)
                    }
                }
            }

            // 6. Backup, Cloud & Restore
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = NavyCard)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text("Data Persistence & Backup", style = MaterialTheme.typography.titleSmall.copy(color = GoldLight, fontWeight = FontWeight.Bold))

                    // Export JSON
                    Button(
                        onClick = {
                            scope.launch {
                                val file = viewModel.exportBackupJson()
                                if (file != null) {
                                    val uri = androidx.core.content.FileProvider.getUriForFile(
                                        context,
                                        "${context.packageName}.fileprovider",
                                        file
                                    )
                                    val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                        type = "application/json"
                                        putExtra(Intent.EXTRA_STREAM, uri)
                                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                                    }
                                    context.startActivity(Intent.createChooser(shareIntent, "Save Al Ghazi JSON Backup"))
                                } else {
                                    Toast.makeText(context, "Backup failed", Toast.LENGTH_SHORT).show()
                                }
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = NavyDark),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.Download, contentDescription = null, tint = GoldAccent)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(Strings.get("backup_json", lang), color = Color.White)
                    }

                    // Restore JSON
                    Button(
                        onClick = {
                            restoreFileLauncher.launch("application/json")
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = NavyDark),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.Upload, contentDescription = null, tint = GoldAccent)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(Strings.get("restore_json", lang), color = Color.White)
                    }

                    // Cloud Sync (Firebase)
                    Button(
                        onClick = {
                            isSyncing = true
                            scope.launch {
                                viewModel.firebaseSyncRepository.syncAllToFirestore { success, msg ->
                                    isSyncing = false
                                    Toast.makeText(context, msg, Toast.LENGTH_LONG).show()
                                }
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = NavyDark),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.CloudSync, contentDescription = null, tint = GoldAccent)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(if (isSyncing) "Syncing to Cloud..." else Strings.get("cloud_sync", lang), color = Color.White)
                    }
                }
            }

            // 7. Session Renewal & Reset
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = NavyCard)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text("Session Lifecycle & Reset", style = MaterialTheme.typography.titleSmall.copy(color = GoldLight, fontWeight = FontWeight.Bold))

                    Button(
                        onClick = { showRenewSessionDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = NavyDark),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.Refresh, contentDescription = null, tint = GoldAccent)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(Strings.get("renew_session", lang), color = Color.White)
                    }

                    Button(
                        onClick = { showClearDataDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFB71C1C).copy(alpha = 0.8f)),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.DeleteForever, contentDescription = null, tint = Color.White)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(Strings.get("clear_data", lang), color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
