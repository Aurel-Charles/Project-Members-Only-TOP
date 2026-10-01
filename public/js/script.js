
const dialog = document.querySelector('#hint-dialog')
const btnOpenDialog = document.querySelector('#open-dialog')
const btnCloseDialog = document.querySelector('#close-dialog')

btnOpenDialog?.addEventListener('click', () => dialog.showModal());
btnCloseDialog?.addEventListener('click', () => dialog.close());

const piano = document.querySelector('.piano');

if (piano) {
  const length = Number(piano.dataset.length);
  const played = [];
  const dialogCode = document.getElementById('club-code');

  piano.querySelectorAll('.key').forEach((key) => {
    key.addEventListener('click', async () => {
      key.classList.add('pressed');
      setTimeout(() => key.classList.remove('pressed'), 150);

      played.push(key.dataset.name);
      if (played.length > length) played.shift();
      if (played.length < length) return;

      const response = await fetch('/piano', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: played.join() }),
      });
      const { word } = await response.json();

      if (word) {
        played.length = 0;
        dialogCode.querySelector('.secret-word').textContent = word;
        setTimeout(() => dialogCode.showModal(), 300);
      }
    });
  });
}