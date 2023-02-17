import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { worker } from "@uidotdev/react-query-api";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60,
		},
	},
});

new Promise((res) => setTimeout(res, 100))
	.then(() =>
		worker.start({
			quiet: true,
			onUnhandledRequest: "bypass",
		})
	)
	.then(() => {
		ReactDOM.createRoot(document.getElementById("root")).render(
			<React.StrictMode>
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<div className="container">
							<App />
						</div>
						<ReactQueryDevtools initialIsOpen={false} />
					</BrowserRouter>
				</QueryClientProvider>
			</React.StrictMode>
		);
	});
