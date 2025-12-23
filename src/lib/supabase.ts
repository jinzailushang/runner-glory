import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'

export function createClientComponentClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 如果环境变量未配置或为默认值，返回null
  if (!url || url === 'your_supabase_url' || !key || key === 'your_supabase_anon_key') {
    console.warn('Supabase not configured, using mock client');
    // 返回一个mock客户端，避免构建时错误
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
        insert: () => Promise.resolve({ error: null }),
        update: () => Promise.resolve({ error: null }),
      }),
    } as any;
  }

  return createBrowserClient(url, key);
}

export async function createServerComponentClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 如果环境变量未配置或为默认值，返回null
  if (!url || url === 'your_supabase_url' || !key || key === 'your_supabase_anon_key') {
    console.warn('Supabase not configured, using mock client');
    // 返回一个mock客户端，避免构建时错误
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
        insert: () => Promise.resolve({ error: null }),
        update: () => Promise.resolve({ error: null }),
      }),
    } as any;
  }

  const { cookies } = await import('next/headers');
  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  });
}

export function createRouteHandlerClient(cookieStore: any) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

// Admin client for server-side operations
export const supabaseAdmin = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || url === 'your_supabase_url' || !key || key === 'your_service_role_key') {
    console.warn('Supabase Admin not configured, using mock client');
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
        insert: () => Promise.resolve({ error: null }),
        update: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      }),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: { path: 'mock' }, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: 'https://picsum.photos/512/512' } }),
        }),
      },
    } as any;
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
})();
