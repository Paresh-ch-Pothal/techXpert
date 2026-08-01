const { ImageResponse } = require('@vercel/og');

const el = (type, props = {}, ...children) => ({
    type,
    props: { ...props, children: children.length === 1 ? children[0] : children },
});

// ---- small reusable pieces -------------------------------------------------

const CornerFlourish = (rotate) =>
    el('div', {
        style: {
            position: 'absolute',
            width: 70,
            height: 70,
            border: '3px solid #c9a24b',
            borderRight: 'none',
            borderBottom: 'none',
            transform: `rotate(${rotate}deg)`,
            display: 'flex',
            ...cornerPosition(rotate),
        },
    });

function cornerPosition(rotate) {
    // place each L-shaped flourish in the right corner based on rotation
    switch (rotate) {
        case 0: return { top: 34, left: 34 };
        case 90: return { top: 34, right: 34 };
        case 180: return { bottom: 34, right: 34 };
        case 270: return { bottom: 34, left: 34 };
        default: return {};
    }
}

// A dummy handwritten-style signature rendered as an inline SVG squiggle
const SignatureMark = (color = '#1a1a1a', widthPx = 190) =>
    el(
        'div',
        { style: { display: 'flex', width: widthPx, height: 60, alignItems: 'center', justifyContent: 'center' } },
        el('img', {
            width: widthPx,
            height: 60,
            src:
                'data:image/svg+xml;utf8,' +
                encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="${widthPx}" height="60" viewBox="0 0 190 60">
                  <path d="M8 42 C 20 12, 32 12, 40 30 C 46 44, 52 20, 62 18 C 72 16, 76 40, 86 34 C 96 28, 100 10, 112 20 C 122 28, 118 44, 130 38 C 142 32, 140 14, 154 22 C 164 28, 168 40, 180 30"
                        fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `),
        })
    );

// Circular "official" seal / stamp, purely CSS + text (dummy stamp)
const OfficialStamp = () =>
    el(
        'div',
        {
            style: {
                position: 'absolute',
                bottom: 150,
                right: 160,
                width: 190,
                height: 190,
                borderRadius: '50%',
                border: '3px solid #a3283f',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'rotate(-14deg)',
                opacity: 0.85,
                color: '#a3283f',
                textAlign: 'center',
            },
        },
        el(
            'div',
            {
                style: {
                    width: 158,
                    height: 158,
                    borderRadius: '50%',
                    border: '1.5px solid #a3283f',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
            },
            el('div', { style: { fontSize: 13, fontWeight: 700, letterSpacing: 2, display: 'flex' } }, 'OFFICIAL'),
            el('div', { style: { fontSize: 30, fontWeight: 700, display: 'flex', marginTop: 4 } }, '★'),
            el('div', { style: { fontSize: 13, fontWeight: 700, letterSpacing: 2, display: 'flex', marginTop: 4 } }, 'SEAL')
        )
    );

// ---- main certificate -------------------------------------------------------

const renderCertificate = async ({
    userName,
    purpose,
    issueDate,
    orgName = 'TechXpert : Learn . Teach . Certify',
    certificateId,
    instructorName = 'Jane Doe',
    instructorTitle = 'Lead Instructor',
    directorName = 'Michael Carter',
    directorTitle = 'Program Director',
}) => {
    const certId =
        certificateId ||
        `CERT-${new Date(issueDate || Date.now()).getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const markup = el(
        'div',
        {
            style: {
                width: '1600px',
                height: '1131px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                background: 'linear-gradient(135deg, #fdfcf7 0%, #f6f1e7 55%, #fdfcf7 100%)',
                fontFamily: 'sans-serif',
            },
        },

        // outer + inner border frame
        el('div', {
            style: {
                position: 'absolute',
                inset: 0,
                border: '14px solid #0b3d2e',
                display: 'flex',
            },
        }),
        el('div', {
            style: {
                position: 'absolute',
                inset: 30,
                border: '2px solid #c9a24b',
                display: 'flex',
            },
        }),

        // corner flourishes
        CornerFlourish(0),
        CornerFlourish(90),
        CornerFlourish(180),
        CornerFlourish(270),

        // faint watermark seal in the background center
        el('div', {
            style: {
                position: 'absolute',
                top: '38%',
                left: '50%',
                width: 480,
                height: 480,
                marginLeft: -240,
                marginTop: -240,
                borderRadius: '50%',
                border: '10px solid #0b3d2e',
                opacity: 0.04,
                display: 'flex',
            },
        }),

        // ---- header: org identity ----
        el(
            'div',
            { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 78 } },
            el(
                'div',
                {
                    style: {
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: '#0b3d2e',
                        color: '#f5e6b8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 30,
                        fontWeight: 700,
                        marginBottom: 14,
                        border: '3px solid #c9a24b',
                    },
                },
                orgName.charAt(0)
            ),
            el(
                'div',
                { style: { fontSize: 24, letterSpacing: 4, color: '#0b3d2e', fontWeight: 700, textTransform: 'uppercase', display: 'flex' } },
                orgName
            )
        ),

        // ---- title ----
        el(
            'div',
            {
                style: {
                    fontSize: 52,
                    letterSpacing: 7,
                    color: '#0b3d2e',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    marginTop: 34,
                    display: 'flex',
                },
            },
            'Certificate of Completion'
        ),
        el('div', {
            style: { width: 130, height: 3, background: '#c9a24b', marginTop: 18, display: 'flex' },
        }),

        // ---- body ----
        el(
            'div',
            { style: { fontSize: 22, color: '#555', marginTop: 34, display: 'flex' } },
            'This is to proudly certify that'
        ),
        el(
            'div',
            {
                style: {
                    fontSize: 60,
                    fontWeight: 700,
                    color: '#0b3d2e',
                    margin: '26px 0',
                    borderBottom: '2px solid #c9a24b',
                    paddingBottom: 10,
                    paddingLeft: 30,
                    paddingRight: 30,
                    display: 'flex',
                    fontStyle: 'italic',
                },
            },
            userName
        ),
        el(
            'div',
            {
                style: {
                    fontSize: 24,
                    color: '#333',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    maxWidth: 1000,
                    textAlign: 'center',
                    lineHeight: 1.6,
                },
            },
            el('span', { style: { display: 'flex', marginRight: 8 } }, 'has successfully completed'),
            el('strong', { style: { display: 'flex', marginRight: 8, color: '#0b3d2e' } }, purpose),
            el('span', { style: { display: 'flex' } }, 'with distinction, demonstrating outstanding commitment and skill.')
        ),

        // ---- certificate id / date strip ----
        el(
            'div',
            {
                style: {
                    position: 'absolute',
                    top: 46,
                    right: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    fontSize: 14,
                    color: '#777',
                },
            },
            el('div', { style: { display: 'flex' } }, `Certificate ID: ${certId}`),
            el('div', { style: { display: 'flex', marginTop: 4 } }, `Issued: ${issueDate}`)
        ),

        // ---- stamp ----
        OfficialStamp(),

        // ---- signature block ----
        el(
            'div',
            {
                style: {
                    position: 'absolute',
                    bottom: 96,
                    left: 0,
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-around',
                    paddingLeft: 120,
                    paddingRight: 120,
                },
            },
            el(
                'div',
                { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                SignatureMark('#1a1a1a', 190),
                el('div', {
                    style: { borderTop: '1px solid #999', width: 220, marginTop: 6, paddingTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' },
                },
                    el('div', { style: { fontSize: 20, fontWeight: 700, color: '#0b3d2e', display: 'flex' } }, instructorName),
                    el('div', { style: { fontSize: 14, color: '#555', display: 'flex', marginTop: 2 } }, instructorTitle)
                )
            ),
            el(
                'div',
                { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                SignatureMark('#1a1a1a', 190),
                el('div', {
                    style: { borderTop: '1px solid #999', width: 220, marginTop: 6, paddingTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' },
                },
                    el('div', { style: { fontSize: 20, fontWeight: 700, color: '#0b3d2e', display: 'flex' } }, directorName),
                    el('div', { style: { fontSize: 14, color: '#555', display: 'flex', marginTop: 2 } }, directorTitle)
                )
            )
        ),

        // ---- footer strip ----
        el(
            'div',
            {
                style: {
                    position: 'absolute',
                    bottom: 46,
                    display: 'flex',
                    fontSize: 13,
                    color: '#999',
                    letterSpacing: 1,
                },
            },
            'This certificate can be verified online using the Certificate ID above.'
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