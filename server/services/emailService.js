import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"LearnHub LMS" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f8fafc;padding:40px 20px;">
      <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:30px;border-radius:16px 16px 0 0;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:28px;">🎓 LearnHub</h1>
        <p style="color:#e2e8f0;margin:8px 0 0;">Learning Management System</p>
      </div>
      <div style="background:#fff;padding:40px 30px;border-radius:0 0 16px 16px;box-shadow:0 4px 6px rgba(0,0,0,.07);">
        <h2 style="color:#1e293b;margin:0 0 16px;">Verify Your Email</h2>
        <p style="color:#64748b;line-height:1.6;">Hi <strong>${user.name}</strong>,</p>
        <p style="color:#64748b;line-height:1.6;">Welcome to LearnHub! Please verify your email address by clicking the button below:</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${verificationUrl}" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:14px 40px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">Verify Email</a>
        </div>
        <p style="color:#94a3b8;font-size:13px;">This link will expire in 24 hours. If you didn't create an account, please ignore this email.</p>
      </div>
    </div>
  `;

  await sendEmail({ to: user.email, subject: 'Verify Your Email - LearnHub', html });
};

export const sendResetPasswordEmail = async (user, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f8fafc;padding:40px 20px;">
      <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:30px;border-radius:16px 16px 0 0;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:28px;">🎓 LearnHub</h1>
        <p style="color:#e2e8f0;margin:8px 0 0;">Learning Management System</p>
      </div>
      <div style="background:#fff;padding:40px 30px;border-radius:0 0 16px 16px;box-shadow:0 4px 6px rgba(0,0,0,.07);">
        <h2 style="color:#1e293b;margin:0 0 16px;">Reset Your Password</h2>
        <p style="color:#64748b;line-height:1.6;">Hi <strong>${user.name}</strong>,</p>
        <p style="color:#64748b;line-height:1.6;">We received a request to reset your password. Click the button below to set a new password:</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${resetUrl}" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:14px 40px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">Reset Password</a>
        </div>
        <p style="color:#94a3b8;font-size:13px;">This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.</p>
      </div>
    </div>
  `;

  await sendEmail({ to: user.email, subject: 'Reset Your Password - LearnHub', html });
};

export const sendEnrollmentEmail = async (user, course) => {
  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f8fafc;padding:40px 20px;">
      <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:30px;border-radius:16px 16px 0 0;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:28px;">🎓 LearnHub</h1>
      </div>
      <div style="background:#fff;padding:40px 30px;border-radius:0 0 16px 16px;box-shadow:0 4px 6px rgba(0,0,0,.07);">
        <h2 style="color:#1e293b;margin:0 0 16px;">🎉 Enrollment Confirmed!</h2>
        <p style="color:#64748b;line-height:1.6;">Hi <strong>${user.name}</strong>,</p>
        <p style="color:#64748b;line-height:1.6;">You have been successfully enrolled in <strong>${course.title}</strong>.</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${process.env.CLIENT_URL}/courses/${course._id}" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:14px 40px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">Start Learning</a>
        </div>
      </div>
    </div>
  `;

  await sendEmail({ to: user.email, subject: `Enrollment Confirmed - ${course.title}`, html });
};
