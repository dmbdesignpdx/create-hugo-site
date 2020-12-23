'use strict';

const fs = require('fs');
const fsp = fs.promises;
const { _, completed } = require('../helpers');

const browser = `<?xml version='1.0' encoding='utf-8'?>\n<browserconfig>\n\t<msapplication>\n\t\t<tile>\n\t\t\t<square150x150logo src='{{ .Site.Params.bconfig.s150 | absURL }}'/>\n\t\t\t<square310x310logo src='{{ .Site.Params.bconfig.s310 | absURL }}'/>\n\t\t\t<wide310x150logo src='{{ .Site.Params.bconfig.w310 | absURL }}'/>\n\t\t\t<TileColor>{{ .Site.Params.theme }}</TileColor>\n\t\t</tile>\n\t</msapplication>\n</browserconfig>\n`;

const manifest = `{\n\t"name": "{{ .Site.Title }}",\n\t"short_name": "{{ .Site.Title }}",\n\t"icons": [\n\t\t{\n\t\t\t"src": "{{ .Site.Params.manfiest.s192 | absURL }}",\n\t\t\t"sizes": "192x192",\n\t\t\t"type": "image/png"\n\t},\n\t{\n\t\t\t"src": "{{ .Site.Params.manfiest.s256 | absURL }}",\n\t\t\t"sizes": "256x256",\n\t\t\t"type": "image/png"\n\t\t}\n\t],\n\t"theme_color": "{{ .Site.Params.theme }}",\n\t"background_color": "{{ .Site.Params.theme }}",\n\t"display": "standalone",\n\t"orientation": "portrait"\n}`;

const author = `const AUTHOR =\n\tdocument.createComment('Designed and developed by Daniel Blake ( danielblake.design )');\n\ndocument.documentElement.insertBefore(AUTHOR, document.head);\n`;

const lazy = `import {\n\tIO,\n\tIOE,\n\tIOC,\n\tIOI,\n} from './types';\n\n\nconst onLoad = (target: Element): void => {\n\tconst prefetch = <HTMLAnchorElement>target.querySelector('.lazy-prefetch');\n\tconst image = <HTMLImageElement>target.querySelector('img');\n\tconst sources =\n\t\t<Array<HTMLSourceElement>>[...target.querySelectorAll('source')];\n\n\tif (image.src === '') {\n\t\timage.setAttribute('src', image.dataset.src as string);\n\n\t\tsources.forEach(source => {\n\t\t\tsource.setAttribute('srcset', source.dataset.srcset as string);\n\t\t});\n\t}\n\n\tif (prefetch) {\n\t\tconst link = document.createElement('link');\n\n\t\tlink.setAttribute('rel', 'prefetch');\n\t\tlink.setAttribute('href', prefetch.href);\n\t\tlink.setAttribute('as', 'document');\n  \n\t\tdocument.head.appendChild(link);\n\t};\n};\n\nconst onPlay = (target: Element, observer: IO): void => {\n\ttarget.classList.add('lazy-play');\n\tobserver.unobserve(target);\n};\n\nconst lazy = (): void => {\n\tconst settings: IOI = {\n\t\tthreshold: [0, 0.7], \n\t\trootMargin: '200px',\n\t};\n\tconst collection =\n\t\t<Array<HTMLElement>>[...document.querySelectorAll('.lazy-load')];\n\n\tlet observer: IO;\n\n\tif ('IntersectionObserver' in window) {\n\t\tconst callback: IOC = (entries: Array<IOE>) => {\n\t\t\tconst [load, play] = settings.threshold as Array<number>;\n\n\t\t\tfor (const { target, intersectionRatio } of entries) {\n\t\t\t\tif (intersectionRatio > load) onLoad(target);\n\n\t\t\t\tif (intersectionRatio > play) {\n\t\t\t\t\trequestAnimationFrame((): void => onPlay(target, observer));\n\t\t\t\t}\n\t\t\t}\n\t\t};\n\n\t\tobserver = new IntersectionObserver(callback, settings);\n\n\t\tcollection.forEach((item: Element): void => {\n\t\t\titem.classList.add('lazy-animate');\n\t\t\tobserver.observe(item);\n\t\t});\n\t} else {\n\t\tcollection.forEach(target => {\n\t\t\tonLoad(target);\n\t\t});\n\t};\n};\n\nexport default lazy;\n`;

