import fetch from "cross-fetch";

const delimiter = `\``;

const generateRandomIdx = () => Math.floor(Math.random() * 1e16);

// Main function to hit both endpoints
const hitEndpoints = async (box: string): Promise<string | undefined> => {
	const idx = generateRandomIdx();

	const postUrl = "https://ssref.com/linker.cgi";
	const postData = new URLSearchParams({
		out: "js",
		idx: idx.toString(),
		lang: "en",
		since: "2009",
		since_majors: "1871",
		since_minors: "2011",
		minors: "1",
		is_last: "true",
		do_bold_players: "0",
		link_format: "html",
		box: box,
		site: "br",
		calling_domain: "baseball.theater",
	});

	console.log(postData.toString());

	const getUrl = `https://ssref.com/linker.cgi?out=getjs&idx=${idx}&site=br`;

	// Fetch both requests simultaneously
	const [postResponse, getResponse] = await Promise.all([
		fetch(postUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
			},
			body: postData.toString(),
		}),
		fetch(getUrl, {
			method: "GET",
			headers: {
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
			},
		}),
	]);

	// Check for successful responses
	if (postResponse.ok && getResponse.ok) {
		const getText = await getResponse.text();
		console.log(getText);

		return getText;
	} else {
		console.error("Error in responses", {
			postStatus: postResponse.status,
			getStatus: getResponse.status,
		});
	}
};

export const getPlayerLinks = async (
	playerNames: string[],
): Promise<string[]> => {
	const nameReplaceString = JSON.stringify(playerNames).replace(
		/\"/g,
		delimiter,
	);
	const rawResultString = await hitEndpoints(nameReplaceString);
	const resultString = decodeURIComponent(rawResultString ?? "")
		?.trim()
		.replace(/\"/g, "'")
		.replace(new RegExp(delimiter, "g"), '"');
	const pattern = /\[.*\]/;
	const match = resultString.match(pattern)?.[0];
	const result = JSON.parse(match ?? "");
	return result;
};

// Test the function
const testGetPlayerLinks = async () => {
	const testPlayerNames = ["Gunnar Henderson", "Justin Steele"];
	try {
		const results = await getPlayerLinks(testPlayerNames);
		console.log("Test Results:", results);
	} catch (error) {
		console.error("Error during test:", error);
	}
};

testGetPlayerLinks();
