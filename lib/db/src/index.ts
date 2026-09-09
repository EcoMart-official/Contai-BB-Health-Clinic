import Database, { type Database as BetterSqliteDatabase } from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "node:path";
import * as schema from "./schema";

const dbPath = process.env.SQLITE_DB_PATH || path.resolve(process.cwd(), "clinic.db");
const sqlite: BetterSqliteDatabase = new Database(dbPath);

sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT DEFAULT '',
    date_of_birth TEXT DEFAULT '',
    gender TEXT DEFAULT 'Male',
    blood_group TEXT DEFAULT '',
    address TEXT DEFAULT '',
    emergency_phone TEXT DEFAULT '',
    notification_preference TEXT DEFAULT 'WhatsApp',
    account_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS patient_appointments (
    id TEXT PRIMARY KEY,
    phone TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    specialty TEXT DEFAULT '',
    date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    serial_no TEXT NOT NULL,
    token_code TEXT NOT NULL,
    fee TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    payment_id TEXT DEFAULT '',
    status TEXT DEFAULT 'CONFIRMED',
    symptoms TEXT DEFAULT '',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS patient_vitals (
    id TEXT PRIMARY KEY,
    phone TEXT NOT NULL,
    date TEXT NOT NULL,
    sys INTEGER,
    dia INTEGER,
    fasting_sugar INTEGER,
    pulse INTEGER,
    weight REAL,
    status TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS patient_invoices (
    id TEXT PRIMARY KEY,
    phone TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    amount TEXT NOT NULL,
    status TEXT DEFAULT 'PAID',
    mode TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    department TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT NOT NULL,
    reason TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS doctors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    credentials TEXT NOT NULL,
    schedule TEXT NOT NULL,
    bio TEXT NOT NULL,
    image TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    summary TEXT NOT NULL,
    icon TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    caption TEXT NOT NULL,
    image TEXT NOT NULL
  );
`);

function seed() {
  const doctorCount = sqlite.prepare("SELECT count(*) as count FROM doctors").get() as { count: number };
  if (doctorCount.count === 0) {
    const insertDoctor = sqlite.prepare("INSERT INTO doctors (id, name, specialty, credentials, schedule, bio, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
    insertDoctor.run("suman-sarangi", "Dr. Suman Sarangi", "Neuropsychiatry", "MBBS, MD (Neuropsychiatry), MRCPsych Part 1 (UK)", "Every Sunday, 8:30 AM – 10:30 AM", "Support for dementia, epilepsy, Parkinson’s, addiction care, anxiety, OCD, migraine, and neuropathic pain.", "/assets/clinic/patient-hall.png");
    insertDoctor.run("kamal-poddar", "Dr. Kamal Poddar", "Consultant Physician", "MBBS, MD (Medicine), MRCP (UK)", "Every Saturday, 10:00 AM onward", "Thoughtful consultation for sugar, thyroid, pressure, heart, breathing, gas, nerve-related concerns, and follow-up care.", "/assets/clinic/clinic-team-staff.png");
    insertDoctor.run("saikat-maity", "Dr. Saikat Maity", "Dermatology, Hair & Sexual Health", "MD (NM), MSc (Cosmetic & Aesthetic), Diploma in Dermatology", "Every Sunday, 2:00 PM onward", "Specialist attention for skin, hair, cosmetic, aesthetic, and related sexual health concerns.", "/assets/clinic/lab-testing.webp");
    insertDoctor.run("rakesh-mohanty", "Dr. Rakesh Mohanty", "Gastroenterology", "MBBS, MD (Medicine), DM (Gastroenterology)", "Appointment-based consultation", "Advice for gastritis, acidity, abdominal pain, bloating, bowel irregularity, and digestive discomfort.", "/assets/clinic/patient-hall.png");
  }

  const deptCount = sqlite.prepare("SELECT count(*) as count FROM departments").get() as { count: number };
  if (deptCount.count === 0) {
    const insertDept = sqlite.prepare("INSERT INTO departments (id, name, summary, icon) VALUES (?, ?, ?, ?)");
    insertDept.run("general-medicine", "General Medicine", "Everyday medical care for sugar, thyroid, pressure, breathing, and follow-up needs.", "stethoscope");
    insertDept.run("neuropsychiatry", "Neuropsychiatry", "Compassionate support for neurological and mental health concerns.", "brain");
    insertDept.run("dermatology", "Dermatology & Hair", "Skin, hair, cosmetic, aesthetic, and sexual health consultation.", "sparkles");
    insertDept.run("gastroenterology", "Gastroenterology", "Digestive health consultation for acidity, pain, bloating, and bowel changes.", "activity");
    insertDept.run("diagnostics", "Pathology & Diagnostics", "Routine blood, stool, urine, X-Ray, ECG, USG, and digital lab support.", "scan-line");
  }

  const appointmentCount = sqlite.prepare("SELECT count(*) as count FROM appointments").get() as { count: number };
  if (appointmentCount.count === 0) {
    const insertApt = sqlite.prepare("INSERT INTO appointments (id, patient_id, patient_name, phone, doctor_id, doctor_name, department, date, time, status, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    insertApt.run("apt-1001", "patient-demo", "Ananya Das", "+91 98765 43210", "kamal-poddar", "Dr. Kamal Poddar", "General Medicine", "2026-09-12", "10:30 AM", "confirmed", "Routine follow-up");
    insertApt.run("apt-1002", "patient-demo", "Ananya Das", "+91 98765 43210", "suman-sarangi", "Dr. Suman Sarangi", "Neuropsychiatry", "2026-09-20", "09:00 AM", "pending", "Consultation");
  }
}

seed();

export { eq, and, or, sql } from "drizzle-orm";
export type { BetterSqliteDatabase };
export { sqlite };
export * from "./schema";