const main = `import 'author';\nimport 'lazy';\nimport 'nav';\n\nconst reduce: boolean = matchMedia('(prefers-reduced-motion)').matches;\n\nif (!reduce) {\n\t// Flashy animations\n}\n`

const nav = `import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';\n\nimport { state } from 'state';\n\n\nconst NAV = <HTMLElement>document.getElementById('nav');\nconst OPEN = <HTMLButtonElement>document.querySelector('.--open');\nconst CLOSE = <HTMLButtonElement>document.querySelector('.--close');\nconst MENU = <HTMLDivElement>document.querySelector('.nav-Menu');\nconst LINKS = <Array<HTMLAnchorElement>>[...MENU.querySelectorAll('a')];\n\nconst toggleNav = (): void => {\n\tconst updatedY = pageYOffset;\n\tconst navShowing = !NAV.classList.contains('__hide');\n\n\tif (updatedY > 10) {\n\t\tNAV.classList.add('__shadow');\n\n\t\tif (updatedY > state.currentY && navShowing) {\n\t\t\tNAV.classList.add('__hide');\n\t\t}\n\n\t\tif (updatedY < state.currentY && !navShowing) {\n\t\t\tNAV.classList.remove('__hide');\n\t\t}\n\n\t} else {\n\t\tNAV.classList.remove('__shadow');\n\t}\n\n\tstate.currentY = updatedY;\n};\n\nconst toggleMenu = ({ currentTarget }: Event): void => {\n\tconst open = currentTarget === OPEN;\n\n\tMENU.classList.toggle('__open');\n\n\tLINKS.forEach(LINK => {\n\t\tLINK.addEventListener('click', toggleMenu);\n\t});\n\n\tif (open) {\n\t\tCLOSE.addEventListener('click', toggleMenu);\n\t\tdisableBodyScroll(NAV);\n\t} else enableBodyScroll(NAV);\n};\n\nOPEN.addEventListener('click', toggleMenu);\naddEventListener('scroll', (): void => {\n\trequestAnimationFrame(toggleNav);\n}, { passive: true });\n`;

const state = `type State = {\n\tcurrentY: number;\n\tavailHeight: number;\n};\n\nexport const state: State = {\n\tcurrentY: pageYOffset,\n\tavailHeight: 0,\n};\n`;

const mainStyles = `@import\n'base/variables',\n'base/mixins',\n'base/extends',\n'base/main-base'\n;`;

const writeScripts = async dir => {
  await fsp.writeFile(`${dir}/author.ts`, author);
  await fsp.writeFile(`${dir}/lazy.ts`, lazy);
  await fsp.writeFile(`${dir}/main.ts`, main);
  await fsp.writeFile(`${dir}/nav.ts`, nav);
  await fsp.writeFile(`${dir}/state.ts`, state);
};

const writeStatic = async dir => {
  await fsp.writeFile(`${dir}/browserconfig.xml`, browser);
  await fsp.writeFile(`${dir}/manifest.json`, manifest);
};

const writeStyles = async dir => {
  await fsp.writeFile(`${dir}/main.scss`, mainStyles);
};

const assetFiles = dir => {
  fs.mkdir(`${dir}/assets`, _(() => {
    fs.mkdirSync(`${dir}/assets/scripts`);
    fs.mkdirSync(`${dir}/assets/static`);
    fs.mkdirSync(`${dir}/assets/styles`);
    
    writeScripts(`${dir}/assets/scripts`);
    writeStatic(`${dir}/assets/static`);
    writeStyles(`${dir}/assets/styles`)

    completed('Asset files');
  }));
}

module.exports = assetFiles;
