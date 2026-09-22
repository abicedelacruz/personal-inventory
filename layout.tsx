import React from 'react'

export const metadata = {
  title: 'Personal Property Inventory',
  description: 'Employee Personal Property Inventory System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}
