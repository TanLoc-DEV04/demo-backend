import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product } from '../../../entities/Product';

export class ProductResponseDto {
  @ApiProperty({ example: 1, description: 'The unique ID of the product' })
  id: number;

  @ApiProperty({ example: 'iPhone 14', description: 'The name of the product' })
  name: string;

  @ApiPropertyOptional({ example: 'Latest iPhone model with advanced features', description: 'The description of the product (optional)' })
  description?: string;

  @ApiProperty({ example: 999.99, description: 'The price of the product' })
  price: number;

  @ApiProperty({ example: 50, description: 'The stock quantity of the product' })
  stock: number;

  @ApiProperty({
    description: 'The date and time the product was created',
    example: '2025-11-08T16:56:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the product was last updated',
    example: '2025-11-08T16:56:00.000Z',
  })
  updatedAt: Date;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.stock = product.stock;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}