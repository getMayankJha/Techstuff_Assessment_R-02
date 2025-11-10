import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pokémon Data Explorer',
  description: 'Explore Pokémon data interactively using the PokéAPI',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <main className='flex min-h-screen flex-col items-center justify-between p-24'>{children}</main>
      </body>
    </html>
  );
}
