import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const patientsTable = sqliteTable("patients", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  bloodGroup: text("blood_group"),
  address: text("address"),
  emergencyPhone: text("emergency_phone"),
  notificationPreference: text("notification_preference"),
  accountId: text("account_id").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const patientAppointmentsTable = sqliteTable("patient_appointments", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull(),
  patientName: text("patient_name").notNull(),
  doctorId: text("doctor_id").notNull(),
  doctorName: text("doctor_name").notNull(),
  specialty: text("specialty"),
  date: text("date").notNull(),
  timeSlot: text("time_slot").notNull(),
  serialNo: text("serial_no").notNull(),
  tokenCode: text("token_code").notNull(),
  fee: text("fee").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentId: text("payment_id"),
  status: text("status").notNull(),
  symptoms: text("symptoms"),
  createdAt: text("created_at").notNull(),
});

export const patientVitalsTable = sqliteTable("patient_vitals", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull(),
  date: text("date").notNull(),
  sys: integer("sys"),
  dia: integer("dia"),
  fastingSugar: integer("fasting_sugar"),
  pulse: integer("pulse"),
  weight: real("weight"),
  status: text("status"),
  createdAt: text("created_at").notNull(),
});

export const patientInvoicesTable = sqliteTable("patient_invoices", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  amount: text("amount").notNull(),
  status: text("status").notNull(),
  mode: text("mode").notNull(),
  createdAt: text("created_at").notNull(),
});

export const appointmentsTable = sqliteTable("appointments", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull(),
  patientName: text("patient_name").notNull(),
  phone: text("phone").notNull(),
  doctorId: text("doctor_id").notNull(),
  doctorName: text("doctor_name").notNull(),
  department: text("department").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull(),
  reason: text("reason").notNull(),
});

export const insertAppointmentSchema = createInsertSchema(appointmentsTable);
export type InsertAppointment = typeof appointmentsTable.$inferInsert;
export type Appointment = typeof appointmentsTable.$inferSelect;

export const doctorsTable = sqliteTable("doctors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  credentials: text("credentials").notNull(),
  schedule: text("schedule").notNull(),
  bio: text("bio").notNull(),
  image: text("image").notNull(),
});

export const departmentsTable = sqliteTable("departments", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  summary: text("summary").notNull(),
  icon: text("icon").notNull(),
});

export const servicesTable = sqliteTable("services", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
});

export const faqsTable = sqliteTable("faqs", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});

export const galleryTable = sqliteTable("gallery", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  caption: text("caption").notNull(),
  image: text("image").notNull(),
});
