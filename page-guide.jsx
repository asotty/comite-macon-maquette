// ============================================================
// PAGE GUIDE — Composant d'aide contextuelle pour la maquette
// Bouton flottant + drawer de présentation par route
// ============================================================

const PAGE_GUIDES = {

  // ── PORTAIL ADMIN ─────────────────────────────────────────

  'dashboard': {
    title: 'Tableau de bord',
    subtitle: 'Vue globale de l\'édition en cours',
    icon: 'PieChart',
    what: 'Page d\'accueil de l\'administration. Elle centralise les indicateurs de performance des deux concours (France et Monde) : inscriptions, validations, paiements, échantillons. Permet une prise en main rapide de l\'état de l\'édition.',
    elements: [
      { label: 'KPI cards', desc: 'Chiffres en temps réel — nombre d\'inscrits, validés, payés, échantillons reçus, pour chaque concours.' },
      { label: 'Dossiers à traiter', desc: 'File d\'attente des dossiers nécessitant une action (contrôle, validation, dérogation).' },
      { label: 'Prochaines échéances', desc: 'Calendrier des jalons clés de l\'édition — clôture inscriptions, dégustation, publication palmarès.' },
      { label: 'Activité récente', desc: 'Journal des dernières actions (inscriptions reçues, paiements, validations).' },
    ],
  },

  'fr-inscriptions': {
    title: 'Inscriptions Concours France',
    subtitle: 'Gestion centralisée des dossiers producteurs',
    icon: 'FileText',
    what: 'Liste exhaustive des dossiers d\'inscription. Chaque ligne représente un producteur avec ses échantillons soumis. Permet de filtrer par statut, rechercher un producteur, et accéder au détail d\'un dossier.',
    elements: [
      { label: 'Onglets de statut', desc: 'Filtrage rapide par état — Brouillon (en cours de saisie), Soumis (en attente contrôle), Validé, Payé, Att. virement, Att. chèque, À contrôler (anomalie détectée), Rejeté.' },
      { label: 'Barre de recherche & filtres', desc: 'Recherche par nom, n° dossier, région ou appellation.' },
      { label: 'Actions groupées', desc: 'Sélection multiple pour relances email, exports CSV, ou lancement du contrôle automatique.' },
      { label: 'Colonne Statut', desc: 'Badge coloré indiquant l\'état précis du dossier — à mettre à jour manuellement pour virements et chèques.' },
    ],
    steps: [
      { label: 'Soumission', desc: 'Producteur soumet son dossier → statut "Soumis"' },
      { label: 'Contrôle', desc: 'Admin lance le contrôle automatique → statut "À contrôler" ou "Validé"' },
      { label: 'Paiement', desc: 'Producteur paie (carte, virement ou chèque) → statut "Payé" ou "Att. virement/chèque"' },
      { label: 'Confirmation', desc: 'Admin confirme paiement virement/chèque → statut "Payé"' },
    ],
  },

  'monde-inscriptions': {
    title: 'Inscriptions Concours Monde',
    subtitle: 'Gestion centralisée des dossiers producteurs',
    icon: 'FileText',
    what: 'Liste exhaustive des dossiers d\'inscription pour le Concours International. Chaque ligne représente un producteur avec ses échantillons soumis. Permet de filtrer par statut, rechercher un producteur, et accéder au détail d\'un dossier.',
    elements: [
      { label: 'Onglets de statut', desc: 'Filtrage rapide par état — Brouillon (en cours de saisie), Soumis (en attente contrôle), Validé, Payé, Att. virement, Att. chèque, À contrôler (anomalie détectée), Rejeté.' },
      { label: 'Barre de recherche & filtres', desc: 'Recherche par nom, n° dossier, région ou appellation.' },
      { label: 'Actions groupées', desc: 'Sélection multiple pour relances email, exports CSV, ou lancement du contrôle automatique.' },
      { label: 'Colonne Statut', desc: 'Badge coloré indiquant l\'état précis du dossier — à mettre à jour manuellement pour virements et chèques.' },
    ],
    steps: [
      { label: 'Soumission', desc: 'Producteur soumet son dossier → statut "Soumis"' },
      { label: 'Contrôle', desc: 'Admin lance le contrôle automatique → statut "À contrôler" ou "Validé"' },
      { label: 'Paiement', desc: 'Producteur paie (carte, virement ou chèque) → statut "Payé" ou "Att. virement/chèque"' },
      { label: 'Confirmation', desc: 'Admin confirme paiement virement/chèque → statut "Payé"' },
    ],
  },

  'inscriptions-fr': {
    title: 'Inscriptions Concours France',
    subtitle: 'Gestion centralisée des dossiers producteurs',
    icon: 'FileText',
    what: 'Liste exhaustive des dossiers d\'inscription. Chaque ligne représente un producteur avec ses échantillons soumis. Permet de filtrer par statut, rechercher un producteur, et accéder au détail d\'un dossier.',
    elements: [
      { label: 'Onglets de statut', desc: 'Filtrage rapide par état — Brouillon, Soumis, Validé, Payé, Att. virement, Att. chèque, À contrôler, Rejeté.' },
      { label: 'Barre de recherche & filtres', desc: 'Recherche par nom, n° dossier, région ou appellation.' },
      { label: 'Actions groupées', desc: 'Sélection multiple pour relances email, exports CSV, ou contrôle automatique.' },
      { label: 'Colonne Statut', desc: 'Badge coloré indiquant l\'état précis du dossier.' },
    ],
    steps: [
      { label: 'Soumission', desc: 'Producteur soumet son dossier → statut "Soumis"' },
      { label: 'Contrôle', desc: 'Admin lance le contrôle automatique → statut "À contrôler" ou "Validé"' },
      { label: 'Paiement', desc: 'Producteur paie → statut "Payé" ou "Att. virement/chèque"' },
      { label: 'Confirmation', desc: 'Admin confirme paiement virement/chèque → statut "Payé"' },
    ],
  },

  'fr-dossier': {
    title: 'Dossier producteur',
    subtitle: 'Détail complet d\'une inscription',
    icon: 'Folder',
    what: 'Vue détaillée d\'un dossier. Regroupe tous les éléments nécessaires à la validation : échantillons soumis, documents fournis (DREV, analyses), résultats du contrôle automatique, historique des actions.',
    elements: [
      { label: 'Onglet Échantillons', desc: 'Liste des vins soumis avec statut de contrôle (OK, À vérifier, Anomalie) par échantillon.' },
      { label: 'Onglet Documents', desc: 'PDFs et fichiers uploadés par le producteur (DREV, bulletins d\'analyse).' },
      { label: 'Onglet Contrôle', desc: 'Résultats de la vérification automatique — scoring de fiabilité, anomalies détectées.' },
      { label: 'Onglet Paiement', desc: 'Statut du règlement, méthode choisie (carte/virement/chèque), bouton pour confirmer réception virement ou chèque.' },
      { label: 'Onglet Historique', desc: 'Journal chronologique de toutes les actions sur ce dossier.' },
      { label: 'Sidebar', desc: 'Récapitulatif producteur, contact inscription, contact marketing, SIRET, état du dossier.' },
    ],
  },

  'fr-controle': {
    title: 'Contrôle optimisé',
    subtitle: 'Vérification automatique des dossiers',
    icon: 'ShieldCheck',
    what: 'Interface centrale du contrôle qualité. Le système croise les données déclarées par les producteurs avec les documents officiels (DREV, analyses) via OCR et parsing automatique. L\'admin valide, corrige ou rejette les résultats.',
    elements: [
      { label: 'Score de fiabilité', desc: 'Note 0-100 % indiquant la cohérence entre données déclarées et données extraites des documents.' },
      { label: 'Statuts d\'échantillon', desc: 'Validé automatiquement, À contrôler manuellement, Rejeté (incohérence majeure).' },
      { label: 'Vue comparaison', desc: 'Données déclarées vs données extraites côte à côte pour faciliter la vérification humaine.' },
      { label: 'Actions groupées', desc: 'Validation ou rejet en masse des échantillons conformes.' },
    ],
  },

  'monde-controle': {
    title: 'Contrôle optimisé — Monde',
    subtitle: 'Vérification automatique des dossiers',
    icon: 'ShieldCheck',
    what: 'Interface centrale du contrôle qualité pour le Concours Monde. Le système croise les données déclarées avec les documents officiels via OCR et parsing automatique. L\'admin valide, corrige ou rejette les résultats.',
    elements: [
      { label: 'Score de fiabilité', desc: 'Note 0-100 % indiquant la cohérence entre données déclarées et données extraites.' },
      { label: 'Statuts d\'échantillon', desc: 'Validé automatiquement, À contrôler manuellement, Rejeté (incohérence majeure).' },
      { label: 'Vue comparaison', desc: 'Données déclarées vs données extraites côte à côte.' },
      { label: 'Actions groupées', desc: 'Validation ou rejet en masse des échantillons conformes.' },
    ],
  },

  'fr-palmares': {
    title: 'Résultats & Palmarès',
    subtitle: 'Publication des résultats de dégustation',
    icon: 'Trophy',
    what: 'Gestion de la publication du palmarès. Affiche les résultats des sessions de dégustation et permet leur publication sur le site WordPress via l\'API REST.',
    elements: [
      { label: 'Résultats par médaille', desc: 'Or, Argent, Bronze — répartis par appellation et région.' },
      { label: 'Statut publication', desc: 'Brouillon, En attente, Publié — contrôle de visibilité sur le site public.' },
      { label: 'Export', desc: 'Export CSV/Excel du palmarès complet pour archives et presse.' },
      { label: 'Envoi API', desc: 'Synchronisation automatique avec le site WordPress du Comité.' },
    ],
  },

  'palmares': {
    title: 'Résultats & Palmarès',
    subtitle: 'Publication des résultats de dégustation',
    icon: 'Trophy',
    what: 'Gestion de la publication du palmarès. Affiche les résultats des sessions de dégustation et permet leur publication sur le site WordPress via l\'API REST.',
    elements: [
      { label: 'Résultats par médaille', desc: 'Or, Argent, Bronze — répartis par appellation et région.' },
      { label: 'Statut publication', desc: 'Brouillon, En attente, Publié — contrôle de visibilité sur le site public.' },
      { label: 'Export', desc: 'Export CSV/Excel du palmarès complet pour archives et presse.' },
      { label: 'Envoi API', desc: 'Synchronisation automatique avec le site WordPress du Comité.' },
    ],
  },

  'monde-palmares': {
    title: 'Résultats & Palmarès — Monde',
    subtitle: 'Publication des résultats de dégustation',
    icon: 'Trophy',
    what: 'Gestion de la publication du palmarès du Concours International. Affiche les résultats des sessions de dégustation et permet leur publication sur le site WordPress via l\'API REST.',
    elements: [
      { label: 'Résultats par médaille', desc: 'Or, Argent, Bronze — répartis par appellation et pays d\'origine.' },
      { label: 'Statut publication', desc: 'Brouillon, En attente, Publié — contrôle de visibilité sur le site public.' },
      { label: 'Export', desc: 'Export CSV/Excel du palmarès complet pour archives et presse internationale.' },
      { label: 'Envoi API', desc: 'Synchronisation automatique avec le site WordPress du Comité.' },
    ],
  },

  'fr-derogations': {
    title: 'Dérogations',
    subtitle: 'Traitement des demandes exceptionnelles',
    icon: 'AlertCircle',
    what: 'Les producteurs peuvent soumettre des demandes de dérogation (hors délai, modification d\'un échantillon, cas particulier). Cette interface permet à l\'admin d\'instruire ces demandes : accepter, refuser, ou demander des pièces complémentaires.',
    elements: [
      { label: 'Motifs de dérogation', desc: 'Retard de soumission, erreur de saisie, cas force majeure, modification post-soumission.' },
      { label: 'Pièces jointes', desc: 'Documents justificatifs transmis par le producteur.' },
      { label: 'Décision', desc: 'Acceptation (avec modification du dossier) ou refus (avec motif envoyé par email).' },
    ],
  },

  'monde-derogations': {
    title: 'Dérogations — Monde',
    subtitle: 'Traitement des demandes exceptionnelles',
    icon: 'AlertCircle',
    what: 'Demandes de dérogation pour le Concours International. Cette interface permet à l\'admin d\'instruire ces demandes : accepter, refuser, ou demander des pièces complémentaires.',
    elements: [
      { label: 'Motifs de dérogation', desc: 'Retard de soumission, erreur de saisie, cas force majeure, modification post-soumission.' },
      { label: 'Pièces jointes', desc: 'Documents justificatifs transmis par le producteur.' },
      { label: 'Décision', desc: 'Acceptation (avec modification du dossier) ou refus (avec motif envoyé par email).' },
    ],
  },

  'commandes': {
    title: 'Commandes de médailles',
    subtitle: 'Gestion des commandes producteurs',
    icon: 'Package',
    what: 'Les producteurs médaillés peuvent commander leurs médailles physiques depuis leur espace. Cette page centralise toutes les commandes, leur état de fabrication et d\'expédition.',
    elements: [
      { label: 'Commandes en cours', desc: 'Statut fabrication — En attente, Transmis fournisseur, En fabrication, Expédié, Livré.' },
      { label: 'Quantités et références', desc: 'Nombre de médailles par type (Or, Argent, Bronze) et par cuvée.' },
      { label: 'Transmission fournisseur', desc: 'Regroupement des commandes pour envoi au fabricant de médailles.' },
    ],
  },

  'cmd-liste': {
    title: 'Commandes de médailles',
    subtitle: 'Gestion des commandes producteurs',
    icon: 'Package',
    what: 'Les producteurs médaillés peuvent commander leurs médailles physiques depuis leur espace. Cette page centralise toutes les commandes, leur état de fabrication et d\'expédition.',
    elements: [
      { label: 'Commandes en cours', desc: 'Statut fabrication — En attente, Transmis fournisseur, En fabrication, Expédié, Livré.' },
      { label: 'Quantités et références', desc: 'Nombre de médailles par type (Or, Argent, Bronze) et par cuvée.' },
      { label: 'Transmission fournisseur', desc: 'Regroupement des commandes pour envoi au fabricant de médailles.' },
    ],
  },

  'param-concours': {
    title: 'Configuration concours',
    subtitle: 'Paramètres généraux de l\'édition',
    icon: 'Settings',
    what: 'Paramétrage de l\'édition annuelle — dates clés, tarifs par échantillon, tranches dégressives, règles de contrôle. Ces données sont utilisées par l\'ensemble de l\'application.',
    elements: [
      { label: 'Dates de l\'édition', desc: 'Ouverture et clôture des inscriptions, semaine de dégustation, publication palmarès.' },
      { label: 'Tarification', desc: 'Prix HT par échantillon (ex. 60 €) et tranches dégressives (remises à partir de 6, 11 échantillons...).' },
      { label: 'Prix repas', desc: 'Tarif dégustateur (38 €) et accompagnateur (28 €) pour les repas de jury.' },
    ],
  },

  'parametres': {
    title: 'Configuration concours',
    subtitle: 'Paramètres généraux de l\'édition',
    icon: 'Settings',
    what: 'Paramétrage de l\'édition annuelle — dates clés, tarifs par échantillon, tranches dégressives, règles de contrôle. Ces données sont utilisées par l\'ensemble de l\'application.',
    elements: [
      { label: 'Dates de l\'édition', desc: 'Ouverture et clôture des inscriptions, semaine de dégustation, publication palmarès.' },
      { label: 'Tarification', desc: 'Prix HT par échantillon (ex. 60 €) et tranches dégressives.' },
      { label: 'Prix repas', desc: 'Tarif dégustateur et accompagnateur pour les repas de jury.' },
    ],
  },

  'param-paiements': {
    title: 'Configuration paiements',
    subtitle: 'Coordonnées bancaires affichées aux producteurs',
    icon: 'CreditCard',
    what: 'Définit les informations bancaires et postales qui seront affichées aux producteurs ayant choisi de payer par virement ou par chèque lors de leur confirmation d\'inscription.',
    elements: [
      { label: 'Virement bancaire', desc: 'IBAN, BIC, titulaire du compte, banque et délai accordé. Ces données s\'affichent sur la page de confirmation virement du producteur.' },
      { label: 'Paiement par chèque', desc: 'Libellé "à l\'ordre de", adresse postale d\'envoi et délai. Affiché sur la page de confirmation chèque.' },
    ],
  },

  'deg-repas': {
    title: 'Repas dégustateurs',
    subtitle: 'Organisation des repas de jury',
    icon: 'Users',
    what: 'Gestion des repas organisés à l\'occasion des concours. Vue admin des réservations, des régimes alimentaires et des places disponibles.',
    elements: [
      { label: 'Capacité & Complet', desc: 'Nombre de places disponibles par repas. Quand une session affiche "Complet", les dégustateurs ne peuvent plus réserver.' },
      { label: 'Régimes alimentaires', desc: 'Synthèse des restrictions (végétarien, sans gluten, sans porc...) pour la cuisine.' },
      { label: 'Accompagnateurs', desc: 'Décompte des accompagnateurs réservés (28 €/personne) vs dégustateurs.' },
    ],
  },

  // ── PORTAIL PRODUCTEUR ────────────────────────────────────

  'p-dashboard': {
    title: 'Mon espace',
    subtitle: 'Tableau de bord producteur',
    icon: 'Wine',
    what: 'Page d\'accueil du producteur. Résumé de ses inscriptions en cours, médailles obtenues, dérogations actives et prochaines échéances du concours.',
    elements: [
      { label: 'Alerte paiement', desc: 'Si un dossier est en attente de paiement virement ou chèque, une bannière d\'alerte s\'affiche avec lien direct.' },
      { label: 'KPI inscriptions', desc: 'Nombre de dossiers en cours et leur statut (validé, brouillon...).' },
      { label: 'Médailles 2025', desc: 'Résumé des médailles obtenues à l\'édition précédente avec lien vers la commande.' },
      { label: 'Actions rapides', desc: 'Accès direct — Nouvelle inscription, Commander des médailles, Faire une demande de dérogation.' },
    ],
  },

  'p-inscription': {
    title: 'Inscription au concours',
    subtitle: 'Dépôt d\'un nouveau dossier en 4 étapes',
    icon: 'FileText',
    what: 'Parcours d\'inscription guidé en 4 étapes. Le producteur renseigne ses informations, soumet ses vins, fournit les documents requis, puis valide et paie. La sauvegarde automatique évite toute perte de données.',
    elements: [
      { label: 'Étape 1 — Mes infos', desc: 'Raison sociale, SIRET, CVI (Code Viti-Identificateur, 11 chiffres), adresse, contacts inscription et communication.' },
      { label: 'Étape 2 — Mes vins', desc: 'Ajout des cuvées à soumettre — appellation, millésime, cépage, volume, degré. 60 €/échantillon.' },
      { label: 'Étape 3 — Documents', desc: 'Upload des documents officiels requis (DREV, bulletins d\'analyse) par cuvée.' },
      { label: 'Étape 4 — Paiement', desc: 'Choix de la méthode : Carte bancaire (Paybox, immédiat), Virement bancaire (10 j.), Chèque (envoi postal).' },
    ],
    steps: [
      { label: 'Infos domaine', desc: 'Remplir les informations du domaine (dont CVI obligatoire)' },
      { label: 'Cuvées', desc: 'Ajouter ses cuvées une par une' },
      { label: 'Documents', desc: 'Uploader DREV et bulletins d\'analyse' },
      { label: 'Paiement', desc: 'Choisir méthode de paiement et soumettre' },
    ],
  },

  'p-medailles': {
    title: 'Mes médailles',
    subtitle: 'Résultats et commande de médailles physiques',
    icon: 'Trophy',
    what: 'Affiche les résultats du producteur (médailles obtenues par cuvée) et permet de commander les médailles physiques pour affichage ou promotion.',
    elements: [
      { label: 'Résultats par cuvée', desc: 'Liste des vins médaillés avec type de médaille (Or, Argent, Bronze).' },
      { label: 'Commander', desc: 'Formulaire de commande de médailles — quantité par type, calcul automatique du montant.' },
      { label: 'Livraison', desc: 'Suivi de l\'expédition une fois la commande transmise au fournisseur.' },
    ],
  },

  'p-compte': {
    title: 'Mon compte',
    subtitle: 'Informations du domaine et préférences',
    icon: 'Settings',
    what: 'Gestion des informations du domaine viticole et des préférences de contact. Le CVI est visible mais non modifiable (attribué par FranceAgriMer).',
    elements: [
      { label: 'Identité du domaine', desc: 'Raison sociale, SIRET, CVI, adresse, code APE, TVA intracommunautaire.' },
      { label: 'Contacts', desc: 'Contact inscription (personne physique) et contact communication (marketing).' },
      { label: 'Facturation', desc: 'Coordonnées de facturation si différentes du domaine.' },
      { label: 'Mot de passe', desc: 'Modification du mot de passe via lien envoyé par email.' },
    ],
  },

  'p-compte-infos': {
    title: 'Mon compte',
    subtitle: 'Informations du domaine et préférences',
    icon: 'Settings',
    what: 'Gestion des informations du domaine viticole et des préférences de contact. Le CVI est visible mais non modifiable (attribué par FranceAgriMer).',
    elements: [
      { label: 'Identité du domaine', desc: 'Raison sociale, SIRET, CVI, adresse, code APE, TVA intracommunautaire.' },
      { label: 'Contacts', desc: 'Contact inscription (personne physique) et contact communication (marketing).' },
      { label: 'Facturation', desc: 'Coordonnées de facturation si différentes du domaine.' },
      { label: 'Mot de passe', desc: 'Modification du mot de passe via lien envoyé par email.' },
    ],
  },

  // ── PORTAIL DÉGUSTATEUR ───────────────────────────────────

  'd-dashboard': {
    title: 'Mon espace dégustateur',
    subtitle: 'Tableau de bord personnel',
    icon: 'Users',
    what: 'Page d\'accueil du dégustateur. Résumé de ses prochaines sessions de dégustation, repas réservés, formations à venir et état de ses disponibilités déclarées.',
    elements: [
      { label: 'Prochaines sessions', desc: 'Sessions auxquelles le dégustateur est convoqué — jury, table, horaire.' },
      { label: 'Repas réservés', desc: 'Confirmations de réservation des repas de jury.' },
      { label: 'Formations à venir', desc: 'Sessions de formation organisées par le Comité (en ligne ou présentiel).' },
      { label: 'Mes disponibilités', desc: 'Indicateur du nombre de créneaux déclarés vs créneaux proposés par le Comité.' },
    ],
  },

  'd-repas': {
    title: 'Repas',
    subtitle: 'Réservation des repas de jury',
    icon: 'Users',
    what: 'Liste des repas organisés à l\'occasion des concours. Le dégustateur peut réserver sa place et celle d\'accompagnateurs. Les places sont limitées — quand un repas affiche "Complet", la réservation n\'est plus possible.',
    elements: [
      { label: 'Statut places', desc: 'Places restantes affichées en temps réel. "Complet" désactive le bouton de réservation.' },
      { label: 'Accompagnateurs', desc: 'Possibilité d\'amener 1 à 3 accompagnateurs à 28 €/personne. La place du dégustateur est à 18 € (ou gratuite pour certains repas).' },
      { label: 'Régimes alimentaires', desc: 'Restriction alimentaire pré-remplie depuis le profil, modifiable à chaque repas.' },
      { label: 'Confirmation', desc: 'Récapitulatif avec breakdown du montant (dégustateur + accompagnateurs) et référence de paiement.' },
    ],
    steps: [
      { label: 'Réservation', desc: 'Cliquer "+ Réserver" sur un repas disponible' },
      { label: 'Accompagnateurs', desc: 'Choisir le nombre d\'accompagnateurs (0 à 3)' },
      { label: 'Régime', desc: 'Vérifier le régime alimentaire' },
      { label: 'Paiement', desc: 'Payer en ligne — confirmation immédiate' },
    ],
  },

  'd-repas-venir': {
    title: 'Repas',
    subtitle: 'Réservation des repas de jury',
    icon: 'Users',
    what: 'Liste des repas organisés à l\'occasion des concours. Le dégustateur peut réserver sa place et celle d\'accompagnateurs. Les places sont limitées — quand un repas affiche "Complet", la réservation n\'est plus possible.',
    elements: [
      { label: 'Statut places', desc: 'Places restantes affichées en temps réel. "Complet" désactive le bouton de réservation.' },
      { label: 'Accompagnateurs', desc: 'Possibilité d\'amener 1 à 3 accompagnateurs à 28 €/personne.' },
      { label: 'Régimes alimentaires', desc: 'Restriction alimentaire pré-remplie depuis le profil, modifiable à chaque repas.' },
      { label: 'Confirmation', desc: 'Récapitulatif avec breakdown du montant et référence de paiement.' },
    ],
    steps: [
      { label: 'Réservation', desc: 'Cliquer "+ Réserver" sur un repas disponible' },
      { label: 'Accompagnateurs', desc: 'Choisir le nombre d\'accompagnateurs (0 à 3)' },
      { label: 'Régime', desc: 'Vérifier le régime alimentaire' },
      { label: 'Paiement', desc: 'Payer en ligne — confirmation immédiate' },
    ],
  },

  'd-formations': {
    title: 'Formations',
    subtitle: 'Sessions de formation dégustateur',
    icon: 'FileText',
    what: 'Les dégustateurs peuvent suivre des formations organisées par le Comité pour maintenir leur niveau de qualification. Certaines sont obligatoires pour participer au jury.',
    elements: [
      { label: 'Formations à venir', desc: 'Sessions planifiées — date, format (en ligne / présentiel), durée.' },
      { label: 'Inscription', desc: 'S\'inscrire aux formations disponibles selon sa qualification et disponibilité.' },
      { label: 'Historique', desc: 'Formations passées et attestations.' },
    ],
  },

  'd-disponibilites': {
    title: 'Mes disponibilités',
    subtitle: 'Déclaration des créneaux de dégustation',
    icon: 'Settings',
    what: 'Le Comité propose plusieurs créneaux de dégustation. Le dégustateur déclare ses disponibilités pour que l\'équipe puisse composer les jurys. Plus de disponibilités = plus de chances d\'être convoqué.',
    elements: [
      { label: 'Créneaux proposés', desc: 'Liste des demi-journées disponibles pendant la semaine de dégustation.' },
      { label: 'Déclaration', desc: 'Cocher/décocher les créneaux selon ses disponibilités personnelles.' },
      { label: 'Quota', desc: 'Le Comité recommande de déclarer au minimum plusieurs créneaux pour être retenu.' },
    ],
  },

};

