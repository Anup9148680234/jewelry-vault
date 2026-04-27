import { useEffect, useState } from 'react';

export function useHashRoute() {
  const [route, setRoute] = useState(() => window.location.hash.replace('#', '') || '/');

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.replace('#', '') || '/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (nextRoute) => {
    window.location.hash = nextRoute;
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { route, navigate };
}
