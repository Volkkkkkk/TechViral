# Backlog — Ajouts Asox (ICE)

| ID | Zone       | Problème                                 | Solution                                                                 | Impact | Conf. | Effort | ICE | Sprint |
|----|------------|-------------------------------------------|-------------------------------------------------------------------------|--------|-------|--------|-----|--------|
| AX-01 | Global  | CDN Tailwind dev en prod                  | Passer en build prod minifié + purge CSS ; sinon CDN prod minifié       | 8      | 8     | 3      | 6.3 | S1     |
| AX-02 | Global  | FOUT / polices non préchargées           | Preload WOFF2 + font-display:swap ; réduire variantes                   | 7      | 9     | 2      | 6.0 | S1     |
| AX-03 | Home    | LCP image non dimensionnée               | width/height + ratio ; WebP + sizes/srcset                               | 8      | 8     | 3      | 6.3 | S1     |
| AX-04 | Produit | Pas de schema Product                    | JSON-LD Product + offers/brand/sku                                       | 8      | 7     | 3      | 6.0 | S1     |
| AX-05 | Global  | JS bloquant non critique                 | defer/module + suppression libs inutiles                                 | 7      | 7     | 3      | 5.7 | S1     |
| AX-06 | Global  | OG/Twitter Cards manquants               | Ajouter tags OG/Twitter côté head                                        | 6      | 8     | 2      | 5.3 | S2     |
| AX-07 | Catég.  | Canonical et pagination                   | rel=canonical + rel=prev/next si pagination                              | 6      | 7     | 2      | 5.0 | S2     |
| AX-08 | Global  | Accessibilité (contrastes/focus)         | Palette ajustée, outlines focus visibles                                 | 6      | 7     | 3      | 5.3 | S2     |