// ── Guides génériques par portail (fallback) ─────────────────

const PORTAL_FALLBACK_GUIDES = {
  admin: {
    title: 'Module administration',
    subtitle: 'Portail de gestion Comité Mâcon',
    icon: 'Settings',
    what: 'Cette section fait partie du portail d\'administration du Comité des Vins de Mâcon. Elle permet de gérer les opérations courantes liées aux concours, producteurs, dégustateurs et partenaires.',
    elements: [
      { label: 'Navigation', desc: 'Utilisez le menu latéral pour naviguer entre les différentes sections.' },
      { label: 'Portails', desc: 'Trois portails distincts : Admin, Producteur et Dégustateur — accessibles depuis l\'écran de connexion.' },
    ],
  },
  producteur: {
    title: 'Espace producteur',
    subtitle: 'Portail Comité des Vins de Mâcon',
    icon: 'Wine',
    what: 'Votre espace personnel en tant que producteur. Gérez vos inscriptions aux concours, consultez vos résultats et commandez vos médailles.',
    elements: [
      { label: 'Navigation', desc: 'Utilisez le menu latéral pour accéder à vos différentes sections.' },
      { label: 'Assistance', desc: 'En cas de difficulté, contactez le secrétariat du Comité.' },
    ],
  },
  degustateur: {
    title: 'Espace dégustateur',
    subtitle: 'Portail Comité des Vins de Mâcon',
    icon: 'Users',
    what: 'Votre espace personnel en tant que dégustateur. Gérez vos disponibilités, réservez vos repas et accédez à vos formations.',
    elements: [
      { label: 'Navigation', desc: 'Utilisez le menu latéral pour accéder à vos différentes sections.' },
      { label: 'Convocations', desc: 'Vos sessions de dégustation apparaissent sur le tableau de bord une fois les jurys composés.' },
    ],
  },
};

