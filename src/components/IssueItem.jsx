import { GoIssueOpened, GoIssueClosed, GoComment } from "react-icons/go";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { relativeDate } from "../helpers/relativeDate";
import { useUserData } from "../helpers/useUserData";
import { Label } from "./Label";

export function IssueItem({
	title,
	number,
	assignee,
	commentCount,
	createdBy,
	createdDate,
	labels,
	status,
}) {
	const assigneeUser = useUserData(assignee);
	const createdByUser = useUserData(createdBy);
	const queryClient = useQueryClient();
	// console.log(labels);
	return (
		<li
			onMouseEnter={() => {
				queryClient.prefetchQuery(["issues", number.toString()], () =>
					fetch(`/api/issues/${number}`).then((res) => res.json())
				);
				queryClient.prefetchQuery(
					["issues", number.toString(), "comments"],
					() =>
						fetch(`/api/issues/${number}/comments`).then((res) => res.json())
				);
			}}
		>
			<div>
				{status === "done" || status === "cancelled" ? (
					<GoIssueClosed style={{ color: "red" }} />
				) : (
					<GoIssueOpened style={{ color: "green" }} />
				)}
			</div>
			<div className="issue-content">
				<span>
					<Link to={`/issue/${number}`}>{title}</Link>
					{labels.map((label) => (
						<Label label={label} key={label} />
					))}
				</span>
				<small>
					#{number} opened {relativeDate(createdDate)}{" "}
					{createdByUser.isSuccess ? `by ${createdByUser.data.name}` : ""}
				</small>
			</div>
			{assignee ? (
				<img
					src={
						assigneeUser.isSuccess ? assigneeUser.data.profilePictureUrl : ""
					}
					className="assigned-to"
					alt={assignee}
				/>
			) : null}
			<span className="comment-count">
				{commentCount > 0 ? (
					<>
						<GoComment />
						{commentCount}
					</>
				) : null}
			</span>
		</li>
	);
}
