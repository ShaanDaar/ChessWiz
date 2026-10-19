import Link from 'next/link';

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export default async function GameSessionPage({ params }: GamePageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#140b07] p-8 text-center text-[#fdfbf7]">
      <div className="max-w-md rounded-2xl border border-[#5a3a29] bg-[#23140e] p-8 shadow-xl">
        <span className="mb-4 block text-4xl">♟️</span>
        <h1 className="font-display mb-2 text-3xl font-semibold">Game Session</h1>
        <p className="mb-6 font-mono text-sm text-[#e6d7c3]/80">ID: {id}</p>
        <p className="mb-6 text-sm text-[#e6d7c3]/60">
          This game route is protected. Game board feature will be integrated here.
        </p>
        <Link
          href="/play"
          className="inline-flex rounded-lg bg-amber-500 px-4 py-2 font-semibold text-[#140b07] hover:bg-amber-400"
        >
          Return to Play Lounge
        </Link>
      </div>
    </div>
  );
}
