import React from 'react';
import DraggableButton from '../../components/DraggableButton';

interface Props {}

const Content: React.FC<Props> = () => {
  const handleClick = () => {
    console.log('Button clicked!');
  };
  return (
    <>
      <DraggableButton handleClick={handleClick} />
    </>
  );
};

export default Content;
