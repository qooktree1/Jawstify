import { useEffect, useState } from 'react';

import useDeviceType from '@/hooks/Common/useDeviceType';
import { DashboardType } from '@/types/apiType';
import { useCorrectDashboard } from '@/apis/hooks/dashboard';

interface useDashboardEditProps {
  dashboardData: DashboardType;
}

function useDashboardEdit({ dashboardData }: useDashboardEditProps) {
  const [values, setValues] = useState({
    '대시보드 이름': dashboardData.title,
    색상: dashboardData.color,
  });
  const deviceType = useDeviceType();
  const handleChange = (inputLabel: string, inputValue: string) => {
    setValues({
      ...values,
      [inputLabel]: inputValue,
    });
  };

  const { mutate: correctDashboardMutate } = useCorrectDashboard({ dashboardId: dashboardData.id });
  const handleSubmit = async () => {
    if (values['대시보드 이름'].length > 10) {
      alert('10글자 이하로 작성해주세요.');
      return;
    } else if (values['대시보드 이름'].length === 0) {
      alert('값을 입력해주세요.');
      return;
    }

    await correctDashboardMutate({
      dashboardId: Number(dashboardData.id),
      title: values['대시보드 이름'],
      color: values['색상'],
    });
  };

  useEffect(() => {
    setValues({
      '대시보드 이름': dashboardData.title,
      색상: dashboardData.color,
    });
  }, [dashboardData]);

  return { deviceType, handleChange, values, handleSubmit };
}

export default useDashboardEdit;
