import Header2 from "/src/components/Header2";
import { useEffect, useState } from "react";
import { useBackgroundColor } from "../../contexts/BackgroundColorContext.jsx";
import { StatusBar, Style } from "@capacitor/status-bar";

export default function PrivacyPolicy() {
  const [ready, setReady] = useState(false);
  const { setBackgroundColor } = useBackgroundColor();

  useEffect(() => {
    window.scrollTo(0, 0);
    setReady(true);

    // Set purple background + white icons for status bar
    if (window.Capacitor || window.capacitor) {
      StatusBar.setBackgroundColor({ color: "#A20BA2" });
      StatusBar.setStyle({ style: Style.Dark }); // white icons
    }
  }, [setBackgroundColor]);

  if (!ready) return null;
  const privacyPolicy = [
    {
      section: "1. Definitions",
      content: [
        '"Personal Data" refers to any information relating to an identified or identifiable natural person.',
        '"User" or "you" means any individual who accesses or uses the Platform, including Hosts and Guests.',
        '"Host" refers to a user who lists or offers a property for short-term rental.',
        '"Guest" refers to a user who books or intends to book a property on the Platform.',
        '"Processing" refers to any operation performed on personal data, including collection, use, storage, disclosure, or deletion.',
      ],
    },
    {
      section: "2. Scope of This Policy",
      content: [
        "This Policy applies to:",
        "- Visitors, registered users, and account holders on our Platform;",
        "- All personal data collected through the Platform;",
        "- Offline communications related to our Platform services (e.g., support calls, emails, KYC follow-ups).",
      ],
    },
    {
      section: "3. Types of Data We Collect",
      content: [
        "We collect various categories of information to operate effectively. The data we collect falls into the following categories:",
        "",
        "A. Information You Provide Directly",
        "1. Account Registration Data",
        "- Full name",
        "- Email address",
        "- Phone number",
        "- Password",
        "- Gender (optional)",
        "- Profile picture (optional)",
        "",
        "2. Property Listing Information (For Hosts)",
        "- Property address",
        "- Photos and videos",
        "- Amenities and features",
        "- Listing title and description",
        "- Pricing and availability",
        "- Consent form or proof of ownership/tenancy",
        "- Government-issued identification",
        "- Utility bill or proof of address",
        "",
        "3. Booking & Payment Data",
        "- Guest information (name, contact details)",
        "- Booking history",
        "- Check-in/check-out dates",
        "- Escrow deposits and release status",
        "- Preferred payment methods (note: we do not store card numbers)",
        "",
        "4. Communication Data",
        "- Messages between Hosts and Guests",
        "- Support tickets and call recordings",
        "- Feedback, reviews, and ratings",
        "",
        "B. Information We Automatically Collect",
        "1. Device and Technical Data",
        "- IP address",
        "- Browser type and version",
        "- Operating system and platform",
        "- Device type and identifiers",
        "- Language preference",
        "- Session duration and time zone",
        "",
        "2. Usage Data",
        "- Page views and navigation paths",
        "- Clickstream behavior",
        "- Referring websites",
        "- Error logs and crash reports",
        "",
        "C. Information from Third Parties",
        "- Identity verification and KYC partners",
        "- Payment service providers",
        "- Social media plugins (if used for login)",
        "- Marketing and analytics partners",
      ],
    },
    {
      section: "4. Legal Basis for Processing (Under NDPR)",
      content: [
        "We collect and process personal data on the following lawful bases:",
        "- Consent: Email marketing subscriptions, optional features.",
        "- Contractual necessity: Facilitating bookings, escrow processing.",
        "- Legal obligation: Tax reporting, law enforcement requests.",
        "- Legitimate interest: Platform improvement, fraud prevention.",
        "- Vital interests: Emergency contact and guest safety.",
      ],
    },
    {
      section: "5. Purpose of Data Processing",
      content: [
        "We use your information for the following purposes:",
        "- Account management: Creating and maintaining user accounts.",
        "- Property listings: Enabling Hosts to publish and manage rental properties.",
        "- Booking and payments: Facilitating secure transactions and escrow deposits.",
        "- Fraud detection: Verifying identities and detecting suspicious activity.",
        "- Customer support: Responding to queries and resolving complaints.",
        "- Communications: Sending confirmations, reminders, and updates.",
        "- Marketing and promotions: With user consent, sending promotional emails or platform updates.",
        "- Compliance: Fulfilling tax, anti-money laundering, and other legal obligations.",
      ],
    },
    {
      section: "6. Information Sharing and Disclosure",
      content: [
        "We do not sell your personal information. We only share your data in the following circumstances:",
        "",
        "A. With Other Users",
        "- Contact details of Hosts and Guests (only after booking confirmation).",
        "- Reviews, ratings, and property-related comments.",
        "",
        "B. With Third-Party Service Providers",
        "- Payment processors (e.g., Flutterwave, Paystack).",
        "- Identity verification companies (e.g., Smile Identity).",
        "- Cloud hosting providers.",
        "- Customer service software.",
        "- Analytics tools (e.g., Google Analytics).",
        "",
        "C. With Regulators or Law Enforcement",
        "- Upon lawful requests from government or judicial authorities.",
        "- When disclosure is required to prevent fraud or imminent harm.",
        "",
        "D. In Business Transfers",
        "- In case of merger, acquisition, sale, or transfer of assets, user data may be part of the transaction.",
      ],
    },
    {
      section: "7. Data Storage and Retention",
      content: [
        "Your data is stored securely on servers in Nigeria and/or regions with adequate data protection safeguards.",
        "We retain data for as long as necessary to:",
        "- Fulfill contractual obligations.",
        "- Meet regulatory or legal requirements.",
        "- Protect our legitimate interests.",
        "",
        "Booking, KYC, and transaction records may be retained for 7 years in compliance with regulatory requirements.",
      ],
    },
    {
      section: "8. Security Measures",
      content: [
        "We apply industry-standard safeguards to protect personal data, including:",
        "- SSL encryption for data transmission.",
        "- Data encryption at rest and in transit.",
        "- Access control to restrict internal access.",
        "- Two-factor authentication (2FA) for critical operations.",
        "- Daily backups and system monitoring.",
        "- Periodic security audits.",
        "",
        "Please note: no method of transmission over the Internet or electronic storage is 100% secure.",
      ],
    },
    {
      section: "9. User Rights and Choices",
      content: [
        "Under NDPR and applicable laws, you have the following rights:",
        "- Right of Access – You can request a copy of your data.",
        "- Right to Rectification – You can correct inaccurate data.",
        "- Right to Deletion – You can request deletion (subject to legal and contractual exceptions).",
        "- Right to Object or Restrict – You may object to processing based on legitimate interest or restrict certain uses.",
        "- Right to Data Portability – You can request to transfer your data in a machine-readable format.",
        "- Right to Withdraw Consent – Where consent is the legal basis for processing.",
        "",
        "To exercise any of your rights, contact: hello@letora.com.ng",
      ],
    },
    {
      section: "10. Cookies and Tracking Technologies",
      content: [
        "We use cookies to enhance user experience. Types of cookies include:",
        "- Essential cookies – For core platform functionality.",
        "- Analytics cookies – For traffic and usage monitoring.",
        "- Preference cookies – For saving user settings.",
        "- Third-party cookies – For integrations (e.g., Google Analytics).",
        "",
        "Users can manage or disable cookies through their browser settings.",
      ],
    },
    {
      section: "11. Children's Privacy",
      content: [
        "Our platform is not intended for users under 18 years of age.",
        "We do not knowingly collect data from minors. If we discover that a minor has submitted data, we will delete it immediately.",
      ],
    },
    {
      section: "12. International Data Transfers",
      content: [
        "If your data is transferred outside Nigeria, we ensure that:",
        "- The destination country has adequate data protection laws; or",
        "- We implement contractual safeguards and obtain your explicit consent.",
      ],
    },
    {
      section: "13. Updates to This Privacy Policy",
      content: [
        "We may update this Policy periodically. If changes are material:",
        "- We will notify users via email and/or in-platform banners.",
        "- The updated version will always be published on our website.",
        "",
        "You are advised to review this Policy regularly.",
      ],
    },
    {
      section: "14. Contact Information",
      content: [
        "If you have questions, concerns, or complaints regarding this Privacy Policy or our data practices, contact:",
        "Email: hello@letora.ng",
      ],
    },
    {
      section: "15. Governing Law and Jurisdiction",
      content: [
        "This Privacy Policy shall be governed by the laws of the Federal Republic of Nigeria.",
        "Any disputes arising shall be subject to the exclusive jurisdiction of Nigerian courts.",
      ],
    },
  ];

  return (
    <div>
      <Header2 title="Privacy Policy" />
      <div className="text-[#000000] mt-[28px] pb-[124px]">
        <div className="space-y-6 mb-[70px]">
          {privacyPolicy.map((term, index) => (
            <div key={index} className="px-6 rounded-lg">
              <h2 className="font-medium text-[13px] mb-4">{term.section}</h2>
              <div className="space-y-3 text-[#505050] text-sm leading-[1.5]">
                {term.content.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className={
                      paragraph.startsWith("   -")
                        ? "ml-6"
                        : paragraph.startsWith("-")
                        ? "ml-4"
                        : paragraph.match(/^[A-Z]\./)
                        ? "ml-2"
                        : paragraph.match(/^[0-9]\./)
                        ? "ml-2"
                        : ""
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
