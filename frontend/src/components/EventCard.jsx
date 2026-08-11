import { Link } from "react-router-dom";

export default function EventCard({ evento }) {
  return (
    <Link
      to={`/eventos/${evento.id}`}
      className="block overflow-hidden rounded-2xl transition-transform hover:-translate-y-1"
    >
      <img
        src={evento.imagem}
        alt={evento.titulo}
        className="aspect-2/3 w-full rounded-2xl object-cover"
      />
    </Link>
  );
}