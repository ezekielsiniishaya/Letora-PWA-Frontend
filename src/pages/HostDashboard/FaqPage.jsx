import Header2 from "../../components/Header2";
import { useEffect, useState } from "react";

export default function FaqPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    setReady(true);
  }, []);

  if (!ready) return null;

  const forGuest = [
    {
      question: "How much does it cost to make a booking?",
      answer:
        "Guests pay the Booking Amount set by the Host, plus a fixed ₦2,500 convenience fee. A 10% platform fee is applied on every booking. Please note that the convenience fee is strictly non-refundable.",
    },
    {
      question: "Can I get a refund if I cancel my booking?",
      answer:
        "Yes, but it depends on timing: If you cancel within 1 hour of booking, you'll be refunded the Booking Amount and Security Deposit, but not the ₦2,500 convenience fee. After 1 hour, the first day is non-refundable, and unused days may only be refunded if the Host agrees.",
    },
    {
      question: "What happens if the Host cancels my booking?",
      answer:
        "If the Host cancels after confirmation, you will receive a full refund of the Booking Amount and Security Deposit. The convenience fee remains non-refundable.",
    },
    {
      question: "Are security deposits refundable?",
      answer:
        "Yes. Security deposits are refunded in full within 7-10 business days if there are no damages or rule violations reported.",
    },
    {
      question: "What if I find the apartment unsafe or misrepresented?",
      answer:
        "If the property is misrepresented, unsafe, or inaccessible, you may qualify for a full refund of the Booking Amount and Security Deposit.",
    },
    {
      question: "What if I leave the property early?",
      answer:
        "If you vacate early due to a verified issue (e.g., hygiene, major breakdown), you may receive a partial refund for unused nights. The convenience fee is still non-refundable.",
    },
    {
      question: "How do I submit a complaint?",
      answer:
        "You must file a complaint within 24 hours of check-in via the Letora Resolution Portal, with supporting evidence such as photos or videos.",
    },
    {
      question: "Is the convenience fee ever refundable?",
      answer:
        "No. The ₦2,500 convenience fee is non-refundable in all cases, including Host cancellations or force majeure events.",
    },
  ];

  const forHost = [
    {
      question: "How much does it cost to list my apartment?",
      answer:
        "Listing is free. However, Letora charges a 10% fee on every successful booking made through the platform.",
    },
    {
      question: "When will I receive my payout?",
      answer:
        "Payouts are released 24 hours after the Guest's check-in, provided no disputes are raised.",
    },
    {
      question: "What happens if I need to cancel a booking?",
      answer:
        "If you cancel after confirmation, the Guest will receive a refund of their Booking Amount and Security Deposit. The convenience fee remains non-refundable.",
    },
    {
      question: "Can I make claims for damages?",
      answer:
        "Yes. Hosts can file a claim within 24 hours of Guest check-out, with timestamped photo or video evidence of damages or breaches.",
    },
    {
      question: "What if damages exceed the Security Deposit?",
      answer:
        "If damages exceed ₦500,000, you may pursue additional recovery through legal proceedings. Letora will provide necessary booking details to support your claim.",
    },
    {
      question: "Do I keep the Security Deposit automatically?",
      answer:
        "No. You must submit evidence within 24 hours of checkout. Without a claim, the Security Deposit will be refunded in full to the Guest.",
    },
    {
      question: "What happens if a Guest leaves early?",
      answer:
        "Guests may qualify for a partial refund. The payout you receive will reflect the nights stayed and Letora's 10% booking fee deduction.",
    },
    {
      question: "Can I refuse a Guest refund request?",
      answer:
        "Yes, for unused days, refunds require Host consent. However, if the property was misrepresented or unsafe, Letora may override and issue refunds.",
    },
  ];

  const forApartments = [
    {
      question: "How accurate are apartment listings?",
      answer:
        "Hosts are required to provide truthful information and photos. Guests are entitled to refunds if listings are materially misrepresented.",
    },
    {
      question: "What if I arrive and the apartment is locked or occupied?",
      answer:
        "You will be eligible for a full refund of the Booking Amount and Security Deposit.",
    },
    {
      question: "Are amenities guaranteed?",
      answer:
        "Yes. If promised amenities are missing, Guests may file a complaint and request a refund.",
    },
    {
      question: "What if there are safety or hygiene issues?",
      answer:
        "If the property poses immediate health or safety risks, Guests may receive a full or partial refund depending on the severity.",
    },
    {
      question: "Can apartments be booked in advance?",
      answer:
        "No. Bookings commence immediately on the Booking Date. Reservations cannot be scheduled for future dates.",
    },
    {
      question: "Who handles damages to the apartment?",
      answer:
        "Damages caused by Guests are covered by the Security Deposit. If damages exceed ₦500,000, the Host may seek legal recovery.",
    },
    {
      question: "Are house rules enforceable?",
      answer:
        "Yes. Violations (e.g., smoking, unauthorized parties, pets) may result in forfeiture of the Guest's Security Deposit.",
    },
    {
      question:
        "What happens during force majeure events (e.g., floods, unrest, outages)?",
      answer:
        "Refunds are not processed for force majeure events, as these are outside Host and Letora's control.",
    },
  ];

  return (
    <div className="bg-[#F5F5F5]">
      <Header2 title="Frequently Asked Questions" />
      <div className="min-h-screen text-[#000000] px-[24px] mt-[28px]">
        {/* For Guests Section */}
        <p className="text-[14px] mb-2 font-semibold mt-[35px]">For Guests</p>
        <div className="grid gap-[8px]">
          {forGuest.map((faq, index) => (
            <div key={index} className="bg-white p-[16px] rounded-md">
              <h2 className="font-semibold text-[14px] text-[#333333] mb-2">
                {faq.question}
              </h2>
              <p className="text-[#505050] text-[12px] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* For Hosts Section */}
        <p className="text-[14px] font-semibold mt-[35px] mb-[20px]">
          For Hosts
        </p>
        <div className="grid gap-[8px]">
          {forHost.map((faq, index) => (
            <div key={index} className="bg-white p-[16px] rounded-md">
              <h2 className="font-semibold text-[14px] text-[#333333] mb-2">
                {faq.question}
              </h2>
              <p className="text-[#505050] text-[12px] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* For Apartments Section */}
        <p className="text-[14px] mb-[21px] font-semibold mt-[35px]">
          On Apartments
        </p>
        <div className="grid gap-[8px] pb-20">
          {forApartments.map((faq, index) => (
            <div key={index} className="bg-white p-[16px] rounded-md">
              <h2 className="font-semibold text-[14px] text-[#333333] mb-2">
                {faq.question}
              </h2>
              <p className="text-[#505050] text-[12px] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
