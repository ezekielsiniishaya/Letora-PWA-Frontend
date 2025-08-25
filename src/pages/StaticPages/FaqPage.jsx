import Header from "/src/components/Header";
import Footer from "/src/components/Footer";
import { useEffect, useState } from "react";

export default function FaqPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    setReady(true);
  }, []);

  if (!ready) return null; // prevent render until scroll is set

  const forGuest = [
    {
      question: "How do I book a shortlet on the platform?",
      answer:
        "You can search for listings based on your location and budget, then proceed to book directly through our secure payment system.",
    },
    {
      question: "Are the apartments verified?",
      answer:
        "We perform background checks and request verification documents from hosts, but we recommend reading reviews and chatting with the host before booking.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept debit/credit cards, bank transfers, and mobile money (where available).",
    },
    {
      question: "Is my payment safe?",
      answer:
        "Yes. Your payment is held in escrow and only released to the host after your check-in is confirmed.",
    },
    {
      question: "Can I cancel a booking?",
      answer:
        "Yes. Each host has their own cancellation policy. Be sure to read it before booking.",
    },
    {
      question:
        "What if I get to the property and it doesn't match the listing?",
      answer:
        "Contact us within 12 hours of check-in with photo or video proof, and we'll investigate and issue a refund if necessary.",
    },
    {
      question: "Do I pay a security deposit?",
      answer:
        "Some listings require a refundable security deposit. This will be stated clearly on the listing before you book.",
    },
    {
      question: "How do I report a user or listing?",
      answer:
        "Each listing has a 'Report' button. You can also contact our support directly with screenshots or details.",
    },
  ];

  const forHost = [
    {
      question: "How do I list my apartment?",
      answer:
        "Sign up, complete your profile, upload property details and photos, and set your availability and pricing.",
    },
    {
      question: "When do I get paid as a host?",
      answer:
        "You'll receive your payment 24 hours after the guest checks in, once there are no disputes.",
    },
    {
      question: "Are there any fees for Hosts?",
      answer:
        "We charge a small commission per booking. The exact percentage is shown before you publish your listing.",
    },
    {
      question: "What happens if I upload fake or altered documents?",
      answer:
        "Your account will be suspended permanently, and legal action may be taken depending on the severity of the violation.",
    },
    {
      question: "Can I decline a booking?",
      answer:
        "Yes. You are not obligated to accept every booking, but consistent cancellations may affect your visibility.",
    },
    {
      question: "Do I need any documents to verify my listing?",
      answer:
        "Yes. We require a valid ID, proof of ownership or authorization to sublet, and recent photos of the property.",
    },
    {
      question: "Who is responsible for damages caused by guests?",
      answer:
        "As the tenant/landlord-host, you are fully responsible for your guest's actions and any property damage. We advise collecting a refundable security deposit from guests.",
    },
  ];

  const forApartments = [
    {
      question: "Can a tenant list a rented apartment on this platform?",
      answer:
        "Yes, tenants are allowed to list apartments they're renting as long as they have permission from the landlord or property owner. During listing, tenants must confirm that they have this consent.",
    },
    {
      question: "What is the Verified Consent Badge?",
      answer:
        "It's a trust badge shown on listings where the tenant has uploaded valid landlord permission. It helps build confidence with guests and may boost visibility on the platform.",
    },
    {
      question:
        "What if a landlord changes their mind after giving permission?",
      answer:
        "The tenant must remove the listing immediately. Continuing to host after permission is withdrawn violates platform policy and may result in removal or suspension.",
    },
    {
      question: "Is document upload required when listing an apartment?",
      answer:
        "Yes. After confirming you have permission to list, you must upload Proof of ownership (for landlords), or Landlord consent or tenancy agreement (for tenants). Your listing won't go live without this.",
    },
    {
      question: "Is written permission from the landlord required?",
      answer:
        "No, it's not required upfront. Tenants simply confirm they have consent during listing. However, we strongly recommend uploading a Landlord Consent Letter or a tenancy agreement that permits subletting.",
    },
    {
      question: "Can verbal consent from a landlord suffice?",
      answer:
        "It may be enough to list initially. But in the event of a complaint or legal issue, the tenant must present written proof of permission. For their own protection, we advise uploading this early.",
    },
    {
      question: "Is the platform responsible for tenant-landlord agreements?",
      answer:
        "No. The platform provides tools and terms to support safe hosting, but all rental agreements and legal permissions are between the tenant and landlord.",
    },
    {
      question: "Will guests see these documents?",
      answer:
        "No. Uploaded documents are for internal verification only. However, listings with verified documents will display a 'Verified Permission' badge for added trust.",
    },
  ];

  return (
    <div className="bg-[#F5F5F5]">
      <div className="md:mt-[36px] md:mx-[40px] mb-[124px]">
        <Header />
        <div className="min-h-screen text-[#000000] px-[24px] md:px-20 mt-[28px]">
          <h1 className="text-center hidden md:block text-[28px] text-[#39302A] font-bold mb-1">
            FAQ
          </h1>
          <h1 className="text-center md:hidden text-[16px] font-semibold">
            Frequently Asked Questions
          </h1>

          {/* For Guests Section */}
          <p className="text-[14px] md:text-[22px] mb-2 font-semibold mt-[35px] md:text-center md:mb-[20px]">
            For Guests
          </p>
          <div className="grid md:grid-cols-2 gap-[8px]">
            {forGuest.map((faq, index) => (
              <div key={index} className="bg-white p-[16px] rounded-md">
                <h2 className="font-semibold text-[14px] md:text-[20px] text-[#333333] mb-2">
                  {faq.question}
                </h2>
                <p className="text-[#505050] text-[12px] md:text-[16px] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* For Hosts Section */}
          <p className="text-[14px] md:text-[22px] font-semibold mt-[35px] md:text-center mb-[20px]">
            For Hosts
          </p>
          <div className="grid md:grid-cols-2 gap-[8px]">
            {forHost.map((faq, index) => (
              <div key={index} className="bg-white p-[16px] rounded-md">
                <h2 className="font-semibold text-[14px] md:text-[20px] text-[#333333] mb-2">
                  {faq.question}
                </h2>
                <p className="text-[#505050] text-[12px] md:text-[16px] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* For Apartments Section */}
          <p className="text-[14px] md:text-[22px] font-semibold mt-[35px] md:text-center mb-[20px]">
            On Apartments
          </p>
          <div className="grid md:grid-cols-2 gap-[8px] mb-20">
            {forApartments.map((faq, index) => (
              <div key={index} className="bg-white p-[16px] rounded-md">
                <h2 className="font-semibold text-[14px] md:text-[20px] text-[#333333] mb-2">
                  {faq.question}
                </h2>
                <p className="text-[#505050] text-[12px] md:text-[16px] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
