import { Database } from "sqlite3";

const database = new Database('assets/db.sqlite');

database.get(
    'SELECT RANDOM() % 100 as result',
    (_, res) => console.log(res)
)
