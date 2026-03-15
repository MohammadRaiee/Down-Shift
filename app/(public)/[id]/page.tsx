import React from 'react';

const PartPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <h1>Part Details</h1>
      <p>Part ID: {params.id}</p>
    </div>
  );
};

export default PartPage;
