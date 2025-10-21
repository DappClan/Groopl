export {}

declare module '#app' {
  interface PageMeta {
    wideLayout?: boolean
  }

  interface RuntimeNuxtHooks {
    'groopl-logo:click': () => void
  }
}

declare global {
  namespace NodeJS {
    interface Process {
      mock?: Record<string, any>
    }
  }
}
