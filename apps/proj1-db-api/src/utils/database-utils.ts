import { Database } from "sqlite3";

type message = {
    action: string,
    type: string,
    name: string,
    data: string[],
    data_types: string[]
};

/**
 * This class provides methods to interact with the database, e.g. insert new data or query a search string.
 */

export class DatabaseUtils {

    /**
     * This function parses JSON formatted data and selects 
     * depending on the database method (CRUD) and data type (table, entry)
     * the corresponding class method to execute a sqlite3 query.
     * 
     * @param database - sets database.
     * @param json - JSON formatted data, needs to fit the message type.
     * @returns false if query execution was successful, else true.
     */

    public jsonQuery(database: Database, json: string): void {
        var message: message = JSON.parse(json);

        switch (message['action']) {
            case "create":
                switch (message['type']) {
                    case "table":
                        if (this.createTable(database, message['name'], message['data'], message['data_types'])) {
                            console.log("Table creation successful.")
                        } else {
                            console.error("Error during table creaton.");
                        }
                        break;
                    case "entry":
                        break;
                    default:
                        console.error("No creatable data type detected.");
                        break;
                }
            case "read":
                break;
            case "update":
                break;
            case "delete":
                break;
            default:
                console.error("Error detecting database method (CRUD).");
                break;
        }
    }

    /**
     * Creates table in provided database.
     * 
     * @param database - sets database.
     * @param table_name - sets table name.
     * @param table_colums - array of column names.
     * @param table_columns_types - array of column types, positions align with @param table_colum's values. Example: "VARCHAR(128)"
     * @returns false if any error occured, else true.
     */

    public createTable(database: Database, table_name: string, table_colums: string[], table_columns_types: string[]): boolean {
        if (table_colums.length != table_columns_types.length) {
            return false;
        }

        //Build query string
        var query: string = "";

        query += "CREATE TABLE IF NOT EXISTS " + table_name + "(";
        query += "id INTEGER PRIMARY KEY AUTOINCREMENT,";

        for (let i = 0; i < table_colums.length && i < table_columns_types.length; i++) {
            query += table_colums[i] + " " + table_columns_types[i] + " NOT NULL";

            // HACK to not set comma in last row of query, could be better implemented.
            if (table_colums.length - i != 1 && table_columns_types.length - i != 1) {
                query += ",";
            }
        }

        query += ")";

        database.exec(query);
        return true;
    }
}