export const API_ENDPOINTS = {
  // GS1 Solution Provider Registration
  // POST /become_solution_provider/{crNumber}  — multipart/form-data
  BECOME_SOLUTION_PROVIDER: "/become_solution_provider/:crNumber",

  // Lookup / Dropdowns
  GET_CATEGORIES: "/lookup/categories",
  GET_COUNTRIES:  "/lookup/countries",
  GET_FEES:       "/lookup/fees",
} as const;
