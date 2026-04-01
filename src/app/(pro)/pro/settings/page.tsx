
"use client";

import { Shell } from "@/components/layout/Shell";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Save, Loader2, Upload, Trash2, MapPin, Plus } from "lucide-react";
import * as React from "react";
import { useUser, useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const DEFAULT_TERMS = `CONDITIONS GÉNÉRALES

- Les frais de déplacement, sonorisation, animation DJ, éclairage et technicien sont compris dans le tarif.

- Les frais de repas, boissons et frais SACEM sont à la charge de l’Organisateur.

- L’Organisateur est responsable de tout le matériel entreposé sur le lieu de la prestation mis à disposition par le prestataire dès son arrivée et jusqu’à la fin de la prestation. Pour plusieurs jours de prestations dans le même lieu, la sécurité du matériel sera toujours à l’entière responsabilité de l’Organisateur. Pour toute dégradation ou vol du matériel, une responsabilité civile devra être assurée par les soins et à la charge de l’organisateur. Il est exigé à l’organisateur de souscrire une assurance qui couvre au minimum toutes les exigences citées.

- Après la signature du contrat, aucune modification ne pourra être apportée sans l’accord des deux parties.

- L’Organisateur et le prestataire s’interdisent toute action visant à condamner la partie adverse en cas de non-présentation sur le lieu de la prestation pour les raisons suivantes : accident de la route, maladie grave, décès, catastrophe naturelle, tempête, inondation, incendie, neige, ordre ou interdiction ministérielle ou préfectorale, grève, force majeure.

- Sauf cas de force majeure cité ci-dessus, si l’événement ne pouvait pas avoir lieu l’organisateur verserait au prestataire la totalité du cachet convenu.

- Annulation :
En cas d’annulation intervenant plus d’un an avant l’événement, aucune somme ne sera due.
En cas d’annulation intervenant moins de 9 mois avant l’événement, 30 % du cachet seront dus.
En cas d’annulation intervenant moins de 6 mois avant l’événement, 60 % du cachet seront dus.
En cas d’annulation intervenant moins de 3 mois avant l’événement, la totalité du cachet sera due.

- Sauf avenant au contrat, le DJ est libre des morceaux passés durant l'évènement.

- Dans le cadre des évènement faisant l’objet de supports de communication (notamment affiches publicitaires, flyers, publications numériques ou tout autre média), l’Organisateur s’engage à faire figurer de manière lisible et explicite le nom du prestataire. Le défaut de respect de cette obligation constituera un manquement contractuel. Dans ce cas, le Prestataire se réserve le droit d'appliquer une pénalité forfaitaire équivalente à 20 % du montant total de la prestation, exigible immédiatement.


CONDITIONS TECHNIQUES

ACCÈS / VÉHICULE : Dès l’arrivée du véhicule, un membre de l’organisation doit être présent pour l’accueil des techniciens sur le lieu de la prestation. L’organisateur devra libérer l’accès à la scène afin de faciliter le déplacement du véhicule et du matériel. Le parking pour le véhicule devra être situé à proximité de la scène.

REPAS / BOISSONS : Dès l’arrivée des techniciens, l’organisateur devra fournir de l’eau et des sodas jusqu’à la fin de la prestation. Plus compter 3 repas complets.

SCÈNE / ARRIVÉE ÉLECTRIQUE : Aucune dimension particulière de scène n’est exigée. Pour les prestations en intérieur, la mise en place d’une scène n’est pas obligatoire. En revanche, pour les prestations en extérieur, une scène est requise. Celle-ci doit être stable, couverte, étanche et capable de supporter le poids du matériel. Si les conditions météorologiques le permettent et après accord entre les deux parties, la discothèque mobile peut également être installée en plein air. Par ailleurs, il est nécessaire de prévoir soit un coffret électrique situé à moins de vingt mètres et alimenté en triphasé 400 V, soit deux arrivées électriques en 220 V directement sur scène, à l’emplacement prévu pour le matériel, afin d’assurer l’alimentation de la sonorisation et de l’éclairage.

SÉCURITÉ : Afin d’éviter tout accident, des barrières de sécurité peuvent être demandé devant la discothèque ou la scène. Pendant toute la durée du bal un membre de l’organisation sera à disposition de la discothèque mobile afin de gérer la logistique du bal (bagarre, accident, et autre problèmes). Lors de l’absence des techniciens, un personnel de l’organisation devra surveiller la discothèque mobile.

HORAIRES : L’animation dure 5h, un fond musical sera diffusé à partir de 19h et l’animation commence à 23h. Pour des raisons de logistique, l’animation ne pourra pas être poursuivie au-delà de 4h du matin, sauf sur avenant au contrat.

ATTENTION : Si les conditions techniques ci-dessus ne sont pas respectées, le prestataire peut refuser d’assurer le bal.

• Très important : Un des deux contrats d’engagement doit nous être retourné dans un délai de deux semaines pour que la date soit définitivement réservée.`;

const RADIUS_OPTIONS = [
  { label: "50 km", value: "50km" },
  { label: "100 km", value: "100km" },
  { label: "200 km", value: "200km" },
  { label: "500 km", value: "500km" },
  { label: "Toute la France", value: "France" },
];

export default function ProSettings() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const proRef = useMemoFirebase(() => user ? doc(db, 'professionalUsers', user.uid) : null, [db, user]);
  const { data: proData, isLoading } = useDoc(proRef);

  const [logoUrl, setLogoUrl] = React.useState("");
  const [portfolioPhotos, setPortfolioPhotos] = React.useState<string[]>([]);
  const [generalTerms, setGeneralTerms] = React.useState(DEFAULT_TERMS);
  const [serviceRadius, setServiceRadius] = React.useState("50km");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (proData) {
      if (proData.logoUrl) setLogoUrl(proData.logoUrl);
      if (proData.portfolioPhotos) setPortfolioPhotos(proData.portfolioPhotos);
      if (proData.generalTerms) setGeneralTerms(proData.generalTerms);
      if (proData.serviceRadius) setServiceRadius(proData.serviceRadius);
    }
  }, [proData]);

  const handleSave = () => {
    if (!user || !proRef) return;
    
    setIsSaving(true);
    updateDocumentNonBlocking(proRef, {
      logoUrl,
      portfolioPhotos,
      generalTerms,
      serviceRadius,
      updatedAt: new Date().toISOString()
    });

    // Simulate feedback
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Réglages enregistrés",
        description: "Vos préférences, votre galerie et vos conditions générales ont été mises à jour.",
      });
    }, 800);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPortfolioPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePortfolioPhoto = (index: number) => {
    setPortfolioPhotos(prev => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <Shell role="pro">
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell role="pro">
      <div className="max-w-4xl mx-auto space-y-12 pb-10">
        <div>
          <h1 className="text-3xl font-headline font-bold text-slate-900">Réglages Professionnels</h1>
          <p className="text-slate-500">Personnalisez votre visibilité et vos documents commerciaux.</p>
        </div>

        <div className="grid grid-cols-1 gap-10">
          {/* Portfolio & Logo Section */}
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 p-8 border-b">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline text-xl">Identité Visuelle</CardTitle>
              </div>
              <CardDescription>Gérez votre logo et votre galerie de photos pour rassurer vos clients.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              {/* Logo */}
              <div className="space-y-4">
                <Label className="font-bold text-base">Logo de l'entreprise</Label>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative w-32 h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                    {logoUrl ? (
                      <Image src={logoUrl} alt="Logo" fill className="object-contain p-2" />
                    ) : (
                      <div className="text-center p-2">
                        <ImageIcon className="h-8 w-8 text-slate-300 mx-auto mb-1" />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Pas de logo</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3 text-center md:text-left">
                    <Button 
                      variant="outline" 
                      className="h-11 rounded-xl border-2 font-bold"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" /> Choisir un logo
                    </Button>
                    <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    <p className="text-xs text-slate-400">Format PNG/JPG, fond transparent conseillé.</p>
                  </div>
                </div>
              </div>

              {/* Portfolio Gallery */}
              <div className="space-y-4 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <Label className="font-bold text-base">Galerie de photos (Réalisations)</Label>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="rounded-lg font-bold h-9"
                    onClick={() => document.getElementById('portfolio-upload')?.click()}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Ajouter
                  </Button>
                </div>
                <input id="portfolio-upload" type="file" accept="image/*" multiple className="hidden" onChange={handlePortfolioUpload} />
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {portfolioPhotos.map((photo, idx) => (
                    <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <Image src={photo} alt={`Portfolio ${idx}`} fill className="object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8 rounded-full"
                          onClick={() => removePortfolioPhoto(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {portfolioPhotos.length === 0 && (
                    <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                      <p className="text-slate-400 text-sm font-medium">Votre galerie est vide.</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Radius Section */}
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 p-8 border-b">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline text-xl">Zone de Chalandise</CardTitle>
              </div>
              <CardDescription>Définissez le périmètre dans lequel vous souhaitez recevoir des annonces.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="max-w-md space-y-4">
                <Label htmlFor="radius" className="font-bold">Rayon d'intervention maximal</Label>
                <Select value={serviceRadius} onValueChange={setServiceRadius}>
                  <SelectTrigger id="radius" className="h-12 border-slate-200 rounded-xl bg-slate-50 focus:ring-primary shadow-none">
                    <SelectValue placeholder="Choisir une distance" />
                  </SelectTrigger>
                  <SelectContent>
                    {RADIUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="font-medium">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-400 leading-relaxed bg-blue-50 p-4 rounded-xl text-primary font-medium">
                  <strong>Note :</strong> Vous recevrez des notifications uniquement pour les demandes se situant dans ce périmètre autour de votre ville d'inscription.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* General Terms Section */}
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 p-8 border-b">
              <div className="flex items-center gap-3">
                <Save className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline text-xl">Conditions Générales de Vente (CGV)</CardTitle>
              </div>
              <CardDescription>Texte légal affiché au bas de vos devis. Modifiez-le ici pour qu'il s'applique à tous vos futurs documents.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Textarea 
                value={generalTerms}
                onChange={(e) => setGeneralTerms(e.target.value)}
                className="min-h-[300px] border-slate-200 rounded-2xl bg-slate-50/30 focus:ring-primary p-6 text-sm leading-relaxed"
                placeholder="Détaillez vos conditions..."
              />
            </CardContent>
            <CardFooter className="bg-slate-50/50 p-8 border-t flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                size="lg"
                className="h-14 px-12 bg-primary hover:bg-primary/90 rounded-2xl shadow-2xl shadow-primary/20 font-bold text-base"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                Sauvegarder mes réglages
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
