import * as React from 'react';

const SEARCH_PARAMS_CHANGE_EVENT = 'admin-search-params-change';

type SetSearchParams = (
  nextInit: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
) => void;

const safeDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const getPathSegments = (pathname: string) => {
  return pathname.split('/').filter(Boolean).map(safeDecodeURIComponent);
};

const getCurrentPathname = () => {
  return typeof window === 'undefined' ? '' : window.location.pathname;
};

const getCurrentSearch = () => {
  return typeof window === 'undefined' ? '' : window.location.search;
};

export const getAdminBasePath = (pathname = getCurrentPathname()) => {
  const segments = getPathSegments(pathname);
  const appIndex = segments.indexOf('app');

  if (appIndex === -1) {
    return '';
  }

  return `/${segments.slice(0, appIndex + 1).join('/')}`;
};

export const getAdminHref = (path: string, pathname = getCurrentPathname()) => {
  const basePath = getAdminBasePath(pathname);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!basePath || normalizedPath.startsWith(`${basePath}/`)) {
    return normalizedPath;
  }

  return `${basePath}${normalizedPath}`;
};

export const getAdminPathParam = (
  segment: string,
  pathname = getCurrentPathname(),
) => {
  const segments = getPathSegments(pathname);
  const segmentIndex = segments.indexOf(segment);

  if (segmentIndex === -1) {
    return undefined;
  }

  return segments[segmentIndex + 1];
};

export const useAdminSearchParams = (): [
  URLSearchParams,
  SetSearchParams,
] => {
  const [search, setSearch] = React.useState(getCurrentSearch);

  React.useEffect(() => {
    const syncSearch = () => {
      setSearch(getCurrentSearch());
    };

    window.addEventListener('popstate', syncSearch);
    window.addEventListener(SEARCH_PARAMS_CHANGE_EVENT, syncSearch);

    return () => {
      window.removeEventListener('popstate', syncSearch);
      window.removeEventListener(SEARCH_PARAMS_CHANGE_EVENT, syncSearch);
    };
  }, []);

  const searchParams = React.useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  const setSearchParams = React.useCallback<SetSearchParams>((nextInit) => {
    if (typeof window === 'undefined') {
      return;
    }

    const prev = new URLSearchParams(window.location.search);
    const next =
      typeof nextInit === 'function' ? nextInit(prev) : new URLSearchParams(nextInit);
    const query = next.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${
      window.location.hash
    }`;

    window.history.pushState(null, '', nextUrl);
    setSearch(window.location.search);
    window.dispatchEvent(new Event(SEARCH_PARAMS_CHANGE_EVENT));
  }, []);

  return [searchParams, setSearchParams];
};
