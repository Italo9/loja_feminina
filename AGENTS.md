<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:lumiere-design-rules -->
# Design Lumière é obrigatório

Antes de criar ou alterar qualquer UI, leia `DESIGN.md` na raiz do projeto. Regras principais: apenas tokens do `@theme` em `src/app/globals.css` (nada de hex solto nem escalas padrão do Tailwind), `pearl-*`/`plum-*` em vez dos aliases legados `cream-*`/`espresso-*`, componentes utilitários existentes (`.btn-rose`, `.surface`, `.input-clean`) antes de inventar novos, e assinatura dourada reservada a elementos de gestão visíveis apenas para ADMIN.
<!-- END:lumiere-design-rules -->