// ── Résolution de l'icône ────────────────────────────────────

function resolveIcon(name, size) {
  if (!name) return null;
  const IconComponent = Icon[name];
  if (!IconComponent) return React.createElement(Icon.FileText, { size: size || 18 });
  return React.createElement(IconComponent, { size: size || 18 });
}

// ── Composant principal ──────────────────────────────────────

const PageGuide = ({ portal, route }) => {
  const [open, setOpen] = React.useState(false);

  const guide = PAGE_GUIDES[route]
    || (portal && PORTAL_FALLBACK_GUIDES[portal])
    || null;

  if (!guide) return null;

  const headerIcon = resolveIcon(guide.icon, 20);

  return (
    <>
      <style>{`
        .page-guide-fab {
          position: fixed; top: 72px; right: 16px; z-index: 200;
          background: var(--burgundy-800); color: #fff;
          border: none; border-radius: 999px;
          padding: 10px 18px; font-size: 13px; font-weight: 600;
          display: flex; align-items: center; gap: 7px;
          cursor: pointer; box-shadow: 0 4px 20px rgba(83,20,66,0.35);
          font-family: inherit; transition: background .15s;
        }
        .page-guide-fab:hover { background: #3d0f2e; }
        .page-guide-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.25); z-index: 198;
        }
        .page-guide-drawer {
          position: fixed; top: 0; right: 0; height: 100vh; width: 420px;
          background: #fff; z-index: 199;
          box-shadow: -8px 0 40px rgba(15,23,42,0.12);
          display: flex; flex-direction: column;
          animation: guideSlideIn .22s ease-out;
        }
        @keyframes guideSlideIn {
          from { transform: translateX(420px); }
          to   { transform: translateX(0); }
        }
        .page-guide-header {
          padding: 24px 24px 18px; border-bottom: 1px solid var(--border);
          display: flex; align-items: flex-start; gap: 14px;
        }
        .page-guide-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: var(--burgundy-50); color: var(--burgundy-800);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .page-guide-header-text { flex: 1; min-width: 0; }
        .page-guide-header-title {
          font-size: 15px; font-weight: 700; color: var(--fg); margin: 0 0 3px;
          line-height: 1.3;
        }
        .page-guide-header-sub {
          font-size: 12.5px; color: var(--fg-subtle); margin: 0;
        }
        .page-guide-close {
          background: none; border: none; cursor: pointer;
          color: var(--fg-subtle); padding: 4px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: background .12s, color .12s;
        }
        .page-guide-close:hover { background: var(--surface); color: var(--fg); }
        .page-guide-body {
          flex: 1; overflow-y: auto; padding: 20px 24px;
          display: flex; flex-direction: column; gap: 22px;
        }
        .page-guide-section { }
        .page-guide-section-title {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: .07em; color: var(--fg-subtle); margin-bottom: 10px;
        }
        .page-guide-what {
          font-size: 13.5px; line-height: 1.65; color: var(--fg);
          margin: 0;
        }
        .page-guide-item {
          display: flex; gap: 10px; margin-bottom: 10px;
        }
        .page-guide-item:last-child { margin-bottom: 0; }
        .page-guide-item-dot {
          width: 7px; height: 7px; border-radius: 50%; background: var(--burgundy-800);
          flex-shrink: 0; margin-top: 5px;
        }
        .page-guide-item-text { font-size: 13px; line-height: 1.55; color: var(--fg); }
        .page-guide-item-label { font-weight: 600; }
        .page-guide-item-desc { color: var(--fg-subtle); }
        .page-guide-step {
          display: flex; gap: 12px; margin-bottom: 12px; align-items: flex-start;
        }
        .page-guide-step:last-child { margin-bottom: 0; }
        .page-guide-step-num {
          width: 22px; height: 22px; border-radius: 50%;
          background: var(--burgundy-800); color: #fff;
          font-size: 11px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .page-guide-step-text { font-size: 13px; line-height: 1.55; color: var(--fg); }
        .page-guide-step-label { font-weight: 600; }
        .page-guide-step-desc { color: var(--fg-subtle); }
        .page-guide-footer {
          padding: 16px 24px; border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .page-guide-footer-link {
          font-size: 12.5px; color: var(--burgundy-800); text-decoration: none;
          font-weight: 500; display: flex; align-items: center; gap: 5px;
        }
        .page-guide-footer-link:hover { text-decoration: underline; }
        .page-guide-footer-badge {
          font-size: 11px; color: var(--fg-subtle);
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 4px; padding: 2px 7px;
        }
      `}</style>

      {!open && (
        <button className="page-guide-fab" onClick={() => setOpen(true)}>
          {React.createElement(Icon.Sparkles, { size: 15 })}
          Guide
        </button>
      )}

      {open && (
        <>
          <div className="page-guide-overlay" onClick={() => setOpen(false)} />
          <div className="page-guide-drawer">

            {/* Header */}
            <div className="page-guide-header">
              <div className="page-guide-icon">
                {headerIcon}
              </div>
              <div className="page-guide-header-text">
                <p className="page-guide-header-title">{guide.title}</p>
                <p className="page-guide-header-sub">{guide.subtitle}</p>
              </div>
              <button className="page-guide-close" onClick={() => setOpen(false)} title="Fermer">
                {React.createElement(Icon.X, { size: 18 })}
              </button>
            </div>

            {/* Body */}
            <div className="page-guide-body">

              {/* À quoi sert cette page ? */}
              {guide.what && (
                <div className="page-guide-section">
                  <p className="page-guide-section-title">À quoi sert cette page ?</p>
                  <p className="page-guide-what">{guide.what}</p>
                </div>
              )}

              {/* Éléments clés */}
              {guide.elements && guide.elements.length > 0 && (
                <div className="page-guide-section">
                  <p className="page-guide-section-title">Éléments clés</p>
                  {guide.elements.map((el, i) => (
                    <div key={i} className="page-guide-item">
                      <div className="page-guide-item-dot" />
                      <div className="page-guide-item-text">
                        <span className="page-guide-item-label">{el.label}</span>
                        {' — '}
                        <span className="page-guide-item-desc">{el.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Flux métier (optionnel) */}
              {guide.steps && guide.steps.length > 0 && (
                <div className="page-guide-section">
                  <p className="page-guide-section-title">Flux métier</p>
                  {guide.steps.map((step, i) => (
                    <div key={i} className="page-guide-step">
                      <div className="page-guide-step-num">{i + 1}</div>
                      <div className="page-guide-step-text">
                        <span className="page-guide-step-label">{step.label}</span>
                        {' — '}
                        <span className="page-guide-step-desc">{step.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="page-guide-footer">
              <a href="#" className="page-guide-footer-link" onClick={e => e.preventDefault()}>
                {React.createElement(Icon.ArrowRight, { size: 13 })}
                Voir la documentation complète
              </a>
              <span className="page-guide-footer-badge">Maquette</span>
            </div>

          </div>
        </>
      )}
    </>
  );
};

window.PageGuide = PageGuide;
