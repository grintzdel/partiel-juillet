# EventHub EEMI — Frontend Vue.js — Design

Date : 2026-07-06
Auteur : OUDIN Mathis (assisté)
Statut : validé (design) — spec à relire avant plan d'implémentation

## Objectif

Développer le frontend Vue 3 d'EventHub EEMI : consulter, rechercher/filtrer, afficher en
détail et créer des événements, en consommant l'API Express réelle du monorepo.

## Décisions structurantes

| Sujet | Choix | Raison |
|---|---|---|
| Auth POST/DELETE (JWT requis) | Pages login **et** register + store `auth` Pinia | La vraie API exige un Bearer pour créer/supprimer |
| Connexion API (pas de CORS backend) | Proxy Vite `/api` → `http://localhost:3000` | Aucune modification du backend, zéro CORS en dev |
| CSS | Tailwind CSS v4 (`@tailwindcss/vite`) | Responsive rapide, pas de fichier config |
| Langage | TypeScript partout | Cohérence avec le backend TS, rigueur |
| Mode données | **API Node.js réelle** (pas de mock) | Choix assumé, indiqué dans le README |

## Stack & intégration monorepo

- Vue 3 + Vite + TypeScript, Composition API `<script setup>`.
- Nouveau package `frontend/` ajouté à `pnpm-workspace.yaml` (`packages: [backend, frontend]`).
- Tailwind CSS v4 via `@tailwindcss/vite` — pas de `tailwind.config.js`, juste `@import "tailwindcss"` dans le CSS d'entrée.
- Proxy Vite : `server.proxy['/api'] = 'http://localhost:3000'`.
- `.env.example` : `VITE_API_URL` optionnel (défaut = chemin relatif `/api` via proxy).
- Scripts racine `package.json` : `dev:front`, `build:front` filtrant le package frontend.

## Arborescence

```
frontend/
├── index.html
├── vite.config.ts              # plugins vue + tailwind, proxy /api
├── tsconfig.json               # strict
├── package.json
├── .env.example
├── src/
│   ├── main.ts                 # createApp + pinia + router + import CSS
│   ├── App.vue                 # <Navbar/> + <RouterView/>
│   ├── style.css               # @import "tailwindcss" + variables/design tokens
│   ├── router/
│   │   └── index.ts            # routes + guard auth sur /create
│   ├── stores/
│   │   ├── events.ts           # events, loading, error + fetch/fetchById/create/delete
│   │   └── auth.ts             # user, token (localStorage), login/register/logout
│   ├── services/
│   │   └── api.ts              # wrapper fetch typé, injecte Bearer, parse erreurs
│   ├── types/
│   │   └── event.ts            # Event, EventCategory, CreateEventInput, ApiError
│   ├── constants/
│   │   └── categories.ts       # EVENT_CATEGORIES as const (miroir backend)
│   ├── components/
│   │   ├── Navbar.vue          # navigation + état connecté/déconnecté
│   │   ├── EventCard.vue       # props: event → emit: select
│   │   ├── EventForm.vue       # v-model champs → emit: submit
│   │   ├── SearchBar.vue       # v-model recherche + select catégorie → emit: update
│   │   └── base/
│   │       ├── BaseButton.vue  # slot par défaut (label), variants (primary/danger/ghost)
│   │       ├── BaseCard.vue    # slot par défaut (conteneur générique)
│   │       └── BaseBadge.vue   # badge catégorie coloré
│   └── views/
│       ├── DashboardView.vue   # /            liste + recherche + filtre
│       ├── EventDetailView.vue # /events/:id  détail + supprimer (si authentifié)
│       ├── CreateEventView.vue # /create      formulaire (guard auth)
│       ├── LoginView.vue       # /login
│       └── RegisterView.vue    # /register
```

Composants réutilisables : Navbar, EventCard, EventForm, SearchBar, BaseButton, BaseCard,
BaseBadge → 7 (≥5 requis).

## Types (types/event.ts)

```ts
export const EVENT_CATEGORIES = ['cours', 'atelier', 'conference', 'networking'] as const
export type EventCategory = (typeof EVENT_CATEGORIES)[number]

export interface EventItem {
  _id: string
  title: string
  description: string
  date: string        // ISO
  location: string
  category: EventCategory
  capacity: number
  createdAt: string
  updatedAt: string
}

export interface CreateEventInput {
  title: string
  description: string
  date: string
  location: string
  category: EventCategory
  capacity: number
}
```

## Stores Pinia

