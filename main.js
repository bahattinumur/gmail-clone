// UI ve yardımcı fonksiyonları içe aktar.
import { ele, renderMails, toggleModal } from './scripts/ui.js';
import { getDate } from './scripts/helpers.js';

// Local storage'dan verileri alın ve bir objeye çevirin
// Proje boyunca bu veriyi e-posta verisi olarak kullanacağız.
// Dizi güncellendiğinde local storage i da güncelleyin.
const strMail = localStorage.getItem('mails') || '[]'; // Eğer yoksa boş bir dizi oluştur
let mailData = JSON.parse(strMail);

// 1) Navbar için açılıp kapanma işlevselliği
ele.menu.addEventListener('click', () => {
  ele.nav.classList.toggle('hide');
});

// 2) Listeleme işlevselliği
document.addEventListener('DOMContentLoaded', () => {
  renderMails(mailData);

  if (window.innerWidth < 1200) {
    ele.nav.classList.add('hide');
  }
});

// 3) Modal Açma/Kapama
ele.createBtn.addEventListener('click', () => toggleModal(true));
ele.closeBtn.addEventListener('click', () => toggleModal(false));

ele.modal.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-wrapper')) {
    toggleModal(false);
  }
});

// 4) E-posta Gönderme İşlevselliği
ele.modalForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const receiver = e.target[1].value;
  const title = e.target[2].value;
  const message = e.target[3].value;

  if (!receiver || !title || !message) {
    alert('Lütfen tüm alanları doldurun');
  } else {
    const newMail = {
      id: new Date().getTime(),
      sender: 'DR.Code',
      receiver: receiver,
      title: title,
      message: message,
      date: getDate(),
    };

    mailData.unshift(newMail);

    localStorage.setItem('mails', JSON.stringify(mailData));

    renderMails(mailData);

    toggleModal(false);
  }
});

// 5) E-posta Silme İşlevselliği
const handleClick = (e) => {
  const mail = e.target.closest('.mail');
  const mailId = mail.dataset.id;

  if (e.target.id === 'delete' && confirm('E-postayı silmek istiyor musunuz?')) {
    mailData = mailData.filter((mail) => mail.id !== Number(mailId));

    localStorage.setItem('mails', JSON.stringify(mailData));

    mail.remove();
  }

  if (e.target.id === 'star') {
    const found = mailData.find((item) => item.id === Number(mailId));

    found.isStared = !found.isStared;

    localStorage.setItem('mails', JSON.stringify(mailData));

    renderMails(mailData);
  }
};

ele.mailsArea.addEventListener('click', handleClick);

// 6) Navigasyon Menüsü Aktivasyon işlevselliği
ele.nav.addEventListener('click', (e) => {
  if (e.target.id === 'cat2') {
    const filtered = mailData.filter((mail) => mail.isStared === true);
    renderMails(filtered);
  } else {
    renderMails(mailData);
  }
});
