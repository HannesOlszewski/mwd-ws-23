import { Database } from "sqlite3";
import { DatabaseUtils } from "./utils/database-utils";
import fs from "fs";

const database = new Database('assets/db.sqlite');
const databaseUtils = new DatabaseUtils();

const demo_create_table: string = fs.readFileSync("json/create_table.json").toString();

databaseUtils.jsonQuery(database, demo_create_table);