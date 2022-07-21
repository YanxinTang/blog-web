import { useRouter } from 'next/router';
import { useCallback } from 'react';

interface TransitionOptions {
  shallow?: boolean;
  locale?: string | false;
  scroll?: boolean;
}

export function useReloadServerSideData() {
  const router = useRouter();

  return useCallback(
    (options: TransitionOptions = {}) => {
      router.replace(router.asPath, router.asPath, { scroll: false, ...options });
    },
    [router]
  );
}
