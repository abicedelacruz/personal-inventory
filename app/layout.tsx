import './globals.css';

export const metadata = {
  title: 'AssetLedger — ABIC, Inc.',
  description: 'Enterprise Inventory System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
