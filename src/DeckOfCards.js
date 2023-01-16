import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Card from "./Card.js";
import("./DeckOfCards.css");

const DeckOfCards = () => {
	const [deckId, setDeckId] = useState(null);
	const [cards, setCards] = useState([]);
	const [autoDraw, setAutoDraw] = useState(false);
	const timerRef = useRef();

	//  Get a new deckId from the API
	const getDeck = async () => {
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

	// Draw a card from deck
	const drawCard = async () => {
		const randomAroundZero = (num) =>
			Math.floor(Math.random() * num) + 1 - num / 2;
		try {
			const res = await axios.get(
				`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
			);
			const { code, image, value, suit } = res.data.cards[0];
			setCards((cards) => [
				...cards,
				{
					code,
					image,
					value,
					suit,
					rotation: randomAroundZero(60),
				},
			]);
		} catch (e) {
			alert("Error: no cards remaining!");
			setCards([]);
			getDeck();
			setAutoDraw(false);
		}
	};

	// When button is clicked, start or stop drawing cards
	const toggleAutoDraw = () => {
		setAutoDraw((prevAutoDraw) => !prevAutoDraw);
	};

	// Get the deckId on page reload
	useEffect(() => {
		getDeck();
	}, []);

	// Set timer for drawing cards
	useEffect(() => {
		if (autoDraw && deckId) {
			timerRef.current = setInterval(() => {
				drawCard();
			}, 500);
		}

		return function timerCleanup() {
			clearInterval(timerRef.current);
		};
	}, [autoDraw]);

	return (
		<div className="DeckOfCards">
			<h2 className="DeckOfCards-header">Deck Of Cards</h2>
			<button className="DeckOfCards-draw" onClick={toggleAutoDraw}>
				{autoDraw ? "Stop" : "Start"} Drawing
			</button>

			{cards.length > 0 && (
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
			)}
		</div>
	);
};
export default DeckOfCards;
