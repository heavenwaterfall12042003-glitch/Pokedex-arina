import { forwardRef, type InputHTMLAttributes, useState } from "react";
import styles from "./fields.module.scss";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  error?: string;
};

const PasswordInput = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...rest }, ref) => {
    const [show, setShow] = useState(false);
    const id = rest.id ?? rest.name ?? Math.random().toString(36).slice(2, 8);

    return (
      <label htmlFor={id} className={styles.field}>
        <span className={styles.label}>{label}</span>
        <div className={styles.passbox}>
          <input
            id={id}
            ref={ref}
            className={styles.input}
            type={show ? "text" : "password"}
            {...rest}
          />
          <button
            type="button"
            className={styles.eye}
            onClick={() => setShow((v) => !v)}
          >
            {show ? "🙈" : "👁️"}
          </button>
        </div>
        {error ? <span className={styles.error}>{error}</span> : null}
      </label>
    );
  }
);

export default PasswordInput;
