import { createFileRoute } from '@tanstack/react-router'
import Listpage from '../../components/Listpage'
import { LoadingState } from '#/components/Loadingstate'
import { ErrorState } from '#/components/Errorstate'


export const Route = createFileRoute('/entries/$page')({
  loader: async ({ params }) => {
    const page = Math.max(1, parseInt(params.page, 10) || 1);    const limit = 10
    const response = await fetch(`/api/entries?page=${page}&limit=${limit}`)
    if (!response.ok) {
      throw new Error('Failed to fetch entries')
    }
    return response.json()
  },
  pendingComponent: LoadingState,
  errorComponent: ErrorState,
  component: Listpage,
})


