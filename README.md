![Gredor frontend](./assets/banner.png)

## Recommended IDE Setup

When using VS Code remember to install [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension.

## How to debug (VSCode)

### 1. Start Vite server

*Start development server*

```sh
npm start
```

```sh
npm run start:development
```

*Start production server*

```sh
npm run start:production
```

### 2. Start VSCode debugger

Press ```F5``` or use the ```Run and Debug``` menu.

## Environments

The ```.env.template``` file describes what environment variables that are available and/or required.

### ```.env``` loading priorities


>An env file for a specific mode (e.g. ```.env.production```) will take higher priority than a generic one (e.g. ```.env```)
>
>Vite will always load ```.env``` and ```.env.local``` in addition to the mode-specific ```.end.[mode]``` file. Variables declared in mode-specific files will take precedence over those in generic files, but variables defined only in ```.env``` or ```.env.local``` will still be available in the environment.
>
>In addition, environment variables that already exist when Vite is executed have the highest priority and will not be overwritten by ```.env``` files. For example, when running ```VITE_SOME_KEY=123 vite build```.
>
>```.env``` files are loaded at the start of Vite. Restart the server after making changes.

*In short what does this mean?*

```.env``` will always be used as the base env file.
If you also use ```.env.development``` or ```.env.production``` Vite will build a combined ```.env``` file where the more specific file will override any values existing in both files.

You can read more about how Vite handles environment variables [here](https://vite.dev/guide/env-and-mode).


## Build

```sh
npm run build
```