### stores/events.ts
- State : `{ events: EventItem[]; current: EventItem | null; loading: boolean; error: string | null }`.
- Actions :
  - `fetchEvents()` → GET `/api/events`, remplit `events`.
  - `fetchById(id)` → GET `/api/events/:id`, remplit `current`.
  - `createEvent(input)` → POST `/api/events` (Bearer), renvoie l'event créé.
  - `deleteEvent(id)` → DELETE `/api/events/:id` (Bearer).
- Chaque action gère `loading`/`error`.

### stores/auth.ts
- State : `{ user: { _id; name; email } | null; token: string | null }` — `token` initialisé depuis `localStorage`.
- Getter : `isAuthenticated`.
- Actions : `login(email, password)`, `register(name, email, password)` (POST `/api/auth/*`, stocke `{ user, token }` + persiste token), `logout()` (clear + localStorage).

## Service API (services/api.ts)

Wrapper `fetch` typé : construit l'URL (`VITE_API_URL` ou `/api`), ajoute
`Content-Type: application/json`, injecte `Authorization: Bearer <token>` depuis le store auth,
parse le JSON, et lève une erreur normalisée (`message` issu de `error`/`errors` du backend)
sur statut ≥ 400. Méthodes : `get`, `post`, `del`.

## Data flow & états UI

- **DashboardView** : `onMounted` → `fetchEvents()` (charge toute la liste). `search` et
  `category` sont des `ref` locaux ; **`computed filteredEvents`** filtre côté client par
  titre/description (search) et catégorie — c'est l'exigence pédagogique du sujet. Le `<select>`
  est peuplé par `EVENT_CATEGORIES`.
  - `v-if` : `loading` → spinner ; `error` → message + bouton réessayer ; liste filtrée vide →
    « Aucun événement » ; sinon `v-for` de `EventCard`.
  - `EventCard` `@select` → `router.push('/events/' + id)`.
- **EventDetailView** : `fetchById(route.params.id)`. Affiche les champs formatés (date FR,
  badge catégorie, capacité). Bouton **Supprimer** rendu seulement si `auth.isAuthenticated` →
  `@click` → `deleteEvent` → `router.push('/')`.
- **CreateEventView** : `EventForm` en `v-model` (title, description, date, location, category,
  capacity) → `@submit` → `createEvent` → redirect `/`. Validation front miroir backend
  (title ≥ 3, description ≥ 10, date requise, catégorie ∈ 4, capacity ≥ 1). Guard : accès sans
  token → redirect `/login`.
- **LoginView / RegisterView** : formulaires → `auth.login` / `auth.register` → redirect `/`.
  Erreurs (401 identifiants, 409 email déjà pris) affichées inline.
- **Navbar** : liens Accueil / Créer ; si connecté → nom + Déconnexion ; sinon → Connexion / Inscription.

## Responsive (Tailwind)

- Mobile-first. Grille des cartes : 1 colonne (mobile) → 2 (`md`) → 3 (`lg`).
- Navbar : menu compact sur mobile. Formulaires pleine largeur ≤ `sm`, centrés/contraints au-delà.
- Cibles de captures d'écran : mobile (~375px), tablette (~768px), desktop (~1280px).

## Couverture des exigences du sujet

`v-model` (SearchBar + EventForm) · `v-for` (liste) · `v-if` (loading/vide/erreur) ·
`@click` (card select, delete, boutons) · `props` (EventCard) · `emits` (select, submit, update) ·
`slot` (BaseButton, BaseCard) · Pinia (events + auth) · `computed` (filteredEvents) ·
responsive Tailwind · consommation API réelle · README complet.

## Hors scope (YAGNI)

- Pas de mock JSON (mode réel assumé).
- Pas de pagination, pas d'édition (l'API n'expose pas de PUT).
- Pas de tests automatisés (non exigés ; vérification manuelle + captures pour le rendu).
- Partie théorique : traitée par l'auteur, hors périmètre de ce frontend.

## README (livrable) — contenu prévu

Installation, lancement (backend + Docker Mongo + frontend), structure du projet, **mode utilisé
(API Node.js réelle via proxy Vite)**, et emplacements des captures d'écran desktop/tablette/mobile.

## Risques / points d'attention

- Le backend n'a pas de CORS → dépendance au proxy Vite en dev. En cas de déploiement séparé
  (Vercel/Netlify), prévoir soit un ajout `cors` backend, soit un rewrite proxy côté hébergeur
  (noté dans le README, non implémenté ici).
- Les catégories doivent rester synchronisées avec le backend (`cours/atelier/conference/networking`).
