import './globals.css'
import { Poppins } from 'next/font/google'
import ClientLayoutWrapper from './clientLayoutWrapper'

const pjs = Poppins({
  subsets: ['latin'],
  weight: '400',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Mekari Task Management</title>
        <meta name="description" content={'Mekari Task Management'} />
      </head>
      <body className="antialiased" style={pjs.style}>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  )
}
