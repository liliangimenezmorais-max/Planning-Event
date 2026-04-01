
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/pro/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <Link href="/" className="flex items-center gap-3 mb-8">
        <Logo className="h-12 w-12" />
        <span className="text-2xl font-headline font-bold text-primary tracking-tight">Planning Event</span>
      </Link>

      <Card className="w-full max-lg border-none shadow-2xl">
        <CardHeader className="space-y-1 pb-8">
          <CardTitle className="text-2xl font-headline font-bold text-center">Créer un compte Professionnel</CardTitle>
          <CardDescription className="text-center">Développez votre activité événementielle avec nous.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" placeholder="Marc" required className="bg-slate-50 border-slate-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" placeholder="DJ" required className="bg-slate-50 border-slate-100" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Nom de l'entreprise</Label>
              <Input id="company" placeholder="Pulse Music" required className="bg-slate-50 border-slate-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siret">Numéro SIRET</Label>
              <Input id="siret" placeholder="123 456 789 00012" required className="bg-slate-50 border-slate-100" />
            </div>
            <div className="space-y-2">
              <Label>Votre métier</Label>
              <Select required>
                <SelectTrigger className="bg-slate-50 border-slate-100">
                  <SelectValue placeholder="Choisir un métier" />
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
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input id="email" type="email" placeholder="contact@pro.com" required className="bg-slate-50 border-slate-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" required className="bg-slate-50 border-slate-100" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button type="submit" className="w-full bg-primary h-12 rounded-xl text-lg font-bold shadow-lg" disabled={loading}>
              {loading ? "Création..." : "S'inscrire"}
            </Button>
            <p className="text-sm text-center text-slate-500">
              Déjà un compte ? <Link href="/auth/login?role=pro" className="text-primary font-bold hover:underline">Se connecter</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
