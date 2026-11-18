// V&M Engenharia - comportamentos do site
// Usado no site principal e na landing page. Cada parte só roda se o
// elemento existir na página (a landing não tem menu nem galeria).

// 1) Menu do celular: abre/fecha ao tocar no botão "hambúrguer"
const botaoMenu = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu');

if (botaoMenu && menu) {
  botaoMenu.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberto');
    botaoMenu.setAttribute('aria-expanded', aberto);
    botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });

  // Fecha o menu depois de clicar em um link
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('aberto');
      botaoMenu.setAttribute('aria-expanded', 'false');
    });
  });
}

// 2) Fotos ampliadas (lightbox) na seção "Trabalhos realizados"
const lightbox = document.getElementById('lightbox');

if (lightbox) {
  const lbImg = lightbox.querySelector('img');
  const lbLegenda = lightbox.querySelector('figcaption');
  let grupoAtual = [];
  let indiceAtual = 0;

  const mostrarFoto = (indice) => {
    indiceAtual = (indice + grupoAtual.length) % grupoAtual.length;
    const figura = grupoAtual[indiceAtual];
    const img = figura.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbLegenda.textContent = figura.querySelector('figcaption').textContent;
  };

  const abrirLightbox = (figura) => {
    // Navega somente entre as fotos do mesmo grupo (Obras ou Regularizações)
    grupoAtual = Array.from(figura.parentElement.querySelectorAll('figure'));
    mostrarFoto(grupoAtual.indexOf(figura));
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const fecharLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.gallery figure').forEach((figura) => {
    figura.tabIndex = 0;
    figura.addEventListener('click', () => abrirLightbox(figura));
    figura.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') abrirLightbox(figura);
    });
  });

  lightbox.querySelector('.lightbox__close').addEventListener('click', fecharLightbox);
  lightbox.querySelector('.lightbox__prev').addEventListener('click', () => mostrarFoto(indiceAtual - 1));
  lightbox.querySelector('.lightbox__next').addEventListener('click', () => mostrarFoto(indiceAtual + 1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) fecharLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') fecharLightbox();
    if (e.key === 'ArrowLeft') mostrarFoto(indiceAtual - 1);
    if (e.key === 'ArrowRight') mostrarFoto(indiceAtual + 1);
  });
}

// 3) Animações sutis ao aparecer na tela (ícones dos serviços e passos)
//    Não roda se a pessoa desativou animações no computador.
const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animados = document.querySelectorAll('.anima-icone, .anima-passo');

if (!semAnimacao && 'IntersectionObserver' in window && animados.length) {
  // Cada traço do ícone passa a ter "comprimento 1", para ser desenhado do zero
  document.querySelectorAll('.anima-icone svg *').forEach((forma) => forma.setAttribute('pathLength', '1'));

  // Pequeno atraso em sequência para os itens que aparecem juntos
  animados.forEach((el) => {
    const irmaos = Array.from(el.parentElement.children);
    const porLinha = el.classList.contains('anima-passo') ? 4 : 3;
    el.style.setProperty('--atraso', `${(irmaos.indexOf(el) % porLinha) * 0.12}s`);
  });

  document.documentElement.classList.add('anima');

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target); // anima só uma vez
      }
    });
  }, { threshold: 0.25 });

  animados.forEach((el) => observador.observe(el));
}

// 4) Ano atual no rodapé
const ano = document.getElementById('ano');
if (ano) ano.textContent = new Date().getFullYear();
