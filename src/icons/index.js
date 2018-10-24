import loading from './loading.svg';
import playBig from './play-big.svg';
import play from './play.svg';
import pause from './pause.svg';
import volume from './volume.svg';
import volumeClose from './volume-close.svg';

const icons = {
  loading,
  playBig,
  play,
  pause,
  volume,
  volumeClose
};

function creatDomFromSvg(map) {
  const result = {};
  Object.keys(map).forEach(name => {
    const tmp = document.createElement('div');
    tmp.innerHTML = `<i class="art-icon art-icon-${name}">${map[name]}</i>`;
    [result[name]] = tmp.childNodes;
  });
  return result;
}

export default creatDomFromSvg(icons);