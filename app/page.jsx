import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/en'); // ✅ default locale ke home page pe bhej dega
}
