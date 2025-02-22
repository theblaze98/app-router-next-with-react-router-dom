import { ComponentPromise, RouteObject } from './../types/index'

export function createRoutes(pages: Record<string, () => ComponentPromise>) {
  const routes: RouteObject[] = []
  const seenRoutes = new Set<string>()

  for (const filePath of Object.keys(pages)) {
    console.log(
      `%c${filePath}`,
      'display: inline-block; background-color: gold; color: black; font-weight: bold; padding: 3px 7px; border-radius: 3px;',
    )

    const route = filePath
      .replace(/^\.\/pages/, '')
      .replace(/(page|layout)\.tsx$/, '')

    if (seenRoutes.has(route)) {
      continue // La ruta ya fue procesada, se omite
    }
    seenRoutes.add(route)

    const isLayout = filePath.includes('layout.tsx')
    const isPage = filePath.includes('page.tsx')

    if (isLayout) {
      const layoutPath = filePath
      const pagePath = `./pages${route}page.tsx`

      if (pages[layoutPath] && pages[pagePath]) {
        routes.push({
          path: route,
          layout: pages[layoutPath](),
          page: pages[pagePath](),
        })
      }
    } else if (isPage) {
      routes.push({
        path: route,
        component: pages[filePath](),
      })
    }
  }

  return routes
}
