import React from "react";

const Card = ({ code, image, value, suit, rotation }) => (
	<img
		src={image}
		alt={`${value} of ${suit}`}
		style={{ transform: `rotate(${rotation}deg)` }}
	></img>
);

export default Card;
