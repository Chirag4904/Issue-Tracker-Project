import { useLabelsData } from "../helpers/useLabelData";

export default function LabelList({ selected, toggle }) {
	const labelsQuery = useLabelsData();

	return (
		<div className="labels">
			<h3>Labels</h3>
			{labelsQuery.isLoading ? (
				<p>Loading...</p>
			) : (
				<ul className="">
					{labelsQuery.data.map((label) => {
						return (
							<li key={label.id}>
								<button
									onClick={() => toggle(label.id)}
									className={`label ${
										selected.includes(label.id) ? "selected" : ""
									} ${label.color}`}
								>
									{label.name}
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
