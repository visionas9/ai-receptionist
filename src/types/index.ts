export interface Clinic {
  id: string;
  user_id: string;
  name: string;
  owner_name: string | null;
  language: string | null;
  industry: string | null;
  tone: string | null;
  busiest_time: string | null;
  main_goal: string | null;
  onboarded: boolean;
  vapi_assistant_id: string | null;
  free_minutes_remaining: number;
  plan: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
}

export interface Appointment {
  id: string;
  clinic_id: string;
  patient_name: string;
  patient_phone: string | null;
  appointment_date: string | null;
  appointment_time: string | null;
  reason: string | null;
  call_id: string | null;
  recording_url: string | null;
  transcript: string | null;
  status: string;
  created_at: string;
}
