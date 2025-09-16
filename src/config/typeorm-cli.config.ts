// Registrar tsconfig-paths antes de importar cualquier otra cosa
import './typeorm-register';

import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

config();

// Configurar las rutas relativas
const rootDir = path.resolve(__dirname, '..');
const entitiesPath = path.join(rootDir, '**', '*.entity{.ts,.js}');
const migrationsPath = path.join(rootDir, 'migrations', '*{.ts,.js}');

export default new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'myagen',
  entities: [entitiesPath],
  migrations: [migrationsPath],
  // Esto permite que TypeORM resuelva las entidades sin necesidad de usar los alias @/
  synchronize: false,
});
