const { ImageResponse } = require('@vercel/og');

const el = (type, props = {}, ...children) => ({
    type,
    props: { ...props, children: children.length === 1 ? children[0] : children }
});

const renderCertificate = async ({ userName, purpose, issueDate }) => {
    const markup = el('div', {
        style: {
            width: '1600px',
            height: '1131px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fdfcf7 0%, #f5f0e6 100%)',
            border: '20px solid #0b3d2e',
            position: 'relative',
        }
    },
        el('div', { style: { position: 'absolute', inset: '40px', border: '2px solid #c9a24b', display: 'flex' } }), // Added display: flex

        el('div', { style: { fontSize: 48, letterSpacing: 6, color: '#0b3d2e', textTransform: 'uppercase', fontWeight: 700, display: 'flex' } }, 'Certificate of Completion'),
        el('div', { style: { fontSize: 22, color: '#555', marginTop: 20, display: 'flex' } }, 'This is to certify that'),
        el('div', { style: { fontSize: 64, fontWeight: 700, color: '#0b3d2e', margin: '40px 0', borderBottom: '2px solid #c9a24b', paddingBottom: 10, display: 'flex' } }, userName),
        
        // Wrapped the raw strings in span/strong tags so Satori treats them nicely as flex items
        el('div', { style: { fontSize: 26, color: '#333', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' } },
            el('span', { style: { display: 'flex', marginRight: '8px' } }, 'has successfully completed'),
            el('strong', { style: { display: 'flex', marginRight: '8px', color: '#0b3d2e' } }, purpose),
            el('span', { style: { display: 'flex' } }, 'with distinction.')
        ),

        el('div', { style: { position: 'absolute', bottom: 90, display: 'flex', width: '100%', justifyContent: 'space-around' } },
            el('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                el('div', { style: { fontSize: 32, fontWeight: 700, color: '#0b3d2e', display: 'flex' } }, 'Jane Doe'),
                el('div', { style: { borderTop: '1px solid #999', width: 220, paddingTop: 6, fontSize: 14, color: '#555', display: 'flex', justifyContent: 'center' } }, 'Instructor')
            ),
            el('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                el('div', { style: { fontSize: 18, display: 'flex' } }, issueDate),
                el('div', { style: { borderTop: '1px solid #999', width: 220, paddingTop: 6, fontSize: 14, color: '#555', display: 'flex', justifyContent: 'center' } }, 'Date Issued')
            )
        )
    );

    const imageResponse = new ImageResponse(markup, {
        width: 1600,
        height: 1131,
    });

    const arrayBuffer = await imageResponse.arrayBuffer();
    return Buffer.from(arrayBuffer);
};

module.exports = renderCertificate;