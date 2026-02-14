import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { User } from './users/users.entity';
import { Product } from './products/products.entity';
import { Cart } from './carts/cart.entity';
import { CartItem } from './cart-items/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin123',
      database: 'mi_carrito_db',
      entities: [User, Product, Cart, CartItem],
      // autoLoadEntities: true, // esta parte me ayudara a cargar todas las entidades que cree en cada modulo, pero no es recomendable usarlo en produccion
      synchronize: true, // esta parte me ayudara a crear todas las tablas de la base de datos a partir de las entidades que cree en cada modulo, pero no es recomendable usarlo en produccion
      // logging: true, // esta parte me ayudara a ver las consultas SQL que se estan ejecutando en la consola, pero no es recomendable usarlo en produccion
    }),
    UsersModule,
    ProductsModule,
    CartsModule,
    CartItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
