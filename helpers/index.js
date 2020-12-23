const _ = f => e => { if (e) throw e; f() };

const _e = `\x1b[31merror\x1b[0m    `;
const _s = `\x1b[32msuccess\x1b[0m  `;
const _w = `\x1b[33mwarn\x1b[0m     `;
const _i = `\x1b[34minfo\x1b[0m     `;
const _d = `\x1b[34mdone\x1b[0m     `;

const completed = thing => {
  process.stdout.write(`\n${_s} ${thing} complete.`);
}

module.exports = { _, _e, _s, _w, _i, _d, completed };
