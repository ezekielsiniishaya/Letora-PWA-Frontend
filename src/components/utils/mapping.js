// src/utils/mapping.js

// === PROPERTY DETAILS ===
export const parkingSpaceMap = {
  SMALL: "Small",
  MEDIUM: "Medium",
  LARGE: "Large",
  NONE: "None",
};

export const guestNumberMap = {
  ONE: "1",
  TWO: "2",
  THREE: "3",
  FOUR: "4",
  MANY: "Many",
};

export const electricityMap = {
  TWENTY_FOUR_SEVEN: "24/7",
  BAND_A: "Band A",
  BAND_B: "Band B",
  BAND_C: "Band C",
  UNSTABLE: "Unstable",
};

export const kitchenSizeMap = {
  SMALL: "Small",
  MEDIUM: "Medium",
  BIG: "Big",
};

export const apartmentTypeMap = {
  ENTIRE_APARTMENT: "Entire Apartment",
  MINI_FLAT: "Mini Flat",
  SELF_CON_STUDIO: "Self-Con/Studio",
  BQ_ANNEX: "BQ/Annex",
  TWO_BEDROOM_APARTMENT: "2 Bedroom",
  THREE_BEDROOM_APARTMENT: "3 Bedroom",
  DUPLEX: "Duplex",
};

// === FACILITIES ===
export const facilityMap = {
  LAUNDRY_SERVICE: { label: "Laundry Service", icon: "/icons/laundry.svg" },
  WASHING_MACHINE: {
    label: "Washing Machine",
    icon: "/icons/washing-machine.svg",
  },
  CHEF_SERVICE: { label: "Chef Service", icon: "/icons/chef.svg" },
  AIR_CONDITIONING: { label: "Air Conditioning", icon: "/icons/ac.svg" },
  SWIMMING_POOL: { label: "Swimming Pool", icon: "/icons/swimming.svg" },
  GENERATOR_BACKUP: { label: "Generator Backup", icon: "/icons/generator.svg" },
  SOLAR: { label: "Solar", icon: "/icons/solar.svg" },
  WIFI: { label: "WiFi", icon: "/icons/wifi.svg" },
  PLAY_STATION: { label: "Play Station", icon: "/icons/playstation.svg" },
  SMART_HOME: { label: "Smart Home", icon: "/icons/smart-home.svg" },
  CCTV: { label: "CCTV", icon: "/icons/cctv.svg" },
  GYM: { label: "Gym", icon: "/icons/gym.svg" },
  DSTV_NETFLIX: { label: "DSTV Netflix", icon: "/icons/dstv.svg" },
};

// === HOUSE RULES ===
export const houseRuleMap = {
  NO_SMOKING: { label: "No Smoking", icon: "/icons/no-smoking.svg" },
  SMOKING_ALLOWED: { label: "Smoking Allowed", icon: "/icons/smoking.svg" },
  FLUSH_PROPERLY: { label: "Flush Properly", icon: "/icons/flush.svg" },
  DISPOSE_WASTE_PROPERLY: {
    label: "Dispose Waste Properly",
    icon: "/icons/dispose.svg",
  },
  PARTYING_ALLOWED: { label: "Partying Allowed", icon: "/icons/party.svg" },
  NO_PARTYING: { label: "No Loud Music/Partying", icon: "/icons/no-music.svg" },
  NO_PETS_ALLOWED: { label: "No Pets Allowed", icon: "/icons/no-pets.svg" },
  PETS_ALLOWED: { label: "Pets Allowed", icon: "/icons/pets.svg" },
  NO_CROWD: { label: "No Crowd", icon: "/icons/crowd.svg" },
  NO_DAMAGE_TO_PROPERTIES: {
    label: "No Damage to Properties",
    icon: "/icons/no-damage.svg",
  },
  KIDS_ALLOWED: { label: "Kids Allowed", icon: "/icons/kids.svg" },
};

// === UTILITY FUNCTIONS ===
export const mapFacilities = (facilities = []) =>
  facilities.map(
    (f) => facilityMap[f] || { label: f, icon: "/icons/default-facility.svg" }
  );

export const mapHouseRules = (rules = []) =>
  rules.map(
    (r) => houseRuleMap[r] || { label: r, icon: "/icons/default-rule.svg" }
  );
// Transform frontend data to backend enum values
export const transformForBackend = (apartmentData) => {
  const {
    basicInfo = {},
    details = {},
    facilities = [],
    houseRules = [],
  } = apartmentData;

  return {
    basicInfo: {
      title: basicInfo.title,
      description: basicInfo.description,
      apartmentType: basicInfo.apartmentType,
      town: basicInfo.town,
      state: basicInfo.state,
      address: basicInfo.address,
    },
    details: {
      bedrooms: details.bedrooms,
      bathrooms: details.bathrooms,
      parkingSpace: details.parkingSpace, // Send raw enum value
      guestNumber: details.guestNumber, // Send raw enum value
      electricity: details.electricity, // Send raw enum value
      kitchenSize: details.kitchenSize, // Send raw enum value
      description: details.description,
    },
    // Transform arrays to contain only enum values
    facilities: facilities.map((facility) =>
      typeof facility === "string" ? facility : facility.value
    ),
    houseRules: houseRules.map((rule) =>
      typeof rule === "string" ? rule : rule.value
    ),
    pricing: apartmentData.pricing,
    securityDeposit: apartmentData.securityDeposit,
    legalDocuments: apartmentData.legalDocuments,
  };
};
