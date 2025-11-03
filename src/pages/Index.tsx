import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Activity, Calendar, MapPin, Shield, Clock, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Activity className="h-4 w-4" />
                Quality Healthcare, Anytime, Anywhere
              </div>
              <h1 className="text-5xl font-bold leading-tight lg:text-6xl">
                Your Health,{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with qualified doctors, schedule appointments, and manage your healthcare
                journey—all from the comfort of your home.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth">
                  <Button variant="hero" size="lg" className="text-base">
                    Get Started
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button variant="outline" size="lg" className="text-base">
                    Browse Doctors
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative lg:block">
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-4">
                  <div className="bg-card p-6 rounded-2xl shadow-lg border">
                    <Calendar className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">Easy Scheduling</h3>
                    <p className="text-sm text-muted-foreground">Book appointments in seconds</p>
                  </div>
                  <div className="bg-card p-6 rounded-2xl shadow-lg border">
                    <Shield className="h-8 w-8 text-accent mb-3" />
                    <h3 className="font-semibold mb-2">Secure & Private</h3>
                    <p className="text-sm text-muted-foreground">Your data is protected</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-card p-6 rounded-2xl shadow-lg border">
                    <Users className="h-8 w-8 text-secondary mb-3" />
                    <h3 className="font-semibold mb-2">Expert Doctors</h3>
                    <p className="text-sm text-muted-foreground">Qualified professionals</p>
                  </div>
                  <div className="bg-card p-6 rounded-2xl shadow-lg border">
                    <Clock className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">24/7 Access</h3>
                    <p className="text-sm text-muted-foreground">Healthcare on your schedule</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get the care you need in three simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-card p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Create Account</h3>
              <p className="text-muted-foreground">
                Sign up in minutes and create your secure patient profile with your health
                information.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-secondary">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Find a Doctor</h3>
              <p className="text-muted-foreground">
                Browse our network of qualified doctors by specialization and location to find the
                right match.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Book Appointment</h3>
              <p className="text-muted-foreground">
                Schedule your consultation at a time that works for you and receive quality care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of patients who trust TeleHealth Connect for their healthcare needs.
          </p>
          <Link to="/auth">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 text-base"
            >
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
