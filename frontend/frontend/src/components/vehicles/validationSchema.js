import { z } from "zod";

export const calculatorSchema = z
  .object({
    current_age: z
      .string()
      .min(1, "Please fill in all required fields"),

    monthly_contribution: z
      .string()
      .min(1, "Please fill in all required fields"),

    years_to_contribute: z
      .string()
      .min(1, "Please fill in all required fields"),

    income_start_age: z
      .string()
      .min(1, "Please fill in all required fields"),

    income_end_age: z
      .string()
      .min(1, "Please fill in all required fields"),

    current_value: z.string().default("0"),

    tax_rate: z.string().default("0.25"),

    inflation_rate: z.string().default("0.03"),
  })
  .refine(
    (data) => {
      // Only validate if both fields have values
      if (!data.current_age || !data.income_start_age) return true;
      
      const currentAge = parseInt(data.current_age);
      const incomeStartAge = parseInt(data.income_start_age);
      
      return incomeStartAge > currentAge;
    },
    {
      message: "Income start age must be greater than current age.",
      path: ["income_start_age"],
    }
  )
  .refine(
    (data) => {
      // Only validate if both fields have values
      if (!data.income_start_age || !data.income_end_age) return true;
      
      const incomeStartAge = parseInt(data.income_start_age);
      const incomeEndAge = parseInt(data.income_end_age);
      
      return incomeEndAge > incomeStartAge;
    },
    {
      message: "Income end age must be greater than income start age.",
      path: ["income_end_age"],
    }
  )
  .refine(
    (data) => {
      // Only validate if ALL three fields have values
      if (!data.current_age || !data.years_to_contribute || !data.income_start_age) return true;
      
      const currentAge = parseInt(data.current_age);
      const yearsToContribute = parseInt(data.years_to_contribute);
      const incomeStartAge = parseInt(data.income_start_age);
      
      return currentAge + yearsToContribute <= incomeStartAge;
    },
    {
      message: "You cannot contribute beyond your income start age.",
      path: ["years_to_contribute"],
    }
  );