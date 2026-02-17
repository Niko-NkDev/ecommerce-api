import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', {
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => Number(value),
    },
  })
  price: number;
}
