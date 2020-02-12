/**
 * Zero dependency murmur2 buffer hash algorithm implementation in JavaScript
 * Originally created by Austin Appleby
 * Inspired by flagUpDown's code and CAV2's whitespace remotion code
 * @see https://github.com/flagUpDown/murmurhash-node
 * @author Matheus Giovani (https://github.com/theprometeus)
 * @author Arzio (https://github.com/arzio)
 */

"use strict";

/**
 * Magic constant values
 */
const MURMURHASH_M = 0x5bd1e995;
const MURMURHASH_R = 24;

/**
 * Multiples two hash values
 * @return {uint}
 */
function imul32(a, b) {
	let aHi 	= (a >>> 16) & 0xffff;
	let aLo 	= a & 0xffff;
	let bHi 	= (b >>> 16) & 0xffff;
	let bLo 	= b & 0xffff;

	// The shift by 0 fixes the sign on the high part
  	return aLo * bLo + (((aHi * bLo + aLo * bHi) << 16) >>> 0);
}

/**
 * Remove whitespaces from a buffer
 * @param  {ArrayBuffer} buff Buffer to have the whitespaces removed
 * @return {Uint8Array}
 */
function removeBufferWhitespaces(buff) {
	/**
	 * Final ArrayBuffer
	 * @type {Array}
	 */
	let fBuff 	= [];

	// Current byte handler
	let byte 	= 0;

	// Iterate over all buffer bytes
	for(let i = 0; i < buff.length; i++) {
		// Get current byte
		byte 	= buff[i];

		// Check if byte is not a whitespace
		if (!(byte === 9 || byte === 10 || byte === 13 || byte === 32)) {
			// Push byte into new final array
			fBuff.push(byte);
		}	
	}

	// Return treated ArrayBuffer
	return new Uint8Array(fBuff);
}

/**
 * Calculate murmur hash v2 from an ArrayBuffer
 * @param  {ArrayBuffer}  key          The array buffer to be hashed
 * @param  {Number}  seed              Starting seed
 * @param  {Boolean} removeWhitespaces Needs to remove whitespaces?
 * @return {UInt}                      Unsigned hash int
 */
function murmurHash(key, seed = 0, removeWhitespaces = false) {
	// Check if we need to remove whitespaces frmo the buffer
	if (removeWhitespaces) {
		// Get treated buffer
		key 	= removeBufferWhitespaces(key);
	}

	// Get the array buffer length
	let len 	= key.length;

	// Set initial hash to a random value based on the seed
	let h 		= seed ^ len;

	// Current index handler
	let i 		= 0;

	// Current value handler
	let k 		= 0;

	// While we don't the reach last four bytes
	while (len >= 4) {
		// Get four shifted XORed bytes
		k 		= key[i++] | (key[i++] << 8) | (key[i++] << 16) | (key[i++] << 24);

		// Multiply the value by the magical M
		k 		= imul32(k, MURMURHASH_M);

		// XOR the value by the right shift of the value by magial R
		k 		^= k >>> MURMURHASH_R;

		// Multiply the value by the magical M
		k 		= imul32(k, MURMURHASH_M);

		// Multiply the hash by the magical M and then shift it by the value
		h 		= imul32(h, MURMURHASH_M) ^ k;

		// Drecrease the length
		len 	-= 4;
	}

	// Switch over the remaining size
	switch (len) {
		// Case three
		case 3:
			// XOR the hash by the three last values and left shift by 16
			h 	^= key[i + 2] << 16;
		case 2:
			// XOR the hash by the last two values and shift by 8
			h 	^= key[i + 1] << 8;
		case 1:
			// XOR the hash by the last value
			h 	^= key[i];

			// Always multiply the hash by the magical M
			h 	= imul32(h, MURMURHASH_M);
	}

	// XOR and shift hash by 13
	h 			^= h >>> 13;
	// Multiply the hash by magical M
	h 			= imul32(h, MURMURHASH_M);
	h 			^= h >>> 15;

	// Return a murr ;3 unsigned int
	return h >>> 0;
}

module.exports 	= murmurHash;
