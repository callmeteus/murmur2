# murmur2
Zero dependency murmur2 buffer hash algorithm implementation in JavaScript

Originaly created by Austin Appleby
Inspired by flagUpDown's code and CAV2's whitespace remotion code

# How to use
```
const murmur2 = require("murmur2");

const removeWhitespaces = false;
const seed = 0;

const buffer = Buffer.from([1, 2, 3, 4]);

const hash = murmur2(1487941662, seed, removeWhitespaces); // Should return 1487941662
```

Special thanks to @arzio
