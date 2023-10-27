import fs from 'fs';
import { Database } from "sqlite3";

// Provides functions to interact with db.sqlite 
export class DatabaseUtils {
    public initializeDatabaseSchema(database: Database, schema_filename: String): void {
        database.exec(fs.readFileSync('assets/schema/' + schema_filename).toString());
    }
}