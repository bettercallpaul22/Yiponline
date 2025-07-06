import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Toast from './Toastify';
import { RootState, useAppDispatch } from '@/src/store/store';
import { hideToast } from '@/src/store/toastSlice';

const ToastContainer: React.FC = () => {
  const dispatch = useAppDispatch()
  const toast = useSelector((state: RootState) => state.toast.toast);

  if (!toast) return null;

  return (
    <Toast
      message={toast.message}
      type={toast.type}
      duration={toast.duration}
      position={toast.position}
      onHide={() => dispatch(hideToast())}
    />
  );
};

export default ToastContainer;