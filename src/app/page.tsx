import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-muted/50 flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">Sonskay</CardTitle>
          <CardDescription>Schedule your social media posts with ease</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            asChild
            size="lg"
            className="w-full"
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Link href="/register">Create Account</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
