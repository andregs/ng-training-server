import { autoserialize as a, autoserializeAs as aas } from 'cerialize';

export class User {
  @a id: number;
  @a email: string;
  @a firstName: string;
  @a lastName: string;
  @aas(Date) birthdate: Date;
  @a admin = false;
  @a authenticated: boolean;

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }
}

export class Product {
  @a id: number;
  @a name: string;
  @a color: string;
  @a price: number;
  @a categoryId: number;

  constructor(data?: Partial<Product>) {
    Object.assign(this, data);
  }
}

export class Category {
  @a id: number;
  @a name: string;
  @aas(Product) products: Product[];

  constructor(data?: Partial<Category>) {
    Object.assign(this, data);
  }
}

export class OrderItem {
  @a id: number;
  @a orderId: number;
  @aas(Product) product: Product;
  @a quantity: number;

  constructor(data?: Partial<OrderItem>) {
    Object.assign(this, data);
  }
}

export class Order {
  @a id: number;
  @aas(OrderItem) items: OrderItem[];
  @aas(User) customer: User;
  @aas(Date) orderDate: Date;

  constructor(data?: Partial<Order>) {
    Object.assign(this, data);
  }
}
