import React, { useState } from 'react';
import { Confetti } from '@neoconfetti/react';
import styles from "@/app/ui/confetti/effect.module.css";

function MyComponent() {
    const [showConfetti, setShowConfetti] = useState(false);
    const [display, setDisplay] = useState("flex");

    const handleClick = () => {
        setShowConfetti(true);
        setTimeout(() =>{
            setShowConfetti(false);
            setDisplay("none");
        }, 2000);

    };

    return (
        <div className={styles.buttonRoot} style={{display: display}}>
            <button className={styles.button} onClick={handleClick}>افتتاح الموقع</button>

            {showConfetti && <Confetti />}
        </div>
    );
}

export default MyComponent;
