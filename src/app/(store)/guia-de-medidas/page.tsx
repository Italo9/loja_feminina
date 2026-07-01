import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/store/Breadcrumbs"

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Guia de Medidas",
  description: "Guia de medidas para roupas femininas. Aprenda a medir busto, cintura e quadril corretamente.",
}

const SIZE_CHART = [
  { size: "PP", busto: "80–84", cintura: "62–66", quadril: "88–92" },
  { size: "P", busto: "84–88", cintura: "66–70", quadril: "92–96" },
  { size: "M", busto: "88–92", cintura: "70–74", quadril: "96–100" },
  { size: "G", busto: "92–98", cintura: "74–80", quadril: "100–106" },
  { size: "GG", busto: "98–104", cintura: "80–86", quadril: "106–112" },
]

export default function SizeGuidePage() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8 max-w-2xl mx-auto">
        <Breadcrumbs items={[{ label: "Guia de Medidas" }]} />

        <h1 className="display-lg mb-2">Guia de Medidas</h1>
        <p className="body-base text-espresso-400 mb-8">
          Confira abaixo a tabela de medidas padrão para nossas peças. As medidas podem variar
          conforme o modelo e o tecido.
        </p>

        <div className="overflow-x-auto mb-10 surface">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-cream-200">
                <th className="py-3 px-4 text-sm font-semibold text-espresso-600 uppercase tracking-wider">
                  Tamanho
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-espresso-600 uppercase tracking-wider">
                  Busto (cm)
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-espresso-600 uppercase tracking-wider">
                  Cintura (cm)
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-espresso-600 uppercase tracking-wider">
                  Quadril (cm)
                </th>
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row) => (
                <tr key={row.size} className="border-b border-cream-100 last:border-0 hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-rose-500">{row.size}</td>
                  <td className="py-3 px-4 text-espresso-600">{row.busto}</td>
                  <td className="py-3 px-4 text-espresso-600">{row.cintura}</td>
                  <td className="py-3 px-4 text-espresso-600">{row.quadril}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <h2 className="display-sm">Como tirar suas medidas</h2>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="surface text-center">
              <p className="font-semibold text-espresso-700 mb-2">Busto</p>
              <p className="body-sm text-espresso-400">
                Passe a fita métrica pelas costas, na altura das axilas, e pela parte mais
                volumosa do busto. Mantenha a fita reta e justa, sem apertar.
              </p>
            </div>
            <div className="surface text-center">
              <p className="font-semibold text-espresso-700 mb-2">Cintura</p>
              <p className="body-sm text-espresso-400">
                Meça a parte mais fina do tronco, geralmente acima do umbigo. A fita
                deve ficar justa, mas confortável.
              </p>
            </div>
            <div className="surface text-center">
              <p className="font-semibold text-espresso-700 mb-2">Quadril</p>
              <p className="body-sm text-espresso-400">
                Meça a parte mais larga do quadril, passando a fita pelo ponto mais
                volumoso dos glúteos.
              </p>
            </div>
          </div>

          <p className="body-sm text-espresso-400 text-center pt-2">
            Em caso de dúvidas, fale com a Lumi pelo chat. Ela vai te ajudar a escolher
            o tamanho ideal!
          </p>
        </div>
      </div>
    </div>
  )
}
