import { ROUTES } from '@constants/routes';
import Button from '@namo-workspace/ui/Button';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

export default function Error() {
  const navigate = useNavigate();
  const handleGoHome = useCallback(() => {
    navigate(ROUTES.HOME);
  }, [navigate]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <strong className="mb-2">Something went wrong!</strong>

      <Button onClick={handleGoHome}>Go Home</Button>
    </div>
  );
}
