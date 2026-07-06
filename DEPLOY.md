# Déploiement — EventHub EEMI (Coolify)

Deux applications séparées à déployer, plus un MongoDB déjà en place.

- **backend** → `backend/docker-compose.yml`
- **frontend** → `frontend/docker-compose.yml`
- **MongoDB** → déjà hébergé sur ton Coolify (fournir la connexion via `MONGODB_URI`)

> Les deux Dockerfiles utilisent la **racine du monorepo** comme contexte de build
> (`context: ..`). Dans Coolify, laisse le *Base Directory* à la racine du repo et
> pointe chaque application vers son fichier compose respectif.

---

## 1. Backend

**Type d'app Coolify :** Docker Compose → fichier `backend/docker-compose.yml`.

**Variables d'environnement à définir dans Coolify :**

| Variable            | Exemple                                             | Notes                                              |
| ------------------- | --------------------------------------------------- | -------------------------------------------------- |
| `MONGODB_URI`       | `mongodb://user:pass@mongo:27017/eventhub`          | Connexion vers ton Mongo Coolify (URL interne OK)  |
| `JWT_SECRET`        | `une-chaine-longue-et-aleatoire`                    | **Obligatoire**, secret de signature JWT           |
| `JWT_EXPIRES_IN`    | `7d`                                                | Optionnel (défaut `7d`)                            |
| `CORS_ORIGIN`       | `https://eventhub.mondomaine.fr`                    | Domaine public du frontend (plusieurs = virgules)  |

- Port applicatif exposé : **3000** (à renseigner comme port dans Coolify).
- Healthcheck intégré sur `GET /health`.

### MongoDB : URL interne vs publique

Si le Mongo Coolify et le backend sont sur le **même projet/réseau Coolify**, utilise
le hostname interne du service Mongo dans `MONGODB_URI`. Sinon, expose Mongo et utilise
son URL publique.

---

## 2. Migrations + seed

Après le premier déploiement du backend, lancer une fois la sync des index + le seed.

**Option A — via la ligne de commande (VPS / local) :**

```bash
docker compose -f backend/docker-compose.yml --profile tools run --rm migrate
```

**Option B — via Coolify** (« Execute Command » sur le conteneur backend) :

```bash
pnpm db:sync && pnpm seed
```

Le seed est **idempotent** pour l'utilisateur (upsert) et réinitialise les événements
d'exemple à chaque exécution.

**Compte de test créé :**

- Email : `test@eventhub.dev`
- Mot de passe : `Password123!`

Surchargeables via les variables `SEED_USER_EMAIL` / `SEED_USER_PASSWORD`.

---

## 3. Frontend

**Type d'app Coolify :** Docker Compose → fichier `frontend/docker-compose.yml`.

**Variable de BUILD à définir (Build Arg / env de build) :**

| Variable        | Exemple                                    | Notes                                                  |
| --------------- | ------------------------------------------ | ------------------------------------------------------ |
| `VITE_API_URL`  | `https://api.eventhub.mondomaine.fr/api`   | URL **publique** du backend, **figée au build** (`/api` inclus) |

> ⚠️ `VITE_API_URL` est inlinée par Vite **au moment du build**. Si tu changes l'URL
> du backend, il faut **rebuild** le frontend (redeploy dans Coolify).

- Port applicatif exposé : **80** (Caddy sert le statique dans le conteneur).

---

## Ordre de déploiement recommandé

1. Vérifier que MongoDB est joignable.
2. Déployer le **backend** (définir `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`).
3. Lancer **migrations + seed** (section 2).
4. Déployer le **frontend** avec `VITE_API_URL` = URL publique du backend + `/api`.
5. Vérifier `CORS_ORIGIN` (backend) = domaine du frontend, puis tester le login avec
   le compte de test.
