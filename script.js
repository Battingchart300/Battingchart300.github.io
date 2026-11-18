(function() {
    'use strict';

    // ─── HAMBURGER ───
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            const open = nav.classList.toggle('open');
            hamburger.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', open);
        });

        // Close nav on link click (mobile)
        document.querySelectorAll('[data-nav]').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ─── SCROLL REVEAL ───
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── GITHUB STATS (live) ───
    const statsToggle = document.getElementById('stats-toggle');
    const statsWrap = document.getElementById('stats-table-wrap');
    const statsLabel = document.getElementById('stats-expand-label');

    if (statsToggle && statsWrap) {
        statsToggle.addEventListener('click', function() {
            const open = statsWrap.hidden;
            statsWrap.hidden = !open;
            statsToggle.setAttribute('aria-expanded', String(open));
            if (statsLabel) {
                statsLabel.textContent = open ? 'Hide repositories ▴' : 'View repositories ▾';
            }
        });
    }

    const statsTbody = document.getElementById('stats-tbody');
    if (statsTbody) {
        fetch('https://api.github.com/users/Battingchart300/repos?per_page=100')
            .then(function(r) { if (!r.ok) throw new Error('GitHub API ' + r.status); return r.json(); })
            .then(function(repos) {
                repos.sort(function(a, b) {
                    return (b.stargazers_count - a.stargazers_count) ||
                        (new Date(b.updated_at) - new Date(a.updated_at));
                });
                const totalStars = repos.reduce(function(s, r) { return s + r.stargazers_count; }, 0);
                const totalForks = repos.reduce(function(s, r) { return s + r.forks_count; }, 0);
                const setNum = function(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; };
                setNum('stat-repos', repos.length);
                setNum('stat-stars', totalStars);
                setNum('stat-forks', totalForks);
                statsTbody.innerHTML = repos.map(function(r) {
                    const lang = r.language || '—';
                    const updated = (r.updated_at || '').slice(0, 10);
                    return '<tr><td><a href="' + r.html_url + '" target="_blank" rel="noopener noreferrer">' + r.name + '</a></td><td>' + r.stargazers_count + '</td><td>' + r.forks_count + '</td><td>' + lang + '</td><td>' + updated + '</td></tr>';
                }).join('');
                return fetch('https://api.github.com/users/Battingchart300');
            })
            .then(function(r) { if (!r.ok) throw new Error('GitHub API ' + r.status); return r.json(); })
            .then(function(user) {
                const el = document.getElementById('stat-followers');
                if (el) el.textContent = user.followers;
            })
            .catch(function() { /* keep baked-in fallback numbers */ });
    }

})();