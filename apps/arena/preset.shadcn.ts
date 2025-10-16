import type { Preset } from 'unocss'
import type { PresetMiniOptions, Theme } from 'unocss/preset-mini'
import { h } from '@unocss/preset-mini/utils'

export interface PresetShadcnOptions extends PresetMiniOptions { }

function handleMatchNumber(v: string, defaultVal = '0') {
  return h.cssvar.global.auto.fraction.number(v || defaultVal)?.toString().replace('%', '')
}
const handleMatchRem = (v: string, defaultVal = 'full') => h.bracket.cssvar.global.auto.fraction.rem(v || defaultVal)

export function presetShadcn(_options: PresetShadcnOptions = {}): Preset<Theme> {
  return {
    name: 'unocss-preset-shadcn',
    preflights: [
      {
        getCSS: () => `
          @keyframes shadcn-down { from{ height: 0 } to { height: var(--radix-accordion-content-height)} }
          @keyframes shadcn-up { from{ height: var(--radix-accordion-content-height)} to { height: 0 } }
          @keyframes shadcn-collapsible-down { from{ height: 0 } to { height: var(--radix-collapsible-content-height)} }
          @keyframes shadcn-collapsible-up { from{ height: var(--radix-collapsible-content-height)} to { height: 0} }
          @keyframes shadcn-enter { from{ opacity: var(--un-enter-opacity, 1); transform: translate3d(var(--un-enter-translate-x, 0), var(--un-enter-translate-y, 0), 0) scale3d(var(--un-enter-scale, 1), var(--un-enter-scale, 1), var(--un-enter-scale, 1)) rotate(var(--un-enter-rotate, 0)) } }
          @keyframes shadcn-exit { to{ opacity: var(--un-exit-opacity, 1); transform: translate3d(var(--un-exit-translate-x, 0), var(--un-exit-translate-y, 0), 0) scale3d(var(--un-exit-scale, 1), var(--un-exit-scale, 1), var(--un-exit-scale, 1)) rotate(var(--un-exit-rotate, 0)) } }
        
          :root {
            --card: 1 0 0;
            --card-foreground: .141 .005 285.823;
            --popover: 1 0 0;
            --popover-foreground: .141 .005 285.823;
            --primary: .585 .233 277.117;
            --primary-to: .511 .262 276.966;
            --primary-foreground: .962 .018 272.314;
            --secondary: .967 .001 286.375;
            --secondary-foreground: .183 .006 285.79;
            --muted: .967 .001 286.375;
            --muted-foreground: .552 .016 285.938;
            --accent: .967 .001 286.375;
            --accent-foreground: .183 .006 285.79;
            --destructive: .637 .237 25.331;
            --destructive-foreground: .637 .237 25.331;
            --border: .92 .004 286.32;
            --input: .871 .006 286.286;
            --ring: .871 .006 286.286;
            --chart-1: .585 .233 277.117;
            --chart-2: .6 .118 184.704;
            --chart-3: .398 .07 227.392;
            --chart-4: .828 .189 84.429;
            --chart-5: .769 .188 70.08;
            --radius: .625rem;
            --sidebar-background: .956 .002 286.35;
            --sidebar-foreground: .37 .013 285.805;
            --sidebar-primary: .673 .182 276.935;
            --sidebar-primary-foreground: .985 0 0;
            --sidebar-accent: .967 .001 286.375;
            --sidebar-accent-foreground: .21 .006 285.885;
            --sidebar-border: .92 .004 286.32;
            --sidebar-ring: .871 .006 286.286;
            --background: 1 0 0;
            --foreground: .141 .005 285.823;
            --vis-tooltip-background-color: none !important;
            --vis-tooltip-border-color: none !important;
            --vis-tooltip-text-color: none !important;
            --vis-tooltip-shadow-color: none !important;
            --vis-tooltip-backdrop-filter: none !important;
            --vis-tooltip-padding: none !important;
            --vis-line-gapfill-stroke-dasharray: none;
            --vis-line-gapfill-stroke-opacity: 1;
            --vis-line-gapfill-stroke-dashoffset: 0;
            --vis-primary-color: var(--primary);
            --vis-secondary-color: 160 81% 40%;
            --vis-text-color: var(--muted-foreground);
          }
           
          .dark {
            --background: .183 .006 285.79;
            --foreground: .985 0 0;
            --card: .37 .013 285.805;
            --card-foreground: .985 0 0;
            --popover: .274 .006 286.033;
            --popover-foreground: .985 0 0;
            --primary: .585 .233 277.117;
            --primary-to: .511 .262 276.966;
            --primary-foreground: .962 .018 272.314;
            --secondary: .274 .006 286.033;
            --secondary-foreground: .985 0 0;
            --muted: .21 .006 285.885;
            --muted-foreground: .705 .015 286.067;
            --accent: .21 .006 285.885;
            --accent-foreground: .985 0 0;
            --destructive: .637 .237 25.331;
            --destructive-foreground: .637 .237 25.331;
            --border: .246 .009 285.69;
            --input: .246 .009 285.69;
            --ring: .442 .017 285.786;
            --chart-1: .585 .233 277.117;
            --chart-2: .6 .118 184.704;
            --chart-3: .398 .07 227.392;
            --chart-4: .828 .189 84.429;
            --chart-5: .769 .188 70.08;
            --sidebar-background: .21 .006 285.885;
            --sidebar-foreground: .967 .001 286.375;
            --sidebar-primary: .673 .182 276.935;
            --sidebar-primary-foreground: 1 0 0;
            --sidebar-accent: .274 .006 286.033;
            --sidebar-accent-foreground: .967 .001 286.375;
            --sidebar-border: .274 .006 286.033;
            --sidebar-ring: .442 .017 285.786;
          }
        `,
      },
    ],
    rules: [
      [
        'accordion-down',
        {
          animation: 'shadcn-down 0.15s ease-out',
        },
      ],
      [
        'accordion-up',
        {
          animation: 'shadcn-up 0.15s ease-out',
        },
      ],
      [
        'collapsible-down',
        {
          animation: 'shadcn-collapsible-down 0.2s ease-in-out',
        },
      ],
      [
        'collapsible-up',
        {
          animation: 'shadcn-collapsible-up 0.2s ease-in-out',
        },
      ],
      [
        'animate-in',
        {
          'animation-name': 'shadcn-enter',
          'animation-duration': 'var(--un-animate-duration)',
          '--un-animate-duration': '150ms',
          '--un-enter-opacity': 'initial',
          '--un-enter-scale': 'initial',
          '--un-enter-rotate': 'initial',
          '--un-enter-translate-x': 'initial',
          '--un-enter-translate-y': 'initial',
        },
      ],
      [
        'animate-out',
        {
          'animation-name': 'shadcn-exit',
          'animation-duration': 'var(--un-animate-duration)',
          '--un-animate-duration': '150ms',
          '--un-exit-opacity': 'initial',
          '--un-exit-scale': 'initial',
          '--un-exit-rotate': 'initial',
          '--un-exit-translate-x': 'initial',
          '--un-exit-translate-y': 'initial',
        },
      ],
      [/^fade-in-?(.+)?$/, ([, d]) => ({ '--un-enter-opacity': `${Number(handleMatchNumber(d) || 0) / 100}` })],
      [/^fade-out-?(.+)?$/, ([, d]) => ({ '--un-exit-opacity': `${Number(handleMatchNumber(d) || 0) / 100}` })],
      [/^zoom-in-?(.+)?$/, ([, d]) => ({ '--un-enter-scale': `${Number(handleMatchNumber(d) || 0) / 100}` })],
      [/^zoom-out-?(.+)?$/, ([, d]) => ({ '--un-exit-scale': `${Number(handleMatchNumber(d) || 0) / 100}` })],
      [/^spin-in-?(.+)?$/, ([, d]) => ({ '--un-enter-rotate': `${Number(handleMatchNumber(d) || 0)}deg` })],
      [/^spin-out-?(.+)?$/, ([, d]) => ({ '--un-exit-rotate': `${Number(handleMatchNumber(d) || 0)}deg` })],
      [/^slide-in-from-top-?(.+)?$/, ([, d]) => ({ '--un-enter-translate-y': `-${handleMatchRem(d)}` })],
      [/^slide-in-from-bottom-?(.+)?$/, ([, d]) => ({ '--un-enter-translate-y': handleMatchRem(d) })],
      [/^slide-in-from-left-?(.+)?$/, ([, d]) => ({ '--un-enter-translate-x': `-${handleMatchRem(d)}` })],
      [/^slide-in-from-right-?(.+)?$/, ([, d]) => ({ '--un-enter-translate-x': handleMatchRem(d) })],
      [/^slide-out-to-top-?(.+)?$/, ([, d]) => ({ '--un-exit-translate-y': `-${handleMatchRem(d)}` })],
      [/^slide-out-to-bottom-?(.+)?$/, ([, d]) => ({ '--un-exit-translate-y': handleMatchRem(d) })],
      [/^slide-out-to-left-?(.+)?$/, ([, d]) => ({ '--un-exit-translate-x': `-${handleMatchRem(d)}` })],
      [/^slide-out-to-right-?(.+)?$/, ([, d]) => ({ '--un-exit-translate-x': handleMatchRem(d) })],
    ],
    theme: {
      colors: {
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring))',
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        primary: {
          DEFAULT: 'oklch(var(--primary))',
          foreground: 'oklch(var(--primary-foreground))',
          to: 'oklch(var(--primary-to))',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary))',
          foreground: 'oklch(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive))',
          foreground: 'oklch(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted))',
          foreground: 'oklch(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent))',
          foreground: 'oklch(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))',
        },
        chart1: 'oklch(var(--chart1))',
        chart2: 'oklch(var(--chart2))',
        chart3: 'oklch(var(--chart3))',
        chart4: 'oklch(var(--chart4))',
        chart5: 'oklch(var(--chart5))',
        sidebar: {
          DEFAULT: 'oklch(var(--sidebar-background))',
          background: 'oklch(var(--sidebar-background))',
          foreground: 'oklch(var(--sidebar-foreground))',
          primary: {
            DEFAULT: 'oklch(var(--sidebar-primary))',
            foreground: 'oklch(var(--sidebar-primary-foreground))',
          },
          accent: {
            DEFAULT: 'oklch(var(--sidebar-accent))',
            foreground: 'oklch(var(--sidebar-accent-foreground))',
          },
          border: 'oklch(var(--sidebar-border))',
          ring: 'oklch(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  }
}

export default presetShadcn
