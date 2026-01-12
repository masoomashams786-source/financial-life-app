export const createCalculationPayload = (plans, inputs) => {
  const payload = {
    plans,
    params: {
      current_age: parseInt(inputs.current_age),
      monthly_contribution: parseFloat(inputs.monthly_contribution),
      years_to_contribute: parseInt(inputs.years_to_contribute),
      income_start_age: parseInt(inputs.income_start_age),
      income_end_age: parseInt(inputs.income_end_age),
      current_value: parseFloat(inputs.current_value),
      tax_rate: parseFloat(inputs.tax_rate),
      inflation_rate: parseFloat(inputs.inflation_rate),
    },
  };
  return payload;
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercent = (value) => {
  return `${(value * 100).toFixed(1)}%`;
};
