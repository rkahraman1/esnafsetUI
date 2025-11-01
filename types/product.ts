export type Money = number;
export type SizeId = "regular" | "large";
export type AddOnId = string;

export interface ProductSize {
  id: SizeId;
  name: string;
  delta: Money;
}

export interface ProductAddOn {
  id: AddOnId;
  name: string;
  price: Money;
}

export interface ProductDetail {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  basePrice: Money;
  sizes: ProductSize[];
  addOns: ProductAddOn[];
}

export interface SelectionState {
  size: SizeId;
  quantity: number;
  addOns: Set<AddOnId>;
}

export interface OrderItem {
  productId: string;
  size: SizeId;
  addOns: AddOnId[];
  quantity: number;
  unitPrice: Money;
  totalPrice: Money;
}

export function computeLinePrice(p: ProductDetail, s: SelectionState): Money {
  const sizeDelta = p.sizes.find(x => x.id === s.size)?.delta ?? 0;
  const addOnsTotal = p.addOns
    .filter(a => s.addOns.has(a.id))
    .reduce((sum, a) => sum + a.price, 0);
  const unit = p.basePrice + sizeDelta + addOnsTotal;
  return unit * s.quantity;
}

export function computeUnitPrice(p: ProductDetail, s: SelectionState): Money {
  const sizeDelta = p.sizes.find(x => x.id === s.size)?.delta ?? 0;
  const addOnsTotal = p.addOns
    .filter(a => s.addOns.has(a.id))
    .reduce((sum, a) => sum + a.price, 0);
  return p.basePrice + sizeDelta + addOnsTotal;
}

export function computeAddOnsTotal(p: ProductDetail, s: SelectionState): Money {
  return p.addOns
    .filter(a => s.addOns.has(a.id))
    .reduce((sum, a) => sum + a.price, 0);
}
