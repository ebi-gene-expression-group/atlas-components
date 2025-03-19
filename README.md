# Atlas Components

A collection of React components used in the front end of [Expression Atlas](https://www.ebi.ac.uk/gxa) and
[Single Cell Expression Atlas](https://www.ebi.ac.uk/gxa/sc).

This is a [Lerna](https://github.com/lerna/lerna)-managed monorepo. Read Lerna’s documentation for more details.


## clone the monorepo (including subtree)
We add [organ-anatomogram](https://github.com/ebi-gene-expression-group/organ-anatomogram) as a `git subtree`. 
You don’t need to run `git submodule update` when pulling the Lerna monorepo. 

Just pull as usual, and the subtree content will already be there:
```bash
git pull origin main
```

If you need to pull new changes from the original external repo or add more `subtree` repos into lerna monorepo, use:
```bash
git subtree pull --prefix=packages/<your-package-name> <repo-url> main --squash
```

If you make changes inside the subtree directory in your Lerna monorepo, 
those changes will not automatically update in the original external repository.

If you made changes inside the subtree directory, you need to push them back manually. 
Here’s how to push only the subtree changes back to the external repository:
```bash
git subtree push --prefix=packages/<your-package-name> <repo-url> main
```

We will deprecate [organ-anatomogram](https://github.com/ebi-gene-expression-group/organ-anatomogram) repo soon.
Deleting the original repository from GitHub will NOT delete the subtree directory in the Lerna monorepo.

🚨 What Happens If We Delete the Original Repo?

1️⃣ The subtree directory in the monorepo remains intact—it won’t be removed.
2️⃣ You won’t be able to pull new updates (`git subtree pull` will fail) because Git won’t find the remote repo.
3️⃣ You can still modify the subtree files inside your monorepo as usual.

## local setup

```bash
npm install
npx lerna bootstrap
```

In short, remember to run `npx lerna bootstrap` from the top level directory after you install or remove packages in
each `package.json` to ensure the dependencies have been correctly symlinked. We have noticed that sometimes NPM, as
usual, has some unexpected behaviour.

## working on several components

If you are working on several components, and would like to test your changes locally, you need
to pack you dependencies and install them manually.

For example, assuming B is a dependency of A:

```bash
cd packages/B
npm pack
cd ../A
npm install ../B/B*.tgz
npm test
```

## Publish new npm versions
```bash
npm login #if you are first time try to publish
lerna changed #Lists which packages will be published
lerna publish
```