import React from 'react';
import { Card as AntdCard } from 'antd';

interface CardProps {
    title?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = (props) => {
    return (
        <AntdCard
            style={{
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                marginBottom: '20px',
            }}>
            {props.children}
        </AntdCard>
    );
};

export default Card;