export type Customer = { id: number; name: string; phone: string };

export function splitName(name: string) {
  const opening = name.indexOf("(");
  if (opening < 0) return { city: "", shop: name, code: "" };
  const city = name.slice(0, opening).trim();
  const closing = name.indexOf(")", opening);
  const shop = name.slice(opening + 1, closing < 0 ? undefined : closing).trim();
  const code = closing < 0 ? "" : name.slice(closing + 1).match(/\((\d+)\)/)?.[1] ?? "";
  return { city, shop: shop || name, code };
}

export function getCityOptions(customers: Customer[]) {
  const counts = new Map<string, number>();
  for (const customer of customers) {
    const city = splitName(customer.name).city;
    if (city) counts.set(city, (counts.get(city) ?? 0) + 1);
  }
  return [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([city, count]) => ({ city, count }));
}

export function hasPhone(customer: Customer) {
  return customer.phone.replace(/\D/g, "").length > 0;
}

export function filterCustomers(customers: Customer[], query: string, city: string) {
  const search = query.trim().toLowerCase();
  const digits = search.replace(/\D/g, "");
  return customers.filter((customer) => {
    const customerCity = splitName(customer.name).city;
    const matchesCity = city === "all" || (city === "unassigned" ? !customerCity : customerCity === city);
    const matchesSearch = !search || customer.name.toLowerCase().includes(search) ||
      (digits.length > 0 && customer.phone.replace(/\D/g, "").includes(digits));
    return matchesCity && matchesSearch;
  });
}