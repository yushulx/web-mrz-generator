# MRZ Generator - Pure JavaScript Version

This is a pure JavaScript implementation of the MRZ (Machine Readable Zone) generator for creating mock travel documents for testing purposes.

## Features

- **Pure JavaScript**
- **Multiple Document Types**: Supports TD1, TD2, TD3, MRVA, and MRVB formats
- **Accurate MRZ Generation**: Implements proper check digit calculations according to ICAO standards
- **Visual Rendering**: Generates mock document images with MRZ zones
- **Random Data Generation**: Creates random but valid MRZ data for testing
- **Lightweight**: Minimal dependencies, runs entirely in the browser

## Supported Document Types

1. **TD3 (Passport)**: 2 lines × 44 characters
2. **TD1 (ID Card)**: 3 lines × 30 characters
3. **TD2 (ID Card)**: 2 lines × 36 characters
4. **MRVA (Visa Type A)**: 2 lines × 44 characters
5. **MRVB (Visa Type B)**: 2 lines × 36 characters

## Usage

### Running the Application

Simply open `index.html` in a modern web browser. No build process or server is required.

### Generating MRZ

1. Select a document type from the dropdown (Passport, ID Card, or Visa)
2. Fill in the document details (or click "Random" for random data)
3. Click "Generate" to create the MRZ
4. The MRZ text and visual representation will be displayed

### Using the MRZ Generator Library

You can use the MRZ generator library programmatically:

```javascript
// Generate a TD3 (Passport) MRZ
const passport = new TD3CodeGenerator(
    'P',           // Document type
    'USA',         // Country code
    'SMITH',       // Surname
    'JOHN',        // Given names
    'L898902C3',   // Document number
    'USA',         // Nationality
    '740812',      // Birth date (YYMMDD)
    'M',           // Sex
    '120415',      // Expiry date (YYMMDD)
    'ZE184226B'    // Optional data
);

console.log(passport.toString());
// Output:
// P<USASMITH<<JOHN<<<<<<<<<<<<<<<<<<<<<<<<<<
// L898902C3USA7408122M1204159ZE184226B<<<<<14

// Generate a TD1 (ID Card) MRZ
const idCard = new TD1CodeGenerator(
    'I',           // Document type
    'USA',         // Country code
    'D23145890',   // Document number
    '740812',      // Birth date
    'M',           // Sex
    '120415',      // Expiry date
    'USA',         // Nationality
    'SMITH',       // Surname
    'JOHN',        // Given names
    '1234567890',  // Optional data 1
    '12345'        // Optional data 2
);

console.log(idCard.toString());
```

## Browser Compatibility

Works in all modern browsers that support:
- ES6 Classes
- Canvas API
- CSS3

## License

MIT License
