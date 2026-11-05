import { describe, expect, it } from "vitest";
import customers from "@/data/customers.json";
import { filterCustomers, getCityOptions, splitName } from "@/lib/customer-filters";

describe("City-wise customers", () => {
  it("shows only the selected city's customers with their original numbers", () => {
    const results = filterCustomers(customers, "", "BHABHRA");
    expect(results.map(c => c.id)).toEqual([2, 3, 4, 5, 6, 7, 8]);
    expect(results[0]?.phone).toBe("0302-6733467");
  });
  it("combines city selection with name and number searches", () => {
    expect(filterCustomers(customers, "imran", "BHABHRA").map(c => c.id)).toEqual([2]);
    expect(filterCustomers(customers, "03026733467", "BHABHRA").map(c => c.id)).toEqual([2]);
    expect(filterCustomers(customers, "03026733467", "BHALWAL")).toEqual([]);
  });
  it("restores all customers and retains entries without a city", () => {
    expect(filterCustomers(customers, "", "all")).toHaveLength(386);
    expect(filterCustomers(customers, "", "unassigned").map(c => c.id)).toEqual([49, 384]);
  });
  it("includes city entries even when their name has a missing closing bracket", () => {
    expect(splitName("M.B.DIN (AKASH CROCEKRY").city).toBe("M.B.DIN");
    expect(getCityOptions(customers).find(c => c.city === "M.B.DIN")?.count).toBe(65);
  });
});