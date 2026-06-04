import { createFileRoute } from '@tanstack/react-router'
import EntryForm from '#/components/EntryForm'
import { createEntries } from '#/api/entries'

export const Route = createFileRoute('/entries/new')({
    component: () => <EntryForm title="New Entry" onSubmit={createEntries} />,
})
