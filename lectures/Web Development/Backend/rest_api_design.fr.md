# Principes de Conception des API REST

## Introduction aux API REST

REST (Representational State Transfer) est un style d'architecture pour la conception d'applications en réseau. Les API RESTful utilisent des requêtes HTTP pour effectuer des opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) sur des ressources, qui sont représentées sous forme d'URL.

### Principes clés de REST

- **Architecture Client-Serveur** : Séparation des préoccupations entre client et serveur
- **Sans état** : Chaque requête du client au serveur doit contenir toutes les informations nécessaires pour comprendre et traiter la requête
- **Mise en cache** : Les réponses doivent se définir comme pouvant être mises en cache ou non
- **Système en couches** : Un client ne peut pas dire s'il est connecté directement au serveur final ou à un intermédiaire
- **Interface uniforme** : Une façon cohérente et standardisée de communiquer entre client et serveur

## Méthodes HTTP dans les API REST

Les API RESTful utilisent des méthodes HTTP standard pour effectuer des opérations sur des ressources :

| Méthode | Objectif | Exemple |
|--------|---------|---------|
| GET | Récupérer des données | GET /users (obtenir tous les utilisateurs) |
| POST | Créer des données | POST /users (créer un nouvel utilisateur) |
| PUT | Mettre à jour des données (mise à jour complète) | PUT /users/123 (mettre à jour l'utilisateur 123) |
| PATCH | Mettre à jour des données (mise à jour partielle) | PATCH /users/123 (mettre à jour une partie de l'utilisateur 123) |
| DELETE | Supprimer des données | DELETE /users/123 (supprimer l'utilisateur 123) |

## Nommage des ressources

Un bon nommage des ressources est crucial pour une API claire et intuitive :

- Utilisez des noms, pas des verbes (par exemple, `/users` et non `/getUsers`)
- Utilisez des noms pluriels pour les collections (par exemple, `/users` et non `/user`)
- Utilisez des relations hiérarchiques (par exemple, `/users/123/orders`)
- Utilisez des lettres minuscules et des traits d'union pour les ressources à plusieurs mots (par exemple, `/user-profiles`)

## Codes de statut HTTP

L'utilisation appropriée des codes de statut HTTP aide les clients à comprendre le résultat de leur requête :

```mermaid
graph TD
    A[Codes de statut HTTP] --> B[2xx: Succès]
    A --> C[3xx: Redirection]
    A --> D[4xx: Erreur client]
    A --> E[5xx: Erreur serveur]
    
    B --> B1[200: OK]
    B --> B2[201: Créé]
    B --> B3[204: Pas de contenu]
    
    C --> C1[301: Déplacé définitivement]
    C --> C2[304: Non modifié]
    
    D --> D1[400: Mauvaise requête]
    D --> D2[401: Non autorisé]
    D --> D3[403: Interdit]
    D --> D4[404: Non trouvé]
    D --> D5[422: Entité non traitable]
    
    E --> E1[500: Erreur interne du serveur]
    E --> E2[503: Service indisponible]
```

## Exemples de requête et de réponse

### Exemple de requête

```http
GET /api/users/123 HTTP/1.1
Host: example.com
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Exemple de réponse

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=3600

{
  "id": 123,
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "created_at": "2023-01-15T08:30:00Z"
}
```

## Versionnement

Le versionnement des API aide à gérer les changements sans casser les clients existants :

- Versionnement par chemin d'URL : `/api/v1/users`
- Paramètre de requête : `/api/users?version=1`
- En-tête personnalisé : `X-API-Version: 1`
- En-tête Accept : `Accept: application/vnd.example.v1+json`

## Authentification et autorisation

Méthodes d'authentification courantes pour les API REST :

- **Clés API** : Authentification simple basée sur une clé
- **OAuth 2.0** : Protocole standard de l'industrie pour l'autorisation
- **JWT (JSON Web Tokens)** : Jetons compacts et autonomes pour la transmission sécurisée d'informations
- **Authentification de base** : Nom d'utilisateur et mot de passe encodés en Base64

## Bonnes pratiques

1. **Utilisez HTTPS** : Sécurisez toujours votre API avec HTTPS
2. **Implémentez la limitation de débit** : Protégez votre API contre les abus
3. **Fournissez une documentation complète** : Utilisez des outils comme Swagger/OpenAPI
4. **Incluez la pagination** : Pour les grandes collections de ressources
5. **Supportez le filtrage, le tri et la recherche** : Pour une meilleure récupération des données
6. **Utilisez une gestion d'erreurs cohérente** : Standardisez les réponses d'erreur
7. **Incluez des liens HATEOAS** : Aidez les clients à naviguer dans l'API

## Conclusion

La conception d'une API RESTful nécessite une réflexion attentive sur le nommage des ressources, les méthodes HTTP, les codes de statut et d'autres principes. Une API bien conçue est intuitive, cohérente et facile à utiliser, ce qui améliore l'expérience des développeurs et l'adoption.

---

*Cette conférence fait partie de la série "Développement Backend".*