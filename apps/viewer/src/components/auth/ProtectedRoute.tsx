import type { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet, useLocation } from "react-router";
import { userInfoQueryOptions } from "../../queries/userInfo";

interface ProtectedRouteProps {
	condition?: (user: User) => boolean;
	redirectPath?: string;
	loadingFallback?: React.ReactNode;
}

export const ProtectedRoute = ({
	condition,
	redirectPath = "/",
	loadingFallback = (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
			}}
		>
			인증 중...
		</div>
	),
}: ProtectedRouteProps) => {
	const { data: user, isLoading } = useQuery(userInfoQueryOptions);
	const location = useLocation();

	if (isLoading) {
		return <>{loadingFallback}</>;
	}

	if (!user) {
		return <Navigate to={redirectPath} state={{ from: location }} replace />;
	}

	if (condition && !condition(user)) {
		return <Navigate to={redirectPath} state={{ from: location }} replace />;
	}

	return <Outlet />;
};
