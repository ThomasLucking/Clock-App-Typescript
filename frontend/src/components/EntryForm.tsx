import { Link, useNavigate } from '@tanstack/react-router'
import { createEntries } from '../api/entries';

type EntryFormProps = {
    title: string
}

export default function EntryForm({ title }: EntryFormProps) {
    const Navigate = useNavigate()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const payload = {
            project_id: Number(formData.get('project_id')),
            description: formData.get('description'),
            start_time: new Date(formData.get('start_time') as string).toISOString(),
            end_time: new Date(formData.get('end_time') as string).toISOString(),
        }
        console.log(payload)
        createEntries(payload).then((response) => {
            
            if (response.ok) {
                Navigate({ to: '/entries/$page', params: { page: '1' } })
            } else {
                alert('Failed to save entry')
            }
        })
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="mb-8">
                <p className="island-kicker mb-2">Time Tracker</p>
                <h1 className="text-3xl font-bold text-(--text)">{title}</h1>
            </div>

            <form onSubmit={handleSubmit} className="island-shell rounded-2xl p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="description" className="text-sm font-semibold text-(--text)">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        placeholder="What did you work on?"
                        className="rounded-xl border px-3 py-2.5 text-sm text-(--text) bg-(--bg-base) placeholder:text-(--text-soft) focus:outline-none focus:ring-2 focus:ring-(--accent) resize-none"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="project_id" className="text-sm font-semibold text-(--text)">
                        Project
                    </label> 
                    <input
                        id="project_id"
                        name="project_id"
                        type="number"
                        min={1}
                        placeholder="Project ID"
                        className="rounded-xl border border-(--line) px-3 py-2.5 text-sm text-(--text) bg-(--bg-base) placeholder:text-(--text-soft) focus:outline-none focus:ring-2 focus:ring-(--accent) [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="start_time" className="text-sm font-semibold text-(--text)">
                        Start Time
                    </label>
                    <input
                        id="start_time"
                        name="start_time"
                        type="datetime-local"
                        className="rounded-xl border bord
                        er-(--line) px-3 py-2.5 text-sm text-(--text) bg-(--bg-base) focus:outline-none focus:ring-2 focus:ring-(--accent)"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="end_time" className="text-sm font-semibold text-(--text)">
                        End Time
                    </label>
                    <input
                        id="end_time"
                        name="end_time"
                        type="datetime-local"
                        className="rounded-xl border border-(--line) px-3 py-2.5 text-sm text-(--text) bg-(--bg-base) focus:outline-none focus:ring-2 focus:ring-(--accent)"
                    />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-(--line)">
                    <Link
                        to="/entries/$page"
                        params={{ page: '1' }}
                        className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-base)]"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="rounded-xl bg-[var(--text)] px-4 py-2 text-sm font-semibold text-[var(--bg-base)] hover:opacity-90"
                    >
                        Save entry
                    </button>
                </div>
            </form>
        </div>
    )
}
