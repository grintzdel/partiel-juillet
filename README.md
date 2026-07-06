# EventHub EEMI — API REST

Mini API REST de gestion d'événements pour l'école EEMI.
Stack : **Node.js + Express + MongoDB (Mongoose)**, authentification **JWT**, mots de passe hashés avec **bcrypt**, validation via **express-validator**.

Cette API sert de contrat technique pour le sujet Vue.js associé.

## Prérequis

- Node.js 18+
- Une instance MongoDB accessible (locale ou distante)

## Installation

```bash
npm install
```

## Variables d'environnement

Copier `.env.example` vers `.env` puis adapter les valeurs :

```bash
cp .env.example .env
```

| Variable         | Description                                      | Exemple                                  |
| ---------------- | ------------------------------------------------ | ---------------------------------------- |
| `PORT`           | Port d'écoute du serveur HTTP                     | `3000`                                   |
| `MONGODB_URI`    | URI de connexion MongoDB                          | `mongodb://127.0.0.1:27017/eventhub`     |
| `JWT_SECRET`     | Secret de signature des tokens JWT                | `une-chaine-longue-et-aleatoire`         |
| `JWT_EXPIRES_IN` | Durée de validité des tokens                      | `7d`                                     |

> `.env` contient des secrets et ne doit **jamais** être commité. Seul `.env.example` (sans identifiants réels) est versionné.

## Lancement

```bash
# production
npm start

# développement (rechargement auto)
npm run dev
```

Le serveur démarre sur `http://localhost:3000`. Un endpoint de santé est disponible : `GET /health`.

## Tests

Les tests (Jest + Supertest) utilisent une base MongoDB en mémoire (`mongodb-memory-server`) — aucune base réelle n'est requise.

```bash
npm test
```

Couvre au minimum : un `GET /api/events` valide (200) et un `POST /api/events` invalide (400).

## Structure du projet

```
.
├── app.js                      # Construction de l'app Express (exportée pour les tests)
├── server.js                   # Point d'entrée : connexion DB + démarrage serveur
├── config/
│   └── db.js                   # Connexion / déconnexion Mongoose
├── models/
│   ├── Event.model.js          # Schéma Event (+ timestamps)
│   └── User.model.js           # Schéma User (passwordHash jamais exposé)
├── controllers/
│   ├── auth.controller.js
│   └── event.controller.js
├── routes/
│   ├── auth.routes.js
│   └── event.routes.js
├── middlewares/
│   ├── auth.middleware.js      # Protection JWT
│   ├── logger.middleware.js    # Log des requêtes
│   ├── error.middleware.js     # 404 + gestion centralisée des erreurs
│   └── validate.middleware.js  # Collecte des erreurs express-validator
├── validators/
│   ├── auth.validator.js
│   └── event.validator.js
└── tests/
    └── events.test.js
```

## Modèle de données

### Event

| Champ         | Type     | Contraintes                                                       |
| ------------- | -------- | ---------------------------------------------------------------- |
| `title`       | String   | requis, min 3 caractères                                          |
| `description` | String   | requis, min 10 caractères                                         |
| `date`        | Date     | requis (ISO 8601)                                                 |
| `location`    | String   | requis                                                            |
| `category`    | String   | requis, parmi `cours`, `atelier`, `conference`, `networking`     |
| `capacity`    | Number   | optionnel, défaut `30`                                            |
| `createdAt`   | Date     | auto (timestamps Mongoose)                                        |
| `updatedAt`   | Date     | auto (timestamps Mongoose)                                        |

### User

| Champ          | Type   | Contraintes                          |
| -------------- | ------ | ------------------------------------ |
| `name`         | String | requis                               |
| `email`        | String | requis, unique                       |
| `passwordHash` | String | requis, **jamais renvoyé en réponse**|

## Routes

| Méthode  | Route                  | Protégée | Description                                           |
| -------- | ---------------------- | -------- | ----------------------------------------------------- |
| `POST`   | `/api/auth/register`   | non      | Crée un utilisateur, retourne l'utilisateur + token   |
| `POST`   | `/api/auth/login`      | non      | Vérifie les identifiants, retourne un token JWT       |
| `GET`    | `/api/events`          | non      | Liste les événements (`?category=`, `?q=`)            |
| `GET`    | `/api/events/:id`      | non      | Récupère un événement par id                          |
| `POST`   | `/api/events`          | **oui**  | Crée un événement                                     |
| `DELETE` | `/api/events/:id`      | **oui**  | Supprime un événement                                 |

Les routes protégées attendent un header `Authorization: Bearer <token>`.

### Codes HTTP

`200` OK · `201` Créé · `400` Données invalides · `401` Non authentifié · `404` Introuvable · `409` Conflit (email/doublon) · `500` Erreur serveur.

## Exemples de requêtes

### Inscription

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@eemi.com","password":"secret123"}'
```

```json
{
  "user": { "_id": "…", "name": "Alice", "email": "alice@eemi.com", "createdAt": "…", "updatedAt": "…" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"
}
```

### Connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@eemi.com","password":"secret123"}'
```

### Lister les événements (avec filtres)

```bash
curl "http://localhost:3000/api/events"
curl "http://localhost:3000/api/events?category=atelier"
curl "http://localhost:3000/api/events?q=vue"
```

### Récupérer un événement

```bash
curl http://localhost:3000/api/events/<id>
```

### Créer un événement (protégé)

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Atelier Vue",
    "description": "Un atelier pratique sur Vue.js",
    "date": "2026-01-12",
    "location": "EEMI",
    "category": "atelier",
    "capacity": 30
  }'
```

```json
{
  "_id": "…",
  "title": "Atelier Vue",
  "description": "Un atelier pratique sur Vue.js",
  "date": "2026-01-12T00:00:00.000Z",
  "location": "EEMI",
  "category": "atelier",
  "capacity": 30,
  "createdAt": "…",
  "updatedAt": "…"
}
```

### Supprimer un événement (protégé)

```bash
curl -X DELETE http://localhost:3000/api/events/<id> \
  -H "Authorization: Bearer <token>"
```
