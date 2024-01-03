import API from '@/apis/api';
import ModalCard from '@/components/ModalCard/ModalCard';
import useGetMember from '@/hooks/DropDown/useGetMember';
import useCardData from '@/hooks/ModalCard/useCardData';
import useCardId from '@/hooks/ModalCard/useCardId';
import useDashBoard from '@/hooks/ModalCard/useDashBoard';
import useRedriectByLogin from '@/hooks/useRedriectByLogin';
import useRefresh from '@/hooks/useRefresh';
import { GetServerSidePropsContext } from 'next';
import { useCallback, useEffect } from 'react';

const cardId = 328;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!context.params) {
    return {
      notFound: true,
    };
  }
  const dashboardId = context?.params['dashboardid'];
  return {
    props: {
      dashboardId,
    },
  };
}
interface DashboardEditPageProps {
  dashboardId: number;
}

function BoardID({ dashboardId }: DashboardEditPageProps) {
  useRedriectByLogin();

  const { setCardData } = useCardData();
  const { setCardId } = useCardId();
  const { setTasks } = useDashBoard();
  const { setMembers } = useGetMember();
  const { refresh } = useRefresh();

  const testAPI = useCallback(async () => {
    const test = await API.cards.getCardDetails({ cardId });

    const dashBoard = await API.columns.getColumnList({ dashboardId });
    const getMember = await API.members.getMembersInDashboard({ dashboardId });

    setCardData(test);

    setCardId(cardId);
    setTasks(dashBoard);
    setMembers(getMember);
  }, [dashboardId, setCardData, setCardId, setMembers, setTasks]);

  useEffect(() => {
    testAPI();
  }, [refresh, testAPI]);

  return <ModalCard />;
}

export default BoardID;
