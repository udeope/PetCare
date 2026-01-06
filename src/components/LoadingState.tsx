import { Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = 'Cargando...'
}: LoadingStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 text-pet-primary animate-spin mb-4" />
        <p className="text-gray-500">{message}</p>
      </CardContent>
    </Card>
  );
}
