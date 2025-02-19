### **Présentation du Projet**

Ce projet illustre une intégration complète entre la blockchain et une interface web moderne, permettant de créer des applications décentralisées robustes et conviviales. 

L’application permet aux utilisateurs de créer et gérer des campagnes de financement, avec des niveaux de contribution (funding tiers) personnalisables. Les fonctionnalités clés incluent :

- **Création de campagnes on-chain** : Les utilisateurs peuvent lancer des campagnes avec un nom, une description, un objectif de financement et une durée.  
- **Gestion des contributions** : Les contributeurs sélectionnent un niveau de contribution prédéfini, et le système gère automatiquement l’état de la campagne (Active, Successful, Failed).  
- **Actions de gestion** : Le propriétaire de la campagne peut mettre en pause, prolonger la deadline, retirer les fonds ou rembourser les contributeurs si la campagne échoue.
- **Feedback dynamique** : Un système global de notifications informe l’utilisateur des résultats des transactions (succès, erreur, informations).

---

### **Technologies Utilisées**

- **Next.js**  
  Next.js est le framework choisi pour construire l’interface utilisateur côté client et côté serveur, offrant un rendu performant, du routage dynamique et des fonctionnalités avancées telles que l’hydratation côté client et la génération statique.

- **thirdweb**  
  Thirdweb permet d’interagir facilement avec des smart contracts déployés sur la blockchain. Il offre des hooks et des composants préconçus pour réaliser des appels de contrat, gérer les transactions on-chain et déployer des contrats sans trop de complexité.

- **Solidity**  
  Les contrats intelligents (smart contracts) du projet sont écrits en Solidity. Ils gèrent la logique de financement, la gestion des tiers de contribution, le suivi des contributions, les retraits et remboursements, et la gestion de l’état de la campagne.

- **Tailwind CSS**  
  Tailwind CSS est utilisé pour la mise en page et le design de l’application. Il permet de créer une interface moderne, responsive et facilement personnalisable grâce à ses classes utilitaires.

- **React**  
  La bibliothèque React est utilisée pour construire les composants interactifs de l’application. Elle gère l’état local (par exemple, le mode édition, l’affichage de feedbacks) et permet de créer une expérience utilisateur fluide.
