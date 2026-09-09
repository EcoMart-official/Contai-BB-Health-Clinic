import { Router, type IRouter } from "express";
import { sqlite } from "@workspace/db";

const router: IRouter = Router();

function normalizePhone(rawPhone: string): string {
  if (!rawPhone) return "";
  const digits = rawPhone.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

// Ensure admin_settings table exists
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

// Initialize sample settings if empty
const settingsCount = sqlite.prepare("SELECT count(*) as c FROM admin_settings").get() as { c: number };
if (settingsCount.c === 0) {
  const now = new Date().toISOString();
  const insertSetting = sqlite.prepare("INSERT INTO admin_settings (key, value, updated_at) VALUES (?, ?, ?)");
  insertSetting.run("clinic_name", "Contai B.B. Health Clinic", now);
  insertSetting.run("clinic_tagline", "Specialist Doctors Chamber & Digital Diagnostic Centre", now);
  insertSetting.run("clinic_phone", "+91 89789 33511 / +91 77181 49150", now);
  insertSetting.run("clinic_email", "contaibbhealthclinic@gmail.com", now);
  insertSetting.run("clinic_address", "Padmapukuria, Contai Bypass Road (NH Kolkata Route), Contai, Purba Medinipur, WB - 721401", now);
  insertSetting.run("ai_booking_enabled", "true", now);
  insertSetting.run("ai_whatsapp_auto_reply", "true", now);
  insertSetting.run("ai_triage_active", "true", now);
}

// Seed initial realistic appointments if empty or few, matching the reference image
function seedInitialAdminData() {
  const count = sqlite.prepare("SELECT count(*) as c FROM patient_appointments").get() as { c: number };
  if (count.c < 5) {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString().split("T")[0];
    const nextWeek = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const nextWeek2 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const insertApt = sqlite.prepare(`
      INSERT OR IGNORE INTO patient_appointments (
        id, phone, patient_name, doctor_id, doctor_name, specialty,
        date, time_slot, serial_no, token_code, fee, payment_method,
        payment_id, status, symptoms, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertPatient = sqlite.prepare(`
      INSERT OR IGNORE INTO patients (
        id, phone, full_name, email, date_of_birth, gender,
        blood_group, address, emergency_phone, notification_preference,
        account_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertInvoice = sqlite.prepare(`
      INSERT OR IGNORE INTO patient_invoices (
        id, phone, description, date, amount, status, mode, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Sample Patients matching reference image
    const patients = [
      { id: "pat-1", phone: "9876543210", name: "Demo Smith", email: "demo.smith@gmail.com", dob: "1988-04-12", gender: "Male", blood: "O+", address: "Contai Central Town" },
      { id: "pat-2", phone: "9123456789", name: "Sample Kumar", email: "sample@gmail.com", dob: "1994-08-20", gender: "Female", blood: "B+", address: "Bypass Road, Contai" },
      { id: "pat-3", phone: "9999999999", name: "Jone Test", email: "jone.test@gmail.com", dob: "1982-11-05", gender: "Male", blood: "A+", address: "Digha Road, Contai" },
      { id: "pat-4", phone: "8888888888", name: "Ananya Das", email: "ananya.das@gmail.com", dob: "1991-03-15", gender: "Female", blood: "AB+", address: "Contai Super Market" },
      { id: "pat-5", phone: "7777777777", name: "Rahul Mukherjee", email: "rahul.m@gmail.com", dob: "1975-06-30", gender: "Male", blood: "O-", address: "Padmapukuria, Contai" },
      { id: "pat-6", phone: "9434012345", name: "Subhasis Panda", email: "subhasis.p@gmail.com", dob: "1985-01-10", gender: "Male", blood: "B+", address: "Kanthi Railway Station Rd" },
      { id: "pat-7", phone: "9832098765", name: "Priyanka Giri", email: "priyanka.g@gmail.com", dob: "1996-09-22", gender: "Female", blood: "O+", address: "Marishda, Contai" },
      { id: "pat-8", phone: "9733055443", name: "Debabrata Maity", email: "debabrata.m@gmail.com", dob: "1968-12-04", gender: "Male", blood: "A-", address: "Mecheda Link Rd" },
      { id: "pat-9", phone: "9126088776", name: "Snigdha Barman", email: "snigdha.b@gmail.com", dob: "1990-07-18", gender: "Female", blood: "B+", address: "Egra-Contai Main Rd" },
      { id: "pat-10", phone: "9564033221", name: "Demo User", email: "theblockchaincoders@gmail.com", dob: "1993-05-25", gender: "Male", blood: "O+", address: "Tech Park, Contai" },
    ];

    for (const p of patients) {
      insertPatient.run(
        p.id,
        p.phone,
        p.name,
        p.email,
        p.dob,
        p.gender,
        p.blood,
        p.address,
        "+91 89789 33511",
        "WhatsApp",
        `BBHC-${Math.floor(100000 + Math.random() * 900000)}`,
        now.toISOString(),
        now.toISOString()
      );
    }

    // Today's appointments (4 items matching reference image)
    insertApt.run("apt-ref-1", "9876543210", "Demo Smith", "kamal-poddar", "Dr. Kamal Poddar", "General Consultation", todayStr, "03:30 PM - 04:00 PM", "#01", "BBHC-SER-101", "₹500", "Pay at Clinic Counter", "", "CONFIRMED", "Blood sugar follow-up", now.toISOString());
    insertApt.run("apt-ref-2", "9123456789", "Sample Kumar", "suman-sarangi", "Dr. Suman Sarangi", "General Consultation", todayStr, "03:30 PM - 04:00 PM", "#02", "BBHC-SER-102", "₹500", "Razorpay Online", "pay_mock123", "NO_SHOW", "Headache and anxiety", now.toISOString());
    insertApt.run("apt-ref-3", "9999999999", "Jone Test", "kamal-poddar", "Dr. Kamal Poddar", "General Consultation", todayStr, "03:30 PM - 04:00 PM", "#03", "BBHC-SER-103", "₹500", "Pay at Clinic Counter", "", "BOOKED", "Routine check-up", now.toISOString());
    insertApt.run("apt-ref-4", "9999999999", "Jone Test", "saikat-maity", "Dr. Saikat Maity", "General Consultation", todayStr, "06:45 PM - 07:15 PM", "#04", "BBHC-SER-104", "₹400", "Pay at Clinic Counter", "", "BOOKED", "Skin allergy review", now.toISOString());

    // Upcoming appointments (matching reference list)
    insertApt.run("apt-ref-5", "9999999999", "Jone Test", "kamal-poddar", "Dr. Kamal Poddar", "General Consultation", tomorrow, "03:30 PM - 04:00 PM", "#05", "BBHC-SER-105", "₹500", "Pay at Clinic Counter", "", "CONFIRMED", "Follow-up", now.toISOString());
    insertApt.run("apt-ref-6", "9876543210", "Demo Smith", "rakesh-mohanty", "Dr. Rakesh Mohanty", "General Consultation", tomorrow, "03:30 PM - 04:00 PM", "#06", "BBHC-SER-106", "₹500", "Pay at Clinic Counter", "", "CONFIRMED", "Gastric evaluation", now.toISOString());
    insertApt.run("apt-ref-7", "9999999999", "Jone Test", "kamal-poddar", "Dr. Kamal Poddar", "General Consultation", tomorrow, "06:45 PM - 07:15 PM", "#07", "BBHC-SER-107", "₹500", "Pay at Clinic Counter", "", "CONFIRMED", "Second opinion", now.toISOString());
    insertApt.run("apt-ref-8", "9999999999", "Jone Test", "suman-sarangi", "Dr. Suman Sarangi", "General Consultation", dayAfter, "03:30 PM - 04:00 PM", "#08", "BBHC-SER-108", "₹500", "Pay at Clinic Counter", "", "BOOKED", "Counseling session", now.toISOString());
    insertApt.run("apt-ref-9", "9564033221", "Demo User", "kamal-poddar", "Dr. Kamal Poddar", "General Consultation", nextWeek, "04:00 PM - 04:30 PM", "#09", "BBHC-SER-109", "₹500", "Razorpay Online", "pay_user777", "CONFIRMED", "Annual physical", now.toISOString());
    insertApt.run("apt-ref-10", "9999999999", "Jone Test", "saikat-maity", "Dr. Saikat Maity", "General Consultation", nextWeek2, "02:30 PM - 03:00 PM", "#10", "BBHC-SER-110", "₹400", "Pay at Clinic Counter", "", "CONFIRMED", "Dermatology session", now.toISOString());
    insertApt.run("apt-ref-11", "8888888888", "Ananya Das", "suman-sarangi", "Dr. Suman Sarangi", "Neuropsychiatry", nextWeek2, "09:30 AM - 10:00 AM", "#11", "BBHC-SER-111", "₹500", "Pay at Clinic Counter", "", "CANCELLED", "Patient travel rescheduled", now.toISOString());

    // Invoices for billing overview
    insertInvoice.run("inv-101", "9876543210", "Consultation - Dr. Kamal Poddar", todayStr, "₹500", "PAID", "Pay at Clinic Counter", now.toISOString());
    insertInvoice.run("inv-102", "9123456789", "Consultation - Dr. Suman Sarangi", todayStr, "₹500", "REFUNDED", "Online UPI (Razorpay)", now.toISOString());
    insertInvoice.run("inv-103", "9999999999", "Consultation - Dr. Kamal Poddar", todayStr, "₹500", "PAID", "Pay at Clinic Counter", now.toISOString());
    insertInvoice.run("inv-104", "9564033221", "Consultation - Dr. Kamal Poddar", tomorrow, "₹500", "PAID", "Online UPI (Razorpay)", now.toISOString());
    insertInvoice.run("inv-105", "8888888888", "Full Blood Count & Sugar Diagnostic", todayStr, "₹850", "PAID", "Cash at Lab Counter", now.toISOString());
  }
}

seedInitialAdminData();

// 1. GET /admin/stats - Live Dashboard KPI Metrics & Feed
router.get("/admin/stats", (_req, res): void => {
  try {
    const todayStr = new Date().toISOString().split("T")[0];

    // Total Patients
    const patientsTotal = sqlite.prepare("SELECT count(*) as c FROM patients").get() as { c: number };

    // Today's appointments
    const todayApts = sqlite
      .prepare(`
        SELECT * FROM patient_appointments 
        WHERE date = ? OR date LIKE ?
        ORDER BY time_slot ASC
      `)
      .all(todayStr, `${todayStr}%`) as any[];

    // Upcoming appointments (future dates)
    const upcomingApts = sqlite
      .prepare(`
        SELECT * FROM patient_appointments 
        WHERE date > ? AND status != 'CANCELLED'
        ORDER BY date ASC, time_slot ASC
        LIMIT 10
      `)
      .all(todayStr) as any[];

    // Cancellations
    const cancellations = sqlite
      .prepare("SELECT count(*) as c FROM patient_appointments WHERE status = 'CANCELLED'")
      .get() as { c: number };

    // Total appointments count
    const totalAll = sqlite.prepare("SELECT count(*) as c FROM patient_appointments").get() as { c: number };

    // Completed appointments count
    const completedCount = sqlite.prepare("SELECT count(*) as c FROM patient_appointments WHERE status = 'COMPLETED' OR status = 'CONFIRMED'").get() as { c: number };

    // No-show count
    const noShowCount = sqlite.prepare("SELECT count(*) as c FROM patient_appointments WHERE status = 'NO_SHOW'").get() as { c: number };

    const totalValid = Math.max(totalAll.c, 1);
    const completionRate = Math.round((completedCount.c / totalValid) * 100);
    const noShowRate = Math.round((noShowCount.c / totalValid) * 100);

    res.json({
      todayCount: todayApts.length,
      upcomingCount: upcomingApts.length,
      patientsCount: patientsTotal.c,
      cancellationsCount: cancellations.c,
      completionRate: `${completionRate}%`,
      noShowRate: `${noShowRate}%`,
      todaySchedule: todayApts,
      upcomingSchedule: upcomingApts,
    });
  } catch (err: any) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ error: "Failed to load dashboard metrics." });
  }
});

// 2. GET /admin/appointments - Search & Filter Appointments
router.get("/admin/appointments", (req, res): void => {
  const { status, doctorId, search, date } = req.query as Record<string, string>;

  try {
    let query = "SELECT * FROM patient_appointments WHERE 1=1";
    const params: any[] = [];

    if (status && status !== "ALL") {
      query += " AND UPPER(status) = UPPER(?)";
      params.push(status);
    }
    if (doctorId && doctorId !== "ALL") {
      query += " AND doctor_id = ?";
      params.push(doctorId);
    }
    if (date) {
      query += " AND date = ?";
      params.push(date);
    }
    if (search && search.trim()) {
      query += " AND (patient_name LIKE ? OR phone LIKE ? OR token_code LIKE ? OR serial_no LIKE ?)";
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    query += " ORDER BY date DESC, created_at DESC";

    const rows = sqlite.prepare(query).all(...params);
    res.json(rows);
  } catch (err: any) {
    console.error("Error querying admin appointments:", err);
    res.status(500).json({ error: "Failed to retrieve appointments." });
  }
});

// 3. POST /admin/appointments - Book/Create Appointment from Reception
router.post("/admin/appointments", (req, res): void => {
  const {
    phone: rawPhone,
    patientName,
    doctorId,
    doctorName,
    specialty = "General Consultation",
    date,
    timeSlot,
    fee = "₹500",
    paymentMethod = "Pay at Clinic Counter",
    status = "CONFIRMED",
    symptoms = "Chamber Appointment",
  } = req.body;

  const phone = normalizePhone(rawPhone || "");
  if (!phone || !patientName || !doctorName || !date) {
    res.status(400).json({ error: "Patient name, phone, doctor and date are required." });
    return;
  }

  try {
    const id = `apt-adm-${Date.now()}`;
    const now = new Date().toISOString();
    const cleanSerial = `#${Math.floor(10 + Math.random() * 20)}`;
    const cleanToken = `BBHC-SER-${cleanSerial.replace(/\D/g, "") || "101"}`;

    sqlite
      .prepare(`
        INSERT INTO patient_appointments (
          id, phone, patient_name, doctor_id, doctor_name, specialty,
          date, time_slot, serial_no, token_code, fee, payment_method,
          payment_id, status, symptoms, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        id,
        phone,
        patientName,
        doctorId || "doc-general",
        doctorName,
        specialty,
        date,
        timeSlot || "10:30 AM",
        cleanSerial,
        cleanToken,
        fee,
        paymentMethod,
        "",
        status.toUpperCase(),
        symptoms,
        now
      );

    // Ensure patient exists in patients directory
    const existingPatient = sqlite.prepare("SELECT id FROM patients WHERE phone = ?").get(phone);
    if (!existingPatient) {
      sqlite
        .prepare(`
          INSERT INTO patients (
            id, phone, full_name, email, date_of_birth, gender,
            blood_group, address, emergency_phone, notification_preference,
            account_id, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .run(
          `pat-${phone}-${Date.now()}`,
          phone,
          patientName,
          "",
          "",
          "Male",
          "",
          "Contai, Purba Medinipur",
          phone,
          "WhatsApp",
          `BBHC-${Math.floor(100000 + Math.random() * 900000)}`,
          now,
          now
        );
    }

    // Record invoice
    const invId = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    sqlite
      .prepare(`
        INSERT INTO patient_invoices (
          id, phone, description, date, amount, status, mode, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        invId,
        phone,
        `Doctor Consultation - ${doctorName}`,
        date,
        fee,
        status.toUpperCase() === "CONFIRMED" || status.toUpperCase() === "COMPLETED" ? "PAID" : "PENDING",
        paymentMethod,
        now
      );

    res.status(201).json({
      success: true,
      message: "Appointment scheduled successfully.",
      appointment: {
        id,
        phone,
        patientName,
        doctorName,
        date,
        timeSlot,
        serialNo: cleanSerial,
        tokenCode: cleanToken,
        status,
      },
    });
  } catch (err: any) {
    console.error("Error creating admin appointment:", err);
    res.status(500).json({ error: "Failed to schedule appointment." });
  }
});

// 4. PATCH /admin/appointments/:id/status - Update Status (CONFIRMED, COMPLETED, NO_SHOW, CANCELLED)
router.patch("/admin/appointments/:id/status", (req, res): void => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    res.status(400).json({ error: "Status is required." });
    return;
  }

  try {
    const updated = sqlite
      .prepare("UPDATE patient_appointments SET status = ? WHERE id = ?")
      .run(status.toUpperCase(), id);

    if (updated.changes === 0) {
      res.status(404).json({ error: "Appointment not found." });
      return;
    }

    res.json({ success: true, message: `Status updated to ${status}.` });
  } catch (err: any) {
    console.error("Error updating appointment status:", err);
    res.status(500).json({ error: "Failed to update appointment status." });
  }
});

// 5. GET /admin/patients - Patients Directory
router.get("/admin/patients", (req, res): void => {
  const { search } = req.query as { search?: string };

  try {
    let query = "SELECT * FROM patients WHERE 1=1";
    const params: any[] = [];

    if (search && search.trim()) {
      query += " AND (full_name LIKE ? OR phone LIKE ? OR account_id LIKE ? OR email LIKE ?)";
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    query += " ORDER BY created_at DESC";

    const patients = sqlite.prepare(query).all(...params) as any[];

    // Augment with appointment counts
    const patientsWithStats = patients.map((p) => {
      const aptCount = sqlite
        .prepare("SELECT count(*) as c FROM patient_appointments WHERE phone = ?")
        .get(p.phone) as { c: number };
      const lastApt = sqlite
        .prepare("SELECT date, doctor_name FROM patient_appointments WHERE phone = ? ORDER BY date DESC LIMIT 1")
        .get(p.phone) as any;

      return {
        ...p,
        totalAppointments: aptCount.c,
        lastVisitDate: lastApt?.date || p.created_at.split("T")[0],
        lastDoctor: lastApt?.doctor_name || "N/A",
      };
    });

    res.json(patientsWithStats);
  } catch (err: any) {
    console.error("Error fetching admin patients:", err);
    res.status(500).json({ error: "Failed to retrieve patients." });
  }
});

// 6. POST /admin/patients - Create/Register new patient
router.post("/admin/patients", (req, res): void => {
  const {
    phone: rawPhone,
    fullName,
    email = "",
    dateOfBirth = "",
    gender = "Male",
    bloodGroup = "O+",
    address = "Contai, WB",
    emergencyPhone = "",
    notificationPreference = "WhatsApp",
  } = req.body;

  const phone = normalizePhone(rawPhone || "");
  if (!phone || !fullName?.trim()) {
    res.status(400).json({ error: "Phone number and full name are required." });
    return;
  }

  try {
    const existing = sqlite.prepare("SELECT id FROM patients WHERE phone = ?").get(phone);
    if (existing) {
      res.status(409).json({ error: "A patient with this mobile number already exists." });
      return;
    }

    const now = new Date().toISOString();
    const accountId = `BBHC-${Math.floor(100000 + Math.random() * 900000)}`;
    const id = `pat-${phone}-${Date.now()}`;

    sqlite
      .prepare(`
        INSERT INTO patients (
          id, phone, full_name, email, date_of_birth, gender,
          blood_group, address, emergency_phone, notification_preference,
          account_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        id,
        phone,
        fullName.trim(),
        email,
        dateOfBirth,
        gender,
        bloodGroup,
        address,
        emergencyPhone || phone,
        notificationPreference,
        accountId,
        now,
        now
      );

    res.status(201).json({
      success: true,
      message: "Patient registered successfully.",
      patient: {
        id,
        phone,
        fullName,
        accountId,
      },
    });
  } catch (err: any) {
    console.error("Error creating patient:", err);
    res.status(500).json({ error: "Failed to save patient." });
  }
});

// 7. GET /admin/billing - Invoices & Revenue Summary
router.get("/admin/billing", (_req, res): void => {
  try {
    const invoices = sqlite
      .prepare("SELECT * FROM patient_invoices ORDER BY created_at DESC")
      .all() as any[];

    let totalRevenue = 0;
    let cashTotal = 0;
    let onlineTotal = 0;

    for (const inv of invoices) {
      const num = parseInt(inv.amount.replace(/\D/g, "")) || 0;
      if (inv.status === "PAID") {
        totalRevenue += num;
        if (inv.mode.toLowerCase().includes("online") || inv.mode.toLowerCase().includes("razorpay")) {
          onlineTotal += num;
        } else {
          cashTotal += num;
        }
      }
    }

    res.json({
      invoices,
      totalRevenue: `₹${totalRevenue.toLocaleString("en-IN")}`,
      cashTotal: `₹${cashTotal.toLocaleString("en-IN")}`,
      onlineTotal: `₹${onlineTotal.toLocaleString("en-IN")}`,
      count: invoices.length,
    });
  } catch (err: any) {
    console.error("Error fetching billing stats:", err);
    res.status(500).json({ error: "Failed to fetch billing data." });
  }
});

// 8. GET /admin/settings & POST /admin/settings
router.get("/admin/settings", (_req, res): void => {
  try {
    const rows = sqlite.prepare("SELECT key, value FROM admin_settings").all() as { key: string; value: string }[];
    const settings: Record<string, string> = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }
    res.json(settings);
  } catch (err: any) {
    console.error("Error reading admin settings:", err);
    res.status(500).json({ error: "Failed to fetch settings." });
  }
});

router.post("/admin/settings", (req, res): void => {
  try {
    const now = new Date().toISOString();
    const insertOrReplace = sqlite.prepare(`
      INSERT OR REPLACE INTO admin_settings (key, value, updated_at) VALUES (?, ?, ?)
    `);

    for (const [k, v] of Object.entries(req.body)) {
      if (typeof v === "string" || typeof v === "boolean" || typeof v === "number") {
        insertOrReplace.run(k, String(v), now);
      }
    }

    res.json({ success: true, message: "Settings saved successfully." });
  } catch (err: any) {
    console.error("Error saving admin settings:", err);
    res.status(500).json({ error: "Failed to update settings." });
  }
});

// 9. POST /admin/ai/assistant - Interactive Clinic AI Assistant
router.post("/admin/ai/assistant", (req, res): void => {
  const { query = "" } = req.body;
  const q = query.toLowerCase().trim();

  try {
    const todayStr = new Date().toISOString().split("T")[0];
    const todayCount = (sqlite.prepare("SELECT count(*) as c FROM patient_appointments WHERE date = ?").get(todayStr) as any)?.c || 0;
    const totalPatients = (sqlite.prepare("SELECT count(*) as c FROM patients").get() as any)?.c || 0;
    const doctors = sqlite.prepare("SELECT name, specialty, schedule FROM doctors").all() as any[];

    let reply = "";

    if (q.includes("today") || q.includes("schedule") || q.includes("how many")) {
      reply = `Today there are ${todayCount} scheduled consultations at Contai B.B. Health Clinic. Dr. Kamal Poddar and Dr. Suman Sarangi have active chamber serial bookings.`;
    } else if (q.includes("patient") || q.includes("total")) {
      reply = `There are currently ${totalPatients} registered patients in the clinic database, with active WhatsApp appointment sync enabled.`;
    } else if (q.includes("doctor") || q.includes("timing") || q.includes("available")) {
      const docList = doctors.map(d => `• ${d.name} (${d.specialty}) — ${d.schedule}`).join("\n");
      reply = `Current doctor visiting roster:\n${docList}\nChamber serial tokens can be issued via the Appointments tab.`;
    } else if (q.includes("billing") || q.includes("revenue") || q.includes("cash")) {
      reply = `All counter receipts and online Razorpay transactions are automatically logged in SQLite. You can view the full ledger in the Billing tab.`;
    } else {
      reply = `Hello! I am your MedBook AI Clinic Assistant. I can help you review today's ${todayCount} appointments, look up patient histories, check doctor chamber slots, or manage counter billing. How can I assist you right now?`;
    }

    res.json({ reply });
  } catch (err: any) {
    console.error("Error running AI assistant:", err);
    res.json({ reply: "I am ready to assist with clinic schedule, appointments, and patient queries." });
  }
});

export default router;
