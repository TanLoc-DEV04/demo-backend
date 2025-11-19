import { IsString, IsNumber, IsNotEmpty, IsPositive, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({
    example: 'iPhone 14 Pro',
    description: 'The updated name of the product',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Latest iPhone Pro model with advanced features',
    description: 'The updated description of the product',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 1199.99,
    description: 'The updated price of the product',
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    example: 30,
    description: 'The updated stock quantity of the product',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;
}