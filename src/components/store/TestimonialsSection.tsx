const TESTIMONIALS = [
  { name: "Maria Clara", text: "Comprei um vestido para minha mãe e ela amou! Veio super cheiroso e bem embalado. Nós duas amamos!" },
  { name: "Ana Silva", text: "Chegou, experimentei e amei muuuuuito! Atendimento nota mil. Obrigada!" },
  { name: "Joilza Oliver", text: "Amei meu pedido! Será o primeiro de vários. Veio tudo bem embalado e muito cheiroso. Amei os mimos!" },
  { name: "Dayana Santos", text: "Meu pedido chegou ontem! Envio e entrega super rápido. Parabéns pelo cuidado." },
]

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-[#FFF6F2]">
      <div className="container-narrow">
        <div className="text-center mb-14">
          <p className="eyebrow mb-4">Depoimentos</p>
          <h2 className="display-md">
            O que{" "}
            <span className="italic text-[#DCA7A7]">elas</span> dizem
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={t.name}
              className={`surface p-7 flex flex-col animate-fade-up stagger-${i + 1} bg-white rounded-2xl border-[#F6D8D6]/30`}
            >
              <span className="font-[family-name:var(--font-display)] text-6xl leading-none text-[#F6D8D6] mb-1">
                &ldquo;
              </span>
              <blockquote className="body-base text-[#6B4A4F]/80 leading-relaxed flex-1 mb-6 italic">
                {t.text}
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-4 border-t border-[#F6D8D6]/40">
                <span className="w-9 h-9 rounded-full bg-[#FFF6F2] text-[#DCA7A7] flex items-center justify-center font-[family-name:var(--font-display)] text-sm border border-[#F6D8D6]">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-[13px] font-medium font-[family-name:var(--font-display)] text-[#6B4A4F] tracking-wide">
                    {t.name}
                  </p>
                  <div className="flex gap-0.5 text-[#C9A66B] text-[10px]">
                    {"★★★★★".split("").map((s, j) => (
                      <span key={j}>{s}</span>
                    ))}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Gold dot indicators */}
        <div className="flex justify-center items-center gap-2.5 mt-10">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === 0 ? "bg-[#C9A66B] w-5" : "bg-[#C9A66B]/30"
              } transition-all duration-300`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
