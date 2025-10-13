// public/js/training.js
document.addEventListener('DOMContentLoaded', function () {
  const moduleCards = Array.from(document.querySelectorAll('.module-card'));
  const overallProgressEl = document.getElementById('overall-progress');
  const overallPercentEl = document.getElementById('overall-percent');
  const completedTextEl = document.getElementById('modules-completed-text');
  const countCompleted = document.getElementById('count-completed');
  const countInProgress = document.getElementById('count-inprogress');
  const countNotStarted = document.getElementById('count-notstarted');
  const countTotal = document.getElementById('count-total');

  // compute counts and overall progress
  let totalModules = moduleCards.length;
  let completed = 0;
  let inProgress = 0;
  let notStarted = 0;
  let totalPercent = 0;

  moduleCards.forEach(card => {
    const owned = card.dataset.owned === '1';
    const progress = Number(card.dataset.progress) || 0;
    const max = Number(card.dataset.max) || 1;
    const percent = Math.round((progress / max) * 100);
    totalPercent += percent;

    if (progress >= max) {
      completed++;
    } else if (progress > 0 && progress < max) {
      inProgress++;
    } else {
      notStarted++;
    }

    // wire continue button
    const continueBtn = card.querySelector('button.continue-btn');
    if (continueBtn && owned) {
      continueBtn.addEventListener('click', () => {
        const id = card.dataset.id;
        // navigate to module page
        window.location.href = `/training/module/${encodeURIComponent(id)}`;
      });
    }

    // locked overlay click (if user tries)
    const lockedOverlay = card.querySelector('.locked-overlay');
    if (lockedOverlay) {
      lockedOverlay.addEventListener('click', (e) => {
        // show a small tooltip or simple alert. Keep it strict.
        alert('This module is locked. Purchase or unlock it to continue.');
      });
    }
  });

  // update sidebar numbers and overall progress
  const avgPercent = Math.round(totalPercent / (totalModules || 1));
  overallProgressEl.value = avgPercent;
  overallPercentEl.textContent = avgPercent + '%';
  completedTextEl.textContent = `${completed} of ${totalModules} modules completed`;

  countCompleted.textContent = completed;
  countInProgress.textContent = inProgress;
  countNotStarted.textContent = notStarted;
  countTotal.textContent = totalModules;
});
