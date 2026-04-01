
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  
  const role = searchParams.get("role");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulation d'une redirection basée sur le rôle passé en paramètre
    setTimeout(() => {
      if (role === 'pro') {
        router.push("/pro/dashboard");
      } else {
        router.push("/client/dashboard");
      }
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
          <CardTitle className="text-2xl font-headline font-bold text-center">
            {role === 'pro' ? 'Connexion Pro' : 'Bon retour !'}
          </CardTitle>
          <CardDescription className="text-center">
            Connectez-vous pour gérer vos {role === 'pro' ? 'prestations' : 'événements'}.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="jean.dupont@exemple.com" required className="bg-slate-50 border-slate-100" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link href="#" className="text-xs text-primary font-bold hover:underline">Oublié ?</Link>
              </div>
              <Input id="password" type="password" required className="bg-slate-50 border-slate-100" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button type="submit" className="w-full bg-primary h-12 rounded-xl text-lg font-bold shadow-lg" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
            <div className="space-y-2 text-center">
               <p className="text-sm text-slate-500">
                Pas encore de compte ?
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/auth/signup/client" className="text-xs text-primary font-bold hover:underline">Inscription Particulier</Link>
                <div className="w-px h-4 bg-slate-200" />
                <Link href="/auth/signup/pro" className="text-xs text-primary font-bold hover:underline">Inscription Pro</Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <LoginContent />
    </Suspense>
  );
}
