import { redirect } from 'next/navigation';
import { use } from 'react';

interface TeamAccountHomePageProps {
  params: Promise<{ account: string }>;
}

function TeamAccountHomePage({ params }: TeamAccountHomePageProps) {
  const account = use(params).account;
  redirect(`/home/${account}/panels/executive`);
}

export default TeamAccountHomePage;
