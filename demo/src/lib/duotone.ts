/**
 * Generates a random integer between min (inclusive) and max (inclusive).
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random integer.
 */
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates an "effective" and "vivid" duotone color pair
 * by using complementary or near-complementary hues.
 * @returns {{primary: string, secondary: string}} An object containing HSL color strings.
 */
function generateDuotonePair() {
	const primaryHue = getRandomInt(0, 360); // Full spectrum of hues for the primary color

	// Primary color (can be dark or light, let's keep it relatively dark as before)
	const primarySaturation = getRandomInt(60, 90); // Moderately to highly saturated
	const primaryLightness = getRandomInt(15, 35); // Dark
	const primaryColor = `hsl(${primaryHue}, ${primarySaturation}%, ${primaryLightness}%)`;

	// Secondary color (the contrasting one)
	// To make it more vivid, we'll use a complementary hue.
	// A direct complementary is primaryHue + 180.
	// We can add a slight random offset to this for a bit more variety if desired.
	const complementaryHueBase = (primaryHue + 180) % 360;
	const hueOffsetForComplementary = getRandomInt(-20, 20); // Allow some deviation from perfect complementary
	const secondaryHue = (complementaryHueBase + hueOffsetForComplementary + 360) % 360;

	const secondarySaturation = getRandomInt(70, 100); // Can be more vibrant
	const secondaryLightness = getRandomInt(70, 90); // Light, ensuring good contrast with primary's lightness
	const secondaryColor = `hsl(${secondaryHue}, ${secondarySaturation}%, ${secondaryLightness}%)`;

	return {
		primary: primaryColor,
		secondary: secondaryColor
	};
}

/**
 * Generates a new duotone color pair and applies them as CSS variables
 * to the document's root element.
 *
 * The CSS variables set are:
 * --duotone-primary: The primary color.
 * --duotone-secondary: The secondary (contrasting) color.
 */
export function generateAndApplyDuotoneColors() {
	if (typeof document === 'undefined') {
		// Guard against running in a non-browser environment
		console.warn('generateAndApplyDuotoneColors called in a non-browser environment. CSS variables will not be set.');
		return;
	}

	const { primary, secondary } = generateDuotonePair();

	document.documentElement.style.setProperty('--duotone-primary', primary);
	document.documentElement.style.setProperty('--duotone-secondary', secondary);

	console.log(`Applied Complementary Duotone Colors: Primary - ${primary}, Secondary - ${secondary}`);
}