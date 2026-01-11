# Exemples d'usage de tRPC

Ce document présente des exemples concrets d'utilisation de tRPC dans notre application de planification de posts pour réseaux sociaux.

---

## Exemple 1 : Créer un post programmé

### Côté serveur (`/src/server/routers/posts.ts`)

```typescript
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const postsRouter = createTRPCRouter({
  // Créer un post programmé
  createScheduledPost: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1).max(280), // Limite Twitter
        platform: z.enum(['twitter', 'linkedin', 'facebook']),
        scheduledFor: z.date(),
        mediaUrls: z.array(z.string().url()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.create({
        data: {
          ...input,
          userId: ctx.userId,
          status: 'SCHEDULED',
        },
      });
    }),
});
```

### Côté client (`/src/components/dashboard/create-post-form.tsx`)

```typescript
'use client';

import { api } from '@/lib/trpc/trpc-client';
import { useState } from 'react';

export function CreatePostForm() {
  const [content, setContent] = useState('');
  const [scheduledFor, setScheduledFor] = useState(new Date());

  // ✨ Type-safe mutation avec auto-complétion !
  const createPost = api.posts.createScheduledPost.useMutation({
    onSuccess: () => {
      alert('Post programmé !');
    },
  });

  const handleSubmit = () => {
    createPost.mutate({
      content,
      platform: 'twitter',
      scheduledFor,
    });
    // ☝️ TypeScript valide automatiquement les types !
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <input type="datetime-local" /* ... */ />
      <button disabled={createPost.isPending}>
        {createPost.isPending ? 'Programmation...' : 'Programmer'}
      </button>
    </form>
  );
}
```

### Avantages de cette approche

- ✅ Validation Zod automatique (pas besoin de valider côté client ET serveur séparément)
- ✅ Auto-complétion complète de `content`, `platform`, `scheduledFor`
- ✅ Si vous changez le schéma serveur → Erreur TypeScript immédiate côté client
- ✅ États `isPending`, `isError`, `data` gérés automatiquement

---

## Exemple 2 : Dashboard avec stats en temps réel

### Côté serveur (`/src/server/routers/posts.ts`)

```typescript
export const postsRouter = createTRPCRouter({
  // Liste des posts avec filtres
  getMyPosts: protectedProcedure
    .input(
      z.object({
        status: z.enum(['SCHEDULED', 'PUBLISHED', 'FAILED']).optional(),
        platform: z.enum(['twitter', 'linkedin']).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findMany({
        where: {
          userId: ctx.userId,
          status: input.status,
          platform: input.platform,
        },
        orderBy: { scheduledFor: 'asc' },
      });
    }),

  // Stats pour le dashboard
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [scheduled, published, failed] = await Promise.all([
      ctx.prisma.post.count({ where: { userId: ctx.userId, status: 'SCHEDULED' } }),
      ctx.prisma.post.count({ where: { userId: ctx.userId, status: 'PUBLISHED' } }),
      ctx.prisma.post.count({ where: { userId: ctx.userId, status: 'FAILED' } }),
    ]);

    return { scheduled, published, failed };
  }),
});
```

### Côté client (`/src/app/dashboard/page.tsx`)

```typescript
'use client';

import { api } from '@/lib/trpc/trpc-client';

export function DashboardStats() {
  // 🚀 Batching automatique : 2 queries = 1 requête HTTP !
  const { data: stats } = api.posts.getStats.useQuery();
  const { data: posts } = api.posts.getMyPosts.useQuery({
    status: 'SCHEDULED',
  });

  return (
    <div>
      <h2>Stats</h2>
      <p>Posts programmés : {stats?.scheduled}</p>
      <p>Posts publiés : {stats?.published}</p>

      <h2>Prochains posts</h2>
      {posts?.map((post) => (
        <div key={post.id}>
          {post.content} - {post.scheduledFor.toLocaleString()}
        </div>
      ))}
    </div>
  );
}
```

### Avantages de cette approche

- ✅ **Batching** : Les 2 queries partent en 1 seule requête HTTP grâce à `httpBatchLink`
- ✅ Cache intelligent : Si vous revenez sur le dashboard, pas de refetch inutile
- ✅ Type-safe : `post.scheduledFor` est typé comme `Date`, pas `string`
- ✅ Auto-refetch en background si vous laissez l'onglet ouvert

---

## Comparaison : tRPC vs API REST classique

### Avec REST

```typescript
// ❌ Pas de types partagés
const response = await fetch('/api/posts', {
  method: 'POST',
  body: JSON.stringify({ content, platform }),
});
const data = await response.json(); // Type = any 😱
```

### Avec tRPC

```typescript
// ✅ Types automatiques end-to-end
const post = await createPost.mutateAsync({ content, platform });
// post est typé comme : Post (de Prisma)
```

---

## Résumé des bénéfices

1. **Type-safety end-to-end** : Les types sont partagés automatiquement entre client et serveur
2. **DX exceptionnelle** : Auto-complétion, refactoring sûr, détection d'erreurs à la compilation
3. **Performance** : Batching automatique, cache intelligent, optimistic updates
4. **Validation centralisée** : Zod schemas validés côté serveur, réutilisables côté client
5. **Moins de boilerplate** : Pas besoin de définir les routes, méthodes HTTP, parsing, etc.
