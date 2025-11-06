import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, FileText, LogOut } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string;
  notes: string | null;
  profiles: {
    full_name: string;
    phone: string;
  } | null;
}

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/doctor/auth");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "doctor")
        .single();

      if (!roles) {
        await supabase.auth.signOut();
        navigate("/doctor/auth");
        return;
      }

      const { data: doctor } = await supabase
        .from("doctors")
        .select("id, name")
        .eq("user_id", session.user.id)
        .single();

      if (doctor) {
        setDoctorName(doctor.name);
        fetchAppointments(doctor.id);
      }
    };

    checkAuthAndFetch();
  }, [navigate]);

  const fetchAppointments = async (doctorId: string) => {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        appointment_date,
        appointment_time,
        status,
        reason,
        notes,
        profiles!appointments_patient_id_fkey (
          full_name,
          phone
        )
      `)
      .eq("doctor_id", doctorId)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } else {
      setAppointments(data || []);
    }
    setLoading(false);
  };

  const updateAppointment = async (
    appointmentId: string,
    updates: { status?: string; notes?: string }
  ) => {
    const { error } = await supabase
      .from("appointments")
      .update(updates)
      .eq("id", appointmentId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Appointment updated",
      });
      setAppointments(
        appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, ...updates } : apt
        )
      );
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/doctor/auth");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Doctor Portal</h1>
            <p className="text-muted-foreground">Welcome, {doctorName}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Your Appointments</h2>
          <p className="text-muted-foreground">
            Manage and update patient appointments
          </p>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No appointments scheduled</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {appointment.profiles?.full_name || "Patient (No Profile)"}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {appointment.profiles?.phone || "No phone number"}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{appointment.appointment_time}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Reason for Visit:</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                      {appointment.reason}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Doctor's Notes:</label>
                    <Textarea
                      placeholder="Add notes about the consultation..."
                      defaultValue={appointment.notes || ""}
                      onBlur={(e) =>
                        updateAppointment(appointment.id, { notes: e.target.value })
                      }
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Select
                      value={appointment.status}
                      onValueChange={(value) =>
                        updateAppointment(appointment.id, { status: value })
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
