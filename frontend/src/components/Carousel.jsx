import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "./EventCard";

export default function Carousel({ titulo, subtitulo, eventos }) {
  const scrollRef = useRef(null);

  function scroll(direcao) {
    const largura = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direcao === "direita" ? largura : -largura,
      behavior: "smooth",
    });
  }

  if (!eventos || eventos.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">{titulo}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitulo}</p>
        </div>

        <div className="hidden gap-2 sm:flex">
          <button
            onClick={() => scroll("esquerda")}
            className="rounded-full border border-border p-2 hover:bg-primary-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("direita")}
            className="rounded-full border border-border p-2 hover:bg-primary-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="mt-5 flex gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {eventos.map((evento) => (
          <div key={evento.id} className="w-40 shrink-0 sm:w-48">
            <EventCard evento={evento} />
          </div>
        ))}
      </div>
    </section>
  );
}