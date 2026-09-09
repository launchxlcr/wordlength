import { useEffect, useState } from 'react';

interface Props {
  message: string | null;
  onDismiss: () => void;
}

export default function Toast({ message, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className={`toast${visible ? ' toast--visible' : ''}`}>
      {message}
    </div>
  );
}
