import { getConnection } from "./connection";
import * as Tables from "./tables/InitTables"

export async function initDB() {
    const connection = getConnection()
    const tables = await Tables.initTables(connection)
    return tables
}

export type DB = Tables.DB
