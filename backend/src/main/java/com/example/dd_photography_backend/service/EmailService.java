package com.example.dd_photography_backend.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:ddphotography95@gmail.com}")
    private String fromEmail;

    /**
     * Send luxury HTML booking confirmation or status update email asynchronously.
     */
    public void sendBookingStatusEmail(
            String toEmail,
            String clientName,
            String status,
            String packageType,
            String eventDate,
            String studioPhone,
            String studioEmail
    ) {
        if (toEmail == null || toEmail.isBlank()) {
            return;
        }

        CompletableFuture.runAsync(() -> {
            try {
                boolean isConfirmed = "CONFIRMED".equalsIgnoreCase(status);
                String subject = isConfirmed
                        ? "✨ Booking Confirmed: DD Photography 95"
                        : "⚠️ Booking Status Update: DD Photography 95";

                String safeName = (clientName != null && !clientName.isBlank()) ? clientName : "Valued Client";
                String safePkg = (packageType != null && !packageType.isBlank()) ? packageType.toUpperCase() : "STANDARD TIER";
                String safeDate = (eventDate != null && !eventDate.isBlank()) ? eventDate : "Scheduled Date";
                String safePhone = (studioPhone != null && !studioPhone.isBlank()) ? studioPhone : "+94 77 123 4567";
                String safeStudioEmail = (studioEmail != null && !studioEmail.isBlank()) ? studioEmail : fromEmail;

                String htmlContent = buildBookingEmailHtml(safeName, isConfirmed, safePkg, safeDate, safePhone, safeStudioEmail);

                sendHtmlEmail(toEmail.trim(), subject, htmlContent);
                System.out.println("[EMAIL SERVICE] Dispatched booking " + status + " email to: " + toEmail);
            } catch (Exception e) {
                System.err.println("[EMAIL ERROR] Failed to send booking status email to " + toEmail + ": " + e.getMessage());
                e.printStackTrace();
            }
        });
    }

    /**
     * Send luxury HTML login notification email asynchronously for User or Admin.
     */
    public void sendLoginNotificationEmail(String toEmail, String username, String role) {
        if (toEmail == null || toEmail.isBlank()) {
            return;
        }

        CompletableFuture.runAsync(() -> {
            try {
                boolean isAdmin = "ADMIN".equalsIgnoreCase(role);
                String subject = isAdmin
                        ? "🔐 Security Alert: Administrator Logged In - DD Photography 95"
                        : "🔐 Security Notice: New Login to DD Photography 95";
                String safeName = (username != null && !username.isBlank()) ? username : (isAdmin ? "Administrator" : "Valued Member");
                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a"));

                String htmlContent = buildLoginEmailHtml(safeName, toEmail, timestamp, isAdmin);

                sendHtmlEmail(toEmail.trim(), subject, htmlContent);
                System.out.println("[EMAIL SERVICE] Dispatched " + role + " login alert email to: " + toEmail);
            } catch (Exception e) {
                System.err.println("[EMAIL ERROR] Failed to send login notification email to " + toEmail + ": " + e.getMessage());
            }
        });
    }

    /**
     * Send luxury HTML alert to Admin when a User logs in asynchronously.
     */
    public void sendAdminUserLoginAlert(String adminEmail, String username, String userEmail) {
        if (adminEmail == null || adminEmail.isBlank()) {
            return;
        }

        CompletableFuture.runAsync(() -> {
            try {
                String subject = "🔔 User Login Activity: " + username + " - DD Photography 95";
                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a"));
                String htmlContent = buildAdminUserLoginAlertHtml(username, userEmail, timestamp);

                sendHtmlEmail(adminEmail.trim(), subject, htmlContent);
                System.out.println("[EMAIL SERVICE] Dispatched user login alert to ADMIN: " + adminEmail);
            } catch (Exception e) {
                System.err.println("[EMAIL ERROR] Failed to send user login alert to admin " + adminEmail + ": " + e.getMessage());
            }
        });
    }

    public void sendLoginNotificationEmail(String toEmail, String username) {
        sendLoginNotificationEmail(toEmail, username, "USER");
    }

    /**
     * Send luxury HTML new booking notification to Admin asynchronously.
     */
    public void sendNewBookingAdminNotification(String adminEmail, String clientName, String packageType, String eventDate, String bookingId) {
        if (adminEmail == null || adminEmail.isBlank()) {
            return;
        }

        CompletableFuture.runAsync(() -> {
            try {
                String subject = "📸 New Booking Received: #" + bookingId + " - DD Photography 95";
                
                String safeName = (clientName != null && !clientName.isBlank()) ? clientName : "A Client";
                String safePkg = (packageType != null && !packageType.isBlank()) ? packageType.toUpperCase() : "STANDARD TIER";
                String safeDate = (eventDate != null && !eventDate.isBlank()) ? eventDate : "Scheduled Date";

                String htmlContent = buildNewBookingAdminHtml(safeName, safePkg, safeDate, bookingId);

                sendHtmlEmail(adminEmail.trim(), subject, htmlContent);
                System.out.println("[EMAIL SERVICE] Dispatched new booking admin notification to: " + adminEmail);
            } catch (Exception e) {
                System.err.println("[EMAIL ERROR] Failed to send new booking admin notification to " + adminEmail + ": " + e.getMessage());
            }
        });
    }

    /**
     * Internal helper to transmit HTML MimeMessage via SMTP.
     */
    private void sendHtmlEmail(String toEmail, String subject, String htmlBody) throws Exception {
        if (mailSender == null) {
            System.out.println("[EMAIL PREVIEW] (SMTP not configured in application.properties)");
            System.out.println("-----------------------------------------------------------------");
            System.out.println("TO: " + toEmail);
            System.out.println("SUBJECT: " + subject);
            System.out.println("-----------------------------------------------------------------");
            return;
        }

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom("DD Photography 95 <" + fromEmail + ">");
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);

        mailSender.send(mimeMessage);
    }

    /**
     * Luxury HTML Template for Booking Confirmation.
     */
    private String buildBookingEmailHtml(String name, boolean confirmed, String pkg, String date, String phone, String studioEmail) {
        String statusColor = confirmed ? "#28a745" : "#c04e38";
        String statusTitle = confirmed ? "BOOKING CONFIRMED" : "RESERVATION UPDATE";
        String statusMessage = confirmed
                ? "We are delighted to confirm your photography session with DD Photography 95! Our creative team is gearing up to capture your milestones with cinematic precision and elegance."
                : "Thank you for reaching out to DD Photography 95. We regret to inform you that we are fully booked on your requested date. We would be thrilled to schedule an alternative session with you.";

        return "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset='utf-8'/>"
                + "<style>"
                + "body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0c0c10; margin: 0; padding: 30px 10px; color: #FBF7F2; }"
                + ".card { max-width: 600px; margin: 0 auto; background: #14141d; border-radius: 20px; border: 1px solid rgba(181, 98, 46, 0.35); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }"
                + ".header { background: linear-gradient(135deg, #181412 0%, #2B1F17 100%); padding: 35px 30px; text-align: center; border-bottom: 2px solid #B5622E; }"
                + ".header h1 { margin: 0; font-size: 26px; letter-spacing: 3px; color: #B5622E; font-weight: 800; }"
                + ".header p { margin: 6px 0 0 0; font-size: 11px; letter-spacing: 2px; color: #D4A373; text-transform: uppercase; }"
                + ".content { padding: 35px 30px; }"
                + ".badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 12px; letter-spacing: 1px; color: #FFFFFF; background-color: " + statusColor + "; margin-bottom: 20px; }"
                + ".greeting { font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #FBF7F2; }"
                + ".message { font-size: 14px; line-height: 1.7; color: #d1d1d6; margin-bottom: 25px; }"
                + ".details-table { width: 100%; border-collapse: collapse; background: #1c1c28; border-radius: 12px; overflow: hidden; margin-bottom: 25px; }"
                + ".details-table td { padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; }"
                + ".details-table tr:last-child td { border-bottom: none; }"
                + ".details-label { color: #a1a1aa; font-weight: 600; width: 35%; }"
                + ".details-value { color: #FBF7F2; font-weight: bold; text-align: right; }"
                + ".footer { background: #0e0e14; padding: 25px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #71717a; line-height: 1.6; }"
                + ".footer a { color: #B5622E; text-decoration: none; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='card'>"
                + "  <div class='header'>"
                + "    <h1>DD PHOTOGRAPHY 95</h1>"
                + "    <p>Fine Art &bull; Cinematic Milestones &bull; Studio</p>"
                + "  </div>"
                + "  <div class='content'>"
                + "    <div class='badge'>" + statusTitle + "</div>"
                + "    <div class='greeting'>Dear " + name + ",</div>"
                + "    <div class='message'>" + statusMessage + "</div>"
                + "    <table class='details-table'>"
                + "      <tr><td class='details-label'>Package Tier</td><td class='details-value' style='color:#B5622E;'>" + pkg + "</td></tr>"
                + "      <tr><td class='details-label'>Shoot Date</td><td class='details-value'>" + date + "</td></tr>"
                + "      <tr><td class='details-label'>Studio Phone</td><td class='details-value'>" + phone + "</td></tr>"
                + "      <tr><td class='details-label'>Studio Email</td><td class='details-value'>" + studioEmail + "</td></tr>"
                + "    </table>"
                + "    <p class='message' style='font-size: 12px; color: #8e8e98;'>"
                + "      Have questions regarding mood boards, locations, or special requests? You can reply directly to this email or reach us through our in-app client chat."
                + "    </p>"
                + "  </div>"
                + "  <div class='footer'>"
                + "    &copy; " + LocalDateTime.now().getYear() + " DD Photography 95. All rights reserved.<br/>"
                + "    Precision Optical Artistry &bull; <a href='http://localhost:3000'>View Website</a>"
                + "  </div>"
                + "</div>"
                + "</body>"
                + "</html>";
    }

    /**
     * Luxury HTML Template for Login Notification Alert.
     */
    private String buildLoginEmailHtml(String username, String email, String timestamp, boolean isAdmin) {
        String badgeText = isAdmin ? "👑 ADMINISTRATOR ACCESS DETECTED" : "🔐 NEW LOGIN DETECTED";
        String badgeColor = isAdmin ? "#dc3545" : "#0d6efd";
        String headerTitle = isAdmin ? "ADMIN SECURITY ALERT" : "ACCOUNT SECURITY NOTIFICATION";
        String introMessage = isAdmin
                ? "An administrative login session was established on the DD Photography 95 Admin Console. Full system, client management, and booking authorization privileges have been unlocked for this session."
                : "You have successfully logged into your DD Photography 95 account. We are excited to assist you with your luxury photography sessions and bookings!";
        String roleDescription = isAdmin ? "Root Studio Administrator" : "Client / Member";
        String alertWarning = isAdmin
                ? "If you did not authorize this administrative sign-in, please immediately revoke credentials or change your master admin password to secure studio operations."
                : "If you did not initiate this login, please change your account password immediately or reach out to our studio administrator.";

        return "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset='utf-8'/>"
                + "<style>"
                + "body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0c0c10; margin: 0; padding: 30px 10px; color: #FBF7F2; }"
                + ".card { max-width: 580px; margin: 0 auto; background: #14141d; border-radius: 20px; border: 1px solid rgba(181, 98, 46, 0.35); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }"
                + ".header { background: linear-gradient(135deg, #181412 0%, #2B1F17 100%); padding: 30px 25px; text-align: center; border-bottom: 2px solid #B5622E; }"
                + ".header h1 { margin: 0; font-size: 24px; letter-spacing: 2px; color: #B5622E; font-weight: 800; }"
                + ".header p { margin: 5px 0 0 0; font-size: 11px; letter-spacing: 2px; color: #D4A373; text-transform: uppercase; }"
                + ".content { padding: 30px 25px; }"
                + ".badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 11px; letter-spacing: 1px; color: #FFFFFF; background-color: " + badgeColor + "; margin-bottom: 18px; }"
                + ".greeting { font-size: 17px; font-weight: bold; margin-bottom: 12px; color: #FBF7F2; }"
                + ".message { font-size: 14px; line-height: 1.7; color: #d1d1d6; margin-bottom: 22px; }"
                + ".info-box { background: #1c1c28; border-radius: 12px; padding: 16px 20px; margin-bottom: 22px; border-left: 3px solid #B5622E; }"
                + ".info-item { font-size: 13px; color: #a1a1aa; margin-bottom: 8px; display: flex; justify-content: space-between; }"
                + ".info-item:last-child { margin-bottom: 0; }"
                + ".info-item strong { color: #FBF7F2; }"
                + ".footer { background: #0e0e14; padding: 22px 25px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #71717a; line-height: 1.6; }"
                + ".footer a { color: #B5622E; text-decoration: none; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='card'>"
                + "  <div class='header'>"
                + "    <h1>DD PHOTOGRAPHY 95</h1>"
                + "    <p>" + headerTitle + "</p>"
                + "  </div>"
                + "  <div class='content'>"
                + "    <div class='badge'>" + badgeText + "</div>"
                + "    <div class='greeting'>Hello, " + username + "</div>"
                + "    <div class='message'>" + introMessage + "</div>"
                + "    <div class='info-box'>"
                + "      <div class='info-item'><span>Account / Email:</span> <strong>" + email + "</strong></div>"
                + "      <div class='info-item'><span>Role Access:</span> <strong style='color:#B5622E;'>" + roleDescription + "</strong></div>"
                + "      <div class='info-item'><span>Timestamp:</span> <strong>" + timestamp + "</strong></div>"
                + "      <div class='info-item'><span>Device / Origin:</span> <strong>Web Application (Localhost)</strong></div>"
                + "    </div>"
                + "    <p class='message' style='font-size: 12px; color: #8e8e98; margin-bottom: 0;'>"
                + "      " + alertWarning
                + "    </p>"
                + "  </div>"
                + "  <div class='footer'>"
                + "    &copy; " + LocalDateTime.now().getYear() + " DD Photography 95. All rights reserved.<br/>"
                + "    Automated Security System &bull; <a href='http://localhost:3000'>DD Photography 95 Studio</a>"
                + "  </div>"
                + "</div>"
                + "</body>"
                + "</html>";
    }

    /**
     * Luxury HTML Template for New Booking Admin Notification.
     */
    private String buildNewBookingAdminHtml(String clientName, String pkg, String date, String bookingId) {
        return "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset='utf-8'/>"
                + "<style>"
                + "body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0c0c10; margin: 0; padding: 30px 10px; color: #FBF7F2; }"
                + ".card { max-width: 600px; margin: 0 auto; background: #14141d; border-radius: 20px; border: 1px solid rgba(181, 98, 46, 0.35); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }"
                + ".header { background: linear-gradient(135deg, #181412 0%, #2B1F17 100%); padding: 35px 30px; text-align: center; border-bottom: 2px solid #B5622E; }"
                + ".header h1 { margin: 0; font-size: 26px; letter-spacing: 3px; color: #B5622E; font-weight: 800; }"
                + ".header p { margin: 6px 0 0 0; font-size: 11px; letter-spacing: 2px; color: #D4A373; text-transform: uppercase; }"
                + ".content { padding: 35px 30px; }"
                + ".badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 12px; letter-spacing: 1px; color: #FFFFFF; background-color: #B5622E; margin-bottom: 20px; }"
                + ".greeting { font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #FBF7F2; }"
                + ".message { font-size: 14px; line-height: 1.7; color: #d1d1d6; margin-bottom: 25px; }"
                + ".details-table { width: 100%; border-collapse: collapse; background: #1c1c28; border-radius: 12px; overflow: hidden; margin-bottom: 25px; }"
                + ".details-table td { padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; }"
                + ".details-table tr:last-child td { border-bottom: none; }"
                + ".details-label { color: #a1a1aa; font-weight: 600; width: 35%; }"
                + ".details-value { color: #FBF7F2; font-weight: bold; text-align: right; }"
                + ".footer { background: #0e0e14; padding: 25px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #71717a; line-height: 1.6; }"
                + ".footer a { color: #B5622E; text-decoration: none; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='card'>"
                + "  <div class='header'>"
                + "    <h1>NEW BOOKING</h1>"
                + "    <p>DD Photography 95 Admin Alert</p>"
                + "  </div>"
                + "  <div class='content'>"
                + "    <div class='badge'>ACTION REQUIRED</div>"
                + "    <div class='greeting'>Hello Admin,</div>"
                + "    <div class='message'>A new photography booking request (ID: #" + bookingId + ") has just been submitted. Please review the details below and log into the admin dashboard to confirm or reject the request.</div>"
                + "    <table class='details-table'>"
                + "      <tr><td class='details-label'>Client Name</td><td class='details-value'>" + clientName + "</td></tr>"
                + "      <tr><td class='details-label'>Package Tier</td><td class='details-value' style='color:#B5622E;'>" + pkg + "</td></tr>"
                + "      <tr><td class='details-label'>Shoot Date</td><td class='details-value'>" + date + "</td></tr>"
                + "    </table>"
                + "  </div>"
                + "  <div class='footer'>"
                + "    &copy; " + LocalDateTime.now().getYear() + " DD Photography 95. All rights reserved.<br/>"
                + "    <a href='http://localhost:3000/admin'>Go to Admin Dashboard</a>"
                + "  </div>"
                + "</div>"
                + "</body>"
                + "</html>";
    }

    /**
     * Luxury HTML Template for Admin Alert when a User Logs In.
     */
    private String buildAdminUserLoginAlertHtml(String username, String userEmail, String timestamp) {
        return "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset='utf-8'/>"
                + "<style>"
                + "body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0c0c10; margin: 0; padding: 30px 10px; color: #FBF7F2; }"
                + ".card { max-width: 580px; margin: 0 auto; background: #14141d; border-radius: 20px; border: 1px solid rgba(181, 98, 46, 0.35); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }"
                + ".header { background: linear-gradient(135deg, #181412 0%, #2B1F17 100%); padding: 30px 25px; text-align: center; border-bottom: 2px solid #B5622E; }"
                + ".header h1 { margin: 0; font-size: 24px; letter-spacing: 2px; color: #B5622E; font-weight: 800; }"
                + ".content { padding: 30px 25px; }"
                + ".badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 11px; letter-spacing: 1px; color: #FFFFFF; background-color: #0dcaf0; margin-bottom: 18px; color: #000; }"
                + ".greeting { font-size: 17px; font-weight: bold; margin-bottom: 12px; color: #FBF7F2; }"
                + ".message { font-size: 14px; line-height: 1.7; color: #d1d1d6; margin-bottom: 22px; }"
                + ".info-box { background: #1c1c28; border-radius: 12px; padding: 16px 20px; margin-bottom: 22px; border-left: 3px solid #B5622E; }"
                + ".info-item { font-size: 13px; color: #a1a1aa; margin-bottom: 8px; display: flex; justify-content: space-between; }"
                + ".info-item:last-child { margin-bottom: 0; }"
                + ".info-item strong { color: #FBF7F2; }"
                + ".footer { background: #0e0e14; padding: 22px 25px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #71717a; line-height: 1.6; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='card'>"
                + "  <div class='header'>"
                + "    <h1>DD PHOTOGRAPHY 95</h1>"
                + "    <p style='margin: 5px 0 0 0; font-size: 11px; letter-spacing: 2px; color: #D4A373; text-transform: uppercase;'>ADMIN ACTIVITY MONITOR</p>"
                + "  </div>"
                + "  <div class='content'>"
                + "    <div class='badge'>USER LOGIN ACTIVITY</div>"
                + "    <div class='greeting'>Hello Admin,</div>"
                + "    <div class='message'>A registered user has just logged into the DD Photography 95 web application.</div>"
                + "    <div class='info-box'>"
                + "      <div class='info-item'><span>Client Name:</span> <strong>" + username + "</strong></div>"
                + "      <div class='info-item'><span>Client Email:</span> <strong>" + userEmail + "</strong></div>"
                + "      <div class='info-item'><span>Timestamp:</span> <strong>" + timestamp + "</strong></div>"
                + "    </div>"
                + "  </div>"
                + "  <div class='footer'>"
                + "    &copy; " + LocalDateTime.now().getYear() + " DD Photography 95. All rights reserved."
                + "  </div>"
                + "</div>"
                + "</body>"
                + "</html>";
    }

    /**
     * Synchronous SMTP diagnostic method.
     */
    public String sendTestEmailSync(String toEmail) {
        if (mailSender == null) {
            return "ERROR: mailSender is null! Spring Boot could not configure JavaMailSender. Check spring.mail properties in application.properties.";
        }
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom("DD Photography 95 <" + fromEmail + ">");
            helper.setTo(toEmail);
            helper.setSubject("🧪 SMTP Diagnostic Test - DD Photography 95");
            helper.setText("<h3>DD Photography 95 SMTP Test</h3><p>Hello! If you receive this email, SMTP email delivery is configured and working perfectly.</p>", true);
            mailSender.send(mimeMessage);
            return "SUCCESS: Email sent successfully to " + toEmail;
        } catch (Exception e) {
            e.printStackTrace();
            return "SMTP ERROR: " + e.getClass().getName() + ": " + e.getMessage() + (e.getCause() != null ? " [Cause: " + e.getCause().getMessage() + "]" : "");
        }
    }

    /**
     * Send OTP Verification Email asynchronously.
     */
    public void sendOtpEmail(String toEmail, String otpCode) {
        if (toEmail == null || toEmail.isBlank()) return;
        CompletableFuture.runAsync(() -> {
            try {
                String subject = "🔑 Your Verification Code: " + otpCode;
                String htmlContent = buildOtpEmailHtml(otpCode);
                sendHtmlEmail(toEmail.trim(), subject, htmlContent);
                System.out.println("[EMAIL SERVICE] Dispatched OTP email to: " + toEmail);
            } catch (Exception e) {
                System.err.println("[EMAIL ERROR] Failed to send OTP to " + toEmail + ": " + e.getMessage());
            }
        });
    }

    private String buildOtpEmailHtml(String otpCode) {
        return "<!DOCTYPE html><html><head><meta charset='utf-8'/><style>body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0c0c10; margin: 0; padding: 30px 10px; color: #FBF7F2; } .card { max-width: 580px; margin: 0 auto; background: #14141d; border-radius: 20px; border: 1px solid rgba(181, 98, 46, 0.35); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5); } .header { background: linear-gradient(135deg, #181412 0%, #2B1F17 100%); padding: 30px 25px; text-align: center; border-bottom: 2px solid #B5622E; } .header h1 { margin: 0; font-size: 24px; letter-spacing: 2px; color: #B5622E; font-weight: 800; } .content { padding: 40px 25px; text-align: center; } .otp-box { background: #1c1c28; border-radius: 12px; padding: 20px; margin: 25px auto; width: 60%; font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #B5622E; border: 1px dashed #B5622E; } .message { font-size: 15px; line-height: 1.7; color: #d1d1d6; } .footer { background: #0e0e14; padding: 22px 25px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #71717a; } </style></head><body><div class='card'> <div class='header'> <h1>DD PHOTOGRAPHY 95</h1> <p style='margin: 5px 0 0 0; font-size: 11px; letter-spacing: 2px; color: #D4A373; text-transform: uppercase;'>ACCOUNT VERIFICATION</p> </div> <div class='content'> <div class='message'>Thank you for signing up! Please use the verification code below to complete your registration. This code will expire in 10 minutes.</div> <div class='otp-box'>" + otpCode + "</div> <div class='message' style='font-size: 12px; color: #8e8e98;'>If you did not request this, please ignore this email.</div> </div> <div class='footer'> &copy; " + java.time.LocalDateTime.now().getYear() + " DD Photography 95. All rights reserved. </div></div></body></html>";
    }
}
