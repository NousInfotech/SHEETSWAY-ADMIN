import VettingCenterPage from '@/components/admin/VettingCenterPage'
import VettingAuditFirmPage from '@/features/vetting/components/VettingAuditFirmPage'
import PageContainer from '@/components/layout/page-container'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import React from 'react'

const page = () => {
  return (
    <PageContainer>
        <div className="container mx-auto">
            <Tabs defaultValue="auditors" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="auditors">Auditor Vetting</TabsTrigger>
                    <TabsTrigger value="audit-firms">Audit Firm Vetting</TabsTrigger>
                </TabsList>
                <TabsContent value="auditors" className="mt-6">
                    <VettingCenterPage />
                </TabsContent>
                <TabsContent value="audit-firms" className="mt-6">
                    <VettingAuditFirmPage />
                </TabsContent>
            </Tabs>
        </div>
    </PageContainer>
  )
}

export default page