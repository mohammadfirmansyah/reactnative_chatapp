# Security Policy

## 🔒 Reporting a Vulnerability

We take the security of React Native Chat App seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do Not

- **Do not** open a public GitHub issue for security vulnerabilities
- **Do not** disclose the vulnerability publicly until it has been addressed

### How to Report

**Please report security vulnerabilities by emailing:**
- Create a private security advisory on GitHub
- Or open a confidential issue with the `security` label

**Include the following information:**

1. **Type of vulnerability** (e.g., authentication bypass, data exposure, XSS, etc.)
2. **Full paths** of source file(s) related to the vulnerability
3. **Location** of the affected source code (tag/branch/commit or direct URL)
4. **Step-by-step instructions** to reproduce the issue
5. **Proof-of-concept or exploit code** (if possible)
6. **Impact** of the vulnerability and how it could be exploited

### What to Expect

- **Response Time**: We aim to respond within 48 hours
- **Status Updates**: We'll keep you informed about the progress
- **Credit**: We'll acknowledge your contribution (if you wish)
- **Fix Timeline**: We'll work to fix critical vulnerabilities within 7 days

## 🛡️ Supported Versions

We release security patches for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## 🔐 Security Best Practices

### Firebase Security

When deploying this app, ensure you:

1. **Enable Firebase Security Rules:**
   ```javascript
   // Firestore Rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /chats/{chatId} {
         allow read, write: if request.auth != null;
       }
       match /avatars/{avatarId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && 
                         request.resource.data.email == request.auth.token.email;
       }
     }
   }
   ```

2. **Storage Security Rules:**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /profile_pics/{imageId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null &&
                         request.resource.size < 5 * 1024 * 1024 && // 5MB limit
                         request.resource.contentType.matches('image/.*');
       }
     }
   }
   ```

3. **Enable Firebase App Check** to prevent abuse

### Environment Variables

- **Never commit** Firebase credentials to version control
- Use **environment variables** for sensitive data
- Consider using **Expo Secrets** for production

Example `.env` (not committed):
```
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_auth_domain_here
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
FIREBASE_APP_ID=your_app_id_here
```

### Input Validation

- **Validate all user inputs** before sending to Firebase
- **Sanitize text messages** to prevent XSS attacks
- **Limit file uploads** to specific types and sizes

### Authentication

- **Use strong passwords** (enforce in Firebase Auth settings)
- Enable **email verification** for new accounts
- Consider implementing **2FA** for enhanced security
- **Rate limit** authentication attempts

## 🔍 Known Security Considerations

### Current Limitations

1. **Firebase API Keys**: API keys are visible in client code (this is normal for Firebase client SDKs, but Security Rules must be properly configured)
2. **No End-to-End Encryption**: Messages are stored in plaintext in Firestore
3. **No Rate Limiting**: Consider implementing rate limiting for message sending

### Recommended Security Enhancements

For production deployment:

- [ ] Implement Firebase App Check
- [ ] Add rate limiting for API calls
- [ ] Enable email verification
- [ ] Add suspicious activity detection
- [ ] Implement message content moderation
- [ ] Add user reporting functionality
- [ ] Set up Firebase Security Monitoring
- [ ] Regular security audits
- [ ] Implement IP-based rate limiting
- [ ] Add CAPTCHA for registration

## 📚 Security Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [React Native Security Best Practices](https://reactnative.dev/docs/security)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)

## 🏆 Security Hall of Fame

We appreciate security researchers who help keep this project secure. Contributors will be listed here (with permission):

- *No vulnerabilities reported yet*

## 📞 Contact

For security concerns that don't require immediate attention, you can also:
- Open a discussion on GitHub
- Contact the maintainer: [@mohammadfirmansyah](https://github.com/mohammadfirmansyah)

Thank you for helping keep React Native Chat App secure! 🔒
