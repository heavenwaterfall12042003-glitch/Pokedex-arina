import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./fields.module.scss";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...rest }, ref) => {
    const id = rest.id ?? rest.name ?? Math.random().toString(36).slice(2, 8);
    return (
      <label htmlFor={id} className={styles.field}>
        <span className={styles.label}>{label}</span>
        <input id={id} ref={ref} className={styles.input} {...rest} />
        {error ? <span className={styles.error}>{error}</span> : null}
      </label>
    );
  }
);

export default Input;
