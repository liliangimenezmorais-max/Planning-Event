import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { 
  Star, 
  User, 
  Briefcase, 
  Calendar, 
  FileText, 
  Search, 
  Users, 
  ShieldCheck,
  Music,
  Camera,
  Utensils,
  PartyPopper
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Calendrier intelligent",
      description: "Gérez vos réservations et disponibilités en un clin d'œil.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Devis professionnels",
      description: "Créez et envoyez des devis PDF avec signature électronique.",
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      icon: <Search className="h-5 w-5" />,
      title: "Smart Matching",
      description: "Recevez uniquement les demandes qui correspondent à votre profil.",
      color: "bg-cyan-50 text-cyan-600"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Réseau de remplacement",
      description: "Trouvez un remplaçant parmi les pros de votre réseau B2B.",
      color: "bg-violet-50 text-violet-600"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Marketplace",
      description: "Recherchez des professionnels par catégorie et ville.",
      color: "bg-yellow-50 text-yellow-600"
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Suivi sécurisé",
      description: "Comparez les devis, chattez et signez vos documents en ligne.",
      color: "bg-green-50 text-green-600"
    }
  ];

  const categories = [
    { label: "DJ", icon: <Music className="h-8 w-8" />, color: "bg-blue-100 text-blue-600" },
    { label: "Traiteur", icon: <Utensils className="h-8 w-8" />, color: "bg-orange-100 text-orange-600" },
    { label: "Photographe", icon: <Camera className="h-8 w-8" />, color: "bg-indigo-100 text-indigo-600" },
    { label: "Wedding Planner", icon: <PartyPopper className="h-8 w-8" />, color: "bg-pink-100 text-pink-600" },
    { label: "Musicien", icon: <Music className="h-8 w-8" />, color: "bg-violet-100 text-violet-600" }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-primary/20">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-secondary/20 rounded-full blur-[100px]" />
      </div>

      <header className="fixed top-0 z-50 w-full border-b bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="h-12 w-12 transition-transform group-hover:rotate-3" />
            <span className="text-2xl font-headline font-bold text-slate-900 tracking-tight">Planning Event</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden sm:inline-flex text-slate-600 font-semibold">
              <Link href="/auth/login">Se connecter</Link>
            </Button>
            <Button className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" asChild>
              <Link href="/auth/signup/client">S'inscrire</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 w-full overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-50 text-primary text-sm font-bold border border-blue-100 mb-10 shadow-sm animate-in fade-in slide-in-from-top-4 duration-1000">
                <Star className="h-4 w-4 fill-primary" />
                <span>La plateforme n°1 de l'événementiel</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-headline font-bold text-slate-900 leading-[1.05] mb-10 tracking-tighter">
                Organisez vos <br className="hidden md:block" />
                événements <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">simplement</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-14 font-medium">
                La solution complète pour connecter particuliers et professionnels. Trouvez le prestataire parfait pour vos moments inoubliables.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24">
                <Button 
                  size="lg" 
                  className="h-16 px-10 text-lg rounded-2xl bg-primary hover:bg-primary/90 text-white transition-all shadow-xl shadow-primary/25 group w-full sm:w-auto"
                  asChild
                >
                  <Link href="/auth/signup/client" className="flex items-center font-bold">
                    <User className="mr-3 h-5 w-5" />
                    Je suis un particulier
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-16 px-10 text-lg rounded-2xl border-2 border-primary/20 text-primary hover:bg-primary/5 transition-all w-full sm:w-auto font-bold"
                  asChild
                >
                  <Link href="/auth/signup/pro" className="flex items-center">
                    <Briefcase className="mr-3 h-5 w-5" />
                    Je suis un professionnel
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-16 border-t border-slate-100">
                {categories.map((item, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className={`h-24 w-24 mx-auto mb-4 rounded-3xl flex items-center justify-center ${item.color} shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 bg-slate-50 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-slate-900 mb-6 tracking-tight">Tout ce dont vous avez besoin</h2>
              <p className="text-lg text-slate-500 font-medium">Une interface moderne et intuitive pour gérer chaque détail de votre événement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-primary/5 transition-all group"
                >
                  <div className={`h-14 w-14 rounded-2xl ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-40 relative overflow-hidden bg-white">
          <div className="absolute inset-0 opacity-50">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
          </div>
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto space-y-10">
              <h2 className="text-3xl md:text-5xl font-headline font-bold text-slate-900 tracking-tight leading-tight">
                Prêt à donner vie à vos <br className="hidden md:block" />
                projets événementiels ?
              </h2>
              <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
                Rejoignez une communauté de professionnels passionnés et de clients organisés.
              </p>
              <div className="pt-6">
                <Button 
                  size="lg" 
                  className="h-16 px-16 text-lg rounded-full bg-primary hover:bg-primary/90 text-white transition-all shadow-2xl shadow-primary/30 font-bold"
                  asChild
                >
                  <Link href="/auth/signup/client">
                    Démarrer gratuitement
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-10" />
              <span className="text-xl font-headline font-bold text-slate-900 tracking-tight">Planning Event</span>
            </div>
            
            <nav className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-slate-500 font-bold">
              <Link href="#" className="hover:text-primary transition-colors">CGU</Link>
              <Link href="#" className="hover:text-primary transition-colors">Confidentialité</Link>
              <Link href="#" className="hover:text-primary transition-colors">Mentions Légales</Link>
            </nav>

            <div className="text-slate-400 text-sm font-semibold tracking-wide">
              © 2026 Planning Event. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
