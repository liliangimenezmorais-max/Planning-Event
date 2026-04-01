"use client";

import { Shell } from "@/components/layout/Shell";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin, Send, Users, Music, Info } from "lucide-react";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function NewRequestPage() {
  const [date, setDate] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Demande publiée !",
        description: "Les professionnels concernés vont bientôt vous répondre.",
      });
      router.push('/client/dashboard');
    }, 1500);
  };

  return (
    <Shell role="client">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-headline font-bold text-primary">Créez votre annonce</h1>
          <p className="text-muted-foreground text-lg">Dites-nous ce dont vous avez besoin pour votre événement.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-2xl border-none overflow-hidden bg-white">
            <CardHeader className="bg-primary text-white rounded-t-xl p-8">
              <CardTitle className="font-headline text-2xl">Détails de l'événement</CardTitle>
              <CardDescription className="text-white/80 italic">Les prestataires recevront ces informations pour vous répondre.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="pro-type" className="font-bold flex items-center gap-2">
                    <Music className="h-4 w-4 text-primary" /> Prestataire recherché
                  </Label>
                  <Select required>
                    <SelectTrigger className="h-12 border-slate-200 focus:ring-primary bg-slate-50 rounded-xl">
                      <SelectValue placeholder="Quel pro cherchez-vous ?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="artificier">Artificier</SelectItem>
                      <SelectItem value="dj">DJ</SelectItem>
                      <SelectItem value="photographe">Photographe</SelectItem>
                      <SelectItem value="wedding_planner">Wedding Planner</SelectItem>
                      <SelectItem value="traiteur">Traiteur</SelectItem>
                      <SelectItem value="musicien">Musicien</SelectItem>
                      <SelectItem value="fleuriste">Fleuriste</SelectItem>
                      <SelectItem value="lieu">Lieu de réception</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="font-bold flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" /> Type d'événement
                  </Label>
                  <Select required>
                    <SelectTrigger className="h-12 border-slate-200 focus:ring-primary bg-slate-50 rounded-xl">
                      <SelectValue placeholder="Choisir un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mariage">Mariage</SelectItem>
                      <SelectItem value="anniversaire">Anniversaire</SelectItem>
                      <SelectItem value="bapteme">Baptême</SelectItem>
                      <SelectItem value="retraite">Départ à la retraite</SelectItem>
                      <SelectItem value="evjf">EVJF / EVJG</SelectItem>
                      <SelectItem value="privee">Soirée privée</SelectItem>
                      <SelectItem value="entreprise">Soirée d'entreprise</SelectItem>
                      <SelectItem value="association">Association</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="font-bold flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" /> Date prévue
                  </Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      id="date"
                      type="date" 
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-12 pl-11 bg-slate-50 border-slate-200 rounded-xl focus:ring-primary" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="font-bold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> Ville / Lieu
                  </Label>
                  <Input id="location" placeholder="Ex: Bordeaux, 33000" required className="h-12 border-slate-200 focus:ring-primary bg-slate-50 rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests" className="font-bold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> Nombre de personnes
                  </Label>
                  <Input id="guests" type="number" placeholder="Ex: 80" required className="h-12 border-slate-200 focus:ring-primary bg-slate-50 rounded-xl" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="font-bold">Description détaillée</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Dites-nous en plus sur l'ambiance, vos attentes particulières, etc." 
                    className="min-h-[120px] border-slate-200 focus:ring-primary bg-slate-50 rounded-xl resize-none"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 p-8 flex justify-between items-center border-t">
              <Button variant="ghost" type="button" onClick={() => router.back()} className="font-bold text-slate-500">Annuler</Button>
              <Button 
                type="submit" 
                size="lg" 
                className="bg-primary text-white hover:bg-primary/90 px-8 h-12 shadow-xl shadow-primary/20 rounded-xl font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Publication..." : "Publier ma demande"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Shell>
  );
}
