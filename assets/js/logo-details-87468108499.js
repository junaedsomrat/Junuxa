async function loadLogoData() {
    try {
        const response = await fetch('https://junaedsomrat.github.io/Junuxa/data/json/logo_details.json');
        
        if (!response.ok) {
            throw new Error('Error loading details');
        }
        
        const data = await response.json();
        renderData(data.logo, data.metadata);
        
    } catch (error) {
        document.getElementById('content').innerHTML = `
            <div class="error">
                <h3>⚠ Error</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function renderData(logo, meta) {
    const colors = logo.colors || [];
    const fonts = logo.fonts || [];

    document.getElementById('content').innerHTML = `
        <div class="header">
            <h1 class="bn-text">${logo.name || 'Logo'}</h1>
            <p class="en-text">Official Brand Asset</p>
        </div>

        <div class="logo-section">
            <div class="logo-wrapper">
                ${logo.image_url ? `<img src="${logo.image_url}" alt="${logo.name}">` : '<p>No Image</p>'}
            </div>
        </div>

        <div class="info-grid">
            <div class="info-card">
                <label class="en-text">Owner</label>
                <div class="value bn-text">${logo.owner || '-'}</div>
            </div>

            <div class="info-card">
                <label class="en-text">Created At</label>
                <div class="value en-text">${logo.created_at || '-'}</div>
            </div>

            <div class="info-card">
                <label class="en-text">Fonts</label>
                <div class="value bn-text">${fonts.join(', ') || '-'}</div>
            </div>

            <div class="info-card">
                <label class="en-text">Color Palette</label>
                <div class="color-pills">
                    ${colors.map((color, i) => 
                        `<span class="color-pill" style="background:${color}; animation-delay:${1 + i*0.1}s">${color}</span>`
                    ).join('') || '-'}
                </div>
            </div>
        </div>

        <div class="info-card" style="animation-delay: 1s;">
            <label class="en-text">Design Notes</label>
            <div class="value bn-text" style="font-size: 15px; line-height: 1.7;">
                ${logo.notes || 'No notes available'}
            </div>
        </div>

        <div class="copyright-box">
            ${logo.copyright || `© ${new Date().getFullYear()} All Rights Reserved`}
        </div>
    `;
}

window.addEventListener('DOMContentLoaded', loadLogoData);
