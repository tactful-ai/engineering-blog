# Tactful Engineering Blog

An [Eleventy](https://www.11ty.dev/) powered engineering blog.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm or yarn

## Installation

Clone this repository and install the dependencies:

```bash
git clone <repository-url>
cd engineering-blog
npm install
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

This will start a local development server at `http://localhost:8080` with live reload enabled.

## Build

To build the site for production:

```bash
npm run build
```

This will generate the static site in the `_site` directory.

## Clean

To clean the generated files:

```bash
npm run clean
```

## Project Structure

```
engineering-blog/
├── src/                  # Source files (the input directory)
│   ├── _data/            # Global data files
│   │   ├── metadata.json # Site metadata config
│   │   └── navigation.json # Navigation structure
│   ├── _includes/        # Layout templates and partials
│   │   ├── components/   # Reusable components
│   │   ├── layouts/      # Base layouts
│   │   └── partials/     # Partial templates
│   ├── assets/           # Static assets
│   │   └── images/       # Image files
│   ├── blog/             # Blog posts and blog index
│   │   └── posts/        # Individual blog post markdown files
│   ├── css/              # CSS files
│   ├── jobs/             # Job listings
│   │   └── positions/    # Individual job position markdown files
│   └── index.njk         # Homepage
├── _site/                # Generated site (the output directory)
├── .eleventy.js          # Eleventy configuration
└── package.json          # Project dependencies
```

## Adding New Content

### Blog Posts

To add a new blog post, create a new markdown file in the `src/blog/posts/` directory with the following front matter:

```markdown
---
title: Your Post Title
date: YYYY-MM-DD
tags: ['tag1', 'tag2']
description: A brief description of your post
author: Author Name
---

Your content here...
```

### Job Positions

To add a new job position, create a new markdown file in the `src/jobs/positions/` directory with the following front matter:

```markdown
---
title: Position Title
date: YYYY-MM-DD
location: Remote/Office Location
type: Full-time/Part-time/Contract
---

Job description here...
```

## Eleventy Custom Functions

The site uses several custom Eleventy filters to enhance functionality:

- `readableDate` - Formats dates in a human-readable format
- `htmlDateString` - Formats dates in ISO format for HTML datetime attributes
- `related` - Finds related posts based on tags
- `filterByTags` - Filters posts by specific tags
- `getAllTags` - Gets all tags used across blog posts

See `.eleventy.js` documentation for more details on these functions.

## Dependencies

- [@11ty/eleventy](https://www.11ty.dev/) v3.0.0 - Static site generator
- [@11ty/eleventy-plugin-syntaxhighlight](https://www.11ty.dev/docs/plugins/syntaxhighlight/) v5.0.0 - Syntax highlighting for code blocks
- [@11ty/eleventy-plugin-rss](https://www.11ty.dev/docs/plugins/rss/) v2.0.3 - RSS feed generation
- [luxon](https://moment.github.io/luxon/) v3.6.1 - Date formatting
- [markdown-it](https://github.com/markdown-it/markdown-it) v14.1.0 - Markdown parser
- [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor) v9.2.0 - Header anchors for markdown

## For IDEs and Code Understanding

This project follows a structured approach to content management:
- Content is authored in Markdown (`.md`) files
- Templates use Nunjucks (`.njk`) for layouts and components
- Data files in `_data/` directory define global site configuration
- Eleventy transforms these into static HTML, CSS, and JS files

The `.eleventy.js` configuration file defines custom collections, filters, and plugins that control how the site is built.

