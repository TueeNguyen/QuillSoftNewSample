import Dexie from "dexie";
const db = new Dexie("fileDatabase");
db.version(2).stores({ recentFiles: "++id,file,created_at" });
export default db;
