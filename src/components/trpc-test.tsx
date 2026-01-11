'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/trpc/trpc-client';

export function TRPCTestCard() {
  const { data, isLoading, error } = api.test.greeting.useQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>tRPC Test</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-muted-foreground">Loading...</p>}
        {error && <p className="text-destructive">Error: {error.message}</p>}
        {data && <p className="text-lg font-semibold text-green-600">✅ {data}</p>}
      </CardContent>
    </Card>
  );
}
