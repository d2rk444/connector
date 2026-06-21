# Connector

Connector is a static visual workspace for notes, tasks, folders, categories and graph-based project structures. It runs directly in the browser and can be published on GitHub Pages without a backend.

Connector é um workspace visual estático para notas, tarefas, pastas, categorias e estruturas de projeto em grafo. Ele roda direto no navegador e pode ser publicado no GitHub Pages sem servidor.

## Main features / Recursos principais

- Notes, tasks, folders and categories in a local workspace.
- Interactive graph with global view, local view, filters and optional folder groups.
- Smart automatic links plus manual links.
- JSON import/export for backups and AI-generated structures.
- HD PNG export of the graph.
- Dark/light theme and PWA assets.
- Local-first storage using the browser `localStorage`.

## Project structure / Estrutura do projeto

```text
connector_github_pages/
├─ index.html
├─ manifest.webmanifest
├─ sw.js
├─ README.md
├─ LICENSE
├─ .nojekyll
├─ assets/
│  ├─ css/styles.css
│  ├─ js/app.js
│  ├─ js/pwa.js
│  └─ icons/
└─ docs/
   ├─ GITHUB_PAGES.md
   ├─ PROJECT_STRUCTURE.md
   └─ AI_JSON_STRUCTURE_GUIDE.md
```

## Run locally / Rodar localmente

Open `index.html` in the browser, or run a simple static server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish on GitHub Pages / Publicar no GitHub Pages

1. Create a GitHub repository.
2. Upload all files with `index.html` at the repository root.
3. Go to **Settings > Pages**.
4. Select **Deploy from a branch**.
5. Choose `main` and `/root`.
6. Save and wait for GitHub to publish the site.

More details are in [`docs/GITHUB_PAGES.md`](docs/GITHUB_PAGES.md).

## JSON import/export / Importação e exportação JSON

Use **Settings > Backup** to export or import JSON.

Import modes:

- **Merge with current workspace**: keeps current work and adds compatible imported data.
- **Replace current workspace**: replaces the current workspace with the imported JSON.

The AI guide for generating valid JSON is available in [`docs/AI_JSON_STRUCTURE_GUIDE.md`](docs/AI_JSON_STRUCTURE_GUIDE.md).

## Graph groups / Conjuntos do grafo

Folder group circles are optional. They are disabled by default to preserve the classic clean graph layout.

To enable them, open **Settings > Graph display > Show folder groups**.

Os círculos/conjuntos de pastas são opcionais. Eles vêm desligados por padrão para manter o visual clássico do grafo.

## Notes for maintainers / Notas para manutenção

- `assets/js/app.js` contains the main application logic.
- `assets/css/styles.css` contains the interface and responsive layout.
- `sw.js` provides basic PWA caching.
- Connector is local-first; no external database is required.

## License / Licença

MIT License.
