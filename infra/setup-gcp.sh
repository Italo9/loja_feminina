#!/bin/bash
# ================================================================
# Jóia — Google Cloud Run Deploy Script
# ================================================================
# Uso: bash infra/setup-gcp.sh
#
# Pré-requisitos:
#   - gcloud CLI instalado e autenticado (gcloud auth login)
#   - Projeto GCP criado (gcloud projects create ...)
#   - Faturamento ativado no projeto
#   - APIs ativadas: Cloud Run, Cloud Build, Artifact Registry, Secret Manager
# ================================================================

set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:-joia-store}"
REGION="southamerica-east1"
SERVICE_NAME="joia-web"
ARTIFACT_REPO="joia"

echo "🚀 Configurando infraestrutura para Jóia Store..."
echo "   Projeto: ${PROJECT_ID}"
echo "   Região:  ${REGION}"

# 1. Set project
gcloud config set project "${PROJECT_ID}" 2>/dev/null || true

# 2. Enable required APIs
echo ""
echo "📡 Ativando APIs..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  sqladmin.googleapis.com \
  --project="${PROJECT_ID}"

# 3. Create Artifact Registry
echo ""
echo "📦 Criando Artifact Registry..."
if ! gcloud artifacts repositories describe "${ARTIFACT_REPO}" \
  --location="${REGION}" --project="${PROJECT_ID}" &>/dev/null; then
  gcloud artifacts repositories create "${ARTIFACT_REPO}" \
    --repository-format=docker \
    --location="${REGION}" \
    --project="${PROJECT_ID}"
  echo "   Repositório criado: ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REPO}"
else
  echo "   Repositório já existe."
fi

# 4. Store secrets
echo ""
echo "🔐 Configurando secrets..."
for SECRET in NVIDIA_API_KEY AUTH_SECRET STRIPE_SECRET_KEY STRIPE_WEBHOOK_SECRET DATABASE_URL; do
  VALUE="${!SECRET:-}"
  if [ -n "${VALUE}" ]; then
    echo "${VALUE}" | gcloud secrets create "${SECRET,,}" \
      --data-file=- --project="${PROJECT_ID}" 2>/dev/null || \
    echo "${VALUE}" | gcloud secrets versions add "${SECRET,,}" \
      --data-file=- --project="${PROJECT_ID}" 2>/dev/null
    echo "   Secret ${SECRET} configurado."
  else
    echo "   ⚠️  ${SECRET} não definido no ambiente. Configure manualmente:"
    echo "      gcloud secrets create ${SECRET,,} --data-file=<(echo 'SEU_VALOR')"
  fi
done

# 5. Deploy to Cloud Run
echo ""
echo "🚀 Deployando no Cloud Run..."
gcloud builds submit \
  --config cloudbuild.yaml \
  --project="${PROJECT_ID}" \
  --substitutions="_REGION=${REGION},_REPO=${ARTIFACT_REPO}" \
  .

# 6. Print service URL
echo ""
echo "✅ Deploy concluído!"
echo ""
gcloud run services describe "${SERVICE_NAME}" \
  --region="${REGION}" \
  --project="${PROJECT_ID}" \
  --format="value(status.url)" 2>/dev/null && \
echo "" || echo "   Verifique o console: https://console.cloud.google.com/run"
