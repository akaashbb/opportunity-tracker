import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata = {
  title: 'OpportunityPro — Sales Pipeline Tracker',
  description: 'Track, manage and analyze your sales opportunities and project pipeline with real-time insights.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
