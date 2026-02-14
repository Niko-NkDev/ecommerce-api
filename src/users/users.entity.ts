import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Cart } from '../carts/cart.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @OneToOne(() => Cart, (cart) => cart.user)
    cart: Cart;
}
