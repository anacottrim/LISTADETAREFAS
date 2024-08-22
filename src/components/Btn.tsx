import React from 'react';
import styles from './Btn.module.css'; 
interface BtnProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const Btn: React.FC<BtnProps> = ({ onClick, children, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.btn} ${className}`}
    >
      {children}
    </button>
  );
};

export default Btn;
