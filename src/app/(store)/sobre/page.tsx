import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/store/Breadcrumbs"
import { store } from "@/lib/config"

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Sobre",
  description: `Conheça a história da ${store.name}. ${store.tagline}. Moda feminina premium com curadoria especial em ${store.city}.`,
  openGraph: {
    title: `Sobre | ${store.name}`,
    description: store.tagline,
    type: "website",
  },
}

export default function GenericPage() {
  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="container-narrow py-8 max-w-lg mx-auto">
        <Breadcrumbs items={[{ label: "Sobre" }]} />
        <h1 className="display-md mb-6">Sobre a {store.name}</h1>
        <div className="body-base space-y-4 text-plum-600 leading-relaxed">
          <p>
            A {store.name} nasceu de um sonho compartilhado entre duas amigas que sempre acreditaram que a moda tem o poder de transformar a forma como uma mulher se sente.
          </p>
          <p>
            A ideia surgiu da vontade de empreender, conquistar independência financeira e construir uma marca que fosse além da venda de roupas. Queríamos criar um espaço onde cada cliente pudesse encontrar peças que transmitissem confiança, elegância e autenticidade, sem precisar abrir mão da qualidade ou pagar preços inacessíveis.
          </p>
          <p>
            Escolhemos o nome {store.name}, que significa "luz" em francês, porque acreditamos que toda mulher possui um brilho único. Nossa missão é oferecer roupas que valorizem essa essência e façam com que cada cliente se sinta ainda mais segura e bonita.
          </p>

          <h2 className="display-sm mt-8 mb-3 text-plum-800">Nossa missão</h2>
          <p>
            Levar moda feminina de qualidade, acompanhando as tendências sem perder a elegância, oferecendo uma experiência de compra acolhedora, transparente e acessível. Queremos que cada cliente tenha a confiança de saber que está adquirindo peças escolhidas com cuidado e dedicação.
          </p>

          <h2 className="display-sm mt-8 mb-3 text-plum-800">Nossa visão</h2>
          <p>
            Nosso objetivo é transformar a {store.name} em uma marca reconhecida nacionalmente pela qualidade dos seus produtos, pelo atendimento diferenciado e pela relação de confiança construída com cada cliente. Queremos crescer de forma sólida, expandir nossa presença no mercado e ser lembrados como uma marca que inspira mulheres a se sentirem confiantes em qualquer momento da vida.
          </p>

          <h2 className="display-sm mt-8 mb-3 text-plum-800">Nosso público</h2>
          <p>
            A {store.name} foi criada para mulheres que valorizam elegância, versatilidade e autenticidade. Atendemos quem deseja se vestir bem em diferentes ocasiões, encontrando peças modernas, confortáveis e com excelente custo-benefício.
          </p>

          <h2 className="display-sm mt-8 mb-3 text-plum-800">Nossos valores</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Transparência em cada atendimento.</li>
            <li>Respeito e compromisso com nossas clientes.</li>
            <li>Qualidade acima de quantidade.</li>
            <li>Honestidade em todas as nossas relações.</li>
            <li>Atendimento humanizado.</li>
            <li>Evolução constante.</li>
            <li>Paixão pelo que fazemos.</li>
          </ul>

          <h2 className="display-sm mt-8 mb-3 text-plum-800">Nossa essência</h2>
          <p>
            Mais do que vender roupas, queremos construir uma marca que faça parte da história de nossas clientes. Cada coleção é escolhida pensando em oferecer beleza, conforto e praticidade para mulheres reais, com diferentes estilos, rotinas e objetivos.
          </p>
          <p>
            Queremos crescer ao lado de cada cliente, criando uma comunidade baseada na confiança, no carinho e na certeza de que vestir-se bem é também uma forma de expressar quem somos.
          </p>
          <p>
            Seja bem-vinda à {store.name}. Esperamos que esta seja apenas a primeira de muitas experiências ao nosso lado.
          </p>
        </div>
      </div>
    </div>
  )
}
