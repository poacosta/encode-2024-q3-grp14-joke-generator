# Joke Generator

This is a simple application that allows users to generate jokes, which can be customized according to various
criteria such as topic, tone, type, and temperature.

## Contributors
* @Pedro Acosta `odoenl`
* @MrBro `AL8lY2`
* @kate_f_ `a1oYsY`
* @ermarsot `a8ZQGn`

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, install and init `shadcn/ui` CLI:

```bash
npx shadcn init
```

Next create a `.env` file in the root directory of the project and add the following environment variables:

```bash
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
```

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Notes

This project uses `shadcn/ui`, which is why you may need to add built-in components.
Use the following command to add a built-in component:

```bash
npx shadcn add <component-name>
```
