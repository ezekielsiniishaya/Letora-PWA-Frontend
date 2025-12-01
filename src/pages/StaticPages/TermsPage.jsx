import { useEffect, useState } from "react";
import Header2 from "../../components/Header2";
import { useBackgroundColor } from "../../contexts/BackgroundColorContext.jsx";
import { StatusBar, Style } from "@capacitor/status-bar";

export default function TermsPage() {
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
  const termsAndConditions = [
    {
      section: "Platform Overview & Scope of Services",
      content: [
        "Letora is a peer-to-peer (P2P) shortlet marketplace that facilitates the listing, discovery, booking, and payment of short-term rental spaces in Nigeria.",
        "We provide a web-based interface that enables: ",
        '- Verified property owners or legally authorized custodians ("Hosts") to publish property listings ("Listings").',
        '- End users ("Guests") to browse available properties and make reservations for short-term use.',
        "- Secure transactional systems, including payment escrow, security deposit management, and dispute mediation.",
        "",
        "We do not own, control, manage, or operate any properties listed on the Platform. Our role is solely that of a neutral intermediary between Guests and Hosts.",
      ],
    },
    {
      section: "1. Definitions",
      content: [
        '"Letora" – the shortlet platform and its affiliated services.',
        '"Guest" – any individual booking an apartment through Letora.',
        '"Host" – an apartment owner or manager listing properties on Letora.',
        '"Booking" – a confirmed stay initiated via the Letora platform.',
        '"Payment Confirmation" – the point at which Letora confirms receipt of the guest’s payment into escrow.',
        '"Check-In" – the moment the guest gains access to the property.',
        '"Checkout" – the end of a booking cycle as defined by Letora policies.',
        '"Dispute" – any disagreement between guest and host regarding the booking, stay, or property condition.',
        '"Convenience Fee" – a non-refundable fee charged by Letora for platform services.',
        '"Security Deposit" – an amount set by the host to protect against property damage or violations.',
      ],
    },
    {
      section: "2. Acceptance of Terms",
      content: [
        "By accessing or using Letora, Guests and Hosts agree to comply with these Terms and Conditions.",
        "Users acknowledge that any violation of these Terms may result in restricted access, account suspension, or legal action.",
        "Letora reserves the right to update these Terms at any time. Continued use of the platform constitutes acceptance of the updated Terms.",
      ],
    },
    {
      section: "3. Booking Policy",
      content: [
        "All bookings are same-day bookings.",
        "Bookings are confirmed immediately upon payment verification.",
        "Once payment is confirmed, bookings are active and non-transferable.",
        "Guests must acknowledge the non-refundable convenience fee and host security deposit before completing payment.",
      ],
    },
    {
      section: "4. Convenience Fee",
      content: [
        "Letora charges a non-refundable convenience fee of ₦2,500 per booking.",
        "This fee is collected upfront and retained by Letora under all circumstances, including cancellations or disputes.",
        "The convenience fee is separate from the booking amount and does not reduce the host payout.",
      ],
    },
    {
      section: "5. Host Security Deposit",
      content: [
        "Hosts may set a security deposit amount, which is displayed in the listing.",
        "Security deposits are collected upfront along with the booking payment and held in escrow.",
        "Security deposits are refundable to the guest after checkout, minus deductions for property damage, missing items, or violation of house rules.",
        "Hosts must provide evidence for any deductions within 24 hours of checkout.",
        "Disputes over security deposit deductions are handled via Letora’s Dispute Resolution System.",
      ],
    },
    {
      section: "6. Check-In Policy",
      content: [
        "Guests are considered checked in immediately upon payment confirmation.",
        "Hosts must ensure the property is ready at check-in.",
        "Early check-in beyond payment confirmation is not applicable.",
        "Hosts must provide access as agreed in the listing; failure to do so may result in compensation to the guest.",
      ],
    },
    {
      section: "7. Checkout Policy",
      content: [
        "Standard checkout time is 12:00 PM (noon) the day after booking.",
        "Bookings confirmed after 6:00 PM are eligible for extended checkout at 6:00 PM the following day.",
        "Guests must vacate the property by the applicable checkout time.",
        "Hosts are prohibited from entering the property before checkout unless agreed upon in writing via Letora.",
      ],
    },
    {
      section: "8. Cancellation & Refund Policy",
      content: [
        "Guests may cancel within 1 hour of payment confirmation for a full refund, excluding Letora’s convenience fee.",
        "After 1 hour, Day 1 is considered used. The host receives payout for Day 1 and Letora retains its 10% platform fee.",
        "The guest is refunded for any remaining unused days.",
        "Security deposits cancelled within 1 hour are fully refundable. After 1 hour, deposit handling follows daily payout rules and any unused portion is refunded to the guest.",
        "Refunds are processed via Letora’s escrow system only.",
        "Hosts who cancel after a booking has been confirmed may face penalties and account restrictions.",
        "All disputes regarding cancellations or deposits are handled via Letora’s Dispute Resolution System.",
      ],
    },
    {
      section: "9. Payment & Payout Policy",
      content: [
        "Guests pay the full booking amount, security deposit, and convenience fee upfront into Letora escrow.",
        "Letora deducts a 10% platform fee from the booking amount, excluding the convenience fee and security deposit.",
        "Host payouts are based on daily usage of the property.",
        "Funds are released to the host for each day used, according to the daily payout schedule.",
        "Letora is not responsible for refunds or host payments made outside the platform.",
      ],
    },
    {
      section: "10. Guest Responsibilities",
      content: [
        "Guests must follow house rules and vacate the property by checkout time.",
        "Guests must report property issues or disputes via Letora immediately.",
        "Guests must not cause property damage, engage in illegal activity, or harass the host or neighbors.",
      ],
    },
    {
      section: "11. Host Responsibilities",
      content: [
        "Hosts must ensure the property is ready, safe, and accurately represented in the listing.",
        "Hosts must provide access at check-in as described on Letora.",
        "Hosts may set a security deposit for protection against damages or violations.",
        "Hosts must honor all bookings confirmed through Letora.",
        "Hosts must comply with local laws and regulations regarding shortlet rentals.",
      ],
    },
    {
      section: "12. Dispute Resolution",
      content: [
        "Guests and hosts may submit disputes via the Letora app within 24 hours of an incident or checkout, as applicable.",
        "Letora reviews all evidence submitted by both parties and determines a final resolution.",
        "Letora may withhold payouts or issue refunds based on dispute outcomes.",
      ],
    },
    {
      section: "13. Liability",
      content: [
        "Letora is not responsible for property damages, theft, injury, or accidents that occur during a stay.",
        "Letora does not guarantee property quality beyond listing verification and basic compliance checks.",
        "Guests and hosts agree to indemnify Letora for claims arising from their actions, omissions, or misuse of the platform.",
      ],
    },
    {
      section: "14. Termination of Service",
      content: [
        "Letora may suspend or terminate accounts for violations of these Terms, fraudulent activity, or non-compliance with platform rules.",
        "Users may terminate their account, but must honor all confirmed bookings and payment obligations made prior to termination.",
      ],
    },
    {
      section: "15. Governing Law",
      content: [
        "These Terms are governed by the laws of the Federal Republic of Nigeria.",
        "Legal disputes are subject to the jurisdiction of the courts of Nigeria.",
      ],
    },
    {
      section: "16. Contact",
      content: [
        "For questions, disputes, or support, contact Letora at:",
        "Email: support@letora.ng",
      ],
    },
  ];

  return (
    <div>
      <Header2 title="Terms and Conditions" />
      <div className="text-[#000000] mt-[28px] mb-[124px]">
        <div className="space-y-6 pb-[70px]">
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
