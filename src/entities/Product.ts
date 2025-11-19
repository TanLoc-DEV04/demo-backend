import { Entity, Property, Opt, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class Product {
  @PrimaryKey()
  id!: number;

  @Property()
  createdAt: Date & Opt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();

  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Property()
  price: number;

  @Property({ default: 0 })
  stock: number & Opt = 0;

  constructor(name: string, price: number, description?: string, stock?: number) {
    this.name = name;
    this.price = price;
    this.description = description;
    if (stock !== undefined) {
      this.stock = stock;
    }
  }
}