import { Router, type IRouter } from "express";
import { sqlite } from "@workspace/db";

const router: IRouter = Router();

function normalizePhone(rawPhone: string): string {
  if (!rawPhone) return "";
  const digits = rawPhone.replace(/\D/g, "");
  // Return last 10 digits for Indian mobile numbers
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

// 1. GET /patient/account - Fetch patient profile & synced records by phone
router.get("/patient/account", (req, res): void => {
  const rawPhone = (req.query.phone as string) || "";
  const phone = normalizePhone(rawPhone);

  if (!phone) {
    res.status(400).json({ error: "Valid phone number is required." });
    return;
  }

  try {
    const patient = sqlite
      .prepare("SELECT * FROM patients WHERE phone = ? OR phone = ? LIMIT 1")
      .get(phone, rawPhone) as any;

    if (!patient) {
      res.json({ found: false, patient: null, appointments: [], vitals: [], invoices: [] });
      return;
    }

    const appointments = sqlite
      .prepare("SELECT * FROM patient_appointments WHERE phone = ? OR phone = ? OR phone LIKE ? ORDER BY created_at DESC")
      .all(phone, rawPhone, `%${phone}%`) as any[];

    // Also pull standard appointments if booked via main booking system
    try {
      const generalApts = sqlite
        .prepare("SELECT * FROM appointments WHERE phone = ? OR phone = ? OR phone LIKE ? ORDER BY date DESC")
        .all(phone, rawPhone, `%${phone}%`) as any[];
      if (generalApts && generalApts.length > 0) {
        for (const ga of generalApts) {
          if (!appointments.some((a: any) => a.id === ga.id || (a.date === ga.date && a.doctor_name === ga.doctorName))) {
            appointments.push({
              id: ga.id,
              phone: ga.phone,
              patient_name: ga.patientName,
              doctor_id: ga.doctorId || 'doc-consultation',
              doctor_name: ga.doctorName,
              specialty: ga.department || 'Consultation',
              date: ga.date,
              time_slot: ga.time || '10:30 AM',
              serial_no: `#${Math.floor(10 + Math.random() * 20)}`,
              token_code: `BBHC-SER-${ga.id.slice(-4)}`,
              fee: '₹500',
              payment_method: 'Pay at Clinic Counter',
              payment_id: '',
              status: ga.status || 'CONFIRMED',
              symptoms: ga.reason || '',
              created_at: ga.date,
            });
          }
        }
      }
    } catch (err) {
      console.warn("Could not query general appointments table:", err);
    }

    const vitals = sqlite
      .prepare("SELECT * FROM patient_vitals WHERE phone = ? OR phone = ? ORDER BY created_at DESC")
      .all(phone, rawPhone);

    const invoices = sqlite
      .prepare("SELECT * FROM patient_invoices WHERE phone = ? OR phone = ? ORDER BY created_at DESC")
      .all(phone, rawPhone);

    res.json({
      found: true,
      patient: {
        id: patient.id,
        phone: patient.phone,
        fullName: patient.full_name,
        email: patient.email || "",
        dateOfBirth: patient.date_of_birth || "",
        gender: patient.gender || "Male",
        bloodGroup: patient.blood_group || "",
        address: patient.address || "",
        emergencyPhone: patient.emergency_phone || "",
        notificationPreference: patient.notification_preference || "WhatsApp",
        accountId: patient.account_id,
        createdAt: patient.created_at,
        updatedAt: patient.updated_at,
      },
      appointments,
      vitals,
      invoices,
    });
  } catch (err: any) {
    console.error("Error retrieving patient account:", err);
    res.status(500).json({ error: "Database error retrieving patient account." });
  }
});

// 2. POST /patient/account - Upsert patient profile in SQLite
router.post("/patient/account", (req, res): void => {
  const {
    phone: rawPhone,
    fullName,
    email = "",
    dateOfBirth = "",
    gender = "Male",
    bloodGroup = "",
    address = "",
    emergencyPhone = "",
    notificationPreference = "WhatsApp",
    accountId: clientAccountId,
  } = req.body;

  const phone = normalizePhone(rawPhone || "");
  if (!phone || !fullName?.trim()) {
    res.status(400).json({ error: "Phone number and Full Name are required." });
    return;
  }

  try {
    const existing = sqlite
      .prepare("SELECT * FROM patients WHERE phone = ? OR phone = ? LIMIT 1")
      .get(phone, rawPhone) as any;

    const now = new Date().toISOString();
    const accountId = clientAccountId || existing?.account_id || `BBHC-${Math.floor(100000 + Math.random() * 900000)}`;

    if (existing) {
      sqlite
        .prepare(`
          UPDATE patients
          SET full_name = ?, email = ?, date_of_birth = ?, gender = ?,
              blood_group = ?, address = ?, emergency_phone = ?,
              notification_preference = ?, updated_at = ?
          WHERE id = ?
        `)
        .run(
          fullName.trim(),
          email || "",
          dateOfBirth || "",
          gender || "Male",
          bloodGroup || "",
          address || "",
          emergencyPhone || "",
          notificationPreference || "WhatsApp",
          now,
          existing.id
        );
    } else {
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
          email || "",
          dateOfBirth || "",
          gender || "Male",
          bloodGroup || "",
          address || "",
          emergencyPhone || "",
          notificationPreference || "WhatsApp",
          accountId,
          now,
          now
        );
    }

    const savedPatient = sqlite
      .prepare("SELECT * FROM patients WHERE phone = ? LIMIT 1")
      .get(phone) as any;

    res.json({
      success: true,
      message: "Patient account synchronized with SQLite database.",
      patient: {
        id: savedPatient.id,
        phone: savedPatient.phone,
        fullName: savedPatient.full_name,
        email: savedPatient.email || "",
        dateOfBirth: savedPatient.date_of_birth || "",
        gender: savedPatient.gender || "Male",
        bloodGroup: savedPatient.blood_group || "",
        address: savedPatient.address || "",
        emergencyPhone: savedPatient.emergency_phone || "",
        notificationPreference: savedPatient.notification_preference || "WhatsApp",
        accountId: savedPatient.account_id,
        createdAt: savedPatient.created_at,
        updatedAt: savedPatient.updated_at,
      },
    });
  } catch (err: any) {
    console.error("Error updating patient account:", err);
    res.status(500).json({ error: "Failed to persist patient account." });
  }
});

