import { useQuery } from "react-query";

export function useUserData(userId) {
	const usersData = useQuery(
		["users", userId],
		() => {
			return fetch(`/api/users/${userId}`).then((res) => res.json());
		},
		{
			staleTime: 1000 * 60 * 5, //to make the state fresh for 5 min so that when comp is mounted again it will not fetch the data again and should use cache
		}
	);

	return usersData;
}
