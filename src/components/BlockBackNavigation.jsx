import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useBlockBackNavigation(redirectTo = '/') {
  const navigate = useNavigate();

  useEffect(() => {
    // push a dummy state so back button has something to "consume"
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      navigate(redirectTo, { replace: true });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate, redirectTo]);
}