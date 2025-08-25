import { useEffect, useState } from "react";
import Header2 from "../../components/Header2";
export default function TermsPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    setReady(true);
  }, []);

  if (!ready) return null; // prevent render until scroll is set

  const termsAndConditions = [
    {
      section: "1. Platform Overview & Scope of Services",
      content: [
        "Letora is a peer-to-peer (P2P) shortlet marketplace that facilitates the listing, discovery, booking, and payment of short-term rental spaces in Nigeria. We provide a web-based interface that enables:",
        "- Verified property owners or legally authorized custodians ('Hosts') to publish property listings ('Listings').",
        "- End users ('Guests') to browse available properties and make reservations for short-term use.",
        "- Secure transactional systems, including payment escrow, security deposit management, and dispute mediation.",
        "",
        "We do not own, control, manage, or operate any properties listed on the Platform. Our role is solely that of a neutral intermediary between Guests and Hosts.",
      ],
    },
    {
      section: "2. Eligibility & Jurisdiction",
      content: [
        "To use this Platform, you must:",
        "- Be at least 18 years of age;",
        "- Possess legal capacity to enter into binding contracts;",
        "- Not be a person barred from using digital marketplaces under Nigerian law;",
        "- Use the platform for personal or business use in compliance with these Terms.",
        "",
        "The Platform operates under the laws and jurisdiction of the Federal Republic of Nigeria.",
      ],
    },
    {
      section: "3. Account Creation and Access",
      content: [
        "a. Guest Account:",
        "Guests may browse listings without registering. However, to reserve a property or initiate a transaction, the Guest must create a verified account with full legal name, valid contact details, and identification.",
        "",
        "b. Host Account:",
        "To list properties, Hosts must register, provide identification, proof of property ownership or authorization, and agree to platform rules and verification processes.",
      ],
    },
    {
      section: "4. Listing Properties (Host Obligations)",
      content: [
        "Hosts agree to provide accurate and truthful listing information, maintain availability, and ensure properties comply with Nigerian rental laws. Listings are subject to verification, and fraudulent behavior may result in penalties or legal action.",
      ],
    },
    {
      section: "5. Booking Process (Guest Obligations)",
      content: [
        "Guests must pay upfront, respect property rules, provide identification when required, and acknowledge potential forfeiture of security deposit for rule violations or damages.",
      ],
    },
    {
      section: "6. Platform Fees & Disbursements",
      content: [
        "Guests: N2,500 convenience fee + N100,000 refundable security deposit as set by the host.",
        "Hosts: 10% commission on bookings.",
        "Disbursements follow a 24-hour post check-in review window.",
      ],
    },
    {
      section: "7. Security Deposit Protocol",
      content: [
        "Deposits are held to cover damages or breaches. Hosts may submit evidence of issues post-checkout to claim part or all of the deposit.",
      ],
    },
    {
      section: "8. Cancellation & Refund Policy",
      content: [
        "Flexible, Moderate, and Strict cancellation policies apply based on Host selection. Guest cancellations and Host-initiated refunds are subject to specific rules and timelines.",
      ],
    },
    {
      section: "9. Prohibited Conduct",
      content: [
        "Users may not circumvent escrow, list misleading content, or engage in harassment or illegal activity.",
      ],
    },
    {
      section: "10. Intellectual Property",
      content: [
        "All content is protected under Nigerian copyright law. Unauthorized use or reproduction is prohibited.",
      ],
    },
    {
      section: "11. Liability Limitation & Indemnification",
      content: [
        "We are not liable for property damage, injury, or misconduct. Users agree to indemnify us against legal claims arising from platform misuse.",
      ],
    },
    {
      section: "12. Termination of Use",
      content: [
        "We reserve the right to suspend or terminate accounts in breach of terms, withhold payments, and modify services without prior notice.",
      ],
    },
    {
      section: "13. Dispute Resolution",
      content: [
        "Disputes are resolved via internal mediation using submitted evidence. Platform decisions are final within legal limits.",
      ],
    },
    {
      section: "14. Changes to Terms",
      content: [
        "Terms may be updated without prior notice. Continued use signifies agreement to updated terms.",
      ],
    },
    {
      section: "15. Governing Law & Jurisdiction",
      content: [
        "These Terms are governed by Nigerian law. Disputes fall under Lagos State court jurisdiction.",
      ],
    },
    {
      section: "16. Contact Information",
      content: [
        "Email: support@letora.com",
        "Phone: +234-800-000-0000",
        "Address: 123 Letora Plaza, Victoria Island, Lagos, Nigeria",
      ],
    },
  ];

  return (
    <div>
      <Header2 title="Terms and Conditions" />
      <div className="text-[#000000] mt-[28px] mb-[124px]">
        <div className="space-y-6 mb-[70px]">
          {termsAndConditions.map((term, index) => (
            <div key={index} className="px-6 rounded-lg">
              <h2 className="font-medium text-[13px] mb-4">{term.section}</h2>
              <div className="space-y-3 text-[#505050] text-sm leading-[1.5]">
                {term.content.map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
