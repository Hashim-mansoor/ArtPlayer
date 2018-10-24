import { append, setStyle } from './utils';

let id = 0;
export default class Contextmenu {
  constructor(art) {
    this.art = art;
    this.init();
  }

  init() {
    const {
      option,
      i18n,
      refs,
      events: { proxy }
    } = this.art;

    option.contextmenu.push(
      {
        name: 'info',
        html: i18n.get('Video info'),
        click: () => {
          this.art.info.show();
        }
      },
      {
        name: 'version',
        html: '<a href="https://github.com/zhw2590582/artplayer" target="_blank">ArtPlayer __VERSION__</a>'
      },
      {
        name: 'close',
        html: i18n.get('Close'),
        click: () => {
          this.hide();
        }
      }
    );

    proxy(refs.$player, 'contextmenu', event => {
      event.preventDefault();
      this.art.isFocus = true;
      if (!refs.$contextmenu) {
        this.creatMenu();
      }
      this.show();
      this.setPos(event);
    });

    proxy(refs.$player, 'click', event => {
      if (refs.$contextmenu && !event.path.includes(refs.$contextmenu)) {
        this.hide();
      }
    });
  }

  creatMenu() {
    const {
      option,
      refs,
      events: { proxy }
    } = this.art;
    refs.$contextmenu = document.createElement('div');
    refs.$contextmenu.classList.add('artplayer-contextmenu');
    option.contextmenu.forEach(item => {
      id++;
      const $menu = document.createElement('div');
      $menu.setAttribute('data-art-menu-id', id);
      $menu.setAttribute('class', `art-menu art-menu-${item.name || id}`);
      append($menu, item.html);
      setStyle($menu, item.style || {});
      if (item.click) {
        proxy($menu, 'click', event => {
          event.preventDefault();
          item.click(this.art, event);
          this.hide();
          this.art.emit('contextmenu:click', $menu);
        });
      }
      append(refs.$contextmenu, $menu);
    });
    append(refs.$player, refs.$contextmenu);
  }

  setPos(event) {
    const { refs } = this.art;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const { height: cHeight, width: cWidth, left: cLeft, top: cTop } = refs.$player.getBoundingClientRect();
    const { height: mHeight, width: mWidth } = refs.$contextmenu.getBoundingClientRect();
    let menuLeft = mouseX - cLeft;
    let menuTop = mouseY - cTop;

    if (mouseX + mWidth > cLeft + cWidth) {
      menuLeft = cWidth - mWidth;
    }

    if (mouseY + mHeight > cTop + cHeight) {
      menuTop = cHeight - mHeight;
    }

    refs.$contextmenu.style.left = `${menuLeft}px`;
    refs.$contextmenu.style.top = `${menuTop}px`;
  }

  hide() {
    const { refs: { $contextmenu } } = this.art;
    if ($contextmenu) {
      $contextmenu.style.display = 'none';
      this.art.emit('contextmenu:hide', $contextmenu);
    }
  }

  show() {
    const { refs: { $contextmenu } } = this.art;
    if ($contextmenu) {
      $contextmenu.style.display = 'block';
      this.art.emit('contextmenu:show', $contextmenu);
    }
  }
}