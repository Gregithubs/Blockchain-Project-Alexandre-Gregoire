# NFT Marketplace
Ce projet a été réalisé par Douceron Alexandre et Pateyron Grégoire.

# Objectifs du projet
Ce marketplace de NFT vous permet de Mint et d'acheter des NFTs.
Vous pouvez donc ajouter des NFT à la plateforme qui elle-même est reliée à un smart contract.
Les achats se font à l'aide de metamask et de Goerli Tesnet.

La blockchain fait partie intégrante du projet, car les NFTs sont enregistrées dans les transactions d'un smart contract, ce qui fait qu'elles sont accessibles à tous moment, mais leur achat et leur déploiement se fait aussi de manière sécurisée. Ces NFTS s'achètent à l'aide de l'outil Metamask et utilise le réseau Goerli Testnet.

# Préparation permettant l'utilisation projet
## Cloner le projet

## Ouvrir et aller dans le dossier my-app et installer la bibliothèque npm
Accéder au dossier `cd my-app && npm install` 
Puis `npm install axios`

## To start the development server run 
Démarrer le serveur `npm run dev`
Ouvrir l'URL suivant : localhost:3000

# NB
La partie hardhat, nous a permis de créer un smart contract. Elle comprenant un token spécifique (permettant de réaliser les transactions), et elle nous a permis de le déployer sur le réseau Goerli Testnet. Elle n'est pas utilisée lorsque l'on veut tester le site.
Alors que la partie my-app, nous permet de créer et d'acheter des NFTs afin de les envoyer sur le smart contract.

# Utilisation du site
Se connecter à metamask et avec un compte Goerli
Puis appuyer sur le texte orange "Connecté la wallet" pour accéder au site.

Visiter le marketplace et effectuer des achats de NFT
Retrouver ses NFT dans la section "Mes NFTs"
Mint des NFT en les uploadant dans la section associée.

Pour vendre un NFT, il faut lui donner un nom, remplire une brève description et indiquer le prix en Ether.
Puis choisir le fichier à uploader (cela peut prendre quelques secondes, avant qu'il ne s'affiche entièrement).
Puis cliquer sur "Mint". Cela vous dirigera vers la page de confirmation de la transaction sur metamask.
Une fois la transaction validée, attendez quelques secondes, puis cliquez sur "List". Cela vous dirigera vers la page de confirmation de la transaction sur metamask (Possibilité de manque de token pour réeffectuer cette transaction). 
Une fois la transaction validée, le NFT est en vente sur le marketplace avec son prix affiché.

L'achat de NFT ne fonctionne uniquement qu'avec le premier bouton (NFT : Girlswim). Par manque de temps et après de nombreux tests, nous n'avons pas réussi à résoudre ce problème (tous les boutons sont reliés à la même fonction d'achat).


## Images en cas de problèmes de lecture
![Marketplace](https://user-images.githubusercontent.com/90263420/200898688-0ddf743a-dc69-4b01-a19f-aea3e5ea1152.png)
![mint](https://user-images.githubusercontent.com/90263420/200898734-008e8865-42dd-4ccb-abf5-47560a23d0ed.png)
![Mes NFT](https://user-images.githubusercontent.com/90263420/200898760-8ceab229-1d78-433b-a14c-5040cc4274c5.png)
