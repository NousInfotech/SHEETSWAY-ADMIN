import RequestOversightPage from '@/components/admin/RequestOversightPage';
import PageContainer from '@/components/layout/page-container';
import React from 'react';

const page = () => {
  return (
    <PageContainer>
      <div className='container mx-auto'>
        <RequestOversightPage />
      </div>
    </PageContainer>
  );
};

export default page;
