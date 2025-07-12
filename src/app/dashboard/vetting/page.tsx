import VettingCenterPage from '@/components/admin/VettingCenterPage'
import PageContainer from '@/components/layout/page-container'
import React from 'react'

const page = () => {
  return (
    <PageContainer>
        <div className="container mx-auto">
            <VettingCenterPage />
        </div>
    </PageContainer>
  )
}

export default page