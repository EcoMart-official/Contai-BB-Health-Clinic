import { Router, type IRouter } from "express";
import {
  GetClinicOverviewResponse,
  GetDoctorsResponse,
  GetDepartmentsResponse,
  GetServicesResponse,
  GetFaqsResponse,
  GetGalleryResponse,
} from "@workspace/api-zod";
import { db, doctorsTable, departmentsTable, servicesTable, faqsTable, galleryTable } from "@workspace/db";

const router: IRouter = Router();

const clinicOverview = {
  name: "Contai B.B. Health Clinic",
  tagline: "Modern local healthcare access with faster booking, reports, and specialist support.",
  description:
    "Reliable diagnostics, specialist chambers, and patient-first care for families in Padmapukuria, Contai.",
  address: "Padmapukuria, Contai, West Bengal",
  emergencyPhone: "8978933511",
  email: "contaibbhealthclinic@gmail.com",
  highlights: [
    "West Bengal government-recognized diagnostic centre",
    "Weekly visiting specialist chambers",
    "Digital lab, pathology, X-Ray, ECG, and USG support",
  ],
  image: "/assets/clinic/patient-hall.png",
};

const defaultServices = [
  { id: "pathology", name: "Pathology Testing", description: "Routine blood, stool, urine, and sample-based testing with careful handling.", category: "Diagnostics" },
  { id: "xray", name: "Digital X-Ray", description: "Convenient local imaging support for everyday diagnostic needs.", category: "Diagnostics" },
  { id: "ecg", name: "ECG", description: "Heart tracing support with clear guidance on next steps.", category: "Diagnostics" },
  { id: "usg", name: "USG Support", description: "Ultrasonography support coordinated around patient needs.", category: "Diagnostics" },
  { id: "specialist", name: "Specialist Chambers", description: "Weekly visiting specialists across medicine, neuropsychiatry, dermatology, and gastroenterology.", category: "Consultation" },
];

const defaultFaqs = [
  { id: "booking", question: "How do I book a consultation?", answer: "Select Book a consultation, verify your mobile number, then choose a department, doctor, date, and available time." },
  { id: "reports", question: "Can I request a diagnostic report online?", answer: "Our team can guide you through report follow-up and collection during clinic hours. Call 8978933511 for help." },
  { id: "timings", question: "Do visiting specialists have fixed timings?", answer: "Most chambers run weekly. Timings are shown on each doctor profile and may change, so please confirm when booking." },
  { id: "emergency", question: "What should I do in an emergency?", answer: "Call 8978933511 for immediate clinic guidance and use local emergency services for life-threatening situations." },
];

const defaultGallery = [
  { id: "patient-hall", title: "A welcoming patient hall", caption: "Bright, organized spaces designed to make visits more comfortable.", image: "/assets/clinic/patient-hall.png" },
  { id: "lab-testing", title: "Pathology testing", caption: "Dependable sample handling for everyday diagnostic needs.", image: "/assets/clinic/lab-testing.webp" },
  { id: "team", title: "The clinic team", caption: "A committed local team supports patients from booking to follow-up.", image: "/assets/clinic/clinic-team-staff.png" },
];

router.get("/clinic/overview", (_req, res): void => {
  res.json(GetClinicOverviewResponse.parse(clinicOverview));
});

router.get("/clinic/doctors", (_req, res): void => {
  const doctors = db.select().from(doctorsTable).all();
  res.json(GetDoctorsResponse.parse(doctors));
});

router.get("/clinic/departments", (_req, res): void => {
  const departments = db.select().from(departmentsTable).all();
  res.json(GetDepartmentsResponse.parse(departments));
});

router.get("/clinic/services", (_req, res): void => {
  const services = db.select().from(servicesTable).all();
  res.json(GetServicesResponse.parse(services.length > 0 ? services : defaultServices));
});

router.get("/clinic/faqs", (_req, res): void => {
  const faqs = db.select().from(faqsTable).all();
  res.json(GetFaqsResponse.parse(faqs.length > 0 ? faqs : defaultFaqs));
});

router.get("/clinic/gallery", (_req, res): void => {
  const gallery = db.select().from(galleryTable).all();
  res.json(GetGalleryResponse.parse(gallery.length > 0 ? gallery : defaultGallery));
});

export default router;
