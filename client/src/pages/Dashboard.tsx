import { Link } from 'react-router-dom'
import { BookOpen, Clock, CheckCircle, MessageSquare, FileText, Bell, User } from 'lucide-react'

const projects = [
  { title: 'The Art of Negotiation', service: 'Ghostwriting', status: 'In Progress', progress: 65, dueDate: 'Jan 15, 2027', lastUpdate: '2 hours ago' },
  { title: 'Mindful Leadership',     service: 'Editing',      status: 'Review',      progress: 90, dueDate: 'Nov 20, 2026', lastUpdate: 'Yesterday' },
]

const statusColors: Record<string, string> = {
  'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Review':      'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Completed':   'bg-green-500/20 text-green-400 border-green-500/30',
  'Draft':       'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export default function Dashboard() {
  return (
    <div className="pt-24 min-h-screen bg-dark-900">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Client Portal</h1>
            <p className="text-gray-400 mt-1">Welcome back. Here's your project overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 bg-dark-800 border border-dark-600 rounded-lg flex items-center justify-center hover:border-primary-600 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
            </button>
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center font-bold text-white">A</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Active Projects', value: '2', icon: BookOpen,      color: 'text-blue-400' },
            { label: 'Pending Reviews', value: '1', icon: Clock,         color: 'text-amber-400' },
            { label: 'Completed',       value: '3', icon: CheckCircle,   color: 'text-green-400' },
            { label: 'Messages',        value: '5', icon: MessageSquare, color: 'text-purple-400' },
          ].map(stat => (
            <div key={stat.label} className="card-dark flex items-center gap-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="mb-10">
          <h2 className="text-xl font-serif font-bold text-white mb-4">Active Projects</h2>
          <div className="space-y-4">
            {projects.map(p => (
              <div key={p.title} className="card-dark">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{p.title}</h3>
                    <div className="text-sm text-gray-400 mt-0.5">{p.service} · Due {p.dueDate}</div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColors[p.status]}`}>{p.status}</span>
                </div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{p.progress}%</span>
                </div>
                <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-500" style={{ width: `${p.progress}%` }} />
                </div>
                <div className="mt-3 text-xs text-gray-500">Last updated {p.lastUpdate}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-xl font-serif font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: MessageSquare, label: 'Message Your Team', to: '/contact' },
              { icon: FileText,      label: 'View Documents',    to: '#' },
              { icon: User,          label: 'Account Settings',  to: '#' },
            ].map(action => (
              <Link key={action.label} to={action.to} className="card-dark flex items-center gap-3 hover:border-primary-600 transition-colors">
                <action.icon className="w-5 h-5 text-primary-400" />
                <span className="text-sm font-medium text-gray-300">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
