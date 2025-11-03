import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  consultation_fee: number;
  health_centers: {
    name: string;
    city: string;
  };
}

const BookAppointment = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("doctors")
        .select(`
          id,
          name,
          specialization,
          consultation_fee,
          health_centers (
            name,
            city
          )
        `)
        .eq("id", doctorId)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load doctor information",
          variant: "destructive",
        });
        navigate("/doctors");
      } else {
        setDoctor(data);
      }
    };

    checkAuthAndFetch();
  }, [doctorId, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { error } = await supabase.from("appointments").insert({
        patient_id: session.user.id,
        doctor_id: doctorId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        reason: reason,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Appointment booked!",
        description: "Your appointment has been successfully scheduled.",
      });

      navigate("/appointments");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Book Appointment</h1>
            <p className="text-muted-foreground">Schedule your consultation</p>
          </div>

          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{doctor.name}</CardTitle>
                  <CardDescription>{doctor.specialization}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Location:</span>{" "}
                  {doctor.health_centers.name}, {doctor.health_centers.city}
                </p>
                <p>
                  <span className="text-muted-foreground">Consultation Fee:</span> $
                  {doctor.consultation_fee.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>Fill in the information below</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Appointment Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    min={today}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Appointment Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Textarea
                    id="reason"
                    placeholder="Briefly describe your symptoms or reason for consultation..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/doctors")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="hero" className="flex-1" disabled={loading}>
                    {loading ? "Booking..." : "Confirm Appointment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
