import IssuesList from "../components/IssuesList";
import LabelList from "../components/LabelList";
import { useState } from "react";
import { StatusSelect } from "../components/StatusSelect";
import { Link } from "react-router-dom";
export default function Issues() {
	const [labels, setLabels] = useState([]); //shared state in issueslist and labelslist to know selected label
	const [status, setStatus] = useState(""); //shared state in issueslist and statusselect to know selected status
	return (
		<div>
			<main>
				<section>
					<h1>Issues</h1>
					<IssuesList labels={labels} status={status} />
				</section>
				<aside>
					<LabelList
						selected={labels}
						toggle={(label) =>
							setLabels((currentLabels) =>
								currentLabels.includes(label)
									? currentLabels.filter(
											(currentLabel) => currentLabel !== label
									  )
									: currentLabels.concat(label)
							)
						}
					/>
					<h3>Status</h3>
					<StatusSelect
						value={status}
						onChange={(event) => setStatus(event.target.value)}
					/>
					<hr />
					<Link className="button" to="/add">
						Add Issue
					</Link>
				</aside>
			</main>
		</div>
	);
}
