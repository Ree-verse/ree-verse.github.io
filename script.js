const USERNAME = 'ree-verse';

const reposEl = document.getElementById('repos');

// Fetch profile
fetch(`https://api.github.com/users/${USERNAME}`)
    .then(r => r.json())
    .then(user => {
        document.getElementById('avatar').src = user.avatar_url;
        document.getElementById('name').textContent = user.name || user.login;
        document.getElementById('gh-link').href = user.html_url;
        if (user.bio) document.getElementById('bio').textContent = user.bio;
    });

// Fetch repos
fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=stars&direction=desc`)
    .then(r => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
    })
    .then(repos => {
        const filtered = repos
            .filter(r => !r.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);

        if (!filtered.length) {
            reposEl.innerHTML = '<div class="loading">No repositories found.</div>';
            return;
        }

        reposEl.innerHTML = filtered.map(r => `
            <a class="repo" href="${r.html_url}" target="_blank">
                <div class="repo-header">
                    <span class="repo-name">${r.name}</span>
                    <span class="repo-stars">⭐ ${r.stargazers_count.toLocaleString()}</span>
                </div>
                ${r.description ? `<div class="repo-desc">${r.description}</div>` : ''}
                ${r.language ? `<div class="repo-lang">${r.language}</div>` : ''}
            </a>
        `).join('');
    })
    .catch(() => {
        reposEl.innerHTML = '<div class="error">Failed to load repositories.</div>';
    });
