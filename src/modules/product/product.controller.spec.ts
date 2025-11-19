import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { EntityManager } from '@mikro-orm/postgresql';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Product } from '../../entities/Product';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let mockProductRepository: {
    findAll: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
  };
  let mockEntityManager: {
    flush: jest.Mock;
    persistAndFlush: jest.Mock;
    removeAndFlush: jest.Mock;
  };

  beforeEach(async () => {
    mockProductRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    };

    mockEntityManager = {
      flush: jest.fn(),
      persistAndFlush: jest.fn(),
      removeAndFlush: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of products', async () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          price: 100,
          stock: 10,
        },
      ];
      mockProductRepository.findAll.mockResolvedValue(mockProducts);

      const result = await controller.find();

      expect(mockProductRepository.findAll).toHaveBeenCalledWith({
        populate: ['name', 'description', 'price', 'stock'],
        orderBy: { name: 'DESC' },
        limit: 20,
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a product when found', async () => {
      const mockProduct = {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        stock: 10,
      };
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne(1);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith(1, {
        populate: ['name', 'description', 'price', 'stock'],
      });
      expect(result).toBeDefined();
    });

    it('should throw HttpException when product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(controller.findOne(1)).rejects.toThrow(
        new HttpException('Product with ID 1 not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        description: 'New Description',
        price: 200,
        stock: 5,
      };
      const mockProduct = { id: 1, ...createProductDto };
      mockProductRepository.create.mockReturnValue(mockProduct);

      const result = await controller.create(createProductDto);

      expect(mockProductRepository.create).toHaveBeenCalledWith(
        createProductDto,
      );
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(
        mockProduct,
      );
      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };
      const mockProduct = {
        id: 1,
        name: 'Original Product',
        description: 'Description',
        price: 100,
        stock: 10,
      };
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      const result = await controller.update(1, updateProductDto);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith(1);
      expect(mockEntityManager.flush).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw HttpException when product not found for update', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };

      await expect(controller.update(1, updateProductDto)).rejects.toThrow(
        new HttpException('Product with ID 1 not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing product', async () => {
      const mockProduct = { id: 1, name: 'Product 1' };
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      await controller.delete(1);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith(1, {
        populate: [],
      });
      expect(mockEntityManager.removeAndFlush).toHaveBeenCalledWith(
        mockProduct,
      );
    });

    it('should throw HttpException when product not found for deletion', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(controller.delete(1)).rejects.toThrow(
        new HttpException('Product with ID 1 not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
