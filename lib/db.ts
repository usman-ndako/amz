// // lib/db.ts
// import Dexie, { Table } from "dexie";

// export interface Customer {
//   id: string;
//   name: string;
//   phone: string;
//   address?: string;
//   top?: string;
//   shoulder?: string;
//   hand?: string;
//   burst?: string;
//   neck?: string;
//   trouser?: string;
//   length?: string;
//   waist?: string;
//   bmb?: string;
//   links?: string;
//   timestamp: number;  // Last updated
//   synced?: boolean;           // whether record has been uploaded to Firestore
//   _deleted?: boolean;         // mark for deletion if offline
// }

// export class AppDB extends Dexie {
//   customers!: Table<Customer, string>;

//   constructor() {
//     super("TailorDB");

//     this.version(1).stores({
//       customers: "id, name, phone, address, timestamp",
//     });
//   }
// }

// export const db = new AppDB();

// // lib/db.ts
// import Dexie, { Table } from "dexie";

// export interface Customer {
//   id: string;
//   date: string;       // auto-generated string date
//   name: string;
//   phone: string;
//   address: string;

//   // measurements (numbers)
//   shoulder?: number;
//   sleeveLength?: number;
//   topLength?: number;
//   chest?: number;
//   tommy?: number;
//   neck?: number;
//   cufflinks?: number;
//   trouserLength?: number;
//   waist?: number;
//   lap?: number;
//   ankleSize?: number;
//   calf?: number;
//   embroidery?: number;
//   lengthWidth?: number;

//   timestamp: number;   // last updated (ms)
//   synced?: boolean;
//   _deleted?: boolean;
// }

// export class AppDB extends Dexie {
//   customers!: Table<Customer, string>;

//   constructor() {
//     super("TailorDB");

//     this.version(2).stores({
//       customers: "id, name, phone, address, timestamp",
//     });
//   }
// }

// export const db = new AppDB();

// // lib/db.ts
// import Dexie, { Table } from "dexie";

// export interface Customer {
//   id: string;
//   date: string;       // auto-generated string date
//   name: string;
//   phone: string;
//   address: string;

//   // measurements (numbers)
//   shoulder?: number;
//   sleeveLength?: number;
//   topLength?: number;
//   chest?: number;
//   tommy?: number;
//   neck?: number;
//   cufflinks?: number;
//   trouserLength?: number;
//   waist?: number;
//   lap?: number;
//   ankleSize?: number;
//   calf?: number;
  

//   // string
//   embroidery?: string;
//   lengthWidth?: string;


//   timestamp: number;   // last updated (ms)
//   synced?: boolean;
//   _deleted?: boolean;
// }

// export class AppDB extends Dexie {
//   customers!: Table<Customer, string>;

//   constructor() {
//     super("TailorDB");

//     this.version(2).stores({
//       customers: "id, name, phone, address, timestamp",
//     });
//   }
// }

// export const db = new AppDB();

// lib/db.ts
import Dexie, { Table } from "dexie";

export interface Customer {
  id: string;
  date: string;       // auto-generated string date
  name: string;
  phone: string;
  address: string;

  // measurements (numbers)
  shoulder?: number;
  sleeveLength?: number;
  topLength?: number;
  chest?: number;
  tommy?: number;
  neck?: number;
  cufflinks?: number;
  trouserLength?: number;
  waist?: number;
  lap?: number;
  ankleSize?: number;
  calf?: number;

  // string fields
  embroidery?: string;
  lengthWidth?: string;

  timestamp: number;   // last updated (ms)
  synced?: boolean;
  _deleted?: boolean;
}

export class AppDB extends Dexie {
  customers!: Table<Customer, string>;

  constructor() {
    super("TailorDB");

    this.version(2).stores({
      customers: "id, name, phone, address, timestamp",
    });
  }
}

export const db = new AppDB();
