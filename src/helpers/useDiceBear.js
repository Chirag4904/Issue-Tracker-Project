import { useQuery } from "react-query";

export function useDiceBear(name) {
	const profile = useQuery(["users", "image", name], () => {
		return fetch(
			`https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${name}`
		);
	});

	// return fetch(`https://api.dicebear.com/5.x/thumbs/svg?seed=${name}`).then(
	// 	(res) => console.log(res)
	// );

	// console.log(profile);
	return profile;
}
