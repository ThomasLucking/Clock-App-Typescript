import { createFileRoute } from '@tanstack/react-router'
import EditForm from '#/components/EditForm'
import { getEntry } from '#/api/entries'

export const Route = createFileRoute('/entries/$id/edit')({
    loader: async ({ params }) => {
        const entry = await getEntry(params.id)
        return { entry, id: params.id }
    },
    component: () => <EditForm title="Edit Time Entry" />,
})
