import { createFileRoute } from '@tanstack/react-router'
import EntryForm from '#/components/EntryForm'

export const Route = createFileRoute('/entries/new')({
    component: () => <EntryForm title="New Entry" />,
})
