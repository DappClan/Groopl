import type { BuildInfo } from './shared/types'
import { isCI, isDevelopment, isWindows } from 'std-env'
import { appDescription } from './app/config'
import { isPreview } from './config/env'
import { pwa } from './config/pwa'

export default defineNuxtConfig({

  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@vue-macros/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@unlazy/nuxt',
    ...(isDevelopment || isWindows) ? [] : ['nuxt-security'],
  ],
  i18n: {
    locales: [
      { code: 'en-US', file: 'en-US.json', name: 'English' },
    ],
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    // relative to i18n dir on rootDir: not yet v4 compat layout
    langDir: '../locales',
    defaultLocale: 'en',
    vueI18n: '../config/i18n.config.ts',
  },
  devtools: {
    enabled: true,
  },
  imports: {
    imports: [{
      name: 'useI18n',
      from: '~/utils/i18n',
      priority: 100,
    }],
    injectAtEnd: true,
  },
  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#222222' },
      ],
    },
  },
  css: [
    '@unocss/reset/tailwind.css',
    'floating-vue/dist/style.css',
    '@/styles/default-theme.css',
    '@/styles/vars.css',
    '@/styles/global.css',
    '@/styles/scrollbars.css',
    '@/styles/dropdown.css',
  ],
  vue: {
    propsDestructure: true,
  },

  colorMode: {
    classSuffix: '',
  },
  sourcemap: isDevelopment,

  future: {
    compatibilityVersion: 4,
  },
  features: {
    inlineStyles: false,
  },
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    // Temporary workaround to avoid hash mismatch issue
    entryImportMap: false,
  },
  compatibilityDate: '2024-08-14',

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },
  typescript: {
    tsConfig: {
      exclude: ['../service-worker'],
      compilerOptions: {
        // TODO: enable this once we fix the issues
        noUncheckedIndexedAccess: false,
      },
      vueCompilerOptions: {
        target: 3.5,
      },
    },
  },
  postcss: {
    plugins: {
      'postcss-nested': {},
    },
  },
  macros: {
    setupSFC: true,
    betterDefine: false,
    defineModels: false,
    reactivityTransform: false,
  },
  vite: {
    define: {
      'process.env.VSCODE_TEXTMATE_DEBUG': 'false',
      'process.mock': ((!isCI || isPreview) && process.env.MOCK_USER) || 'false',
      'process.test': 'false',
    },
    build: {
      target: 'esnext',
    },
    optimizeDeps: {
      include: [
        'string-length',
        'vue-virtual-scroller',
        'browser-fs-access',
        'blurhash',
        '@vueuse/integrations/useFocusTrap',
        '@fnando/sparkline',
        '@vueuse/gesture',
        'file-saver',
        'slimeform',
        'vue-advanced-cropper',
        'workbox-window',
        'workbox-precaching',
        'workbox-routing',
        'workbox-cacheable-response',
        'workbox-strategies',
        'workbox-expiration',
      ],
    },
  },
  pwa,
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore nuxt-security is conditional
  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        'default-src': ['\'self\''],
        'base-uri': ['\'self\''],
        'connect-src': ['\'self\'', 'https:', 'http:', 'wss:', 'ws:'],
        'font-src': ['\'self\''],
        'form-action': ['\'none\''],
        'frame-ancestors': ['\'none\''],
        'frame-src': ['https:'],
        'img-src': ['\'self\'', 'https:', 'http:', 'data:', 'blob:'],
        'manifest-src': ['\'self\''],
        'media-src': ['\'self\'', 'https:', 'http:'],
        'object-src': ['\'none\''],
        'script-src': ['\'self\'', '\'unsafe-inline\'', '\'wasm-unsafe-eval\''],
        'script-src-attr': ['\'none\''],
        'style-src': ['\'self\'', '\'unsafe-inline\''],
        'upgrade-insecure-requests': true,
      },
      permissionsPolicy: {
        fullscreen: '*',
      },
    },
    rateLimiter: false,
  },
  unlazy: {
    ssr: false,
  },
})

declare module '@nuxt/schema' {
  interface AppConfig {
    storage: any
    env: BuildInfo['env']
    buildInfo: BuildInfo
  }
}
