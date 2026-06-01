import { useLoaderData } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
type Entry = {
    time_entry_id: number
    project_id: number
    description: string
    start_time: string
    end_time: string | null
}

type PaginatedResponse = {
    data: Entry[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleString(undefined, {
        month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit',
    })
}

function formatDuration(start: string, end: string | null): string {
    if (!end) return "Active"
    const ms = Math.max(0, new Date(end).getTime() - new Date(start).getTime())    
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    if (h > 0) return `${h}h ${m}m`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
}

export default function Listpage() {
    const { data, meta } = useLoaderData({ from: '/entries/$page' }) as PaginatedResponse

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Time Tracker</p>
                <h1 className="text-3xl font-bold text-white">
                    Entries
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    {meta.total} {meta.total === 1 ? 'entry' : 'entries'} total
                </p>
            </div>

            {data.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                    <p className="text-gray-400">No entries yet.</p>
                </div>
            ) : (
                <ul className="flex flex-col gap-3">
                    {data.map((entry) => (
                        <li
                            key={entry.time_entry_id}
                            className="rounded-2xl border border-gray-200 bg-white px-6 py-5 flex items-start gap-5"
                        >
                            <div className="shrink-0 rounded-xl border border-gray-300 bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700">
                                {formatDuration(entry.start_time, entry.end_time)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-black truncate">
                                    {entry.description || <span className="text-gray-400">No description</span>}
                                </p>
                                <p className="text-xs mt-1 text-gray-500">
                                    Project #{entry.project_id}
                                    {' · '}
                                    {formatDate(entry.start_time)}
                                    {entry.end_time ? ` → ${formatDate(entry.end_time)}` : ' · Active now'}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Page {meta.page} of {meta.totalPages}
                </p>
                <div className="flex gap-3">
                    <Link
                        disabled={!meta.hasPrevPage}
                        to="/entries/$page"
                        params={{ page: String(meta.page - 1) }}
                        className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-base)]"
                    >
                        ← Previous
                    </Link>
                    <Link
                        disabled={!meta.hasNextPage}
                        to="/entries/$page"
                        params={{ page: String(meta.page + 1) }}
                        className="rounded-xl bg-[var(--text)] px-4 py-2 text-sm font-semibold text-[var(--bg-base)] disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                    >
                        Next →
                    </Link>
                </div>
            </div>
        </div>
    )
}
