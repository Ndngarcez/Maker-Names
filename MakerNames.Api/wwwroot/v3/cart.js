(() => {
  'use strict';
  const key = 'makernames.cart.v1';
  const status = document.getElementById('cartStatus') || document.getElementById('saveStatus');
  const tell = text => { if (status) { status.textContent = text; status.setAttribute('role', 'status'); } };
  function read() {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(value) || value.some(x => !x || typeof x.id !== 'string' || !x.project || !Number.isInteger(x.quantity) || x.quantity < 1 || x.quantity > 99)) throw new Error('Carrinho inválido');
    return value;
  }
  function save(items) { localStorage.setItem(key, JSON.stringify(items)); render(); }
  function render() {
    try {
      const items = read();
      document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = `(${items.reduce((n, x) => n + x.quantity, 0)})`);
      const list = document.getElementById('cartItems');
      if (!list) return;
      list.replaceChildren();
      if (!items.length) { list.textContent = 'O teu carrinho está vazio. Cria o teu primeiro desenho no editor.'; return; }
      for (const item of items) {
        const row = document.createElement('article'); row.className = 'cart-item';
        const title = document.createElement('h2'); title.textContent = item.title;
        const detail = document.createElement('p');
        detail.textContent = `Desenho personalizado · Fonte: ${item.project.fontName || 'Personalizada'} · Preço a confirmar`;
        const label = document.createElement('label'); label.textContent = 'Quantidade ';
        const quantity = document.createElement('input'); quantity.type = 'number'; quantity.min = '1'; quantity.max = '99'; quantity.value = item.quantity;
        quantity.addEventListener('change', () => {
          const count = Number(quantity.value);
          if (!Number.isInteger(count) || count < 1 || count > 99) { quantity.value = item.quantity; tell('Escolhe uma quantidade entre 1 e 99.'); return; }
          try { const current = read(); const target = current.find(x => x.id === item.id); if (target) target.quantity = count; save(current); tell('Quantidade atualizada.'); } catch { tell('Não foi possível guardar a quantidade.'); }
        });
        label.append(quantity);
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'btn ghost'; remove.textContent = 'Remover';
        remove.addEventListener('click', () => { try { save(read().filter(x => x.id !== item.id)); tell('Artigo removido.'); } catch { tell('Não foi possível remover o artigo.'); } });
        row.append(title, detail, label, remove); list.append(row);
      }
    } catch { tell('Não foi possível ler o carrinho guardado neste navegador. Verifica se o armazenamento local está disponível.'); }
  }
  document.getElementById('addToCart')?.addEventListener('click', () => {
    try {
      if (!nameInput.value.trim() && !placedNames.length && !importedObjects.length) { tell('Escreve um nome ou adiciona um desenho antes de o colocar no carrinho.'); nameInput.focus(); return; }
      const project = JSON.parse(JSON.stringify(buildProject({ showBaseLine: false })));
      const items = read();
      if (items.length >= 30) { tell('O carrinho tem 30 desenhos. Remove um artigo antes de adicionar outro.'); return; }
      items.push({ id: crypto.randomUUID(), title: nameInput.value.trim() || 'Desenho personalizado', project, quantity: 1, addedAt: new Date().toISOString() });
      save(items); tell('Desenho adicionado ao carrinho. Podes continuar a personalizar ou abrir o carrinho.');
    } catch { tell('Não foi possível guardar o desenho. O armazenamento do navegador pode estar cheio ou bloqueado.'); }
  });
  window.addEventListener('storage', event => { if (event.key === key) render(); });
  render();
})();
