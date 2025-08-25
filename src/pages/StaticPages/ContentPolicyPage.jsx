import Header from "/src/components/Header";
import Footer from "/src/components/Footer";
import { useEffect, useState } from "react";

export default function ContentListingPolicyPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    setReady(true);
  }, []);

  if (!ready) return null; // prevent render until scroll is set

  const contentPolicy = [
    {
      section: "1. Overview",
      content: [
        "This Content & Listing Policy ('Policy') governs the standards, obligations, and conditions applicable to all content uploaded, shared, or published by property owners, managers, or tenants ('Hosts') on the Letora shortlet rental platform ('Platform').",
        "",
        "The purpose of this Policy is to ensure:",
        "- Accuracy and reliability of property listings.",
        "- Legal and regulatory compliance under Nigerian law.",
        "- Protection of platform users from fraudulent or misleading content.",
        "- Operational consistency and brand integrity across the platform.",
        "",
        "Violations of this Policy may result in listing rejection, account suspension, withholding of payouts, removal from the platform, or legal consequences, including referral to law enforcement authorities where appropriate.",
      ],
    },
    {
      section: "2. General Listing Standards",
      content: [
        "All listings on the Platform must:",
        "- Accurately reflect the property being offered for short-term rental.",
        "- Be honest, up-to-date, and verifiable.",
        "- Comply with all national, state, and local housing regulations.",
        "- Not infringe on third-party rights, including landlord rights, intellectual property, or neighborhood agreements.",
        "",
        "2.1 Required Listing Information",
        "Each listing must clearly include the following:",
        "- Property Type: Entire Apartment, Studio, Private Room, or Shared Room.",
        "- Location: Town/Area and Local Government Area (LGA) (No exact address will be displayed publicly for security).",
        "- Accommodation Details:",
        "   - Number of bedrooms and bathrooms",
        "   - Maximum occupancy limit",
        "- Amenities:",
        "   - Wi-Fi, Generator, Water supply, Security, Air Conditioning, etc.",
        "- House Rules:",
        "   - Smoking policy, guest limits, party ban, pet allowance, check-in/out time, noise limits",
        "- Pricing Structure:",
        "   - Price per night and any seasonal price variations",
        "   - Security deposit (refundable amount if applicable)",
        "- Usage Restrictions:",
        "   - E.g. No children, No unmarried couples, No events, etc.",
        "",
        "Failure to provide this information may result in non-publication or deactivation of the listing.",
        "",
        "2.2 Mandatory Media Content",
        "All listings must contain visual representations of the property that are current, clear, and reflect actual conditions.",
        "",
        "Minimum Requirements:",
        "- At least five (5) high-resolution real photos of the property.",
        "- Mandatory photo subjects:",
        "   - Bedroom",
        "   - Bathroom",
        "   - Living area",
        "   - Kitchen (if guest-accessible)",
        "   - Exterior or entrance view",
        "",
        "Prohibited content:",
        "- Watermarked photos",
        "- Stock photos or AI-generated imagery",
        "- Text overlays or deceptive editing",
        "",
        "Recommended: A 1-2 minute video walkthrough showcasing the guest journey from the entrance to major rooms.",
        "",
        "2.3 Description Integrity",
        "All written descriptions must:",
        "- Be written in grammatically correct English.",
        "- Avoid sensationalist or unverifiable claims like 'Best in Lagos.'",
        "- Include any known defects or property limitations (e.g., 'no elevator,' 'occasional water interruptions,' 'located in active neighborhood').",
        "",
        "Listings must not misrepresent facts, omit material details, or exaggerate amenities. Misleading or materially false descriptions are grounds for immediate suspension.",
      ],
    },
    {
      section: "3. Host Verification Requirements",
      content: [
        "To ensure authenticity and legality of all listings, all Hosts must submit verifiable documentation before their property is published on the Platform.",
        "",
        "3.1 Proof of Ownership or Legal Right to Sublet",
        "Acceptable verification documents include:",
        "- For Landlords or Property Owners:",
        "   - Property Deed or Allocation Document (e.g., C of O, Deed of Assignment)",
        "   - Valid means of identification",
        "- For Tenants or Leaseholders:",
        "   - Executed Tenancy Agreement",
        "   - Utility bills as proof of residency",
        "   - Valid Government-issued ID",
        "   - Letter of Authorization from the Landlord explicitly allowing short-term subletting",
        "",
        "NB: In cases where the tenancy agreement does not explicitly allow subletting, the Platform requires the Host to obtain and upload a signed authorization letter from the landlord granting permission for the apartment to be used for short-term rental purposes. Failure to upload this letter does not automatically bar listing, but in the event of any legal dispute, the burden of proof lies entirely with the Host, and the Platform will be fully indemnified and held harmless from liability.",
        "",
        "3.2 Host Declaration of Consent",
        "At the time of listing, all Hosts must confirm via checkbox and signature that:",
        "'I confirm that I have the legal right to list this property, including necessary landlord permission where required. I agree to indemnify Letora against any legal claims, disputes, or damages arising from my misrepresentation or breach of third-party property rights.'",
        "",
        "They shall bear all liabilities arising from misrepresentation, legal violations, or disputes with landlords, neighbors, or authorities.",
      ],
    },
    {
      section: "4. Content Conduct Standards",
      content: [
        "All content uploaded to the Platform (including descriptions, images, videos, and messages) must comply with the following:",
        "- Truthfulness: No misrepresentation or exaggeration.",
        "- Non-discrimination: Listings must not contain discriminatory language against race, gender, religion, tribe, disability, or sexual orientation.",
        "- No Offensive Language: Profanity, sexual content, or threatening language is strictly prohibited.",
        "- Legality: Content must not promote or encourage illegal activity.",
        "- Privacy: Listings must not contain images of other people, license plates, personal items, or minors without permission.",
      ],
    },
    {
      section: "5. Legal Liability & Indemnification",
      content: [
        "The Platform does not assume legal responsibility for ownership or legal right to sublet. Hosts are solely responsible for ensuring the accuracy and legality of their listings.",
        "",
        "In the event of disputes, including third-party landlord objections or neighborhood complaints, the Host agrees to indemnify and hold the Platform harmless from legal claims, reputational damage, or third-party costs.",
        "",
        "The Platform reserves the right to share Host information with law enforcement or regulatory agencies where criminal activity or property misuse is suspected or confirmed.",
        "",
        "In extreme cases (e.g., criminal activity like assault, death, arson), the Platform will provide full cooperation with law enforcement and may suspend all future transactions by the affected Host.",
      ],
    },
    {
      section: "6. Intellectual Property",
      content: [
        "Hosts grant the Platform a non-exclusive, royalty-free license to use uploaded content (images, videos, descriptions) for marketing, moderation, and operational purposes. Hosts retain ownership but acknowledge that content may appear in Platform campaigns or third-party advertising.",
      ],
    },
    {
      section: "7. Content Moderation Rights",
      content: [
        "The Platform retains full rights to:",
        "- Edit, crop, compress, or standardize content",
        "- Unpublish or delete listings at any time, without notice, where content violates this Policy or applicable law",
        "- Flag and report suspicious content",
        "- Request re-submission of listing where documentation has expired or been invalidated",
      ],
    },
    {
      section: "8. Repeat Violations",
      content: [
        "Repeat violators or malicious Hosts may face:",
        "- Permanent account ban",
        "- Withholding of all escrowed or pending funds",
        "- Legal claims for reputational damage or financial loss to the Platform",
      ],
    },
    {
      section: "9. Dispute Resolution & Governing Law",
      content: [
        "This Policy shall be governed by the laws of the Federal Republic of Nigeria. In the event of any dispute arising out of or in connection with listing content or host behavior, the parties agree to:",
        "- Seek amicable resolution through Platform mediation",
        "- If unresolved, refer the matter to arbitration under the Arbitration and Conciliation Act of Nigeria",
        "- Final resolution shall be enforceable in Nigerian courts",
      ],
    },
    {
      section: "10. Policy Updates",
      content: [
        "The Platform reserves the right to update this Content & Listing Policy at any time. Hosts will be notified via email or dashboard notification. Continued listing activity following notification shall constitute acceptance of new terms.",
      ],
    },
  ];

  return (
    <div>
      <div className="md:mt-[36px] md:mx-[40px] mb-[124px">
        <Header />
        <div className="text-[#000000] mt-[28px]">
          <h1 className="text-[16px] mb-[23px] md:mt-[52px] md:text-[28px] text-[#39302A] font-semibold text-center">
            Content and Listing Policy
          </h1>

          <div className="space-y-6 mb-[70px]">
            {contentPolicy.map((term, index) => (
              <div key={index} className="px-6 rounded-lg">
                <h2 className="font-medium text-[13px] mb-4 md:text-[22px] ">
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