// 3. POST /patient/appointments - Create and record appointment in SQLite
router.post("/patient/appointments", (req, res): void => {
  const {
    phone: rawPhone,
    patientName,
    doctorId,
    doctorName,
    specialty = "",
    date,
    timeSlot,
    serialNo,
    tokenCode,
    fee,
    paymentMethod,
    paymentId = "",
    status = "CONFIRMED",
    symptoms = "",
  } = req.body;

  const phone = normalizePhone(rawPhone || "");
  if (!phone || !doctorName || !date) {
    res.status(400).json({ error: "Missing required appointment fields." });
    return;
  }

  try {
    const id = `apt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    const cleanSerial = serialNo || `#${Math.floor(10 + Math.random() * 20)}`;
    const cleanToken = tokenCode || `BBHC-SER-${cleanSerial.replace(/\D/g, "") || "101"}`;

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
        patientName || "Valued Patient",
        doctorId || "doc-general",
        doctorName,
        specialty,
        date,
        timeSlot || "10:30 AM",
        cleanSerial,
        cleanToken,
        fee || "₹500",
        paymentMethod || "Pay at Clinic Counter",
        paymentId || "",
        status,
        symptoms || "",
        now
      );

    // Also auto-record invoice in SQLite
    const invId = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const isOnline = (paymentMethod || "").includes("Razorpay") || !!paymentId;
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
        fee || "₹500",
        "PAID",
        isOnline ? "Online UPI/Card (Razorpay)" : "Pay at Clinic Counter",
        now
      );

    res.status(201).json({
      success: true,
      appointment: {
        id,
        phone,
        patientName,
        doctorId,
        doctorName,
        specialty,
        date,
        timeSlot,
        serialNo: cleanSerial,
        tokenCode: cleanToken,
        fee,
        paymentMethod,
        paymentId,
        status,
        createdAt: now,
      },
    });
  } catch (err: any) {
    console.error("Error creating patient appointment:", err);
    res.status(500).json({ error: "Failed to store appointment in database." });
  }
});

// 4. GET /patient/appointments - Fetch all appointments for a phone
router.get("/patient/appointments", (req, res): void => {
  const rawPhone = (req.query.phone as string) || "";
  const phone = normalizePhone(rawPhone);

  if (!phone) {
    res.status(400).json({ error: "Phone number required." });
    return;
  }

  try {
    const rows = sqlite
      .prepare("SELECT * FROM patient_appointments WHERE phone = ? OR phone = ? OR phone LIKE ? ORDER BY created_at DESC")
      .all(phone, rawPhone, `%${phone}%`);
    res.json(rows);
  } catch (err: any) {
    console.error("Error fetching patient appointments:", err);
    res.status(500).json({ error: "Failed to fetch appointments." });
  }
});

// 5. POST /patient/vitals - Save health vitals to SQLite
router.post("/patient/vitals", (req, res): void => {
  const { phone: rawPhone, date, sys, dia, fastingSugar, pulse, weight, status } = req.body;
  const phone = normalizePhone(rawPhone || "");

  if (!phone) {
    res.status(400).json({ error: "Phone number required." });
    return;
  }

  try {
    const id = `vit-${Date.now()}`;
    const now = new Date().toISOString();

    sqlite
      .prepare(`
        INSERT INTO patient_vitals (
          id, phone, date, sys, dia, fasting_sugar, pulse, weight, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        id,
        phone,
        date || "Today",
        sys ? parseInt(sys) : null,
        dia ? parseInt(dia) : null,
        fastingSugar ? parseInt(fastingSugar) : null,
        pulse ? parseInt(pulse) : null,
        weight ? parseFloat(weight) : null,
        status || "NORMAL",
        now
      );

    res.status(201).json({ success: true, id, message: "Vital recorded in SQLite." });
  } catch (err: any) {
    console.error("Error saving vital in SQLite:", err);
    res.status(500).json({ error: "Failed to record vitals." });
  }
});

// 6. Generic POST /appointments compatibility alias
router.post("/appointments", (req, res): void => {
  const { patientName, phone: rawPhone, doctorName, date, paymentMethod, paymentId } = req.body;
  const phone = normalizePhone(rawPhone || "");
  const now = new Date().toISOString();
  const id = `apt-${Date.now()}`;
  const cleanSerial = `#${Math.floor(10 + Math.random() * 20)}`;
  const cleanToken = `BBHC-SER-${cleanSerial.replace(/\D/g, "") || "101"}`;

  try {
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
        phone || rawPhone,
        patientName || "Valued Patient",
        "doc-consultation",
        doctorName || "Doctor",
        "Consultation",
        date || now.split("T")[0],
        "10:30 AM",
        cleanSerial,
        cleanToken,
        "₹500",
        paymentMethod || "Pay at Clinic Counter",
        paymentId || "",
        "CONFIRMED",
        "",
        now
      );

    res.status(201).json({ success: true, id, serialNo: cleanSerial, tokenCode: cleanToken });
  } catch (err: any) {
    console.error("Error in /appointments route:", err);
    res.status(500).json({ error: "Failed to record appointment." });
  }
});

export default router;
