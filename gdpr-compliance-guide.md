# 🔒 RGPD Compliance Guide - TechViral
## Version "Acier" - Conformité Enterprise

### ✅ VALIDATION BLOCAGE PRÉ-CONSENTEMENT

#### 1. INTÉGRATION SCRIPT BLOCAGE
```html
<!-- IMPORTANT: Intégrer EN PREMIER dans <head> -->
<script src="assets/js/gdpr-blocking.js"></script>

<!-- APRÈS le script de blocage -->
<script src="assets/js/gdpr-consent.js"></script>

<!-- NE PAS intégrer directement: -->
<!-- ❌ <script src="https://www.googletagmanager.com/gtm.js?id=GTM-XXX"></script> -->
<!-- ❌ <script src="https://www.googletagmanager.com/gtag/js?id=G-XXX"></script> -->
```

#### 2. CONFIGURATION IDs TRACKING
```javascript
// Dans gdpr-blocking.js
window._ga4Config = 'G-VOTRE-ID-GA4';
window._gtmId = 'GTM-VOTRE-ID';
window._fbPixelId = 'VOTRE-PIXEL-ID';
```

#### 3. TEST BLOCAGE MANUEL
```javascript
// Console navigateur AVANT consentement:
console.log(window.dataLayer); // Doit être [] vide
window.gtag('event', 'test'); // Doit afficher warning bloqué

// APRÈS consentement analytics:
window.enableGDPRTracking({analytics: true, marketing: false});
console.log(window.dataLayer); // Doit être fonctionnel
```

### ✅ VALIDATION BANNIÈRE CONSENTEMENT

#### 1. DÉTECTION EU AUTOMATIQUE
```javascript
// Vérifier dans gdpr-consent.js:
async detectRegion() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const euTimezones = ['Europe/Paris', 'Europe/Berlin', ...];
    this.isEU = euTimezones.some(tz => timezone.includes(tz.split('/')[1]));
}
```

#### 2. CATÉGORIES CONSENTEMENT GRANULAIRE
- ✅ **Nécessaires**: Toujours activés (session, sécurité)
- 🔄 **Fonctionnels**: Optionnels (préférences, panier)
- 📊 **Analytics**: Optionnels (GA4, GTM, performance)
- 📢 **Marketing**: Optionnels (Facebook Pixel, remarketing)

#### 3. STOCKAGE & EXPIRATION
- Consentement stocké: **localStorage**
- Durée validité: **6 mois maximum**
- Re-consent automatique après expiration

### ✅ VALIDATION COOKIES & TRACKING

#### 1. SUPPRESSION AUTOMATIQUE
```javascript
// Si consentement retiré:
deleteCookies(['_ga', '_gid', '_gat', '_gtm*', '_fbp', '_fbc']);
```

#### 2. CHARGEMENT CONDITIONNEL
```javascript
// Scripts chargés UNIQUEMENT après consentement:
if (consent.analytics) {
    loadGA4(gaId);
    loadGTM(gtmId);
}
if (consent.marketing) {
    loadFacebookPixel(fbId);
}
```

### 🧪 CHECKLIST VALIDATION GO-LIVE

#### Tests Critiques Pré-Déploiement:
- [ ] **GTM bloqué par défaut** (pas de requête gtm.js)
- [ ] **GA4 bloqué par défaut** (pas de requête gtag.js)  
- [ ] **Bannière s'affiche** (utilisateurs EU)
- [ ] **Consentement granulaire** (4 catégories)
- [ ] **Blocage effectif** (aucun tracking sans consent)
- [ ] **Déblocage fonctionnel** (tracking après consent)
- [ ] **Suppression cookies** (retrait consentement)
- [ ] **Stockage persistant** (consent survit refresh)

#### Outils de Test:
- **Network Tab**: Aucune requête tracking pré-consent
- **Console**: Warnings de blocage affichés
- **Application Tab**: Cookies analytics absents
- **GDPR Checker**: cookiebot.com/en/gdpr-checker

### 📋 CONFORMITÉ LÉGALE

#### Article 7 RGPD - Conditions du Consentement:
- ✅ **Libre**: Utilisateur peut refuser sans conséquence
- ✅ **Spécifique**: Granularité par finalité (analytics/marketing)
- ✅ **Éclairé**: Description claire de chaque catégorie
- ✅ **Univoque**: Action positive requise (pas pré-coché)

#### Article 21 RGPD - Droit d'Opposition:
- ✅ **Retrait facile**: Bouton paramètres accessible
- ✅ **Effet immédiat**: Arrêt tracking + suppression cookies
- ✅ **Conservation**: Durée 6 mois max puis re-consent

### 🔧 TROUBLESHOOTING

#### Problème: GTM se charge malgré blocage
- **Solution**: Vérifier ordre scripts (blocage EN PREMIER)
- **Test**: Network tab ne doit montrer aucune requête gtm.js

#### Problème: Bannière ne s'affiche pas
- **Solution**: Vérifier détection EU (forcer this.isEU = true)
- **Test**: Console doit afficher "GDPR banner créé"

#### Problème: Consentement ne persiste pas
- **Solution**: Vérifier localStorage autorisé
- **Test**: Application > Storage > Local Storage

### 🎯 ACTIONS POST-DÉPLOIEMENT

1. **Monitoring 48h**: Surveiller erreurs console
2. **Test multi-navigateurs**: Chrome, Firefox, Safari, Edge
3. **Validation externe**: cookiebot.com GDPR checker
4. **Documentation légale**: Mettre à jour politique cookies
5. **Formation équipe**: Procédures support utilisateur

---

**⚠️ ATTENTION**: Ce guide constitue une base technique. 
Consultez un juriste pour validation légale complète.