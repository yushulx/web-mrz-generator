// DOM Elements
let dropdown = document.getElementById("dropdown");
let document_type_txt = document.getElementById("document_type_txt");
let country_code_txt = document.getElementById("country_code_txt");
let birth_date_txt = document.getElementById("birth_date_txt");
let document_number_txt = document.getElementById("document_number_txt");
let sex_txt = document.getElementById('sex_txt');
let expiry_date_txt = document.getElementById('expiry_date_txt');
let nationality_txt = document.getElementById('nationality_txt');
let surname_txt = document.getElementById('surname_txt');
let given_names_txt = document.getElementById('given_names_txt');
let optional_data1_txt = document.getElementById('optional_data1_txt');
let optional_data2_txt = document.getElementById('optional_data2_txt');

const VALID_COUNTRY_CODES = ['USA', 'CAN', 'GBR', 'AUS', 'FRA', 'CHN', 'IND', 'BRA', 'JPN', 'ZAF', 'RUS', 'MEX', 'ITA', 'ESP', 'NLD', 'SWE', 'ARG', 'BEL', 'CHE'];

let dataFromGenerator = '';
let lines = [];

// Utility Functions
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDate(startYear = 1900, endYear = new Date().getFullYear()) {
    let year = randomIntFromInterval(startYear, endYear);
    let month = randomIntFromInterval(1, 12);
    let day;

    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
        day = randomIntFromInterval(1, 31);
    } else if ([4, 6, 9, 11].includes(month)) {
        day = randomIntFromInterval(1, 30);
    } else { // February
        if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) { // leap year
            day = randomIntFromInterval(1, 29);
        } else {
            day = randomIntFromInterval(1, 28);
        }
    }

    let date = new Date(year, month - 1, day);
    return date;
}

function formatDate(date) {
    return date.toISOString().slice(2, 10).replace(/-/g, "");
}

function randomString(length = 10, allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }
    return result;
}

function randomMRZData() {
    let surname = randomString(randomIntFromInterval(3, 7));
    let givenName = randomString(randomIntFromInterval(3, 7));
    let nationality = VALID_COUNTRY_CODES[Math.floor(Math.random() * VALID_COUNTRY_CODES.length)];
    let sex = Math.random() < 0.5 ? 'M' : 'F';
    let documentNumber = randomString(9, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    let birthDate = randomDate();
    let expiryDate = randomDate(new Date().getFullYear(), new Date().getFullYear() + 10);

    return {
        'Surname': surname,
        'Given Name': givenName,
        'Nationality': nationality,
        'Sex': sex,
        'Document Number': documentNumber,
        'Birth Date': formatDate(birthDate),
        'Expiry Date': formatDate(expiryDate)
    };
}

function createRandomData() {
    data = randomMRZData();
    surname_txt.value = data['Surname'];
    given_names_txt.value = data['Given Name'];
    nationality_txt.value = data['Nationality'];
    country_code_txt.value = nationality_txt.value;
    sex_txt.value = data['Sex'];
    document_number_txt.value = data['Document Number'];
    birth_date_txt.value = data['Birth Date'];
    expiry_date_txt.value = data['Expiry Date'];
}

// Initialize with default data
document_type_txt.value = 'P';
createRandomData();

// Hide loading indicator on page load
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("loading-indicator").style.display = "none";
});

// Event Handlers
function selectChanged() {
    if (dropdown.value === 'ID Card(TD1)') {
        document_type_txt.value = 'I';
    } else if (dropdown.value === 'ID Card(TD2)') {
        document_type_txt.value = 'I';
    } else if (dropdown.value == 'Passport(TD3)') {
        document_type_txt.value = 'P';
    } else if (dropdown.value == 'Visa(A)') {
        document_type_txt.value = 'V';
    } else if (dropdown.value == 'Visa(B)') {
        document_type_txt.value = 'V';
    }

    createRandomData();
    generate();
}

function randomize() {
    createRandomData();
    generate();
}

