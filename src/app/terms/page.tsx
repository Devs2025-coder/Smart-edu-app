
export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-20 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold font-headline">Terms of Service</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="prose prose-lg mt-8">
        <p>
          Please read these Terms of Service ("Terms") carefully before using the EduTrack application (the "Service") operated by us.
        </p>
        
        <h2 className="text-2xl font-bold font-headline mt-8">1. Conditions of Use</h2>
        <p>
          By using this Service, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms. If you do not want to be bound by the terms of this Agreement, you are advised to leave the website accordingly.
        </p>

        <h2 className="text-2xl font-bold font-headline mt-8">2. Privacy Policy</h2>
        <p>
          Before you continue using our website, we advise you to read our privacy policy regarding our user data collection. It will help you better understand our practices.
        </p>

        <h2 className="text-2xl font-bold font-headline mt-8">3. Intellectual Property</h2>
        <p>
          You agree that all materials, products, and services provided on this Service are the property of EduTrack, its affiliates, directors, officers, employees, agents, suppliers, or licensors including all copyrights, trade secrets, trademarks, patents, and other intellectual property.
        </p>
        
        <h2 className="text-2xl font-bold font-headline mt-8">4. Limitation of Liability</h2>
        <p>
          EduTrack is not liable for any damages that may occur to you as a result of your misuse of our Service.
        </p>
        
        <h2 className="text-2xl font-bold font-headline mt-8">Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at legal@edutrack.com.
        </p>
      </div>
    </div>
  );
}
