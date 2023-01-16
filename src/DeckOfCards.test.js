import { render } from "@testing-library/react";
import DeckOfCards from "./DeckOfCards";

test("renders without crashing", () => {
	render(<DeckOfCards />);
});
