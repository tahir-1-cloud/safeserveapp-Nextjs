'use client';

import { Spin } from 'antd';
import React from 'react';

interface CustomLoaderProps {
  size?: 'small' | 'default' | 'large';
}

const CustomLoader: React.FC<CustomLoaderProps> = ({ size = 'large' }) => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Spin
        size={size}
        className="text-blue-600"
        style={{ animationDuration: '0.6s' }} // makes spin visually faster
      />
    </div>
  );
};

export default CustomLoader;
