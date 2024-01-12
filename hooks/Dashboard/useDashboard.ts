import { useRouter } from 'next/router';

import { ApiErrorResponse } from '@/types/apiType';
import { useGetDashboardDetailed } from '@/apis/hooks/dashboard';
import { useGetMembersInDashboard } from '@/apis/hooks/members';

interface useDashboardProps {
  dashboardId: number;
}

const useDashboard = ({ dashboardId }: useDashboardProps) => {
  const router = useRouter();

  const { data: dashboardData, error: dashboardError, isLoading } = useGetDashboardDetailed({ dashboardId });
  const { data: membersInDashboardData, error: MembersError } = useGetMembersInDashboard({ dashboardId });

  const error = MembersError || dashboardError;
  if (error) {
    const apiError = error as ApiErrorResponse;
    if (
      apiError.data?.message === '대시보드의 멤버가 아닙니다.' ||
      apiError.data?.message === '대시보드가 존재하지 않습니다.'
    ) {
      alert('잘못된 접근입니다!');
      router.push('/mydashboard');
    }
  }

  return {
    totalMembers: membersInDashboardData?.totalCount || 0,
    members: membersInDashboardData?.members || [],
    dashboardData: dashboardData || {
      id: 0,
      title: '',
      color: '',
      createdAt: '',
      updatedAt: '',
      createdByMe: false,
      userId: 0,
    },
    isLoading,
  };
};

export default useDashboard;
