import { GoGear } from "react-icons/go";
import { useLabelsData } from "../helpers/useLabelData";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
export default function IssueLabels({ labels, issueNumber }) {
	const labelsQuery = useLabelsData();
	const [menuOpen, setMenuOpen] = useState(false);

	const queryClient = useQueryClient();
	const setLabels = useMutation(
		(labelId) => {
			const newLabels = labels.includes(labelId)
				? labels.filter((label) => label !== labelId)
				: [...labels, labelId];

			return fetch(`/api/issues/${issueNumber}`, {
				method: "PUT",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify({
					labels: newLabels,
				}),
			}).then((res) => res.json());
		},
		{
			onMutate: (labelId) => {
				const oldLabels = queryClient.getQueryData([
					"issues",
					issueNumber,
				]).labels;

				const newLabels = oldLabels.includes(labelId)
					? oldLabels.filter((label) => label !== labelId)
					: [...oldLabels, labelId];
				//optimistic update
				queryClient.setQueryData(["issues", issueNumber], (oldData) => ({
					...oldData,
					labels: newLabels,
				}));

				// rollback function if any error occurs this will run
				return function rollback() {
					queryClient.setQueryData(["issues", issueNumber], (oldData) => {
						const rollbackLabels = oldLabels.includes(labelId)
							? [...oldLabels, labelId]
							: oldLabels.filter((label) => label !== labelId);
						return {
							...oldData,
							labels: rollbackLabels,
						};
					});
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
				<span>Labels</span>
				{labelsQuery.isLoading
					? null
					: labels.map((label) => {
							const labelObject = labelsQuery.data.find(
								(queryLabel) => queryLabel.id === label
							);
							return (
								<span key={label} className={`label ${labelObject.color}`}>
									{labelObject.name}
								</span>
							);
					  })}
			</div>
			<GoGear
				onClick={() => !labelsQuery.isLoading && setMenuOpen((open) => !open)}
			/>
			{menuOpen && (
				<div className="picker-menu labels">
					{labelsQuery.data?.map((label) => {
						const selected = labels.includes(label.id);
						return (
							<div
								key={label.id}
								className={selected ? "selected" : ""}
								onClick={() => setLabels.mutate(label.id)}
							>
								<span
									style={{ backgroundColor: label.color }}
									className="label-dot"
								></span>
								{label.name}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
