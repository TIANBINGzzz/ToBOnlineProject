import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Popup = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${(props) => props.color};
    color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    min-width: 300px;
    text-align: center;
    opacity: ${(props) => props.opacity};
    transition: opacity 1s ease-out;
`;


function ErrorMessage ({ errormessage, duration = 1000, color = 'rgba(255, 0, 0, 0.8)', onClose }) {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpacity(0);
        }, duration);

        const cleanup = setTimeout(() => {
            if (onClose) onClose();
        }, duration + 300);

        return () => {
            clearTimeout(timer);
            clearTimeout(cleanup);
        };
    }, [duration, onClose]);

    return <Popup opacity={opacity} color={color}>{errormessage}</Popup>;
}

export default ErrorMessage
