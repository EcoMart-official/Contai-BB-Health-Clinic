import { Router, type IRouter } from "express";
import {
  GetClinicOverviewResponse,
  GetDoctorsResponse,
  GetDepartmentsResponse,
  GetServicesResponse,
  GetFaqsResponse,
  GetGalleryResponse,
} from "@workspace/api-zod";

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

const doctors = [
  {
    id: "suman-sarangi",
    name: "Dr. Suman Sarangi",
    specialty: "Neuropsychiatry",
    credentials: "MBBS, MD (Neuropsychiatry), MRCPsych Part 1 (UK)",
    schedule: "Every Sunday, 8:30 AM – 10:30 AM",
    bio: "Support for dementia, epilepsy, Parkinson’s, addiction care, anxiety, OCD, migraine, and neuropathic pain.",
    image: "/assets/clinic/patient-hall.png",
  },
  {
    id: "kamal-poddar",
    name: "Dr. Kamal Poddar",
    specialty: "Consultant Physician",
    credentials: "MBBS, MD (Medicine), MRCP (UK)",
    schedule: "Every Saturday, 10:00 AM onward",
    bio: "Thoughtful consultation for sugar, thyroid, pressure, heart, breathing, gas, nerve-related concerns, and follow-up care.",
    image: "/assets/clinic/clinic-team-staff.png",
  },
  {
    id: "saikat-maity",
    name: "Dr. Saikat Maity",
    specialty: "Dermatology, Hair & Sexual Health",
    credentials: "MD (NM), MSc (Cosmetic & Aesthetic), Diploma in Dermatology",
    schedule: "Every Sunday, 2:00 PM onward",
    bio: "Specialist attention for skin, hair, cosmetic, aesthetic, and related sexual health concerns.",
    image: "/assets/clinic/lab-testing.webp",
  },
  {
    id: "rakesh-mohanty",
    name: "Dr. Rakesh Mohanty",
    specialty: "Gastroenterology",
    credentials: "MBBS, MD (Medicine), DM (Gastroenterology)",
    schedule: "Appointment-based consultation",
    bio: "Advice for gastritis, acidity, abdominal pain, bloating, bowel irregularity, and digestive discomfort.",
    image: "/assets/clinic/patient-hall.png",
  },
];

const departments = [
  { id: "general-medicine", name: "General Medicine", summary: "Everyday medical care for sugar, thyroid, pressure, breathing, and follow-up needs.", icon: "stethoscope" },
  { id: "neuropsychiatry", name: "Neuropsychiatry", summary: "Compassionate support for neurological and mental health concerns.", icon: "brain" },
  { id: "dermatology", name: "Dermatology & Hair", summary: "Skin, hair, cosmetic, aesthetic, and sexual health consultation.", icon: "sparkles" },
  { id: "gastroenterology", name: "Gastroenterology", summary: "Digestive health consultation for acidity, pain, bloating, and bowel changes.", icon: "activity" },
  { id: "diagnostics", name: "Pathology & Diagnostics", summary: "Routine blood, stool, urine, X-Ray, ECG, USG, and digital lab support.", icon: "scan-line" },
];

const services = [
  { id: "pathology", name: "Pathology Testing", description: "Routine blood, stool, urine, and sample-based testing with careful handling.", category: "Diagnostics" },
  { id: "xray", name: "Digital X-Ray", description: "Convenient local imaging support for everyday diagnostic needs.", category: "Diagnostics" },
  { id: "ecg", name: "ECG", description: "Heart tracing support with clear guidance on next steps.", category: "Diagnostics" },
  { id: "usg", name: "USG Support", description: "Ultrasonography support coordinated around patient needs.", category: "Diagnostics" },
  { id: "specialist", name: "Specialist Chambers", description: "Weekly visiting specialists across medicine, neuropsychiatry, dermatology, and gastroenterology.", category: "Consultation" },
];

const faqs = [
  { id: "booking", question: "How do I book a consultation?", answer: "Select Book a consultation, verify your mobile number, then choose a department, doctor, date, and available time." },
  { id: "reports", question: "Can I request a diagnostic report online?", answer: "Our team can guide you through report follow-up and collection during clinic hours. Call 8978933511 for help." },
  { id: "timings", question: "Do visiting specialists have fixed timings?", answer: "Most chambers run weekly. Timings are shown on each doctor profile and may change, so please confirm when booking." },
  { id: "emergency", question: "What should I do in an emergency?", answer: "Call 8978933511 for immediate clinic guidance and use local emergency services for life-threatening situations." },
];

const gallery = [
  { id: "patient-hall", title: "A welcoming patient hall", caption: "Bright, organized spaces designed to make visits more comfortable.", image: "/assets/clinic/patient-hall.png" },
  { id: "lab-testing", title: "Pathology testing", caption: "Dependable sample handling for everyday diagnostic needs.", image: "/assets/clinic/lab-testing.webp" },
  { id: "team", title: "The clinic team", caption: "A committed local team supports patients from booking to follow-up.", image: "/assets/clinic/clinic-team-staff.png" },
];

router.get("/clinic/overview", (_req, res): void => {
  res.json(GetClinicOverviewResponse.parse(clinicOverview));
});

router.get("/clinic/doctors", (_req, res): void => {
  res.json(GetDoctorsResponse.parse(doctors));
});

router.get("/clinic/departments", (_req, res): void => {
  res.json(GetDepartmentsResponse.parse(departments));
});

router.get("/clinic/services", (_req, res): void => {
  res.json(GetServicesResponse.parse(services));
});

router.get("/clinic/faqs", (_req, res): void => {
  res.json(GetFaqsResponse.parse(faqs));
});

router.get("/clinic/gallery", (_req, res): void => {
  res.json(GetGalleryResponse.parse(gallery));
});

export { doctors, departments };
export default router;