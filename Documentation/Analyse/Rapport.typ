#import "@preview/bubble:0.2.2": *

#set par(justify: true, leading: 0.55em)
#set figure(numbering: "1")
#set text(hyphenate: false, size: 9.5pt)
#set heading(numbering: "1.")
#show link: it => underline(text(fill: rgb("#a152b7"), it))
#show figure: it => {
  set align(center)
  it
  v(0.2em)
}

#show: bubble.with(
  title: "Rapport",
  subtitle: "Management avancé des SI",
  author: "TERRIEN Swan, TOURAINE Melyna, COUSIN Gautier, MAANLI Naël",
  affiliation: "IUT de Nantes",
  date: datetime.today().display(),
  year: "2026",
  class: "Informatique",
  other: none,
  logo: image("../Android/Assets/Logo/normalNoirSansFond.png"),
  color-words: (),
  main-color: "#a152b7",
)

#set page(margin: (top: 1cm, bottom: 1cm, left: 1cm, right: 1cm))

#outline(title: "Sommaire", indent: 1.5em)

#pagebreak()

= Contexte et acteurs

*Contexte* — Dans le cadre de la SAE du semestre 4, l'objectif est de concevoir une application orientée micro-services, connectée à des sources OpenData. Une application mobile était prévue au départ ; elle est conservée dans ce rapport comme acteur cible afin de formaliser les processus métier.  

*Acteurs* :
- *Utilisateur* : Utilise l'application pour trouver des infos sur lignes cyclables et parkings
- *API/Proxy* : Interface communiquant avec les données et les sources OpenData
- *Application mobile* : Interface utilisateur
- *API source* : Fournit les données via OpenData Nantes Métropole

= Fonctionnalités et technologies

*Fonctionnalités prioritaires* : 
- Affichage stations Bicloo
- Affichage parkings P+R
- Affichage cartes
- Affichage lignes cyclables

*Fonctionnalités secondaires* : 
- Horaires
- Tutoriels
*Fonctionnalités tertiaires* : 
- Alertes travaux
- Itinéraires

= Explication BPMN

Nous avons produit un BPMN par fonctionnalité pour clarifier les enchainements entre utilisateur, application mobile, proxy et API sources. Ce choix évite un schéma global trop chargé et rend chaque parcours plus lisible. Le périmètre actuel cible principalement les usages vélo, tout en conservant une architecture extensible vers d'autres modes de transport.

#pagebreak()

= Processus métier

== Affichage station Bicloo

#figure(
  image("./Assets/png/StationBicloo.svg", width: 92%),
  caption: [Affichage information stations Bicloo],
)

Ce processus démarre quand l'utilisateur ouvre l'application puis accède à la page des stations Bicloo. L'application mobile envoie la requête au proxy et se met en attente. Le proxy transmet la demande à un micro-service de données, qui interroge en parallèle l'API source et la base de données, attend les retours, puis traite et renvoie un résultat au proxy. Le proxy renvoie ensuite les données à l'application ; une passerelle vérifie la réception des données: en cas de succès les informations sont affichées, sinon une erreur est présentée.


== Affichage parking P+R

#figure(
  image("./Assets/png/AffichageParking.svg", width: 92%),
  caption: [Affichage informations parkings P+R],
)

Le scénario commence par l'ouverture de l'application puis l'accès à la page des parkings P+R. L'application envoie la demande au proxy et attend la réponse. Le proxy délègue la récupération au micro-service de données, qui envoie des requêtes à l'API source et à la base de données, attend les réponses, traite les informations, puis renvoie les données consolidées au proxy. Le proxy transmet enfin les données à l'application, qui affiche les informations si elles sont reçues, sinon affiche une erreur.


== Affichage carte Nantes, carte vélo, carte touristique

#figure(
  image("./Assets/png/carte.svg", width: 92%),
  caption: [Consultation cartes],
)

L'utilisateur ouvre la carte et choisit les données à afficher. Le BPMN modélise trois demandes envoyées en parallèle par l'application (lignes cyclables, parkings vélo, carte touristique), puis une synchronisation avant l'envoi d'une requête globale au proxy. Le proxy relaie cette requête vers les sources (API et base de données), attend une réponse, puis vérifie sa validité: si la réponse est exploitable, il traite les données et les renvoie ; sinon, il renvoie une erreur. L'application affiche ensuite les données sur la carte ou un message d'erreur selon le résultat reçu.

== Affichage des lignes cyclables

#figure(
  image("./Assets/png/pisteCiclable.svg", width: 92%),
  caption: [Affichage des lignes cyclables],
)

Le processus commence lorsque l'utilisateur ouvre l'application puis accède à la page des pistes cyclables. L'application envoie une requête au proxy et attend la réponse. Le proxy consulte un micro-service de données qui interroge les sources, attend les retours, traite les données puis les renvoie au proxy. Le proxy retransmet le résultat à l'application, qui vérifie la présence des données: si elles sont disponibles, elles sont affichées ; sinon, une erreur est affichée.

== Accès horaires parking ou autres

#figure(
  image("./Assets/png/Horaires.svg", width: 92%),
  caption: [Affichage horaires],
)

L'utilisateur ouvre la page des horaires puis lance une recherche (parking, station vélo, etc.). L'application envoie la requête au proxy et passe en attente. Le proxy demande les données d'horaires à la base de données, se met en attente, puis reçoit la réponse. Une décision est ensuite prise: si des données sont disponibles, le proxy les traite et les renvoie à l'application ; sinon, il renvoie une erreur. Côté application, les horaires sont affichés en cas de succès, sinon un message d'erreur apparaît.

== Accès tutoriel utilisation Bicloo

#figure(
  image("./Assets/png/tutorial.svg", width: 92%),
  caption: [Affichage tutoriel Bicloo],
)

L'utilisateur ouvre l'application puis accède à la page du tutoriel. L'application affiche directement le tutoriel d'utilisation et termine le processus, sans échange avec un proxy ni appel à une API externe.

== Consultation alertes travaux

#figure(
  image("./Assets/png/AlerteTravaux.svg", width: 92%),
  caption: [Affichage alertes travaux],
)

Le scénario démarre quand l'utilisateur ouvre l'application puis accède à la page des alertes travaux. L'application envoie la requête au proxy et attend. Le proxy transmet la demande à un micro-service de données, qui interroge l'API source, attend le retour, traite les informations puis les renvoie au proxy. Le proxy renvoie ensuite les données à l'application, qui affiche les alertes si des données sont reçues, sinon affiche une erreur.

== Consultation itinéraire

#figure(
  image("./Assets/png/itinéraire.svg", width: 92%),
  caption: [Affichage itinéraire vélo],
)

L'utilisateur ouvre la page des itinéraires, saisit une adresse de départ, une adresse d'arrivée, puis lance la recherche. L'application envoie une requête de calcul au proxy et se met en attente. Le proxy récupère d'abord les données nécessaires, sollicite l'API source, attend la réponse, puis vérifie sa validité: si la réponse est correcte, il calcule l'itinéraire, l'envoie à l'application et celle-ci l'affiche sur la carte ; sinon, le proxy renvoie une erreur et l'application affiche un message d'échec.


