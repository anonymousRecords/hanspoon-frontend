import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BaseLayout } from "../../../components/layout/BaseLayout";
import { PostGrid } from "../../../components/share/PostGrid";
import { Profile } from "../../../components/share/Profile";

export const ProfileEditPage = () => {
	return (
		<ErrorBoundary fallback={<div>error</div>}>
			<BaseLayout>
				<Suspense fallback={null}>
					<Profile />
				</Suspense>
				<section style={{ width: "820px" }}>
					<PostGrid isEditable={true} />
				</section>
			</BaseLayout>
		</ErrorBoundary>
	);
};
