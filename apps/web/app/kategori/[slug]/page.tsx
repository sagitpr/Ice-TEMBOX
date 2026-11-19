import { redirect } from 'next/navigation';

export default async function KategoriDynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (['kapal-nelayan-tradisional', 'cold-storage-perikanan', 'transportasi-rantai-dingin', 'koperasi-pelelangan-ikan'].includes(slug)) {
    redirect(`/solusi/${slug}`);
  }
  redirect('/solusi');
}