function generate() {
    try {
        let generator;

        if (dropdown.value === 'ID Card(TD1)') {
            generator = new TD1CodeGenerator(
                document_type_txt.value,
                country_code_txt.value,
                document_number_txt.value,
                birth_date_txt.value,
                sex_txt.value,
                expiry_date_txt.value,
                nationality_txt.value,
                surname_txt.value,
                given_names_txt.value,
                optional_data1_txt.value,
                optional_data2_txt.value
            );
        } else if (dropdown.value === 'ID Card(TD2)') {
            generator = new TD2CodeGenerator(
                document_type_txt.value,
                country_code_txt.value,
                surname_txt.value,
                given_names_txt.value,
                document_number_txt.value,
                nationality_txt.value,
                birth_date_txt.value,
                sex_txt.value,
                expiry_date_txt.value,
                optional_data1_txt.value
            );
        } else if (dropdown.value === 'Passport(TD3)') {
            generator = new TD3CodeGenerator(
                document_type_txt.value,
                country_code_txt.value,
                surname_txt.value,
                given_names_txt.value,
                document_number_txt.value,
                nationality_txt.value,
                birth_date_txt.value,
                sex_txt.value,
                expiry_date_txt.value,
                optional_data1_txt.value
            );
        } else if (dropdown.value === 'Visa(A)') {
            generator = new MRVACodeGenerator(
                document_type_txt.value,
                country_code_txt.value,
                surname_txt.value,
                given_names_txt.value,
                document_number_txt.value,
                nationality_txt.value,
                birth_date_txt.value,
                sex_txt.value,
                expiry_date_txt.value,
                optional_data1_txt.value
            );
        } else if (dropdown.value === 'Visa(B)') {
            generator = new MRVBCodeGenerator(
                document_type_txt.value,
                country_code_txt.value,
                surname_txt.value,
                given_names_txt.value,
                document_number_txt.value,
                nationality_txt.value,
                birth_date_txt.value,
                sex_txt.value,
                expiry_date_txt.value,
                optional_data1_txt.value
            );
        }

        dataFromGenerator = generator.toString();
        document.getElementById("outputMRZ").value = dataFromGenerator;
        drawImage();
    } catch (error) {
        console.error('Error generating MRZ:', error);
        document.getElementById("outputMRZ").value = 'Error: ' + error.message;
    }
}

