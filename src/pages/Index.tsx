import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Star, Facebook, Flame } from "lucide-react";
import heroPizza from "@/assets/hero-pizza.jpg";
import MenuFull from "@/components/MenuFull";
import margherita from "@/assets/pizza-margherita.jpg";
import prosciutto from "@/assets/pizza-prosciutto.jpg";
import diavola from "@/assets/pizza-diavola.jpg";

const menu = [
  { name: "Margherita", desc: "Sos pomidorowy, mozzarella fior di latte, świeża bazylia, oliwa", price: "32 zł", img: margherita },
  { name: "Prosciutto e Rucola", desc: "Mozzarella, prosciutto crudo, rukola, płatki parmezanu", price: "46 zł", img: prosciutto },
  { name: "Diavola", desc: "Sos pomidorowy, mozzarella, ostra salami, oregano, chili", price: "42 zł", img: diavola },
];

const reviews = [
  { name: "Jolanta Sosińska", text: "Jedzenie pyszne. Zamówiliśmy krewetki, pizzę, gazpacho, carbonarę, makaron z policzkami wołowymi — wszystko w punkt. Gratulacje dla kucharza!", rating: 5 },
  { name: "Lech Migdal", text: "Bardzo dobra pizza, wielkość akurat dla jednej osoby, pyszna lemoniada cytrynowa, miła obsługa. Toaleta czysta.", rating: 5 },
  { name: "Przemek P.", text: "Klimatyczne miejsce w sercu Sobótki. Świetna atmosfera, warto wpaść na kolację z rodziną.", rating: 4 },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <a href="#top" className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-primary" />
            <span className="font-serif text-2xl font-bold tracking-wide">Falò</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#menu" className="hover:text-primary transition-colors">Menu</a>
            <a href="#reviews" className="hover:text-primary transition-colors">Opinie</a>
            <a href="#contact" className="hover:text-primary transition-colors">Kontakt</a>
          </div>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
            <a href="tel:576522455">Rezerwacja</a>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <header id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal">
        <img
          src={heroPizza}
          alt="Pizza neapolitańska z pieca opalanego drewnem w pizzerii Falò"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          width={1600}
          height={1200}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/40 to-charcoal" />
        <div className="relative z-10 container text-center text-primary-foreground pt-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 border border-primary-foreground/30 rounded-full text-sm">
            <Star className="w-4 h-4 fill-primary-glow text-primary-glow" />
            <span>4,5 · 412 opinii w Google</span>
          </div>
          <h1 className="font-serif text-6xl md:text-8xl font-bold mb-6 leading-none">
            Falò
          </h1>
          <p className="text-xl md:text-2xl font-light mb-2 text-primary-foreground/90">
            Włoska pizza z pieca w sercu Sobótki
          </p>
          <p className="text-base text-primary-foreground/70 mb-10 max-w-xl mx-auto">
            Świeże składniki, autentyczne smaki, ciepła atmosfera — od ponad dekady przy placu Wolności.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-[var(--shadow-warm)]">
              <a href="#menu">Zobacz menu</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-charcoal">
              <a href="tel:576522455">
                <Phone className="w-4 h-4 mr-2" /> 576 522 455
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Story */}
      <section className="py-24 bg-secondary">
        <div className="container max-w-3xl text-center">
          <Flame className="w-10 h-10 mx-auto mb-6 text-primary" />
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Ogień, ciasto, pasja</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Falò znaczy „ognisko" — i właśnie wokół niego skupia się nasza kuchnia.
            Pizza wypiekana w gorącym piecu, ciasto dojrzewające 48 godzin, oliwa z pierwszego tłoczenia
            i sezonowe składniki od lokalnych dostawców. Zapraszamy na miejscu, na wynos lub z dostawą.
          </p>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-primary uppercase tracking-[0.3em] text-sm mb-3">Nasze menu</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold">Pizza z pieca</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {menu.map((item) => (
              <article key={item.name} className="group bg-card rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:-translate-y-2 transition-[var(--transition-smooth)]">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.img}
                    alt={`Pizza ${item.name} — ${item.desc}`}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between mb-2 gap-4">
                    <h3 className="font-serif text-2xl font-bold">{item.name}</h3>
                    <span className="text-primary font-semibold whitespace-nowrap">{item.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="text-center mt-12 text-muted-foreground">
            …a poniżej znajdziesz <a href="#menu-pelne" className="text-primary hover:underline">całą kartę</a>: makarony, gnocchi, przystawki i napoje.
          </p>
        </div>
      </section>

      <MenuFull />

      {/* Reviews */}
      <section id="reviews" className="py-24 bg-secondary">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-primary text-primary" />
              ))}
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-3">4,5 / 5</h2>
            <p className="text-muted-foreground">na podstawie 412 opinii Google</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <blockquote key={r.name} className="bg-card p-8 rounded-2xl shadow-[var(--shadow-card)]">
                <div className="flex gap-1 mb-4">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 italic mb-4 leading-relaxed">„{r.text}"</p>
                <footer className="font-semibold text-sm">— {r.name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-charcoal text-primary-foreground">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary-glow uppercase tracking-[0.3em] text-sm mb-3">Odwiedź nas</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8">Plac Wolności 1, Sobótka</h2>
            <ul className="space-y-5 text-lg">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 mt-1 text-primary-glow shrink-0" />
                <span>plac Wolności 1, 55-050 Sobótka</span>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="w-5 h-5 mt-1 text-primary-glow shrink-0" />
                <a href="tel:576522455" className="hover:text-primary-glow transition-colors">576 522 455</a>
              </li>
              <li className="flex items-start gap-4">
                <Clock className="w-5 h-5 mt-1 text-primary-glow shrink-0" />
                <div>
                  <p>Wtorek – Niedziela: 12:00 – 22:00</p>
                  <p className="text-primary-foreground/60 text-sm">Poniedziałek: zamknięte</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Facebook className="w-5 h-5 mt-1 text-primary-glow shrink-0" />
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-primary-glow transition-colors">Facebook</a>
              </li>
            </ul>
            <div className="flex gap-3 mt-10">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <a href="tel:576522455">Zarezerwuj stolik</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-charcoal">
                <a href="https://www.google.com/maps/search/?api=1&query=Falò+Sobótka" target="_blank" rel="noreferrer">Wyznacz trasę</a>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-warm)] aspect-square">
            <iframe
              title="Lokalizacja Falò Sobótka"
              src="https://www.google.com/maps?q=plac+Wolności+1,+55-050+Sobótka&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <footer className="py-8 bg-charcoal text-primary-foreground/60 text-center text-sm border-t border-primary-foreground/10">
        <div className="container">
          <Flame className="w-5 h-5 mx-auto mb-2 text-primary" />
          © {new Date().getFullYear()} Falò Sobótka · Wszelkie prawa zastrzeżone
        </div>
      </footer>
    </div>
  );
};

export default Index;
