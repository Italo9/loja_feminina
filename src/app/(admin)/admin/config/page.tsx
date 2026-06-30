export default function AdminConfigPage() {
  return (
    <div>
      <h1 className="display-md mb-6">Configurações</h1>
      <div className="surface p-6 text-center">
        <p className="body-base">
          As configurações da loja são definidas via variáveis de ambiente no arquivo .env.
          Edite o arquivo e faça o deploy para aplicar as mudanças.
        </p>
      </div>
    </div>
  )
}
