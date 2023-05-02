import { Sequelize } from "sequelize";

export function getConnection() {
    const sequelize = new Sequelize({
        database: 'college',
        username: "postgres",
        host: "localhost",
        dialect: "postgres",
        port: 5432,
        password: "1234",
        logging: (sql) => {
            console.log("Query: %s", sql)
        }
    });
    return sequelize;
} 