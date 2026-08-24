export type Mode = "landing" | "auth" | "onboarding" | "dashboard" | "demo" | "clinics";
export type AuthView = "signin" | "signup";
export type Profile = {
  id?: number;
  clinic_name: string;
  location: string;
  practitioners: string[];
  services: string[];
  onboarding_complete: boolean;
};
export type Booking = {
  id: number;
  slot: {
    clinician: { name: string };
    starts_at: string;
    location?: { name: string; city?: string };
  };
};
