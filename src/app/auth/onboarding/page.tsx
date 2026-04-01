
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { User, Briefcase, Sparkles, Music, Camera, Utensils, PartyPopper, Flower2, Castle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateProfile } from "firebase/auth";

const SPECIALTIES = [
  { id: "artificier", label: "Artificier", icon: Sparkles },
  { id: "dj", label: "DJ", icon: Music },
  { id: "photographe", label: "Photographe", icon: Camera },
  { id: "wedding_planner", label: "Wedding Planner", icon: PartyPopper },
  { id: "traiteur", label: "Traiteur", icon: Utensils },
  { id: "musicien", label: "Musicien", icon: Music },
  { id: "fleuriste", label: "Fleuriste", icon: Flower2 },
  { id: "lieu", label: "Lieu de réception", icon: Castle },
];

const EVENT_TYPES = [
  "Mariage", "Anniversaire", "Baptême", "Départ à la retraite", 
  "EVJF / EVJG", "Soirée privée", "Soirée d'entreprise", "Association"
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"client" | "pro" | null>(null);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleComplete = async () => {
    if (!user || !db) return;

    const userData = {
      id: user.uid,
      email: user.email,
      role,
      firstName,
      lastName,
      serviceCategoryIds: role === "pro" ? selectedSpecialties : [],
      location: "À définir", // Valeur par défaut
      onboardingComplete: true,
      createdAt: new Date().toISOString()
    };

    try {
      // Update Auth Profile for displayName in Shell
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });

      // Save to correct collection based on backend.json
      const collectionName = role === "pro" ? "professionals" : "clients";
      await setDoc(doc(db, collectionName, user.uid), userData, { merge: true });
      
      toast({ title: "Profil complété !", description: "Bienvenue sur Planning Event." });
      router.push(role === "pro" ? "/pro/dashboard" : "/client/dashboard");
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'enregistrer votre profil." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-2xl border-none">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-2 w-12 rounded-full ${step >= s ? 'bg-primary' : 'bg-slate-200'}`} />
              ))}
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold">
            {step === 1 && "Qui êtes-vous ?"}
            {step === 2 && (role === "pro" ? "Votre expertise" : "Vos informations")}
            {step === 3 && "Vos prestations"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Choisissez votre profil pour continuer."}
            {step === 2 && role === "pro" && "Sélectionnez votre spécialité métier."}
            {step === 3 && "Quels types d'événements couvrez-vous ?"}
          </CardDescription>
        </CardHeader>

        <CardContent className="min-h-[300px]">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button 
                variant={role === "client" ? "default" : "outline"}
                className="h-40 flex flex-col gap-4 text-lg rounded-2xl border-2"
                onClick={() => setRole("client")}
              >
                <User className="h-12 w-12" />
                Je suis un Particulier
              </Button>
              <Button 
                variant={role === "pro" ? "default" : "outline"}
                className="h-40 flex flex-col gap-4 text-lg rounded-2xl border-2"
                onClick={() => setRole("pro")}
              >
                <Briefcase className="h-12 w-12" />
                Je suis un Prestataire
              </Button>
            </div>
          )}

          {step === 2 && role === "pro" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {SPECIALTIES.map((spec) => (
                <div 
                  key={spec.id}
                  onClick={() => {
                    setSelectedSpecialties(prev => 
                      prev.includes(spec.id) ? prev.filter(i => i !== spec.id) : [...prev, spec.id]
                    );
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${
                    selectedSpecialties.includes(spec.id) ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-primary/50'
                  }`}
                >
                  <spec.icon className={`h-8 w-8 ${selectedSpecialties.includes(spec.id) ? 'text-primary' : 'text-slate-400'}`} />
                  <span className="text-sm font-bold">{spec.label}</span>
                </div>
              ))}
            </div>
          )}

          {step === 2 && role === "client" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jean" />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Dupont" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && role === "pro" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EVENT_TYPES.map((event) => (
                  <div key={event} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                    <Checkbox 
                      id={event} 
                      checked={selectedEvents.includes(event)}
                      onCheckedChange={(checked) => {
                        setSelectedEvents(prev => 
                          checked ? [...prev, event] : prev.filter(i => i !== event)
                        );
                      }}
                    />
                    <Label htmlFor={event} className="flex-1 cursor-pointer font-medium">{event}</Label>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Prénom contact</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Marc" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom contact</Label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="DJ" />
                  </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-6 bg-slate-50/50">
          <Button 
            variant="ghost" 
            onClick={() => setStep(prev => prev - 1)}
            disabled={step === 1}
          >
            Précédent
          </Button>
          
          {step < 3 && !(step === 2 && role === "client") ? (
            <Button 
              onClick={() => setStep(prev => prev + 1)}
              disabled={!role || (step === 2 && role === "pro" && selectedSpecialties.length === 0)}
              className="px-8"
            >
              Suivant
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={!firstName || !lastName}
              className="px-8 bg-primary shadow-xl"
            >
              Terminer <Check className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
