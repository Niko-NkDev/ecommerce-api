import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepo: Repository<User>,
	) {}

	async create(createUserDto: CreateUserDto) {
		const user = this.usersRepo.create(createUserDto);
		try {
			return await this.usersRepo.save(user);
		} catch (err: any) {
			// Postgres unique violation code
			if (err?.code === '23505') {
				throw new ConflictException('El email ya está registrado');
			}
			throw err;
		}
	}

	findAll() {
		return this.usersRepo.find({ relations: ['cart'] });
	}

	async findOne(id: number) {
		const user = await this.usersRepo.findOne({ where: { id }, relations: ['cart'] });
		if (!user) throw new NotFoundException('Usuario no encontrado');
		return user;
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		const user = await this.findOne(id);
		Object.assign(user, updateUserDto);
		return this.usersRepo.save(user);
	}

	async remove(id: number) {
		const user = await this.findOne(id);
		await this.usersRepo.remove(user);
		return { deleted: true };
	}
}
