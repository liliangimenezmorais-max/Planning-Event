
"use client";

import { Shell } from "@/components/layout/Shell";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Euro, 
  MessageSquare, 
  Sparkles, 
  Loader2,
  FileText,
  ChevronLeft,
  Mail,
  Phone,
  Info
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { aiResponseAssistantForPros, AiResponseAssistantForProsOutput } from "@/ai/flows/ai-response-assistant-for-pros";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";

const AD_REQUESTS = [
  { id: "1", clientId: "client-1", clientName: "Marie L.", clientPhone: "06 98 76 54 32", clientEmail: "marie.l@example.com", eventType: "Mariage", date: "2024-08-12", location: "Bordeaux Centre", guests: 80, description: "Nous recherchons un photographe pour notre mariage civil et la réception en plein air. Environ 80 invités. Nous aimons le style naturel et lumineux.", requestedPro: "Photographe" },
  { id: "2", clientId: "client-2", clientName: "Entreprise X", clientPhone: "01 22 33 44 55", clientEmail: "contact@entreprise-x.com", eventType: "Corporate", date: "2024-09-15", location: "Mérignac", guests: 200, description: "Recherche DJ pour soirée annuelle entreprise. Ambiance lounge puis festive.", requestedPro: "DJ" },
  { id: "3", clientId: "client-3", clientName: "Thomas G.", clientPhone: "06 11 22 33 44", clientEmail: "thomas.g@example.com", eventType: "Anniversaire", date: "2024-05-28", location: "Pessac", guests: 40, description: "30 ans, ambiance généraliste demandée.", requestedPro: "DJ" },
];

export default function RequestDetails() {
  const params = useParams();
  const [aiDraft, setAiDraft] = React.useState<AiResponseAssistantForProsOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [editedResponse, setEditedResponse] = React.useState("");
  const { toast } = useToast();
  const router = useRouter();

  // Find the specific request based on ID
  const mockRequest = AD_REQUESTS.find(r => r.id === params.id) || AD_REQUESTS[0];

  const proInfo = {
    serviceCategories: ["Photographie Mariage", "Séance Engagement", "Album Photo Premium"],
    pricingStructure: "Forfaits à partir de 900€, devis personnalisé selon options",
    availabilityStatus: "Disponible",
    portfolioHighlights: ["Mariage champêtre 2023", "Soirée Gala Hôtel de Ville"]
  };

  const handleGenerateAiResponse = async () => {
    setIsLoading(true);
    try {
      const result = await aiResponseAssistantForPros({
        clientRequest: {
          date: mockRequest.date,
          location: mockRequest.location,
          eventType: mockRequest.eventType,
          budget: 0,
          desiredProfessional: mockRequest.requestedPro,
          description: mockRequest.description
        },
        professionalServices: proInfo
      });
      setAiDraft(result);
      setEditedResponse(result.draftResponse);
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de générer la réponse IA." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResponse = () => {
    toast({ title: "Message envoyé", description: `Votre réponse a été transmise à ${mockRequest.clientName}.` });
    router.push(`/pro/messages?clientId=${mockRequest.id}`);
  };

  return (
    <Shell role="pro">
      <div className="space-y-6 max-w-6xl mx-auto">
        <Link href="/pro/requests" className="flex items-center text-sm text-slate-500 hover:text-primary transition-colors font-semibold">
          <ChevronLeft className="h-4 w-4 mr-1" /> Retour aux annonces
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Client Profile Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="shadow-xl border-none overflow-hidden">
              <CardHeader className="bg-primary text-white pb-12">
                <div className="flex justify-between items-start">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
                    <AvatarImage src={`https://picsum.photos/seed/${mockRequest.clientName}/200`} />
                    <AvatarFallback>{mockRequest.clientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Badge variant="secondary" className="bg-secondary text-primary font-bold px-3 py-1">Nouveau</Badge>
                </div>
                <div className="mt-4">
                  <CardTitle className="text-2xl font-headline font-bold lowercase">{mockRequest.clientName}</CardTitle>
                  <CardDescription className="text-blue-50 font-medium">Particulier • Client potentiel</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="relative bg-white pt-6 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Coordonnées</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Mail className="h-4 w-4 text-primary" /> {mockRequest.clientEmail}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone className="h-4 w-4 text-primary" /> {mockRequest.clientPhone}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Détails de l'événement</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Type</p>
                      <p className="text-sm font-bold">{mockRequest.eventType}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Date</p>
                      <p className="text-sm font-bold">{mockRequest.date}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Invités</p>
                      <p className="text-sm font-bold">{mockRequest.guests} pers.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50/50 border-dashed border-2 border-blue-200">
              <CardContent className="p-6">
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-primary">
                  <Info className="h-4 w-4" /> Message du client
                </h4>
                <p className="text-sm text-slate-600 italic leading-relaxed">
                  "{mockRequest.description}"
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Response Editor Area */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="shadow-2xl border-none">
              <CardHeader className="border-b pb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="font-headline text-xl text-slate-900">Préparer votre réponse</CardTitle>
                    <CardDescription>Envoyez un message pour engager la conversation.</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary hover:text-white font-bold transition-all h-11 px-6 rounded-xl"
                    onClick={handleGenerateAiResponse}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    Assistance IA
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">Votre message personnalisé</Label>
                  <Textarea 
                    value={editedResponse}
                    onChange={(e) => setEditedResponse(e.target.value)}
                    placeholder={`Bonjour ${mockRequest.clientName.split(' ')[0]}, je suis très intéressé par votre projet de ${mockRequest.eventType.toLowerCase()}...`}
                    className="min-h-[250px] text-base focus:ring-primary border-slate-200 rounded-xl bg-slate-50/50"
                  />
                </div>

                {aiDraft && (
                  <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-primary uppercase flex items-center gap-2 tracking-widest">
                        <Sparkles className="h-3 w-3" /> Suggestions pour le devis
                      </h4>
                      <Badge variant="outline" className="bg-white text-[10px] text-primary">IA Générée</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {aiDraft.suggestedQuoteDetails.map((detail, i) => (
                        <Badge key={i} variant="secondary" className="bg-white border-blue-100 text-slate-700 font-medium">
                          {detail}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50/50 p-8 flex justify-between items-center border-t rounded-b-2xl">
                <Button variant="ghost" className="text-slate-500 font-semibold">Enregistrer brouillon</Button>
                <div className="flex gap-3">
                  {/* Fixed link to real client details instead of hardcoded '1' */}
                  <Button variant="outline" className="h-12 px-6 border-slate-200 font-bold rounded-xl" asChild>
                    <Link href={`/pro/clients/${mockRequest.clientId}`}>Gérer documents</Link>
                  </Button>
                  <Button onClick={handleSendResponse} className="h-12 px-10 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 font-bold rounded-xl">
                    Envoyer le message
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
