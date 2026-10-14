package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.ui.navigation.Screen
import com.example.ui.screens.AddEditStudentScreen
import com.example.ui.screens.AttendanceScreen
import com.example.ui.screens.CertificatesScreen
import com.example.ui.screens.CollectFeeScreen
import com.example.ui.screens.CoursesScreen
import com.example.ui.screens.DashboardScreen
import com.example.ui.screens.ExpensesScreen
import com.example.ui.screens.FeeManagementScreen
import com.example.ui.screens.LoginScreen
import com.example.ui.screens.ReceiptActionScreen
import com.example.ui.screens.ReportsScreen
import com.example.ui.screens.SettingsScreen
import com.example.ui.screens.StudentDetailScreen
import com.example.ui.screens.StudentsScreen
import com.example.ui.screens.TeachersScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.NavyDark
import com.example.ui.viewmodel.AcademyViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: AcademyViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            val isDark by viewModel.isDarkTheme.collectAsState()
            val currentLang by viewModel.currentLanguage.collectAsState()
            val isRtl = currentLang == "ur" || currentLang == "sd"

            MyApplicationTheme(darkTheme = isDark) {
                CompositionLocalProvider(
                    LocalLayoutDirection provides if (isRtl) LayoutDirection.Rtl else LayoutDirection.Ltr
                ) {
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        color = NavyDark
                    ) {
                        val navController = rememberNavController()

                        NavHost(
                            navController = navController,
                            startDestination = Screen.Login.route
                        ) {
                            // Login Screen
                            composable(Screen.Login.route) {
                                LoginScreen(
                                    viewModel = viewModel,
                                    onLoginSuccess = {
                                        navController.navigate(Screen.Dashboard.route) {
                                            popUpTo(Screen.Login.route) { inclusive = true }
                                        }
                                    }
                                )
                            }

                            // Dashboard
                            composable(Screen.Dashboard.route) {
                                DashboardScreen(
                                    viewModel = viewModel,
                                    onNavigateToStudents = { navController.navigate(Screen.Students.route) },
                                    onNavigateToAddStudent = { navController.navigate(Screen.AddEditStudent.createRoute()) },
                                    onNavigateToCourses = { navController.navigate(Screen.Courses.route) },
                                    onNavigateToFeeManagement = { navController.navigate(Screen.FeeManagement.route) },
                                    onNavigateToCollectFee = { studentId ->
                                        navController.navigate(Screen.CollectFee.createRoute(studentId))
                                    },
                                    onNavigateToReceiptAction = { paymentId ->
                                        navController.navigate(Screen.ReceiptAction.createRoute(paymentId))
                                    },
                                    onNavigateToAttendance = { navController.navigate(Screen.Attendance.route) },
                                    onNavigateToTeachers = { navController.navigate(Screen.Teachers.route) },
                                    onNavigateToExpenses = { navController.navigate(Screen.Expenses.route) },
                                    onNavigateToCertificates = { navController.navigate(Screen.Certificates.route) },
                                    onNavigateToReports = { navController.navigate(Screen.Reports.route) },
                                    onNavigateToSettings = { navController.navigate(Screen.Settings.route) },
                                    onLogout = {
                                        viewModel.logout()
                                        navController.navigate(Screen.Login.route) {
                                            popUpTo(Screen.Dashboard.route) { inclusive = true }
                                        }
                                    }
                                )
                            }

                            // Students
                            composable(Screen.Students.route) {
                                StudentsScreen(
                                    viewModel = viewModel,
                                    onNavigateBack = { navController.popBackStack() },
                                    onNavigateToStudentDetail = { studentId ->
                                        navController.navigate(Screen.StudentDetail.createRoute(studentId))
                                    },
                                    onNavigateToAddStudent = {
                                        navController.navigate(Screen.AddEditStudent.createRoute())
                                    }
                                )
                            }

                            // Student Detail
                            composable(
                                route = Screen.StudentDetail.route,
                                arguments = listOf(navArgument("studentId") { type = NavType.LongType })
                            ) { backStackEntry ->
                                val studentId = backStackEntry.arguments?.getLong("studentId") ?: 0L
                                StudentDetailScreen(
                                    studentId = studentId,
                                    viewModel = viewModel,
                                    onNavigateBack = { navController.popBackStack() },
                                    onNavigateToEdit = { id ->
                                        navController.navigate(Screen.AddEditStudent.createRoute(id))
                                    },
                                    onNavigateToCollectFee = { id ->
                                        navController.navigate(Screen.CollectFee.createRoute(id))
                                    },
                                    onNavigateToReceiptAction = { paymentId ->
                                        navController.navigate(Screen.ReceiptAction.createRoute(paymentId))
                                    }
                                )
                            }

                            // Add / Edit Student
                            composable(
                                route = Screen.AddEditStudent.route,
                                arguments = listOf(
                                    navArgument("studentId") {
                                        type = NavType.StringType
                                        nullable = true
                                        defaultValue = null
                                    }
                                )
                            ) { backStackEntry ->
                                val sIdStr = backStackEntry.arguments?.getString("studentId")
                                val studentId = sIdStr?.toLongOrNull()
                                AddEditStudentScreen(
                                    studentId = studentId,
                                    viewModel = viewModel,
                                    onNavigateBack = { navController.popBackStack() }
                                )
                            }

                            // Courses
                            composable(Screen.Courses.route) {
                                CoursesScreen(
                                    viewModel = viewModel,
                                    onNavigateBack = { navController.popBackStack() }
                                )
                            }

                            // Fee Management
                            composable(Screen.FeeManagement.route) {
                                FeeManagementScreen(
                                    viewModel = viewModel,
                                    onNavigateBack = { navController.popBackStack() },
                                    onNavigateToCollectFee = {
                                        navController.navigate(Screen.CollectFee.createRoute())
                                    },
                                    onNavigateToReceiptAction = { paymentId ->
                                        navController.navigate(Screen.ReceiptAction.createRoute(paymentId))
                                    }
                                )
                            }

                            // Collect Fee
                            composable(
                                route = Screen.CollectFee.route,
                                arguments = listOf(
                                    navArgument("studentId") {
                                        type = NavType.StringType
                                        nullable = true
                                        defaultValue = null
                                    }
                                )
                            ) { backStackEntry ->
                                val sIdStr = backStackEntry.arguments?.getString("studentId")
                                val studentId = sIdStr?.toLongOrNull()
                                CollectFeeScreen(
                                    initialStudentId = studentId,
                                    viewModel = viewModel,
                                    onNavigateBack = { navController.popBackStack() },
                                    onPaymentSuccess = { paymentId ->
                                        navController.navigate(Screen.ReceiptAction.createRoute(paymentId)) {
                                            popUpTo(Screen.FeeManagement.route) { inclusive = false }
                                        }
                                    }
                                )
                            }

                            // Receipt Action
                            composable(
                                route = Screen.ReceiptAction.route,
                                arguments = listOf(navArgument("paymentId") { type = NavType.LongType })
                            ) { backStackEntry ->
                                val paymentId = backStackEntry.arguments?.getLong("paymentId") ?: 0L
                                ReceiptActionScreen(
                                    paymentId = paymentId,
                                    viewModel = viewModel,
                                    onNavigateBack = { navController.popBackStack() },
                                    onNavigateToDashboard = {
                                        navController.navigate(Screen.Dashboard.route) {
                                            popUpTo(Screen.Dashboard.route) { inclusive = true }
                                        }
                                    }
                                )
                            }

                            // Daily Attendance
                            composable(Screen.Attendance.route) {
                                AttendanceScreen(
                                    viewModel = viewModel,
                                    onNavigateBack = { navController.popBackStack() }
                                )
                            }

                            // Teachers & Salary Payments
                            composable(Screen.Teachers.route) {
                                TeachersScreen(
                                    viewModel = viewModel,
                                    onNavigateBack = { navController.popBackStack() }
                                )
                            }

                            // Expenses
                            composable(Screen.Expenses.route) {
                                ExpensesScreen(
                                    viewModel = viewModel,
                                    onNavigateBack = { navController.popBackStack() }
                                )
                            }

                            // Certificates
                            composable(Screen.Certificates.route) {
                                CertificatesScreen(
                                    viewModel = viewModel,
                                    onNavigateBack = { navController.popBackStack() }
                                )
                            }

                            // Reports
                            composable(Screen.Reports.route) {
                                ReportsScreen(
                                    viewModel = viewModel,
                                    onNavigateBack = { navController.popBackStack() }
                                )
                            }

                            // Settings
                            composable(Screen.Settings.route) {
                                SettingsScreen(
                                    viewModel = viewModel,
                                    onNavigateBack = { navController.popBackStack() }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
