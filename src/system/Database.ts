import { App } from "../app/App";
import { Object3DSchema } from "../app/model/Object3D";

export type DBData = {
  objects: Object3DSchema[];
};

class Database {
  dbName = "local";
  table = "data";

  private indexedDB: IDBFactory;
  public database?: IDBDatabase;
  public results?: DBData;

  constructor() {
    this.indexedDB = window.indexedDB;

    this.set(
      {
        objects: [],
      },
      () => {}
    );
  }

  init(app: App, callBack: () => void) {
    let request = this.indexedDB.open(this.dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(this.table)) {
        db.createObjectStore(this.table);
      }
    };

    request.onsuccess = (event) => {
      this.database = (event.target as IDBOpenDBRequest).result;

      this.get((res) => {
        this.results = res;

        this.results?.objects?.map((schema) => {
          app.sceneController.model.addSchema(schema);
        });

        callBack();
      });
    };
  }

  save(objects: Object3DSchema[], callBack: () => void) {
    this.set(
      {
        objects: objects,
      },
      () => {
        callBack();
      }
    );
  }

  get(callBack: (data: DBData) => void) {
    if (!this.database) return;

    const transaction = this.database.transaction([this.table], "readwrite");
    const objectStore = transaction.objectStore(this.table);
    const request = objectStore.get(0);

    request.onsuccess = (event) => {
      // @ts-ignore
      callBack((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (error) => {
      console.log("error", error);
    };
  }

  set(data: DBData, callBack: () => void) {
    if (!this.database) return;

    const transaction = this.database.transaction([this.table], "readwrite");
    const objectStore = transaction.objectStore(this.table);
    const request = objectStore.put(data, 0);

    request.onsuccess = () => {
      callBack();
    };
  }
}

export { Database };
