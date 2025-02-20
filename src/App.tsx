import React, { Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// Cargar dinámicamente todos los archivos .tsx dentro de la carpeta 'pages'
const pages = import.meta.glob('./pages/**/*.tsx')

const App = () => {
  // Estructura para almacenar las rutas
  const routes = []

  Object.keys(pages).forEach((path) => {
    console.log(path)
    const route = path
      .replace(/^\.\/pages/, '')
      .replace(/(page|layout)\.tsx$/, '') // Extrae el nombre de la ruta
    const isLayout = path.includes('layout.tsx') // Verifica si es un layout
    const isPage = path.includes('page.tsx') // Verifica si es un componente de página

    // Evitar rutas duplicadas
    if (routes.some((r) => r.path === route)) {
      return // Si ya existe una ruta para esa path, no la agregamos
    }

    // Si es un layout, lo procesamos por separado
    if (isLayout) {
      const layoutPath = path

      // Buscar el archivo page.tsx dentro de la misma carpeta y asociarlo con el layout
      const pagePath = `./pages${route}page.tsx`

      // Asegurarse de que ambos, layout y page, estén presentes antes de agregar a las rutas
      routes.push({
        path: route,
        layout: pages[layoutPath](), // Asocia el layout a la ruta
        page: pages[pagePath](), // Asocia la página al layout
      })
    } else if (isPage) {
      // Si es una página sin layout, simplemente la agregamos
      routes.push({
        path: route,
        component: pages[path](),
      })
    }
  })

  console.log(routes)

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {routes.map((route, idx) => {
            if (route.layout && route.page) {
              // Si existe un layout y un componente de página
              const Layout = React.lazy(() => route.layout)
              const PageComponent = React.lazy(() => route.page)

              return (
                <Route
                  key={idx}
                  path={route.path}
                  element={
                    <Layout>
                      <PageComponent />
                    </Layout>
                  }
                />
              )
            } else if (route.component) {
              // Si solo hay un componente de página (sin layout)
              const PageComponent = React.lazy(() => route.component)

              return (
                <Route
                  key={idx}
                  path={route.path}
                  element={<PageComponent />}
                />
              )
            }
            return null
          })}
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
