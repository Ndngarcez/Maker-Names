(() => {
  let authChecked = false;
  let isSignedIn = false;

  async function checkSignedIn() {
    if (authChecked) return isSignedIn;

    try {
      const response = await fetch('/api/Auth/me', { credentials: 'include' });
      isSignedIn = response.ok;
    } catch {
      isSignedIn = false;
    }

    authChecked = true;
    return isSignedIn;
  }

  function watchSponsorVideo() {
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.className = 'library-reward-overlay';
      overlay.innerHTML = `
        <div class="library-reward-card" role="dialog" aria-modal="true" aria-label="Sponsor video">
          <strong>Free download</strong>
          <p>Watch this short sponsor video to unlock the download. Create a free account to skip this next time.</p>
          <div class="library-reward-screen">Sponsor video</div>
          <button type="button" disabled>Continue in 8</button>
        </div>
      `;

      document.body.appendChild(overlay);

      let remaining = 8;
      const button = overlay.querySelector('button');
      const timer = window.setInterval(() => {
        remaining -= 1;
        if (remaining > 0) {
          button.textContent = `Continue in ${remaining}`;
          return;
        }

        window.clearInterval(timer);
        button.disabled = false;
        button.textContent = 'Continue download';
      }, 1000);

      button.addEventListener('click', () => {
        if (button.disabled) return;
        overlay.remove();
        resolve(true);
      });
    });
  }

  async function ensureLibraryDownloadAccess() {
    if (await checkSignedIn()) return true;
    return watchSponsorVideo();
  }

  async function downloadLibraryPack(event) {
    const trigger = event.target.closest('[data-library-download]');
    if (!trigger) return;

    event.preventDefault();
    const slug = trigger.dataset.libraryDownload;
    if (!slug) return;

    const originalText = trigger.textContent;
    trigger.disabled = true;
    trigger.textContent = 'Preparing...';

    try {
      if (!(await ensureLibraryDownloadAccess())) return;

      const response = await fetch(`/api/Library/${encodeURIComponent(slug)}/download`, {
        credentials: 'include'
      });

      if (response.status === 401) {
        alert('Create a free account to download without watching the sponsor video.');
        window.location.href = '/';
        return;
      }

      if (!response.ok) {
        alert('This pack is not available right now. Please try again later.');
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${slug}-makernames-pack.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    }
    catch (error) {
      console.error('Library download failed', error);
      alert('The download could not start. Please try again.');
    }
    finally {
      trigger.disabled = false;
      trigger.textContent = originalText;
    }
  }

  document.addEventListener('click', downloadLibraryPack);
})();
