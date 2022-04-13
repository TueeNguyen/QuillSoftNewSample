import Dexie from "dexie";
const KeywordDb = new Dexie("KeywordDatabase");
KeywordDb.version(2).stores({ recentKeywords: "++id,keyWord,created_at" });
export default KeywordDb;
