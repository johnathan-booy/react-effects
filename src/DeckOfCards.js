import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card.js";
import("./DeckOfCards.css");

const DeckOfCards = () => {
	const [deckId, setDeckId] = useState(null);
	const [cards, setCards] = useState([]);

	const GetDeck = async () => {
		try {
			const res = await axios.get(
				"https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
			);
			if (!res.data.success) throw new Error("Could not get deck of cards");
			setDeckId(res.data.deck_id);
		} catch (e) {
			alert("Could not create a new deck");
		}
	};

	// Get the deckId on page reload
	useEffect(() => {
		GetDeck();
	}, []);

	const drawCard = async () => {
		try {
			const res = await axios.get(
				`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
			);
			const { code, image, value, suit } = res.data.cards[0];
			setCards([
				...cards,
				{ code, image, value, suit, rotation: randomRotation() },
			]);
		} catch (e) {
			alert("Error: no cards remaining!");
			setCards([]);
			GetDeck();
		}
	};

	const randomRotation = () => Math.floor(Math.random() * 60) + 1 - 20;

	return (
		<div className="DeckOfCards">
			<h2 className="DeckOfCards-header">Deck Of Cards</h2>
			<button className="DeckOfCards-draw" onClick={drawCard}>
				Draw a Card
			</button>

			{cards.length ? (
				<div className="DeckOfCards-cards">
					{cards.map(({ code, image, value, suit, rotation }) => (
						<Card
							key={code}
							code={code}
							image={image}
							value={value}
							suit={suit}
							rotation={rotation}
						/>
					))}
				</div>
			) : null}
		</div>
	);
};
export default DeckOfCards;
