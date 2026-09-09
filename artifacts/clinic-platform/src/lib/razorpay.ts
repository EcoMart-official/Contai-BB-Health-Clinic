// Razorpay Integration Utility for Contai B.B. Health Clinic

export const RAZORPAY_KEY_ID = "rzp_test_TZeKcbMS2hECaW";

export interface RazorpayPaymentSuccessResult {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface InitiatePaymentOptions {
  amountInRupees: number;
  doctorName?: string;
  serviceTitle: string;
  patientName?: string;
  patientPhone?: string;
  notes?: Record<string, string>;
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK script.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function processRazorpayPayment(
  options: InitiatePaymentOptions
): Promise<RazorpayPaymentSuccessResult> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !(window as any).Razorpay) {
    throw new Error("Razorpay payment gateway could not be loaded. Please check your internet connection.");
  }

  // Create server order if possible
  let orderId = "";
  try {
    const res = await fetch("/api/payment/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: options.amountInRupees,
        notes: {
          doctorName: options.doctorName || "",
          serviceTitle: options.serviceTitle,
          patientName: options.patientName || "",
          ...options.notes,
        },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.orderId) {
        orderId = data.orderId;
      }
    }
  } catch (e) {
    console.warn("Could not create server-side order, continuing with direct client checkout:", e);
  }

  return new Promise((resolve, reject) => {
    const rzpOptions = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(options.amountInRupees * 100), // in paise
      currency: "INR",
      name: "Contai B.B. Health Clinic",
      description: options.serviceTitle,
      image: "/favicon.svg",
      order_id: orderId || undefined,
      prefill: {
        name: options.patientName || "",
        contact: options.patientPhone || "",
        email: "contaibbhealthclinic@gmail.com",
      },
      theme: {
        color: "#0369a1", // Primary clinical sky/blue
      },
      modal: {
        ondismiss: () => {
          reject(new Error("Payment cancelled by user."));
        },
        confirm_close: true,
      },
      handler: (response: RazorpayPaymentSuccessResult) => {
        resolve(response);
      },
    };

    try {
      const razorpayInstance = new (window as any).Razorpay(rzpOptions);
      razorpayInstance.on("payment.failed", (errResponse: any) => {
        const errorDesc = errResponse?.error?.description || "Payment failed. Please try again.";
        reject(new Error(errorDesc));
      });
      razorpayInstance.open();
    } catch (err: any) {
      reject(err);
    }
  });
}
