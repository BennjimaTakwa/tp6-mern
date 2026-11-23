import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../redux/uiSlice';

// Défi 3 : la notification lit la slice "ui" du store
export default function NotificationToast() {
  const { message, visible } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  // Elle disparaît toute seule après 3 secondes
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => dispatch(hideToast()), 3000);
    return () => clearTimeout(timer);
  }, [visible, message, dispatch]);

  if (!visible) return null;

  return <div className="toast">{message}</div>;
}
