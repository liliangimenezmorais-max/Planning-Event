
"use client";

import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, MapPin, MessageSquare, ChevronLeft, Send, Sparkles, Loader2 } from "lucide-react";
import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function ProfessionalProfilePage() {
  const params = useParams();
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState("");

  // Fetch professional data
  const proRef = useMemoFirebase(() => {
    if (!db || !params.id) return null;
    return doc(db, 'professionals', params.id as string);
  }, [db, params.id]);
  const { data: pro, isLoading: isProLoading } = useDoc(proRef);

  // Fetch reviews
  const reviewsQuery = useMemoFirebase(() => {
    if (!db || !params.id) return null;
    return collection(db, 'professionals', params.id as string, 'reviews');
  }, [db, params.id]);
  const { data: reviews, isLoading: isReviewsLoading } = useCollection(reviewsQuery);

  // Calculate average rating
  const stats = React.useMemo(() => {
    if (!reviews || reviews.length === 0) return { avg: 0, count: 0 };
    const sum = reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0);
    return {
      avg: (sum / reviews.length).toFixed(1),
      count: reviews.length
    };
  }, [reviews]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: "destructive", title: "Connexion requise", description: "Veuillez vous connecter pour laisser un avis." });
      return;
    }
    if (rating === 0) {
      toast({ variant: "destructive", title: "Note requise", description: "Veuillez sélectionner une note." });
      return;
    }

    const reviewData = {
      clientId: user.uid,
      professionalId: params.id,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    // Save review
    const reviewsCol = collection(db, 'professionals', params.id as string, 'reviews');
    addDocumentNonBlocking(reviewsCol, reviewData);

    // Create notification for the pro
    const notifCol = collection(db, 'professionals', params.id as string, 'notifications');
    addDocumentNonBlocking(notifCol, {
      recipientProfessionalId: params.id,
      type: 'new_review',
      message: `Vous avez reçu un nouvel avis (${rating}/5).`,
      isRead: false,
      sourceId: user.uid,
      sourceEntityType: 'Review',
      createdAt: new Date().toISOString(),
    });

    toast({ title: "Avis envoyé", description: "Merci pour votre retour !" });
    setRating(0);
    setComment("");
  };

  if (isProLoading) {
    return (
      <Shell role="client">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell role="client">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/client/search" className="flex items-center text-sm text-slate-500 hover:text-primary font-bold transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" /> Retour à la recherche
        </Link>

        {pro && (
          <Card className="border-none shadow-xl overflow-hidden bg-white">
            <div className="h-40 bg-primary" />
            <CardContent className="relative pt-16 pb-10 px-8">
              <div className="absolute -top-16 left-8">
                <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
                  <AvatarImage src={`https://picsum.photos/seed/${pro.id}/200`} />
                  <AvatarFallback>{pro.firstName?.[0]}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-3xl font-headline font-bold text-slate-900">{pro.companyName || `${pro.firstName} ${pro.lastName}`}</h1>
                  <p className="text-primary font-bold uppercase tracking-widest text-xs mt-1">Prestataire</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center text-yellow-600 font-bold text-sm">
                      <Star className="h-4 w-4 fill-current mr-1" /> {stats.avg} ({stats.count} avis)
                    </div>
                    <div className="flex items-center text-slate-400 text-sm font-medium">
                      <MapPin className="h-4 w-4 mr-1" /> {pro.location}
                    </div>
                  </div>
                </div>
                <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-2xl px-8 font-bold shadow-xl shadow-primary/20" asChild>
                  <Link href={`/client/messages?proId=${pro.id}`}>
                    <MessageSquare className="h-5 w-5 mr-2" /> Contacter
                  </Link>
                </Button>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100">
                <h3 className="font-bold text-lg mb-3">À propos</h3>
                <p className="text-slate-600 leading-relaxed">{pro.description || "Aucune description fournie."}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Review Form */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Laisser un avis
              </CardTitle>
              <CardDescription>Partagez votre expérience avec ce prestataire.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div className="space-y-3">
                  <Label className="font-bold">Votre note</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform active:scale-90"
                      >
                        <Star className={`h-8 w-8 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="comment" className="font-bold">Votre commentaire</Label>
                  <Textarea
                    id="comment"
                    placeholder="Qu'avez-vous pensé de la prestation ?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[120px] bg-slate-50 border-none focus:ring-primary rounded-xl"
                  />
                </div>
                <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 h-12 rounded-xl font-bold">
                  Envoyer l'avis <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Past Reviews List */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Derniers avis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isReviewsLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin" /></div>
              ) : reviews && reviews.length > 0 ? (
                reviews.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((rev, i) => (
                  <div key={i} className="space-y-2 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm">Client Anonyme</p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {new Date(rev.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 italic text-center py-4">Aucun avis pour le moment.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
