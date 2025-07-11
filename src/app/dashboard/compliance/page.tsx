import PageContainer from "@/components/layout/page-container";
import ComplianceMonitoringPage from "@/components/admin/ComplianceMonitoringPage";

export default function CompliancePageRoute() {
  return (
    <PageContainer>
      <div className="container mx-auto">
        <ComplianceMonitoringPage />
      </div>
    </PageContainer>
  );
}
