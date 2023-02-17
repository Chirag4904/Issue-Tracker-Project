import { useQuery, useQueryClient } from "react-query";
import { IssueItem } from "./IssueItem";
import { useState } from "react";
import fetchWithError from "../helpers/fetchWithError";
import Loader from "./Loader";
export default function IssuesList({ labels, status }) {
	const queryClient = useQueryClient();
	const issuesQuery = useQuery(
		["issues", { labels, status }],
		async () => {
			const statusString = status ? `&status=${status}` : "";
			const labelsString = labels.map((label) => `labels[]=${label}`).join("&");
			// console.log(labelsString);
			const results = await fetchWithError(
				`/api/issues?${labelsString}${statusString}`
			);
			results.forEach((issue) => {
				queryClient.setQueryData(["issues", issue.number.toString()], issue);
			});
			return results;
		},
		{
			staleTime: 1000 * 60,
		}
		// {
		// 	staleTime: 1000 * 20,
		// 	refetchOnWindowFocus: false,
		// 	refetchOnReconnect: false,
		// 	refetchInterval: 5000,
		// }
	);

	const [searchValue, setSearchValue] = useState("");

	const searchQuery = useQuery(
		["issues", "search", searchValue],
		({ signal }) => {
			return fetch(`/api/search/issues?q=${searchValue}`, { signal }).then(
				(res) => res.json()
			);
		},
		{
			enabled: searchValue.length > 0,
		}
	);

	// console.log("hello bhailog");

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					setSearchValue(e.target.elements.search.value);
				}}
			>
				<label htmlFor="search">Search Issues</label>
				<input
					type="search"
					placeholder="Search"
					name="search"
					id="search"
					onChange={(e) => {
						if (e.target.value.length === 0) setSearchValue(e.target.value);
					}}
				/>
			</form>
			<h2>Issues List {issuesQuery.isFetching && <Loader />}</h2>
			{issuesQuery.isLoading ? (
				<p>Loading...</p>
			) : issuesQuery.isError ? (
				<p>{issuesQuery.error.message}</p>
			) : searchQuery.fetchStatus === "idle" && searchQuery.isLoading ? (
				<ul className="issues-list">
					{issuesQuery.data.map((issue) => {
						return (
							<IssueItem
								key={issue.id}
								title={issue.title}
								number={issue.number}
								assignee={issue.assignee}
								commentCount={issue.comments.length}
								createdBy={issue.createdBy}
								createdDate={issue.createdDate}
								labels={issue.labels}
								status={issue.status}
							/>
						);
					})}
				</ul>
			) : (
				<>
					<h2>Search Results</h2>
					{searchQuery.isLoading ? (
						<p>Loading...</p>
					) : (
						<>
							<p>{searchQuery.data.count} Results</p>
							<ul className="issues-list">
								{searchQuery.data.items.map((issue) => {
									return (
										<IssueItem
											key={issue.id}
											title={issue.title}
											number={issue.number}
											assignee={issue.assignee}
											commentCount={issue.comments.length}
											createdBy={issue.createdBy}
											createdDate={issue.createdDate}
											labels={issue.labels}
											status={issue.status}
										/>
									);
								})}
							</ul>
						</>
					)}
				</>
			)}
		</div>
	);
}
