#!/usr/bin/env bash
# ============================================================
# Margyn — Azure App Service Deployment Script
# ============================================================
# Prerequisites:
#   - Azure CLI installed: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli
#   - Logged in: az login
#   - zip installed (brew install zip / apt install zip)
#
# Usage:
#   chmod +x deploy-azure.sh
#   ./deploy-azure.sh
#
# To override defaults, set env vars before running:
#   APP_NAME=my-margyn REGION=uksouth ./deploy-azure.sh
# ============================================================

set -euo pipefail

# ── Colours ───────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

info()    { echo -e "${CYAN}ℹ  $*${RESET}"; }
success() { echo -e "${GREEN}✓  $*${RESET}"; }
warn()    { echo -e "${YELLOW}⚠  $*${RESET}"; }
error()   { echo -e "${RED}✗  $*${RESET}"; exit 1; }
header()  { echo -e "\n${BOLD}${CYAN}── $* ──────────────────────────────${RESET}"; }

# ── Configuration (override via env vars) ─────────────────
APP_NAME="${APP_NAME:-margyn-$(openssl rand -hex 3)}"   # unique app name
RESOURCE_GROUP="${RESOURCE_GROUP:-margyn-rg}"
REGION="${REGION:-eastus}"                               # az account list-locations -o table
APP_SERVICE_PLAN="${APP_SERVICE_PLAN:-margyn-plan}"
SKU="${SKU:-B1}"                                         # F1=free(no custom domain), B1=basic, B2, S1, P1v3
NODE_VERSION="${NODE_VERSION:-18-lts}"
SESSION_SECRET="${SESSION_SECRET:-$(openssl rand -hex 32)}"

# ── Banner ─────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${CYAN}"
echo "  ███╗   ███╗ █████╗ ██████╗  ██████╗██╗   ██╗███╗   ██╗"
echo "  ████╗ ████║██╔══██╗██╔══██╗██╔════╝╚██╗ ██╔╝████╗  ██║"
echo "  ██╔████╔██║███████║██████╔╝██║  ███╗ ╚████╔╝ ██╔██╗ ██║"
echo "  ██║╚██╔╝██║██╔══██║██╔══██╗██║   ██║  ╚██╔╝  ██║╚██╗██║"
echo "  ██║ ╚═╝ ██║██║  ██║██║  ██║╚██████╔╝   ██║   ██║ ╚████║"
echo "  ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═══╝"
echo -e "${RESET}"
echo -e "${BOLD}  Azure App Service Deployment${RESET}"
echo ""

# ── Preflight checks ───────────────────────────────────────
header "Preflight"

if ! command -v az &>/dev/null; then
  error "Azure CLI not found. Install from: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli"
fi
success "Azure CLI found: $(az version --query '"azure-cli"' -o tsv)"

if ! command -v zip &>/dev/null; then
  error "'zip' not found. Install with: brew install zip  OR  apt install zip"
fi

# Check login
ACCOUNT=$(az account show --query "{name:name, id:id, user:user.name}" -o json 2>/dev/null || true)
if [ -z "$ACCOUNT" ]; then
  warn "Not logged in to Azure. Running 'az login'…"
  az login
  ACCOUNT=$(az account show --query "{name:name, id:id, user:user.name}" -o json)
fi

SUBSCRIPTION_NAME=$(echo "$ACCOUNT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['name'])" 2>/dev/null || echo "unknown")
SUBSCRIPTION_ID=$(echo "$ACCOUNT"   | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['id'])"   2>/dev/null || echo "unknown")
USER_NAME=$(echo "$ACCOUNT"         | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['user'])" 2>/dev/null || echo "unknown")

success "Logged in as: ${USER_NAME}"
success "Subscription: ${SUBSCRIPTION_NAME} (${SUBSCRIPTION_ID})"

# ── Confirm plan ───────────────────────────────────────────
header "Deployment Plan"
echo -e "  App Name        : ${BOLD}${APP_NAME}${RESET}"
echo -e "  Resource Group  : ${BOLD}${RESOURCE_GROUP}${RESET}"
echo -e "  Region          : ${BOLD}${REGION}${RESET}"
echo -e "  App Service Plan: ${BOLD}${APP_SERVICE_PLAN}${RESET} (SKU: ${SKU})"
echo -e "  Node Version    : ${BOLD}${NODE_VERSION}${RESET}"
echo -e "  Subscription    : ${BOLD}${SUBSCRIPTION_NAME}${RESET}"
echo ""
read -r -p "  Proceed? [y/N] " CONFIRM
[[ "$CONFIRM" =~ ^[Yy]$ ]] || { warn "Aborted."; exit 0; }

# ── Build deployment package ───────────────────────────────
header "Building Deployment Package"

DEPLOY_ZIP="margyn-deploy.zip"

# Ensure we're in the right directory
if [ ! -f "app.js" ]; then
  error "app.js not found. Run this script from the Margyn project root."
fi

info "Zipping project (excluding node_modules, .git, .env)…"
zip -r "$DEPLOY_ZIP" . \
  --exclude "*.git*" \
  --exclude "node_modules/*" \
  --exclude ".env" \
  --exclude "*.env.local" \
  --exclude "$DEPLOY_ZIP" \
  --exclude "deploy-azure.sh" \
  -q

success "Package created: ${DEPLOY_ZIP} ($(du -sh "$DEPLOY_ZIP" | cut -f1))"

# ── Resource Group ─────────────────────────────────────────
header "Resource Group"

if az group show --name "$RESOURCE_GROUP" &>/dev/null; then
  warn "Resource group '${RESOURCE_GROUP}' already exists — reusing."
else
  info "Creating resource group '${RESOURCE_GROUP}' in ${REGION}…"
  az group create \
    --name "$RESOURCE_GROUP" \
    --location "$REGION" \
    --output none
  success "Resource group created."
