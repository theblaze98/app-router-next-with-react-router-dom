import React, { ComponentType, memo, Suspense } from 'react'
import {
  BrowserRouter as Router,
  Routes as RoutesDOM,
  Route,
} from 'react-router-dom'
import { createRoutes } from './helpers/routes'
import { ComponentPromise } from './types'

const pages = import.meta.glob<{ default: ComponentType }>('./pages/**/*.tsx')
const routes = createRoutes(pages)

function Routes() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <RoutesDOM>
          {routes.map((route, idx) => {
            if (route.layout && route.page) {
              const Layout = React.lazy(
                () =>
                  route.layout as Promise<{
                    default: ComponentType<{ children: React.ReactNode }>
                  }>,
              )
              const PageComponent = React.lazy(
                () => route.page as ComponentPromise,
              )

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
            }
            if (route.component) {
              const PageComponent = React.lazy(
                () => route.component as Promise<{ default: ComponentType }>,
              )

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
        </RoutesDOM>
      </Suspense>
    </Router>
  )
}

export default memo(Routes)
