import styles from './Button.module.css'
import {ReactNode} from "react";
interface ButtonProps {
    handleClick?: () => void;
    handleSubmit?: () => void;
    type?: "button" | "submit" | "reset",
    children?: ReactNode;
    disabled?: boolean;
    width?: number;
    height?: number;
}
const Button = (props: ButtonProps) => {
    const {handleClick, width, height, children,disabled, handleSubmit, type} = props;
    return (
        <button style={{width : width, height: height}} className={styles.button} type={type} onClick={handleClick} onSubmit={handleSubmit} disabled={disabled}>
            <p className={styles.text}>{children}</p>
        </button>
    );
};

export default Button;