fi

# ── App Service Plan ───────────────────────────────────────
header "App Service Plan"

if az appservice plan show --name "$APP_SERVICE_PLAN" --resource-group "$RESOURCE_GROUP" &>/dev/null; then
  warn "App Service Plan '${APP_SERVICE_PLAN}' already exists — reusing."
else
  info "Creating App Service Plan '${APP_SERVICE_PLAN}' (${SKU})…"
  az appservice plan create \
    --name "$APP_SERVICE_PLAN" \
    --resource-group "$RESOURCE_GROUP" \
    --sku "$SKU" \
    --is-linux \
    --output none
  success "App Service Plan created."
fi

# ── Web App ────────────────────────────────────────────────
header "Web App"

if az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" &>/dev/null; then
  warn "Web App '${APP_NAME}' already exists — updating."
else
  info "Creating Web App '${APP_NAME}'…"
  az webapp create \
    --name "$APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --plan "$APP_SERVICE_PLAN" \
    --runtime "NODE:${NODE_VERSION}" \
    --output none
  success "Web App created."
fi

# ── App Settings (environment variables) ──────────────────
header "App Settings"

info "Configuring environment variables…"
az webapp config appsettings set \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --settings \
    NODE_ENV="production" \
    PORT="8080" \
    SESSION_SECRET="$SESSION_SECRET" \
    JOB_CONCURRENCY="3" \
    SCRAPER_DEFAULT_DELAY_MS="3000" \
    WEBSITE_NODE_DEFAULT_VERSION="~18" \
    SCM_DO_BUILD_DURING_DEPLOYMENT="true" \
  --output none

# Set the startup command
az webapp config set \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --startup-file "node app.js" \
  --output none

success "App settings configured."

# ── Optional: Add API keys from local .env ─────────────────
if [ -f ".env" ]; then
  info "Found local .env — syncing non-empty API keys to App Settings…"

  EXTRA_SETTINGS=()
  while IFS='=' read -r KEY VALUE; do
    # Skip comments, blanks, and already-set keys
    [[ "$KEY" =~ ^#.*$ || -z "$KEY" || -z "$VALUE" ]] && continue
    [[ "$KEY" =~ ^(NODE_ENV|PORT|SESSION_SECRET|JOB_CONCURRENCY|SCRAPER_DEFAULT_DELAY_MS)$ ]] && continue
    # Strip inline comments and quotes
    VALUE=$(echo "$VALUE" | sed 's/#.*//' | tr -d '"' | tr -d "'" | xargs)
    [ -z "$VALUE" ] && continue
    EXTRA_SETTINGS+=("${KEY}=${VALUE}")
  done < .env

  if [ ${#EXTRA_SETTINGS[@]} -gt 0 ]; then
    az webapp config appsettings set \
      --name "$APP_NAME" \
      --resource-group "$RESOURCE_GROUP" \
      --settings "${EXTRA_SETTINGS[@]}" \
      --output none
    success "Synced ${#EXTRA_SETTINGS[@]} additional key(s) from .env"
  else
    info "No additional keys to sync from .env."
  fi
fi

# ── Deploy ─────────────────────────────────────────────────
header "Deploying Code"

info "Uploading ${DEPLOY_ZIP} to Azure…"
az webapp deploy \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --src-path "$DEPLOY_ZIP" \
  --type zip \
  --output none

success "Code deployed."

# ── Cleanup local zip ──────────────────────────────────────
rm -f "$DEPLOY_ZIP"
info "Cleaned up local deploy zip."

# ── Health check ───────────────────────────────────────────
header "Health Check"

APP_URL="https://${APP_NAME}.azurewebsites.net"
info "Waiting for app to start (up to 90s)…"

for i in $(seq 1 18); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL" 2>/dev/null || echo "000")
  if [[ "$STATUS" == "200" || "$STATUS" == "302" || "$STATUS" == "301" ]]; then
    success "App is live! HTTP ${STATUS}"
    break
  fi
  echo -e "  ${YELLOW}Attempt ${i}/18 — HTTP ${STATUS} — retrying in 5s…${RESET}"
  sleep 5
done

# ── Summary ────────────────────────────────────────────────
header "Deployment Complete"
echo ""
echo -e "  ${BOLD}🚀 App URL:${RESET}        ${CYAN}${APP_URL}${RESET}"
echo -e "  ${BOLD}📊 Portal:${RESET}         ${CYAN}https://portal.azure.com/#resource/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Web/sites/${APP_NAME}${RESET}"
echo -e "  ${BOLD}📋 Log stream:${RESET}     az webapp log tail --name ${APP_NAME} --resource-group ${RESOURCE_GROUP}"
echo -e "  ${BOLD}🔑 Demo login:${RESET}     admin@margyn.io / password123"
echo -e "  ${BOLD}🔐 Session secret:${RESET} ${SESSION_SECRET}"
echo ""
warn "Save your SESSION_SECRET above — you'll need it if you redeploy or scale out."
echo ""
echo -e "${BOLD}Useful commands:${RESET}"
echo "  # Stream live logs"
echo "  az webapp log tail --name ${APP_NAME} --resource-group ${RESOURCE_GROUP}"
echo ""
echo "  # Redeploy after changes"
echo "  ./deploy-azure.sh"
echo ""
echo "  # Open in browser"
echo "  open ${APP_URL}   # macOS"
echo "  xdg-open ${APP_URL}  # Linux"
echo ""
echo "  # SSH into the container"
echo "  az webapp ssh --name ${APP_NAME} --resource-group ${RESOURCE_GROUP}"
echo ""
echo "  # Delete everything (tear down)"
echo "  az group delete --name ${RESOURCE_GROUP} --yes --no-wait"
echo ""