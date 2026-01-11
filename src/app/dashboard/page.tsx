'use client';

import { Navbar } from '@/components/navbar';
import { TRPCTestCard } from '@/components/trpc-test';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="bg-muted/50 flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="bg-muted/50 min-h-screen">
      <Navbar user={session.user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {session.user.name || session.user.email}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hello World</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Welcome to your dashboard! This is the main page of your application.
              </p>
            </CardContent>
          </Card>
          <TRPCTestCard />
        </div>
      </main>
    </div>
  );
}
