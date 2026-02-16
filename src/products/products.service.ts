import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import e from 'express';

@Injectable()
export class ProductsService {
    async replace(id: number, updateProductDto: UpdateProductDto) {
        const product = await this.findOne(id);
        Object.assign(product, updateProductDto);
        return this.productsRepo.save(product);
    }
    constructor(
        @InjectRepository(Product)
        private readonly productsRepo: Repository<Product>,
    ) { }

    create(dto: CreateProductDto) {
        const product = this.productsRepo.create(dto);
        return this.productsRepo.save(product);
    }

    findAll() {
        return this.productsRepo.find();
    }

    async findOne(id: number) {
        const product = await this.productsRepo.findOne({ where: { id } });
        if (!product) throw new NotFoundException('Producto no encontrado');
        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        const product = await this.findOne(id);

        Object.assign(product, updateProductDto);

        return this.productsRepo.save(product);
    }

    async remove(id: number) {
        const product = await this.findOne(id);
        await this.productsRepo.remove(product);
        return { deleted: true };
    }
}
