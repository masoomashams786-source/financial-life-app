import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  RemoveCircle,
  InfoOutlined,
  Search,
  FilterList,
} from "@mui/icons-material";

// Professional Financial Analysis Data
const VEHICLE_MATRIX = [
  {
    vehicle: "Max-Funded IUL",
    class: "Permanent Life Insurance",
    liquidity: {
      rating: "high",
      value: "High",
      details:
        "Access cash value via policy loans (typically 5-7 days). No penalties, no credit check. Maintains death benefit.",
    },
    marketSafety: {
      rating: "high",
      value: "High",
      details:
        "Principal protected with 0% floor. Participates in market upside via index crediting (caps 10-12%). No direct market exposure.",
    },
    taxFree: {
      rating: "high",
      value: "Yes",
      details:
        "Tax-free death benefit, tax-free policy loans, tax-deferred growth. LIRP strategy for tax-free retirement income.",
    },
    leverage: {
      rating: "high",
      value: "Excellent",
      details:
        "Use cash value as collateral for loans. Arbitrage opportunities. Banking concept (Infinite Banking).",
    },
    assetProtection: {
      rating: "high",
      value: "Strong",
      details:
        "Protected from creditors in most states. Exempt from bankruptcy (varies by state). Not counted for Medicaid.",
    },
    contributionLimits: {
      rating: "high",
      value: "Flexible",
      details:
        "No IRS contribution limits. Limited only by MEC rules and insurance guidelines. Can fund $50K-$500K+ annually.",
    },
    bestFor:
      "High-income earners, maxed-out retirement accounts, tax diversification, legacy planning",
    avgReturn: "5-7% net",
    fees: "1-3% annually",
  },
  {
    vehicle: "Whole Life (IBC)",
    class: "Permanent Life Insurance",
    liquidity: {
      rating: "high",
      value: "High",
      details:
        "Immediate access to cash value via policy loans. Funds available in 3-5 days. Unstructured loans (you decide repayment).",
    },
    marketSafety: {
      rating: "high",
      value: "Guaranteed",
      details:
        "100% guaranteed growth (3-4% contractual). Dividends add 1-2% (non-guaranteed but paid for 100+ years by mutual companies).",
    },
    taxFree: {
      rating: "high",
      value: "Yes",
      details:
        "Tax-free loans and death benefit. Dividends tax-deferred. Ideal for Infinite Banking Concept (IBC).",
    },
    leverage: {
      rating: "high",
      value: "Excellent",
      details:
        "Borrow against cash value while it continues earning dividends. Recapture interest. Become your own banker.",
    },
    assetProtection: {
      rating: "high",
      value: "Strong",
      details:
        "Creditor protection (state-dependent). Bankruptcy exempt. Protected from lawsuits in many jurisdictions.",
    },
    contributionLimits: {
      rating: "high",
      value: "Flexible",
      details:
        "No IRS limits. Constrained by MEC rules and underwriting. Paid-Up Additions (PUA) riders maximize cash value.",
    },
    bestFor:
      "Business owners, wealth preservation, Infinite Banking, multi-generational wealth transfer",
    avgReturn: "4-6% net",
    fees: "2-3% annually",
  },
  {
    vehicle: "Roth IRA",
    class: "Qualified Retirement",
    liquidity: {
      rating: "medium",
      value: "Moderate",
      details:
        "Contributions can be withdrawn anytime tax/penalty-free. Earnings withdrawals before 59½ incur 10% penalty + taxes.",
    },
    marketSafety: {
      rating: "low",
      value: "Market Risk",
      details:
        "100% market exposed. No principal protection. Subject to full volatility. Can lose 20-40% in downturns.",
    },
    taxFree: {
      rating: "high",
      value: "Yes",
      details:
        "Tax-free withdrawals after 59½ (if account open 5+ years). No RMDs. Contributions are after-tax.",
    },
    leverage: {
      rating: "low",
      value: "None",
      details:
        "Cannot borrow or use as collateral. Early withdrawal triggers penalties. No loan provisions.",
    },
    assetProtection: {
      rating: "medium",
      value: "Moderate",
      details:
        "Protected from creditors under ERISA (up to $1.5M). Bankruptcy protection. Not protected from IRS liens.",
    },
    contributionLimits: {
      rating: "low",
      value: "$7,000/year",
      details:
        "$7,000 annual limit ($8,000 if 50+). Income phase-outs: $146K-$161K (single), $230K-$240K (married). Restrictive.",
    },
    bestFor:
      "Young investors, long-term tax-free growth, low-to-moderate income earners",
    avgReturn: "7-10% (pre-fees)",
    fees: "0.5-1% (fund expenses)",
  },
  {
    vehicle: "Traditional 401k",
    class: "Qualified Retirement",
    liquidity: {
      rating: "low",
      value: "Low",
      details:
        "Locked until 59½. Early withdrawals = 10% penalty + ordinary income tax. Loans available (50% of balance, max $50K).",
    },
    marketSafety: {
      rating: "low",
      value: "Market Risk",
      details:
        "Fully exposed to market volatility. No downside protection. Subject to sequence of returns risk in retirement.",
    },
    taxFree: {
      rating: "low",
      value: "No",
      details:
        "Tax-deferred growth, but 100% taxable on withdrawal (ordinary income rates). RMDs at 73. Taxes in retirement uncertain.",
    },
    leverage: {
      rating: "low",
      value: "Limited",
      details:
        "Can take loans (must repay with interest). Cannot use as collateral. Restrictive loan terms.",
    },
    assetProtection: {
      rating: "high",
      value: "Strong",
      details:
        "Full ERISA protection from creditors. Bankruptcy exempt (unlimited). Protected from lawsuits.",
    },
    contributionLimits: {
      rating: "medium",
      value: "$23,000/year",
      details:
        "$23,000 employee contribution ($30,500 if 50+). Employer match doesn't count toward limit. Total limit: $69,000.",
    },
    bestFor:
      "W-2 employees with employer match, high current tax bracket, long accumulation phase",
    avgReturn: "7-10% (pre-tax)",
    fees: "0.5-1.5%",
  },
  {
    vehicle: "Roth 401k",
    class: "Qualified Retirement",
    liquidity: {
      rating: "low",
      value: "Low",
      details:
        "Same restrictions as Traditional 401k. Locked until 59½. 10% penalty on early withdrawals of earnings.",
    },
    marketSafety: {
      rating: "low",
      value: "Market Risk",
      details:
        "No principal protection. Full market exposure. Volatility can erode balance significantly during downturns.",
    },
    taxFree: {
      rating: "high",
      value: "Yes",
      details:
        "Tax-free growth and withdrawals (after 59½ + 5-year rule). But employer match goes to Traditional 401k (taxable).",
    },
    leverage: {
      rating: "low",
      value: "Limited",
      details:
        "Loan provisions available but restrictive. Cannot use as collateral. Must repay loans if leaving employer.",
    },
    assetProtection: {
      rating: "high",
      value: "Strong",
      details:
        "ERISA protection. Creditor and bankruptcy exempt. Strong legal protections for qualified plans.",
    },
    contributionLimits: {
      rating: "medium",
      value: "$23,000/year",
      details:
        "Combined Traditional + Roth 401k limit: $23,000 ($30,500 if 50+). Employer contributions don't affect limit.",
    },
    bestFor:
      "Young high-earners expecting higher future taxes, long-term growth focus",
    avgReturn: "7-10%",
    fees: "0.5-1.5%",
  },
  {
    vehicle: "Solo 401k",
    class: "Qualified Retirement",
    liquidity: {
      rating: "low",
      value: "Low",
      details:
        "Early withdrawal penalties apply. Can take loans up to $50K or 50% of balance. More flexibility than employer plans.",
    },
    marketSafety: {
      rating: "low",
      value: "Market Risk",
      details:
        "Investment-dependent. Can invest in alternatives (real estate, private equity) if self-directed. Still market-exposed.",
    },
    taxFree: {
      rating: "medium",
      value: "Hybrid",
      details:
        "Can split Traditional (deductible) and Roth (tax-free). Traditional = taxed on withdrawal. Roth = tax-free.",
    },
    leverage: {
      rating: "medium",
      value: "Moderate",
      details:
        "Can use plan assets to invest in real estate/notes. Self-directed options allow non-recourse loans. More control than typical 401k.",
    },
    assetProtection: {
      rating: "high",
      value: "Strong",
      details:
        "ERISA protections. Creditor-proof. Bankruptcy exempt. Excellent asset protection.",
    },
    contributionLimits: {
      rating: "high",
      value: "$69,000/year",
      details:
        "Employee: $23,000. Employer (profit-sharing): up to $69,000 total ($76,500 if 50+). Best for self-employed.",
    },
    bestFor:
      "Self-employed, freelancers, small business owners with no employees",
    avgReturn: "Varies (self-directed)",
    fees: "Low (DIY setup)",
  },
  {
    vehicle: "HSA",
    class: "Health Savings",
    liquidity: {
      rating: "medium",
      value: "Moderate",
      details:
        "Accessible anytime for qualified medical expenses (no penalty). Non-medical withdrawals before 65 = 20% penalty + taxes.",
    },
    marketSafety: {
      rating: "low",
      value: "Market Risk",
      details:
        "Investment options typically include mutual funds (market-exposed). Cash portion is FDIC-insured.",
    },
    taxFree: {
      rating: "high",
      value: "Triple Tax-Free",
      details:
        "Tax-deductible contributions, tax-free growth, tax-free withdrawals for medical expenses. Best tax advantage available.",
    },
    leverage: {
      rating: "low",
      value: "None",
      details:
        "Cannot borrow or use as collateral. Strictly for medical expense reimbursement.",
    },
    assetProtection: {
      rating: "medium",
      value: "Moderate",
      details:
        "Some creditor protection (state-dependent). Not as robust as qualified retirement plans.",
    },
    contributionLimits: {
      rating: "low",
      value: "$4,150/year",
      details:
        "$4,150 (individual), $8,300 (family). $1,000 catch-up if 55+. Must have high-deductible health plan (HDHP).",
    },
    bestFor:
      "Healthy individuals, long-term medical expense planning, stealth retirement account",
    avgReturn: "Varies (investment-dependent)",
    fees: "Low",
  },
  {
    vehicle: "529 Plan",
    class: "Education Savings",
    liquidity: {
      rating: "low",
      value: "Low",
      details:
        "Withdrawals for non-qualified expenses incur 10% penalty + taxes on earnings. Qualified = tuition, books, room/board.",
    },
    marketSafety: {
      rating: "low",
      value: "Market Risk",
      details:
        "Invested in mutual funds (market-exposed). Age-based portfolios auto-rebalance to bonds as beneficiary ages.",
    },
    taxFree: {
      rating: "high",
      value: "Yes (Qualified)",
      details:
        "Tax-free growth and withdrawals for qualified education expenses. State tax deduction in most states.",
    },
    leverage: {
      rating: "low",
      value: "None",
      details:
        "Cannot borrow against 529. Funds locked for education use only.",
    },
    assetProtection: {
      rating: "medium",
      value: "Moderate",
      details:
        "Creditor protection varies by state. Generally protected from beneficiary's creditors, not owner's.",
    },
    contributionLimits: {
      rating: "high",
      value: "High",
      details:
        "No annual federal limit (subject to gift tax rules). Total contribution limits vary by state ($235K-$550K lifetime).",
    },
    bestFor:
      "Parents saving for children's college, grandparents, education-focused families",
    avgReturn: "5-8%",
    fees: "0.5-2%",
  },
  {
    vehicle: "Real Estate",
    class: "Alternative Investment",
    liquidity: {
      rating: "low",
      value: "Very Low",
      details:
        "Illiquid. Takes 30-180 days to sell. Transaction costs 6-10%. Cannot quickly convert to cash without loss.",
    },
    marketSafety: {
      rating: "medium",
      value: "Moderate",
      details:
        "Less volatile than stocks but subject to local market conditions. Property values can decline 20-40% in downturns.",
    },
    taxFree: {
      rating: "medium",
      value: "Partial",
      details:
        "Depreciation deductions, 1031 exchanges (defer taxes), $250K/$500K capital gains exemption on primary residence.",
    },
    leverage: {
      rating: "high",
      value: "Excellent",
      details:
        "Can use 20-25% down payment (4-5x leverage). Mortgages available at low rates. Use equity for additional purchases.",
    },
    assetProtection: {
      rating: "medium",
      value: "Moderate",
      details:
        "Homestead exemption for primary residence (varies by state). LLCs provide liability protection for rentals.",
    },
    contributionLimits: {
      rating: "high",
      value: "Unlimited",
      details:
        "No limits. Constrained only by capital, creditworthiness, and deal availability.",
    },
    bestFor:
      "Investors seeking cash flow, appreciation, leverage, tangible assets",
    avgReturn: "8-12% (including appreciation + rental income)",
    fees: "High (closing costs, maintenance, property management)",
  },
  {
    vehicle: "Private Equity",
    class: "Alternative Investment",
    liquidity: {
      rating: "low",
      value: "Very Low",
      details:
        "Lock-up periods of 5-10 years. No secondary market. Capital tied up until exit event (IPO, acquisition).",
    },
    marketSafety: {
      rating: "low",
      value: "High Risk",
      details:
        "High risk/high reward. Startups have 90% failure rate. Diversification critical. Potential total loss.",
    },
    taxFree: {
      rating: "low",
      value: "No",
      details:
        "Taxed as capital gains (long-term 15-20%). Carried interest taxed favorably for fund managers. K-1 reporting.",
    },
    leverage: {
      rating: "medium",
      value: "Moderate",
      details:
        "Funds use leverage at deal level. Individual investors cannot directly leverage. Buyout funds heavily leveraged.",
    },
    assetProtection: {
      rating: "low",
      value: "Limited",
      details:
        "Depends on investment structure (LP vs direct). Limited liability for LPs. No creditor protection for direct investments.",
    },
    contributionLimits: {
      rating: "high",
      value: "High Minimums",
      details:
        "Accredited investor required ($1M net worth or $200K income). Minimum investments: $25K-$1M+.",
    },
    bestFor:
      "Accredited investors, sophisticated investors, portfolio diversification, high-risk tolerance",
    avgReturn: "15-25% (but high variance)",
    fees: "2% management + 20% carried interest",
  },
  {
    vehicle: "CDs / Savings",
    class: "Cash Equivalent",
    liquidity: {
      rating: "high",
      value: "High",
      details:
        "Savings accounts: instant access. CDs: early withdrawal penalties (3-12 months interest). FDIC insured up to $250K.",
    },
    marketSafety: {
      rating: "high",
      value: "Guaranteed",
      details:
        "FDIC insured (banks) or NCUA insured (credit unions). Principal 100% protected. Zero market risk.",
    },
    taxFree: {
      rating: "low",
      value: "No",
      details:
        "Interest taxed as ordinary income annually. No tax advantages. Taxes reduce real returns.",
    },
    leverage: {
      rating: "low",
      value: "None",
      details:
        "Cannot leverage or borrow against. Used as collateral for secured loans (low loan-to-value).",
    },
    assetProtection: {
      rating: "low",
      value: "Limited",
      details:
        "Subject to creditor claims. No bankruptcy exemption. Can be frozen/seized by court order.",
    },
    contributionLimits: {
      rating: "high",
      value: "Unlimited",
      details:
        "No contribution limits. FDIC insurance capped at $250K per depositor, per institution.",
    },
    bestFor:
      "Emergency funds, short-term savings, capital preservation, risk-averse savers",
    avgReturn: "2-5% (current rates)",
    fees: "None (or minimal)",
  },
  {
    vehicle: "Non-Qual Annuity",
    class: "Insurance Product",
    liquidity: {
      rating: "low",
      value: "Low",
      details:
        "Surrender charges for 5-10 years (typically 7-10% declining). 10% penalty-free withdrawals annually. IRS 10% penalty before 59½.",
    },
    marketSafety: {
      rating: "medium",
      value: "Varies",
      details:
        "Fixed annuities: guaranteed. Variable: market-exposed. Indexed: hybrid (floor with capped upside).",
    },
    taxFree: {
      rating: "low",
      value: "Tax-Deferred",
      details:
        "Tax-deferred growth. Withdrawals taxed as ordinary income (LIFO = gains first). No step-up in basis at death.",
    },
    leverage: {
      rating: "low",
      value: "None",
      details:
        "Cannot borrow or use as collateral during accumulation. Only income riders provide leverage in retirement.",
    },
    assetProtection: {
      rating: "high",
      value: "Strong",
      details:
        "Creditor protection varies by state. Many states fully protect annuities from lawsuits and bankruptcy.",
    },
    contributionLimits: {
      rating: "high",
      value: "Unlimited",
      details:
        "No IRS limits. Can fund with $100K-$1M+. Common for pension rollovers and structured settlements.",
    },
    bestFor:
      "Retirees seeking guaranteed income, conservative investors, longevity insurance",
    avgReturn: "3-5% (fixed), varies (variable/indexed)",
    fees: "High (1-3% + surrender charges)",
  },
];

