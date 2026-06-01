import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import EntryForm from '#/components/EntryForm'
import { getEntry, updateEntry } from '#/api/entries'

const EditEntryPage = () => {
    const { entry, id } = useLoaderData({ from: '/entries/$id/edit' })
    return (
        <EntryForm
            title="Edit Time Entry"
            defaultValues={entry}
            onSubmit={(payload) => updateEntry(id, payload)}
        />
    )
}

export const Route = createFileRoute('/entries/$id/edit')({
    loader: async ({ params }) => {
        const entry = await getEntry(params.id)
        return { entry, id: params.id }
    },
    component: EditEntryPage,
})
