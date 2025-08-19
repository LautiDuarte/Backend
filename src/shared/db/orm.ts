import { MikroORM } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { MySqlDriver } from '@mikro-orm/mysql';


//export const orm = await MikroORM.init({
//  entities: ['dist/**/*.entity.js'],
//  entitiesTs: ['src/**/*.entity.ts'],
//  dbName: 'dbEsports',
//  driver: MySqlDriver,
//  clientUrl: 'mysql://root:administrador@localhost:3306/dbEsports',
//  highlighter: new SqlHighlighter(),
//  debug: true,
//  schemaGenerator: {
//    disableForeignKeys: true, // not recommended for production
//    createForeignKeyConstraints: true,
//    ignoreSchema: [],
//  },
//}); 

const url =
  process.env.DATABASE_URL ||
  `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}` +
  `@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  driver: MySqlDriver,
  clientUrl: url,
  highlighter: new SqlHighlighter(),
  debug: process.env.NODE_ENV !== 'production',
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  /*   
  await generator.dropSchema() // Uncomment to drop the schema
  await generator.createSchema() // Uncomment to create the schema from scratch
  */
  await generator.updateSchema();
}; 