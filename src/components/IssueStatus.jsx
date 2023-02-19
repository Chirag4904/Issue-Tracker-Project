import { useMutation, useQueryClient } from "react-query";
import { StatusSelect } from "./StatusSelect";
export default function IssueStatus({ status, issueNumber }) {
	const queryClient = useQueryClient();
	const setStatus = useMutation(
		(status) => {
			fetch(`/api/issues/${issueNumber}`, {
				method: "PUT",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify({
					status,
				}),
			}).then((res) => res.json());
		},
		{
			onMutate: (status) => {
				const oldStatus = queryClient.getQueryData([
					"issues",
					issueNumber,
				]).status;

				//optimistic update
				queryClient.setQueryData(["issues", issueNumber], (oldData) => ({
					...oldData,
					status,
				}));

				// rollback function if any error occurs this will run
				return function rollback() {
					queryClient.setQueryData(["issues", issueNumber], (oldData) => ({
						...oldData,
						oldStatus,
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
				<span>Status</span>
				<StatusSelect
					noEmptyOption
					value={status}
					onChange={(e) => setStatus.mutate(e.target.value)}
				/>
			</div>
		</div>
	);
}