export default function ComparativeMatrixSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("all");

  const colors = {
    high: "#10B981",
    medium: "#F59E0B",
    low: "#EF4444",
  };

  const getRatingIcon = (rating) => {
    switch (rating) {
      case "high":
        return <CheckCircle sx={{ color: colors.high, fontSize: 20 }} />;
      case "medium":
        return <RemoveCircle sx={{ color: colors.medium, fontSize: 20 }} />;
      case "low":
        return <Cancel sx={{ color: colors.low, fontSize: 20 }} />;
      default:
        return null;
    }
  };

  const uniqueClasses = ["all", ...new Set(VEHICLE_MATRIX.map((v) => v.class))];

  const filteredVehicles = VEHICLE_MATRIX.filter((vehicle) => {
    const matchesSearch = vehicle.vehicle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "all" || vehicle.class === filterClass;
    return matchesSearch && matchesClass;
  });

  return (
    <Box sx={{ bgcolor: "#e4eaf0ff", p: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Professional Comparative Matrix
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Institutional-grade analysis of all financial vehicles across critical
          evaluation factors
        </Typography>

        {/* Filters */}
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            size="small"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />

          <ToggleButtonGroup
            value={filterClass}
            exclusive
            onChange={(e, newValue) => newValue && setFilterClass(newValue)}
            size="small"
            sx={{
              width: { xs: "100%", sm: "auto" },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            {uniqueClasses.map((cls) => (
              <ToggleButton
                key={cls}
                value={cls}
                sx={{ textTransform: "none" }}
              >
                {cls === "all" ? "All Classes" : cls}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Professional Analysis Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ minWidth: 1200 }} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 180,
                }}
              >
                Vehicle
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 150,
                }}
              >
                Class
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 150,
                }}
              >
                Liquidity & Control
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 150,
                }}
              >
                Market Safety
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 140,
                }}
              >
                Tax-Free Access
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 160,
                }}
              >
                Leverage & Collateral
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 150,
                }}
              >
                Asset Protection
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 160,
                }}
              >
                Contribution Limits
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  bgcolor: "#0A2540",
                  color: "white",
                  minWidth: 120,
                }}
              >
                Avg Return
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVehicles.map((vehicle, index) => (
              <TableRow
                key={index}
                hover
                sx={{
                  "&:nth-of-type(odd)": { bgcolor: "#F7F9FC" },
                  "&:hover": { bgcolor: "#E3F2FD" },
                }}
              >
                {/* Vehicle Name */}
                <TableCell>
                  <Box>
                    <Typography variant="body1" fontWeight={700}>
                      {vehicle.vehicle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {vehicle.bestFor}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Class */}
                <TableCell>
                  <Chip
                    label={vehicle.class}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>

                {/* Liquidity */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getRatingIcon(vehicle.liquidity.rating)}
                    <Typography variant="body2" fontWeight={600}>
                      {vehicle.liquidity.value}
                    </Typography>
                    <Tooltip
                      title={vehicle.liquidity.details}
                      arrow
                      placement="top"
                    >
                      <IconButton size="small">
                        <InfoOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>

                {/* Market Safety */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getRatingIcon(vehicle.marketSafety.rating)}
                    <Typography variant="body2" fontWeight={600}>
                      {vehicle.marketSafety.value}
                    </Typography>
                    <Tooltip
                      title={vehicle.marketSafety.details}
                      arrow
                      placement="top"
                    >
                      <IconButton size="small">
                        <InfoOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>

                {/* Tax-Free */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getRatingIcon(vehicle.taxFree.rating)}
                    <Typography variant="body2" fontWeight={600}>
                      {vehicle.taxFree.value}
                    </Typography>
                    <Tooltip
                      title={vehicle.taxFree.details}
                      arrow
                      placement="top"
                    >
                      <IconButton size="small">
                        <InfoOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>

                {/* Leverage */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getRatingIcon(vehicle.leverage.rating)}
                    <Typography variant="body2" fontWeight={600}>
                      {vehicle.leverage.value}
                    </Typography>
                    <Tooltip
                      title={vehicle.leverage.details}
                      arrow
                      placement="top"
                    >
                      <IconButton size="small">
                        <InfoOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>

                {/* Asset Protection */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getRatingIcon(vehicle.assetProtection.rating)}
                    <Typography variant="body2" fontWeight={600}>
                      {vehicle.assetProtection.value}
                    </Typography>
                    <Tooltip
                      title={vehicle.assetProtection.details}
                      arrow
                      placement="top"
                    >
                      <IconButton size="small">
                        <InfoOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>

                {/* Contribution Limits */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getRatingIcon(vehicle.contributionLimits.rating)}
                    <Typography variant="body2" fontWeight={600}>
                      {vehicle.contributionLimits.value}
                    </Typography>
                    <Tooltip
                      title={vehicle.contributionLimits.details}
                      arrow
                      placement="top"
                    >
                      <IconButton size="small">
                        <InfoOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>

                {/* Average Return */}
                <TableCell>
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color="primary"
                    >
                      {vehicle.avgReturn}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {vehicle.fees}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Legend */}
      <Box mt={3} p={2} sx={{ bgcolor: "#F7F9FC", borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={700} mb={1}>
          Rating Legend:
        </Typography>
        <Box display="flex" gap={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircle sx={{ color: colors.high, fontSize: 20 }} />
            <Typography variant="body2">High/Excellent</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <RemoveCircle sx={{ color: colors.medium, fontSize: 20 }} />
            <Typography variant="body2">Moderate/Partial</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Cancel sx={{ color: colors.low, fontSize: 20 }} />
            <Typography variant="body2">Low/Limited/None</Typography>
          </Box>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={1}
        >
          Hover over the info icons for detailed analysis of each factor.
        </Typography>
      </Box>
    </Box>
  );
}
