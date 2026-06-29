const TESTIMONIALS = [
  { name: "Maria Clara", text: "Comprei um vestido para minha mãe e ela amou! Veio super cheiroso e bem embalado. Nós duas amamos!" },
  { name: "Ana Silva", text: "Chegou, experimentei e amei muuuuuito! Atendimento nota mil. Obrigada!" },
  { name: "Joilza Oliver", text: "Amei meu pedido! Será o primeiro de vários. Veio tudo bem embalado e muito cheiroso. Amei os mimos!" },
  { name: "Dayana Santos", text: "Meu pedido chegou ontem! Envio e entrega super rápido. Parabéns pelo cuidado." },
]

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-pearl-100">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h2 className="display-lg text-espresso-900 mb-3">
            O que nossas{" "}
            <span className="text-berry-600 italic font-light">
              clientes
            </span>{" "}
            dizem
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`bg-white rounded-2xl p-6 border border-pearl-200 animate-fade-up stagger-${i + 1}`}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4 text-topaz-400">
                {"★★★★★".split("").map((s, j) => (
                  <span key={j} className="text-sm">{s}</span>
                ))}
              </div>
              <p className="text-sm text-espresso-600 leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="text-xs font-bold text-espresso-900">
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
