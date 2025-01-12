import { useEffect, useState } from 'react';
import { Alert } from './ui/alert'

interface Props {
  message: string
}

function AlertMessage({ message }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000); // Adjust the timeout duration as needed

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div>
      <Alert status="info" title={`${message}`} />
    </div>
  )
}

export default AlertMessage