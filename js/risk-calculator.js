document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const cvssInput = document.getElementById('cvss');
    const cvssVal = document.getElementById('cvss-val');
    
    // UI Elements for result
    const finalScoreEl = document.getElementById('finalScore');
    const scoreProgress = document.getElementById('scoreProgress');
    const riskBadge = document.getElementById('riskBadge');
    const securityBar = document.getElementById('securityBar');
    const safetyBar = document.getElementById('safetyBar');

    // Update CVSS slider value display live
    cvssInput.addEventListener('input', (e) => {
        cvssVal.textContent = parseFloat(e.target.value).toFixed(1);
    });

    // Calculate score
    const calculateRisk = () => {
        // Get values
        const deviceClass = parseInt(document.querySelector('input[name="deviceClass"]:checked').value);
        const connectivity = parseInt(document.getElementById('connectivity').value);
        const cvss = parseFloat(cvssInput.value);
        const patientImpact = parseInt(document.getElementById('patientImpact').value);

        // Advanced scoring algorithm
        // Security Risk (0-100) based on CVSS and Connectivity weight
        const securityRisk = (cvss * 5.5) + (connectivity * 15); 
        
        // Safety Risk (0-100) based on Device Class and Patient Impact weight
        const safetyRisk = (deviceClass * 14.5) + (patientImpact * 14.125);

        // Weighted Total Score
        let totalScore = (securityRisk * 0.45) + (safetyRisk * 0.55);
        totalScore = Math.min(Math.max(Math.round(totalScore), 0), 100);

        updateUI(totalScore, securityRisk, safetyRisk);
    };

    const updateUI = (score, secRisk, safRisk) => {
        // Animate main counter
        let start = parseInt(finalScoreEl.textContent) || 0;
        const duration = 1200;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // easeOutQuart interpolation
            const ease = 1 - Math.pow(1 - progress, 4);
            const currentVal = Math.round(start + (score - start) * ease);
            
            finalScoreEl.textContent = currentVal;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);

        // Update Circle SVG Progress (circumference is 283 for r=45)
        const offset = 283 - (283 * score) / 100;
        scoreProgress.style.strokeDashoffset = offset;

        // Dynamic thematic coloring based on severity
        let color = '#34c759'; // Apple Green (Low)
        let badgeText = 'Low Risk';
        let badgeBg = 'rgba(52, 199, 89, 0.15)';
        let badgeColor = '#34c759';

        if (score >= 75) {
            color = '#ff3b30'; // Apple Red (Critical)
            badgeText = 'Critical Risk';
            badgeBg = 'rgba(255, 59, 48, 0.15)';
            badgeColor = '#ff3b30';
        } else if (score >= 55) {
            color = '#ff9500'; // Apple Orange (High)
            badgeText = 'High Risk';
            badgeBg = 'rgba(255, 149, 0, 0.15)';
            badgeColor = '#ff9500';
        } else if (score >= 35) {
            color = '#ffcc00'; // Apple Yellow (Moderate)
            badgeText = 'Moderate Risk';
            badgeBg = 'rgba(255, 204, 0, 0.15)';
            badgeColor = '#ffcc00';
        }

        scoreProgress.style.stroke = color;
        riskBadge.textContent = badgeText;
        riskBadge.style.backgroundColor = badgeBg;
        riskBadge.style.color = badgeColor;

        // Update sub-bars with same thematic color
        securityBar.style.width = Math.min(secRisk, 100) + '%';
        securityBar.style.backgroundColor = color;
        
        safetyBar.style.width = Math.min(safRisk, 100) + '%';
        safetyBar.style.backgroundColor = color;
    };

    // Listeners for auto-updating when inputs change
    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('change', calculateRisk);
    });
    cvssInput.addEventListener('input', calculateRisk);
    calculateBtn.addEventListener('click', calculateRisk);

    // Initial calculation trigger
    setTimeout(calculateRisk, 300);
});
