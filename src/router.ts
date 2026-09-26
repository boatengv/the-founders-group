import { useEffect, useState } from 'react';

// A small hash router: routes look like #/ventures/fun-marketing?v=x.
export type Route = { path: string[]; query: URLSearchParams };

function parse(): Route {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart] = raw.split('?');
  const path = pathPart.split('/').filter(Boolean);
  return { path, query: new URLSearchParams(queryPart || '') };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parse);
  useEffect(() => {
    const onChange = () => {
      setRoute(parse());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function href(path: string): string {
  return '#' + (path.startsWith('/') ? path : '/' + path);
}
