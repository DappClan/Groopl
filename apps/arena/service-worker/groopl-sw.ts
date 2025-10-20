/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

import { onShareTarget } from './share-target'

declare const self: ServiceWorkerGlobalScope

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})

const entries = self.__WB_MANIFEST
if (import.meta.env.DEV)
  entries.push({ url: '/', revision: Math.random().toString() })

precacheAndRoute(entries)

// clean old assets
cleanupOutdatedCaches()

// allow only fallback in dev: we don't want to cache anything
let allowlist: undefined | RegExp[]
if (import.meta.env.DEV)
  allowlist = [/^\/$/]

// deny api and server page calls
let denylist: undefined | RegExp[]
if (import.meta.env.PROD) {
  denylist = [
    /^\/api\//,
    /^\/login\//,
    /^\/oauth\//,
    /^\/signin\//,
    /^\/web-share-target\//,
    // exclude emoji: has its own cache
    /^\/emojis\//,
    // exclude sw: if the user navigates to it, fallback to index.html
    /^\/sw.js$/,
    /^\/groopl-sw.js$/,
    // exclude webmanifest: has its own cache
  ]
}

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('/'),
  { allowlist, denylist },
))

self.addEventListener('fetch', onShareTarget)
