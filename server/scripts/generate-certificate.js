const fs = require('fs');
const path = require('path');
const renderCertificate = require('../utils/certiicateRender');

(async () => {
    try {
        console.log('Generating certificate...');

        const buffer = await renderCertificate({
            userName: 'Rahul Sharma',
            purpose: 'React Fundamentals',
            issueDate: new Date().toLocaleDateString()
        });

        const outputPath = path.join(__dirname, 'test-certificate-output.png');
        fs.writeFileSync(outputPath, buffer);

        console.log('✅ Success! Certificate saved to:', outputPath);
        console.log('Buffer size:', buffer.length, 'bytes');
    } catch (err) {
        console.error('❌ Failed to generate certificate:');
        console.error(err);
    }
})();