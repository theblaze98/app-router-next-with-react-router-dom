import { ComponentType } from 'react'

export type ComponentPromise<T = object> = Promise<{
  default: ComponentType<T>
}>

export type RouteObject = {
  path: string
  layout?: ComponentPromise
  page?: ComponentPromise
  component?: ComponentPromise
}
