// Global variables
let dataFromGenerator = '';
let lines = [];

// DOM Elements (will be initialized after DOM loads)
let dropdown;
let document_type_txt;
let country_code_txt;
let birth_date_txt;
let document_number_txt;
let sex_txt;
let expiry_date_txt;
let nationality_txt;
let surname_txt;
let given_names_txt;
let optional_data1_txt;
let optional_data2_txt;

const VALID_COUNTRY_CODES = ['USA', 'CAN', 'GBR', 'AUS', 'FRA', 'CHN', 'IND', 'BRA', 'JPN', 'ZAF', 'RUS', 'MEX', 'ITA', 'ESP', 'NLD', 'SWE', 'ARG', 'BEL', 'CHE'];

// Utility Functions (copied from app.js)
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

    // Get current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Generate birth date (person aged 18-80 years old)
    // Birth year should be between (currentYear - 80) and (currentYear - 18)
    let birthDate = randomDate(currentYear - 80, currentYear - 18);

    // Generate expiry date (1-10 years from now, must be after birth date)
    let expiryDate = randomDate(currentYear + 1, currentYear + 10);

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

function selectChanged() {
    if (dropdown.value === 'TD1') {
        document_type_txt.value = 'I';
    } else if (dropdown.value === 'TD2') {
        document_type_txt.value = 'I';
    } else if (dropdown.value === 'TD3') {
        document_type_txt.value = 'P';
    } else if (dropdown.value === 'MRVA') {
        document_type_txt.value = 'V';
    } else if (dropdown.value === 'MRVB') {
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

        if (dropdown.value === 'TD1') {
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
        } else if (dropdown.value === 'TD2') {
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
        } else if (dropdown.value === 'TD3') {
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
        } else if (dropdown.value === 'MRVA') {
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
        } else if (dropdown.value === 'MRVB') {
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
        lines = dataFromGenerator.split('\n');
        drawImage();
    } catch (error) {
        console.error('Error generating MRZ:', error);
        document.getElementById("outputMRZ").value = 'Error: ' + error.message;
    }
}

// Draw the document image
function drawImage() {
    const canvas = document.getElementById('overlay');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions based on document type
    const isPassport = dropdown.value === 'TD3';
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

    // Get country-specific background colors
    function getCountryBackground(countryCode) {
        const backgrounds = {
            'USA': { colors: ['#b22234', '#3c3b6e', '#ffffff'], pattern: 'stripes' },
            'CAN': { colors: ['#ff0000', '#ffffff'], pattern: 'simple' },
            'GBR': { colors: ['#012169', '#C8102E', '#ffffff'], pattern: 'union' },
            'FRA': { colors: ['#0055a4', '#ffffff', '#ef4135'], pattern: 'vertical' },
            'DEU': { colors: ['#000000', '#dd0000', '#ffce00'], pattern: 'horizontal' },
            'CHN': { colors: ['#de2910', '#ffde00'], pattern: 'simple' },
            'JPN': { colors: ['#bc002d', '#ffffff'], pattern: 'simple' },
            'AUS': { colors: ['#012169', '#ffffff'], pattern: 'simple' },
            'IND': { colors: ['#ff9933', '#ffffff', '#138808'], pattern: 'horizontal' },
            'BRA': { colors: ['#009739', '#fedd00'], pattern: 'simple' },
            'RUS': { colors: ['#ffffff', '#0039a6', '#d52b1e'], pattern: 'horizontal' },
            'MEX': { colors: ['#006847', '#ffffff', '#ce1126'], pattern: 'vertical' },
            'ESP': { colors: ['#c60b1e', '#ffc400'], pattern: 'simple' },
            'ITA': { colors: ['#009246', '#ffffff', '#ce2b37'], pattern: 'vertical' },
            'ZAF': { colors: ['#007a4d', '#ffb612', '#de3831'], pattern: 'simple' }
        };

        return backgrounds[countryCode] || { colors: ['#e8f4f8', '#d4e9f2', '#c1dfe9'], pattern: 'simple' };
    }

    // Get issuing country code
    const countryCode = country_code_txt.value.toUpperCase() || 'USA';
    const bgConfig = getCountryBackground(countryCode);

    // Create country-specific gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

    if (bgConfig.pattern === 'vertical') {
        // Vertical stripes
        bgConfig.colors.forEach((color, i) => {
            const pos = i / (bgConfig.colors.length - 1);
            gradient.addColorStop(pos, color + '40'); // 40 = 25% opacity
        });
    } else if (bgConfig.pattern === 'horizontal') {
        // Horizontal bands
        bgConfig.colors.forEach((color, i) => {
            const pos = i / (bgConfig.colors.length - 1);
            gradient.addColorStop(pos, color + '40');
        });
    } else {
        // Simple gradient with country colors
        bgConfig.colors.forEach((color, i) => {
            const pos = i / (bgConfig.colors.length - 1);
            gradient.addColorStop(pos, color + '30'); // 30 = 19% opacity
        });
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw decorative pattern with country color
    ctx.save();
    ctx.globalAlpha = 0.05;
    const mainColor = bgConfig.colors[0];
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 60 + 20;
        ctx.fillStyle = mainColor;
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

    // Document background - clean base
    ctx.fillStyle = '#f8f9fa';
    ctx.beginPath();
    ctx.roundRect(docMargin, docMargin, docWidth, docHeight, cornerRadius);
    ctx.fill();

    // Add realistic security pattern - guilloche-like lines
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.strokeStyle = bgConfig.colors[0];
    ctx.lineWidth = 0.5;

    // Draw wave patterns (like real passport security features)
    for (let y = docMargin; y < docMargin + docHeight; y += 8) {
        ctx.beginPath();
        ctx.moveTo(docMargin, y);
        for (let x = docMargin; x < docMargin + docWidth; x += 10) {
            const wave = Math.sin((x - docMargin) * 0.05) * 3;
            ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
    }
    ctx.restore();

    // Add subtle microprinting effect (small repeated text pattern)
    ctx.save();
    ctx.globalAlpha = 0.015;
    ctx.fillStyle = bgConfig.colors[0];
    ctx.font = '4px Arial';
    const microText = countryCode;
    for (let y = docMargin + 10; y < docMargin + docHeight - 10; y += 8) {
        for (let x = docMargin + 10; x < docMargin + docWidth - 10; x += 30) {
            ctx.fillText(microText, x, y);
        }
    }
    ctx.restore();

    // Add corner security elements (like real passports)
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = bgConfig.colors[0];
    ctx.lineWidth = 1;

    // Top-left corner pattern
    for (let i = 0; i < 5; i++) {
        ctx.strokeRect(docMargin + 10 + i * 3, docMargin + 10 + i * 3, 30 - i * 6, 30 - i * 6);
    }

    // Top-right corner pattern
    for (let i = 0; i < 5; i++) {
        ctx.strokeRect(docMargin + docWidth - 40 + i * 3, docMargin + 10 + i * 3, 30 - i * 6, 30 - i * 6);
    }
    ctx.restore();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw subtle border with country color
    ctx.strokeStyle = bgConfig.colors[0] + '30'; // Country color at 19% opacity
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(docMargin, docMargin, docWidth, docHeight, cornerRadius);
    ctx.stroke();

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
    if (dropdown.value === 'TD1' || dropdown.value === 'TD2') {
        titleText = 'IDENTIFICATION CARD';
    } else if (dropdown.value === 'TD3') {
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

    // Format birth date from YYMMDD to DD.MM.YYYY
    ctx.font = '10px "Arial"';
    ctx.fillStyle = '#64748b';
    ctx.fillText('DATE OF BIRTH', infoX, currentY);
    ctx.font = 'bold 16px "Arial"';
    ctx.fillStyle = '#1e293b';
    if (birth_date_txt.value && birth_date_txt.value.length === 6) {
        const yy = parseInt(birth_date_txt.value.slice(0, 2));
        // If year is > 50, it's 19xx, otherwise 20xx (pivot year 2050)
        const fullYear = yy > 50 ? `19${birth_date_txt.value.slice(0, 2)}` : `20${birth_date_txt.value.slice(0, 2)}`;
        const birthFormatted = `${birth_date_txt.value.slice(4, 6)}.${birth_date_txt.value.slice(2, 4)}.${fullYear}`;
        ctx.fillText(birthFormatted, infoX, currentY + 16);
    }
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
    if (dropdown.value === 'TD1' || dropdown.value === 'TD2') {
        docNumLabel = 'DOCUMENT NO.';
    } else if (dropdown.value !== 'TD3') {
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
    if (expiry_date_txt.value && expiry_date_txt.value.length === 6) {
        const yy = parseInt(expiry_date_txt.value.slice(0, 2));
        // If year is > 50, it's 19xx, otherwise 20xx (pivot year 2050)
        const expiryFullYear = yy > 50 ? 1900 + yy : 2000 + yy;
        const issueYear = expiryFullYear - 10;
        ctx.fillText(`${expiry_date_txt.value.slice(4, 6)}.${expiry_date_txt.value.slice(2, 4)}.${issueYear}`, infoX2, currentY + 16);
    }
    currentY += fieldGap;

    // Format expiry date from YYMMDD to DD.MM.YYYY
    ctx.font = '10px "Arial"';
    ctx.fillStyle = '#64748b';
    ctx.fillText('DATE OF EXPIRY', infoX2, currentY);
    ctx.font = 'bold 16px "Arial"';
    ctx.fillStyle = '#1e293b';
    if (expiry_date_txt.value && expiry_date_txt.value.length === 6) {
        const yy = parseInt(expiry_date_txt.value.slice(0, 2));
        // If year is > 50, it's 19xx, otherwise 20xx (pivot year 2050)
        const fullYear = yy > 50 ? `19${expiry_date_txt.value.slice(0, 2)}` : `20${expiry_date_txt.value.slice(0, 2)}`;
        const expiryFormatted = `${expiry_date_txt.value.slice(4, 6)}.${expiry_date_txt.value.slice(2, 4)}.${fullYear}`;
        ctx.fillText(expiryFormatted, infoX2, currentY + 16);
    }
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

// Download image
function downloadImage() {
    const canvas = document.getElementById('overlay');
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mrz-document-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('Image downloaded successfully!');
    });
}

// Copy image to clipboard
async function copyImageToClipboard() {
    try {
        const canvas = document.getElementById('overlay');
        canvas.toBlob(async (blob) => {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob
                })
            ]);
            showNotification('Image copied to clipboard!');
        });
    } catch (err) {
        showNotification('Failed to copy image: ' + err.message, true);
    }
}

