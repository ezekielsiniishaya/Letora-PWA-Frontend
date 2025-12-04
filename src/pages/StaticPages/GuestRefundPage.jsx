import Header from "/src/components/Header";
import Footer from "/src/components/Footer";
import { useEffect, useState } from "react";
import { useBackgroundColor } from "../../contexts/BackgroundColorContext.jsx";
import { StatusBar, Style } from "@capacitor/status-bar";

export default function GuestRefundPolicyPage() {
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
  const refundPolicy = [
    {
      section: "Introduction",
      content: [
        "This Guest Refund Policy ('Policy') forms part of the Terms of Use of the Letora Platform and constitutes a legally binding agreement between:",
        "1. Letora Technologies Limited ('Letora', 'we', 'our', or 'us'), operator of the Letora booking platform; and",
        "2. Users ('Guest', 'Host', or collectively 'Users') who make or accept bookings on the platform.",
        "",
        "By making a booking or accepting one, you acknowledge that you have read, understood, and agree to be bound by this Policy.",
      ],
    },
    {
      section: "1. Definitions",
      content: [
        "For the purposes of this Policy:",
        "- 'Booking Amount' means the total accommodation payment made by the Guest, excluding the non-refundable convenience fee.",
        "- 'Convenience Fee' means the fixed ₦2,500 charge applied to all bookings, which is non-refundable under all circumstances.",
        "- 'Security Deposit' means the refundable amount collected by Letora at the time of booking as protection against damages, theft, or breaches of house rules.",
        "- 'Booking Date' means the date on which payment is made and the stay period begins.",
        "- 'Damage' means any loss, destruction, or impairment of property beyond normal wear and tear.",
      ],
    },
    {
      section: "2. Cancellation Policy",
      content: [
        "2.1 No Advance Reservations",
        "Letora does not offer advance reservations. All bookings commence on the Booking Date. The booking period begins immediately and cannot be rescheduled to a later date.",
        "",
        "2.2 Guest-Initiated Cancellations",
        "(a) Within 1 Hour of Booking (Before Check-In): Guest may cancel and receive a refund of the Booking Amount and Security Deposit. The ₦2,500 Convenience Fee is strictly non-refundable.",
        "(b) After 1 Hour of Booking: The Booking Amount for the current day is non-refundable. Any remaining unused days may be refunded only if:",
        "   - The Guest has not yet stayed those days;",
        "   - The Host provides written consent; and",
        "   - The Guest vacates the property immediately.",
        "In all cases, the Convenience Fee is non-refundable.",
        "",
        "2.3 Host-Initiated Cancellations",
        "If the Host cancels after booking confirmation, the Guest will receive a refund of the Booking Amount and Security Deposit. The Convenience Fee remains non-refundable.",
      ],
    },
    {
      section: "3. Booking Refund Rules",
      content: [
        "3.1 Full Refund",
        "The Guest shall receive a full refund of the Booking Amount and Security Deposit where:",
        "- The property is materially misrepresented (wrong location, missing amenities, false or misleading images);",
        "- The Guest is unable to access the property (Host absence, locked premises, third-party occupation);",
        "- The property poses immediate health or safety risks (e.g., structural damage, pest infestation, flooding, exposed wiring);",
        "- The Host cancels after booking confirmation.",
        "",
        "3.2 Partial Refund",
        "Partial refunds are granted when:",
        "- The Guest checked in but vacated early due to a verified problem (e.g., serious functional breakdown, hygiene issues); and",
        "- Refunds shall be calculated by deducting the value of nights stayed from the total Booking Amount.",
        "If no damages are reported, the Security Deposit shall be refunded in full.",
        "",
        "3.3 No Refund",
        "No refund shall be issued where:",
        "- The cancellation occurs after the first hour of booking without satisfying Clause 2.2(b);",
        "- Issues are minor and do not materially impact the stay;",
        "- The Guest fails to submit a complaint within twenty-four (24) hours of check-in;",
        "- Cancellation is due to personal or subjective reasons unrelated to the Host or property.",
      ],
    },
    {
      section: "4. Security Deposit Rules",
      content: [
        "4.1 Purpose",
        "The Security Deposit serves as protection for the Host and Letora against:",
        "- Physical damage to property or furnishings beyond ordinary wear and tear;",
        "- Breach of house rules, including unauthorized parties, smoking, or pets;",
        "- Loss or theft of items provided by the Host;",
        "- Excessive cleaning requirements due to Guest misuse.",
        "",
        "4.2 Full Refund",
        "The Security Deposit will be refunded in full within seven to ten (7-10) business days if:",
        "- No damages or violations are reported; and",
        "- The Host does not file a claim within twenty-four (24) hours of Guest check-out.",
        "",
        "4.3 Partial Refund",
        "Where the cost of damage or breach does not exceed ₦100,000, Letora may deduct the repair or replacement cost from the Security Deposit and refund the balance. The Guest will be provided with an itemized breakdown.",
        "",
        "4.4 No Refund",
        "The entire Security Deposit may be forfeited where:",
        "- Damage exceeds ₦100,000;",
        "- There is theft, loss, or destruction of property;",
        "- There is a serious breach of house rules; and",
        "- The Host submits timestamped photographic or video evidence to Letora.",
        "",
        "4.5 Claims Beyond the Security Deposit",
        "Where damage, loss, or breach results in costs exceeding ₦100,000, the Host retains the right to pursue additional recovery through legal proceedings under the laws of the Federal Republic of Nigeria. Letora shall, upon lawful request, provide the Host with relevant booking details, identification, and evidence necessary for such proceedings, in compliance with applicable data protection laws.",
      ],
    },
    {
      section: "5. Claim Submission and Review Process",
      content: [
        "5.1 Guest Claims",
        "- Must be submitted within twenty-four (24) hours of check-in via the Letora Resolution Portal;",
        "- Must include supporting evidence such as photographs, videos, and communication records.",
        "",
        "5.2 Host Claims",
        "- Must be submitted within twenty-four (24) hours of Guest check-out;",
        "- Must include timestamped photographic or video evidence of damage, theft, or breach.",
        "",
        "5.3 Investigation and Determination",
        "- Letora will review all claims within three to five (3-5) business days;",
        "- Payments will be paused until a final decision is reached;",
        "- All determinations by Letora shall be final and binding.",
      ],
    },
    {
      section: "6. Host Payout Timeline",
      content: [
        "- If no complaint is raised within twenty-four (24) hours of Guest check-in, the Booking Amount will be released to the Host;",
        "- If a complaint is filed, payout will be suspended until the dispute is resolved in accordance with Clause 5.",
      ],
    },
    {
      section: "7. Non-Refundable Fees",
      content: [
        "The ₦2,500 Convenience Fee is non-refundable in all circumstances, including but not limited to Host cancellations.",
      ],
    },
    {
      section: "8. Force Majeure Clause",
      content: [
        "The Platform is not liable and refunds shall not be processed for delays, cancellations, or dissatisfaction due to:",
        "- Natural disasters",
        "- Armed conflict or civil unrest",
        "- Government restrictions or public health emergencies",
        "- Nationwide power or internet outage not within Host control",
      ],
    },
    {
      section: "9. Governing Law & Jurisdiction",
      content: [
        "This Policy shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Disputes arising under this Policy shall be subject to the exclusive jurisdiction of the courts in Lagos State, Nigeria, unless otherwise agreed through arbitration.",
      ],
    },
    {
      section: "10. Updates to This Policy",
      content: [
        "The Platform reserves the right to modify this Policy at any time. Material changes will be communicated via email and/or in-app notifications. Continued use of the Platform constitutes acceptance of such changes.",
      ],
    },
    {
      section: "11. Contact Information",
      content: [
        "For disputes, clarifications, or legal inquiries:",
        "Email: support@letora.com",
      ],
    },
  ];
  return (
    <div>
      <div className="md:mt-[36px] md:mx-[40px] mb-[124px]">
        <Header />
        <div className="text-[#000000] mt-[28px]">
          <h1 className="text-[16px] mb-[23px] md:mt-[52px] md:text-[28px] text-[#39302A] font-semibold text-center">
            Guest Refund Policy
          </h1>

          <div className="space-y-6 mb-[70px]">
            {refundPolicy.map((term, index) => (
              <div key={index} className="px-6 rounded-lg">
                <h2 className="font-medium text-[13px] mb-4 md:text-[22px]">
                  {term.section}
                </h2>
                <div className="space-y-3 text-[#505050] text-sm md:text-[20px] md:space-y-5 md:leading-[1.5]">
                  {term.content.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className={
                        paragraph.startsWith("   -")
                          ? "ml-6"
                          : paragraph.startsWith("-")
                          ? "ml-4"
                          : paragraph.match(/^[0-9]+\.[0-9]+/)
                          ? ""
                          : paragraph.match(/^\([a-z]\)/)
                          ? "ml-4"
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
      <div>
        <Footer />
      </div>
    </div>
  );
}
