# Connector AI JSON Structure Guide / Guia para IA Criar JSON do Connector

This file teaches an AI model how to create a JSON workspace that can be imported into Connector.

Este arquivo ensina uma IA a criar um workspace JSON importável no Connector.

---

## 1. Goal / Objetivo

Generate a structured graph workspace with folders, categories, notes, tasks and links.

Gere um workspace em grafo com pastas, categorias, notas, tarefas e conexões.

The output must be a single valid JSON object. Do not include Markdown fences in the final JSON.

A saída deve ser um único objeto JSON válido. Não inclua blocos Markdown no JSON final.

---

## 2. Top-level format / Formato principal

```json
{
  "app": "Connector",
  "schema": "connector-workspace",
  "exportedAt": "2026-01-01T00:00:00.000Z",
  "state": {
    "settings": {
      "lang": "pt-BR",
      "theme": "dark",
      "vaultName": "Nome do workspace",
      "showLabels": true,
      "organic": true,
      "graphFilter": "all",
      "showGraphGroups": false
    },
    "folders": [],
    "categories": [],
    "items": [],
    "links": [],
    "blockedLinks": [],
    "selectedId": null
  }
}
```

Connector also accepts a raw state object, but the wrapped format above is recommended.

O Connector também aceita um objeto de estado direto, mas o formato acima é o recomendado.

---

## 3. Folders / Pastas

Folders define project hierarchy.

Pastas definem a hierarquia do projeto.

```json
{ "id": "folder_01", "name": "01 Planejamento", "parentId": null }
```

Nested folder:

Pasta filha:

```json
{ "id": "folder_01_docs", "name": "Documentos", "parentId": "folder_01" }
```

Rules / Regras:

- `id` must be unique.
- `name` should be clear and short.
- `parentId` is `null` for root folders.
- Use existing folder IDs for nested folders.

---

## 4. Categories / Categorias

Categories color nodes and help filtering.

Categorias dão cor aos nós e ajudam nos filtros.

```json
{ "id": "cat_project", "name": "Project", "color": "#a78bfa" }
```

Recommended categories / Categorias recomendadas:

```json
[
  { "id": "cat_project", "name": "Project", "color": "#a78bfa" },
  { "id": "cat_area", "name": "Area", "color": "#22d3ee" },
  { "id": "cat_person", "name": "Person", "color": "#4ade80" },
  { "id": "cat_task", "name": "Task", "color": "#facc15" },
  { "id": "cat_risk", "name": "Risk", "color": "#fb7185" },
  { "id": "cat_doc", "name": "Document", "color": "#60a5fa" }
]
```

---

## 5. Items: notes and tasks / Itens: notas e tarefas

A note:

Uma nota:

```json
{
  "id": "item_scope",
  "type": "note",
  "title": "Escopo do projeto",
  "folderId": "folder_01",
  "categoryId": "cat_project",
  "body": "Definir objetivo, entregáveis, premissas, restrições e critérios de sucesso.",
  "x": 0,
  "y": 0,
  "vx": 0,
  "vy": 0
}
```

A task:

Uma tarefa:

```json
{
  "id": "task_review",
  "type": "task",
  "title": "Revisar requisitos",
  "folderId": "folder_01",
  "categoryId": "cat_task",
  "body": "Validar requisitos com a equipe antes do desenvolvimento.",
  "done": false,
  "priority": "high",
  "due": "2026-07-08",
  "x": 120,
  "y": 40,
  "vx": 0,
  "vy": 0
}
```

Rules / Regras:

- `type` must be `note` or `task`.
- `folderId` must exist in `folders`.
- `categoryId` must exist in `categories`.
- `priority` for tasks can be `low`, `normal` or `high`.
- `due` uses `YYYY-MM-DD` or an empty string.
- `x` and `y` are optional coordinates, but useful for initial layout.

---

## 6. Links / Conexões

Links connect two items.

Conexões ligam dois itens.

```json
{
  "id": "link_scope_requirements",
  "source": "item_scope",
  "target": "item_requirements",
  "auto": false,
  "reason": "manual"
}
```

Rules / Regras:

- `source` and `target` must be valid item IDs.
- Do not link an item to itself.
- Avoid duplicate pairs.
- Use `auto: false` for planned/manual connections.
- Use `auto: true` only when the structure was generated automatically.

---

## 7. Design recommendations / Recomendações de modelagem

English:

- Create one root folder per major phase or area.
- Use categories to separate projects, people, tasks, documents, risks and deliverables.
- Keep titles short and bodies descriptive.
- Use links to represent dependency, sequence, responsibility or conceptual relation.
- For large projects, create 20–80 items per major area instead of one giant flat list.
- Avoid connecting everything to everything; use meaningful links.

Português:

- Crie uma pasta raiz para cada fase ou área principal.
- Use categorias para separar projetos, pessoas, tarefas, documentos, riscos e entregáveis.
- Use títulos curtos e descrições completas no corpo.
- Use links para representar dependência, sequência, responsabilidade ou relação conceitual.
- Em projetos grandes, crie 20–80 itens por área principal em vez de uma lista plana gigante.
- Evite conectar tudo com tudo; use conexões significativas.

---

## 8. Minimal complete example / Exemplo mínimo completo

```json
{
  "app": "Connector",
  "schema": "connector-workspace",
  "exportedAt": "2026-01-01T00:00:00.000Z",
  "state": {
    "settings": {
      "lang": "pt-BR",
      "theme": "dark",
      "vaultName": "Projeto exemplo",
      "showLabels": true,
      "organic": true,
      "graphFilter": "all",
      "showGraphGroups": false
    },
    "folders": [
      { "id": "folder_plan", "name": "Planejamento", "parentId": null }
    ],
    "categories": [
      { "id": "cat_project", "name": "Project", "color": "#a78bfa" },
      { "id": "cat_task", "name": "Task", "color": "#facc15" }
    ],
    "items": [
      {
        "id": "item_goal",
        "type": "note",
        "title": "Objetivo",
        "folderId": "folder_plan",
        "categoryId": "cat_project",
        "body": "Definir o objetivo central do trabalho.",
        "x": 0,
        "y": 0,
        "vx": 0,
        "vy": 0
      },
      {
        "id": "task_research",
        "type": "task",
        "title": "Pesquisar referências",
        "folderId": "folder_plan",
        "categoryId": "cat_task",
        "body": "Coletar fontes confiáveis para sustentar o trabalho.",
        "done": false,
        "priority": "normal",
        "due": "",
        "x": 140,
        "y": 40,
        "vx": 0,
        "vy": 0
      }
    ],
    "links": [
      { "id": "link_goal_research", "source": "item_goal", "target": "task_research", "auto": false, "reason": "dependency" }
    ],
    "blockedLinks": [],
    "selectedId": "item_goal"
  }
}
```
