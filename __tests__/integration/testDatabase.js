import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { Sequelize } from "sequelize";

let container;
let sequelize;

export async function startTestDatabase() {
  container = await new PostgreSqlContainer("postgres:16")
    .withDatabase("novashop_test")
    .withUsername("testuser")
    .withPassword("testpassword")
    .start();

  sequelize = new Sequelize({
    host: container.getHost(),
    port: container.getPort(),
    username: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
    dialect: "postgres",
    logging: false,
  });

  await sequelize.authenticate();

  return sequelize;
}

export async function stopTestDatabase() {
  if (sequelize) {
    await sequelize.close();
  }

  if (container) {
    await container.stop();
  }
}