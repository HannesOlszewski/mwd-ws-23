import { Database } from "sqlite3";

// Provides functions to interact with db.sqlite 
export class DatabaseUtils {

    public demo_create_columns: string[] = ["name", "description"];
    public demo_create_column_types: string []= ["VARCHAR(128)", "VARCHAR(128)"];

    /**
     * Creates table in provided database.
     * 
     * @param database: sets database.
     * @param table_name: sets table name.
     * @param table_colums: array of column names.
     * @param table_columns_types: array of column types, positions align with @param table_colum's values. Example: "VARCHAR(128)"
     * @returns false if any error occured, else true.
     */

    public createTable(database: Database, table_name: string, table_colums: string[], table_columns_types: string[]): boolean {
        if (table_colums.length != table_columns_types.length) {
            console.error("Table creation unsuccessful.");
            return false;
        } 
        
        //Build query string
        var query: string = "";

        query += "CREATE TABLE IF NOT EXISTS " + table_name + "(";
        query += "id INTEGER PRIMARY KEY AUTOINCREMENT,";

        for (let i = 0; i < table_colums.length && i < table_columns_types.length; i++) {
            query += table_colums[i] + " " + table_columns_types[i] + " NOT NULL";

            // HACK to remove comma in last row, could be better implemented.
            if (table_colums.length - i != 1 && table_columns_types.length - i != 1) {
                query += ",";
            }
        }

        query += ")";

        console.info(query);

        database.exec(query);
        return true;
    }
}