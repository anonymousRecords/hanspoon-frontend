import { useParams } from "react-router";

export const useShareId = () => {
	const { shareId: currentShareId } = useParams<{ shareId: string }>();
	if (currentShareId === undefined) {
		throw new Error("공유 ID가 없습니다.");
	}

	return currentShareId;
};
