/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as InvoicesInvoiceIdImport } from './routes/invoices/$invoiceId'

// Create/Update Routes

const InvoicesInvoiceIdRoute = InvoicesInvoiceIdImport.update({
  path: '/invoices/$invoiceId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/invoices/$invoiceId': {
      id: '/invoices/$invoiceId'
      path: '/invoices/$invoiceId'
      fullPath: '/invoices/$invoiceId'
      preLoaderRoute: typeof InvoicesInvoiceIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({ InvoicesInvoiceIdRoute })

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/invoices/$invoiceId"
      ]
    },
    "/invoices/$invoiceId": {
      "filePath": "invoices/$invoiceId.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
