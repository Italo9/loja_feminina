import { Breadcrumbs } from "@/components/store/Breadcrumbs"
import { store } from "@/lib/config"

export const dynamic = "force-static"

export default function PrivacyPage() {
  return (
    <div className="bg-[#FFF6F2] min-h-screen">
      <div className="container-narrow py-8 max-w-lg mx-auto">
        <Breadcrumbs items={[{ label: "Política de Privacidade" }]} />
        <h1 className="display-md mb-2">Política de Privacidade</h1>
        <p className="text-[13px] text-plum-400 mb-8">Última atualização: Junho 2026</p>

        <div className="body-base space-y-6">
          <section>
            <h2 className="display-sm mb-2">1. Compromisso com sua privacidade</h2>
            <p>
              A {store.name} valoriza sua privacidade. Esta política explica como coletamos,
              usamos e protegemos suas informações pessoais, em conformidade com a{" "}
              <strong>Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018)</strong>.
            </p>
          </section>

          <section>
            <h2 className="display-sm mb-2">2. Dados que coletamos</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Dados de cadastro:</strong> nome, e-mail, senha (hash criptografado).</li>
              <li><strong>Dados de pedido:</strong> endereço de entrega, itens comprados, valor.</li>
              <li><strong>Dados de pagamento:</strong> processados diretamente pelo Mercado Pago. Não armazenamos dados de cartão.</li>
              <li><strong>Dados de uso:</strong> cookies essenciais para carrinho de compras e sessão.</li>
            </ul>
          </section>

          <section>
            <h2 className="display-sm mb-2">3. Cookies</h2>
            <p>
              Utilizamos cookies estritamente necessários para:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Manter itens no carrinho de compras (localStorage)</li>
              <li>Manter sua sessão de login ativa</li>
              <li>Lembrar suas preferências de consentimento</li>
            </ul>
            <p className="mt-3">
              Você pode gerenciar suas preferências de cookies a qualquer momento através
              do banner de consentimento exibido no site.
            </p>
          </section>

          <section>
            <h2 className="display-sm mb-2">4. Finalidade do tratamento</h2>
            <p>Utilizamos seus dados exclusivamente para:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Processar e entregar seus pedidos</li>
              <li>Comunicação sobre o status do pedido</li>
              <li>Atendimento ao cliente via chat</li>
              <li>Cumprimento de obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="display-sm mb-2">5. Seus direitos (LGPD)</h2>
            <p>Conforme o Art. 18 da LGPD, você tem direito a:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Confirmar a existência de tratamento de dados</li>
              <li>Acessar seus dados</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar seu consentimento a qualquer momento</li>
            </ul>
          </section>

          <section>
            <h2 className="display-sm mb-2">6. Contato</h2>
            <p>
              Para exercer seus direitos ou tirar dúvidas sobre esta política,
              entre em contato:
            </p>
            <p className="mt-2">
              📧 {store.email}<br />
              📱 {store.phone}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
