import { useUserData } from "../helpers/useUserData";
import { GoGear } from "react-icons/go";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
export default function IssueAssignment({ assignee, issueNumber }) {
	const user = useUserData(assignee);
	const [menuOpen, setMenuOpen] = useState(false);
	const usersQuery = useQuery(["users"], () =>
		fetch("/api/users").then((res) => res.json())
	);

	const queryClient = useQueryClient();

	const setAssignment = useMutation(
		(assignee) => {
			return fetch(`/api/issues/${issueNumber}`, {
				method: "PUT",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify({
					assignee,
				}),
			}).then((res) => res.json());
		},
		{
			onMutate: (assignee) => {
				const oldAssignee = queryClient.getQueryData([
					"issues",
					issueNumber,
				]).assignee;

				//optimistic update
				queryClient.setQueryData(["issues", issueNumber], (oldData) => ({
					...oldData,
					assignee,
				}));

				// rollback function if any error occurs this will run
				return function rollback() {
					queryClient.setQueryData(["issues", issueNumber], (oldData) => ({
						...oldData,
						assignee: oldAssignee,
					}));
				};
			},
			onError: (err, status, rollback) => {
				rollback();
			},
			//invalidate query onSettled so that it is the fresh data
			onSettled: () => {
				queryClient.invalidateQueries(["issues", issueNumber], { exact: true });
			},
		}
	);

	return (
		<div className="issue-options">
			<div>
				<span>Assignment</span>
				{user.isSuccess && (
					<div>
						<img
							src={`https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${user.data.name}`}
							alt=""
						/>
						{user.data.name}
					</div>
				)}
			</div>
			<GoGear
				onClick={() => !usersQuery.isLoading && setMenuOpen((open) => !open)}
			/>
			{menuOpen && (
				<div className="picker-menu">
					{usersQuery.data?.map((user) => (
						<div key={user.id} onClick={() => setAssignment.mutate(user.id)}>
							<img
								src={`https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${user.name}`}
								alt=""
							/>
							{user.name}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
