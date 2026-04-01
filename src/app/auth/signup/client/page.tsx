
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ClientSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/client/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <Link href="/" className="flex items-center gap-3 mb-8">
        <Logo className="h-12 w-12" />
        <span className="text-2xl font-headline font-bold text-primary tracking-tight">Planning Event</span>
      </Link>

      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="space-y-1 pb-8">
          <CardTitle className="text-2xl font-headline font-bold text-center">Créer un compte Particulier</CardTitle>
          <CardDescription className="text-center">Trouvez les meilleurs prestataires pour vos événements.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" placeholder="Jean" required className="bg-slate-50 border-slate-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" placeholder="Dupont" required className="bg-slate-50 border-slate-100" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date de naissance</Label>
              <Input id="dob" type="date" required className="bg-slate-50 border-slate-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="jean.dupont@exemple.com" required className="bg-slate-50 border-slate-100" />
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
              Déjà un compte ? <Link href="/auth/login?role=client" className="text-primary font-bold hover:underline">Se connecter</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
