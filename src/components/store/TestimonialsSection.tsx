const TESTIMONIALS = [
  { name: "Maria Clara", text: "Comprei um vestido para minha mãe e ela amou! Veio super cheiroso e bem embalado. Nós duas amamos!" },
  { name: "Ana Silva", text: "Chegou, experimentei e amei muuuuuito! Atendimento nota mil. Obrigada!" },
  { name: "Joilza Oliver", text: "Amei meu pedido! Será o primeiro de vários. Veio tudo bem embalado e muito cheiroso. Amei os mimos!" },
  { name: "Dayana Santos", text: "Meu pedido chegou ontem! Envio e entrega super rápido. Parabéns pelo cuidado." },
]

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-rose-50/50">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <p className="eyebrow mb-4">Depoimentos</p>
          <h2 className="display-lg">
            O que nossas{" "}
            <span className="italic text-gradient-rose">clientes</span> dizem
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={t.name}
              className={`surface p-7 flex flex-col animate-fade-up stagger-${i + 1}`}
            >
              <span className="font-[family-name:var(--font-display)] text-5xl leading-none text-rose-200 mb-2">
                &ldquo;
              </span>
              <blockquote className="body-base text-espresso-600 leading-relaxed flex-1 mb-6">
                {t.text}
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-4 border-t border-cream-200">
                <span className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-[family-name:var(--font-display)] text-sm">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-[13px] font-medium text-espresso-700">
                    {t.name}
                  </p>
                  <div className="flex gap-0.5 text-gold-400 text-[10px]">
                    {"★★★★★".split("").map((s, j) => (
                      <span key={j}>{s}</span>
                    ))}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
