export const PLAN_TYPES = [
  "Max-Funded IUL",
  "Whole Life (IBC)",
  "Roth IRA",
  "Traditional 401k",
  "Roth 401k",
  "Solo 401k",
  "HSA",
  "529 Plan",
  "Real Estate",
  "Private Equity",
  "CDs / Savings",
  "Non-Qual Annuity",
];

// Plan characteristics from the matrix (used for calculation validation)
export const PLAN_CHARACTERISTICS = {
  "Max-Funded IUL": {
    taxFree: true,
    contributionLimit: null, // No limit
    marketProtection: true,
    description:
      "Tax-free growth via policy loans. Principal protected with 0% floor.",
  },
  "Whole Life (IBC)": {
    taxFree: true,
    contributionLimit: null,
    marketProtection: true,
    description: "Guaranteed growth 3-4%. Tax-free loans for Infinite Banking.",
  },
  "Roth IRA": {
    taxFree: true,
    contributionLimit: 7000,
    marketProtection: false,
    description: "Tax-free after 59½. $7K annual limit. Full market exposure.",
  },
  "Traditional 401k": {
    taxFree: false,
    contributionLimit: 23000,
    marketProtection: false,
    description: "Tax-deferred. Taxed on withdrawal. Market exposed.",
  },
  "Roth 401k": {
    taxFree: true,
    contributionLimit: 23000,
    marketProtection: false,
    description: "Tax-free withdrawals. $23K limit. Market risk.",
  },
  "Solo 401k": {
    taxFree: false, // Hybrid
    contributionLimit: 69000,
    marketProtection: false,
    description: "Self-employed. Up to $69K/year. Self-directed options.",
  },
  HSA: {
    taxFree: true,
    contributionLimit: 4150,
    marketProtection: false,
    description: "Triple tax-free for medical. $4,150 individual limit.",
  },
  "529 Plan": {
    taxFree: true, // For education
    contributionLimit: null,
    marketProtection: false,
    description: "Tax-free for education. 10% penalty for non-qualified use.",
  },
  "Real Estate": {
    taxFree: false,
    contributionLimit: null,
    marketProtection: false,
    description: "Depreciation benefits. 1031 exchanges. Illiquid.",
  },
  "Private Equity": {
    taxFree: false,
    contributionLimit: null,
    marketProtection: false,
    description:
      "High risk/reward. 5-10 year lock-ups. Accredited investors only.",
  },
  "CDs / Savings": {
    taxFree: false,
    contributionLimit: null,
    marketProtection: true,
    description: "FDIC insured. Low returns. Taxed as ordinary income.",
  },
  "Non-Qual Annuity": {
    taxFree: false,
    contributionLimit: null,
    marketProtection: true, // Depends on type
    description: "Tax-deferred. High fees. Surrender charges.",
  },
};
