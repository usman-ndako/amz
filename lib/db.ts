// lib/db.ts
import Dexie, { Table } from "dexie";

export interface Customer {
  id: string;
  date?: string;
  name: string;
  phone?: string;
  address?: string;

  // numeric measurements
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
  synced?: boolean;    // whether uploaded to Firestore
  _deleted?: boolean;  // tombstone
}

export class AppDB extends Dexie {
  customers!: Table<Customer, string>;

  constructor() {
    super("TailorDB");

    // id is primary key; we index timestamp / name / synced / _deleted for queries
    this.version(3).stores({
      customers: "id, timestamp, name, phone, synced, _deleted",
    });
  }
}

export const db = new AppDB();
