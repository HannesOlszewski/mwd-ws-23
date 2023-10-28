import { Database } from "sqlite3";
import { DatabaseUtils } from "./utils/database-utils";
import fs from "fs";

import { ReadlineService } from "./utils/readline-utils";

const database = new Database('assets/db.sqlite');
const databaseUtils = new DatabaseUtils();

const demo_create_table: string = fs.readFileSync("json/create_table.json").toString();

const readlineService = new ReadlineService();
readlineService.closeOnCtrlC("Shutting down...");
readlineService.exitProcessOnClose();

const PORT = process.env.PORT ?? 8080;



databaseUtils.jsonQuery(database, demo_create_table);