
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-20 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold font-headline">Privacy Policy</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="prose prose-lg mt-8">
        <p>
          Welcome to EduTrack. We are committed to protecting your privacy and handling your data in an open and transparent manner. This privacy policy explains how we collect, use, and share information about you when you use our services.
        </p>
        
        <h2 className="text-2xl font-bold font-headline mt-8">1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account, update your profile, or use our services. This may include:
        </p>
        <ul>
          <li>Contact information, such as your name, email address, and phone number.</li>
          <li>Academic information, such as your institution, department, and classes.</li>
          <li>Usage information, such as attendance records and task submissions.</li>
        </ul>

        <h2 className="text-2xl font-bold font-headline mt-8">2. How We Use Your Information</h2>
        <p>
          We use the information we collect to operate, maintain, and provide you with the features and functionality of our service. This includes:
        </p>
        <ul>
          <li>Authenticating your access to our services.</li>
          <li>Providing personalized features, such as task suggestions.</li>
          <li>Communicating with you about service-related announcements.</li>
        </ul>

        <h2 className="text-2xl font-bold font-headline mt-8">3. Data Security</h2>
        <p>
          We use appropriate technical and organizational measures to protect your personal information against accidental or unlawful destruction, loss, change, or damage.
        </p>

        <h2 className="text-2xl font-bold font-headline mt-8">4. Your Rights</h2>
        <p>
          You have certain rights in connection with your personal information, including the right to access, correct, or delete your information.
        </p>
        
        <h2 className="text-2xl font-bold font-headline mt-8">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at privacy@edutrack.com.
        </p>
      </div>
    </div>
  );
}
