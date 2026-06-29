export default function AdminConfigPage() {
  return (
    <div>
      <h1 className="display-md text-espresso-900 mb-6">Configurações</h1>
      <div className="bg-white rounded-2xl p-6 border border-pearl-200 text-center">
        <p className="body-base text-espresso-400">
          As configurações da loja são definidas via variáveis de ambiente no arquivo .env.
          Edite o arquivo e faça o deploy para aplicar as mudanças.
        </p>
      </div>
    </div>
  )
}
