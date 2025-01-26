import { DataSource } from "typeorm";
import { config } from "./config";

const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: parseInt(config.DB_PORT || "5432", 10),
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    entities: ["src/infra/entities/**/*.entity.{js,ts}"],
    migrations: ["src/infra/db/migrations/**/*.ts"],
});

dataSource
    .initialize()
    .then(() => {
        console.log("DataSource has been initialized!");
    })
    .catch((err) => {
        console.error("Error during DataSource initialization", err);
    });

export default dataSource;
