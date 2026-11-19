import { redirect } from 'next/navigation';

export default async function KategoriDynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase();

  if (
    [
      'kapal-nelayan-tradisional',
      'cold-storage-perikanan',
      'transportasi-rantai-dingin',
      'koperasi-pelelangan-ikan',
    ].includes(cleanSlug)
  ) {
    redirect(`/solusi/${cleanSlug}`);
  }

  if (
    cleanSlug.includes('box') ||
    cleanSlug.includes('produk') ||
    cleanSlug.includes('alat') ||
    cleanSlug.includes('hardware')
  ) {
    redirect('/market');
  }

  if (
    cleanSlug.includes('ikan') ||
    cleanSlug.includes('palka') ||
    cleanSlug.includes('coolbox')
  ) {
    redirect(`/pencarian/${cleanSlug}`);
  }

  redirect('/solusi');
}
