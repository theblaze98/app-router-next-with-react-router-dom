export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold">Layout</h1>
      {children}
    </div>
  )
}
