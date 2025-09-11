# 🔍 Google Search Console - Instructions Setup
## TechViral - Configuration Production

### 1. VÉRIFICATION PROPRIÉTÉ
```
1. Aller sur: https://search.google.com/search-console
2. Ajouter une propriété: https://techviral.hostingersite.com
3. Méthode recommandée: Meta tag HTML
4. Copier le token de vérification
5. Ajouter dans <head> de index.html:
   <meta name="google-site-verification" content="YOUR_TOKEN">
```

### 2. SOUMISSION SITEMAP
```
1. Dans GSC > Sitemaps
2. Ajouter un sitemap: https://techviral.hostingersite.com/sitemap.xml
3. Vérifier statut: "Réussi"
4. Contrôler couverture: viser 24/24 pages indexées
```

### 3. VALIDATION ROBOTS.TXT
```
1. Dans GSC > robots.txt
2. Tester: https://techviral.hostingersite.com/robots.txt
3. Vérifier que sitemap est référencé
4. Confirmer exclusions appropriées
```

### 4. SURVEILLANCE INDEXATION
```
Pages prioritaires à surveiller:
- https://techviral.hostingersite.com/ (Homepage)
- https://techviral.hostingersite.com/iphone (Category)
- https://techviral.hostingersite.com/android (Category)
- https://techviral.hostingersite.com/gaming (Category)
- https://techviral.hostingersite.com/accessories (Category)

Objectif: 100% indexation dans 7-14 jours
```

### 5. MÉTRIQUES À SUIVRE
```
- Couverture: Pages indexées vs soumises
- Performance: Core Web Vitals
- Ergonomie mobile: Compatibilité mobile
- Liens: Liens internes/externes
- Requêtes: Mots-clés et CTR
```

### 6. ALERTES RECOMMANDÉES
```
- Erreurs d'indexation (404, 5xx)
- Problèmes ergonomie mobile
- Dégradation Core Web Vitals
- Nouveaux liens entrants
- Problèmes de sécurité
```