import { GoIssueOpened, GoIssueClosed, GoComment } from "react-icons/go";
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
	// console.log(labels);
	return (
		<li>
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