function drawImage() {
    let canvas = document.getElementById("overlay");
    let ctx = canvas.getContext("2d");

    // Set canvas dimensions based on document type
    const isPassport = dropdown.value === 'Passport(TD3)';
    canvas.width = 900;
    canvas.height = isPassport ? 640 : 580;

    // Helper function to truncate text if it exceeds max width
    function truncateText(text, font, maxWidth) {
        ctx.font = font;
        if (ctx.measureText(text).width <= maxWidth) {
            return text;
        }

        let truncated = text;
        while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
            truncated = truncated.slice(0, -1);
        }
        return truncated + (truncated.length < text.length ? '...' : '');
    }

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#e8f4f8');
    gradient.addColorStop(0.5, '#d4e9f2');
    gradient.addColorStop(1, '#c1dfe9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw decorative pattern
    ctx.save();
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 60 + 20;
        ctx.fillStyle = '#4a90a4';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    // Draw main document area with rounded corners
    const docMargin = 40;
    const docWidth = canvas.width - docMargin * 2;
    const docHeight = canvas.height - docMargin * 2;
    const cornerRadius = 15;

    // Document shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;

    // Document background
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(docMargin, docMargin, docWidth, docHeight, cornerRadius);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw subtle border
    ctx.strokeStyle = '#b0c4de';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(docMargin, docMargin, docWidth, docHeight, cornerRadius);
    ctx.stroke();

    lines = dataFromGenerator.split('\n');

    // Draw header section (smaller for real passport look)
    const headerHeight = 60;
    const headerGradient = ctx.createLinearGradient(docMargin, docMargin, docMargin + docWidth, docMargin + headerHeight);
    headerGradient.addColorStop(0, '#667eea');
    headerGradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = headerGradient;
    ctx.beginPath();
    ctx.roundRect(docMargin, docMargin, docWidth, headerHeight, [cornerRadius, cornerRadius, 0, 0]);
    ctx.fill();

    // Country emblem/code
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(docMargin + 45, docMargin + 30, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(country_code_txt.value, docMargin + 45, docMargin + 36);

    // Title
    ctx.fillStyle = "white";
    ctx.textAlign = 'left';
    ctx.font = 'bold 24px "Arial"';
    let titleText = '';
    if (dropdown.value === 'ID Card(TD1)' || dropdown.value === 'ID Card(TD2)') {
        titleText = 'IDENTIFICATION CARD';
    } else if (dropdown.value === 'Passport(TD3)') {
        titleText = 'PASSPORT';
    } else {
        titleText = 'VISA';
    }
    ctx.fillText(titleText, docMargin + 85, docMargin + 30);

    // Subtitle
    ctx.font = '11px "Arial"';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(country_code_txt.value, docMargin + 85, docMargin + 48);

    // Main content area starts after header
    const contentStartY = docMargin + headerHeight + 25;

    // Photo area (like a real passport)
    const photoX = docMargin + 50;
    const photoY = contentStartY;
    const photoWidth = 140;
    const photoHeight = 180;

    // Draw photo placeholder with gradient
    const photoGradient = ctx.createLinearGradient(photoX, photoY, photoX + photoWidth, photoY + photoHeight);
    photoGradient.addColorStop(0, '#e2e8f0');
    photoGradient.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = photoGradient;
    ctx.fillRect(photoX, photoY, photoWidth, photoHeight);

    // Photo border
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);

    // Photo icon/placeholder
    ctx.fillStyle = '#64748b';
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(photoX + photoWidth / 2, photoY + photoHeight / 2 - 15, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(photoX + photoWidth / 2, photoY + photoHeight / 2 + 45, 45, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Photo label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PHOTO', photoX + photoWidth / 2, photoY + photoHeight + 15);

    // Info area - to the right of photo
    ctx.textAlign = 'left';
    ctx.fillStyle = "#1e293b";
    const infoX = photoX + photoWidth + 40;
    const infoWidth = docWidth - (infoX - docMargin) - 50;
    let currentY = contentStartY;
    const fieldGap = 28;

    // Upper section fields
    ctx.font = '10px "Arial"';
    ctx.fillStyle = '#64748b';
    ctx.fillText('SURNAME', infoX, currentY);
    ctx.font = 'bold 16px "Arial"';
    ctx.fillStyle = '#1e293b';
    const surname = truncateText(surname_txt.value, 'bold 16px "Arial"', infoWidth);
    ctx.fillText(surname, infoX, currentY + 16);
    currentY += fieldGap;

    ctx.font = '10px "Arial"';
    ctx.fillStyle = '#64748b';
    ctx.fillText('GIVEN NAMES', infoX, currentY);
    ctx.font = 'bold 16px "Arial"';
    ctx.fillStyle = '#1e293b';
    const givenNames = truncateText(given_names_txt.value, 'bold 16px "Arial"', infoWidth);
    ctx.fillText(givenNames, infoX, currentY + 16);
    currentY += fieldGap;

    ctx.font = '10px "Arial"';
    ctx.fillStyle = '#64748b';
    ctx.fillText('NATIONALITY', infoX, currentY);
    ctx.font = 'bold 16px "Arial"';
    ctx.fillStyle = '#1e293b';
    ctx.fillText(nationality_txt.value, infoX, currentY + 16);
    currentY += fieldGap;

    ctx.font = '10px "Arial"';
    ctx.fillStyle = '#64748b';
    ctx.fillText('DATE OF BIRTH', infoX, currentY);
    ctx.font = 'bold 16px "Arial"';
    ctx.fillStyle = '#1e293b';
    ctx.fillText(`${birth_date_txt.value.slice(4, 6)}.${birth_date_txt.value.slice(2, 4)}.20${birth_date_txt.value.slice(0, 2)}`, infoX, currentY + 16);
    currentY += fieldGap;

    ctx.font = '10px "Arial"';
    ctx.fillStyle = '#64748b';
    ctx.fillText('SEX', infoX, currentY);
    ctx.font = 'bold 16px "Arial"';
    ctx.fillStyle = '#1e293b';
    ctx.fillText(sex_txt.value, infoX, currentY + 16);
    currentY += fieldGap;

    // Second row of info
    currentY = contentStartY;
    const infoX2 = infoX + infoWidth / 2;

    ctx.font = '10px "Arial"';
    ctx.fillStyle = '#64748b';
    let docNumLabel = 'PASSPORT NO.';
    if (dropdown.value === 'ID Card(TD1)' || dropdown.value === 'ID Card(TD2)') {
        docNumLabel = 'DOCUMENT NO.';
    } else if (dropdown.value !== 'Passport(TD3)') {
        docNumLabel = 'VISA NO.';
    }
    ctx.fillText(docNumLabel, infoX2, currentY);
    ctx.font = 'bold 16px "Arial"';
    ctx.fillStyle = '#1e293b';
    const docNumber = truncateText(document_number_txt.value, 'bold 16px "Arial"', infoWidth / 2 - 10);
    ctx.fillText(docNumber, infoX2, currentY + 16);
    currentY += fieldGap;

    ctx.font = '10px "Arial"';
    ctx.fillStyle = '#64748b';
    ctx.fillText('DATE OF ISSUE', infoX2, currentY);
    ctx.font = 'bold 16px "Arial"';
    ctx.fillStyle = '#1e293b';
    // Calculate issue date (expiry - 10 years for example)
    const expiryYear = parseInt('20' + expiry_date_txt.value.slice(0, 2));
    const issueYear = expiryYear - 10;
    ctx.fillText(`${expiry_date_txt.value.slice(4, 6)}.${expiry_date_txt.value.slice(2, 4)}.${issueYear}`, infoX2, currentY + 16);
    currentY += fieldGap;

    ctx.font = '10px "Arial"';
    ctx.fillStyle = '#64748b';
    ctx.fillText('DATE OF EXPIRY', infoX2, currentY);
    ctx.font = 'bold 16px "Arial"';
    ctx.fillStyle = '#1e293b';
    ctx.fillText(`${expiry_date_txt.value.slice(4, 6)}.${expiry_date_txt.value.slice(2, 4)}.20${expiry_date_txt.value.slice(0, 2)}`, infoX2, currentY + 16);
    currentY += fieldGap;

    ctx.font = '10px "Arial"';
    ctx.fillStyle = '#64748b';
    ctx.fillText('AUTHORITY', infoX2, currentY);
    ctx.font = 'bold 16px "Arial"';
    ctx.fillStyle = '#1e293b';
    ctx.fillText(country_code_txt.value, infoX2, currentY + 16);

    // Draw MRZ section at the bottom (like real passports)
    const mrzPadding = 25;
    const mrzHeight = lines.length * 30 + mrzPadding * 2;
    const mrzY = canvas.height - docMargin - mrzHeight;

    // MRZ text - Fixed character spacing like real MRZ
    ctx.fillStyle = "#000000";
    ctx.font = '20px "OCR-B", monospace';
    ctx.textAlign = 'left';

    // Calculate fixed-width character spacing for MRZ
    // Real MRZ uses monospace with consistent spacing
    const mrzStartX = docMargin + 50;
    const mrzAvailableWidth = docWidth - 100;
    const maxLineLength = Math.max(...lines.map(line => line.length));

    // Use fixed character width for true monospace look
    const charWidth = mrzAvailableWidth / maxLineLength;

    let y = mrzY + mrzPadding;

    for (let line of lines) {
        let currentX = mrzStartX;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            // Draw each character at fixed positions
            const charMeasure = ctx.measureText(char);
            const charOffset = (charWidth - charMeasure.width) / 2; // Center char in fixed width
            ctx.fillText(char, currentX + charOffset, y);
            currentX += charWidth;
        }
        y += 30;
    }

    // Add "SPECIMEN" watermark
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.font = 'bold 80px Arial';
    ctx.fillStyle = '#ef4444';
    ctx.textAlign = 'center';
    ctx.translate(canvas.width / 2, canvas.height / 2 - 50);
    ctx.rotate(-Math.PI / 6);
    ctx.fillText('SPECIMEN', 0, 0);
    ctx.restore();
}

// Generate initial MRZ on page load
window.addEventListener('load', function () {
    generate();
});
