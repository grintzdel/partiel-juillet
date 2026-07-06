# EventHub EEMI — Frontend Vue.js

Interface web de gestion d'événements consommant l'API REST **EventHub EEMI**
(backend Express/MongoDB du même monorepo).

Stack : **Vue 3 + Vite + TypeScript**, Composition API `<script setup>`, **Pinia**
(state), **Vue Router**, **Tailwind CSS v4**.

## Mode utilisé : API Node.js réelle

Le frontend consomme l'**API Node.js réelle** (pas de mock JSON). Les appels partent
sur `/api/*` et sont redirigés vers le backend `http://localhost:3000` par le **proxy Vite**
(`vite.config.ts`) — cela évite tout problème de CORS en développement.

> Le backend protège `POST /api/events` et `DELETE /api/events/:id` par un token JWT.
> Le frontend gère donc l'authentification (pages **Connexion** / **Inscription**) : le token
> est stocké dans `localStorage` et injecté en `Authorization: Bearer` sur les requêtes protégées.

## Prérequis

- Node.js 18+ et pnpm
- Le backend EventHub lancé (voir `../backend/README.md`) + une instance MongoDB

## Installation

Depuis la racine du monorepo :

```bash
pnpm install
```

## Lancement

Il faut la base, le backend, puis le frontend. Dans trois terminaux (ou en arrière-plan) :

```bash
# 1. MongoDB (depuis la racine du repo)
docker compose up -d

# 2. Backend Express (port 3000)
pnpm dev            # alias de: pnpm --filter backend dev

# 3. Frontend Vue (port 5173)
pnpm dev:front      # alias de: pnpm --filter frontend dev
```

Application disponible sur **http://localhost:5173**.

Pour créer un événement, créez d'abord un compte via la page **Inscription**, puis rendez-vous
sur **Créer**.

### Variables d'environnement (optionnel)

Copier `.env.example` vers `.env`. Par défaut aucune variable n'est requise (le proxy Vite
gère la connexion). Pour pointer vers un backend distant sans proxy :

```bash
VITE_API_URL=https://mon-api.exemple.com/api
```

## Scripts

| Commande | Description |
| --- | --- |
| `pnpm dev:front` | Serveur de développement Vite |
| `pnpm build:front` | Type-check (`vue-tsc`) + build de production |
| `pnpm --filter frontend preview` | Prévisualise le build de production |
| `pnpm typecheck:front` | Vérification TypeScript seule |

## Structure du projet

```
frontend/src/
├── main.ts                 # bootstrap : Vue + Pinia + Router + CSS
├── App.vue                 # layout : Navbar + <RouterView/>
├── style.css               # Tailwind v4 + design tokens
├── router/index.ts         # routes + guard d'auth sur /create
├── stores/
│   ├── events.ts           # liste, détail, loading, error + actions CRUD
│   └── auth.ts             # user, token (localStorage), login/register/logout
├── services/api.ts         # wrapper fetch typé (Bearer + parsing d'erreurs)
├── types/event.ts          # types EventItem, CreateEventInput, Auth*
├── constants/categories.ts # catégories (miroir backend) + libellés/couleurs
├── utils/format.ts         # formatage de dates (fr-FR)
├── components/
│   ├── Navbar.vue          # navigation responsive + état connecté
│   ├── EventCard.vue       # props: event → emit: select
│   ├── EventForm.vue       # v-model + validation → emit: submit
│   ├── SearchBar.vue       # v-model recherche + filtre catégorie
│   └── base/
│       ├── BaseButton.vue  # bouton générique (slot)
│       ├── BaseCard.vue    # conteneur générique (slots)
│       └── BaseBadge.vue   # badge catégorie
└── views/
    ├── DashboardView.vue   # /            liste + recherche + filtre (computed)
    ├── EventDetailView.vue # /events/:id  détail + suppression (si connecté)
    ├── CreateEventView.vue # /create      formulaire (route protégée)
    ├── LoginView.vue       # /login
    └── RegisterView.vue    # /register
```

## Pages

| Route | Page | Description |
| --- | --- | --- |
| `/` | Dashboard | Liste des événements, recherche et filtre par catégorie |
| `/events/:id` | Détail | Informations d'un événement (+ suppression si connecté) |
| `/create` | Création | Formulaire de création (nécessite d'être connecté) |
| `/login` · `/register` | Auth | Connexion / inscription |

## Concepts Vue mis en œuvre

- **`v-model`** : recherche + filtre (`SearchBar`), champs du formulaire (`EventForm`).
- **`v-for`** : rendu de la liste d'événements.
- **`v-if` / `v-else-if`** : états *chargement* / *erreur* / *liste vide* / *liste*.
- **`@click`** : sélection d'une carte, suppression, boutons.
- **`props`** : `EventCard` reçoit l'événement à afficher.
- **`emits`** : `EventCard` (`select`), `EventForm` (`submit`), `SearchBar` (v-model).
- **`slot`** : `BaseButton` et `BaseCard` (composants génériques).
- **Pinia** : store `events` (liste/chargement/erreur) et store `auth`.
- **`computed`** : `filteredEvents` filtre par recherche et/ou catégorie côté client.

## Design responsive

Mobile-first (Tailwind). La grille des cartes passe de 1 colonne (mobile) à 2 (`md`) puis
3 (`lg`). La navigation propose un menu déroulant sur mobile.

## Captures d'écran

_À insérer dans le rendu :_

| Desktop (~1280px) | Tablette (~768px) | Mobile (~375px) |
| --- | --- | --- |
| _capture_ | _capture_ | _capture_ |
