import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config';
import * as dotenv from 'dotenv';
dotenv.config();

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.DB_HOST || dbConfig.host,
  port: 5432,
  username: process.env.DB_USERNAME || dbConfig.username,
  password: process.env.DB_PASSWORD || dbConfig.password,
  database: process.env.DB_DATABASE || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.DB_SYNC || dbConfig.synchronize,
  logging: ['query'],
}