// Copy MRZ text to clipboard
async function copyMRZText() {
    try {
        const mrzText = document.getElementById('outputMRZ').value;
        await navigator.clipboard.writeText(mrzText);
        showNotification('MRZ text copied to clipboard!');
    } catch (err) {
        showNotification('Failed to copy text: ' + err.message, true);
    }
}

// Show notification
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification show' + (isError ? ' error' : '');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Handle document type change
function handleDocumentTypeChange() {
    const docType = document.getElementById('document_type').value;
    const optionalData2Group = document.getElementById('optional_data2_group');

    if (docType === 'TD1') {
        optionalData2Group.classList.add('show');
    } else {
        optionalData2Group.classList.remove('show');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize global variables
    dropdown = document.getElementById('document_type');
    country_code_txt = document.getElementById('country');
    surname_txt = document.getElementById('surname');
    given_names_txt = document.getElementById('given_names');
    document_number_txt = document.getElementById('document_number');
    nationality_txt = document.getElementById('nationality');
    birth_date_txt = document.getElementById('date_of_birth');
    sex_txt = document.getElementById('sex');
    expiry_date_txt = document.getElementById('date_of_expiry');
    optional_data1_txt = document.getElementById('optional_data');
    optional_data2_txt = document.getElementById('optional_data2');
    document_type_txt = { value: 'P' }; // Create object with value property

    // Wait for OCR-B font to load before initializing
    try {
        await document.fonts.load('16px OCR-B');
        console.log('✅ OCR-B font loaded');
    } catch (err) {
        console.warn('⚠️ Font loading error:', err);
    }

    // Event listeners
    dropdown.addEventListener('change', selectChanged);
    document.getElementById('randomBtn').addEventListener('click', randomize);
    document.getElementById('generateBtn').addEventListener('click', generate);
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
    document.getElementById('copyImageBtn').addEventListener('click', copyImageToClipboard);
    document.getElementById('copyTextBtn').addEventListener('click', copyMRZText);

    // Initialize with random data (after font is loaded)
    selectChanged();
});
