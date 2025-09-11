# Addendum d’Audit — Asox
Date : 10 septembre 2025

Ce complément consolide et durcit les priorités détectées dans l’audit initial.

## 1) Risques critiques supplémentaires
- **Tailwind en CDN mode dev en prod** → surcharge CSS, jank possible. Action : basculer vers build local minifié (PostCSS/Tailwind) OU CDN prod minifié ; activer purge.
- **Préchargement des polices absent** → FOUT/flash. Action : <link rel="preload" as="font" type="font/woff2" href="/fonts/Inter.woff2" crossorigin> + font-display:swap.
- **Images Hero non dimensionnées** → CLS ↑. Action : width/height explicites + ratio box CSS.
- **Manque d’OG/Twitter Cards** sur pages clés → prévisualisations sociales pauvres, CTR bas.
- **Schemas JSON-LD incomplets** (Product/Breadcrumb) sur fiches → perte de rich results.

## 2) Cibles mesurables
- LCP (Home, mobile 4G) **< 2,5s**
- CLS **< 0,1**
- INP **< 200 ms**
- Poids page Home initial **< 1,2 Mo**, requêtes **< 40**

## 3) Priorités S1 renforcées
1. Corriger liens brisés et canoniques
2. Meta titres/descriptions uniques
3. OG/Twitter complets
4. Dimensions + srcset/sizes + lazy sur images
5. Preload WOFF2 + swap
6. Nettoyage console + defer scripts non critiques
7. Schemas JSON‑LD (Product, Breadcrumb, Organization)

## 4) Contrôles QA étendus
- 0 erreur console, 0 404 interne
- OG image 1200×630, alt pertinents
- Navigation clavier et focus visibles
