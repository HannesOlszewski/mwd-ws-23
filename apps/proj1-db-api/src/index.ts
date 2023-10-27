import { Database } from "sqlite3";
import { DatabaseUtils } from "./utils/database-utils";

const database = new Database('assets/db.sqlite');
const databaseUtils = new DatabaseUtils();

database.get(
    'SELECT RANDOM() % 100 as result',
    (_, res) => console.log(res)
);

databaseUtils.createTable(
    database,
    "items",
    databaseUtils.demo_create_columns,
    databaseUtils.demo_create_column_types
);
