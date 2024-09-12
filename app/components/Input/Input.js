import React from 'react';
import styles from './Input.module.css';

const Input = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      className={styles.Input}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default Input;
