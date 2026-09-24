---
title: "How to Publish Your First npm Package (Step by Step)"
description: "From an empty folder to 'npm install my-package' in 10 minutes. The minimal setup, the mistakes to avoid, and how to test before publishing."
date: "2026-09-08"
tags: ["npm", "JavaScript", "Node.js", "Open Source"]
cover: null
---

You wrote a helpful function and want others to install it with `npm install`. What do you actually need to do?

> **Quick answer:** Create a `package.json`, make sure the name is free, run `npm login`, then `npm publish`. I did this for my mock data package **Koalaz**, and it's much simpler than it looks.

---

## Step 1: Create the package

```bash
mkdir my-cool-package
cd my-cool-package
npm init -y
```

Then write your code in `index.js`:

```js
export function shout(text) {
  return text.toUpperCase() + "!";
}
```

---

## Step 2: Set up `package.json`

These are the fields that matter:

```json
{
  "name": "my-cool-package",
  "version": "1.0.0",
  "description": "Shouts your text",
  "type": "module",
  "main": "index.js",
  "exports": "./index.js",
  "files": ["index.js"],
  "keywords": ["shout", "text"],
  "license": "MIT"
}
```

- **`name`** must be unique on npm. Check it at `npmjs.com/package/your-name`.
- **`files`** is a whitelist of what gets published. Without it, you may ship things you didn't intend (tests, `.env` files...).
- **`exports`** defines what users can import.

Want a scoped name (`@you/package`)? It works the same, but you must publish with `--access public`.

---

## Step 3: Add a README

npm displays your `README.md` on the package page. Include:

1. One sentence about what it does
2. The install command
3. A tiny usage example

A package with no README gets ignored.

---

## Step 4: Test it before publishing

Never publish blind. See exactly what will be uploaded:

```bash
npm pack --dry-run
```

Even better, install it locally in another project:

```bash
npm pack
# in another project
npm install ../my-cool-package/my-cool-package-1.0.0.tgz
```

---

## Step 5: Publish

Create an account on npmjs.com (2FA is required), then:

```bash
npm login
npm publish
```

Done. Anyone can now run `npm install my-cool-package`.

---

## Step 6: Publish updates

npm won't let you publish the same version twice. Bump it first with **semantic versioning**:

```bash
npm version patch   # 1.0.0 → 1.0.1  (bug fix)
npm version minor   # 1.0.1 → 1.1.0  (new feature)
npm version major   # 1.1.0 → 2.0.0  (breaking change)
npm publish
```

---

## Common mistakes

- ❌ Forgetting `files` and publishing secrets or huge folders
- ❌ Publishing a name that's taken (you'll get a 403 error)
- ❌ Breaking changes in a `patch` release
- ❌ Not testing the packed `.tgz` first
- ❌ Losing 2FA recovery codes

Remember: unpublishing is heavily restricted, so double-check before you hit enter.
