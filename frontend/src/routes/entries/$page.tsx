import { createFileRoute } from '@tanstack/react-router'
import Listpage from '../../components/Listpage'
export const Route = createFileRoute('/entries/$page')({
  loader: async ({ params }) => {
    const page = Number(params.page) || 1
    const limit = 10
    const response = await fetch(`/api/entries?page=${page}&limit=${limit}`)
    if (!response.ok) {
      throw new Error('Failed to fetch entries')
    }
    return response.json()
  },
  component: Listpage,
})


