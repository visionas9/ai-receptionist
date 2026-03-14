export interface Clinic {
  id: string;
  user_id: string;
  name: string;
  owner_name: string | null;
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
