package com.example.service

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.telephony.SmsManager
import android.telephony.SubscriptionInfo
import android.telephony.SubscriptionManager
import androidx.core.content.ContextCompat
import com.example.data.model.AcademySettings
import com.example.data.model.FeePayment
import java.util.Locale

class SmsService(private val context: Context) {

    fun formatReceiptMessage(
        template: String,
        payment: FeePayment,
        settings: AcademySettings
    ): String {
        return template
            .replace("{student_name}", payment.studentName)
            .replace("{course_name}", payment.courseName)
            .replace("{paid_amount}", String.format(Locale.US, "%,.0f", payment.paidAmount))
            .replace("{total_fee}", String.format(Locale.US, "%,.0f", payment.totalFee))
            .replace("{previous_paid}", String.format(Locale.US, "%,.0f", payment.previousPaid))
            .replace("{remaining_fee}", String.format(Locale.US, "%,.0f", payment.remainingFee))
            .replace("{receipt_no}", payment.receiptNo)
            .replace("{academy_name}", settings.academyName)
    }

    @SuppressLint("MissingPermission")
    fun getAvailableSims(): List<Pair<Int, String>> {
        val list = mutableListOf<Pair<Int, String>>()
        list.add(-1 to "System Default SIM")

        if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED) {
            try {
                val sm = context.getSystemService(Context.TELEPHONY_SUBSCRIPTION_SERVICE) as? SubscriptionManager
                sm?.activeSubscriptionInfoList?.forEach { info: SubscriptionInfo ->
                    val carrierName = info.carrierName?.toString() ?: "SIM ${info.simSlotIndex + 1}"
                    val slot = info.simSlotIndex
                    list.add(slot to "$carrierName (Slot ${slot + 1})")
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        return list
    }

    @SuppressLint("MissingPermission")
    fun sendDirectSms(
        phoneNumber: String,
        message: String,
        preferredSimSlot: Int = -1
    ): Boolean {
        if (phoneNumber.isBlank() || message.isBlank()) return false
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.SEND_SMS) != PackageManager.PERMISSION_GRANTED) {
            return false
        }

        return try {
            val smsManager: SmsManager = if (preferredSimSlot >= 0 && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                var chosenManager: SmsManager? = null
                if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED) {
                    val sm = context.getSystemService(Context.TELEPHONY_SUBSCRIPTION_SERVICE) as? SubscriptionManager
                    val subInfo = sm?.activeSubscriptionInfoList?.firstOrNull { it.simSlotIndex == preferredSimSlot }
                    if (subInfo != null) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                            val defaultMgr = context.getSystemService(SmsManager::class.java)
                            chosenManager = defaultMgr?.createForSubscriptionId(subInfo.subscriptionId)
                        } else {
                            @Suppress("DEPRECATION")
                            chosenManager = SmsManager.getSmsManagerForSubscriptionId(subInfo.subscriptionId)
                        }
                    }
                }
                chosenManager ?: getDefaultSmsManager()
            } else {
                getDefaultSmsManager()
            }

            val parts = smsManager.divideMessage(message)
            if (parts.size > 1) {
                smsManager.sendMultipartTextMessage(phoneNumber, null, parts, null, null)
            } else {
                smsManager.sendTextMessage(phoneNumber, null, message, null, null)
            }
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    private fun getDefaultSmsManager(): SmsManager {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            context.getSystemService(SmsManager::class.java)
        } else {
            @Suppress("DEPRECATION")
            SmsManager.getDefault()
        }
    }

    fun openSmsAppFallback(phoneNumber: String, message: String) {
        try {
            val intent = Intent(Intent.ACTION_SENDTO).apply {
                data = Uri.parse("smsto:${Uri.encode(phoneNumber)}")
                putExtra("sms_body", message)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun sendPaymentSms(
        to: String,
        payment: FeePayment,
        lang: String = "en",
        simSlot: Int = -1,
        academyName: String = "Al Ghazi Digital Institute"
    ): Boolean {
        val message = when (lang) {
            "ur" -> "محترم والدین! الغازی ڈیجیٹل انسٹیٹیوٹ میں ${payment.studentName} کی فیس ${payment.paidAmount.toInt()} روپے بذریعہ رسید #${payment.receiptNo} وصول ہوگئی ہے۔ بقیہ فیس: ${payment.remainingFee.toInt()} روپے ہے۔ شکریہ۔"
            "sd" -> "محترم والدين! الغازي ڊجيٽل انسٽيٽيوٽ ۾ ${payment.studentName} جي فيس ${payment.paidAmount.toInt()} روپيا رسيد #${payment.receiptNo} ذريعي وصول ٿي وئي آهي. باقي فيس: ${payment.remainingFee.toInt()} روپيا. مهرباني."
            else -> "Dear Parent, fee of PKR ${payment.paidAmount.toInt()} received for ${payment.studentName} (${payment.courseName}). Receipt #${payment.receiptNo}. Balance: PKR ${payment.remainingFee.toInt()}. Thank you, $academyName."
        }
        val sent = sendDirectSms(to, message, simSlot)
        if (!sent) {
            openSmsAppFallback(to, message)
        }
        return sent
    }
}

