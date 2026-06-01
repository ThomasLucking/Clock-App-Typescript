import type { ErrorComponentProps } from '@tanstack/react-router'

export const ErrorState =({ error }: ErrorComponentProps) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-semibold text-red-600">Failed to load entries</p>
        <p className="mt-1 text-sm text-red-400">{error.message}</p>
      </div>
    </div>
  )
}