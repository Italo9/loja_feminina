# Lumière — Regras de Design

Este documento é a fonte de verdade visual do projeto. Toda tela, componente ou ajuste de UI, feito por humano ou por agente de IA, deve seguir estas regras. Em caso de dúvida, a referência técnica é o bloco `@theme` em `src/app/globals.css`.

## Identidade

Lumière é uma loja de moda feminina de tom premium e delicado: pérola, blush e dourado sobre tipografia serifada elegante. O visual é quieto e disciplinado; o brilho vem de poucos acentos dourados, nunca de cores vibrantes.

- Display: **Cormorant Garamond** (títulos, preços de destaque, nomes de seção). Use via `font-[family-name:var(--font-display)]` ou classes `.display-*`.
- Corpo: **Jost**, peso 300 como padrão. Classes `.body-lg`, `.body-base`, `.body-sm`.
- Labels e eyebrows: caixa alta, tracking largo (`tracking-[0.15em]` a `[0.25em]`), tamanho 10-11px, cor `gold-500`/`gold-600` (classe `.eyebrow`).

## Paleta (somente tokens, nunca hex solto)

| Escala | Papel |
|---|---|
| `pearl-50..300` | Fundos, superfícies, bordas hairline |
| `rose-50..300` | Superfícies rosadas suaves, hovers |
| `rose-400..600` | Rosé queimado para acentos e estados destrutivos suaves |
| `blush-400..700` | Botões primários e badges |
| `mauve-*` | Hovers do blush |
| `nude-*` | Detalhes e réguas |
| `gold-50..700` | Acentos premium, eyebrows, elementos de gestão |
| `plum-300..900` | Todo texto e ícones |

### Regras de cor (inegociáveis)

1. **Proibido hex hardcoded em componentes.** Use as classes de token (`text-plum-600`, `bg-pearl-100`, `border-gold-400/15`). Se um valor não existe, adicione o token no `@theme` primeiro.
2. **Proibido usar escalas padrão do Tailwind** (`pink-*`, `red-*` exceto validacões de erro, `gray-*`, `slate-*`, `amber-*` etc.). Se a classe não está no `@theme`, ela não pertence ao projeto.
3. **`cream-*` e `espresso-*` são aliases legados** mapeados em Pearl/Plum. Código novo usa `pearl-*` e `plum-*` diretamente; não escreva cream/espresso em arquivos novos.
4. Texto é sempre `plum-*`. Nunca preto puro, nunca cinza neutro.
5. Um acento por contexto: dourado **ou** blush, não os dois competindo no mesmo bloco.

## Componentes e utilitários existentes (use antes de criar)

- Botões: `.btn-rose` (primário), `.btn-gold` (acento), `.btn-outline` (secundário). Sempre `rounded-full`.
- Cards: `.surface` (branco, borda `rose-200`, raio 1.5rem). Variação manual: `bg-white rounded-2xl border border-pearl-200 shadow-soft`.
- Inputs: `.input-clean` ou o padrão `bg-pearl-50 border border-pearl-200 focus:border-gold-400/60`, texto `text-[16px]` em campos mobile (evita zoom do iOS).
- Separadores: `.rule` (nude) e `.hairline-gold`. Nunca `border-t` cinza puro.
- Sombras: apenas `shadow-soft`, `shadow-card`, `shadow-lift`.
- Raios: pills e botões `rounded-full`; cards `rounded-2xl`; imagens internas `rounded-xl`. Nada de `rounded-md` seco em elementos visíveis.
- Animações: use as existentes (`animate-fade-up`, `animate-slide-in-right`, `animate-slide-up`, `stagger-*`). Não crie keyframes novos sem necessidade real.

## Padrões de layout

- Container: `.container-narrow` (max 1240px). Seções com `.section-padding`.
- Overlays e sheets: fundo `bg-plum-900/25 backdrop-blur-sm`, painel em `pearl-50/100`, header do painel com `border-b border-gold-400/15`.
- Z-index em uso: header 50, cookie 60, launcher da Jade 80, chat aberto 84/85, carrinho 90, menu mobile 100. Novos overlays precisam respeitar essa ordem.
- Mobile first: alvos de toque mínimos de 40px, `pb-safe`/`pt-safe` em barras fixas, testar em 360px de largura.

## Papel por role

- Elementos de **gestão** (visíveis só para ADMIN) usam a assinatura dourada: borda `gold-400/25..40`, fundo `gold-50`, texto `gold-600`. Exemplos: pill "Gestão" no Header, bloco "Administração" no menu mobile.
- Elementos de **cliente** ficam na paleta principal (plum/pearl/blush).
- Links de admin só renderizam quando `role === "ADMIN"` vindo da sessão; a proteção real continua no middleware de `/admin`.

## Voz e microcopy

- Português, tom caloroso e direto, sentence case ("Finalizar compra", não "FINALIZAR COMPRA" fora de eyebrows).
- Botões dizem o que acontece: "Finalizar compra", "Ver o catálogo", "Aceitar todos".
- Estados vazios convidam à ação ("As peças que você escolher aparecem aqui"), nunca só constatam.
- Preços no formato brasileiro: `R$ 129,90` (vírgula).

## Checklist antes de commitar UI

1. Nenhum hex solto, nenhuma classe de cor fora do `@theme`.
2. Nenhum `cream-*`/`espresso-*` em código novo.
3. Tipografia: display serifado para títulos, Jost para o resto, eyebrow dourado para labels.
4. Estados cobertos: hover, focus visível, disabled, vazio e carregando.
5. Testado em mobile (360px) e desktop; `aria-label` em botões só de ícone.
6. Lógica intocada em mudanças puramente visuais.
